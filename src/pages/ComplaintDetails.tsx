import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppNavbar } from "@/components/AppNavbar";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MessageSquare, Loader2 } from "lucide-react";

interface ComplaintData {
  id: string; category: string; description: string; status: string; image_url: string | null; created_at: string;
}
interface ResponseData {
  id: string; response_text: string; created_at: string; admin: { name: string } | null;
}

export default function ComplaintDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<ComplaintData | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data: c } = await supabase.from("complaints").select("*").eq("id", id).maybeSingle();
      setComplaint(c as ComplaintData | null);
      const { data: r } = await supabase.from("responses").select("id, response_text, created_at, admin_id").eq("complaint_id", id).order("created_at", { ascending: true });
      if (r && r.length > 0) {
        const adminIds = [...new Set(r.map((x) => x.admin_id))];
        const { data: profiles } = await supabase.from("profiles").select("id, name").in("id", adminIds);
        const profileMap = new Map(profiles?.map((p) => [p.id, p.name]));
        setResponses(r.map((x) => ({ id: x.id, response_text: x.response_text, created_at: x.created_at, admin: { name: profileMap.get(x.admin_id) || "Admin" } })));
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNavbar />
      <div className="flex items-center justify-center py-20 text-muted-foreground flex-1"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...</div>
      <Footer />
    </div>
  );

  if (!complaint) return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNavbar />
      <div className="flex items-center justify-center py-20 text-muted-foreground flex-1">Complaint not found</div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex-1">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 sm:p-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-1">#{complaint.id.slice(0, 8)}</p>
              <h1 className="text-xl font-bold text-foreground" style={{ lineHeight: "1.2" }}>{complaint.category}</h1>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
          <div className="space-y-4">
            <div><h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{complaint.description}</p></div>
            {complaint.image_url && (
              <div><h3 className="text-sm font-medium text-muted-foreground mb-2">Attached Image</h3>
                <img src={complaint.image_url} alt="Complaint attachment" className="rounded-lg max-w-full max-h-80 object-cover border border-border" /></div>
            )}
            <div><h3 className="text-sm font-medium text-muted-foreground">Submitted</h3>
              <p className="text-sm text-foreground">{new Date(complaint.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p></div>
          </div>
        </div>
        <div className="mt-6 bg-card rounded-xl shadow-sm border border-border p-6 sm:p-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Responses ({responses.length})</h2>
          {responses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No responses yet. An administrator will review your complaint soon.</p>
          ) : (
            <div className="space-y-4">
              {responses.map((r) => (
                <div key={r.id} className="border border-border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{r.admin?.name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{r.response_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
