# 💍 Souvenirs de notre mariage — Bosseno Josiane & Olakiba Armand

Album numérique du mariage de **Bosseno Josiane** & **Olakiba Armand** — célébré les **jeudi 10 et samedi 12 décembre 2026** à **Brazzaville (Kintélé, Talangaï), Congo**.

---

## 📁 Contenu du projet

| Fichier / dossier | Rôle |
|---|---|
| `index.html` | L'album — la page que vos proches ouvriront |
| `style.css` | Toute la mise en forme (couleurs, formes, animations) |
| `script.js` | Les fonctionnalités (galerie, visionneuse, filtres, compte à rebours) |
| `galerie.js` | **La liste de vos photos** — le seul fichier à modifier pour ajouter des images |
| `studio.html` | Atelier local : ajouter des photos depuis cet ordinateur, sans coder |
| `images/portraits/` | Les portraits des mariés (Armand, Josiane) |
| `images/galerie/` | **Vos photos de souvenirs** (dossier à remplir) |
| `video/souvenirs.mp4` | Vidéo animée d'accueil |
| `audio/` | Dossier pour votre musique (avec explications) |
| `LISEZ-MOI.md` | Ce guide |

---

## ▶️ 1. Ouvrir le site

Double-cliquez sur **`index.html`** : le site s'ouvre dans votre navigateur,
sur ordinateur comme sur téléphone.

L'écran d'accueil apparaît : cliquez sur **« Découvrir nos souvenirs »**.
La vidéo d'accueil démarre alors et vous faites défiler les sections.

---

## 📷 2. Ajouter vos photos — deux méthodes

### Méthode A — l'atelier (la plus simple, sans coder)

1. Ouvrez **`studio.html`** dans votre navigateur.
2. Cliquez sur la zone de dépôt (ou glissez vos photos dedans).
   Vous pouvez en sélectionner **plusieurs à la fois**.
3. Pour chaque photo : écrivez une **légende** et choisissez une **catégorie**.
4. Cliquez sur **« Enregistrer dans l'album »**.
5. Ouvrez `index.html` : vos photos sont dans la galerie, déjà rangées.

Vous pouvez ensuite modifier une légende ou supprimer une photo
depuis la carte « 2. Photos enregistrées sur cet ordinateur ».

> ⚠️ **Soyons précis sur cette méthode** : les photos sont conservées dans le
> navigateur **de cet ordinateur uniquement**. Elles n'apparaîtront pas sur le
> téléphone de vos proches. C'est idéal pour préparer l'album chez vous, puis
> utilisez la méthode B pour le diffuser.

### Méthode B — les fichiers (pour publier en ligne)

1. Copiez vos images dans le dossier **`images/galerie/`**
   (ex. `images/galerie/preparatifs-01.jpg`).
2. Ouvrez **`galerie.js`** avec le Bloc-notes (ou VS Code).
3. Ajoutez une ligne dans la liste `PHOTOS`, en copiant ce modèle :

```js
{ src: 'images/galerie/preparatifs-01.jpg', cat: 'preparatifs', legende: 'Derniers préparatifs de la mariée' },
```

4. Enregistrez le fichier, puis actualisez le navigateur (F5).

Conseils : photos en **portrait** (ratio 3:4), poids inférieur à 500 Ko,
prénommez vos fichiers sans espaces ni accents
(`preparatifs-01.jpg` plutôt que `photo préparatifs.jpg`).

---

## 🗂️ 3. Les catégories disponibles

Identifiants à utiliser dans `galerie.js` :

| Identifiant | Libellé affiché |
|---|---|
| `preparatifs` | Les préparatifs |
| `portraits` | Portraits des mariés |
| `civil` | La cérémonie civile |
| `familles` | Les familles |
| `amis` | Les amis et les invités |
| `joie` | Les moments de joie |
| `groupe` | Les photos de groupe |
| `festivites` | Les festivités |
| `meilleurs` | Les meilleurs moments |

Chaque catégorie devient automatiquement un bouton de filtre dans la galerie,
et alimente la section « Famille & invités ».

---

## 📖 4. Modifier les textes (« Notre histoire »)

Ouvrez **`galerie.js`**, section `HISTOIRE`. Chaque bloc contient :

```js
{
  image: null,                 // mettez le chemin, ex. 'images/galerie/notre-rencontre.jpg'
  titre: 'Le début de notre histoire',
  texte: 'Votre texte ici…',
  date: 'À compléter'
}
```

Tant qu'aucune photo n'est indiquée, un élégant cadre
« photo à venir » est affiché à sa place. Vous pouvez aussi ajouter
d'autres blocs en copiant ce modèle.

Les textes de la section « Famille & invités » se modifient de la même
manière, dans la section `FAMILLE`.

---

## 💐 5. Mettre en ligne (partager avec vos proches)

Le site est composé de fichiers statiques : il suffit de les mettre en ligne.

1. Rendez-vous sur **`app.netlify.com/drop`**
2. Glissez-déposez le dossier `invitation-mariage` entier
3. Vous obtenez immédiatement un lien à envoyer par WhatsApp

Autres solutions possibles : GitHub Pages, Vercel, Cloudflare Pages.

> Après la mise en ligne, envoyez le lien **et** dites à vos proches d'ajouter
> leurs propres photos : elles seront enregistrées sur le serveur Netlify,
> dans le dossier publié, et visibles par tout le monde.

---

## 🎵 6. Ajouter la musique

1. Placez votre fichier dans **`audio/`** et nommez-le `musique.mp3`.
2. Actualisez la page (F5).

La musique **ne démarre jamais automatiquement** : vos visiteurs doivent
cliquer sur le bouton ♪ en bas à droite. C'est un choix volontaire,
aussi bien de confort que de respect de la vie privée.

Musique libre de droits (utilisation légale) :
- Pixabay Music — `https://pixabay.com/music/`
- Free Music Archive — `https://freemusicarchive.org/`
- YouTube Audio Library — `https://www.youtube.com/audiolibrary`

---

## ✍️ 7. Le livre d'or

Un site fait uniquement de fichiers ne peut pas enregistrer des messages
sur Internet : il a besoin d'un service de réception. Voici comment
l'activer réellement (sans simulation) :

1. Créez un compte sur **`formspree.io`** (gratuit pour 50 messages/mois).
2. Créez un formulaire et copiez son adresse
   (ex. `https://formspree.io/f/abcdwxyz`).
3. Ouvrez **`galerie.js`**, ligne `formspree:`, et remplacez :

```js
formspree: 'VOTRE-ID-FORMSPREE',
```
par
```js
formspree: 'https://formspree.io/f/abcdwxyz',
```

4. Enregistrez. Les messages arriveront dans votre tableau de bord Formspree,
et peuvent vous être envoyés par e-mail.

Tant que cette étape n'est pas faite, le formulaire l'indique honnêtement
à vos visiteurs : aucun message n'est enregistré silencieusement.

---

## 🎬 8. En faire une vidéo

1. Ouvrez `index.html` dans Chrome, en plein écran (F11).
2. Lancez l'enregistrement : **Windows + G** (Xbox Game Bar)
   ou **OBS Studio** (gratuit, plus complet).
3. Cliquez sur « Découvrir nos souvenirs », puis descendez lentement
   la page pour filmer chaque section.
4. Montez le résultat dans CapCut (gratuit) et ajoutez la musique.

---

## ✏️ 9. Personnalisation rapide

| À changer | Où chercher |
|---|---|
| Date du compte à rebours | `galerie.js` → `dateMariage` |
| Adresse e-mail / livre d'or | `galerie.js` → `formspree` |
| Fichier de musique | `galerie.js` → `musique` |
| Vidéo d'accueil | `galerie.js` → `video` |
| Couleurs, polices, formes | `style.css` → bloc `:root` |
| Textes des sections | `index.html` (sections fixes) et `galerie.js` (listes) |

---

## ✅ 10. Vérifications déjà effectuées

- Noms corrects partout : **Bosseno Josiane** (la mariée, toujours en premier) et **Olakiba Armand**
  (aucune occurrence de l'ancienne orthographe)
- Dates et lieux affichés : jeudi 10 décembre 2026 (Dot, Espace Dongou Zidane, Kintélé) ; samedi 12 décembre 2026 (civil 10h Mairie de Talangaï, bénédiction 12h à l'église)
- Horaires conservés : Mairie 08h00 • Dot 12h00 • Mariage 16h00
- Compte à rebours fonctionnel
- Filtres par catégorie, galerie, visionneuse (agrandissement, flèches,
  clavier, fermeture par Échap)
- Ajout / modification / suppression de photos testé de bout en bout
- Affichage sur téléphone, tablette et ordinateur
- Aucune erreur dans la console du navigateur
- Musique jamais lancée sans action du visiteur

---

## 📚 11. Le livre des souvenirs (nouveau)

Une page entière `livre.html` propose **« Le livre des souvenirs »** : un vrai livre
numérique à feuilleter (couverture, sommaire cliquable, pages qui se tournent),
ouvert depuis le menu du site (« Le livre »).

**Chapitres** : I. Les mariés · II. Famille et proches · III. Tendresse ·
IV. Élégance · V. Complicité · VI. Remerciements — puis le livre d'or intégré
et la page de crédit **« Photographies : Ferol'B Photography »**.

### Ce que le livre fait déjà
- Double page sur ordinateur, page simple sur téléphone (adaptation automatique)
- Navigation : au doigt (glisser), au clavier (flèches ← →, Accueil, Échap),
  et par les boutons « Précédente / Suivante / Sommaire »
- Sommaire cliquable : amène exactement à la 1re page de chaque chapitre
- Zoom sur chaque photo au clic (fermeture par Échap ou ✕)
- Chargement différé : seules les pages proches de la page courante se chargent
- Aucune déformation : les photos gardent leurs proportions, cadre doré fin
- Pleines pages : photo 31 (ouverture du chapitre I) et photo 36 (chapitre V)
- Livre d'or intégré relié à Formspree (même réglage que le site)
- Musique d'ambiance : **toujours coupée par défaut**, bouton ♪ à droite
- Si l'appareil ne télécharge pas la bibliothèque de feuilletage :
  lecture simple honnête (pages en défilement) — rien n'est cassé

### Les photos du livre
- Noms finaux : `images/photo-01.jpg` → `photo-44.jpg` (sans la 14)
- Tant qu'un fichier `photo-XX.jpg` n'existe pas, le livre utilise
  automatiquement `images/galerie/studio-XX.jpg` — aucune page vide
- Textes et légendes **en un seul fichier** : `livre-data.js`

### Modifier les textes du livre
- À la main : ouvrez `livre-data.js` (introductions de chapitres, légendes)
- Depuis l'administration : rubrique **« Livre des souvenirs »** → modifiez
  titres, introductions, légendes, couverture et crédit → bouton
  « Télécharger livre-data.js mis à jour » → remplacez l'ancien fichier → git push

---

## 🔒 12. Le cadenas de l'administration (nouveau)

La page `administration.html` est désormais **protégée par un mot de passe
personnel** : à l'ouverture, un écran de connexion (cadenas) masque tout le
reste de la page.

### Les grands principes
- **Un seul compte : le vôtre.** À la première ouverture, la page vous
  propose de **créer votre mot de passe** (10 caractères ou plus —
  plus c'est long, plus c'est sûr).
- **Le mot de passe n'est jamais enregistré.** Nulle part, ni en clair ni
  « décodable ». La page ne conserve que son **empreinte** : le résultat
  d'un calcul à sens unique (PBKDF2, 120 000 tours). Qui lit les fichiers
  du site ne peut pas retrouver le mot de passe.
- **~2 secondes de calcul à chaque essai.** C'est voulu : quelqu'un qui
  essaierait des milliers de mots de passe perdrait des années.
- **5 essais faux bloquent la porte** sur l'appareil (1 minute, puis 2,
  4… jusqu'à 30 minutes). Oublier trop de fois = attendre ; c'est normal.
- **Fermeture automatique après 20 minutes sans activité** (bouton
  « 🔒 Verrouiller » aussi, dans le bandeau latéral).
- **Rien ne circule sur internet :** la vérification se fait dans votre
  propre navigateur.

### La première fois
1. Ouvrez `administration.html` → l'écran demande de **créer l'accès**.
2. Choisissez le mot de passe, confirmez, entrez.
3. La page télécharge un nouveau **`acces-config.js`** — remplacez l'ancien
   fichier dans le dossier du site puis repoussez sur GitHub
   (méthode identique aux autres exports de l'administration).

### Changer le mot de passe
Dans l'administration → rubrique **Réglages** → carte **« Cadenas de
l'administration »** : mot de passe actuel, nouveau, confirmation → le
nouveau `acces-config.js` est téléchargé (même remplacement à faire).

### En cas d'oubli
Si vous oubliez le mot de passe : effacez dans le fichier
`acces-config.js` la valeur de `empreinte` (laissez `empreinte: ''`),
remettez le fichier en ligne, et l'écran de création revient. 
C'est le « passe-partout » de secours — gardez-le pour vous seul.

### Les limites honnêtes d'un site statique
Le site est hébergé comme des fichiers simples (GitHub Pages) :
- Nous avons rendu l'intrusion **très difficile** (empreinte,
  blocage, délais) mais il faut savoir qu'un attaquant déterminé qui
  télécharge les fichiers peut tenter de deviner le mot de passe
  **hors ligne**. La vraie forteresse : un mot de passe **long et
  unique** (une phrase de 4–5 mots inattendues est idéale).
- Le rempart complémentaire : **activez la double authentification
  (2FA) sur votre compte GitHub** — même si quelqu'un trouve le mot de
  passe de la page, il ne pourra pas remplacer vos fichiers.
- Pour une protection « d'entreprise » (encore plus forte), un service
  comme Cloudflare Access peut être ajouté plus tard — à discuter.
