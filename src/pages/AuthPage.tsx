import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";
import { Loader2, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import estamLogo from "@/assets/estamlogo.png";

export default function AuthPage({ defaultTab = "login" }: { defaultTab?: "login" | "register" }) {
  const { user, profile, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultTab === "login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && profile) {
    return <Navigate to={profile.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <nav className="bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3">
            <img src={estamLogo} alt="Estam University" className="h-10 sm:h-12 object-contain" />
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">Help Center</span>
            <a href="/" className="text-sm border border-border rounded-lg px-4 py-2 text-foreground hidden sm:block hover:bg-muted transition-colors">Home</a>
          </div>
        </div>
      </nav>
      <div className="h-1 bg-[hsl(24,95%,53%)]" />

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="w-full max-w-md animate-slide-up relative z-10">
          <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="p-8 sm:p-10">
              {isLogin ? (
                <LoginForm onSwitch={() => setIsLogin(false)} />
              ) : (
                <RegisterForm onSwitch={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setSubmitting(false);
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground text-sm mt-1">Student Complaint Management System</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-muted/30"
            placeholder="name@estam.edu" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-foreground">Password</label>
          <button type="button" className="text-xs text-primary font-medium hover:underline">Forgot password?</button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-muted/30"
            placeholder="••••••••" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button type="submit" disabled={submitting}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Sign In
      </button>

      <div className="border-t border-border pt-4 mt-4">
        <p className="text-xs text-muted-foreground text-center mb-3">Demo Accounts (click to fill)</p>
        <div className="grid grid-cols-1 gap-2">
          {[
            { label: "Admin", email: "admin@estam.edu", pw: "admin123" },
            { label: "Student", email: "student@estam.edu", pw: "student123" },
            { label: "Lecturer", email: "lecturer@estam.edu", pw: "lecturer123" },
          ].map((d) => (
            <button key={d.email} type="button" onClick={() => fillDemo(d.email, d.pw)}
              className="text-xs border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors text-left">
              <span className="font-semibold text-foreground">{d.label}:</span>{" "}
              <span className="text-muted-foreground">{d.email} / {d.pw}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-center text-muted-foreground">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-primary font-semibold hover:underline">Register here</button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setSubmitting(true);
    const { error } = await signUp(email, password, name, role);
    if (error) { setError(error); } else { setSuccess("Account created! You can now sign in."); }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-muted-foreground text-sm mt-1">Join the Complaint Management System</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-muted/30"
            placeholder="John Doe" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-muted/30"
            placeholder="you@estam.edu" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-muted/30"
            placeholder="Min. 6 characters" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-muted/30">
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
        </select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <button type="submit" disabled={submitting}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Create Account
      </button>
      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-primary font-semibold hover:underline">Sign in</button>
      </p>
    </form>
  );
}
