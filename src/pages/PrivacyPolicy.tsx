import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground mb-6">Effective Date: March 2026 · Last Updated: March 2026</p>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Introduction</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">ESTAM University ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Student Complaint and Feedback Management System.</p>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Information We Collect</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Personal information (name, email, student/staff ID)</li>
            <li>Complaint details (category, description, attachments)</li>
            <li>Technical data (login times, IP addresses for security)</li>
            <li>Cookies and tracking technologies</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">How We Use Your Information</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>To process and respond to complaints</li>
            <li>To communicate complaint status updates</li>
            <li>To improve our services</li>
            <li>To maintain security and prevent fraud</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Data Security</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Encryption of sensitive data</li>
            <li>Secure password storage (hashed)</li>
            <li>Access controls (role-based permissions)</li>
            <li>Regular security audits</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Your Rights</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Right to access your data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to request deletion (subject to record-keeping requirements)</li>
            <li>Right to withdraw consent</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Data Retention</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>Complaints retained for 5 years for institutional records</li>
            <li>User accounts retained while active</li>
            <li>Deleted accounts purged after 30 days</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground mt-6 mb-2">Contact Us</h2>
          <p className="text-sm text-muted-foreground">Data Protection Officer: <a href="mailto:privacy@estam.edu" className="text-primary hover:underline">privacy@estam.edu</a></p>
          <p className="text-sm text-muted-foreground">Address: ESTAM University, Benin Republic</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
