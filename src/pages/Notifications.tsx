import { useEffect, useState } from "react";
import { AppNavbar } from "@/components/AppNavbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Loader2 } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  read_status: boolean;
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false });
      setNotifications((data as Notification[]) || []);
      setLoading(false);
      if (data && data.length > 0) {
        const unread = data.filter((n) => !n.read_status).map((n) => n.id);
        if (unread.length > 0) {
          await supabase.from("notifications").update({ read_status: true }).in("id", unread);
        }
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold text-foreground mb-6 animate-slide-up" style={{ lineHeight: "1.2" }}>Notifications</h1>
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "80ms" }}>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="bg-card rounded-xl shadow-sm border border-border p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`bg-card rounded-lg shadow-sm border p-4 transition-colors ${n.read_status ? "border-border" : "border-primary/30 bg-primary/[0.02]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-foreground">{n.message}</p>
                  {!n.read_status && <span className="shrink-0 h-2 w-2 rounded-full bg-primary mt-1.5" />}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
