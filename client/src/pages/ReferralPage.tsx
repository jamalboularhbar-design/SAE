import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Gift, Copy, Users, CheckCircle, Share2, ArrowRight } from 'lucide-react';
import SEO, { PAGE_SEO } from '@/components/SEO';

export default function ReferralPage() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: false });
  const { data: codeData } = trpc.referrals.getMyCode.useQuery(undefined, { enabled: isAuthenticated });
  const { data: stats } = trpc.referrals.getStats.useQuery(undefined, { enabled: isAuthenticated });
  const { data: myReferrals } = trpc.referrals.getMyReferrals.useQuery(undefined, { enabled: isAuthenticated });
  const [copied, setCopied] = useState(false);

  const referralLink = codeData?.code
    ? `${window.location.origin}/start-trial?ref=${codeData.code}`
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Referral Program</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to get your unique referral link and earn free months for every friend who signs up.
            </p>
            <a href={getLoginUrl()}>
              <Button className="w-full">Sign In to Get Started</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <SEO {...PAGE_SEO.referral} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Gift className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Referral Program</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Share NexusAI Playbooks, Earn Free Months</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            For every friend who starts a trial using your link, you both get 1 free month added to your subscription.
          </p>
        </div>

        {/* Referral Link Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 bg-muted rounded-lg px-4 py-3 text-sm font-mono break-all">
                {referralLink || 'Loading...'}
              </div>
              <Button onClick={copyLink} disabled={!referralLink} variant="outline" className="shrink-0">
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Share this link with colleagues. When they start a trial, you'll earn credit.
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{stats?.total || 0}</p>
              <p className="text-sm text-muted-foreground">Links Shared</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-500">{stats?.signedUp || 0}</p>
              <p className="text-sm text-muted-foreground">Friends Signed Up</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-amber-500">{stats?.converted || 0}</p>
              <p className="text-sm text-muted-foreground">Free Months Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-medium mb-1">Share Your Link</h3>
                <p className="text-sm text-muted-foreground">Copy your unique referral link and share it with colleagues.</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-medium mb-1">They Start a Trial</h3>
                <p className="text-sm text-muted-foreground">When they sign up using your link, both accounts get tracked.</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-medium mb-1">Earn Free Months</h3>
                <p className="text-sm text-muted-foreground">Once they convert, you both get 1 free month of service.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        {myReferrals && myReferrals.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Referral History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myReferrals.map((ref: any) => (
                  <div key={ref.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{ref.referredEmail || 'Pending signup'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      ref.status === 'converted' ? 'bg-green-500/10 text-green-500' :
                      ref.status === 'signed_up' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {ref.status === 'converted' ? 'Converted' :
                       ref.status === 'signed_up' ? 'Signed Up' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
