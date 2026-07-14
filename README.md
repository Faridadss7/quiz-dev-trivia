# Dev Trivia — Level Up Africa 🌍💻

> **Quiz interactif** sur les fondamentaux du développement web.  
> Prouve que tu mérites le titre de **Future Dev africain** !

---

## 📖 Description

Projet de vacances individuel réalisé dans le cadre du programme **Level Up Africa** (IFRI, L1 – Juillet 2026).

**Problème :** Comment consolider les bases HTML/CSS/JS de façon concrète et motivante pendant les vacances ?  
**Solution :** Un quiz interactif, déployé en ligne, jouable sur mobile et desktop, sans aucune dépendance externe.

---

## ✅ Fonctionnalités

- [x] Affichage dynamique des questions depuis un `array` d'objets JS
- [x] 20 questions mélangées aléatoirement à chaque partie
- [x] Options mélangées à chaque affichage
- [x] **Timer** de 20 secondes par question (anneau SVG animé)
- [x] **Feedback immédiat** bonne / mauvaise réponse
- [x] **Barre de progression** en temps réel
- [x] **Score** mis à jour à chaque réponse
- [x] **Écran de résultats** avec titre et message selon le score
- [x] Déployé sur **GitHub Pages**

---

## 🛠️ Stack technique

| Couche       | Technologie                          |
|--------------|--------------------------------------|
| Structure    | HTML5 sémantique                     |
| Style        | CSS3 vanilla (variables, flexbox, grid) |
| Logique      | JavaScript vanilla (ES6+)            |
| Données      | Array d'objets JS (`questions.js`)   |
| Hébergement  | GitHub Pages                         |

> ⚠️ Aucune librairie externe — contrainte pédagogique volontaire.

---

## 🚀 Installation & lancement

```bash
# Cloner le dépôt
git clone https://github.com/<ton-username>/dev-trivia-levelup.git

# Ouvrir directement dans le navigateur
open index.html
# ou
# Utiliser l'extension Live Server dans VS Code
```

Pas de build, pas de npm — c'est du HTML/CSS/JS pur.

---

## 📁 Structure du projet

```
quiz-dev-trivia/
├── index.html      # Structure + 3 écrans (accueil, quiz, résultats)
├── style.css       # Design complet (dark theme, responsive)
├── questions.js    # Array de 20 questions Dev Trivia
├── quiz.js         # Logique : timer, score, feedback, navigation
└── README.md       # Ce fichier
```

---

## 🗺️ Roadmap (évolutions possibles)

- [ ] Multi-thèmes (Level Up Africa, Naija/Benin Trivia)
- [ ] Leaderboard local (`localStorage`)
- [ ] Leaderboard partagé (backend Node/Express + base de données)
- [ ] Comptes utilisateurs / authentification
- [ ] Mode chrono global (timer sur la partie entière)
- [ ] Explication détaillée après chaque réponse

---

## 👤 Auteur

**[Yélognissè Babatoundé Farid]**  
Étudiant L1 — IFRI  
Encadrant : **Duvalier**  
Projet : Level Up Africa — Juillet 2026

🔗 **GitHub Pages :** `https://faridadss7.github.io/dev-trivia-levelup`
