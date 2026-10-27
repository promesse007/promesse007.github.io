/* ==========================================================
   Cadenas de l'administration — bibliothèque (sans dépendance)
   SHA-256 + PBKDF2-HMAC-SHA256 en JavaScript pur : fonctionne
   partout (aussi en ouverture locale file://).
   Le mot de passe est JAMAIS stocké, ni en clair ni réversible :
   seule son « empreinte » PBKDF2 existe (fichier acces-config.js).
   ========================================================== */
(function (fenetre) {
  'use strict';

  /* ---------- SHA-256 (implémentation compacte, entrée octets ≤ 255) ---------- */
  var SHA256 = fenetre.SHA256 = function sha256(ascii) {
    function rightRotate(valeur, montant) { return (valeur >>> montant) | (valeur << (32 - montant)); }
    var math = Math;
    var asciiBitLength = ascii.length * 8;
    var result = '';
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k.length;
    var isComposite = {};

    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (var i = 0; i < 313; i += candidate) { isComposite[i] = candidate; }
        hash[primeCounter] = (math.pow(candidate, 0.5) * 4294967296) | 0;
        k[primeCounter++] = (math.pow(candidate, 1 / 3) * 4294967296) | 0;
      }
    }

    ascii += '\x80';
    var bits = [];
    while (ascii.length % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) {
      var j = ascii.charCodeAt(i);
      if (j >> 8) return '';                     /* l'entrée doit être des octets */
      bits[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    bits[bits.length] = ((asciiBitLength / 4294967296) | 0);
    bits[bits.length] = asciiBitLength;

    /* les 8 valeurs de l'état courent dans o0..o7 : le tableau sha256.h
       (cache des constantes) n'est jamais muté */
    var o0, o1, o2, o3, o4, o5, o6, o7;
    for (j = 0; j < bits.length;) {
      var w = bits.slice(j, j += 16);
      if (j === 16) {                       /* premier bloc : état initial */
        o0 = hash[0]; o1 = hash[1]; o2 = hash[2]; o3 = hash[3];
        o4 = hash[4]; o5 = hash[5]; o6 = hash[6]; o7 = hash[7];
      }
      var a = o0, b = o1, c = o2, d = o3, e = o4, f = o5, g = o6, h = o7;

      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15];
        var w2 = w[i - 2];
        if (i >= 16) {
          w[i] = (w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0;
        }
        var S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        var ch = (e & f) ^ ((~e) & g);
        var T1 = (h + S1 + ch + k[i] + w[i]) | 0;
        var S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var T2 = (S0 + maj) | 0;
        h = g; g = f; f = e;
        e = (d + T1) | 0;
        d = c; c = b; b = a;
        a = (T1 + T2) | 0;
      }

      o0 = (o0 + a) | 0; o1 = (o1 + b) | 0; o2 = (o2 + c) | 0; o3 = (o3 + d) | 0;
      o4 = (o4 + e) | 0; o5 = (o5 + f) | 0; o6 = (o6 + g) | 0; o7 = (o7 + h) | 0;
    }

    var etat = [o0, o1, o2, o3, o4, o5, o6, o7];
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (etat[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : '') + b.toString(16);
      }
    }
    return result;
  };

  /* ---------- utilitaires octets (chaîne = 1 caractère ≤ 255 par octet) ---------- */
  fenetre.__acces_utf8 = function (s) {
    return unescape(encodeURIComponent(s == null ? '' : String(s)));
  };
  fenetre.__acces_hex_vers_octets = function (hex) {
    var sortie = '';
    for (var i = 0; i + 1 < hex.length; i += 2) {
      sortie += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return sortie;
  };
  fenetre.__acces_octets_vers_hex = function (chaine) {
    var sortie = '', b;
    for (var i = 0; i < chaine.length; i++) {
      b = chaine.charCodeAt(i) & 255;
      sortie += (b < 16 ? '0' : '') + b.toString(16);
    }
    return sortie;
  };

  /* ---------- HMAC-SHA256 (binaire interne, chaînes d'octets) ---------- */
  /*
     Optimisation : dans le HMAC, le premier bloc (le pad de 64 octets,
     identique à chaque appel) est précalculé une seule fois par
     EMPREINTE ; à chaque itération seul le bloc final est haché.
     Deux chemins de calcul coexistent (SHA256 sur chaînes et « rondes »
     sur états) : ils se vérifient mutuellement dans les tests.
  */
  function rotationDroite(valeur, montant) { return (valeur >>> montant) | (valeur << (32 - montant)); }

  /* 64 rounds sur un bloc de 16 mots à partir d'un état de 8 mots */
  function rondes(etat, w) {
    var o0 = etat[0], o1 = etat[1], o2 = etat[2], o3 = etat[3],
        o4 = etat[4], o5 = etat[5], o6 = etat[6], o7 = etat[7];
    var a = o0, b = o1, c = o2, d = o3, e = o4, f = o5, g = o6, h = o7;
    for (var i = 0; i < 64; i++) {
      var w15 = w[i - 15];
      var w2 = w[i - 2];
      if (i >= 16) {
        w[i] = (w[i - 16]
          + (rotationDroite(w15, 7) ^ rotationDroite(w15, 18) ^ (w15 >>> 3))
          + w[i - 7]
          + (rotationDroite(w2, 17) ^ rotationDroite(w2, 19) ^ (w2 >>> 10))
        ) | 0;
      }
      var S1 = rotationDroite(e, 6) ^ rotationDroite(e, 11) ^ rotationDroite(e, 25);
      var ch = (e & f) ^ ((~e) & g);
      var T1 = (h + S1 + ch + fenetre.SHA256.k[i] + w[i]) | 0;
      var S0 = rotationDroite(a, 2) ^ rotationDroite(a, 13) ^ rotationDroite(a, 22);
      var maj = (a & b) ^ (a & c) ^ (b & c);
      var T2 = (S0 + maj) | 0;
      h = g; g = f; f = e;
      e = (d + T1) | 0;
      d = c; c = b; b = a;
      a = (T1 + T2) | 0;
    }
    return [(o0 + a) | 0, (o1 + b) | 0, (o2 + c) | 0, (o3 + d) | 0,
            (o4 + e) | 0, (o5 + f) | 0, (o6 + g) | 0, (o7 + h) | 0];
  }

  /* 64 octets → 16 mots de 32 bits */
  function motsDepuis(b64) {
    var w = new Array(16);
    for (var i = 0; i < 16; i++) {
      var p = i * 4;
      w[i] = ((b64.charCodeAt(p) & 255) << 24) | ((b64.charCodeAt(p + 1) & 255) << 16)
           | ((b64.charCodeAt(p + 2) & 255) << 8) | (b64.charCodeAt(p + 3) & 255);
    }
    return w;
  }

  /* bloc final unique : données + bourrage + longueur (données ≤ 55 octets) */
  function blocFinal(donnees, longueurTotale) {
    var s = donnees + '\x80';
    var bits = longueurTotale * 8;
    var hi = Math.floor(bits / 4294967296);
    var lo = bits - hi * 4294967296;
    var queue = [Math.floor(hi / 16777216) & 255, Math.floor(hi / 65536) & 255, Math.floor(hi / 256) & 255, hi & 255,
                 Math.floor(lo / 16777216) & 255, Math.floor(lo / 65536) & 255, Math.floor(lo / 256) & 255, lo & 255];
    while (s.length < 56) s += '\x00';
    for (var i = 0; i < 8; i++) s += String.fromCharCode(queue[i]);
    return s;                                            /* 64 octets exacts */
  }

  function motsVersOctets(etat) {
    var result = '';
    for (var i = 0; i < 8; i++) {
      result += String.fromCharCode((etat[i] >>> 24) & 255, (etat[i] >>> 16) & 255, (etat[i] >>> 8) & 255, etat[i] & 255);
    }
    return result;
  }

  function preparerHmac(cleOctets) {
    var B = 64;
    var cle = cleOctets.length > B
      ? fenetre.__acces_hex_vers_octets(fenetre.SHA256(cleOctets))
      : cleOctets;
    while (cle.length < B) cle += '\x00';
    var ipad = '', opad = '';
    for (var i = 0; i < B; i++) {
      var c = cle.charCodeAt(i);
      ipad += String.fromCharCode(c ^ 0x36);
      opad += String.fromCharCode(c ^ 0x5c);
    }
    fenetre.SHA256('');                                  /* garantit SHA256.h et SHA256.k prêts */
    var etatInitial = [fenetre.SHA256.h[0], fenetre.SHA256.h[1], fenetre.SHA256.h[2], fenetre.SHA256.h[3],
                       fenetre.SHA256.h[4], fenetre.SHA256.h[5], fenetre.SHA256.h[6], fenetre.SHA256.h[7]];
    var milieuInterne = rondes(etatInitial, motsDepuis(ipad));   /* état après le bloc ipad */
    var milieuExterne = rondes(etatInitial, motsDepuis(opad));   /* état après le bloc opad */
    var versOctets = fenetre.__acces_hex_vers_octets;
    return function (donneesOctets) {
      var interne = rondes(milieuInterne, motsDepuis(blocFinal(donneesOctets, B + donneesOctets.length)));
      var externe = rondes(milieuExterne, motsDepuis(blocFinal(motsVersOctets(interne), B + 32)));
      return motsVersOctets(externe);                    /* 32 octets */
    };
  }

  /* ---------- PBKDF2-HMAC-SHA256 → empreinte hexadécimale (32 octets) ---------- */
  fenetre.EMPREINTE = function (motDePasse, selHex, iterations) {
    var passe = fenetre.__acces_utf8(motDePasse);
    var sel = fenetre.__acces_utf8(selHex);
    var hmac = preparerHmac(passe);
    var u = hmac(sel + '\x00\x00\x00\x01');          /* U1 = HMAC(mdp, sel ‖ 1) */
    var acc = new Uint8Array(32);
    var i, j;
    for (j = 0; j < 32; j++) acc[j] = u.charCodeAt(j);
    for (i = 1; i < iterations; i++) {
      u = hmac(u);                                    /* Ui = HMAC(mdp, Ui-1) */
      for (j = 0; j < 32; j++) acc[j] ^= u.charCodeAt(j);
    }
    var hex = '';
    for (j = 0; j < 32; j++) {
      hex += (acc[j] < 16 ? '0' : '') + acc[j].toString(16);
    }
    return hex;
  };
})(window);
