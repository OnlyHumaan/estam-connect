import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { AppNavbar } from "@/components/AppNavbar";
import { Footer } from "@/components/Footer";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["Pending", "Under Review", "In Progress", "Resolved", "Closed"] as const;

interface ComplaintData {
  id: string; category: string; description: string; status: string; image_url: string | null; created_at: string; user_id: string;
  profiles: { name: string; email: string } | null;
}
interface ResponseData {
  id: string; response_text: string; created_at: string; admin_id: string; admin_name?: string;
}

export default function AdminComplaintView() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<ComplaintData | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [responseError, setResponseError] = useState("");

  const fetchData = async () => {
    if (!id) return;
    const { data: c } = await supabase.from("complaints").select("*, profiles(name, email)").eq("id", id).maybeSingle();
    if (c) { setComplaint(c as unknown as ComplaintData); setNewStatus(c.status); }
    const { data: r } = await supabase.from("responses").select("id, response_text, created_at, admin_id").eq("complaint_id", id).order("created_at", { ascending: true });
    if (r && r.length > 0) {
      const adminIds = [...new Set(r.map((x) => x.admin_id))];
      const { data: profiles } = await supabase.from("profiles").select("id, name").in("id", adminIds);
      const profileMap = new Map(profiles?.map((p) => [p.id, p.name]));
      setResponses(r.map((x) => ({ ...x, admin_name: profileMap.get(x.admin_id) || "Admin" })));
    } else { setResponses([]); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseError("");
    if (!responseText.trim()) { setResponseError("Response text is required."); return; }
    if (!user || !complaint) return;
    setSubmitting(true);
    const { error: respErr } = await supabase.from("responses").insert({ complaint_id: complaint.id, admin_id: user.id, response_text: responseText.trim() });
    if (respErr) { toast.error("Failed to submit response."); setSubmitting(false); return; }
    if (newStatus !== complaint.status) {
      await supabase.from("complaints").update({ status: newStatus as typeof STATUSES[number] }).eq("id", complaint.id);
    }
    await supabase.from("notifications").insert({
      user_id: complaint.user_id,
      message: `Your complaint #${complaint.id.slice(0, 8)} (${complaint.category}) has received a response from ${profile?.name || "Admin"}. Status: ${newStatus}.`,
    });
    toast.success("Response submitted successfully!");
    setResponseText("");
    setResponseError("");
    await fetchData();
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-secondary flex flex-col"><AppNavbar /><div className="flex items-center justify-center py-20 text-muted-foreground flex-1"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...</div><Footer /></div>
  );
  if (!complaint) return (
    <div className="min-h-screen bg-secondary flex flex-col"><AppNavbar /><div className="flex items-center justify-center py-20 text-muted-foreground flex-1">Complaint not found</div><Footer /></div>
  );

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex-1">
        <button onClick={() => navigate("/admin")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
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
            <div><h3 className="text-sm font-medium text-muted-foreground mb-1">Submitted by</h3>
              <p className="text-sm text-foreground font-medium">{complaint.profiles?.name} ({complaint.profiles?.email})</p></div>
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
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Response History ({responses.length})</h2>
          {responses.length > 0 && (
            <div className="space-y-4 mb-6">
              {responses.map((r) => (
                <div key={r.id} className="border border-border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{r.admin_name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{r.response_text}</p>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmitResponse} className="space-y-4 border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-foreground">Submit Response</h3>
            <div>
              <textarea value={responseText} onChange={(e) => { setResponseText(e.target.value); setResponseError(""); }} rows={4}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none ${responseError ? "border-destructive" : "border-input"}`}
                placeholder="Write your response..." />
              {responseError && <p className="text-xs text-destructive mt-1">{responseError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Update Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                className="w-full sm:w-auto px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" disabled={submitting || !responseText.trim()}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 active:scale-[0.98]">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Submit Response"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
