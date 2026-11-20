// Les photos de profil ne sont plus des fichiers du projet : chaque personne choisit la sienne.
// Pour les personnes d'exemple (sans photo), on affiche leur initiale sur une couleur stable.
const COLORS = ["#0866FF", "#7C3AED", "#DB2777", "#EA580C", "#047857", "#0E7490", "#B45309", "#BE185D"];

export function avatarColor(name: string): string {
  let total = 0;
  for (const ch of name) total += ch.charCodeAt(0);
  return COLORS[total % COLORS.length];
}
