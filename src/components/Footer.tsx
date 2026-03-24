import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-6 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© 2026 Estam University. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors">Terms of Service</Link>
          <Link to="/help" className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors">Help Center</Link>
        </div>
      </div>
    </footer>
  );
}
