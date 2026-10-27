/* ============================================================
   souvenirs.js — Souvenirs des invités (téléphone, tablette, PC)
   Bosseno Josiane & Olakiba Armand

   • Envoi d'un souvenir (photo compressée + moment + date) vers
     l'API des souvenirs — le souvenir attend la validation des mariés.
   • Affichage des souvenirs PUBLIÉS par les mariés.
   Aucun identifiant technique n'apparaît ici : l'URL de l'API est
   publique par nature et ne sait rien faire d'autre que déposer
   et lire les souvenirs publiés. La modération, elle, a une clé
   qui n'existe que dans l'administration des mariés.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- L'API des souvenirs (Neon Function « souvenirs ») ---------- */
  var URL_API = 'https://br-falling-lab-b9lsl3j6-souvenirs.compute.c-7.eu-central-1.aws.neon.tech';

  /* ---------- Les moments du mariage, avec leur date suggérée ---------- */
  var MOMENTS = [
    { label: 'La dot — jeudi 10 décembre 2026 (Kintélé)',          date: '2026-12-10' },
    { label: 'Le mariage civil — samedi 12 décembre 2026 (mairie)', date: '2026-12-12' },
    { label: 'La bénédiction — samedi 12 décembre 2026',            date: '2026-12-12' },
    { label: 'Les préparatifs',                                     date: '' },
    { label: 'La fête / le repas',                                  date: '2026-12-12' },
    { label: 'Autre moment (précisez la date)',                     date: '' }
  ];

  /* ---------- petits utilitaires ---------- */
  var $ = function (s) { return document.querySelector(s); };

  var form    = $('#formulaire-souvenir');
  var sortie  = $('#sou-inv-reponse');
  var bouton  = $('#sou-inv-envoyer');
  if (!form) return;

  /* ---------- remplir le menu des moments ---------- */
  var menuMoment = $('#sou-inv-moment');
  MOMENTS.forEach(function (m) {
    var o = document.createElement('option');
    o.value = m.label;
    o.textContent = m.label;
    menuMoment.appendChild(o);
  });
  menuMoment.addEventListener('change', function () {
    var m = MOMENTS.filter(function (x) { return x.label === menuMoment.value; })[0];
    var champDate = $('#sou-inv-date');
    if (m && m.date) { if (!champDate.value) champDate.value = m.date; }
  });

  /* ---------- vérification du fichier choisi (avant même l'envoi) ---------- */
  var champPhoto = $('#sou-inv-photo');
  champPhoto.addEventListener('change', function () {
    var f = champPhoto.files && champPhoto.files[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      sortie.className = 'reponse-souvenir err';
      sortie.textContent = 'Cette photo pèse plus de 8 Mo — choisissez-en une plus légère (le téléphone propose souvent « taille moyenne »).';
      champPhoto.value = '';
    } else {
      if (sortie.classList) sortie.classList.remove('err');
      sortie.textContent = '';
    }
  });

  /* ---------- compression douce de la photo (max 1600 px, JPEG) ---------- */
  function reduire(fichier) {
    if (!fichier) return Promise.resolve(null);
    if (typeof FileReader === 'undefined' || !window.URL || !document.createElement('canvas').getContext) {
      return Promise.resolve(fichier); // vieux navigateur : envoi du fichier tel quel
    }
    return new Promise(function (resoudre, echouer) {
      var lecteur = new FileReader();
      lecteur.onload = function () {
        var img = new Image();
        img.onload = function () {
          try {
            var MAX = 1600;
            var l = img.width, h = img.height;
            if (l > MAX || h > MAX) {
              var r = Math.min(MAX / l, MAX / h);
              l = Math.round(l * r); h = Math.round(h * r);
            }
            var canevas = document.createElement('canvas');
            canevas.width = l; canevas.height = h;
            var ctx = canevas.getContext('2d');
            ctx.drawImage(img, 0, 0, l, h);
            canevas.toBlob(function (blob) {
              if (blob) {
                resoudre(new File([blob], (fichier.name || 'photo').replace(/\.[a-z0-9]+$/i, '') + '.jpg',
                                  { type: 'image/jpeg' }));
              } else {
                resoudre(fichier);
              }
            }, 'image/jpeg', 0.85);
          } catch (e) { resoudre(fichier); }
        };
        img.onerror = function () { resoudre(fichier); };
        img.src = lecteur.result;
      };
      lecteur.onerror = function () { resoudre(fichier); };
      lecteur.readAsDataURL(fichier);
    });
  }

  /* ---------- dépôt du souvenir ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nom        = $('#sou-inv-nom').value.trim();
    var legende    = $('#sou-inv-legende').value.trim();
    var moment     = menuMoment.value;
    var datePrise  = $('#sou-inv-date').value;
    var fichier    = champPhoto.files && champPhoto.files.length ? champPhoto.files[0] : null;

    if (!nom) {
      sortie.className = 'reponse-souvenir err';
      sortie.textContent = 'Mettez d\'abord votre nom — les mariés doivent savoir qui remercie.';
      return;
    }
    if (!fichier && !legende) {
      sortie.className = 'reponse-souvenir err';
      sortie.textContent = 'Joignez une photo ou écrivez quelques mots : le souvenir demande un peu de matière.';
      return;
    }

    bouton.disabled = true;
    sortie.className = 'reponse-souvenir';
    sortie.textContent = 'Envoi de votre souvenir…';

    reduire(fichier).then(function (photo) {
      var d = new FormData();
      d.append('auteur', nom);
      if (legende)   d.append('legende', legende);
      if (moment)    d.append('moment', moment);
      if (datePrise) d.append('date_prise', datePrise);
      if (photo)     d.append('photo', photo, photo.name);

      return fetch(URL_API + '/souvenirs', { method: 'POST', body: d });
    }).then(function (r) {
      if (!r.ok) {
        return r.json().catch(function () { return {}; }).then(function (rep) {
          throw new Error(rep.erreur || ('réponse ' + r.status));
        });
      }
      return r.json();
    }).then(function (rep) {
      sortie.className = 'reponse-souvenir ok';
      sortie.textContent = rep.message ||
        'Merci ' + nom + ' ! Votre souvenir arrive aux mariés — il sera publié ici dès leur accord.';
      form.reset();
    }).catch(function (err) {
      sortie.className = 'reponse-souvenir err';
      sortie.textContent = err && err.message && err.message.indexOf('réponse ') !== 0
        ? err.message
        : 'L\'envoi a échoué (connexion Internet ?). Réessayez dans quelques instants.';
    }).then(function () {
      bouton.disabled = false;
    });
  });

  /* ============================================================
     Lecture des souvenirs PUBLIÉS et installation dans la grille
     ============================================================ */
  var grille = $('#grille-souvenirs');
  var note   = $('#note-souvenirs');

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function carteSouvenir(s) {
    var carte = document.createElement('article');
    carte.className = 'carte-souvenir';

    if (s.type === 'photo' && s.photo_url) {
      var img = document.createElement('img');
      img.src = URL_API + s.photo_url;
      img.alt = s.legende || 'Souvenir des invités';
      img.loading = 'lazy';
      carte.appendChild(img);
    } else {
      var mot = document.createElement('div');
      mot.className = 'souvenir-texte';
      mot.innerHTML = '<span class="guillemet">“</span>';
      carte.appendChild(mot);
    }

    var pied = document.createElement('div');
    pied.className = 'pied-souvenir';

    if (s.legende) {
      var legende = document.createElement('p');
      legende.className = 'legende-souvenir';
      legende.textContent = s.legende;
      pied.appendChild(legende);
    }

    var meta = [];
    if (s.auteur)   meta.push('Par ' + s.auteur);
    if (s.moment)   meta.push(s.moment);
    if (s.date_prise) meta.push(fmtDate(s.date_prise));
    if (meta.length) {
      var ligne = document.createElement('p');
      ligne.className = 'meta-souvenir';
      ligne.textContent = meta.join(' · ');
      pied.appendChild(ligne);
    }
    carte.appendChild(pied);
    return carte;
  }

  function charger() {
    if (!grille) return;
    fetch(URL_API + '/souvenirs')
      .then(function (r) { if (!r.ok) throw new Error('réponse ' + r.status); return r.json(); })
      .then(function (souvenirs) {
        grille.innerHTML = '';
        if (!souvenirs.length) {
          note.hidden = false;
          note.classList.remove('err');
          note.textContent = 'Les premiers souvenirs des invités paraîtront ici, dès que Josiane et Armand les auront lus et acceptés dans leur carnet.';
          return;
        }
        note.hidden = true;
        souvenirs.forEach(function (s) { grille.appendChild(carteSouvenir(s)); });
      })
      .catch(function () {
        note.hidden = false;
        note.classList.add('err');
        note.textContent = 'Les souvenirs ne peuvent pas être lus tout de suite (connexion Internet ?). Ils reviendront au prochain chargement de la page.';
      });
  }

  charger();
})();
