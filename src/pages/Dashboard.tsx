import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { AppNavbar } from "@/components/AppNavbar";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Plus } from "lucide-react";

interface Complaint {
  id: string;
  category: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("complaints")
        .select("id, category, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      setComplaints((data as Complaint[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-secondary">
      <AppNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-slide-up">
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ lineHeight: "1.2" }}>
              Welcome, {profile?.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your complaints and track their progress
            </p>
          </div>
          <Link
            to="/submit-complaint"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.98] self-start"
          >
            <Plus className="h-4 w-4" />
            Submit New Complaint
          </Link>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">My Complaints</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">You haven't submitted any complaints yet</p>
              <Link
                to="/submit-complaint"
                className="inline-block mt-4 text-sm text-primary font-medium hover:underline"
              >
                Submit your first complaint →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground">ID</th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{c.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">{c.category}</td>
                      <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/complaint/${c.id}`}
                          className="text-primary font-medium hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
