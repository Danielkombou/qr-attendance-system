const themeScript = `
(() => {
  const storageKey = "attendx-theme";
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(storageKey);
  const theme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : "light";

  root.dataset.theme = theme;
  root.dataset.themePreference = theme;
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
