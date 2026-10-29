/* ==========================================================
   LE LIVRE DES SOUVENIRS — moteur
   Bosseno Josiane & Olakiba Armand
   Construit les pages depuis LIVRE (livre-data.js) et
   REGLAGES.livre (galerie.js), puis anime le livre avec
   StPageFlip (gratuit, CDN). Si le CDN est indisponible,
   un lecteur simple et honnête est proposé.
   ========================================================== */
(function () {
  'use strict';

  /* Démarrage différé : le contenu du livre peut venir de la base en ligne. */
  function demarrer() {

  var $  = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var REG   = (window.REGLAGES && window.REGLAGES.livre) || null;
  var LIVRE = window.LIVRE || null;

  var corps   = $('#corps-livre');
  var annonce = $('#annonce-livre');

  /* ---------- sécurité : données absentes ---------- */
  if (!LIVRE || !REG || !corps) {
    if ($('#chargeur')) $('#chargeur').textContent = 'Données du livre introuvables (galerie.js / livre-data.js).';
    return;
  }

  /* ---------- petit message flottant ---------- */
  var annonceT = null;
  function floater(txt) {
    annonce.textContent = txt;
    annonce.classList.add('visible');
    clearTimeout(annonceT);
    annonceT = setTimeout(function () { annonce.classList.remove('visible'); }, 3800);
  }

  /* ==========================================================
     1. PHOTOS : nom final photo-XX.jpg, repli studio-XX.jpg,
        chargement différé (voisinage ± 3 pages), aucun
        dépendance au réseau pour la légende.
     ========================================================== */
  function deux(n) { return n < 10 ? '0' + n : '' + n; }
  function cheminFinal(n)      { return REG.dossier + REG.prefixe + deux(n) + REG.extension; }
  function cheminAlternatif(n) { return 'images/galerie/studio-' + deux(n) + '.jpg'; }

  var attente = 'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="5"/>');
  var chargees = {};        /* n → true */
  var fileImg  = [];        /* { img, n } */

  function brancherImage(img, n) {
    img.decoding = 'async';
    img.dataset.photo = n;
    fileImg.push({ img: img, n: n });
  }

  function deverrouiller(c) {
    if (chargees[c.n]) return;
    chargees[c.n] = true;
    var essai = 0;
    c.img.onerror = function () {
      if (essai === 0) {
        essai = 1;
        c.img.src = cheminAlternatif(c.n);
      } else {
        c.img.onerror = null;
        remplacerParAttente(c.img);
      }
    };
    c.img.src = cheminFinal(c.n);
  }

  function remplacerParAttente(img) {
    var cadre = img.parentElement;
    if (!cadre) return;
    var zone = document.createElement('div');
    zone.className = 'attente-photo';
    zone.innerHTML = '<span class="ic">&#127790;</span><span>Photo à venir</span>';
    cadre.replaceChild(zone, img);
  }

  function precharger(pos) {
    fileImg.forEach(function (c) {
      if (!chargees[c.n] && Math.abs(c.img._pos - pos) <= 3) deverrouiller(c);
    });
  }

  function noterPositions() {
    fileImg.forEach(function (c) {
      var page = c.img.closest('.page-du-livre');
      c.img._pos = (page && page._pos !== undefined) ? page._pos : -99;
    });
  }

  /* ==========================================================
     2. CONSTRUCTION DES PAGES (ordre de feuilletage)
     ========================================================== */
  var PAGES = [];
  function faire(el) {
    el._pos = PAGES.length;
    el.classList.add('page-du-livre');
    corps.appendChild(el);
    PAGES.push(el);
    return el;
  }

  function pageNumero(el, num) {
    if (num === null) return;
    var s = document.createElement('span');
    s.className = 'numero-page';
    s.textContent = num;
    el.appendChild(s);
  }

  function legendesDe(n) {
    var sortie = '';
    LIVRE.chapitres.forEach(function (ch) {
      ch.photos.forEach(function (ph) {
        if (ph.n === n && !sortie) sortie = ph.legende;
      });
    });
    return sortie;
  }

  /* ---- page cadre photo standard ---- */
  function pagePhoto(ph) {
    var p = document.createElement('article');
    p.className = 'page-photo';
    var cadre = document.createElement('div');
    cadre.className = 'cadre-dor';
    cadre.tabIndex = 0;
    var img = document.createElement('img');
    img.alt = ph.legende || ('Photo ' + deux(ph.n));
    /* livre.js ne donne un vrai src qu'aux pages proches du lecteur ;
       laisser le navigateur charger cette petite fenêtre sans second lazy-load. */
    img.setAttribute('loading', 'eager');
    img.src = attente;
    brancherImage(img, ph.n);
    cadre.appendChild(img);
    p.appendChild(cadre);

    var lg = document.createElement('p');
    lg.className = 'legende';
    lg.textContent = ph.legende || '';
    p.appendChild(lg);

    var cz = document.createElement('span');
    cz.className = 'consigne-zoom';
    cz.textContent = 'Cliquez pour agrandir';
    p.appendChild(cz);

    brancherZoom(cadre, img, ph.legende);
    faire(p);
    pageNumero(p, p._pos);
    return p;
  }

  /* ---- page photo pleine (photoOuverture ou ph.pleine) ---- */
  function pagePleine(n, legende, surTitre) {
    var p = document.createElement('article');
    p.className = 'page-pleine';
    if (surTitre) {
      var st = document.createElement('span');
      st.className = 'gratitude';
      st.textContent = surTitre;
      st.style.cssText = 'position:absolute;top:14px;left:0;right:0;text-align:center;color:#E6C877;font-size:.64rem;letter-spacing:.3em;text-transform:uppercase;z-index:2;';
      p.appendChild(st);
    }
    var cadre = document.createElement('div');
    cadre.className = 'cadre-dor';
    cadre.tabIndex = 0;
    var img = document.createElement('img');
    img.alt = legende || ('Photo ' + deux(n));
    img.setAttribute('loading', 'eager');
    img.src = attente;
    brancherImage(img, n);
    cadre.appendChild(img);
    p.appendChild(cadre);
    if (legende) {
      var lg = document.createElement('p');
      lg.className = 'legende-doree';
      lg.textContent = legende;
      p.appendChild(lg);
    }
    brancherZoom(cadre, img, legende);
    faire(p);
    return p;
  }

  function brancherZoom(cadre, img, legende) {
    function ouvrir() {
      if (!img.src || img.src.indexOf('data:image') === 0) return;
      $('#zoom-image').src = img.src;
      $('#zoom-legende').textContent = legende || img.alt || '';
      $('#zoom-photo').hidden = false;
    }
    cadre.addEventListener('click', ouvrir);
    cadre.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(); }
    });
  }

  /* ---- page livre d'or ---- */
  function pageLivreDor() {
    var p = document.createElement('article');
    p.className = 'page-livredor';
    var b = LIVRE.livreDor || {};
    var h = document.createElement('h3');
    h.textContent = b.titre || 'Le livre d\u2019or';
    p.appendChild(h);
    if (b.intro) {
      var ip = document.createElement('p');
      ip.className = 'intro';
      ip.textContent = b.intro;
      p.appendChild(ip);
    }
    var f = document.createElement('form');
    f.innerHTML =
      '<label for="livre-or-nom">Votre nom</label>' +
      '<input id="livre-or-nom" type="text" name="nom" required autocomplete="name" maxlength="60" placeholder="Ex. Marie Koumba">' +
      '<label for="livre-or-message">Votre mot pour les mariés</label>' +
      '<textarea id="livre-or-message" name="message" required maxlength="240" placeholder="Un vœu de bonheur, un souvenir, une pensée tendre…"></textarea>' +
      '<button type="submit">Confier mon mot aux mariés</button>' +
      '<p class="reponse" aria-live="polite"></p>';
    var rep = f.querySelector('.reponse');
    var bouton = f.querySelector('button[type="submit"]');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      bouton.disabled = true;
      rep.style.color = '';
      rep.textContent = 'Envoi en cours\u2026';
      var donnees = new FormData();
      donnees.append('auteur', f.elements.nom.value.trim());
      donnees.append('legende', f.elements.message.value.trim());
      donnees.append('moment', 'Livre d’or');
      fetch('https://br-falling-lab-b9lsl3j6-souvenirs.compute.c-7.eu-central-1.aws.neon.tech/souvenirs', {
        method: 'POST', body: donnees
      }).then(function (r) {
        if (!r.ok) return r.json().then(function (x) { throw new Error(x.erreur || 'Envoi impossible.'); });
        return r.json();
      }).then(function () {
        rep.textContent = 'Merci pour ces mots. Ils sont bien arrivés aux mariés et seront partagés après leur accord.';
        f.reset();
      }).catch(function (err) {
        rep.style.color = '#8A3A56';
        rep.textContent = err.message || 'Pas de connexion — réessayez plus tard.';
      }).then(function () {
        bouton.disabled = false;
      });
    });
    p.appendChild(f);
    faire(p);
    pageNumero(p, p._pos);
    return p;
  }

  /* ==========================================================
     3. ASSEMBLAGE : couverture → sommaire → chapitres → crédit
     ========================================================== */
  var SommairePos = { page: 1, items: [] };
  var couvertureEl = null;
  var sommaireUl   = null;
  var cibles = {};           /* sommaire : numéro de chapitre → position */

  /* ---- couverture ---- */
  couvertureEl = document.createElement('article');
  couvertureEl.className = 'page-couverture';
  couvertureEl.innerHTML =
    '<span class="ornement">&#10086;</span>' +
    '<p class="sur-titre">' + (LIVRE.sousTitreCouverture || 'Le livre de nos souvenirs') + '</p>' +
    '<h2>Bosseno Josiane<br><span style="opacity:.75;font-size:.8em">&amp;</span><br>Olakiba Armand</h2>' +
      '<p class="sous-ligne">Une promesse, une vie à écrire.</p>' +
    '<p class="fin-couv">' + (LIVRE.basCouverture || '') + '</p>';
  faire(couvertureEl);

  /* ---- sommaire (les boutons seront ajoutés après) ---- */
  var sommaireEl = document.createElement('article');
  sommaireEl.className = 'page-sommaire';
  sommaireEl.innerHTML = '<h3>Sommaire</h3>';
  sommaireUl = document.createElement('ul');
  sommaireUl.className = 'sommaire-lister';
  sommaireEl.appendChild(sommaireUl);
  faire(sommaireEl);
  SommairePos.page = sommaireEl._pos;

  /* ---- chapitres ---- */
  LIVRE.chapitres.forEach(function (ch) {
    /* Le dernier chapitre est assemblé à part après les autres, juste avant
       le livre d'or : il ne faut pas créer ici une seconde page d'introduction. */
    if (ch.num === 'VI') return;
    var cible;                                    /* position de la 1re page du chapitre */
    var liste = ch.photos.slice();                /* copie de travail (on peut retirer la photo d'ouverture) */

    if (ch.photoOuverture) {
      cible = PAGES.length;                       /* la page qui va être ajoutée */
      var legO = legendesDe(ch.photoOuverture);
      pagePleine(ch.photoOuverture, legO, 'Chapitre ' + ch.num + ' — ' + ch.titre);
      liste = liste.filter(function (ph) { return ph.n !== ch.photoOuverture; });
    } else {
      cible = PAGES.length;
      var pc = document.createElement('article');
      pc.className = 'page-chapitre';
      pc.innerHTML =
        '<span class="ornement">&#10086;</span>' +
        '<p class="num-chapitre">Chapitre ' + ch.num + '</p>' +
        '<h3>' + ch.titre + '</h3>' +
        (ch.intro ? '<p class="intro">' + '' + '</p>' : '');
      if (ch.intro) {
        var ip = pc.querySelector('.intro');
        ip.textContent = ch.intro;
      }
      faire(pc);
      pageNumero(pc, pc._pos);
    }
    cibles[ch.num] = cible;
    if (ch.num !== 'VI') {
      SommairePos.items.push({ num: ch.num, titre: ch.titre, cible: cible });
    }

    liste.forEach(function (ph) {
      var pleine = ph.pleine || (REG.pleines && REG.pleines.indexOf(ph.n) !== -1);
      if (pleine) pagePleine(ph.n, ph.legende, '');
      else pagePhoto(ph);
    });
  });

  /* ---- pages finales : remerciements + livre d'or ---- */
  var chVI = LIVRE.chapitres.filter(function (c) { return c.num === 'VI'; })[0];
  if (chVI) {
    var cibleVI = PAGES.length;
    var pt = document.createElement('article');
    pt.className = 'page-texte';
    pt.innerHTML = '<h3>' + chVI.titre + '</h3>';
    var ip2 = document.createElement('p');
    ip2.className = 'intro';
    ip2.textContent = chVI.intro || '';
    pt.appendChild(ip2);
    faire(pt);
    pageNumero(pt, pt._pos);
    SommairePos.items.push({ num: chVI.num, titre: chVI.titre, cible: cibleVI });
    cibles[chVI.num] = cibleVI;
    chVI.photos.forEach(function (ph) {
      var pleine = ph.pleine || (REG.pleines && REG.pleines.indexOf(ph.n) !== -1);
      if (pleine) pagePleine(ph.n, ph.legende, 'Chapitre ' + chVI.num + ' — ' + chVI.titre);
      else pagePhoto(ph);
    });
    pageLivreDor();
  }

  /* ---- page crédit (fin du livre) ---- */
  var creditEl = document.createElement('article');
  creditEl.className = 'page-credit';
  creditEl.innerHTML =
    '<span class="orneme">&#10086;</span>' +
    '<p class="credit">' + (LIVRE.credit || 'Photographies : Ferol\u2019B Photography') + '</p>' +
    '<p class="gratitude">Avec toute notre gratitude</p>';
  faire(creditEl);

  /* ---- remplissage du sommaire (positions désormais connues) ---- */
  SommairePos.items.forEach(function (it) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.innerHTML =
      '<span class="rn">' + it.num + '.</span>' +
      '<span>' + it.titre + '</span>' +
      '<span class="puce-dore">&#183;</span>';
    b.addEventListener('click', function () { allerA(it.cible); });
    li.appendChild(b);
    sommaireUl.appendChild(li);
  });

  /* ==========================================================
     4. MOTEUR : StPageFlip ou repli honnête
     ========================================================== */
  var livre = null;              /* instance StPageFlip */

  function majIndicateur() {
    var ind = $('#indicateur');
    if (!ind) return;
    if (livre) ind.textContent = (livre.getCurrentPageIndex() + 1) + ' / ' + livre.getPageCount();
  }

  function allerA(cible) {
    if (livre) {
      try { livre.turnToPage(cible); } catch (e) {}
      majIndicateur();
    } else if (PAGES[cible]) {
      PAGES[cible].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function initStPageFlip() {
    /* le UMD de page-flip expose la classe sous St.PageFlip (ou PageFlip) */
    var Classe = null;
    if (window.St && window.St.PageFlip) Classe = window.St.PageFlip;
    else if (typeof window.PageFlip === 'function') Classe = window.PageFlip;
    if (!Classe) return false;
    try {
      livre = new Classe(corps, {
        width: 520,
        height: 720,
        size: 'stretch',
        minWidth: 220,
        maxWidth: 1080,
        minHeight: 260,
        maxHeight: 840,
        usePortrait: true,          /* page simple sur téléphone, double sur ordinateur */
        drawShadow: true,
        showCover: true,            /* la couverture reste seule ; ensuite pages doubles */
        startPage: 0,
        flippingTime: 600,
        mobileScrollSupport: false
      });
      livre.loadFromHTML(PAGES);
      var chp = $('#chargeur');
      if (chp) chp.hidden = true;

      var rt = null;
      livre.on('flip', function (e) {
        majIndicateur();
        precharger(e.data);
      });
      livre.on('changeState', function (e) {
        clearTimeout(rt);
        rt = setTimeout(function () {
          majIndicateur();
          if (livre) precharger(livre.getCurrentPageIndex());
        }, 650);
      });

      majIndicateur();
      noterPositions();
      precharger(0);
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () {
          noterPositions();
          if (livre) precharger(livre.getCurrentPageIndex());
        }, 350);
      });
      return true;
    } catch (e) {
      livre = null;
      return false;
    }
  }

  function initRepli() {
    /* Le CDN n'a pas chargé (hors-ligne, réseau bloqué…).
       Lecture simple et honnête : les pages en défilement normal. */
    var chp = $('#chargeur');
    if (chp) chp.hidden = true;
    corps.innerHTML = '';
    corps.style.height = 'auto';
    corps.style.overflow = 'visible';
    var boite = document.createElement('div');
    boite.className = 'repli-livre';
    boite.innerHTML =
      '<h3>Le livre en lecture simple</h3>' +
      '<p>La bibliothèque de feuilletage n\u2019a pas pu être téléchargée sur cet appareil. ' +
      'Le livre reste entièrement lisible ci-dessous : sommaire, chapitres, photos et textes.</p>';

    var nav = document.createElement('div');
    nav.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:14px 0;';
    SommairePos.items.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn secondaire';
      b.textContent = it.num + '. ' + it.titre;
      b.addEventListener('click', function () {
        var pageEl = PAGES[it.cible];
        if (pageEl) pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      nav.appendChild(b);
    });
    boite.appendChild(nav);
    corps.appendChild(boite);

    /* les pages, déroulées verticalement ; chaque photo se charge au
       moment où elle est demandée (image → photo-XX.jpg puis studio-XX.jpg) */
    PAGES.forEach(function (p) {
      if (p === couvertureEl) return;
      var enveloppe = document.createElement('div');
      enveloppe.style.cssText = 'max-width:560px;margin:0 auto 18px;';
      var clone = p.cloneNode(true);
      clone.classList.add('page-du-livre');
      clone.style.cssText = 'position:static;height:auto;min-height:220px;box-shadow:none;';
      enveloppe.appendChild(clone);
      corps.appendChild(enveloppe);
      /* rebrancher les images du clone (elles avaient une src d'attente) */
      clone.querySelectorAll('.cadre-dor img').forEach(function (img) {
        var n = parseInt(img.dataset.photo || '', 10) || 0;
        if (!n) return;
        var aTenteAlternatif = false;
        img.onerror = function () {
          if (!aTenteAlternatif) {
            aTenteAlternatif = true;
            img.src = cheminAlternatif(n);
          } else {
            img.onerror = null;
            img.removeAttribute('src');
            remplacerParAttente(img);
          }
        };
        img.src = cheminFinal(n);
      });
    });

    /* zoom dans le repli : les clones ont perdu les listeners → délégation */
    corps.addEventListener('click', function (e) {
      var img = e.target.closest('.cadre-dor img');
      if (!img || !img.src || img.getAttribute('src').indexOf('data:image') === 0) return;
      var lg = img.closest('.page-du-livre');
      var texte = lg ? (lg.querySelector('.legende') || {}).textContent || '' : '';
      $('#zoom-image').src = img.src;
      $('#zoom-legende').textContent = texte;
      $('#zoom-photo').hidden = false;
    });

    $('#indicateur').textContent = 'simple';
    floater('Lecture simple : la bibliothèque de feuilletage n\u2019a pas pu être chargée.');
  }

  /* ==========================================================
     5. NAVIGATION : boutons, clavier, zoom
     ========================================================== */
  function naviguer(dir) {
    if (livre) {
      try { if (dir < 0) livre.flipPrev(); else livre.flipNext(); } catch (e) {}
      setTimeout(majIndicateur, 700);
    } else {
      var pages = $$('#corps-livre .page-du-livre');
      var courant = pages.filter(function (p) {
        var r = p.getBoundingClientRect();
        return r.top > -60 && r.top < window.innerHeight;
      })[0];
      var i = pages.indexOf(courant) + (dir < 0 ? -1 : 1);
      if (pages[i]) pages[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  $('#page-precedente').addEventListener('click', function () { naviguer(-1); });
  $('#page-suivante').addEventListener('click', function () { naviguer(1); });
  $('#aller-sommaire').addEventListener('click', function () { allerA(SommairePos.page); });

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
    if (!$('#zoom-photo').hidden) {
      if (e.key === 'Escape') fermerZoom();
      return;
    }
    if (e.key === 'ArrowLeft')  naviguer(-1);
    if (e.key === 'ArrowRight') naviguer(1);
    if (e.key === 'Home' && livre) { try { livre.turnToPage(0); majIndicateur(); } catch (x) {} }
  });

  function fermerZoom() { $('#zoom-photo').hidden = true; }
  $('#zoom-fermer').addEventListener('click', fermerZoom);
  $('#zoom-photo').addEventListener('click', function (e) {
    if (e.target === this) fermerZoom();
  });

  /* ==========================================================
     6. MUSIQUE (coupée par défaut)
     ========================================================== */
  (function () {
    var bouton = $('#musique-livre');
    var piste  = $('#piste-livre');
    var active = false;
    bouton.addEventListener('click', function () {
      if (!active) {
        if (!REG.musique) { floater('Aucune musique configurée (audio/musique.mp3 absent).'); return; }
        piste.src = REG.musique;
        piste.play().then(function () {
          active = true;
          bouton.setAttribute('aria-pressed', 'true');
          bouton.style.background = 'var(--bordeaux)';
          bouton.style.color = '#fff';
          floater('Musique d\u2019ambiance activée — re-cliquez pour l\u2019arrêter.');
        }).catch(function () {
          floater('Le fichier musical n\u2019a pas pu être lu (audio/musique.mp3 manquant ?).');
        });
      } else {
        active = false;
        piste.pause();
        piste.src = '';
        bouton.setAttribute('aria-pressed', 'false');
        bouton.style.background = '';
        bouton.style.color = '';
        floater('Musique coupée.');
      }
    });
  })();

  /* ==========================================================
     7. PÉTALES DISCRETS (au serveur de la lecture)
     ========================================================== */
  (function () {
    var ok = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (ok) return;
    for (var i = 0; i < 7; i++) {
      var p = document.createElement('span');
      p.className = 'petal-livre';
      var s = 7 + Math.random() * 9;
      p.style.width = s + 'px';
      p.style.height = (s * .82) + 'px';
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.animationDuration = (12 + Math.random() * 10) + 's';
      p.style.animationDelay = (-Math.random() * 18) + 's';
      document.body.appendChild(p);
    }
  })();

  /* ==========================================================
     8. DÉMARRAGE
     ========================================================== */
  if (!initStPageFlip()) initRepli();
  } /* fin demarrer */

  var attendre = (window.SiteContent && window.SiteContent.ready)
    ? window.SiteContent.ready
    : Promise.resolve();
  attendre.then(function () { demarrer(); });
})();
