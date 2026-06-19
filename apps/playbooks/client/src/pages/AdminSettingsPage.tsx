import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Shield, Key, Clock, AlertTriangle } from "lucide-react";
import TwoFactorSettings from "@/components/TwoFactorSettings";
import { BRAND } from "@/lib/brand";

export default function AdminSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const [activeTab, setActiveTab] = useState<"password" | "login-history" | "2fa">("password");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Report suspicious activity state
  const [reportingId, setReportingId] = useState<number | null>(null);
  const [reportSuccess, setReportSuccess] = useState<number | null>(null);
  const [reportError, setReportError] = useState<string>("");

  const notifyOwnerMutation = trpc.system.notifyOwner.useMutation();

  // Fetch activity log for login events
  const { data: activityData } = trpc.activity.list.useQuery({ limit: 100 });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Password change request submitted. Update ADMIN_PASSWORD in Settings → Secrets.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleReportSuspicious = async (event: any) => {
    setReportingId(event.id);
    setReportError("");
    setReportSuccess(null);

    const details = event.details ? JSON.parse(event.details) : {};
    const timestamp = new Date(event.createdAt).toLocaleString();

    try {
      await notifyOwnerMutation.mutateAsync({
        title: "⚠️ Suspicious Login Activity Reported",
        content: [
          `A user has flagged suspicious login activity on their account.`,
          ``,
          `**Event Details:**`,
          `- Type: ${event.action === "login_failed" ? "Failed Login Attempt" : "Successful Login"}`,
          `- Time: ${timestamp}`,
          `- IP Address: ${event.visitorId || "unknown"}`,
          `- Email Used: ${details.email || "unknown"}`,
          `- User Agent: ${details.userAgent || "unknown"}`,
          details.reason ? `- Failure Reason: ${details.reason.replace("_", " ")}` : "",
          ``,
          `**Reported by:** ${user.email || user.name || "Admin"}`,
          `**Action Required:** Review this login attempt and consider rotating credentials if unauthorized.`,
        ].filter(Boolean).join("\n"),
      });

      setReportSuccess(event.id);
    } catch {
      setReportError("Failed to send report. Please try again.");
    } finally {
      setReportingId(null);
    }
  };

  // Filter login events from activity log
  const loginEvents = (activityData || []).filter(
    (e: any) => e.action === "login_success" || e.action === "login_failed"
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account security and preferences</p>
        </div>

        {/* Account Info Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm text-foreground font-medium">{user.email || BRAND.adminEmail}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="text-sm text-foreground font-medium capitalize">{user.role || "admin"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Sign In</span>
              <span className="text-sm text-foreground font-medium">
                {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleString() : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "password"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Key className="w-4 h-4" />
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("login-history")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "login-history"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            Login History
          </button>
          <button
            onClick={() => setActiveTab("2fa")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "2fa"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="w-4 h-4" />
            2FA
          </button>
        </div>

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
            <p className="text-sm text-muted-foreground mb-6">
              After submitting, you'll need to update the ADMIN_PASSWORD in your project's Settings → Secrets for the change to take effect on next server restart.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              {success && (
                <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>
        )}

        {/* Login History Tab */}
        {activeTab === "login-history" && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Login History</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                Last 100 events
              </div>
            </div>

            {/* Report status messages */}
            {reportError && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 mb-4">
                {reportError}
              </p>
            )}

            {loginEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No login events recorded yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {loginEvents.map((event: any) => {
                  const details = event.details ? JSON.parse(event.details) : {};
                  const isSuccess = event.action === "login_success";
                  const isReporting = reportingId === event.id;
                  const wasReported = reportSuccess === event.id;

                  return (
                    <div
                      key={event.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        isSuccess
                          ? "border-green-500/20 bg-green-500/5"
                          : "border-red-500/20 bg-red-500/5"
                      }`}
                    >
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                        isSuccess ? "bg-green-500" : "bg-red-500"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-medium ${
                            isSuccess ? "text-green-400" : "text-red-400"
                          }`}>
                            {isSuccess ? "Successful Login" : "Failed Attempt"}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {new Date(event.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span>IP: {event.visitorId || "unknown"}</span>
                          {details.email && <span>Email: {details.email}</span>}
                          {details.reason && <span>Reason: {details.reason.replace('_', ' ')}</span>}
                          {details.rememberMe !== undefined && (
                            <span>Remember Me: {details.rememberMe ? "Yes" : "No"}</span>
                          )}
                          {details.userAgent && (
                            <span className="truncate max-w-[300px]" title={details.userAgent}>
                              UA: {details.userAgent.slice(0, 50)}{details.userAgent.length > 50 ? "…" : ""}
                            </span>
                          )}
                        </div>

                        {/* Report Suspicious Activity Button */}
                        <div className="mt-2">
                          {wasReported ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-400 font-medium">
                              <Shield className="w-3 h-3" />
                              Report sent to admin
                            </span>
                          ) : (
                            <button
                              onClick={() => handleReportSuspicious(event)}
                              disabled={isReporting}
                              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {isReporting ? "Reporting…" : "Report Suspicious Activity"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2FA Tab */}
        {activeTab === "2fa" && (
          <div className="bg-card border border-border rounded-lg p-6">
            <TwoFactorSettings />
          </div>
        )}
      </div>
    </div>
  );
}
