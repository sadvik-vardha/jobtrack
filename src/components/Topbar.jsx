import { Menu, Search, Moon, Sun } from "lucide-react";

export default function Topbar({
  title,
  search,
  onSearchChange,
  onOpenMenu,
  theme,
  onToggleTheme,
  initials,
  onOpenProfile,
}) {
  const isDark = theme === "dark";

  return (
    <header className="topbar">
      <button
        className="icon-btn menu-toggle"
        onClick={onOpenMenu}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <h1 className="topbar__title">{title}</h1>

      <div className="search">
        <Search size={18} />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company or job title"
          aria-label="Search applications"
        />
      </div>

      <button
        className="icon-btn"
        onClick={onToggleTheme}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <button
        className="avatar"
        onClick={onOpenProfile}
        title="Edit your profile"
        aria-label="Edit your profile"
      >
        {initials}
      </button>
    </header>
  );
}