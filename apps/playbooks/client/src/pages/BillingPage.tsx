import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ExternalLink, Receipt, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: subData, isLoading: subLoading } = trpc.stripe.getSubscriptionStatus.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: payments, isLoading: paymentsLoading } = trpc.stripe.getPaymentHistory.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: stripeConfig } = trpc.stripe.isConfigured.useQuery();

  const createPortal = trpc.stripe.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.portalUrl) {
        window.open(data.portalUrl, "_blank");
        toast.info("Opening Stripe billing portal...");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>Please sign in to view your billing information.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const hasSubscription = subData?.status !== "no_subscription" && subData?.subscription;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-teal-500" />
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your ARG Builder subscription and payment history.
          </p>
        </div>

        {/* Stripe not configured notice */}
        {stripeConfig && !stripeConfig.configured && (
          <Card className="mb-6 border-amber-500/50 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Stripe not configured</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment processing is not yet active. The site owner needs to add Stripe API keys
                    in Settings → Payment to enable subscriptions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {hasSubscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-foreground">Active Subscription</span>
                      <Badge variant="secondary" className="capitalize">
                        {subData.subscription?.status}
                      </Badge>
                    </div>
                    {subData.subscription?.currentPeriodEnd && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {subData.subscription.cancelAtPeriodEnd
                          ? "Cancels"
                          : "Renews"}{" "}
                        on {new Date(subData.subscription.currentPeriodEnd).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => createPortal.mutate()}
                    disabled={createPortal.isPending}
                  >
                    {createPortal.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <ExternalLink className="w-4 h-4 mr-2" />
                    )}
                    Manage Subscription
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">No active subscription</span>
                </div>
                <Link href="/product#pricing">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    View Plans & Subscribe
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : payments?.payments && payments.payments.length > 0 ? (
              <div className="space-y-3">
                {payments.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {payment.description || "Payment"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.created).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        ${(payment.amount / 100).toLocaleString()} {payment.currency.toUpperCase()}
                      </span>
                      <Badge
                        variant={payment.status === "succeeded" ? "default" : "secondary"}
                        className={payment.status === "succeeded" ? "bg-green-600" : ""}
                      >
                        {payment.status}
                      </Badge>
                      {payment.receiptUrl && (
                        <a
                          href={payment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-500 hover:text-teal-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No payments yet. Subscribe to a plan to get started.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Test mode notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            For testing, use card number <code className="bg-muted px-1 rounded">4242 4242 4242 4242</code> with any future expiry and CVC.
          </p>
        </div>
      </div>
    </div>
  );
}
