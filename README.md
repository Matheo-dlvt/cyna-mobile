# Cyna Mobile App

Application mobile développée en React Native (via Expo) dans le cadre du projet Cyna.
Elle permet de gérer un parcours utilisateur complet, de l'authentification jusqu'au paiement et la gestion des abonnements.

## Technologies utilisées

- React Native avec Expo
- TypeScript
- AsyncStorage : pour stocker les tokens localement
- React Navigation : gestion des écrans
- Stripe : pour les paiements (via backend)
- Ngrok : tunnel pour exposer l'API localement lors des tests

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

2. Créer un fichier .env à la racine

    API_BASE_URL=https://xxxxx.ngrok.io

> Remplace par ton URL Ngrok en cours.

3. Lancer le projet Expo

    npm start

> Scanne le QR code avec lapplication Expo Go sur ton téléphone ou utilise un émulateur.

## Structure du projet

/components          Composants UI réutilisables (BaseButton, BaseInput, etc.)
/screens             Écrans principaux de lapplication
/context             Contexte Auth (login/logout)

## Améliorations futures

- Ajout de tests unitaires
- Gestion des cookies (auth plus sécurisée)
- Passage à une authentification par sessions
- Ajout de la double authentification
- Fonctionnalités avancées pour le chatbot

## Prérequis

- Node.js & npm
- Expo CLI
- Android Studio (si test sur émulateur)
- Backend Cyna opérationnel (ou mocké avec Ngrok)

## Auteur

Projet développé par Mathéo Delvert dans le cadre du projet Cyna.