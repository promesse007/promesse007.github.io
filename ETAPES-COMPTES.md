# 📋 Étapes des comptes — pour mettre le site en ligne

> À faire tranquillement, une étape à la fois. Rien n'est payant.
>
> ⚠️ **Règle d'or : ne donnez jamais votre mot de passe à personne** — ni à
> GitHub, ni à Neon, ni à moi. Je n'en ai jamais besoin.

---

## 1️⃣ Créer le compte GitHub (le site vivra ici)

1. Ouvrez **https://github.com** et cliquez **Sign up** (en haut à droite).
2. Renseignez :
   - votre **email**,
   - un **mot de passe** que vous choisirez (long et unique) — le site vous
     proposera de le sauvegarder : acceptez,
   - un **nom d'utilisateur** : c'est lui qui fera l'adresse du site
     (ex. `josiane-armand` → site à `https://josiane-armand.github.io/...`).
     Prenez quelque chose de simple.
3. Vérifiez votre email (un code vous est envoyé → cliquez le lien).
4. **Activez la 2FA (double sécurité) :** Paramètres → Password and
   authentication → Two-factor authentication → suivez l'assistant
   (GitHub vous donne des codes de secours : gardez-les dans un carnet).

**Ce que vous m'envoyez ensuite :**
- votre **nom d'utilisateur GitHub** (pas le mot de passe !).

---

## 2️⃣ Créer le compte Neon (la mémoire du site : photos des invités)

1. Ouvrez **https://neon.com** et cliquez **Get started / Sign up**.
2. Créez le compte avec votre email (ou « Continue with Google » si vous
   avez Gmail : plus simple).
3. Après l'inscription, cliquez **Create project / New project** :
   - nom du projet : `album-mariage` (ou ce que vous voulez),
   - la région : laissez celle proposée,
   - **Postgres version** / options par défaut : ne touchez à rien.
4. Création à monsieur, Neon affiche la **chaîne de connexion**
   (quelque chose comme `postgresql://neondb_owner:xxxxx@ep-...neon.tech/neondb?sslmode=require`).
   - Cliquez pour **copier la chaîne complète**.
   - Gardez-la précieusement : c'est la clé de la mémoire du site.

**Ce que vous m'envoyez ensuite :**
- la **chaîne de connexion complète** (elle commence par `postgresql://`
  et finit par `neondb?...`).

> 💡 Pratique : si un jour vous voulez tout changer, le projet Neon peut
> être supprimé recréé en 1 minute. La chaîne peut aussi être « réinitialisée »
> depuis le tableau Neon.

---

## 3️⃣ Résumé de ce que vous m'envoyez

| Quoi | Où je le mets | Risque si on le perd |
|---|---|---|
| Votre pseudo GitHub | lien du site + repo des fichiers | aucun — je ne peux rien sans votre mot de passe |
| La chaîne de connexion Neon | mémoire des souvenirs des invités | réinitialisable depuis le tableau Neon |
| (plus tard) la clé d'IA | l'assistant qui répond aux invités | la régénérer depuis Neon |

**Mots de passe : ne m'envoyez JAMAIS les vôtres.**
