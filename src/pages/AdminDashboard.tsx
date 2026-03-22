import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AppNavbar } from "@/components/AppNavbar";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { Search, Download, ChevronLeft, ChevronRight, ClipboardList, Clock, RefreshCw, CheckCircle2, Eye, Pencil, Filter } from "lucide-react";

const CATEGORIES = [
  "All",
  "Academic Issues",
  "Facility Problems",
  "Administrative Concerns",
  "Hostel and Accommodation",
  "Library Services",
  "ICT Issues",
  "Student Welfare",
  "Other Matters",
];

const STATUSES = ["All", "Pending", "Under Review", "In Progress", "Resolved", "Closed"];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

interface Complaint {
  id: string;
  category: string;
  status: string;
  description: string;
  created_at: string;
  user_id: string;
  profiles: { name: string; email: string } | null;
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"created_at" | "status" | "category">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("complaints")
        .select("id, category, status, description, created_at, user_id, profiles(name, email)")
        .order("created_at", { ascending: false });
      setComplaints((data as unknown as Complaint[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === "Pending").length;
    const inProgress = complaints.filter((c) => c.status === "In Progress").length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;
    return { total, pending, inProgress, resolved };
  }, [complaints]);

  const filtered = useMemo(() => {
    let list = [...complaints];
    if (filterCategory !== "All") list = list.filter((c) => c.category === filterCategory);
    if (filterStatus !== "All") list = list.filter((c) => c.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          (c.profiles?.name || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [complaints, filterCategory, filterStatus, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Student", "Email", "Category", "Status", "Date", "Description"];
    const rows = filtered.map((c) => [
      c.id.slice(0, 8),
      c.profiles?.name || "",
      c.profiles?.email || "",
      c.category,
      c.status,
      new Date(c.created_at).toLocaleDateString(),
      `"${c.description.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaints_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statCards = [
    {
      label: "Total Complaints",
      value: stats.total,
      icon: <ClipboardList className="h-6 w-6" />,
      iconBg: "bg-primary/10 text-primary",
      trend: "+12%",
      trendColor: "text-success",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: <Clock className="h-6 w-6" />,
      iconBg: "bg-warning/10 text-warning",
      trend: "+5%",
      trendColor: "text-warning",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: <RefreshCw className="h-6 w-6" />,
      iconBg: "bg-info/10 text-info",
      trend: "-2%",
      trendColor: "text-destructive",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: <CheckCircle2 className="h-6 w-6" />,
      iconBg: "bg-success/10 text-success",
      trend: "+15%",
      trendColor: "text-success",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <AppNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ lineHeight: "1.2" }}>
            Complaint Management Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time overview and student grievance processing
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up" style={{ animationDelay: "80ms" }}>
          {statCards.map((s) => (
            <div key={s.label} className="bg-card rounded-xl shadow-sm border border-border p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${s.iconBg}`}>
                  {s.icon}
                </div>
                <span className={`text-xs font-semibold ${s.trendColor}`}>{s.trend}↗</span>
              </div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6 animate-slide-up" style={{ animationDelay: "160ms" }}>
          <h2 className="text-lg font-bold text-foreground mb-4">Filter Complaints</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-primary mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => { setFilterCategory("All"); setFilterStatus("All"); setPage(1); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(24,95%,53%)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.98] whitespace-nowrap"
            >
              <Filter className="h-4 w-4" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Search & Export Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by ID or student name..."
              className="w-full pl-9 pr-3 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border animate-slide-up" style={{ animationDelay: "240ms" }}>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : paged.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No complaints found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-4 font-semibold text-primary uppercase text-xs tracking-wider">Complaint ID</th>
                      <th className="text-left px-6 py-4 font-semibold text-primary uppercase text-xs tracking-wider">Student Name</th>
                      <th
                        className="text-left px-6 py-4 font-semibold text-primary uppercase text-xs tracking-wider cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("category")}
                      >
                        Category {sortField === "category" && (sortDir === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left px-6 py-4 font-semibold text-primary uppercase text-xs tracking-wider cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("status")}
                      >
                        Status {sortField === "status" && (sortDir === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left px-6 py-4 font-semibold text-primary uppercase text-xs tracking-wider cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("created_at")}
                      >
                        Date Submitted {sortField === "created_at" && (sortDir === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="text-left px-6 py-4 font-semibold text-primary uppercase text-xs tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-5 font-semibold text-[hsl(24,95%,53%)] text-sm">
                          #CMP-{c.id.slice(0, 4).toUpperCase()}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                              {getInitials(c.profiles?.name || "U")}
                            </div>
                            <span className="font-medium text-foreground">{c.profiles?.name || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-muted-foreground">{c.category}</td>
                        <td className="px-6 py-5"><StatusBadge status={c.status} /></td>
                        <td className="px-6 py-5 text-muted-foreground">
                          {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/admin/complaint/${c.id}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/admin/complaint/${c.id}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                              title="Respond"
                            >
                              <Pencil className="h-5 w-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {paged.length} of {filtered.length} complaints
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-30 transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "border-2 border-[hsl(24,95%,53%)] text-[hsl(24,95%,53%)]"
                          : "border border-border hover:bg-muted"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || totalPages === 0}
                    className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-30 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
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
