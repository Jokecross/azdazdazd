# ⚡ Démarrage Ultra-Rapide

Guide express pour lancer le projet en **5 minutes** chrono ! ⏱️

## 🎯 3 étapes seulement

### 1️⃣ Installation (1 min)

```bash
npm install
```

### 2️⃣ Configuration Supabase (3 min)

1. **Créez un compte** sur [supabase.com](https://supabase.com)
2. **Créez un projet** (nom : `saas-boilerplate`)
3. **Copiez vos clés** :
   - Allez dans Settings > API
   - Copiez `Project URL` et `anon public` key

4. **Créez `.env.local`** à la racine :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_ici
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. **Créez la table** :
   - Dans Supabase, allez dans SQL Editor
   - Copiez-collez le code du fichier `SUPABASE_SETUP.md` section 3.1
   - Cliquez sur "Run"

### 3️⃣ Créer le fichier .env.local (10 sec)

```bash
cp .env.example .env.local
```

Puis édite `.env.local` et colle tes clés Supabase.

### 4️⃣ Lancement (30 sec)

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

## ✅ Vérification rapide

1. Allez sur `/signup`
2. Créez un compte
3. Vous êtes redirigé vers `/dashboard`
4. ✅ Ça marche !

## 🆘 Problème ?

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Invalid API key"
- Vérifiez `.env.local`
- Redémarrez le serveur (Ctrl+C puis `npm run dev`)

### Autre problème
Consultez le [README.md](./README.md) complet pour plus de détails.

## 📚 Prochaines étapes

- 📖 Lisez le [README.md](./README.md) complet
- 🔐 Suivez [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) pour Google OAuth
- 🎨 Personnalisez les couleurs dans `tailwind.config.js`
- 🚀 Déployez sur Vercel : `npx vercel`

**C'est tout ! Bon développement ! 🚀**
