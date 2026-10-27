/* ==========================================================
   LIVRE DES SOUVENIRS — données (textes + légendes)
   Bosseno Josiane & Olakiba Armand
   Ce fichier est le SEUL à modifier pour les textes et les
   légendes : il est également éditable depuis administration.html
   (rubrique « Livre », bouton « Télécharger livre-data.js mis à jour »).
   La liste des photos vient de REGLAGES.livre (galerie.js) :
   images/photo-01.jpg … photo-44.jpg, sans la 14.
   Si un fichier photo-XX.jpg manque, le livre utilise
   images/galerie/studio-XX.jpg automatiquement.
   ========================================================== */

window.LIVRE = {
  credit: window.REGLAGES.livre.credit,

  /* musique d'ambiance : coupée par défaut, le lecteur ♪ du livre permet de l'activer */
  musique: window.REGLAGES.livre.musique,

  sousTitreCouverture: 'Le plus beau chapitre commence ensemble',
  basCouverture: '10 & 12 décembre 2026 — Brazzaville, Congo',

  chapitres: [
    {
      num: 'I',
      titre: 'Deux cœurs, une promesse',
      photoOuverture: 31,          /* photo en pleine page, ouverture du chapitre */
      intro: "Avant les cérémonies, il y a déjà l’essentiel : deux regards qui se répondent et une promesse qui grandit. Ces portraits gardent la douceur d’un amour choisi, les sourires qui rassurent et cette joie discrète de se dire : l’avenir, nous l’écrirons à deux. Que ces premières pages ouvrent le récit d’une vie à construire, main dans la main.",
      photos: [
        { n: 1,  legende: 'L\u2019élégance dans la sérénité.' },
        { n: 6,  legende: 'Rayonnante dans sa dentelle corail.' },
        { n: 7,  legende: 'Un bouquet de roses rouges, un sourire lumineux.' },
        { n: 8,  legende: 'Un regard tendre, les mains jointes.' },
        { n: 9,  legende: 'L\u2019éclat de rire d\u2019un cœur comblé.' },
        { n: 10, legende: 'Posée et gracieuse.' },
        { n: 11, legende: 'La joie, tout simplement.' }
      ]
    },
    {
      num: 'II',
      titre: 'Premiers regards',
      intro: "Dans la lumière du studio, chaque pose révèle un peu de leur complicité. Un sourire offert, un regard échangé, une présence qui apaise : rien n’a besoin d’être dit quand deux personnes se comprennent ainsi. Ces premières images racontent la beauté simple d’avancer côte à côte.",
      photos: [
        { n: 2,  legende: 'Élégance en fleurs, de profil.' },
        { n: 3,  legende: 'Un sourire franc, une pose spontanée.' },
        { n: 4,  legende: 'Une joie qui se partage en famille.' },
        { n: 5,  legende: 'Poings levés : l\u2019énergie d\u2019une équipe soudée.' }
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
        { n: 19, legende: 'Dos à dos, unis pour la vie.' },
        { n: 20, legende: 'Les fleurs, et l\u2019émotion de se retrouver.' },
        { n: 21, legende: 'Côte à côte, simplement unis.' },
        { n: 22, legende: 'Un bouquet offert, un sourire qui répond.' },
        { n: 23, legende: 'Deux silhouettes, une même douceur.' }
      ]
    },
    {
      num: 'IV',
      titre: 'Élégance',
      intro: "Le bleu des grandes occasions, l’éclat des tenues et la sérénité des regards composent ces portraits. Mais la plus belle élégance se trouve dans les attentions : un geste protecteur, une main qui rejoint l’autre, un sourire qui dit « je suis là ». La beauté d’un amour se lit aussi dans ces détails.",
      photos: [
        { n: 24, legende: 'Un baiser sur le front, la tendresse en silence.' },
        { n: 25, legende: 'Elle rit, la main posée sur son épaule.' },
        { n: 26, legende: 'Appuyée sur lui, le regard lumineux.' },
        { n: 27, legende: 'Bras dessus, bras dessous.' },
        { n: 28, legende: 'Main dans la main, le sourire aux lèvres.' },
        { n: 29, legende: 'Un regard échangé, et tout est dit.' },
        { n: 30, legende: 'Il veille sur elle, elle lève les yeux vers lui.' },
        { n: 31, legende: 'Les mains en forme de cœur, un bonheur partagé.' },
        { n: 32, legende: 'Debout et assis, toujours ensemble.' },
        { n: 34, legende: 'Élégance et sérénité en bleu royal.' }
      ]
    },
    {
      num: 'V',
      titre: 'Complicité',
      intro: "La complicité, c’est cette joie qui trouve naturellement son chemin à deux. Un regard en coin, un rire partagé, une épaule contre laquelle se reposer : ces instants ont la légèreté des choses sincères. Que ces images rappellent toujours à Josiane et Armand le bonheur de se choisir, jour après jour.",
      photos: [
        { n: 33, legende: 'Assortis, complices, heureux.' },
        { n: 35, legende: 'Enlacés, dans la chaleur d\u2019un même regard.' },
        { n: 36, legende: 'La tête posée contre elle, les yeux fermés : un instant de paix.', pleine: true },
        { n: 37, legende: 'Lui assis, elle debout derrière lui.' },
        { n: 38, legende: 'Face à face, un sourire pour seul langage.' },
        { n: 39, legende: 'Le bras sur son épaule, fiers d\u2019être côte à côte.' },
        { n: 40, legende: 'De dos pour lui, face à nous pour elle : un clin d\u2019œil complice.' },
        { n: 41, legende: 'Debout, élégants et assortis.' },
        { n: 42, legende: 'Elle rit en le regardant, il lui rend son regard.' },
        { n: 43, legende: 'Leurs mains jointes, un geste simple qui dit l\u2019essentiel.' },
        { n: 44, legende: 'Enlacés, dans la douceur d\u2019une étreinte.' }
      ]
    },
    {
      num: 'VI',
      titre: 'À ceux que nous aimons',
      intro: "À nos parents, à nos familles, à nos parrains, à nos témoins et à nos amis : merci pour votre affection, vos prières, vos conseils et la place que vous avez dans nos vies. Votre présence à nos côtés rend cette promesse plus belle. Puisse ce livre garder un peu de cette joie et vous rappeler que vous en faites partie.",
      photos: []
    }
  ],

  /* page du livre d'or intégrée au livre */
  livreDor: {
    titre: 'Le livre d\u2019or',
    intro: "Un mot tendre, un vœu de bonheur ou un souvenir partagé : confiez-nous quelques lignes. Les mariés les liront avec émotion et, après leur accord, votre message rejoindra les souvenirs visibles par tous."
  }
};
