/* Migration : les photos des invités sont gardées dans la base (bytea).
   Idempotent — peut être relancé sans risque. */
const fs = require('fs');
const url = (fs.readFileSync(__dirname + '/.env', 'utf8').match(/DATABASE_URL=(.*)/) || [])[1];
if (!url) { console.error('DATABASE_URL absent de .env'); process.exit(1); }
const { neon } = require('@neondatabase/serverless');
const db = neon(url);

(async () => {
  await db`alter table souvenirs add column if not exists photo_donnees bytea`;
  await db`alter table souvenirs add column if not exists photo_type text`;
  const cols = await db`
    select column_name from information_schema.columns
     where table_name = 'souvenirs' order by ordinal_position`;
  console.log('Colonnes de la table souvenirs :', cols.map(c => c.column_name).join(', '));
  console.log('Migration photos ✓');
})().catch(e => { console.error('ERREUR:', e.message); process.exit(1); });
