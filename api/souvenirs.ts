// ============================================================
// api/souvenirs.ts — API des souvenirs du mariage
// Bosseno Josiane & Olakiba Armand
//
// Déployée comme Neon Function « souvenirs » (branche production).
// • POST /souvenirs                  — un invité dépose son souvenir
//   (photo obligatoirement en attente : jamais publique d'emblée)
// • GET  /souvenirs                  — lecture publique : PUBLIÉS uniquement
// • GET  /photo/:id                  — les octets de la photo
//   (publie = public ; attente = administrateur seulement)
// • GET  /admin/souvenirs            — tout, y compris « attente » (admin)
// • POST /admin/souvenirs/:id/publier — modération
// • POST /admin/souvenirs/:id/refuser — modération (supprime le souvenir)
//
// L'administrateur s'authentifie avec l'en-tête X-Admin-Cle
// (la clé ADMIN_SECRET — jamais écrite dans le site public).
// Les photos sont gardées DANS la base (bytea) pour le premier jet ;
// l'Object Storage Neon pourra les reprendre plus tard sans rien refaire.
// ============================================================
import { Hono } from "hono";
import { attachDatabasePool } from "@neon/functions";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
attachDatabasePool(pool);

const CLE_ADMIN = process.env.ADMIN_SECRET || "";

const TAILLE_MAX = 8 * 1024 * 1024;          // 8 Mo par photo
const MIME_OK = new Set(["image/jpeg", "image/png", "image/webp"]);

/* ---------- CORS : le site peut être servi de plusieurs domaines ---------- */
function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Cle",
    "Access-Control-Max-Age": "86400",
  };
}

const app = new Hono();

app.use("*", async (c, next) => {
  if (c.req.method === "OPTIONS") {
    return c.body(null, 204, cors());
  }
  await next();
  c.header("Access-Control-Allow-Origin", "*");
});

/* ------------- vérification de l'administrateur ------------- */
function estAdmin(c: any): boolean {
  return Boolean(CLE_ADMIN) && c.req.header("X-Admin-Cle") === CLE_ADMIN;
}

/* ============ POST /souvenirs — dépôt d'un invité ============ */
app.post("/souvenirs", async (c) => {
  const taille = Number(c.req.raw.headers.get("content-length") || "0");
  if (taille > TAILLE_MAX + 4096) {
    return c.json({ erreur: "Photo trop volumineuse (maximum 8 Mo)." }, 413);
  }

  let formulaire: Record<string, any>;
  try {
    formulaire = await c.req.parseBody();
  } catch {
    return c.json({ erreur: "Formulaire illisible." }, 400);
  }

  const auteur = String(formulaire.auteur || "Invité").trim().slice(0, 60) || "Invité";
  const legende = String(formulaire.legende || "").trim().slice(0, 240);
  const moment  = String(formulaire.moment || "").trim().slice(0, 120);
  const datePrise = String(formulaire.date_prise || "").trim().slice(0, 10);
  if (datePrise && !/^\d{4}-\d{2}-\d{2}$/.test(datePrise)) {
    return c.json({ erreur: "Date invalide (format attendu : année-mois-jour)." }, 400);
  }

  const fichier = formulaire.photo;
  let type: "photo" | "texte" = "texte";
  let photoDonnees: Buffer | null = null;
  let photoType: string | null = null;

  if (fichier && typeof fichier === "object" && "arrayBuffer" in fichier) {
    type = "photo";
    const mime = String((fichier as any).type || "").toLowerCase();
    if (!MIME_OK.has(mime)) {
      return c.json({ erreur: "Format accepté : JPEG, PNG ou WebP." }, 415);
    }
    const octets = Buffer.from(await (fichier as any).arrayBuffer());
    if (octets.length === 0) {
      return c.json({ erreur: "Fichier photo vide." }, 400);
    }
    if (octets.length > TAILLE_MAX) {
      return c.json({ erreur: "Photo trop volumineuse (maximum 8 Mo)." }, 413);
    }
    photoDonnees = octets;
    photoType = mime === "image/jpg" ? "image/jpeg" : mime;
  }

  if (!photoDonnees && !legende) {
    return c.json({ erreur: "Joignez une photo ou écrivez une légende." }, 400);
  }

  const r = await pool.query(
    `insert into souvenirs (auteur, type, photo_donnees, photo_type, legende, moment, date_prise)
     values ($1, $2, $3, $4, $5, $6, $7)
     returning id, cree_le`,
    [auteur, type, photoDonnees, photoType, legende, moment, datePrise || null]
  );

  return c.json(
    { ok: true, id: r.rows[0].id, statut: "attente",
      message: "Merci ! Votre souvenir arrivera sur le site dès que les mariés l'auront accepté." },
    201
  );
});

/* ============ GET /souvenirs — les PUBLIÉS, pour tout le monde ============ */
app.get("/souvenirs", async (c) => {
  const r = await pool.query(
    `select id, auteur, type, legende, moment,
            to_char(date_prise, 'YYYY-MM-DD') as date_prise,
            cree_le
       from souvenirs
      where statut = 'publie'
      order by cree_le desc`
  );
  return c.json(r.rows.map((s: any) => ({
    id: s.id,
    auteur: s.auteur,
    type: s.type,
    legende: s.legende || "",
    moment: s.moment || "",
    date_prise: s.date_prise || "",
    cree_le: s.cree_le,
    photo_url: s.type === "photo" ? "/photo/" + s.id : null,
  })));
});

/* ============ GET /photo/:id — les octets de la photo ============ */
app.get("/photo/:id", async (c) => {
  if (!/^[0-9a-f-]{36}$/i.test(c.req.param("id"))) {
    return c.text("Identifiant invalide.", 400);
  }
  const r = await pool.query(
    `select photo_donnees, photo_type, statut from souvenirs where id = $1`,
    [c.req.param("id")]
  );
  if (!r.rows.length) return c.text("Souvenir introuvable.", 404);
  const s = r.rows[0];
  if (s.statut !== "publie" && !estAdmin(c)) {
    return c.text("Souvenir en attente de modération.", 403);
  }
  if (!s.photo_donnees) return c.text("Pas de photo pour ce souvenir.", 404);
  const octets = s.photo_donnees as Buffer;
  const entetes = cors();
  entetes["Content-Type"] = s.photo_type || "image/jpeg";
  entetes["Cache-Control"] =
    s.statut === "publie" ? "public, max-age=3600" : "no-store";
  return c.body(new Uint8Array(octets), 200, entetes);
});

/* ============ Zone administrateur ============ */
function gardeAdmin(c: any, suite: () => any) {
  if (!estAdmin(c)) return c.text("Accès refusé (clé d'administration absente ou fausse).", 401);
  return suite();
}

app.get("/admin/souvenirs", async (c) =>
  gardeAdmin(c, async () => {
    const r = await pool.query(
      `select id, auteur, type, legende, moment, statut,
              to_char(date_prise, 'YYYY-MM-DD') as date_prise,
              cree_le, modere_le,
              (photo_donnees is not null and statut = 'attente') as apercu_attente
         from souvenirs
        order by case statut when 'attente' then 0 else 1 end, cree_le desc`
    );
    return c.json(r.rows.map((s: any) => ({
      id: s.id,
      auteur: s.auteur,
      type: s.type,
      legende: s.legende || "",
      moment: s.moment || "",
      date_prise: s.date_prise || "",
      statut: s.statut,
      cree_le: s.cree_le,
      modere_le: s.modere_le,
      apercu: s.apercu_attente ? "/photo/" + s.id : null,
    })));
  })
);

app.post("/admin/souvenirs/:id/publier", async (c) =>
  gardeAdmin(c, async () => {
    const r = await pool.query(
      `update souvenirs set statut = 'publie', modere_le = now()
        where id = $1 and photo_donnees is not null returning id`,
      [c.req.param("id")]
    );
    if (!r.rows.length) return c.text("Souvenir introuvable (ou déjà lu).", 404);
    return c.json({ ok: true, statut: "publie" });
  })
);

app.post("/admin/souvenirs/:id/refuser", async (c) =>
  gardeAdmin(c, async () => {
    await pool.query(`delete from souvenirs where id = $1`, [c.req.param("id")]);
    return c.json({ ok: true, statut: "refuse" });
  })
);

/* ============ Santé ============ */
app.get("/", (c) => c.text("API des souvenirs — Bosseno Josiane & Olakiba Armand ♥"));

export default app;
