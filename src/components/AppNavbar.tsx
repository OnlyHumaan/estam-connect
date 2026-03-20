import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AppNavbar() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    if (!profile) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id)
        .eq("read_status", false);
      setUnreadCount(count || 0);
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [profile]);

  const navLinks = isAdmin
    ? [
        { to: "/admin", label: "Admin Dashboard" },
        { to: "/admin/complaints", label: "All Complaints" },
      ]
    : [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/submit-complaint", label: "Submit Complaint" },
        { to: "/my-complaints", label: "My Complaints" },
        { to: "/notifications", label: "Notifications" },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg hidden sm:block">Estam University</span>
            <span className="font-semibold text-lg sm:hidden">ESTAM</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isAdmin && (
              <Link to="/notifications" className="relative p-2 hover:bg-white/10 rounded-md transition-colors">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            <span className="text-sm hidden lg:block">
              {profile?.name}
            </span>

            <button
              onClick={signOut}
              className="hidden md:flex items-center gap-1 px-3 py-2 text-sm hover:bg-white/10 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-md"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 pb-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium ${
                isActive(link.to) ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/10 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
