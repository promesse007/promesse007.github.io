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

  sousTitreCouverture: 'Le livre de nos souvenirs',
  basCouverture: '11 décembre 2026 séance studio — Brazzaville, Congo',

  chapitres: [
    {
      num: 'I',
      titre: 'Les mariés',
      photoOuverture: 31,          /* photo en pleine page, ouverture du chapitre */
      intro: 'Avant les invités, avant les paroles et les vœux, il y a eu vous deux. Ces portraits sont ceux de la promesse : un regard lumineux, un sourire qui avance vers l\u2019avenir. Chaque photo raconte à sa manière la patience d\u2019un amour qui grandit, et la joie d\u2019être enfin mariés. Tournez les pages doucement : c\u2019est votre histoire qui commence.',
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
      titre: 'Famille et proches',
      intro: 'Une union de deux cœurs, c\u2019est aussi une rencontre de deux familles. Ici, les visages qui nous ont vu grandir, qui nous ont conseillés et portés depuis toujours. Leur fierté se lit sur chaque portrait, leurs sourires soutiennent notre pas. Ces pages leur appartiennent, car le bonheur, sans les leurs, ne serait pas complet. (Prénoms à personnaliser dans les légendes.)',
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
      intro: 'Tenue brune, regards doux : ce moment du studio garde la couleur de la confiance. Ce sont les gestes simples qui parlent le plus fort — une main posée, un dos-à-dos, un bouquet tendu. Rien n\u2019est joué, tout est vrai. Ces pages gardent la mémoire d\u2019une tendresse qui ne demande rien, et qui donne tout.',
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
      intro: 'Le bleu roi des grandes occasions, le port altier des amoureux. Dans ces images, la tenue se fait lumière et les silhouettes dessinent une promesse. Un baiser sur le front vaut tous les discours ; une main dans la main vaut tous les serments. C\u2019est l\u2019élégance d\u2019un amour qui a choisi de durer.',
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
      intro: 'Les carreaux assortis, les rires qui s\u2019étonnent eux-mêmes : la complicité, c\u2019est de la joie qui marche à deux. Ici tout est léger, spontané, sincère — une étreinte douce, un regard en coin, une épaule qui soutient. Le bonheur des mariés ne se décrète pas, il se voit. Ces pages en sont la preuve vivante.',
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
      titre: 'Remerciements',
      intro: 'Gratitude à nos parents, nos familles et nos parrains, pour leur force et leurs prières. Merci à nos témoins et à nos amis, pour leur présence et leurs éclats de rire. Merci à ceux venus de loin, et à ceux qui, de près, ont tout rendu possible. Vous avez écrit, avec nous, les plus belles pages de ce livre.',
      photos: []
    }
  ],

  /* page du livre d'or intégrée au livre */
  livreDor: {
    titre: 'Le livre d\u2019or',
    intro: 'Quelques mots dans ces pages vivront plus longtemps que la fête. Écrivez votre vœu, votre souvenir ou un fragment de votre joie : il sera déposé précieusement dans notre livre d\u2019or.'
  }
};
