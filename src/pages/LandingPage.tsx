import { Link } from "react-router-dom";
import { Shield, Clock, Eye, Zap, FolderOpen, Bell } from "lucide-react";
import { Footer } from "@/components/Footer";

const features = [
  { icon: <Clock className="h-8 w-8" />, title: "24/7 Complaint Submission", desc: "Submit complaints anytime, anywhere through our secure online platform." },
  { icon: <Eye className="h-8 w-8" />, title: "Real-Time Status Tracking", desc: "Monitor the progress of your complaint from submission to resolution." },
  { icon: <Shield className="h-8 w-8" />, title: "Secure & Confidential", desc: "Your complaints are handled with strict confidentiality and data protection." },
  { icon: <Zap className="h-8 w-8" />, title: "Fast Administrative Response", desc: "Dedicated administrators ensure timely review and response to all grievances." },
  { icon: <FolderOpen className="h-8 w-8" />, title: "Comprehensive Categorization", desc: "Organized complaint categories ensure your issue reaches the right department." },
  { icon: <Bell className="h-8 w-8" />, title: "In-System Notifications", desc: "Get notified instantly when there are updates on your complaints." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <span className="text-lg font-bold text-primary">ESTAM University</span>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-sm font-semibold text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
              Register
            </Link>
          </div>
        </div>
        <div className="h-0.5 bg-[hsl(24,95%,53%)]" />
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 sm:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDE0djEyaC0yVjE0aDJ6TTI0IDI2VjE0aDJ2MTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Student Complaint and Feedback<br />Management System
          </h1>
          <p className="text-lg sm:text-xl font-medium text-primary-foreground/80 mb-3 italic">
            Efficient, Transparent, Accountable
          </p>
          <p className="text-base sm:text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            A secure platform for students and lecturers to submit complaints, track progress, and receive timely responses from the university administration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-8 py-3.5 bg-white text-primary rounded-xl text-base font-semibold hover:bg-white/90 transition-colors active:scale-[0.98]">
              Login to Your Account
            </Link>
            <Link to="/register" className="px-8 py-3.5 border-2 border-white/40 text-white rounded-xl text-base font-semibold hover:bg-white/10 transition-colors active:scale-[0.98]">
              Create New Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Key Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our system provides a comprehensive solution for managing student complaints efficiently.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
