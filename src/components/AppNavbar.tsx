import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { LogOut, Menu, X, Search, User } from "lucide-react";
import { useState } from "react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import estamLogo from "@/assets/estamlogo.png";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function AppNavbar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = profile?.role === "admin";

  const navLinks = isAdmin
    ? [{ to: "/admin", label: "Admin Dashboard" }]
    : [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/submit-complaint", label: "Complaints" },
        { to: "/my-complaints", label: "My Complaints" },
        { to: "/notifications", label: "Notifications" },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-3">
                <img src={estamLogo} alt="Estam University" className="h-10 sm:h-12 object-contain" />
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.to) ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                    }`}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:block">
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>

              {!isAdmin && <NotificationDropdown />}

              <Link to="/profile" className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:block" title="Profile">
                <User className="h-5 w-5 text-muted-foreground" />
              </Link>

              <button onClick={signOut}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium border border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors">
                <LogOut className="h-4 w-4" />
                Logout
              </button>

              {profile && (
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {getInitials(profile.name)}
                </div>
              )}

              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-muted rounded-md">
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
        <div className="h-0.5 bg-[hsl(24,95%,53%)]" />
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium ${
                isActive(link.to) ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-muted"
              }`}>
              {link.label}
            </Link>
          ))}
          <Link to="/profile" onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted">
            Profile
          </Link>
          <button onClick={signOut}
            className="w-full text-left px-4 py-3 text-sm font-medium text-destructive hover:bg-muted flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </>
  );
}
