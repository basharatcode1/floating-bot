export const themes = {
  "deep-space": {
    name: "Deep Space",
    label: "Deep Space Ocean Blue",
    previewColor: "#005A9C",
    vars: {
      "--primary": "#005A9C",
      "--primary-hover": "#004A82",
      "--brand-blue": "#005A9C",
      "--dark-bg": "#080D17",
      "--dark-bg-alt": "#0E1524",
      "--light-bg": "#FAFAFB",
      "--light-bg-alt": "#F1F3F5",
      "--accent-primary": "#005A9C",
      "--accent-primary-hover": "#004A82",
      "--accent-secondary": "#06B6D4",
      "--accent-success": "#198754",
      "--text-on-dark": "#FFFFFF",
      "--text-on-dark-muted": "#94A3B8",
      "--text-on-light": "#080D17",
      "--text-on-light-muted": "#64748B",
      "--gradient-from": "#06B6D4",
      "--gradient-to": "#005A9C",
      "--card-dark": "rgba(255,255,255,0.03)",
      "--card-dark-border": "rgba(255,255,255,0.07)",
      "--card-light": "#FFFFFF",
      "--card-light-border": "#E2E8F0",
      "--ghost-btn-border": "rgba(255,255,255,0.18)",
      "--ghost-btn-hover": "rgba(255,255,255,0.06)",
    },
  },
};

export function applyTheme(themeKey) {
  const theme = themes[themeKey];
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme.vars as Record<string, string>).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });
}
