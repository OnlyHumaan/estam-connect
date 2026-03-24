import { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { ArrowLeft, ChevronDown, ChevronUp, Search, BookOpen, HelpCircle, Wrench, Mail, CircleDot } from "lucide-react";

const faqs = [
  { q: "How do I submit a complaint?", a: "Log in to your account, click \"Submit Complaint,\" select the appropriate category, describe your issue in detail, optionally attach an image, and click \"Submit.\" You will receive a confirmation and complaint ID." },
  { q: "How do I track my complaint status?", a: "After logging in, go to \"My Complaints\" or your dashboard. You'll see all your submitted complaints with their current status (Pending, Under Review, In Progress, Resolved, or Closed)." },
  { q: "What do the different statuses mean?", a: "Pending: Complaint received, awaiting review. Under Review: Being examined by administrator. In Progress: Actions being taken to resolve. Resolved: Issue has been addressed. Closed: Complaint completed and archived." },
  { q: "How long does it take to get a response?", a: "Most complaints receive an initial response within 2-3 business days. Resolution times vary depending on the complexity of the issue." },
  { q: "Can I update or delete my complaint?", a: "You can view your complaint details at any time. To modify or withdraw a complaint, please contact support@estam.edu with your complaint ID." },
  { q: "Will my complaint be confidential?", a: "Yes, complaints are only visible to you and authorized administrators. Your privacy is protected according to our Privacy Policy." },
  { q: "What types of complaints can I submit?", a: "Academic Issues, Facility Problems, Administrative Concerns, Hostel and Accommodation, Library Services, ICT Issues, Student Welfare, and Other Matters." },
  { q: "I forgot my password. How do I reset it?", a: "Click \"Forgot Password\" on the login page, enter your email, and follow the instructions sent to your email to reset your password." },
  { q: "Can I submit complaints on behalf of someone else?", a: "No, each user must submit their own complaints using their account for accountability and proper follow-up." },
  { q: "How do I know when my complaint is updated?", a: "You'll receive a notification (shown with a bell icon in the navigation bar) whenever an administrator responds or changes your complaint status." },
];

const troubleshooting = [
  { title: "I can't log in", solution: "Verify your email and password are correct. Check Caps Lock is not on. Use \"Forgot Password\" if you don't remember. Clear browser cache and try again. Contact support if issue persists." },
  { title: "My complaint isn't showing up", solution: "Refresh the page. Log out and log back in. Check \"My Complaints\" section. If still missing after 5 minutes, contact support with your complaint details." },
  { title: "I'm not receiving notifications", solution: "Check the bell icon in the navigation bar. Go to Notifications page to see all notifications. Ensure you're logged in. Contact support if notifications aren't appearing." },
  { title: "The page won't load", solution: "Check your internet connection. Try refreshing the page (Ctrl+R or Cmd+R). Clear browser cache and cookies. Try a different browser. Contact support if problem continues." },
];

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = searchQuery.trim()
    ? faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqs;

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <nav className="bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Link to="/" className="text-lg font-bold text-primary">ESTAM University</Link>
        </div>
        <div className="h-0.5 bg-[hsl(24,95%,53%)]" />
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex-1">
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-2 animate-slide-up">Help Center</h1>
        <p className="text-sm text-muted-foreground mb-6">Find answers, guides, and troubleshooting tips.</p>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-9 pr-3 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          />
        </div>

        {/* System Status */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 mb-6 flex items-center gap-3 animate-slide-up">
          <CircleDot className="h-5 w-5 text-success" />
          <span className="text-sm font-medium text-foreground">All Systems Operational</span>
        </div>

        {/* FAQs */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "80ms" }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5" /> Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No results found for "{searchQuery}"</p>
            )}
          </div>
        </section>

        {/* Step-by-Step Guides */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "160ms" }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Step-by-Step Guides
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "How to Register", steps: ["Go to the system homepage", "Click \"Register\"", "Fill in your name, email, and password", "Select your role (Student or Lecturer)", "Click \"Create Account\""] },
              { title: "How to Submit a Complaint", steps: ["Log in to your account", "Click \"Submit Complaint\"", "Select the complaint category", "Write a detailed description", "Optionally upload an image", "Click \"Submit Complaint\""] },
              { title: "How to Track Your Complaint", steps: ["Log in to your account", "Go to \"My Complaints\"", "View status column", "Click \"View Details\" for full info"] },
              { title: "How to Change Your Password", steps: ["Go to your Profile page", "Click \"Change Password\"", "Enter your new password", "Confirm your new password", "Click \"Update Password\""] },
            ].map((guide) => (
              <div key={guide.title} className="bg-card rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">{guide.title}</h3>
                <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal pl-4">
                  {guide.steps.map((s, j) => <li key={j}>{s}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: "240ms" }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wrench className="h-5 w-5" /> Troubleshooting
          </h2>
          <div className="space-y-3">
            {troubleshooting.map((t) => (
              <div key={t.title} className="bg-card rounded-lg border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.solution}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="animate-slide-up" style={{ animationDelay: "320ms" }}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" /> Contact Support
          </h2>
          <div className="bg-card rounded-lg border border-border p-6 text-center">
            <p className="text-sm text-foreground font-medium mb-2">Need More Help?</p>
            <p className="text-sm text-muted-foreground">Email: <a href="mailto:support@estam.edu" className="text-primary hover:underline">support@estam.edu</a></p>
            <p className="text-sm text-muted-foreground">Office Hours: Monday – Friday, 8:00 AM – 5:00 PM</p>
            <p className="text-sm text-muted-foreground">Location: IT Department, ESTAM University</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
