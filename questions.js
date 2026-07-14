// questions.js — Dev Trivia | 20 questions
const QUESTIONS = [
  {
    question: "Que signifie l'acronyme HTML ?",
    options: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language", "HyperText Modern Layout"],
    answer: "HyperText Markup Language"
  },
  {
    question: "Quel langage est principalement utilisé pour styliser une page web ?",
    options: ["JavaScript", "Python", "CSS", "XML"],
    answer: "CSS"
  },
  {
    question: "Quelle méthode JS permet d'ajouter un élément à la FIN d'un tableau ?",
    options: ["unshift()", "shift()", "push()", "pop()"],
    answer: "push()"
  },
  {
    question: "Quel mot-clé JS déclare une variable dont la valeur ne peut pas être réassignée ?",
    options: ["let", "var", "static", "const"],
    answer: "const"
  },
  {
    question: "Que signifie l'acronyme API ?",
    options: ["App Processing Interface", "Application Programming Interface", "Automated Program Integration", "Advanced Protocol Interaction"],
    answer: "Application Programming Interface"
  },
  {
    question: "Quel format de données léger est couramment utilisé pour l'échange client/serveur ?",
    options: ["XML", "CSV", "JSON", "YAML"],
    answer: "JSON"
  },
  {
    question: "Quelle balise HTML sert à créer un lien hypertexte ?",
    options: ["<link>", "<href>", "<url>", "<a>"],
    answer: "<a>"
  },
  {
    question: "Que facilite CSS Flexbox ?",
    options: ["La création d'animations complexes", "L'alignement flexible d'éléments", "La gestion des requêtes réseau", "Le rendu 3D d'éléments"],
    answer: "L'alignement flexible d'éléments"
  },
  {
    question: "Quelle commande Git envoie le code vers un dépôt distant ?",
    options: ["git commit", "git pull", "git push", "git clone"],
    answer: "git push"
  },
  {
    question: "Quel port est utilisé par défaut par le serveur local Vite ?",
    options: ["3000", "8080", "4200", "5173"],
    answer: "5173"
  },
  {
    question: "Quel opérateur JS compare la valeur ET le type ?",
    options: ["==", "!=", "===", "="],
    answer: "==="
  },
  {
    question: "Que signifie DOM ?",
    options: ["Data Object Module", "Document Object Model", "Dynamic Output Manager", "Design Object Method"],
    answer: "Document Object Model"
  },
  {
    question: "Quelle plateforme héberge gratuitement des sites statiques via Git ?",
    options: ["Heroku", "Netlify", "GitHub Pages", "AWS S3"],
    answer: "GitHub Pages"
  },
  {
    question: "Quel type de fonction JS s'écrit avec une flèche => ?",
    options: ["Async function", "Generator function", "Arrow function", "Constructor function"],
    answer: "Arrow function"
  },
  {
    question: "Quelle propriété CSS rend un élément invisible SANS le retirer du flux ?",
    options: ["display: none", "opacity: 0", "visibility: hidden", "z-index: -1"],
    answer: "visibility: hidden"
  },
  {
    question: "Quelle méthode JS exécute une fonction pour chaque élément d'un tableau ?",
    options: ["map()", "filter()", "forEach()", "reduce()"],
    answer: "forEach()"
  },
  {
    question: "Que retourne typeof null en JavaScript ?",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    answer: "'object'"
  },
  {
    question: "Quelle balise HTML5 est sémantiquement utilisée pour la navigation principale ?",
    options: ["<div id='nav'>", "<menu>", "<nav>", "<header>"],
    answer: "<nav>"
  },
  {
    question: "Quelle méthode JS sélectionne UN élément par son sélecteur CSS ?",
    options: ["getElementById()", "querySelector()", "getElementsByClassName()", "querySelectorAll()"],
    answer: "querySelector()"
  },
  {
    question: "Que signifie 'responsive design' ?",
    options: ["Un site qui répond rapidement aux requêtes", "Un design qui s'adapte à toutes les tailles d'écran", "Un design animé et interactif", "Un site accessible aux personnes handicapées"],
    answer: "Un design qui s'adapte à toutes les tailles d'écran"
  }
];
