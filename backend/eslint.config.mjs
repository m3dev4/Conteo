// import globals from "globals";
// import pluginJs from "@eslint/js";
// import prettier from "eslint-config-prettier";
// import pluginPrettier from "eslint-plugin-prettier";

// export default [
//   // Configurations générales de JavaScript recommandées
//   pluginJs.configs.recommended,
  
//   // Configuration de l'environnement global (Node.js, si votre backend est uniquement pour Node.js)
//   {
//     languageOptions: {
//       globals: globals.node,  // Définir les globals pour Node.js
//     },
//   },
  
//   // Configuration Prettier
//   {
//     plugins: {
//       prettier: pluginPrettier,
//     },
//     rules: {
//       ...pluginPrettier.configs.recommended.rules, // Règles recommandées par Prettier
//       "prettier/prettier": "error",  // S'assurer que Prettier est utilisé comme règle d'erreur
//     },
//   },
  
//   // Vous pouvez aussi ajouter vos propres règles ici, par exemple :
//   {
//     rules: {
//       "no-console": "warn",  // Exemple de règle personnalisée
//     },
//   },
// ];
