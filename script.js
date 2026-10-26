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
     2. MUSIQUE (uniquement après un clic du visiteur)
     ========================================================== */
  var boutonMusique = $('#musique');
  var lecteur       = $('#lecteur');

  if (lecteur && REG.musique) {
    lecteur.src = REG.musique;
    lecteur.addEventListener('error', function () {
      // Aucun fichier audio présent : on l'explique au lieu de faire semblant
      boutonMusique.title = 'Aucune musique fournie (voir le dossier audio/)';
      boutonMusique.setAttribute('aria-disabled', 'true');
      boutonMusique.style.opacity = '.55';
    });
  }

  if (boutonMusique && lecteur) {
    boutonMusique.addEventListener('click', function () {
      if (!lecteur.src) return;                       // aucun fichier configuré
      if (lecteur.paused) {
        lecteur.volume = 0.35;
        lecteur.play().then(function () {
          boutonMusique.classList.add('actif');
        }).catch(function () {
          boutonMusique.title = 'Lecture impossible pour ce navigateur';
        });
      } else {
        lecteur.pause();
        boutonMusique.classList.remove('actif');
      }
    });
  }

  /* ==========================================================
     2 bis. PARTIE ADMINISTRATEUR (cadenas du propriétaire)
     ========================================================== */
  var boutonAdmin  = $('#admin-acces');
  var ecranAdmin   = $('#ecran-admin');
  var champMdp     = $('#admin-mdp');
  var erreurAdmin  = $('#admin-erreur');

  function ouvrirEcranAdmin() {
    ecranAdmin.hidden = false;
    erreurAdmin.hidden = true;
    setTimeout(function () { champMdp.focus(); }, 50);
  }
  function essayerEntrerAdmin() {
    if (champMdp.value === REG.adminMdp) {
      // on mémorise l'accès pour la suite de la session
      try { sessionStorage.setItem('album-admin', '1'); } catch (e) {}
      location.href = 'studio.html';
    } else {
      erreurAdmin.hidden = false;
      champMdp.value = '';
      champMdp.focus();
    }
  }

  if (boutonAdmin && ecranAdmin) {
    boutonAdmin.addEventListener('click', ouvrirEcranAdmin);
    $('#admin-valider').addEventListener('click', essayerEntrerAdmin);
    $('#admin-annuler').addEventListener('click', function () { ecranAdmin.hidden = true; });
    ecranAdmin.addEventListener('click', function (e) { if (e.target === ecranAdmin) ecranAdmin.hidden = true; });
    champMdp.addEventListener('keydown', function (e) { if (e.key === 'Enter') essayerEntrerAdmin(); });
  }

  /* ==========================================================
     2 ter. PROTECTION DES PHOTOS (clic droit / glisser / appui long)
     ========================================================== */
  /* NB : aucune page web ne peut empêcher une vraie capture d'écran.
     Ceci bloque en revanche le clic droit « enregistrer l'image »,
     le glisser-déposer et le menu d'appui long sur téléphone. */
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
    // Photos ajoutées depuis studio.html, stockées dans le navigateur
    return new Promise(function (resoudre) {
      if (!('indexedDB' in window)) return resoudre([]);
      var requete = indexedDB.open('album-mariage', 1);
      requete.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'id' });
        }
      };
      requete.onsuccess = function () {
        try {
          var db = requete.result;
          if (!db.objectStoreNames.contains('photos')) return resoudre([]);
          var tx = db.transaction('photos', 'readonly');
          var out = [];
          tx.objectStore('photos').openCursor().onsuccess = function (e) {
            var c = e.target.result;
            if (c) { out.push(c.value); c.continue(); }
          };
          tx.oncomplete = function () { resoudre(out); };
          tx.onerror = function () { resoudre([]); };
        } catch (err) { resoudre([]); }
      };
      requete.onerror = function () { resoudre([]); };
    });
  }

  function construireGalerie() {
    var zoneFiltres = $('#filtres');
    var grille      = $('#grille');
    if (!zoneFiltres || !grille) return;

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
        vide.style.gridColumn = '1 / -1';
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
     12. DÉMARRAGE
     ========================================================== */
  chargerPhotosLocales().then(function (locales) {
    // fusion : photos du fichier galerie.js + photos ajoutées sur cet ordinateur
    locales.forEach(function (p) {
      galerie.liste.push({
        src: p.src,                       // image encodée en mémoire locale
        cat: p.cat || 'meilleurs',
        legende: p.legende || (p.nom || 'Photo ajoutée')
      });
    });

    // photos que l'administrateur a masquées depuis studio.html (sur cet appareil)
    var masquees = [];
    try { masquees = JSON.parse(localStorage.getItem('album-masquees') || '[]'); } catch (e) {}
    if (masquees.length) {
      galerie.liste = galerie.liste.filter(function (p) { return masquees.indexOf(p.src) === -1; });
    }

    construireGalerie();
    dessinerFamille();
    observerApparitions();
    // le message de la galerie vide doit refléter la situation réelle
    if (!galerie.liste.length) {
      $('#galerie-vide').hidden = false;
      $('#grille').style.display = 'none';
    }
  });

})();
