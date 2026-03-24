import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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

        <div className="bg-card rounded-xl shadow-sm border border-border p-6 sm:p-8 animate-slide-up prose prose-sm max-w-none">
          <h1 className="text-2xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-xs text-muted-foreground mb-6">Effective Date: March 2026</p>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Agreement to Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">By accessing and using the ESTAM University Student Complaint and Feedback Management System, you agree to be bound by these Terms of Service.</p>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Acceptable Use Policy</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Use system only for legitimate complaints</li>
            <li>Provide truthful and accurate information</li>
            <li>Respect confidentiality of others</li>
            <li>No harassment, threats, or abusive language</li>
            <li>No spam or automated submissions</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">User Responsibilities</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Maintain confidentiality of login credentials</li>
            <li>Update contact information as needed</li>
            <li>Report security vulnerabilities</li>
            <li>Follow university code of conduct</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Prohibited Activities</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Submitting false or malicious complaints</li>
            <li>Impersonating other users</li>
            <li>Attempting to access other users' data</li>
            <li>Interfering with system operations</li>
            <li>Violating applicable laws</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Complaint Processing</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Response times are estimates, not guarantees</li>
            <li>University reserves right to prioritize complaints</li>
            <li>Not all complaints may result in desired outcome</li>
            <li>Complaint outcomes subject to university policies</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">System Availability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">System provided "as is." We aim for 99% uptime but do not guarantee. Scheduled maintenance windows communicated in advance. No liability for temporary unavailability.</p>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Limitation of Liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">University not liable for indirect or consequential damages. Liability limited to extent permitted by law. System does not replace formal grievance procedures.</p>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Governing Law</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Governed by laws of Benin Republic. Disputes subject to university dispute resolution process.</p>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Contact</h2>
          <p className="text-sm text-muted-foreground">Questions: <a href="mailto:support@estam.edu" className="text-primary hover:underline">support@estam.edu</a></p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
