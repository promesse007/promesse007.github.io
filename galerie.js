/* ==========================================================
   ALBUM NUMÉRIQUE — Bosseno Josiane & Olakiba Armand
   ----------------------------------------------------------
   C'EST LE SEUL FICHIER À MODIFIER POUR AJOUTER VOS PHOTOS.
   Il se lit avec un simple éditeur de texte (le Bloc-notes
   ou VS Code). Aucune connaissance technique n'est nécessaire.

   Mode d'emploi rapide
   --------------------
   1. Copiez votre photo dans le dossier  images/galerie/
   2. Ajoutez une ligne dans la liste  PHOTOS  ci-dessous,
      en copiant le modèle et en changeant le nom du fichier,
      la catégorie et la légende.
   3. Enregistrez, puis actualisez le navigateur (F5).

   Les catégories autorisées sont listées dans  CATEGORIES.
   ========================================================== */

/* ---------- Catégories de souvenirs ---------- */
window.CATEGORIES = [
  { id: 'preparatifs', nom: 'Les préparatifs' },
  { id: 'portraits',   nom: 'Portraits des mariés' },
  { id: 'civil',       nom: 'La cérémonie civile' },
  { id: 'familles',    nom: 'Les familles' },
  { id: 'amis',        nom: 'Les amis et les invités' },
  { id: 'joie',        nom: 'Les moments de joie' },
  { id: 'groupe',      nom: 'Les photos de groupe' },
  { id: 'festivites',  nom: 'Les festivités' },
  { id: 'meilleurs',   nom: 'Les meilleurs moments' }
];

/* ---------- Réglages ---------- */
window.REGLAGES = {
  /* Date et heure de la cérémonie civile (année, mois, jour, heure, minute)
     10 décembre 2026 : dot   — 12 décembre 2026 : civil + bénédiction */
  dateMariage: '2026-12-12T10:00:00',

  /* Fichier musical à jouer depuis le dossier audio/ (ou '' pour aucun) */
  musique: 'audio/musique.mp3',

  /* Vidéo d'accueil : retirée de la page d'accueil à la demande.
     Pour la rétablir, remettez 'video/souvenirs.mp4' et ajoutez de nouveau
     la balise vidéo dans index.html (voir le guide LISEZ-MOI.md). */
  video: '',

  /* Nom affiché dans les messages du livre d'or */
  mariage: 'Bosseno Josiane et Olakiba Armand',

  /* Bouton d'installation Android (activer dans l'administration puis exporter ce fichier) */
  installationApp: false,

  /* LIVRE DES SOUVENIRS — WebP optimisés chargés directement.
     En cas d'absence, livre.js reprend automatiquement le JPG de repli. */
  livre: {
    dossier:  'images/galerie/',
    prefixe:  'studio-',
    extension: '.webp',
    de:       1,
    a:        44,
    sans:     [14],
    pleines:  [31, 36],        /* photos en pleine page */
    musique:  'audio/musique.mp3',
    credit:   'Photographies : Ferol\u2019B Photography'
  }
};

/* ---------- Notre histoire ----------
   Chaque bloc affiche : une photo (ou un cadre « photo à venir »),
   un titre, un texte et une date. Modifiez librement les textes.
   Pour ajouter une photo : mettez le chemin dans "image",
   et null si vous n'avez pas encore la photo du jour.        */
window.HISTOIRE = [
  {
    image: null,                       /* ex. 'images/galerie/ensemble.jpg' */
    titre: 'Le début de notre histoire',
    texte: "Il y a des histoires qui se construisent au fil des jours, dans la confiance, l’écoute et les projets partagés. Celle de Bosseno Josiane et Olakiba Armand s’écrit avec patience, tendresse et le désir d’avancer côte à côte. En décembre 2026, entourés de ceux qui leur sont chers, ils ouvriront un nouveau chapitre.",
    date: 'Une histoire à écrire à deux'
  },
  {
    image: 'images/galerie/studio-02.webp',
    titre: 'Les préparatifs',
    texte: "À mesure que le grand jour approche, chaque détail prend une place particulière. Cette séance en studio en garde une trace lumineuse : deux sourires, une complicité et la joie douce de se préparer à écrire la suite ensemble.",
    date: 'Octobre 2026 — séance studio'
  },
  {
    image: null,
    titre: 'La promesse célébrée en famille',
    texte: "Le jeudi 10 décembre 2026 à 10 h, la dot réunira nos familles à l’Espace Dongou Zidane, arrêt Deuxième Terre Jaune, à Kintélé. Le samedi 12 décembre à 10 h, nous célébrerons notre mariage civil à la mairie de Talangaï, puis la bénédiction nuptiale à 12 h à l’Église Seigneur Jésus-Christ. Deux journées de joie, de gratitude et de promesses, que nous avons hâte de partager avec vous.",
    date: '10 & 12 décembre 2026'
  },
  {
    image: 'images/galerie/studio-42.webp',
    titre: 'Les instants partagés',
    texte: "Un regard complice, une main posée sur l’épaule, les sourires de nos proches : ces instants simples disent déjà beaucoup. Cette photo de famille est un avant-goût de la joie que nous espérons partager avec vous lors de notre union.",
    date: 'Octobre 2026 — avec nos proches'
  }
];

/* ---------- Sous-parties de « Famille & invités » ----------
   Chaque bloc reprend les photos d'une catégorie.
   'categorie' doit correspondre à un identifiant de CATEGORIES. */
window.FAMILLE = [
  {
    categorie: 'familles',
    titre: 'Les familles',
    texte: "Parents, frères et sœurs, oncles et tantes : vos visages sont les racines de notre histoire et votre affection, une force précieuse pour le chemin qui s’ouvre."
  },
  {
    categorie: 'amis',
    titre: 'Les amis et les invités',
    texte: "À nos amis et à chacun de nos invités : merci de venir entourer notre bonheur et de faire partie de ces journées que nous garderons dans nos cœurs."
  },
  {
    categorie: 'groupe',
    titre: 'Les photos de groupe',
    texte: "Un même cadre, mille sourires et une joie partagée : que chacun retrouve ici sa place dans notre album de famille."
  }
];

/* ---------- GALERIE DE SOUVENIRS ----------
   MODÈLE À COPIER pour chaque nouvelle photo :

   { src: 'images/galerie/ma-photo.jpg', cat: 'preparatifs', legende: 'Ma légende' },

   • src     : le chemin du fichier image
   • cat     : l'identifiant de la catégorie (voir CATEGORIES)
   • legende  : texte affiché sous la photo (facultatif, peut être '')  */
window.PHOTOS = [
  /* ----- Portraits des mariés ----- */
  { src: 'images/portraits/armand.webp',  cat: 'portraits', legende: "Olakiba Armand — portrait des mariés" },
  { src: 'images/portraits/josiane.webp', cat: 'portraits', legende: "Bosseno Josiane — portrait des mariés" },

  /* ----- Séance studio : tenue en chemises carreaux ----- */
  { src: 'images/galerie/studio-01.webp', cat: 'portraits', legende: "Complicité en chemises carreaux" },
  { src: 'images/galerie/studio-02.webp', cat: 'portraits', legende: "Le couple — séance en chemises carreaux" },
  { src: 'images/galerie/studio-03.webp', cat: 'portraits', legende: "Le duo en chemises carreaux" },
  { src: 'images/galerie/studio-04.webp', cat: 'portraits', legende: "Un regard partagé" },
  { src: 'images/galerie/studio-05.webp', cat: 'portraits', legende: "Pose complice — séance carreaux" },
  { src: 'images/galerie/studio-06.webp', cat: 'portraits', legende: "Un geste tendre" },
  { src: 'images/galerie/studio-07.webp', cat: 'portraits', legende: "Sourires de dos — séance carreaux" },
  { src: 'images/galerie/studio-08.webp', cat: 'portraits', legende: "Assis et debout — duo complice" },
  { src: 'images/galerie/studio-09.webp', cat: 'portraits', legende: "Serrement de mains — pose carreaux" },
  { src: 'images/galerie/studio-10.webp', cat: 'portraits', legende: "Tendresse — séance carreaux" },
  { src: 'images/galerie/studio-11.webp', cat: 'portraits', legende: "Sérénité à deux — tenue carreaux" },

  /* ----- Séance studio : tenue bleue ----- */
  { src: 'images/galerie/studio-12.webp', cat: 'portraits', legende: "La mariée appuyée sur son époux — tenue bleue" },
  { src: 'images/galerie/studio-13.webp', cat: 'portraits', legende: "Enlacement tendre — tenue bleue" },
  { src: 'images/galerie/studio-14.webp', cat: 'portraits', legende: "Regard amoureux — tenue bleue" },
  { src: 'images/galerie/studio-15.webp', cat: 'portraits', legende: "Confiance et douceur — pose bleue" },
  { src: 'images/galerie/studio-17.webp', cat: 'portraits', legende: "Sourires complices — tenue bleue" },
  { src: 'images/galerie/studio-18.webp', cat: 'portraits', legende: "Le couple en tenue bleue" },
  { src: 'images/galerie/studio-19.webp', cat: 'portraits', legende: "Un bras protecteur — pose bleue" },
  { src: 'images/galerie/studio-21.webp', cat: 'portraits', legende: "Un baiser sur le front — tenue bleue" },
  { src: 'images/galerie/studio-37.webp', cat: 'portraits', legende: "Mains dans les mains — tenue bleue" },

  /* ----- Séance studio : tenue marron & pois ----- */
  { src: 'images/galerie/studio-22.webp', cat: 'portraits', legende: "Duo assis — tenue marron & pois" },
  { src: 'images/galerie/studio-23.webp', cat: 'portraits', legende: "Tendresse — tenue marron & pois" },
  { src: 'images/galerie/studio-24.webp', cat: 'portraits', legende: "L'offrande du bouquet rouge" },
  { src: 'images/galerie/studio-25.webp', cat: 'portraits', legende: "Dos à dos — complicité marron & pois" },
  { src: 'images/galerie/studio-26.webp', cat: 'portraits', legende: "Le bouquet rouge — sourires du couple" },
  { src: 'images/galerie/studio-27.webp', cat: 'portraits', legende: "Le bouquet rouge — regards tendres" },
  { src: 'images/galerie/studio-28.webp', cat: 'portraits', legende: "Dos à dos — silhouette marron & pois" },
  { src: 'images/galerie/studio-31.webp', cat: 'portraits', legende: "Main sur l'épaule — tenue marron & pois" },
  { src: 'images/galerie/studio-32.webp', cat: 'portraits', legende: "Séance marron & pois — couple debout" },
  { src: 'images/galerie/studio-33.webp', cat: 'portraits', legende: "Portrait du couple — tenue marron & pois" },

  /* ----- Portraits de la mariée ----- */
  { src: 'images/galerie/studio-16.webp', cat: 'portraits', legende: "La mariée au bouquet — robe corail" },
  { src: 'images/galerie/studio-34.webp', cat: 'portraits', legende: "La mariée en dentelle corail" },
  { src: 'images/galerie/studio-39.webp', cat: 'portraits', legende: "Portrait de la mariée — robe corail" },

  /* ----- Moments de joie ----- */
  { src: 'images/galerie/studio-20.webp', cat: 'joie',      legende: "Rire de complicité — pose de dos" },
  { src: 'images/galerie/studio-29.webp', cat: 'joie',      legende: "Poings levés — la joie du couple" },
  { src: 'images/galerie/studio-30.webp', cat: 'joie',      legende: "Fierté et bonheur — poings levés" },
  { src: 'images/galerie/studio-35.webp', cat: 'joie',      legende: "Allégresse — robe corail" },
  { src: 'images/galerie/studio-36.webp', cat: 'joie',      legende: "Victoire — poings levés en corail" },

  /* ----- Les familles ----- */
  { src: 'images/galerie/studio-40.webp', cat: 'familles',  legende: "Une proche du couple — toute en sourire" },
  { src: 'images/galerie/studio-41.webp', cat: 'familles',  legende: "Une proche du couple — élégance fleurie" },

  /* ----- Les photos de groupe ----- */
  { src: 'images/galerie/studio-42.webp', cat: 'groupe',    legende: "La famille réunie pour la séance photo" },
  { src: 'images/galerie/studio-43.webp', cat: 'groupe',    legende: "La famille réunie — séance de groupe" }

];

/* Les photos sont ajoutées par le propriétaire depuis l'administration. */
