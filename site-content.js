/* Chargement et sauvegarde sécurisés du contenu public dans Neon. */
(function () {
  'use strict';

  var API = 'https://br-falling-lab-b9lsl3j6-souvenirs.compute.c-7.eu-central-1.aws.neon.tech';
  var OPTIONS = { cache: 'no-store' };

  function appliquer(payload) {
    if (!payload || typeof payload !== 'object') return;
    if (Array.isArray(payload.categories)) window.CATEGORIES = payload.categories;
    if (payload.settings && typeof payload.settings === 'object') window.REGLAGES = payload.settings;
    if (Array.isArray(payload.history)) window.HISTOIRE = payload.history;
    if (Array.isArray(payload.photos)) window.PHOTOS = payload.photos;
    if (Array.isArray(payload.family)) window.FAMILLE = payload.family;
    if (payload.book && typeof payload.book === 'object') window.LIVRE = payload.book;
    if (payload.theme && typeof payload.theme === 'object') {
      /* Thème partagé : garder la même harmonie que dans l'administration.
         On passe par les clés localStorage déjà comprises par script.js. */
      var t = payload.theme;
      if (typeof t.principale === 'string' && t.principale &&
          typeof t.accent === 'string' && t.accent) {
        try {
          localStorage.setItem('theme-couleur', 'perso');
          localStorage.setItem('theme-perso', JSON.stringify({ p: t.principale, a: t.accent }));
          localStorage.setItem('theme-etendu', JSON.stringify({
            fond: t.fond || '', surface: t.surface || '', texte: t.texte || '', doux: t.doux || ''
          }));
        } catch (e) {}
      }
    }

    if (window.REGLAGES && window.REGLAGES.installationApp === true && !document.querySelector('link[rel="manifest"]')) {
      var lien = document.createElement('link');
      lien.rel = 'manifest';
      lien.href = 'manifest.webmanifest';
      document.head.appendChild(lien);
    }
  }

  function chargerPublic() {
    return fetch(API + '/contenu', OPTIONS).then(function (r) {
      if (!r.ok) throw new Error('Contenu en ligne indisponible.');
      return r.json();
    }).then(function (payload) {
      appliquer(payload);
      return payload;
    }).catch(function () { return null; });
  }

  function chargerAdmin(cle) {
    return fetch(API + '/admin/contenu', {
      cache: 'no-store',
      headers: { 'X-Admin-Cle': cle || '' }
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status === 401 ? 'Clé d’administration invalide.' : 'Chargement du contenu en ligne impossible.');
      return r.json();
    }).then(function (resultat) {
      if (resultat.payload) appliquer(resultat.payload);
      return resultat;
    });
  }

  function collecterPhotos(payload) {
    var ids = Object.create(null);
    var uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
    var motif = new RegExp('/media/(' + uuid + ')(?:$|[?#])', 'i');
    function visiter(valeur) {
      if (typeof valeur === 'string') {
        var m = valeur.match(motif);
        if (m) ids[m[1]] = true;
      } else if (Array.isArray(valeur)) {
        valeur.forEach(visiter);
      } else if (valeur && typeof valeur === 'object') {
        Object.keys(valeur).forEach(function (cle) { visiter(valeur[cle]); });
      }
    }
    visiter(payload);
    return Object.keys(ids);
  }

  function enregistrer(payload, cle) {
    var contenu = JSON.parse(JSON.stringify(payload));
    var assets = collecterPhotos(contenu);
    return fetch(API + '/admin/contenu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Cle': cle || '' },
      body: JSON.stringify({ payload: contenu, assets: assets })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (resultat) {
        if (!r.ok) throw new Error(resultat.erreur || 'Enregistrement en ligne refusé.');
        return resultat;
      });
    });
  }

  function envoyerPhoto(dataUrl, nom, cle) {
    return fetch(dataUrl).then(function (r) { return r.blob(); }).then(function (blob) {
      var formulaire = new FormData();
      formulaire.append('fichier', blob, nom || 'photo.jpg');
      formulaire.append('nom', nom || 'photo.jpg');
      return fetch(API + '/admin/media', {
        method: 'POST',
        headers: { 'X-Admin-Cle': cle || '' },
        body: formulaire
      });
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (resultat) {
        if (!r.ok) throw new Error(resultat.erreur || 'Envoi de la photo impossible.');
        return API + '/media/' + resultat.id;
      });
    });
  }

  /* La page attend cette promesse avant de démarrer ses scripts. */
  var pret = chargerPublic();

  window.SiteContent = {
    api: API,
    ready: Promise.resolve(pret),
    apply: appliquer,
    loadPublic: chargerPublic,
    loadAdmin: chargerAdmin,
    save: enregistrer,
    uploadPhoto: envoyerPhoto,
    collectMediaIds: collecterPhotos
  };
})();
