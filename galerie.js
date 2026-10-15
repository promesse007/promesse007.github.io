/* ==========================================================
   DONNÉES DE L'ALBUM — Olakiba Armand & Bossenoura Josiane
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
  /* Date et heure du mariage (année, 1 à 12, jour, heure, minute) */
  dateMariage: '2026-12-11T16:00:00',

  /* Fichier musical à jouer depuis le dossier audio/ (ou '' pour aucun) */
  musique: 'audio/musique.mp3',

  /* Vidéo d'accueil depuis le dossier video/ (ou '' pour n'afficher que l'affiche) */
  video: 'video/souvenirs.mp4',

  /* LIVRE D'OR — laissez 'VOTRE-ID-FORMSPREE' tant que le service n'est pas configuré.
     Créez un compte sur https://formspree.io, créez un formulaire, puis collez ici
     l'adresse complète obtenue (elle ressemble à https://formspree.io/f/abcdwxyz). */
  formspree: 'VOTRE-ID-FORMSPREE',

  /* Nom affiché dans les messages du livre d'or */
  mariage: 'Olakiba Armand et Bossenoura Josiane'
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
    texte: "Notre rencontre, nos premiers projets communs et la décision de faire notre vie ensemble : voilà le début de tout. Cet espace est prévu pour les photos et les souvenirs qui ont marqué nos premières années.",
    date: 'À compléter'
  },
  {
    image: null,
    titre: 'Les préparatifs',
    texte: "Les essayages, les préparatifs de la cérémonie, les derniers détails et l'impatience qui monte à mesure que la date approche. Conservez ici les photos de ces moments de dernière ligne droite.",
    date: 'À compléter'
  },
  {
    image: null,
    titre: 'Le jour de la cérémonie',
    texte: "Le vendredi 11 décembre 2026 : la cérémonie civile à la Mairie de Brazzaville, le dot, puis la célébration de notre union entourés de nos familles et de nos amis. Cette page accueillera les photos de cette journée.",
    date: 'Vendredi 11 décembre 2026'
  },
  {
    image: null,
    titre: 'Les instants partagés',
    texte: "Les échanges avec nos proches, les prières, les conseils reçus et les promesses échangées. Autant de souvenirs que nous souhaitons garder précieusement.",
    date: 'À compléter'
  }
];

/* ---------- Sous-parties de « Famille & invités » ----------
   Chaque bloc reprend les photos d'une catégorie.
   'categorie' doit correspondre à un identifiant de CATEGORIES. */
window.FAMILLE = [
  {
    categorie: 'familles',
    titre: 'Les familles',
    texte: "Parents, frères et sœurs, oncles et tantes, les visages de ceux qui nous ont vu grandir."
  },
  {
    categorie: 'amis',
    titre: 'Les amis et les invités',
    texte: "Ceux qui ont fait le déplacement et partagé notre joie en ce vendredi 11 décembre 2026."
  },
  {
    categorie: 'groupe',
    titre: 'Les photos de groupe',
    texte: "Les souvenirs collectifs de la journée, pour que chacun retrouve sa place."
  }
];

/* ---------- GALERIE DE SOUVENIRS ----------
   MODÈLE À COPIER pour chaque nouvelle photo :

   { src: 'images/galerie/ma-photo.jpg', cat: 'preparatifs', legende: 'Ma légende' },

   • src     : le chemin du fichier image
   • cat     : l'identifiant de la catégorie (voir CATEGORIES)
   • legende  : texte affiché sous la photo (facultatif, peut être '')  */
window.PHOTOS = [
  { src: 'images/portraits/armand.jpg',  cat: 'portraits', legende: "Olakiba Armand — portrait des mariés" },
  { src: 'images/portraits/josiane.jpg', cat: 'portraits', legende: "Bossenoura Josiane — portrait des mariés" },
  { src: 'images/affiche.jpg',           cat: 'civil',     legende: "Notre invitation de mariage" }
];

/* Exemples d'ajout (supprimez les // du début pour les activer) :
{ src: 'images/galerie/preparatifs-01.jpg', cat: 'preparatifs', legende: 'Derniers préparatifs de la mariée' },
{ src: 'images/galerie/civil-01.jpg',       cat: 'civil',       legende: 'Devant la Mairie de Brazzaville' },
{ src: 'images/galerie/famille-01.jpg',     cat: 'familles',    legende: 'Avec les oncles et tantes' },
{ src: 'images/galerie/groupe-01.jpg',      cat: 'groupe',      legende: 'Photo de groupe après la cérémonie' },
*/
