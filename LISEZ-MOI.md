# 💍 Souvenirs de notre mariage — Olakiba Armand & Bosseno Josiane

Album numérique du mariage célébré le **vendredi 11 décembre 2026** à la **Mairie de Brazzaville, Congo**.

---

## 📁 Contenu du projet

| Fichier / dossier | Rôle |
|---|---|
| `index.html` | L'album — la page que vos proches ouvriront |
| `style.css` | Toute la mise en forme (couleurs, formes, animations) |
| `script.js` | Les fonctionnalités (galerie, recherche, visionneuse, film, musique) |
| `galerie.js` | **La liste de vos photos et réglages** — le fichier de référence |
| `intelligence.js` | L'assistant intelligent qui range automatiquement les photos ajoutées |
| `studio.html` | Atelier local : ajouter des photos depuis cet ordinateur, sans coder |
| `images/portraits/` | Les portraits des mariés (Armand, Josiane) |
| `images/galerie/` | **Les 44 photos de la séance studio** + l'affiche d'invitation |
| `audio/` | Dossier pour votre musique (avec explications) |
| `LISEZ-MOI.md` | Ce guide |

> 💡 Les fichiers `video/` et `correspondance-photos-studio.txt` restent sur
> cet ordinateur ; ils ne sont pas publiés (voir `.gitignore`).

---

## ▶️ 1. Ouvrir le site

Double-cliquez sur **`index.html`** : le site s'ouvre dans votre navigateur,
sur ordinateur comme sur téléphone.

L'écran d'accueil apparaît : cliquez sur **« Découvrir nos souvenirs »**,
puis le site vous accompagne : couverture décorée (bordeaux et or, anneaux
d'alliances), compte à rebours, notre histoire, les mariés, la galerie,
les familles et le livre d'or.

---

## 📷 2. Ajouter vos photos

### Méthode A — le bouton « + Ajouter des photos » (le plus simple)

1. Dans la galerie de souvenirs, cliquez sur **« + Ajouter des photos »**.
2. Choisissez vos photos depuis l'ordinateur ou le téléphone.
3. Chaque photo est analysée par **l'assistant intelligent**   qui la
   range automatiquement dans la bonne catégorie (appareil sans
   internet : elle est mise dans « Les meilleurs moments »).
4. Un message confirme le tout, et la galerie se met à jour immédiatement.

### Méthode B — le studio `studio.html`

Pour préparer tout un lot tranquillement, changer les légendes ou supprimer
des photos : ouvrez **`studio.html`**.

### Méthode C — les fichiers (pour publier en ligne)

1. Copiez vos images dans le dossier **`images/galerie/`**.
2. Ouvrez **`galerie.js`** avec le Bloc-notes.
3. Ajoutez une ligne dans la liste `PHOTOS` (copiez le modèle à côté).

> ⚠️ **Soyons précis** : les photos ajoutées par le bouton ou le studio sont
> conservées dans le navigateur **de l'appareil uniquement** (celui qui les
> a ajoutées). Pour que **tous les invités** voient une photo, utilisez la
> méthode C puis republishiez : les fichiers voyagent avec le site.

---

## 🔍 3. Rechercher dans la galerie

Une barre de recherche se trouve au-dessus des catégories :
- cherchez une **légende** (« josiane », « mairie »…),
- un **nom de fichier** (« studio-22 », « studio 9 »…),
- une **catégorie** (« joie »…).

On peut y chercher sans accents ni majuscules. Un petit ✕ efface la
recherche. La recherche se combine au filtre de catégorie affiché.

---

## 🎬 4. Le film des souvenirs

Le bouton **« 🎬 Créer le film des souvenirs »** fabrique automatiquement
un montage : page de titre, chaque photo défilée avec un mouvement doux,
fondu enchaîné, générique final. La musique choisie s'entend dans le film
(quand le navigateur le permet).

- **⏸ Le film utilise la catégorie affichée** : filtrez d'abord
  (« Portraits des mariés ») pour ne filmer que ces souvenirs.
- **⛶ Agrandir** : le film prend tout l'écran (un clic ou un double-clic).
- **⬆ Enregistrer la vidéo** : le fichier est téléchargé (format WebM,
  ou MP4 sur iPhone), partageable sur WhatsApp.

---

## 🗂️ 5. Les catégories disponibles

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

Chaque catégorie devient automatiquement un bouton de filtre dans la
galerie, et alimente la section « Famille & invités ».

---

## 📖 6. Modifier les textes (« Notre histoire »)

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
« photo à venir » est affiché à sa place. Les textes de la section
« Famille & invités » se modifient de la même manière, dans `FAMILLE`.

---

## 🌍 7. Mettre en ligne sur Render (partager avec vos proches)

Le site est publié gratuitement via **GitHub + Render** :

1. **Créez le dépôt GitHub** (ou utilisez GitHub Desktop) :
   - allez sur `github.com` puis « New repository »,
   - nommez-le par exemple `mariage-album`,
   - sur votre ordinateur, dans le dossier `mariage-album`, exécutez :
     ```bash
     git remote add origin https://github.com/VOTRE-NOM/mariage-album.git
     git push -u origin master
     ```
2. **Sur Render** : `render.com` → connexion avec GitHub →
   **"+" New → Static Site** → choisissez le dépôt `mariage-album`.
3. Dans les options :
   - **Build command** : laisser vide,
   - **Publish directory** : `.` (dossier courant).
4. Cliquez **« Deploy »** → Render donne une adresse du type
   `https://mariage-album.onrender.com`.

À chaque `git push`, le site se remet en ligne tout seul.
Lors de la cérémonie, les membres de la famille vivront la même
expérience sur tous leurs téléphones.

> ⚠️ Rappel honnête : les photos ajoutées par un invité depuis le bouton
> « + Ajouter » restent dans **son** navigateur. Le serveur en ligne diffusera
> toujours les fichiers du dépôt GitHub.

---

## 🎵 8. Ajouter la musique

Deux options : 
1. **Installer un fichier du site** : placez du son dans **`audio/`**, 
   nommez-le `musique.mp3`, enregistrez dans `galerie.js` ligne `musique`.
2. **Le visiteur choisit son fichier** : un clic sur ♪ permet de sélectionner
   la musique depuis son appareil, qui la garde en mémoire pour l'entendre
   à chaque visite et pour le film des souvenirs.

La musique **ne démarre jamais automatiquement** : vos visiteurs doivent
cliquer sur le bouton ♪ en bas à droite. C'est un choix volontaire,
aussi bien de confort que de respect de la vie privée.

Musique libre de droits :
- Pixabay Music — `https://pixabay.com/music/`
- YouTube Audio Library — `https://www.youtube.com/audiolibrary`

---

## ✍️ 9. Le livre d'or

Un site fait uniquement de fichiers ne peut pas enregistrer des messages
sur Internet : il a besoin d'un service de réception. Voici comment
l'activer réellement :

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

4. Enregistrez. Les messages arriveront dans votre tableau de bord Formspree.

Tant que cette étape n'est pas faite, le formulaire l'indique honnêtement
à vos visiteurs : aucun message n'est enregistré silencieusement.

---

## 🛡️ 10. Protection des photos

Le site empêche le **clic droit « Enregistrer l'image »**, le glisser-déposer
et le menu d'appui long sur téléphone. Pour être précis : **une vraie capture
d'écran reste possible** — aucun site web ne peut l'empêcher, c'est le
téléphone lui-même qui photographie son écran.

---

## ✏️ 11. Personnalisation rapide

| À changer | Où chercher |
|---|---|
| Date du compte à rebours | `galerie.js` → `dateMariage` |
| Adresse du livre d'or | `galerie.js` → `formspree` |
| Fichier de musique par défaut | `galerie.js` → `musique` |
| Nom du mariage (affiché) | `galerie.js` → `mariage` |
| Couleurs, polices, formes | `style.css` → bloc `:root` |
| Textes des sections | `index.html` (sections fixes) et `galerie.js` (listes) |

---

## ✅ 12. Vérifications déjà effectuées

- Noms corrects partout : **Olakiba Armand** et **Bosseno Josiane**
  (aucune occurrence de l'ancienne orthographe)
- Date et lieu affichés : vendredi 11 décembre 2026, Mairie de Brazzaville, Congo
- Horaires conservés : Mairie 08h00 • Dot 12h00 • Mariage 16h00
- Compte à rebours fonctionnel
- Galerie en mosaïque à proportions naturelles (plus de têtes coupées ni d'écrimage)
- Filtres par catégorie + barre de recherche, visionneuse (agrandissement,
  flèches, clavier, Échap)
- Bouton « + Ajouter des photos » + assistant intelligent de rangement
- Film des souvenirs : lecture, agrandissement plein écran, export vidéo
- Choix de la musique depuis l'appareil, jamais de lecture automatique
- Protection des photos (clic droit, glisser-deposer, appui long)
- Affichage sur téléphone, tablette et ordinateur
