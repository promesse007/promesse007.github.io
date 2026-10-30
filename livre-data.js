/* ==========================================================
   LIVRE DES SOUVENIRS — données (textes + légendes)
   Bosseno Josiane & Olakiba Armand
   Ce fichier est le SEUL à modifier pour les textes et les
   légendes : il est également éditable depuis administration.html
   (rubrique « Livre », bouton « Télécharger livre-data.js mis à jour »).
   Les photos utilisent les WebP de la galerie (studio-XX.webp).
   Les légendes et l’ordre de lecture sont définis ci-dessous.
   ========================================================== */

window.LIVRE = {
  /* musique d'ambiance : coupée par défaut, le lecteur ♪ du livre permet de l'activer */
  musique: window.REGLAGES.livre.musique,

  sousTitreCouverture: 'Le plus beau chapitre commence ensemble',
  basCouverture: '10 & 12 décembre 2026 — Brazzaville, Congo',

  chapitres: [
    {
      num: 'I',
      titre: 'Deux cœurs, une promesse',
      photoOuverture: 1,           /* photo en pleine page, ouverture du chapitre */
      intro: "Avant les cérémonies, il y a déjà l’essentiel : deux regards qui se répondent et une promesse qui grandit. Ces portraits gardent la douceur d’un amour choisi, les sourires qui rassurent et cette joie discrète de se dire : l’avenir, nous l’écrirons à deux. Que ces premières pages ouvrent le récit d’une vie à construire, main dans la main.",
      photos: [
        { n: 1,  legende: 'Ensemble, au début de notre récit.' },
        { n: 6,  legende: 'Un instant complice, côte à côte.' },
        { n: 7,  legende: 'Un regard échangé pendant la séance.' },
        { n: 8,  legende: 'Un geste tendre, tout simplement.' },
        { n: 9,  legende: 'Assis l’un près de l’autre, unis.' },
        { n: 10, legende: 'La douceur d’un moment partagé.' },
        { n: 11, legende: 'Deux sourires, une même joie.' }
      ]
    },
    {
      num: 'II',
      titre: 'Complicité en chemises à carreaux',
      intro: "Dans la lumière du studio, chaque pose révèle un peu de leur complicité. Un sourire offert, un regard échangé, une présence qui apaise : rien n’a besoin d’être dit quand deux personnes se comprennent ainsi. Ces premières images racontent la beauté simple d’avancer côte à côte.",
      photos: [
        { n: 2,  legende: 'Un portrait à deux, dans la simplicité.' },
        { n: 3,  legende: 'Debout côte à côte devant l’objectif.' },
        { n: 4,  legende: 'Un sourire partagé pendant la séance.' },
        { n: 5,  legende: 'Proches l’un de l’autre, en toute confiance.' }
      ]
    },
    {
      num: 'III',
      titre: 'Tendresse',
      photoOuvertureTexte: true,
      intro: "La tendresse habite souvent les gestes les plus simples : une main posée, une épaule offerte, un bouquet tendu avec le cœur. Dans ces images, les regards se répondent sans bruit et la confiance se devine dans chaque sourire. Une douceur à feuilleter lentement, comme une promesse que l’on garde près de soi.",
      photos: [
        { n: 12, legende: 'Un regard qui dit tout.' },
        { n: 13, legende: 'Complices, tout simplement.' },
        { n: 15, legende: 'Légers, joyeux, unis.' },
        { n: 16, legende: 'La main posée sur son épaule, le sourire de la tendresse.' },
        { n: 17, legende: 'Deux cœurs, un même élan de joie.' },
        { n: 18, legende: 'Le bouquet de leurs promesses.' },
        { n: 19, legende: 'Un tendre moment dans les bras l’un de l’autre.' },
        { n: 20, legende: 'Leur étreinte, un instant partagé.' },
        { n: 21, legende: 'Un baiser et une étreinte tendre.' },
        { n: 22, legende: 'Un portrait posé, dans leurs tenues de cérémonie.' },
        { n: 23, legende: 'Deux silhouettes, une même douceur.' }
      ]
    },
    {
      num: 'IV',
      titre: 'Élégance',
      intro: "Le bleu des grandes occasions, l’éclat des tenues et la sérénité des regards composent ces portraits. Mais la plus belle élégance se trouve dans les attentions : un geste protecteur, une main qui rejoint l’autre, un sourire qui dit « je suis là ». La beauté d’un amour se lit aussi dans ces détails.",
      photos: [
        { n: 24, legende: 'Un bouquet de fleurs accompagne leur portrait.' },
        { n: 25, legende: 'Elle rit, la main posée sur son épaule.' },
        { n: 26, legende: 'Appuyée sur lui, le regard lumineux.' },
        { n: 27, legende: 'Bras dessus, bras dessous.' },
        { n: 28, legende: 'Main dans la main, le sourire aux lèvres.' },
        { n: 29, legende: 'Un regard échangé, et tout est dit.' },
        { n: 30, legende: 'Un geste joyeux au cours de la séance.' },
        { n: 31, legende: 'Les mains en forme de cœur, un bonheur partagé.' },
        { n: 32, legende: 'Un portrait tendre, près l’un de l’autre.' },
        { n: 34, legende: 'Josiane, élégante dans sa tenue corail.' }
      ]
    },
    {
      num: 'V',
      titre: 'Portraits et éclats de joie',
      intro: "Ces portraits gardent la lumière, les sourires et la joie de cette journée. Chaque image est une petite pause dans le temps, à retrouver et à partager au fil des pages.",
      photos: [
        { n: 35, legende: 'Josiane, souriante dans sa tenue corail.' },
        { n: 36, legende: 'Un éclat de joie, les bras levés.', pleine: true },
        { n: 37, legende: 'Un portrait plein d’assurance et de douceur.' },
        { n: 38, legende: 'Un sourire lumineux, sa main près du visage.' },
        { n: 39, legende: 'Josiane pose avec élégance.' }
      ]
    },
    {
      num: 'VI',
      titre: 'À ceux que nous aimons',
      intro: "À nos parents, à nos familles, à nos parrains, à nos témoins et à nos amis : merci pour votre affection, vos prières, vos conseils et la place que vous avez dans nos vies. Ces images gardent quelques instants partagés ; d’autres souvenirs et d’autres photos viendront les rejoindre au fil du temps. Notre histoire continue de s’écrire avec vous.",
      photos: [
        { n: 40, legende: 'Un portrait en bleu, dans une pose élégante.' },
        { n: 41, legende: 'Un portrait parmi les proches.' },
        { n: 42, legende: 'La famille réunie autour des mariés.' },
        { n: 43, legende: 'Un moment de joie partagé en famille.' },
        { n: 44, legende: 'Armand, élégant dans sa tenue de cérémonie.' }
      ]
    }
  ],

  /* page du livre d'or intégrée au livre */
  livreDor: {
    titre: 'Le livre d\u2019or',
    intro: "Un mot tendre, un vœu de bonheur ou un souvenir partagé : confiez-nous quelques lignes. Les mariés les liront avec émotion et, après leur accord, votre message rejoindra les souvenirs visibles par tous."
  }
};
