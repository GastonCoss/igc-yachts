# IGC Yachts — V1

Site public + interface d'administration pour ajouter des yachts sans coder.

- **Site** : `http://localhost:3000` (accueil, `/yachts` avec filtres, fiches yacht, `/builders`)
- **Admin** : `http://localhost:3000/admin` (ajouter / modifier yachts, chantiers, photos)

Technos : Next.js + Payload CMS + PostgreSQL (Supabase) + stockage photos S3 (Supabase Storage).

---

## 1. Créer la base de données (Supabase) — une seule fois

1. Va sur [supabase.com](https://supabase.com) → **New project**.
   - Nom : `igc-yachts`
   - Mot de passe de la base : génère-en un et **note-le** quelque part.
   - Région : **West EU (Paris)**.
2. Une fois le projet prêt, clique sur **Connect** (en haut de la page).
3. Choisis l'onglet **Connection string** → section **Session pooler** → copie l'adresse. Elle ressemble à :
   `postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-eu-west-3.pooler.supabase.com:5432/postgres`
4. Remplace `[YOUR-PASSWORD]` par ton mot de passe (sans les crochets).

## 2. Créer le stockage des photos (Supabase Storage) — une seule fois

1. Dans Supabase, menu de gauche → **Storage** → **New bucket**.
   - Nom : `media`
   - Laisse « Public bucket » **désactivé**.
2. Toujours dans Storage → **S3 Configuration** (ou Settings → Storage) :
   - Copie l'**Endpoint** et la **Region**.
   - Clique **New access key** → copie l'**Access key ID** et la **Secret access key** (elle ne s'affiche qu'une fois).

## 3. Configurer le projet

1. Dans le dossier du projet, duplique `.env.example` et renomme la copie `.env`.
   (Dans le Terminal : `cp .env.example .env`)
2. Ouvre `.env` dans VS Code et remplis :
   - `DATABASE_URL` → l'adresse de l'étape 1
   - `PAYLOAD_SECRET` → une longue chaîne aléatoire. Pour en générer une : `openssl rand -hex 32`
   - `S3_BUCKET=media`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` → étape 2

⚠️ Le fichier `.env` contient tes mots de passe : il n'est **jamais** envoyé sur GitHub (déjà exclu).

## 4. Lancer le site sur ton Mac

Dans le Terminal :

```bash
cd ~/Documents/igc-yachts
npm install
npm run generate:importmap
npm run dev
```

- `npm install` télécharge les dépendances (2–3 minutes la première fois).
- `npm run dev` lance le site. Laisse le Terminal ouvert tant que tu travailles.

Ouvre **http://localhost:3000/admin** → crée ton compte administrateur (email + mot de passe).
Au premier lancement, Payload crée automatiquement toutes les tables dans Supabase.

## 5. Ajouter un yacht

1. Admin → **Chantiers** → **Créer nouveau** → ex. « Pershing », pays « Italy ».
2. Admin → **Yachts** → **Créer nouveau**.
3. Remplis les onglets : Identité, Dimensions & coque, Motorisations, Aménagement, Extérieur & équipements, Prix, Photos & documents, Sources.
   - Laisse vide ce que tu ne sais pas : le site n'affiche que les champs remplis.
   - Un modèle avec plusieurs moteurs possibles → plusieurs lignes dans « Motorisations ».
   - Un modèle en 3 ou 4 cabines → deux lignes dans « Aménagement ».
4. **Enregistrer le brouillon** = invisible sur le site. **Publier** = en ligne.

Le titre (« Pershing 6X ») et l'adresse web (`/yachts/pershing-6x`) sont générés automatiquement.

## 6. Mettre en ligne (Vercel)

1. Crée un dépôt **privé** sur GitHub nommé `igc-yachts`, puis envoie le code :
   ```bash
   git init
   git add .
   git commit -m "IGC Yachts V1"
   git branch -M main
   git remote add origin https://github.com/TON-PSEUDO/igc-yachts.git
   git push -u origin main
   ```
2. Sur [vercel.com](https://vercel.com) → **Add New → Project** → importe `igc-yachts`.
3. Dans **Environment Variables**, colle **les mêmes variables que ton `.env`**.
4. **Deploy**. Ton site est en ligne en ~3 minutes.

À chaque `git push`, Vercel remet le site à jour automatiquement.

> Le site local et le site en ligne utilisent **la même base Supabase** : un yacht publié depuis
> `localhost:3000/admin` apparaît aussi en ligne, et inversement. Tu peux donc gérer tes yachts
> directement depuis `ton-site.vercel.app/admin`.

---

## Ce qui demande du code (passe par Claude)

- Ajouter un **nouveau type de champ** (ex. « nombre de garages ») → `src/collections/Yachts.ts`
- Ajouter un **équipement oui/non** (case à cocher + filtre + affichage) → une ligne dans `FEATURES`, fichier `src/lib/options.ts`
- Ajouter une **valeur dans une liste** (nouveau type de yacht, nouvelle transmission…) → `src/lib/options.ts`

Après une modification de structure, relance `npm run dev` en local une fois : Payload met à jour les tables de la base.

## Structure du projet

```
src/
  collections/        Modèle de données (ce que contient l'admin)
    Yachts.ts         ← la fiche yacht (tous les champs)
    Builders.ts       ← chantiers
    Media.ts          ← photos / PDF
  lib/options.ts      ← listes de valeurs + équipements (filtres)
  lib/search.ts       ← logique des filtres de recherche
  app/(frontend)/     Site public (pages)
  components/site/    Éléments du site (carte yacht, filtres)
```

## Dépannage

| Problème | Solution |
|---|---|
| `npm: command not found` | Ferme et rouvre le Terminal, puis `nvm use 24` |
| Erreur de connexion à la base | Vérifie `DATABASE_URL` (mot de passe sans crochets, « Session pooler ») |
| Photos qui ne s'envoient pas | Vérifie les 5 variables `S3_…` et que le bucket s'appelle bien `media` |
| Le site semble cassé après une mise à jour | `rm -rf .next` puis `npm run dev` |
