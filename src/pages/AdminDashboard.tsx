import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { AppNavbar } from "@/components/AppNavbar";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

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
  const perPage = 20;

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
    { label: "Total Complaints", value: stats.total, color: "bg-primary" },
    { label: "Pending", value: stats.pending, color: "bg-gray-500" },
    { label: "In Progress", value: stats.inProgress, color: "bg-info" },
    { label: "Resolved", value: stats.resolved, color: "bg-success" },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <AppNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6 animate-slide-up" style={{ lineHeight: "1.2" }}>
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up" style={{ animationDelay: "80ms" }}>
          {statCards.map((s) => (
            <div key={s.label} className="bg-card rounded-xl shadow-sm border border-border p-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-4 mb-6 animate-slide-up" style={{ animationDelay: "160ms" }}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by ID or student name..."
                className="w-full pl-9 pr-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="px-3 py-2.5 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
              ))}
            </select>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
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
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">ID</th>
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">Student</th>
                      <th
                        className="text-left px-6 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("category")}
                      >
                        Category {sortField === "category" && (sortDir === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left px-6 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("status")}
                      >
                        Status {sortField === "status" && (sortDir === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left px-6 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                        onClick={() => handleSort("created_at")}
                      >
                        Date {sortField === "created_at" && (sortDir === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((c) => (
                      <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{c.id.slice(0, 8)}</td>
                        <td className="px-6 py-4">{c.profiles?.name || "Unknown"}</td>
                        <td className="px-6 py-4">{c.category}</td>
                        <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link to={`/admin/complaint/${c.id}`} className="text-primary font-medium hover:underline">
                              View
                            </Link>
                            <Link to={`/admin/complaint/${c.id}`} className="text-info font-medium hover:underline">
                              Respond
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium tabular-nums">{page} / {totalPages}</span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
