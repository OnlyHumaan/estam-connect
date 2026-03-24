import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppNavbar } from "@/components/AppNavbar";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Loader2 } from "lucide-react";

interface Complaint {
  id: string;
  category: string;
  status: string;
  created_at: string;
}

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("complaints").select("id, category, status, created_at").order("created_at", { ascending: false });
      setComplaints((data as Complaint[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <h1 className="text-2xl font-bold text-foreground mb-6 animate-slide-up" style={{ lineHeight: "1.2" }}>My Complaints</h1>
        <div className="bg-card rounded-xl shadow-sm border border-border animate-slide-up" style={{ animationDelay: "80ms" }}>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">You haven't submitted any complaints yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">ID</th>
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Action</th>
                </tr></thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{c.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">{c.category}</td>
                      <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><Link to={`/complaint/${c.id}`} className="text-primary font-medium hover:underline">View Details</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
