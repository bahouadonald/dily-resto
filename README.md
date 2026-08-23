# Dily resto

## Pour démarrer chez toi

1. Installe les dépendances :
   ```
   npm install
   ```

2. Copie `.env.example` en `.env` et colle ta **publishable key** Supabase
   (Project Settings > API sur ton projet dily-resto).

3. Lance le projet :
   ```
   npm run dev
   ```

## Structure

- `src/lib/supabase.ts` — connexion à Supabase
- `src/types/database.ts` — types correspondant aux tables SQL
- `src/pages/CataloguePlats.tsx` — écran d'accueil (catalogue de plats, côté travailleur)
- `src/App.tsx` — routes de l'application

## Prochaine étape

Créer l'écran `ProfilRestaurant.tsx` (route `/restaurant/:id`), qui s'ouvre
quand on clique sur un plat depuis le catalogue.
