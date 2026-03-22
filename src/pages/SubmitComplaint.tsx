import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { AppNavbar } from "@/components/AppNavbar";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, ArrowLeft, Send, Info } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Academic Issues",
  "Facility Problems",
  "Administrative Concerns",
  "Hostel and Accommodation",
  "Library Services",
  "ICT Issues",
  "Student Welfare",
  "Other Matters",
] as const;

export default function SubmitComplaint() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(f.type)) {
      setError("Only JPG and PNG files are allowed.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!category) { setError("Please select a category."); return; }
    if (!description.trim()) { setError("Please describe your complaint."); return; }
    if (!user) return;

    setSubmitting(true);
    let imageUrl: string | null = null;

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("complaint-images")
        .upload(path, file);
      if (uploadErr) {
        setError("Failed to upload image.");
        setSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("complaint-images")
        .getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const { error: insertErr } = await supabase.from("complaints").insert({
      user_id: user.id,
      category: category as typeof CATEGORIES[number],
      description: description.trim(),
      image_url: imageUrl,
    });

    if (insertErr) {
      setError("Failed to submit complaint. Please try again.");
      setSubmitting(false);
      return;
    }

    toast.success("Complaint submitted successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-secondary">
      <AppNavbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8 animate-slide-up">
          <h1 className="text-xl font-bold text-foreground mb-6" style={{ lineHeight: "1.2" }}>
            Submit New Complaint
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                Complaint Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                Complaint Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
                placeholder="Describe your complaint in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                Attach Image (Optional)
              </label>
              <div
                className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer bg-muted/20"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-foreground font-medium">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-primary mt-1">PNG, JPG or PDF (MAX. 5MB)</p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3 pt-2 justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 text-foreground rounded-xl text-sm font-semibold hover:bg-muted transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Complaint
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 bg-info/5 border border-info/20 rounded-xl p-4 flex gap-3 items-start animate-slide-up" style={{ animationDelay: "100ms" }}>
          <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Privacy Note:</span> Your complaint will be treated with confidentiality. For urgent security matters, please contact campus security directly at (555) 0123.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2024 Estam University. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Privacy Policy</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Terms of Service</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Help Center</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
