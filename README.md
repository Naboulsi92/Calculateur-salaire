# Projet Salaire Maroc 2025

Ce projet est un calculateur de salaire brut/net pour le Maroc, conforme aux dispositions de la **Loi de Finances 2025**.

## Structure du projet

```
Projet-salaire-maroc/
├── index.html            # Page principale (formulaire de calcul)
├── css/
│   └── style.css         # Styles CSS personnalisés
├── js/
│   ├── clearable-input.js # Composant d'entrée avec validation et effacement
│   └── script.js         # Logique JavaScript (Calculs LF 2025)
├── assets/               # Ressources statiques
│   ├── fonts/            # Polices
│   ├── img/              # Images
│   └── favicon.ico       # Icône du site
├── .github/
│   └── copilot-instructions.md  # Instructions pour GitHub Copilot
└── README.md             # Description du projet
```

## Fonctionnalités
- **Conversion Bidirectionnelle** : Calcul du Net à partir du Brut et inversement (Brut à partir du Net).
- **Règles Fiscales 2025** :
    - Barème de l'Impôt sur le Revenu (IR) 2025.
    - Cotisations CNSS et AMO.
    - Frais professionnels plafonnés.
    - Réductions pour charges de famille.
- **Interface Utilisateur Avancée** :
    - **Toggles** : Utilisation de boutons bascule OUI/NON pour une meilleure ergonomie.
    - **Validation Stricte** : Champs de saisie contrôlés (format numérique, limites) avec composant `ClearableInput`.
    - **Accessibilité** : Navigation au clavier complète, focus visible et attributs ARIA.
- **Gestion des Indemnités** : Transport, Panier (exonérées).
- **Retraite Complémentaire** : Gestion de la CIMR.
- **Ancienneté** : Calcul automatique de la prime d'ancienneté.

## Utilisation
1. Ouvrez `index.html` dans un navigateur web.
2. Remplissez le salaire Brut OU le salaire Net.
3. Configurez les options (Ancienneté, Charges, Indemnités).
4. Cliquez sur "Calculer".

## Auteur
Généré par GitHub Copilot sur la base des instructions fournies.