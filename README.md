# 🚀 SaaS Boilerplate - Démarrage Rapide

Un boilerplate moderne et complet pour créer votre application SaaS B2B en quelques minutes. Conçu spécialement pour les débutants avec des instructions détaillées.

## ✨ Fonctionnalités

- 🎨 **Landing Page moderne** - Design professionnel et responsive
- 🔐 **Authentification complète** - Email/mot de passe + Google OAuth
- 📊 **Dashboard professionnel** - Interface d'administration complète
- 👥 **Gestion des utilisateurs** - CRUD utilisateurs avec rôles
- 📁 **Gestion de projets** - Suivi et organisation
- 📈 **Statistiques** - Métriques et analytics
- ⚙️ **Paramètres** - Page de configuration utilisateur
- 🎯 **TypeScript** - Code typé et sécurisé
- 🎨 **Tailwind CSS** - Design system moderne
- 🔒 **Middleware de protection** - Routes sécurisées
- 📱 **100% Responsive** - Fonctionne sur tous les appareils

## 🛠️ Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Pour un code robuste et maintenable
- **Tailwind CSS** - Framework CSS utility-first
- **Supabase** - Backend-as-a-Service (Auth + Database)
- **Lucide React** - Icônes modernes

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18 ou supérieure ([télécharger ici](https://nodejs.org/))
- **npm** ou **yarn** (inclus avec Node.js)
- Un compte **Supabase** gratuit ([créer un compte](https://supabase.com))
- Un compte **Google Cloud** pour OAuth (optionnel, [créer un compte](https://console.cloud.google.com))

## 🚀 Installation

### Étape 1 : Cloner ou télécharger le projet

Si vous utilisez Git :
```bash
git clone [URL_DE_VOTRE_REPO]
cd BoilerPlate
```

Sinon, téléchargez le projet et naviguez dans le dossier.

### Étape 2 : Installer les dépendances

```bash
npm install
```

Cette commande va installer toutes les dépendances nécessaires (ça peut prendre 1-2 minutes).

## ⚙️ Configuration

### Étape 3 : Configurer Supabase

#### 3.1 Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Créez un nouveau projet :
   - Nom du projet : `saas-boilerplate` (ou le nom de votre choix)
   - Database Password : Choisissez un mot de passe fort
   - Region : Choisissez la région la plus proche de vous
4. Attendez que le projet soit créé (1-2 minutes)

#### 3.2 Obtenir les clés API

1. Dans votre projet Supabase, allez dans **Settings** (icône d'engrenage en bas à gauche)
2. Cliquez sur **API**
3. Copiez ces deux valeurs :
   - `Project URL` (commence par https://)
   - `anon public` key (longue chaîne de caractères)

#### 3.3 Créer la table profiles

1. Dans Supabase, allez dans **SQL Editor** (icône de base de données)
2. Cliquez sur **New query**
3. Collez ce code SQL :

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

-- Créer les politiques de sécurité
create policy "Les utilisateurs peuvent voir leur propre profil"
  on profiles for select
  using ( auth.uid() = id );

create policy "Les utilisateurs peuvent mettre à jour leur propre profil"
  on profiles for update
  using ( auth.uid() = id );

-- Fonction pour créer automatiquement un profil lors de l'inscription
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

-- Trigger qui s'exécute à chaque nouvelle inscription
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

4. Cliquez sur **Run** (ou appuyez sur Ctrl/Cmd + Enter)
5. Vous devriez voir "Success. No rows returned"

### Étape 4 : Configurer les variables d'environnement

1. À la racine du projet, créez un fichier `.env.local` (copiez `.env.example`)
2. Ouvrez `.env.local` et remplacez les valeurs :

### Étape 4 : Configurer les variables d'environnement

1. **Copiez le fichier `.env.example`** en `.env.local` :

```bash
cp .env.example .env.local
```

2. **Ouvrez `.env.local`** et remplacez les valeurs par vos vraies clés Supabase :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Important** : Remplacez bien `votre-projet` et `votre_cle_anon_ici` par VOS valeurs copiées depuis Supabase !

### Étape 5 : Configurer Google OAuth (OPTIONNEL)

Si vous voulez activer la connexion avec Google :

#### 5.1 Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez-en un
3. Dans le menu, allez dans **APIs & Services** > **Credentials**
4. Cliquez sur **Create Credentials** > **OAuth 2.0 Client ID**
5. Si demandé, configurez l'écran de consentement OAuth :
   - User Type : External
   - Remplissez les informations de base
   - Ajoutez les scopes : email, profile
6. Revenez à **Credentials** et créez l'OAuth Client ID :
   - Application type : Web application
   - Name : SaaS Boilerplate
   - Authorized JavaScript origins : `http://localhost:3000`
   - Authorized redirect URIs : `https://votre-projet.supabase.co/auth/v1/callback`
7. Copiez votre **Client ID** et **Client Secret**

#### 5.2 Configurer dans Supabase

1. Dans Supabase, allez dans **Authentication** > **Providers**
2. Trouvez **Google** et activez-le
3. Collez votre Client ID et Client Secret
4. Cliquez sur **Save**

## 🎯 Lancement du projet

Une fois tout configuré, lancez le serveur de développement :

```bash
npm run dev
```

Ouvrez votre navigateur et allez sur [http://localhost:3000](http://localhost:3000)

🎉 **Félicitations !** Votre boilerplate SaaS est maintenant opérationnel !

## 📁 Structure du projet

```
BoilerPlate/
├── app/                      # Application Next.js (App Router)
│   ├── auth/                 # Routes d'authentification
│   │   └── callback/         # Callback OAuth
│   ├── dashboard/            # Application dashboard
│   │   ├── analytics/        # Page statistiques
│   │   ├── projects/         # Page projets
│   │   ├── settings/         # Page paramètres
│   │   ├── users/            # Page utilisateurs
│   │   ├── layout.tsx        # Layout dashboard avec sidebar
│   │   └── page.tsx          # Page d'accueil dashboard
│   ├── login/                # Page de connexion
│   ├── signup/               # Page d'inscription
│   ├── globals.css           # Styles globaux
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Landing page
├── components/               # Composants React réutilisables
│   ├── auth/                 # Composants d'authentification
│   │   └── AuthForm.tsx      # Formulaire login/signup
│   ├── dashboard/            # Composants dashboard
│   │   ├── Header.tsx        # En-tête dashboard
│   │   └── Sidebar.tsx       # Menu latéral
│   ├── landing/              # Composants landing page
│   │   ├── Features.tsx      # Section fonctionnalités
│   │   ├── Footer.tsx        # Pied de page
│   │   ├── Hero.tsx          # Section hero
│   │   ├── Navbar.tsx        # Navigation principale
│   │   └── Pricing.tsx       # Section tarifs
│   └── ui/                   # Composants UI de base
│       └── Button.tsx        # Composant bouton
├── lib/                      # Utilitaires et configurations
│   ├── supabase/             # Configuration Supabase
│   │   ├── client.ts         # Client Supabase (côté client)
│   │   ├── database.types.ts # Types TypeScript de la DB
│   │   └── server.ts         # Client Supabase (côté serveur)
│   └── utils.ts              # Fonctions utilitaires
├── middleware.ts             # Middleware Next.js (protection routes)
├── .env.example              # Exemple de variables d'environnement
├── .env.local                # VOS variables d'environnement (à créer)
├── .gitignore                # Fichiers à ignorer par Git
├── next.config.js            # Configuration Next.js
├── package.json              # Dépendances du projet
├── postcss.config.js         # Configuration PostCSS
├── README.md                 # Ce fichier !
├── tailwind.config.js        # Configuration Tailwind CSS
└── tsconfig.json             # Configuration TypeScript
```

## 🎨 Personnalisation

### Modifier les couleurs

Ouvrez `tailwind.config.js` et modifiez les couleurs primary :

```js
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... modifiez les valeurs
    600: '#0284c7',  // Couleur principale
    700: '#0369a1',
  },
}
```

### Modifier le logo et le nom

1. **Nom de l'app** : Recherchez "SaaS Pro" dans tous les fichiers et remplacez par votre nom
2. **Logo** : Remplacez les `<div>` avec gradient par votre image/logo

### Ajouter des pages

1. Créez un nouveau fichier dans `app/` : `app/ma-page/page.tsx`
2. Ajoutez votre contenu :

```tsx
export default function MaPage() {
  return (
    <div>
      <h1>Ma nouvelle page</h1>
    </div>
  )
}
```

## 📦 Build et Déploiement

### Build local

```bash
npm run build
npm start
```

### Déployer sur Vercel (RECOMMANDÉ)

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Installez Vercel CLI :
```bash
npm i -g vercel
```
3. Déployez :
```bash
vercel
```
4. Suivez les instructions
5. N'oubliez pas d'ajouter vos variables d'environnement dans Vercel :
   - Allez dans Settings > Environment Variables
   - Ajoutez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Mettez à jour `NEXT_PUBLIC_SITE_URL` avec votre URL de production

### Autres plateformes

- **Netlify** : [netlify.com](https://netlify.com)
- **Railway** : [railway.app](https://railway.app)
- **Render** : [render.com](https://render.com)

## 🆘 Aide et Support

### Problèmes courants

#### "Cannot find module..."
```bash
rm -rf node_modules package-lock.json
npm install
```

#### "Supabase client has not been initialized"
- Vérifiez que votre fichier `.env.local` existe
- Vérifiez que les variables sont correctement renseignées
- Redémarrez le serveur de développement

#### "Failed to fetch"
- Vérifiez votre connexion internet
- Vérifiez que votre projet Supabase est bien actif
- Vérifiez les URLs dans `.env.local`

### Ressources utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation TypeScript](https://www.typescriptlang.org/docs)

## 📝 License

Ce projet est libre d'utilisation pour vos projets personnels et commerciaux.

## 🎓 Pour les enseignants

Ce boilerplate a été créé spécialement pour les étudiants débutants. Il contient :
- ✅ Code commenté et bien structuré
- ✅ Bonnes pratiques de développement
- ✅ Architecture scalable
- ✅ Design moderne et professionnel
- ✅ Configuration simplifiée

Les étudiants peuvent :
- Se concentrer sur leur logique métier
- Apprendre les technologies modernes
- Économiser du temps et des crédits
- Avoir une base solide pour leurs projets

## 💡 Conseils pour les débutants

1. **Prenez votre temps** : Lisez bien chaque étape
2. **Testez au fur et à mesure** : Vérifiez que chaque étape fonctionne
3. **N'ayez pas peur d'expérimenter** : Le code peut être modifié !
4. **Utilisez les DevTools** : F12 dans votre navigateur pour déboguer
5. **Lisez les erreurs** : Les messages d'erreur vous indiquent quoi faire
6. **Cherchez de l'aide** : Stack Overflow, documentation officielle
7. **Sauvegardez régulièrement** : Utilisez Git pour versionner votre code

## 🚀 Prochaines étapes

Maintenant que votre boilerplate est opérationnel, vous pouvez :

1. ✨ Personnaliser le design selon vos besoins
2. 📊 Ajouter vos propres fonctionnalités métier
3. 🔧 Intégrer des services tiers (Stripe, SendGrid, etc.)
4. 📈 Ajouter des graphiques avec Chart.js ou Recharts
5. 🎨 Créer vos propres composants UI
6. 🚀 Déployer en production

**Bon développement ! 🎉**
