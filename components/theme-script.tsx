const themeScript = `
(() => {
  const storageKey = "attendx-theme";
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(storageKey);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
    ? savedTheme
    : "system";
  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  root.dataset.theme = resolvedTheme;
  root.dataset.themePreference = theme;
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
