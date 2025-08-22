
// CSSColorVariablesObject
import { CSSColorVariablesObject } from "@/types/palette";

export function injectColorVariablesObjectToCSS(colors: CSSColorVariablesObject) {
  const root = document.documentElement;
    root.style.setProperty('--preview-primary', colors.primary);
    root.style.setProperty('--preview-secondary', colors.secondary);
    root.style.setProperty('--preview-background', colors.background);
    root.style.setProperty('--preview-foreground', colors.foreground);
    root.style.setProperty('--preview-card', colors.card);
    root.style.setProperty('--preview-border', colors.border);
    root.style.setProperty('--preview-muted', colors.muted);
    root.style.setProperty('--preview-primary-foreground', colors['primary-foreground']);
    root.style.setProperty('--preview-secondary-foreground', colors['secondary-foreground']);
    root.style.setProperty('--preview-accent-foreground', colors['accent-foreground']);
    root.style.setProperty('--preview-card-foreground', colors['card-foreground']);
    root.style.setProperty('--preview-muted-foreground', colors['muted-foreground']);
}