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
// • GET  /contenu                    — configuration publique du site
// • GET/PUT /admin/contenu           — lecture et enregistrement en ligne (admin)
// • POST /admin/media                — téléversement d'une photo du site (admin)
// • GET  /media/:id                  — image publique gérée dans l'admin
// • GET  /admin/confirmations         — réponses et enfants des mariés (admin)
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
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Cle",
    "Access-Control-Max-Age": "86400",
  };
}

const app = new Hono();

const MAX_CONTENU = 3 * 1024 * 1024;
const MAX_MEDIA = 8 * 1024 * 1024;
const MEDIA_MIME_OK = new Set(["image/jpeg", "image/png", "image/webp"]);

function uuidValide(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

/* Liste les médias réellement référencés dans le contenu (source de vérité). */
function collecterMediaIds(noeud: unknown, vus: Set<string>): void {
  if (typeof noeud === "string") {
    const m = noeud.match(/\/media\/([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/i);
    if (m) vus.add(m[1]);
  } else if (Array.isArray(noeud)) {
    noeud.forEach((x) => collecterMediaIds(x, vus));
  } else if (noeud && typeof noeud === "object") {
    for (const valeur of Object.values(noeud as Record<string, unknown>)) {
      collecterMediaIds(valeur, vus);
    }
  }
}

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
        where id = $1 and (type = 'texte' or photo_donnees is not null) returning id`,
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

/* ============ Historique privé et enfants des mariés ============ */
app.get("/admin/confirmations", async (c) =>
  gardeAdmin(c, async () => {
    const [reponses, enfants] = await Promise.all([
      pool.query(
        `select id, nom, telephone, cote, presence, adultes, enfants, cree_le
           from confirmations_presence order by cree_le desc`
      ),
      pool.query(`select id, nom, cote, age, cree_le from enfants_maries order by cote, cree_le`),
    ]);
    return c.json({ reponses: reponses.rows, enfants_maries: enfants.rows }, 200, { "Cache-Control": "no-store" });
  })
);

app.delete("/admin/confirmations/:id", async (c) =>
  gardeAdmin(c, async () => {
    const id = c.req.param("id");
    if (!uuidValide(id)) return c.json({ erreur: "Identifiant invalide." }, 400);
    const r = await pool.query(`delete from confirmations_presence where id = $1 returning id`, [id]);
    if (!r.rows.length) return c.json({ erreur: "Réponse introuvable." }, 404);
    return c.json({ ok: true });
  })
);

app.post("/admin/enfants-maries", async (c) =>
  gardeAdmin(c, async () => {
    let entree: any;
    try { entree = await c.req.json(); }
    catch { return c.json({ erreur: "Données illisibles." }, 400); }
    const nom = String(entree?.nom || "").trim().slice(0, 60);
    const cote = String(entree?.cote || "");
    const age = entree?.age === null || entree?.age === "" || entree?.age === undefined ? null : Number(entree.age);
    if (!nom) return c.json({ erreur: "Indiquez le prénom de l'enfant." }, 400);
    if (cote !== "josiane" && cote !== "armand") return c.json({ erreur: "Choisissez Josiane ou Armand." }, 400);
    if (age !== null && (!Number.isInteger(age) || age < 0 || age > 30)) return c.json({ erreur: "Âge invalide." }, 400);
    const r = await pool.query(
      `insert into enfants_maries (nom, cote, age) values ($1, $2, $3) returning id, nom, cote, age, cree_le`,
      [nom, cote, age]
    );
    return c.json({ ok: true, enfant: r.rows[0] }, 201);
  })
);

app.delete("/admin/enfants-maries/:id", async (c) =>
  gardeAdmin(c, async () => {
    const id = c.req.param("id");
    if (!uuidValide(id)) return c.json({ erreur: "Identifiant invalide." }, 400);
    const r = await pool.query(`delete from enfants_maries where id = $1 returning id`, [id]);
    if (!r.rows.length) return c.json({ erreur: "Enfant introuvable." }, 404);
    return c.json({ ok: true });
  })
);

/* ============ Contenu éditorial en ligne ============ */
app.get("/contenu", async (c) => {
  const r = await pool.query(`select payload from site_content where singleton = true`);
  if (!r.rows.length) return c.json(null);
  const publicPayload = { ...r.rows[0].payload };
  // La liste d'invités ne sort jamais de la route protégée.
  delete publicPayload.invites;
  return c.json(publicPayload, 200, { "Cache-Control": "no-store" });
});

app.get("/admin/contenu", async (c) =>
  gardeAdmin(c, async () => {
    const r = await pool.query(`select payload, updated_at from site_content where singleton = true`);
    return c.json(r.rows[0] || { payload: null, updated_at: null });
  })
);

app.put("/admin/contenu", async (c) =>
  gardeAdmin(c, async () => {
    const taille = Number(c.req.raw.headers.get("content-length") || "0");
    if (taille > MAX_CONTENU) return c.json({ erreur: "Le contenu dépasse la taille autorisée." }, 413);

    let entree: any;
    try {
      entree = await c.req.json();
    } catch {
      return c.json({ erreur: "Données illisibles." }, 400);
    }
    const payload = entree && entree.payload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return c.json({ erreur: "Configuration du site invalide." }, 400);
    }
    // La liste d'invités reste privée (localStorage) : jamais enregistrée ici.
    delete payload.invites;
    if (Buffer.byteLength(JSON.stringify(payload), "utf8") > MAX_CONTENU) {
      return c.json({ erreur: "Le contenu dépasse la taille autorisée." }, 413);
    }
    const vusMedias = new Set<string>();
    collecterMediaIds(payload, vusMedias);
    const assets: string[] = Array.from(vusMedias);
    if (assets.length > 500) return c.json({ erreur: "Trop de photos dans la configuration." }, 400);
    payload.assets = assets;

    const actuel = await pool.query(`select payload from site_content where singleton = true`);
    const anciens: string[] = Array.isArray(actuel.rows[0]?.payload?.assets)
      ? actuel.rows[0].payload.assets.filter((id: any) => typeof id === "string" && uuidValide(id))
      : [];

    await pool.query(
      `insert into site_content (singleton, payload, updated_at)
       values (true, $1::jsonb, now())
       on conflict (singleton) do update set payload = excluded.payload, updated_at = now()`,
      [JSON.stringify(payload)]
    );

    const supprimes = anciens.filter((id) => !assets.includes(id));
    if (supprimes.length) {
      await pool.query(`delete from site_assets where id = any($1::uuid[])`, [supprimes]);
    }
    return c.json({ ok: true, updated_at: new Date().toISOString(), photos_supprimees: supprimes.length });
  })
);

/* ============ Photos ajoutées dans l'administration ============ */
app.post("/admin/media", async (c) =>
  gardeAdmin(c, async () => {
    let formulaire: Record<string, any>;
    try {
      formulaire = await c.req.parseBody();
    } catch {
      return c.json({ erreur: "Fichier illisible." }, 400);
    }
    const fichier = formulaire.fichier;
    if (!fichier || typeof fichier !== "object" || !("arrayBuffer" in fichier)) {
      return c.json({ erreur: "Choisissez une image à envoyer." }, 400);
    }
    const mime = String((fichier as any).type || "").toLowerCase();
    if (!MEDIA_MIME_OK.has(mime)) return c.json({ erreur: "Format accepté : JPEG, PNG ou WebP." }, 415);
    const donnees = Buffer.from(await (fichier as any).arrayBuffer());
    if (!donnees.length) return c.json({ erreur: "Le fichier est vide." }, 400);
    if (donnees.length > MAX_MEDIA) return c.json({ erreur: "Image trop volumineuse (8 Mo maximum)." }, 413);
    const nom = String(formulaire.nom || "photo.jpg").replace(/[^a-z0-9._-]/gi, "_").slice(0, 120) || "photo.jpg";
    const r = await pool.query(
      `insert into site_assets (file_name, mime_type, file_data) values ($1, $2, $3) returning id`,
      [nom, mime, donnees]
    );
    return c.json({ ok: true, id: r.rows[0].id }, 201);
  })
);

app.get("/media/:id", async (c) => {
  const id = c.req.param("id");
  if (!uuidValide(id)) return c.text("Identifiant invalide.", 400);
  const r = await pool.query(`select mime_type, file_data from site_assets where id = $1`, [id]);
  if (!r.rows.length) return c.text("Photo introuvable.", 404);
  return c.body(new Uint8Array(r.rows[0].file_data), 200, {
    ...cors(),
    "Content-Type": r.rows[0].mime_type,
    "Cache-Control": "public, max-age=3600, immutable",
    "X-Content-Type-Options": "nosniff",
  });
});

/* ============ Santé ============ */
app.get("/", (c) => c.text("API des souvenirs — Bosseno Josiane & Olakiba Armand ♥"));

export default app;
