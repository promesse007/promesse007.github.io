/* ==========================================================
   Souvenirs de mariage — interactions
   Olakiba Armand & Bosseno Josiane
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Raccourcis ---------- */
  var REG   = window.REGLAGES   || {};
  var CATS  = window.CATEGORIES || [];
  var PHOTOS= window.PHOTOS     || [];
  var HIST  = window.HISTOIRE   || [];
  var FAM   = window.FAMILLE    || [];

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function nomCategorie(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i].nom;
    return 'Souvenirs';
  }

  /* ==========================================================
     1. ÉCRAN D'OUVERTURE + LANCEMENT DE LA VIDÉO
     ========================================================== */
  var ouverture   = $('#ouverture');
  var boutonOuvrir= $('#bouton-ouvrir');
  var video       = $('#video-souvenirs');

  // Source de la vidéo (définie ici pour ne pas la télécharger avant l'ouverture)
  if (REG.video && video) {
    var src = document.createElement('source');
    src.src = REG.video;
    src.type = 'video/mp4';
    video.appendChild(src);
    video.classList.add('anime');
  }

  if (boutonOuvrir) {
    boutonOuvrir.addEventListener('click', function () {
      ouverture.classList.add('ferme');
      document.body.classList.add('ouvert');
      if (video) {
        video.play().catch(function () { /* pas de lecture automatique : on ignore */ });
      }
      // Révèle immédiatement le contenu déjà visible à l'écran
      apparaitreTout();
    });
  }

  /* ==========================================================
     1 bis. BARRE DE MESSAGE (annonces discrètes)
     ========================================================== */
  function floater(texte, duree) {
    var boite = $('#message-flottant');
    if (!boite) return;
    boite.textContent = texte;
    boite.hidden = false;
    clearTimeout(floater._t);
    floater._t = setTimeout(function () { boite.hidden = true; }, duree || 7000);
  }

  /* ==========================================================
     2. MUSIQUE (jamais de lecture automatique)
     ----------------------------------------------------------
     Sources possibles, dans cet ordre :
     1. la musique choisie sur cet appareil (enregistrée dans le
        navigateur du visiteur, pour lui seul) ;
     2. le fichier indiqué dans galerie.js (audio/musique.mp3) ;
     3. rien : alors un clic sur ♪ ouvre le choix de fichiers
        audio du PC ou du téléphone. Double clic : en changer.
     ========================================================== */
  var boutonMusique = $('#musique');
  var lecteur       = $('#lecteur');
  var champMusique  = null;

  function ouvrirBase() {
    return new Promise(function (resoudre, rejeter) {
      var r = indexedDB.open('album-mariage', 2);
      r.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('photos'))  db.createObjectStore('photos',  { keyPath: 'id' });
        if (!db.objectStoreNames.contains('musique')) db.createObjectStore('musique', { keyPath: 'id' });
      };
      r.onsuccess = function () { resoudre(r.result); };
      r.onerror   = function () { rejeter(r.error); };
    });
  }

  function lirePisteEnregistree() {
    return ouvrirBase().then(function (db) {
      return new Promise(function (resoudre) {
        if (!db.objectStoreNames.contains('musique')) return resoudre(null);
        var tx = db.transaction('musique', 'readonly');
        var rq = tx.objectStore('musique').get('piste');
        rq.onsuccess = function () { resoudre(rq.result && rq.result.blob ? rq.result : null); };
        rq.onerror   = function () { resoudre(null); };
      });
    }).catch(function () { return null; });
  }

  function enregistrerPiste(blob, nom) {
    return ouvrirBase().then(function (db) {
      return new Promise(function (resoudre) {
        var tx = db.transaction('musique', 'readwrite');
        tx.objectStore('musique').put({ id: 'piste', blob: blob, nom: nom || 'musique', date: Date.now() });
        tx.oncomplete = function () { resoudre(true); };
        tx.onerror    = function () { resoudre(false); };
      });
    });
  }

  function joueurActiver() {
    lecteur.volume = 0.35;
    lecteur.play().then(function () {
      boutonMusique.classList.add('actif');
    }).catch(function () {
      floater('La lecture n\'a pas pu démarrer. Cliquez encore une fois sur le bouton ♪.');
    });
  }

  function choisirMusique() {
    if (!champMusique) {
      champMusique = document.createElement('input');
      champMusique.type = 'file';
      champMusique.accept = 'audio/*';
      champMusique.hidden = true;
      document.body.appendChild(champMusique);
      champMusique.addEventListener('change', function () {
        if (!champMusique.files || !champMusique.files[0]) return;
        var f = champMusique.files[0];
        enregistrerPiste(f, f.name).then(function () {
          lecteur.src = URL.createObjectURL(f);
          boutonMusique.title = 'Musique : ' + f.name + ' (double clic pour en changer)';
          joueurActiver();
          floater('Musique « ' + f.name + ' » enregistrée dans cet appareil. Elle n\'est pas visible chez les autres visiteurs : chaque appareil garde sa propre piste.');
        });
      });
    }
    champMusique.click();
  }

  if (lecteur) {
    lirePisteEnregistree().then(function (piste) {
      if (piste) {
        // la musique choisie sur cet appareil a la priorité
        lecteur.src = URL.createObjectURL(piste.blob);
        boutonMusique.title = 'Musique : ' + piste.nom + ' (double clic : en choisir une autre)';
      } else if (REG.musique) {
        lecteur.src = REG.musique;
        lecteur.addEventListener('error', function () {
          // fichier absent : on l'explique au lieu de faire semblant
          boutonMusique.title = 'Aucune musique configurée : cliquez pour en choisir une';
        });
      }
    });
  }

  if (boutonMusique && lecteur) {
    boutonMusique.addEventListener('dblclick', function (e) {
      e.preventDefault();
      choisirMusique();
    });
    boutonMusique.addEventListener('click', function () {
      if (!lecteur.src || lecteur.error) { choisirMusique(); return; }
      if (lecteur.paused) {
        joueurActiver();
      } else {
        lecteur.pause();
        boutonMusique.classList.remove('actif');
      }
    });
  }

  /* ==========================================================
     2 bis. PROTECTION DES PHOTOS
     ----------------------------------------------------------
     clic droit « enregistrer l'image », glisser-déposer et menu
     d'appui long sont bloqués sur les images. NB : une vraie
     capture d'écran reste possible — aucun site web ne peut
     l'empêcher, c'est le téléphone qui photographie son écran.
     ========================================================== */
  document.addEventListener('contextmenu', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  });

  /* ==========================================================
     3. PÉTALES DÉCORATIFS
     ========================================================== */
  (function petales() {
    var boite = $('#petales');
    if (!boite) return;
    var nombre = window.innerWidth < 640 ? 14 : 24;
    var i, petale, taille;
    for (i = 0; i < nombre; i++) {
      petale = document.createElement('span');
      petale.className = 'petale';
      taille = 7 + Math.random() * 11;
      petale.style.width  = taille + 'px';
      petale.style.height = (taille * 0.82) + 'px';
      petale.style.left   = (Math.random() * 100) + 'vw';
      petale.style.animationDuration = (10 + Math.random() * 12) + 's';
      petale.style.animationDelay    = (-Math.random() * 20) + 's';
      if (Math.random() > 0.65) {
        petale.style.background = 'radial-gradient(circle at 32% 32%, #E6C877, #C9A227)';
      }
      boite.appendChild(petale);
    }
  })();

  /* ==========================================================
     4. BARRE DE PROGRESSION + NAVIGATION ACTIVE
     ========================================================== */
  var barre = $('#progression');
  var liens = $$('#navigation a');
  var sections = liens.map(function (a) { return $(a.getAttribute('href')); });

  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var total = h.scrollHeight - h.clientHeight;
    barre.style.width = (total > 0 ? (h.scrollTop / total) * 100 : 0) + '%';

    var pos = h.scrollTop + 140, actif = null;
    sections.forEach(function (sec, i) {
      if (sec && sec.offsetTop <= pos) actif = i;
    });
    liens.forEach(function (a, i) { a.classList.toggle('actif', i === actif); });
  }, { passive: true });

  /* ==========================================================
     5. COMPTE À REBOURS
     ========================================================== */
  (function compteARebours() {
    var cible = new Date(REG.dateMariage || '2026-12-11T16:00:00').getTime();
    var j = $('#cb-jours'), h = $('#cb-heures'), m = $('#cb-minutes'), s = $('#cb-secondes');
    if (!j || !h || !m || !s) return;
    function deux(n) { return (n < 10 ? '0' : '') + n; }
    function tic() {
      var reste = Math.max(0, cible - Date.now());
      j.textContent = deux(Math.floor(reste / 86400000));
      h.textContent = deux(Math.floor((reste % 86400000) / 3600000));
      m.textContent = deux(Math.floor((reste % 3600000) / 60000));
      s.textContent = deux(Math.floor((reste % 60000) / 1000));
    }
    tic();
    setInterval(tic, 1000);
  })();

  /* ==========================================================
     6. NOTRE HISTOIRE
     ========================================================== */
  (function histoire() {
    var boite = $('#recit-liste');
    if (!boite) return;
    if (!HIST.length) { boite.innerHTML = ''; return; }

    HIST.forEach(function (bloc, i) {
      var article = document.createElement('article');
      article.className = 'recit-bloc apparait' + (i % 2 ? ' inverse' : '') + (i > 1 ? ' retard-1' : '');

      var photo = document.createElement('div');
      photo.className = 'recit-photo';
      if (bloc.image) {
        var img = document.createElement('img');
        img.src = bloc.image;
        img.alt = bloc.titre || 'Souvenir';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.addEventListener('error', function () { cadreAVenir(photo, bloc.image); });
        photo.appendChild(img);
        article.appendChild(photo);
      } else {
        cadreAVenir(photo);
        article.appendChild(photo);
      }

      var texte = document.createElement('div');
      texte.className = 'recit-texte';
      var t = document.createElement('h3');
      t.textContent = bloc.titre || '';
      var p = document.createElement('p');
      p.textContent = bloc.texte || '';
      texte.appendChild(t); texte.appendChild(p);
      if (bloc.date) {
        var d = document.createElement('span');
        d.className = 'quand';
        d.textContent = bloc.date;
        texte.appendChild(d);
      }
      article.appendChild(texte);
      boite.appendChild(article);
    });
  })();

  /* cadre élégant qui annonce qu'une photo reste à ajouter */
  function cadreAVenir(cadre, chemin) {
    cadre.innerHTML = '';
    cadre.classList.add('recit-photo-vide');
    cadre.style.display = 'grid';
    cadre.style.placeItems = 'center';
    cadre.style.textAlign = 'center';
    cadre.style.padding = '18px';
    var icone = document.createElement('span');
    icone.style.fontSize = '2rem';
    icone.textContent = '📷';
    var txt = document.createElement('span');
    txt.style.fontSize = '.78rem';
    txt.style.color = '#8A7566';
    txt.style.marginTop = '8px';
    txt.innerHTML = chemin
      ? 'Photo introuvable<br><code>' + chemin + '</code>'
      : 'Photo à venir<br><span style="opacity:.75">à ajouter dans galerie.js</span>';
    cadre.appendChild(icone);
    cadre.appendChild(txt);
  }

  /* ==========================================================
     7. GALERIE DE SOUVENIRS
     ========================================================== */
  var galerie = {
    liste: PHOTOS.slice(),      // photos du fichier galerie.js
    affichees: [],              // photos de la catégorie choisie
    enCours: 0,
    pas: 36                     // nombre de vignettes affichées par lot
  };

  function chargerPhotosLocales() {
    // Photos ajoutées sur cet appareil (studio ou bouton « Ajouter »),
    // stockées dans le navigateur de l'appareil.
    return ouvrirBase().then(function (db) {
      return new Promise(function (resoudre) {
        if (!db.objectStoreNames.contains('photos')) return resoudre([]);
        var tx = db.transaction('photos', 'readonly');
        var out = [];
        tx.objectStore('photos').openCursor().onsuccess = function (e) {
          var c = e.target.result;
          if (c) { out.push(c.value); c.continue(); }
        };
        tx.oncomplete = function () { resoudre(out); };
        tx.onerror    = function () { resoudre([]); };
      });
    }).catch(function () { return []; });
  }

  function enregistrerPhotoLocale(objet) {
    return ouvrirBase().then(function (db) {
      return new Promise(function (resoudre, rejeter) {
        var tx = db.transaction('photos', 'readwrite');
        tx.objectStore('photos').put(objet);
        tx.oncomplete = function () { resoudre(true); };
        tx.onerror    = function () { rejeter(tx.error); };
      });
    });
  }

  /* réduit une image avant de l'enregistrer (plus léger sur le téléphone) */
  function reduire(fichier, largeurMax) {
    return new Promise(function (resoudre, rejeter) {
      var url = URL.createObjectURL(fichier);
      var img = new Image();
      img.onload = function () {
        var w = img.width, h = img.height;
        if (w > largeurMax) { h = Math.round(h * largeurMax / w); w = largeurMax; }
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resoudre(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = function () { URL.revokeObjectURL(url); rejeter(new Error('image illisible')); };
      img.src = url;
    });
  }

  /* ---------- Ajouter des photos depuis la barre des catégories ----------
     Chaque photo est lue par l'assistant intelligent (intelligence.js)
     qui propose la catégorie, puis rangée sur cet appareil.               */
  var champAjout = null;

  function choisirDesPhotos() {
    if (!champAjout) {
      champAjout = document.createElement('input');
      champAjout.type = 'file';
      champAjout.accept = 'image/*';
      champAjout.multiple = true;
      champAjout.hidden = true;
      document.body.appendChild(champAjout);
      champAjout.addEventListener('change', function () {
        if (champAjout.files && champAjout.files.length) {
          ajouterPhotosDepuisFichiers(champAjout.files);
          champAjout.value = '';
        }
      });
    }
    champAjout.click();
  }

  function ajouterPhotosDepuisFichiers(fichiers) {
    var images = Array.prototype.filter.call(fichiers || [], function (f) {
      return f.type.indexOf('image/') === 0;
    });
    if (!images.length) return;

    var IA = window.AssistantImage || null;
    var disponible = !!(IA && IA.suggerer);
    var enLigne = navigator.onLine;
    if (disponible && enLigne) {
      floater('Assistant intelligent : lecture des ' + images.length + ' photo(s)…', 20000);
    }

    var resume = { ajoutees: 0, categories: {}, exemples: [], avecIA: 0 };
    var suite = Promise.resolve();

    images.forEach(function (f) {
      suite = suite.then(function () {
        return reduire(f, 1100);
      }).then(function (src) {
        if (disponible && enLigne) {
          return IA.suggerer(src).then(function (s) {
            return { src: src, cat: s.cat, classe: s.classe || '' };
          }).catch(function () {
            return { src: src, cat: 'meilleurs', classe: '' };
          });
        }
        return { src: src, cat: 'meilleurs', classe: '' };
      }).then(function (r) {
        resume.categories[r.cat] = (resume.categories[r.cat] || 0) + 1;
        resume.ajoutees++;
        if (r.classe) { resume.exemples.push(r.classe); resume.avecIA++; }
        return enregistrerPhotoLocale({
          id: 'local-' + Date.now() + '-' + Math.round(Math.random() * 1e6),
          src: r.src,
          nom: f.name,
          cat: r.cat,
          legende: ''
        });
      }).catch(function () {
        floater('Le fichier « ' + f.name + ' » n\'a pas pu être ajouté sur cet appareil.');
      });
    });

    suite.then(function () {
      var parties = Object.keys(resume.categories).map(function (id) {
        return nomCategorie(id) + ' : ' + resume.categories[id];
      });
      var texte = resume.ajoutees + ' photo(s) ajoutée(s) sur cet appareil — ' + parties.join(', ') + '.';
      if (resume.avecIA) {
        texte += ' Rangement automatique par l\'assistant intelligent' +
          (resume.exemples.length ? ' (sujet reconnu : « ' + resume.exemples[0] + ' »)' : '') + '.';
      } else {
        texte += ' L\'assistant intelligent n\'a pas pu analyser (pas de connexion Internet) : voyez le studio pour les classer.';
      }
      if (resume.categories.meilleurs) {
        texte += ' Une correction manuelle reste possible dans le studio.';
      }
      floater(texte, 11000);
      return rafraichirAlbum();
    });
  }

  /* reconstruit tout l'album après un ajout (galerie + famille + films) */
  function rafraichirAlbum() {
    return chargerPhotosLocales().then(function (locales) {
      galerie.liste = PHOTOS.slice();
      locales.forEach(function (p) {
        galerie.liste.push({
          src: p.src,                       // image encodée en mémoire locale
          cat: p.cat || 'meilleurs',
          legende: p.legende || (p.nom || 'Photo ajoutée')
        });
      });
      if (!galerie.liste.length) return construireGalerie();
      construireGalerie();
      dessinerFamille();
      observerApparitions();
    });
  }

  function construireGalerie() {
    var zoneFiltres = $('#filtres');
    var grille      = $('#grille');
    if (!zoneFiltres || !grille) return;

    /* réinitialisation (utile après l'ajout de nouvelles photos) */
    zoneFiltres.innerHTML = '';
    grille.innerHTML = '';

    /* --- filtres --- */
    var comptes = {};
    galerie.liste.forEach(function (p) { comptes[p.cat] = (comptes[p.cat] || 0) + 1; });

    var tout = document.createElement('button');
    tout.className = 'filtre actif';
    tout.type = 'button';
    tout.dataset.cat = 'tout';
    tout.innerHTML = 'Tout <span class="compte">' + galerie.liste.length + '</span>';
    zoneFiltres.appendChild(tout);

    CATS.forEach(function (c) {
      if (!comptes[c.id]) return;                  // catégorie vide non affichée
      var b = document.createElement('button');
      b.className = 'filtre';
      b.type = 'button';
      b.dataset.cat = c.id;
      b.innerHTML = c.nom + ' <span class="compte">' + comptes[c.id] + '</span>';
      zoneFiltres.appendChild(b);
    });

    /* --- bouton ajouter des photos --- */
    var ajouter = document.createElement('button');
    ajouter.className = 'filtre-ajout';
    ajouter.type = 'button';
    ajouter.title = 'Choisir des photo(s) depuis cet appareil : l\'assistant intelligent les range automatiquement dans une catégorie.';
    ajouter.textContent = '+ Ajouter des photos';
    ajouter.addEventListener('click', choisirDesPhotos);
    zoneFiltres.appendChild(ajouter);

    zoneFiltres.addEventListener('click', function (e) {
      var b = e.target.closest('.filtre');
      if (!b) return;
      $$('.filtre', zoneFiltres).forEach(function (x) { x.classList.remove('actif'); });
      b.classList.add('actif');
      appliquerFiltre(b.dataset.cat);
    });

    /* --- grille --- */
    grille.addEventListener('click', function (e) {
      var v = e.target.closest('.vignette');
      if (!v) return;
      ouvrirVisionneuse(parseInt(v.dataset.index, 10));
    });

    appliquerFiltre('tout');
  }

  function appliquerFiltre(cat) {
    galerie.affichees = cat === 'tout'
      ? galerie.liste.slice()
      : galerie.liste.filter(function (p) { return p.cat === cat; });
    galerie.enCours = 0;
    var grille = $('#grille');
    grille.innerHTML = '';
    ajouterLot();
  }

  function ajouterLot() {
    var grille = $('#grille');
    var vide   = $('#galerie-vide');
    var suite  = galerie.affichees.slice(galerie.enCours, galerie.enCours + galerie.pas);

    if (!galerie.affichees.length) {
      vide.hidden = false;
      return;
    }
    vide.hidden = true;

    suite.forEach(function (photo, i) {
      grille.appendChild(creerVignette(photo, galerie.enCours + i));
    });
    galerie.enCours += suite.length;

    // les nouvelles vignettes doivent elles aussi être observées,
    // sinon elles restent invisibles (opacity: 0) après un changement de filtre
    observerApparitions();

    var ancien = $('#bouton-plus');
    if (ancien) ancien.remove();
    if (galerie.enCours < galerie.affichees.length) {
      var b = document.createElement('button');
      b.id = 'bouton-plus';
      b.className = 'filtre';
      b.type = 'button';
      b.style.margin = '26px auto 0';
      b.textContent = 'Afficher plus de souvenirs (' + (galerie.affichees.length - galerie.enCours) + ' restantes)';
      b.addEventListener('click', ajouterLot);
      grille.parentNode.appendChild(b);
    }
  }

  function creerVignette(photo, index) {
    var b = document.createElement('button');
    b.className = 'vignette apparait';
    b.type = 'button';
    b.dataset.index = index;
    b.setAttribute('aria-label', 'Agrandir : ' + (photo.legende || nomCategorie(photo.cat)));

    var img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.legende || nomCategorie(photo.cat);
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', function () {
      // image absente : on retire la vignette plutôt que d'afficher un carré cassé
      b.remove();
      galerie.liste = galerie.liste.filter(function (p) { return p !== photo; });
    });

    var loupe = document.createElement('span');
    loupe.className = 'loupe';
    loupe.textContent = '🔍';

    b.appendChild(img);
    b.appendChild(loupe);
    if (photo.legende) {
      var et = document.createElement('span');
      et.className = 'etiquette';
      et.textContent = photo.legende;
      b.appendChild(et);
    }
    return b;
  }

  /* ==========================================================
     8. VISIONNEUSE
     ========================================================== */
  var vis = {
    boite:     $('#visionneuse'),
    image:     $('#vision-image'),
    legende:   $('#vision-legende'),
    compteur:  $('#vision-compteur'),
    fermer:    $('#vision-fermer'),
    precedent: $('#vision-precedent'),
    suivant:   $('#vision-suivant'),
    index: 0
  };

  function ouvrirVisionneuse(i, depuisListeComplete) {
    // Normal : on navigue dans la catégorie affichée.
    // depuisListeComplete = true quand on part d'une autre section
    // (ex. Famille & invités) : on navigue alors dans tout l'album.
    var source = depuisListeComplete ? galerie.liste : galerie.affichees;
    if (!source.length) return;
    vis.index = (i + source.length) % source.length;
    var p = source[vis.index];
    vis.image.src = p.src;
    vis.image.alt = p.legende || nomCategorie(p.cat);
    vis.legende.textContent = p.legende || nomCategorie(p.cat);
    vis.compteur.textContent = (vis.index + 1) + ' / ' + source.length;
    vis.boite.classList.add('ouverte');
    document.body.style.overflow = 'hidden';
    vis.fermer.focus();
  }

  function fermerVisionneuse() {
    vis.boite.classList.remove('ouverte');
    document.body.style.overflow = '';
  }
  function allerA(delta) { ouvrirVisionneuse(vis.index + delta); }

  if (vis.boite) {
    vis.fermer.addEventListener('click', fermerVisionneuse);
    vis.precedent.addEventListener('click', function () { allerA(-1); });
    vis.suivant.addEventListener('click', function () { allerA(1); });
    vis.boite.addEventListener('click', function (e) { if (e.target === vis.boite) fermerVisionneuse(); });
    document.addEventListener('keydown', function (e) {
      if (!vis.boite.classList.contains('ouverte')) return;
      if (e.key === 'Escape')     fermerVisionneuse();
      if (e.key === 'ArrowLeft')  allerA(-1);
      if (e.key === 'ArrowRight') allerA(1);
    });
  }

  /* ==========================================================
     9. FAMILLE & INVITÉS
     ========================================================== */
  function dessinerFamille() {
    var boite = $('#famille-liste');
    if (!boite) return;
    boite.innerHTML = '';

    FAM.forEach(function (bloc, i) {
      var section = document.createElement('div');
      section.className = 'bloc-famille apparait' + (i ? ' retard-1' : '');

      var titre = document.createElement('h3');
      titre.className = 'titre-famille';
      titre.textContent = bloc.titre;

      var note = document.createElement('p');
      note.className = 'note-famille';
      note.textContent = bloc.texte + ' Les photos de ce groupe seront ajoutées automatiquement ici dès qu\'elles seront enregistrées dans la catégorie « ' + nomCategorie(bloc.categorie) + ' ».';

      section.appendChild(titre);
      section.appendChild(note);

      var grille = document.createElement('div');
      grille.className = 'grille-album';
      grille.addEventListener('click', function (e) {
        var v = e.target.closest('.vignette');
        if (!v) return;
        var idx = galerie.liste.indexOf(galerie.liste.filter(function (p) { return p.src === v.dataset.src; })[0]);
        if (idx > -1) ouvrirVisionneuse(idx, true);
      });

      var trouvees = galerie.liste.filter(function (p) { return p.cat === bloc.categorie; });
      if (trouvees.length) {
        trouvees.forEach(function (p) {
          var b = document.createElement('button');
          b.className = 'vignette';
          b.type = 'button';
          b.dataset.src = p.src;
          var im = document.createElement('img');
          im.src = p.src; im.alt = p.legende || bloc.titre;
          im.loading = 'lazy'; im.decoding = 'async';
          b.appendChild(im);
          if (p.legende) {
            var et = document.createElement('span');
            et.className = 'etiquette'; et.textContent = p.legende;
            b.appendChild(et);
          }
          grille.appendChild(b);
        });
      } else {
        var vide = document.createElement('div');
        vide.className = 'galerie-vide';
        vide.style.columnSpan = 'all';
        vide.innerHTML = '<div class="grand">👨‍👩‍👧‍👦</div><p>Les photos de ce groupe apparaîtront ici.</p>' +
          '<p style="margin-top:10px">Ajoutez vos images avec <code>studio.html</code> en choisissant la catégorie « ' +
          nomCategorie(bloc.categorie) + ' ».</p>';
        grille.appendChild(vide);
      }
      section.appendChild(grille);
      boite.appendChild(section);
    });
  }

  /* ==========================================================
     10. LIVRE D'OR (connexion réelle à Formspree, si configuré)
     ========================================================== */
  (function livre() {
    var form = $('#formulaire-or');
    var sortie = $('#or-reponse');
    var bouton = $('#or-envoyer');
    if (!form) return;

    var pret = REG.formspree && REG.formspree.indexOf('VOTRE-ID-FORMSPREE') === -1;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nom = $('#or-nom').value.trim();
      var msg = $('#or-message').value.trim();

      if (!nom || !msg) {
        sortie.className = 'reponse-livre err';
        sortie.textContent = 'Merci d\'écrire votre nom et un petit message.';
        return;
      }
      if (!pret) {
        sortie.className = 'reponse-livre err';
        sortie.textContent = 'Le livre d\'or n\'est pas encore connecté à un service de réception : ' +
          'votre message n\'a donc pas été enregistré. Renseignez votre identifiant Formspree dans galerie.js pour activer cette fonction.';
        return;
      }

      bouton.disabled = true;
      sortie.className = 'reponse-livre';
      sortie.textContent = 'Envoi en cours…';

      fetch(REG.formspree, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: (function () {
          var d = new FormData();
          d.append('nom', nom);
          d.append('message', msg);
          d.append('mariage', REG.mariage || '');
          return d;
        })()
      }).then(function (r) {
        if (!r.ok) throw new Error('réponse ' + r.status);
        sortie.className = 'reponse-livre ok';
        sortie.textContent = 'Merci ' + nom + ' ! Votre message a bien été envoyé.';
        form.reset();
      }).catch(function () {
        sortie.className = 'reponse-livre err';
        sortie.textContent = 'L\'envoi a échoué. Veuillez réessayer dans quelques instants.';
      }).then(function () {
        bouton.disabled = false;
      });
    });
  })();

  /* ==========================================================
     11. ANIMATIONS AU DÉFILEMENT
     ========================================================== */
  var observateur = null;
  if ('IntersectionObserver' in window) {
    observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observateur.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }

  function observerApparitions() {
    $$('.apparait').forEach(function (el) {
      if (observateur) observateur.observe(el); else el.classList.add('visible');
    });
  }
  function apparaitreTout() {
    $$('.apparait').forEach(function (el) { el.classList.add('visible'); });
  }

  /* ==========================================================
     12. FILM DES SOUVENIRS (montage automatique)
     ----------------------------------------------------------
     Fabrique un petit film : titre, chaque photo défilée avec un
     léger effet de zoom, générique. Montage affiché en direct ;
     possibilité d'enregistrer la vidéo (WebM/MP4 selon navigateur),
     avec la musique choisie quand le navigateur le permet.
     ========================================================== */
  var film = null;

  function initFilm() {
    film = {
      boite:       $('#film'),
      canvas:      $('#film-canvas'),
      ctx:         $('#film-canvas') ? $('#film-canvas').getContext('2d') : null,
      apercu:      $('#film-apercu'),
      info:        $('#film-info'),
      lancer:      $('#film-lancer'),
      stop:        $('#film-stop'),
      enregistrer: $('#film-enregistrer'),
      fermer:      $('#film-fermer'),
      raf: 0,
      enCours: false,
      enregistreur: null,
      url: null
    };
    if (!film.boite || !film.canvas) return;

    $('#bouton-film').addEventListener('click', function () {
      var sujet = galerie.affichees.length ? galerie.affichees : galerie.liste;
      film.canvas.hidden = false;
      film.apercu.hidden = true;
      film.lancer.hidden = false;
      film.stop.hidden = true;
      film.enregistrer.hidden = true;
      film.info.textContent = 'Le film se fabrique avec les ' + sujet.length +
        ' photo(s) affichées actuellement. Astuce : choisissez d\'abord une catégorie ci-dessus' +
        ' (ex. « Portraits des mariés ») avant de rouvrir le film — c\'est alors celle-ci qui sera filmée.';
      film.boite.hidden = false;
    });
    film.fermer.addEventListener('click', fermerFilm);
    film.boite.addEventListener('click', function (e) { if (e.target === film.boite) fermerFilm(); });
    film.lancer.addEventListener('click', lancerFilm);
    film.stop.addEventListener('click', function () { terminerMontage('Film arrêté — voici votre vidéo.'); });
    film.enregistrer.addEventListener('click', function () {
      var a = document.createElement('a');
      a.href = film.url;
      a.download = 'film-des-souvenirs.' + (film.extension || 'webm');
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    /* agrandissement plein écran de la séance de visionnage */
    film.agrandir = $('#film-agrandir');
    if (film.agrandir) {
      film.agrandir.addEventListener('click', function () { basculerEcran(film.boite.querySelector('.film-contenu')); });
    }
    /* double-clic sur le film ou sur l'aperçu : agrandir */
    film.canvas.addEventListener('dblclick', function () { basculerEcran(film.boite.querySelector('.film-contenu')); });
    film.apercu.addEventListener('dblclick', function () {
      // l'iPhone n'accepte le plein écran que pour une vraie vidéo
      if (film.apercu.webkitEnterFullscreen) { film.apercu.webkitEnterFullscreen(); return; }
      basculerEcran(film.boite.querySelector('.film-contenu'));
    });
  }

  /* plein écran : agrandit la séance de visionnage ; Échap pour rebasculer */
  function basculerEcran(cible) {
    if (!cible) return;
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (cible.requestFullscreen) {
        cible.requestFullscreen().catch(function () {
          floater('Votre navigateur n\'a pas autorisé l\'agrandissement. Téléchargez la vidéo pour la voir en grand.');
        });
      } else {
        floater('Ce navigateur ne permet pas le plein écran. Téléchargez la vidéo pour la voir en grand.');
      }
    } catch (err) {
      floater('Ce navigateur ne permet pas le plein écran. Téléchargez la vidéo pour la voir en grand.');
    }
  }

  function fermerFilm() {
    if (film.enCours) terminerMontage(null);
    film.boite.hidden = true;
    if (film.url) { try { URL.revokeObjectURL(film.url); } catch (e) {} film.url = null; }
    film.canvas.hidden = false;
    film.apercu.hidden = true;
    film.lancer.hidden = false;
    film.stop.hidden = true;
    film.enregistrer.hidden = true;
  }

  function chargerImagePourFilm(src) {
    return new Promise(function (resoudre, rejeter) {
      var img = new Image();
      img.onload = function () { resoudre(img); };
      img.onerror = rejeter;
      img.src = src;
    });
  }

  function dessinerCouverture(ctx, img, w, h, zoom, decalX, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    var r = Math.max(w / img.width, h / img.height) * zoom;
    var dw = img.width * r, dh = img.height * r;
    ctx.drawImage(img, (w - dw) / 2 + decalX, (h - dh) / 2, dw, dh);
    ctx.restore();
  }

  function dessinerCarte(ctx, w, h, lignes, petitDessus) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#4A121C');
    g.addColorStop(.55, '#6B1F2A');
    g.addColorStop(1, '#5B1A24');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.strokeStyle = 'rgba(201,162,39,.75)';
    ctx.lineWidth = Math.max(2, w * 0.002);
    ctx.strokeRect(w * 0.06, h * 0.08, w * 0.88, h * 0.84);

    ctx.fillStyle = 'rgba(251,245,236,.96)';
    ctx.textAlign = 'center';
    var taille = Math.round(h * 0.11);
    ctx.font = taille + 'px "Great Vibes", "Playfair Display", serif';
    lignes.forEach(function (ligne, i) {
      ctx.fillText(ligne, w / 2, h * (petitDessus ? 0.34 : 0.40) + i * taille * 1.18);
    });
    ctx.restore();
  }

  function lancerFilm() {
    if (film.enCours) return;
    var photosF = (galerie.affichees.length ? galerie.affichees : galerie.liste).slice();
    if (!photosF.length) { film.info.textContent = 'Aucune photo disponible pour faire le film.'; return; }

    film.lancer.hidden = true;
    film.enregistrer.hidden = true;
    film.apercu.hidden = true;
    film.canvas.hidden = false;
    film.stop.hidden = false;
    film.info.textContent = 'Le film se prépare…';

    var W = 1128, H = 636;
    film.canvas.width = W;
    film.canvas.height = H;
    var ctx = film.ctx;

    Promise.all(photosF.map(function (p) { return chargerImagePourFilm(p.src); }))
      .then(function (imgs) {
        // la musique choisie (s'il y en a une) accompagne le film ;
        // on attend que le lanceur de musique ait répondu pour savoir
        // si une piste sonore peut être enregistrée avec la vidéo
        var lancerMusique = Promise.resolve();
        if (lecteur && lecteur.src && lecteur.error === null && lecteur.paused) {
          lecteur.currentTime = 0;
          lecteur.volume = 0.35;
          lancerMusique = lecteur.play().then(function () {
            boutonMusique.classList.add('actif');
          }).catch(function () { /* lecture refusée : film silencieux */ });
        }
        return lancerMusique.then(function () { return imgs; });
      })
      .then(function (imgs) {
        /* --- enregistrement (quand le navigateur le permet) --- */
        try {
          if (film.canvas.captureStream && window.MediaRecorder) {
            var typeChoisi = null;
            var flux = film.canvas.captureStream(30);
            /* WebM d'abord : le plus fiable sur Chrome et Edge ;
               MP4 ensuite pour Safari. */
            var types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
            types.some(function (t) {
              if (MediaRecorder.isTypeSupported(t)) { typeChoisi = t; return true; }
              return false;
            });
            /* la musique n'est enregistrée que si elle joue réellement :
               une piste venue d'un lecteur en erreur rend le fichier vide */
            if (lecteur && lecteur.captureStream && !lecteur.paused && !lecteur.error && lecteur.readyState >= 2) {
              try {
                lecteur.captureStream().getAudioTracks().forEach(function (t) { flux.addTrack(t); });
              } catch (err) { /* musique non enregistrable : film muet, c'est indiqué */ }
            }
            if (typeChoisi) {
              film.recording = new MediaRecorder(flux, { mimeType: typeChoisi });
              film.tranches = [];
              film.recording.ondataavailable = function (e) {
                if (e.data && e.data.size) film.tranches.push(e.data);
              };
              film.recording.start(1000);
            }
          }
        } catch (err) { /* pas d'enregistrement ici ; le film reste visible */ }

        /* --- chronologie --- */
        var TITRE = 3000, PHOTO = 3400, FADE = 650, FIN = 2800;
        var totalMs = TITRE + imgs.length * PHOTO + FIN;
        var debut = performance.now();
        film.enCours = true;
        var dernierAff = -1;

        function calque(t) { return t * t * (3 - 2 * t); }   // easing doux

        function image(t) {
          ctx.fillStyle = '#2B0A0F';
          ctx.fillRect(0, 0, W, H);

          if (t < TITRE) {
            dessinerCarte(ctx, W, H, ['Olakiba Armand', '&', 'Bosseno Josiane'], false);
            return;
          }
          if (t >= totalMs - FIN) {
            var d = REG.dateMariage ? new Date(REG.dateMariage) : null;
            var texteDate = d ? 'Le ' + d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Notre mariage';
            dessinerCarte(ctx, W, H, ['Deux vies, un amour,', 'une seule histoire à écrire.', texteDate], true);
            return;
          }

          var idx = Math.floor((t - TITRE) / PHOTO);
          var dans = (t - TITRE) - idx * PHOTO;
          var img = imgs[idx];
          var prochaine = imgs[idx + 1] || null;

          if (idx !== dernierAff) {
            dernierAff = idx;
            film.info.textContent = 'Souvenir ' + (idx + 1) + ' / ' + imgs.length + '…';
          }

          var sensibilite = calque(Math.min(1, dans / PHOTO));
          var zoom = (idx % 2 === 0) ? 1.02 + 0.08 * sensibilite : 1.10 - 0.08 * sensibilite;
          var decalX = (idx % 2 === 0 ? -1 : 1) * W * 0.012 * sensibilite;
          dessinerCouverture(ctx, img, W, H, zoom, decalX, 1);

          if (prochaine && dans > PHOTO - FADE) {
            var fondu = calque((dans - (PHOTO - FADE)) / FADE);
            densiteCouverture(ctx, prochaine, W, H, 1.03, 0, fondu);
          }

          /* voile doré léger pour l'esthétique du film */
          ctx.save();
          ctx.fillStyle = 'rgba(74,18,28,0.08)';
          ctx.fillRect(0, 0, W, H);
          ctx.restore();
        }

        function boucle() {
          if (!film.enCours) return;
          var t = performance.now() - debut;
          image(t);
          if (t >= totalMs) {
            terminerMontage('Film terminé ! Voici votre vidéo de souvenirs.');
            return;
          }
        }
        /* moteur à chronomètre (plus fiable que l'animation-rAF :
           fonctionne aussi quand le navigateur limite requestAnimationFrame) */
        film.raf = setInterval(boucle, 33);
      })
      .catch(function () {
        film.info.textContent = 'Certaines photo(s) n\'ont pas pu être lues pour le film.';
        film.lancer.hidden = false;
        film.stop.hidden = true;
      });
  }

  function densiteCouverture(ctx, img, w, h, zoom, decalX, alpha) {
    /* alias volontaire de dessinerCouverture pour un appel plus lisible au fondu */
    dessinerCouverture(ctx, img, w, h, zoom, decalX, alpha);
  }

  function terminerMontage(message) {
    if (!film.enCours) return;
    film.enCours = false;
    if (film.raf) { clearInterval(film.raf); film.raf = 0; }
    if (lecteur && !lecteur.paused) {
      lecteur.pause();
      boutonMusique.classList.remove('actif');
    }
    if (film.recording && film.recording.state !== 'inactive') {
      film.recording.onstop = function () {
        var blob = new Blob(film.tranches || [], { type: film.recording.mimeType || 'video/webm' });
        if (blob.size) {
          if (film.url) { try { URL.revokeObjectURL(film.url); } catch (e) {} }
          film.url = URL.createObjectURL(blob);
          film.extension = (film.recording.mimeType || '').indexOf('mp4') !== -1 ? 'mp4' : 'webm';
          film.canvas.hidden = true;
          film.apercu.hidden = false;
          film.apercu.src = film.url;
          film.enregistrer.hidden = false;
          film.stop.hidden = true;
          film.info.textContent = message + ' Format : ' + film.extension.toUpperCase() + '.';
        } else {
          film.lancer.hidden = false;
          film.stop.hidden = true;
          film.info.textContent = 'Le film s\'est bien affiché.' +
            ' Le navigateur n\'a pas enregistré d\'images cette fois-ci —' +
            ' réessayez en gardant cette page bien visible à l\'écran pendant tout le film.';
        }
      };
      film.recording.stop();
    } else {
      film.canvas.hidden = false;
      film.apercu.hidden = true;
      film.lancer.hidden = false;
      film.stop.hidden = true;
      film.info.textContent = 'Film terminé. ' +
        'Ce navigateur ne permet pas d\'enregistrer la vidéo : utilisez Chrome ou Edge pour exporter le fichier.';
    }
  }

  /* ==========================================================
     13. DÉMARRAGE
     ========================================================== */
  rafraichirAlbum();
  initFilm();

})();
