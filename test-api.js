/* Test de bout en bout de l'API souvenirs déployée.
   Utilise le .env local (URL + ADMIN_SECRET). */
const fs = require('fs');
const envTxt = fs.readFileSync(__dirname + '/.env', 'utf8');
const URL = envTxt.match(/NEON_FUNCTION_SOUVENIRS_BASE_URL=(.*)/)[1].trim().replace(/^"|"$/g, '');
const CLE = envTxt.match(/ADMIN_SECRET=(.*)/)[1].trim().replace(/^"|"$/g, '');
const ok = (nom, cond, detail) => console.log((cond ? '✓' : '✗ ECHEC') + ' ' + nom + (detail ? ' — ' + detail : '')) || cond;
let toutOk = true;

(async () => {
  // 0. santé
  let r = await fetch(URL + '/');
  toutOk &= ok('Santé GET /', r.ok, (await r.text()).slice(0, 60));

  // 1. dépôt invité : photo + moment + date
  let fd = new FormData();
  fd.append('auteur', 'Test-Invité');
  fd.append('moment', 'La dot — jeudi 10 décembre 2026 (Kintélé)');
  fd.append('date_prise', '2026-12-10');
  fd.append('legende', 'Le souvenir de test (photo)');
  // vrai mini-JPEG (1x1 pixel)
  const jpeg = Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofGh0dHyQsKSgwMjA0JR8dISI1MTU1Mjj//wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A/9k=', 'base64');
  fd.append('photo', new Blob([jpeg], { type: 'image/jpeg' }), 'test.jpg');
  r = await fetch(URL + '/souvenirs', { method: 'POST', body: fd });
  let depot = await r.json();
  toutOk &= ok('Dépôt invité (photo)', r.status === 201 && depot.statut === 'attente', JSON.stringify(depot));
  const idPhoto = depot.id;

  // 1b. dépôt texte (sans photo)
  fd = new FormData();
  fd.append('auteur', 'Test-Invité 2');
  fd.append('legende', 'Mes vœux de joie');
  fd.append('moment', 'La bénédiction — samedi 12 décembre 2026');
  r = await fetch(URL + '/souvenirs', { method: 'POST', body: fd });
  let depot2 = await r.json();
  toutOk &= ok('Dépôt invité (texte)', r.status === 201 && depot2.statut === 'attente');
  const idTexte = depot2.id;

  // 2. liste publique : RIEN ne doit apparaître (tout est en attente)
  r = await fetch(URL + '/souvenirs');
  let pub = await r.json();
  toutOk &= ok('Liste publique vide avant modération', r.ok && Array.isArray(pub) && pub.length === 0, 'n=' + pub.length);

  // 3. admin sans clé → refusé
  r = await fetch(URL + '/admin/souvenirs');
  toutOk &= ok('Admin sans clé refusé', r.status === 401);

  // 3b. admin avec clé → voit les 2 en attente
  r = await fetch(URL + '/admin/souvenirs', { headers: { 'X-Admin-Cle': CLE } });
  let adm = await r.json();
  const enAttente = adm.filter(s => s.statut === 'attente');
  toutOk &= ok('Admin avec clé voit les attentes', r.ok && enAttente.length === 2, 'n=' + adm.length);

  // 4. photo en attente : publique refusée / admin autorisée
  r = await fetch(URL + '/photo/' + idPhoto);
  toutOk &= ok('Photo en attente refusée au public', r.status === 403);
  r = await fetch(URL + '/photo/' + idPhoto, { headers: { 'X-Admin-Cle': CLE } });
  const octets = Buffer.from(await r.arrayBuffer());
  toutOk &= ok('Photo en attente visible par l\'admin', r.ok && octets.length === jpeg.length, octets.length + ' octets');

  // 5. texte sans photo mais public on essaie de publier → doit marcher
  r = await fetch(URL + '/admin/souvenirs/' + idPhoto + '/publier', { method: 'POST', headers: { 'X-Admin-Cle': CLE } });
  toutOk &= ok('Publication par l\'admin', r.ok);

  // 6. maintenant la liste publique le contient
  r = await fetch(URL + '/souvenirs');
  pub = await r.json();
  const trouve = pub.find(s => s.id === idPhoto);
  toutOk &= ok('Souvenir publié visible par tous', trouve && trouve.legende === 'Le souvenir de test (photo)', pub.length + ' publié(s)');
  r = await fetch(URL + (trouve ? trouve.photo_url : '/photo/x'));
  toutOk &= ok('Photo publique servie', r.ok && (await r.arrayBuffer()).byteLength === jpeg.length);

  // 6b. refuse texte → supprimé
  r = await fetch(URL + '/admin/souvenirs/' + idTexte + '/refuser', { method: 'POST', headers: { 'X-Admin-Cle': CLE } });
  toutOk &= ok('Refus par l\'admin', r.ok);
  r = await fetch(URL + '/admin/souvenirs', { headers: { 'X-Admin-Cle': CLE } });
  adm = await r.json();
  toutOk &= ok('Souvenir refusé bien disparu', !adm.some(s => s.id === idTexte));

  // 7. CORS
  r = await fetch(URL + '/souvenirs', { method: 'OPTIONS' });
  toutOk &= ok('Pré-vol CORS', r.status === 204 && r.headers.get('access-control-allow-origin') === '*');

  // 8. nettoyage : suppression de tout le contenu de test
  r = await fetch(URL + '/admin/souvenirs', { headers: { 'X-Admin-Cle': CLE } });
  adm = await r.json();
  for (const s of adm) {
    await fetch(URL + '/admin/souvenirs/' + s.id + '/refuser', { method: 'POST', headers: { 'X-Admin-Cle': CLE } });
  }
  r = await fetch(URL + '/admin/souvenirs', { headers: { 'X-Admin-Cle': CLE } });
  adm = await r.json();
  toutOk &= ok('Nettoyage final', adm.length === 0, 'reste=' + adm.length);

  console.log(toutOk ? '\nTOUT EST PARFAIT ✓' : '\nDES ECHECS — à corriger !');
  process.exit(toutOk ? 0 : 1);
})().catch(e => { console.error('ERREUR:', e); process.exit(1); });
