import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import {
  Users, Clock, TrendingUp, XCircle, CheckCircle, Mail,
  RefreshCw, ChevronDown, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

export default function AdminTrialDashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState("all");

  const statsQuery = trpc.trials.stats.useQuery();
  const trialsQuery = trpc.trials.list.useQuery({ status: statusFilter === "all" ? undefined : statusFilter });
  const processNurture = trpc.trials.processNurture.useMutation();
  const updateStatus = trpc.trials.updateStatus.useMutation();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Access denied</p>
      </div>
    );
  }

  const stats = statsQuery.data || { active: 0, expired: 0, converted: 0, cancelled: 0, total: 0 };
  const trials = trialsQuery.data?.trials || [];

  const handleProcessNurture = async () => {
    try {
      const result = await processNurture.mutateAsync();
      toast.success(`Nurture processed: ${result.sent} emails triggered, ${result.expired} trials expired`);
      trialsQuery.refetch();
      statsQuery.refetch();
    } catch {
      toast.error("Failed to process nurture emails");
    }
  };

  const handleStatusChange = async (id: number, status: "active" | "expired" | "converted" | "cancelled") => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Trial status updated to ${status}`);
      trialsQuery.refetch();
      statsQuery.refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getDaysRemaining = (expiresAt: string | Date) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400 bg-green-400/10";
      case "expired": return "text-amber-400 bg-amber-400/10";
      case "converted": return "text-blue-400 bg-blue-400/10";
      case "cancelled": return "text-red-400 bg-red-400/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate("/admin")} className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-1">
              ← Back to Admin
            </button>
            <h1 className="text-2xl font-bold text-foreground">Trial Management</h1>
            <p className="text-sm text-muted-foreground">Monitor trials, nurture sequences, and conversion pipeline</p>
          </div>
          <button
            onClick={handleProcessNurture}
            disabled={processNurture.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            {processNurture.isPending ? "Processing..." : "Process Nurture Emails"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Trials", value: stats.total, icon: Users, color: "text-foreground" },
            { label: "Active", value: stats.active, icon: Clock, color: "text-green-400" },
            { label: "Converted", value: stats.converted, icon: TrendingUp, color: "text-blue-400" },
            { label: "Expired", value: stats.expired, icon: XCircle, color: "text-amber-400" },
            { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-red-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Conversion Funnel */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-4">Conversion Funnel</h2>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full"
                  style={{ width: stats.total > 0 ? `${((stats.converted / stats.total) * 100)}%` : "0%" }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-foreground">
              {stats.total > 0 ? `${Math.round((stats.converted / stats.total) * 100)}%` : "0%"} conversion
            </span>
          </div>
          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            <span>Signups: {stats.total}</span>
            <span>Active: {stats.active}</span>
            <span>Converted: {stats.converted}</span>
          </div>
        </div>

        {/* Filter & Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">All Trials</h2>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm bg-background border border-border rounded-lg px-3 py-1.5 text-foreground"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="converted">Converted</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={() => trialsQuery.refetch()} className="p-1.5 text-muted-foreground hover:text-foreground">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {trialsQuery.isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading trials...</div>
          ) : trials.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No trials found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">User</th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Plan</th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Days Left</th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Started</th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trials.map((trial: any) => (
                    <tr key={trial.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{trial.fullName}</p>
                          <p className="text-xs text-muted-foreground">{trial.email}</p>
                          {trial.companyName && (
                            <p className="text-xs text-muted-foreground">{trial.companyName}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-foreground">{trial.planTier}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trial.status)}`}>
                          {trial.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {trial.status === "active" ? `${getDaysRemaining(trial.expiresAt)} days` : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(trial.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative group">
                          <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                            Actions <ChevronDown className="w-3 h-3" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 top-full z-10 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                            {trial.status === "active" && (
                              <button
                                onClick={() => handleStatusChange(trial.id, "converted")}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted flex items-center gap-2"
                              >
                                <CheckCircle className="w-3 h-3 text-blue-400" /> Mark Converted
                              </button>
                            )}
                            {trial.status === "active" && (
                              <button
                                onClick={() => handleStatusChange(trial.id, "cancelled")}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted flex items-center gap-2"
                              >
                                <XCircle className="w-3 h-3 text-red-400" /> Cancel
                              </button>
                            )}
                            {trial.status === "expired" && (
                              <button
                                onClick={() => handleStatusChange(trial.id, "active")}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted flex items-center gap-2"
                              >
                                <RefreshCw className="w-3 h-3 text-green-400" /> Reactivate
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
