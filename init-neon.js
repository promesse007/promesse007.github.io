/*mise en place de la mémoire du site : table des souvenirs (Neon Lakebase Postgres) */
const fs = require('fs');
const url = (fs.readFileSync(__dirname + '/.env', 'utf8').match(/DATABASE_URL=(.*)/) || [])[1];
if (!url) { console.error('DATABASE_URL absent de .env'); process.exit(1); }
const { neon } = require('@neondatabase/serverless');
const db = neon(url);

(async () => {
  await db`
    create table if not exists souvenirs (
      id uuid primary key default gen_random_uuid(),
      cree_le timestamptz not null default now(),
      auteur text not null default 'Invité',
      type text not null default 'photo',
      photo_url text,
      legende text,
      moment text,
      date_prise date,
      statut text not null default 'attente',
      modere_le timestamptz
    )`;
  await db`create index if not exists idx_souvenirs_statut on souvenirs (statut, cree_le)`;

  const ins = await db`
    insert into souvenirs (auteur, legende, moment, date_prise)
    values ('Test-Technique', 'Souvenir de démonstration', 'La dot — jeudi 10 décembre 2026 (Kintélé)', '2026-12-10')
    returning id`;
  const lit = await db`select auteur, legende, statut from souvenirs where id = ${ins[0].id}`;
  console.log('ECRIT:', ins.length, '| LU:', lit[0].legende, '|', lit[0].statut);

  await db`delete from souvenirs where id = ${ins[0].id}`;
  const fin = await db`select count(*)::int as n from souvenirs`;
  console.log('Nettoyé ✓ — la table souvenirs fonctionne. Reste :', fin[0].n, 'ligne(s).');
})().catch(e => { console.error('ERREUR:', e.message); process.exit(1); });
