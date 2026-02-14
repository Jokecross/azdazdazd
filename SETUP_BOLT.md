# 🚀 Instructions de Setup - Bolt.new

Ce guide est spécialement conçu pour les utilisateurs de **Bolt.new**.

## ⚡ Setup en 3 minutes chrono !

### Étape 1 : Configuration Supabase (2 min)

#### 1.1 Créer un projet Supabase

1. Va sur [supabase.com](https://supabase.com)
2. Clique sur "Start your project"
3. Connecte-toi avec GitHub
4. Clique sur "New Project"
5. Remplis :
   - **Name** : `mon-saas` (ou ce que tu veux)
   - **Database Password** : Choisis un mot de passe fort
   - **Region** : Europe West (ou la plus proche)
6. Clique sur "Create new project"
7. ⏰ Attends 1-2 minutes

#### 1.2 Créer la table profiles

1. Dans Supabase, clique sur **SQL Editor** (dans le menu gauche)
2. Clique sur **+ New query**
3. Copie-colle ce code :

```sql
-- Créer la table profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activer Row Level Security
alter table profiles enable row level security;

-- Politiques de sécurité
create policy "Les utilisateurs peuvent voir leur propre profil"
  on profiles for select
  using ( auth.uid() = id );

create policy "Les utilisateurs peuvent mettre à jour leur propre profil"
  on profiles for update
  using ( auth.uid() = id );

-- Fonction de création automatique de profil
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger pour auto-créer le profil
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

4. Clique sur **Run** (ou Ctrl/Cmd + Enter)
5. ✅ Tu devrais voir "Success. No rows returned"

#### 1.3 Obtenir les clés API

1. Dans Supabase, clique sur **Settings** (engrenage en bas à gauche)
2. Clique sur **API**
3. Tu vas voir deux infos importantes :
   - **Project URL** : commence par `https://`
   - **anon public** key : longue chaîne de caractères

📋 **Copie ces deux valeurs** - tu en auras besoin dans 30 secondes !

### Étape 2 : Configuration dans Bolt.new (30 sec)

#### 2.1 Créer le fichier .env.local

Dans le terminal Bolt.new, tape :

```bash
cp .env.example .env.local
```

#### 2.2 Ouvrir et modifier .env.local

Dans l'explorateur de fichiers à gauche, clique sur `.env.local`

#### 2.3 Remplacer les valeurs

Remplace les placeholders par tes vraies valeurs :

```env
# ⚠️ Remplace ces valeurs par les tiennes !

NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
NEXT_PUBLIC_SITE_URL=https://ton-projet.bolt.new
```

**Comment obtenir NEXT_PUBLIC_SITE_URL** :
- Dans Bolt.new, regarde l'URL de la prévisualisation
- Copie l'URL complète (exemple : `https://stackblitz-starters-abc123.local.run`)
- Colle-la comme valeur de `NEXT_PUBLIC_SITE_URL`

#### 2.4 Sauvegarder

Ctrl/Cmd + S pour sauvegarder le fichier.

### Étape 3 : Lancer l'application (10 sec)

L'application devrait déjà être lancée ! Sinon :

1. Dans le terminal Bolt.new, tape :
```bash
npm run dev
```

2. Clique sur le lien de prévisualisation

3. 🎉 **C'est prêt !**

## ✅ Vérification

### Test de l'inscription

1. Va sur `/signup`
2. Crée un compte avec :
   - Nom : Test User
   - Email : test@example.com
   - Mot de passe : test123456
3. Clique sur "Créer un compte"
4. ✅ Tu devrais être redirigé vers `/dashboard`

### Test du dashboard

Si tu vois :
- ✅ Une sidebar à gauche
- ✅ Un header en haut
- ✅ Des statistiques et graphiques
- ✅ Ton email/nom affiché

**Félicitations ! Tout fonctionne ! 🎉**

## 🔧 Configuration OAuth Google (OPTIONNEL)

Si tu veux activer la connexion Google :

### 1. Créer des identifiants Google

1. Va sur [Google Cloud Console](https://console.cloud.google.com)
2. Crée un nouveau projet
3. Va dans **APIs & Services** > **Credentials**
4. Configure l'écran de consentement OAuth :
   - User Type : **External**
   - App name : Ton nom d'app
   - Scopes : `email`, `profile`
5. Crée un OAuth Client ID :
   - Type : **Web application**
   - Authorized redirect URIs : `https://TON-PROJET.supabase.co/auth/v1/callback`
6. 📋 Copie le **Client ID** et **Client Secret**

### 2. Configurer dans Supabase

1. Dans Supabase, va dans **Authentication** > **Providers**
2. Active **Google**
3. Colle ton Client ID et Client Secret
4. Sauvegarde

### 3. Tester

1. Va sur `/login`
2. Clique sur le bouton Google
3. Connecte-toi
4. ✅ Tu devrais être redirigé vers `/dashboard`

## 🆘 Problèmes courants

### "Invalid API key"

**Solution** :
- Vérifie que tu as bien copié la clé `anon public` (pas `service_role`)
- Vérifie qu'il n'y a pas d'espaces avant/après dans `.env.local`
- Redémarre l'application dans Bolt

### "Database error: relation 'profiles' does not exist"

**Solution** :
- Retourne dans Supabase SQL Editor
- Réexécute le script SQL de création de table
- Vérifie dans **Table Editor** que la table `profiles` existe

### "Failed to fetch"

**Solution** :
- Vérifie ta connexion internet
- Vérifie que l'URL Supabase est correcte
- Vérifie que le projet Supabase est actif (vert dans le dashboard)

### Dashboard ne s'affiche pas

**Solution** :
- Vérifie que tu es bien connecté
- Ouvre la console du navigateur (F12) et regarde les erreurs
- Vérifie que `NEXT_PUBLIC_SITE_URL` est correct

## 💡 Astuces Bolt.new

### Demander à Bolt de personnaliser

Tu peux demander à Bolt :

```
Change la couleur principale en violet
```

```
Ajoute une section témoignages sur la landing page
```

```
Rends le header sticky avec effet de transparence
```

### Commandes utiles

```bash
# Redémarrer l'app
npm run dev

# Installer une nouvelle dépendance
npm install nom-du-package

# Build pour production
npm run build
```

## 🎯 Prochaines étapes

Maintenant que tout fonctionne, tu peux :

1. 🎨 **Personnaliser le design**
   - Couleurs dans `tailwind.config.js`
   - Logo dans les composants
   - Textes de la landing page

2. 🔧 **Ajouter des fonctionnalités**
   - Nouvelles pages dans `app/`
   - Nouveaux composants dans `components/`
   - Intégrations tierces (Stripe, SendGrid, etc.)

3. 🚀 **Déployer en production**
   - Export depuis Bolt vers GitHub
   - Déployer sur Vercel
   - Configurer ton domaine

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [README.md complet](./README.md)
- [Guide Supabase détaillé](./SUPABASE_SETUP.md)

## 🤝 Besoin d'aide ?

Si tu es bloqué :
1. Consulte le [README.md](./README.md) complet
2. Regarde les [Release Notes](./VERSION_1.1_RELEASE_NOTES.md)
3. Crée une Issue sur GitHub
4. Demande à Bolt dans le chat !

---

**Bon développement ! 🚀**

Fait avec ❤️ pour les développeurs
