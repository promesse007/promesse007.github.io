/* ==========================================================
   ASSISTANT INTELLIGENT DE L'ALBUM — Olakiba Armand & Bosseno Josiane
   ----------------------------------------------------------
   Quand une photo est ajoutée, elle est « lue » par l'assistant
   qui propose automáticamente la catégorie de souvenirs qui
   convient (famille, joie, cérémonie, etc.).

   Honnêteté :
   - l'analyse se fait SUR L'APPAREIL (aucune photo n'est envoyée
     sur Internet) ;
   - le petit modèle d'intelligence (MobileNet) est téléchargé
     une seule fois depuis un serveur public de modèles ;
   - c'est une SUGGESTION : elle peut se tromper. On peut toujours
     corriger la catégorie dans le studio ;
   - sans Internet, l'assistant n'est pas disponible et la photo
     est rangée dans « Les meilleurs moments » d'où l'on peut
     la déplacer après.
   ========================================================== */
(function () {
  'use strict';

  var etat    = 'initial';   // 'initial' | 'chargement' | 'pret' | 'echec'
  var modele  = null;
  var promesse = null;

  /* correspondance : mots reconnus dans une photo → catégorie de l'album */
  var TABLE = [
    // tenues et personnes en tenue → portraits des mariés
    [/bridal gown|gown|tuxedo|suit|saree|sarong|kimono|robe de mari/i, 'portraits'],
    // fleurs et embellissements → moments de joie
    [/flower|bouquet|daisy|rose|tulip|sunflower|floral|wreath/i, 'joie'],
    // instruments et scènes → festivités
    [/musical|instrument|piano|guitar|drum|accordion|harmonica|banjo|stage|concert|ballet/i, 'festivites'],
    // bâtiments officiels → cérémonie civile
    [/church|monastery|palace|steeple|dome|castle|tower/i, 'civil'],
    // gâteau, table de fête → festivités
    [/cake|candle|table|plate|glass|napkin|bottle/i, 'festivites'],
    // joie, fêtes en plein air
    [/balloon|kite|swing|beach|seashore|sunglasses/i, 'joie']
  ];

  function chargerScript(url) {
    return new Promise(function (resoudre, rejeter) {
      var s = document.createElement('script');
      s.src = url;
      s.onload = function () { resoudre(); };
      s.onerror = function () { rejeter(new Error('impossible de charger ' + url)); };
      document.head.appendChild(s);
    });
  }

  function chargerLibrairies() {
    if (window.mobilenet) return Promise.resolve();
    return chargerScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js')
      .then(function () {
        return chargerScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js');
      });
  }

  function obtenirModele() {
    if (modele) {
      return Promise.resolve(modele);
    }
    if (!promesse) {
      etat = 'chargement';
      promesse = chargerLibrairies()
        .then(function () {
          return window.mobilenet.load({ version: 2, alpha: 0.5 });
        })
        .then(function (m) {
          modele = m;
          etat = 'pret';
          return m;
        })
        .catch(function (e) {
          etat = 'echec';
          promesse = null;
          throw e;
        });
    }
    return promesse;
  }

  /* Entrée : une image encodée (détail produit par la réduction).
     Sortie (promesse) : { cat: 'portraits', classe: 'bridal gown', confiance: 0.62 } */
  function suggerer(dataURL) {
    return obtenirModele().then(function (m) {
      return new Promise(function (resoudre, rejeter) {
        var img = new Image();
        img.onload = function () {
          m.classify(img, 3).then(resoudre, rejeter);
        };
        img.onerror = function () { rejeter(new Error('image illisible pour l\'assistant')); };
        img.src = dataURL;
      });
    }).then(function (predicitions) {
      for (var i = 0; i < predicitions.length; i++) {
        for (var j = 0; j < TABLE.length; j++) {
          if (TABLE[j][0].test(predicitions[i].className)) {
            return {
              cat: TABLE[j][1],
              classe: predicitions[i].className,
              confiance: Math.round(predicitions[i].probability * 100)
            };
          }
        }
      }
      // rien de reconnu parmi les familles de mots de l'album
      return { cat: 'meilleurs', classe: predicitions.length ? predicitions[0].className : '', confiance: 0 };
    });
  }

  window.AssistantImage = {
    suggerer: suggerer,
    /* état : 'pret' (analysera), 'chargement', 'echec' (pas de réseau) */
    etat: function () { return etat; }
  };
})();
