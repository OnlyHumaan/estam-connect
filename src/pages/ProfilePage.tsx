import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppNavbar } from "@/components/AppNavbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [saving, setSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleSaveName = async () => {
    if (!name.trim() || !user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ name: name.trim() }).eq("id", user.id);
    if (error) toast.error("Failed to update name.");
    else { toast.success("Name updated successfully!"); setEditingName(false); }
    setSaving(false);
  };

  const passwordStrength = (pw: string) => {
    if (pw.length < 6) return { label: "Too short", color: "bg-destructive", width: "w-1/4" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-destructive", width: "w-1/4" };
    if (score === 2) return { label: "Fair", color: "bg-warning", width: "w-2/4" };
    if (score === 3) return { label: "Good", color: "bg-info", width: "w-3/4" };
    return { label: "Strong", color: "bg-success", width: "w-full" };
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match."); return; }
    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else { toast.success("Password changed successfully!"); setNewPassword(""); setConfirmPassword(""); setShowChangePw(false); }
    setChangingPw(false);
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNavbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex-1">
        <h1 className="text-2xl font-bold text-foreground mb-6 animate-slide-up">My Profile</h1>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8 animate-slide-up space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
              {profile?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U"}
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{profile?.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{profile?.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Full Name</p>
                {editingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input value={name} onChange={(e) => setName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                    <button onClick={handleSaveName} disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </button>
                    <button onClick={() => { setEditingName(false); setName(profile?.name || ""); }} className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-foreground">{profile?.name}</p>
                    <button onClick={() => setEditingName(true)} className="text-xs text-primary font-medium hover:underline">Edit</button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Email Address</p><p className="text-sm text-foreground mt-1">{profile?.email}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Role</p><p className="text-sm text-foreground mt-1 capitalize">{profile?.role}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
              <div><p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Account Created</p>
                <p className="text-sm text-foreground mt-1">{user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}</p></div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <button onClick={() => setShowChangePw(!showChangePw)} className="text-sm font-semibold text-primary hover:underline">
            {showChangePw ? "Cancel Password Change" : "Change Password"}
          </button>
          {showChangePw && (
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full ${strength.color} ${strength.width} transition-all rounded-full`} /></div>
                    <p className="text-xs text-muted-foreground mt-1">Strength: {strength.label}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" placeholder="Re-enter password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && <p className="text-xs text-destructive mt-1">Passwords do not match</p>}
              </div>
              <button type="submit" disabled={changingPw} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                {changingPw && <Loader2 className="h-4 w-4 animate-spin" />} Update Password
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
