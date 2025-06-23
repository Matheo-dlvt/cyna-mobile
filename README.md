# Cyna Mobile App

Application mobile développée en React Native (via Expo) dans le cadre du projet Cyna.
Elle permet de gérer un parcours utilisateur complet, de l'authentification jusqu'au paiement et la gestion des abonnements.

## Technologies utilisées

- React Native avec Expo
- TypeScript
- AsyncStorage : pour stocker les tokens localement
- React Navigation : gestion des écrans
- Stripe : pour les paiements (via backend)

## Fonctionnalités principales

- Connexion / Déconnexion
- Affichage des produits
- Ajout de produits au panier
- Choix du type dabonnement (mensuel / annuel)
- Gestion dynamique du panier
- Sélection des adresses de facturation et livraison
- Paiement via Stripe
- Page de succès après paiement
- Affichage et annulation des abonnements
- Paramètres utilisateur (infos perso, mot de passe, adresses)

## Authentification

Les tokens sont stockés via AsyncStorage.
En cas de token expiré, un appel à la route /api/auth/refresh/mobile est effectué automatiquement.

## Lancement du projet

1. Installer les dépendances

    npm install

3. Lancer le projet Expo

    npm run start

## Structure du projet

/components          Composants UI réutilisables (BaseButton, BaseInput)
/screens             Écrans principaux de lapplication
/context             Contexte Auth (login/logout)

## Prérequis

- Node.js & npm
- Expo CLI
- Backend Cyna