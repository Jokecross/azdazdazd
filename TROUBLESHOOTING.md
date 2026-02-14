# 🐛 Guide de Débogage - Problème de Connexion

## Symptôme
- Le compte est créé dans Supabase ✅
- Le profil apparaît dans la base de données ✅
- Mais la connexion ne fonctionne pas ❌

## Vérifications à faire

### 1. ✅ Vérifier les paramètres Supabase Auth

Allez dans **Supabase** > **Authentication** > **Settings** :

#### Email Confirmation
- Si **Enable email confirmations** est activé :
  - L'utilisateur doit confirmer son email avant de se connecter
  - **Solution** : Désactive cette option pour le développement

**Comment désactiver** :
1. Allez dans **Authentication** > **Providers** > **Email**
2. Décochez **"Confirm email"**
3. Sauvegardez

#### Auto Confirm
Pour éviter les problèmes en dev, configure :
1. Allez dans **Authentication** > **Settings**
2. Section **Auth Providers**
3. Vérifie que **Email** est bien configuré

### 2. ✅ Vérifier les URLs autorisées

Allez dans **Authentication** > **URL Configuration** :

Vous devez avoir :
```
Site URL: http://localhost:3000

Redirect URLs:
http://localhost:3000
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
http://localhost:3000/**
```

**Ajouter le wildcard** :
- Cliquez sur **Add redirect URL**
- Ajoutez : `http://localhost:3000/**`
- Sauvegardez

### 3. ✅ Vérifier le fichier .env.local

Ouvrez votre `.env.local` et vérifiez :

```bash
# La structure doit être exactement celle-ci :
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **Vérifiez** :
- Pas d'espaces avant ou après les valeurs
- Pas de guillemets autour des valeurs
- Les clés commencent bien par `NEXT_PUBLIC_`

### 4. ✅ Tester dans la console du navigateur

1. Ouvrez la page de connexion
2. Appuyez sur **F12** pour ouvrir la console
3. Essayez de vous connecter
4. Regardez les logs qui apparaissent :

Vous devriez voir :
```
🔐 Tentative de connexion...
🔑 Résultat connexion: {...}
✅ Connexion réussie ! Redirection...
```

Si vous voyez :
```
❌ Erreur auth: Email not confirmed
```
→ Retournez au point 1 et désactivez l'email confirmation

Si vous voyez :
```
❌ Erreur auth: Invalid login credentials
```
→ Le mot de passe est incorrect OU l'utilisateur n'existe pas

### 5. ✅ Réinitialiser le compte

Si rien ne fonctionne :

1. **Supprimer l'utilisateur dans Supabase** :
   - Allez dans **Authentication** > **Users**
   - Cliquez sur l'utilisateur
   - Cliquez sur **Delete user**

2. **Supprimer le profil** :
   - Allez dans **Table Editor** > **profiles**
   - Supprimez la ligne correspondante

3. **Recréer un compte** :
   - Retournez sur `/signup`
   - Créez un nouveau compte
   - Regardez les logs dans la console

### 6. ✅ Script de test direct

Créez ce fichier pour tester directement :

**test-auth.html** (ouvrez-le dans le navigateur)
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Supabase Auth</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <h1>Test Supabase Auth</h1>
  <button onclick="testAuth()">Tester la connexion</button>
  <div id="result"></div>

  <script>
    // Remplace avec tes vraies valeurs
    const supabase = supabase.createClient(
      'https://TON-PROJET.supabase.co',
      'TA-CLE-ANON'
    )

    async function testAuth() {
      const email = 'chevalier@gmail.com' // Ton email
      const password = 'ton-mot-de-passe'

      console.log('Test de connexion...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      document.getElementById('result').innerHTML = 
        error 
          ? `❌ Erreur: ${error.message}` 
          : `✅ Succès ! User: ${data.user.email}`
      
      console.log('Résultat:', { data, error })
    }
  </script>
</body>
</html>
```

### 7. ✅ Vérifier les politiques RLS

Dans **SQL Editor**, exécutez :

```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Si aucune politique n'apparaît, réexécutez le script de création :
create policy "Les utilisateurs peuvent voir leur propre profil"
  on profiles for select
  using ( auth.uid() = id );

create policy "Les utilisateurs peuvent mettre à jour leur propre profil"
  on profiles for update
  using ( auth.uid() = id );
```

## Solutions Rapides

### Solution 1 : Désactiver Email Confirmation (DEV)
```
Supabase > Authentication > Providers > Email
Décocher "Confirm email"
```

### Solution 2 : Recréer l'utilisateur
```
1. Supprimer l'user dans Authentication > Users
2. Supprimer le profil dans Table Editor > profiles  
3. Recréer le compte sur /signup
```

### Solution 3 : Vérifier la console navigateur
```
F12 > Console
Essayer de se connecter
Lire les messages d'erreur
```

## Messages d'erreur courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| Email not confirmed | Email confirmation activée | Désactiver dans Settings |
| Invalid login credentials | Mauvais mot de passe ou user inexistant | Vérifier les credentials |
| Invalid API key | Clé Supabase incorrecte | Vérifier .env.local |
| Failed to fetch | URL Supabase incorrecte | Vérifier .env.local |
| No session created | Problème de configuration | Vérifier les URLs redirect |

## 🆘 Toujours bloqué ?

1. Partage les logs de la console (F12)
2. Partage une capture d'écran des Settings > Auth
3. Vérifie que tu utilises bien l'email/mot de passe que tu as créé

## 📝 Checklist complète

- [ ] Email confirmation désactivée
- [ ] URLs redirect configurées
- [ ] .env.local correct (pas d'espaces)
- [ ] Utilisateur existe dans Auth > Users
- [ ] Profil existe dans Table Editor > profiles
- [ ] Console navigateur ouverte (F12)
- [ ] Logs visibles dans la console
- [ ] Aucune erreur rouge dans la console

Si toutes les cases sont cochées et ça ne marche toujours pas, il y a peut-être un problème de cache. Essaie :

```bash
# Supprimer le cache Next.js
rm -rf .next

# Relancer
npm run dev
```

---

**Bon débogage ! 🐛**
