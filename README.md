# Projet Salaire Maroc 2025

Ce projet est un calculateur de salaire brut/net pour le Maroc, conforme aux dispositions de la **Loi de Finances 2025**.
Il utilise une architecture client-serveur avec un backend **Node.js** pour sécuriser et centraliser la logique de calcul.

## Structure du projet

```
Projet-salaire-maroc/
├── server.js             # Backend Node.js (API & Serveur statique)
├── package.json          # Dépendances du projet
├── index.html            # Interface utilisateur
├── css/
│   └── style.css         # Styles CSS personnalisés
├── js/
│   ├── clearable-input.js # Composant d'entrée avec validation
│   └── script.js         # Logique Frontend (Appels API & UI)
├── assets/               # Ressources statiques
│   ├── fonts/            # Polices
│   ├── img/              # Images
│   └── favicon.ico       # Icône du site
├── .github/
│   └── copilot-instructions.md  # Instructions pour GitHub Copilot
└── README.md             # Documentation
```

## Prérequis
- **Node.js** (version 14 ou supérieure) doit être installé sur votre machine.

## Installation
1. Ouvrez un terminal dans le dossier du projet :
   ```bash
   cd "c: \Projet-salaire-maroc"
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```

## Lancement
1. Démarrez le serveur :
   ```bash
   npm start
   ```
2. Ouvrez votre navigateur à l'adresse : **http://localhost:3000**

## Fonctionnalités
- **Architecture Sécurisée** : Logique de calcul hébergée côté serveur (API REST).
- **Conversion Brut vers Net** : Calcul détaillé selon les règles LF 2025.
- **Règles Fiscales 2025** :
    - Barème de l'Impôt sur le Revenu (IR) 2025.
    - Cotisations CNSS et AMO.
    - Frais professionnels plafonnés.
    - Réductions pour charges de famille.
- **Interface Utilisateur Avancée** :
    - **Toggles** : Utilisation de boutons bascule OUI/NON.
    - **Validation Stricte** : Champs de saisie contrôlés.
    - **Accessibilité** : Navigation au clavier et attributs ARIA.
- **Gestion des Indemnités** : Transport, Panier (exonérées).
- **Retraite Complémentaire** : Gestion de la CIMR.
- **Ancienneté** : Calcul automatique de la prime d'ancienneté.

## Utilisation
1. Remplissez le salaire Brut.
2. Configurez les options (Ancienneté, Charges, Indemnités).
3. Cliquez sur "Calculer".
4. Les résultats s'affichent instantanément via l'API.

## Auteur
Généré par GitHub Copilot sur la base des instructions fournies.