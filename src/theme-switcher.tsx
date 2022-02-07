import React from 'react';

// function toggleTheme() {
//   const element = document.querySelector("html");
//   if (!element) return;
//   const currentTheme = element.getAttribute("data-theme");
//   const newTheme = currentTheme === "dark" ? "light": "dark";
//   element.setAttribute("data-theme", newTheme);
// }

type ValidTheme = "auto" | "light" | "dark";

function cycleTheme(): ValidTheme {
  const element = document.querySelector("html");
  if (!element) return "auto"
  const currentTheme = (element.getAttribute("data-theme") || "auto") as ValidTheme;

  const themeCycle: Map<ValidTheme, ValidTheme> = new Map([
    ["auto", "dark"],
    ["dark", "light"],
    ["light", "auto"],
  ]);
  const nextTheme = themeCycle.get(currentTheme) || "auto";

  element.setAttribute("data-theme", nextTheme);
  return nextTheme;
}

function getThemeName(theme: ValidTheme): string {
  const element = document.querySelector("html");
  if (!element) return ""
  const options: Map<string, string> = new Map([
    ["dark", "Dark"],
    ["light", "Light"],
    ["auto", "Auto"],
  ]);
  return options.get(theme) || "";
}

function getBaseUrl(): string {
  return (
    window.location.protocol + '//' +
    window.location.host +
    window.location.pathname
  );
}

export function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<ValidTheme>("auto");
  const clickHandler = () => {
    const newTheme = cycleTheme();
    setTheme(newTheme);
  }
  const buttonText = getThemeName(theme);

  return (
    <nav>
      <ul>
        <li><strong><a href={getBaseUrl()}>Youtube helper</a></strong></li>
      </ul>
      <ul>
        Theme:
        <li><button className="small" onClick={clickHandler}>{buttonText}</button></li>
      </ul>
    </nav>
  );
}

