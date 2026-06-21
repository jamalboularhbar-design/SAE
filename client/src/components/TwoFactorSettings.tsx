import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck, ShieldOff, Copy, Eye, EyeOff } from 'lucide-react';

interface TwoFAStatus {
  enabled: boolean;
  recoveryCodesRemaining: number;
}

export default function TwoFactorSettings() {
  const [status, setStatus] = useState<TwoFAStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupStep, setSetupStep] = useState<'idle' | 'qr' | 'verify' | 'recovery'>('idle');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [showDisable, setShowDisable] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/auth/2fa/status', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const startSetup = async () => {
    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setQrCode(data.qrCodeDataUrl);
        setSecret(data.secret);
        setSetupStep('qr');
      } else {
        toast.error('Failed to start 2FA setup');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const verifyAndEnable = async () => {
    if (verifyCode.length !== 6) {
      toast.error('Enter a 6-digit code');
      return;
    }
    try {
      const res = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ secret, token: verifyCode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRecoveryCodes(data.recoveryCodes);
        setSetupStep('recovery');
        toast.success('2FA enabled successfully');
        fetchStatus();
      } else {
        toast.error(data.error || 'Invalid code');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const handleDisable = async () => {
    if (!disablePassword) {
      toast.error('Password required');
      return;
    }
    try {
      const res = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: disablePassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('2FA disabled');
        setShowDisable(false);
        setDisablePassword('');
        fetchStatus();
      } else {
        toast.error(data.error || 'Failed to disable 2FA');
      }
    } catch {
      toast.error('Network error');
    }
  };

  if (loading) {
    return <div className="text-muted-foreground text-sm">Loading 2FA status...</div>;
  }

  // Recovery codes display
  if (setupStep === 'recovery') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-400">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="font-semibold">2FA Enabled - Save Recovery Codes</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Save these recovery codes in a secure location. Each code can only be used once.
        </p>
        <div className="grid grid-cols-2 gap-2 p-4 bg-card border border-border rounded-lg font-mono text-sm">
          {recoveryCodes.map((code, i) => (
            <div key={i} className="px-2 py-1 bg-background rounded">{code}</div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(recoveryCodes.join('\n'));
            toast.success('Recovery codes copied');
          }}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy All Codes
        </Button>
        <Button
          size="sm"
          onClick={() => setSetupStep('idle')}
          className="ml-2"
        >
          Done
        </Button>
      </div>
    );
  }

  // QR code + verification step
  if (setupStep === 'qr' || setupStep === 'verify') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Set Up Two-Factor Authentication</h3>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </p>
          {qrCode && (
            <div className="flex justify-center p-4 bg-white rounded-lg w-fit mx-auto">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Manual entry key:</p>
            <button
              onClick={() => setShowSecret(!showSecret)}
              className="text-xs text-primary hover:text-primary/80"
            >
              {showSecret ? <EyeOff className="w-3 h-3 inline" /> : <Eye className="w-3 h-3 inline" />}
            </button>
          </div>
          {showSecret && (
            <code className="block text-xs bg-card border border-border rounded px-3 py-2 font-mono break-all">
              {secret}
            </code>
          )}

          <p className="text-sm text-muted-foreground">
            2. Enter the 6-digit code from your app to verify:
          </p>
          <input
            type="text"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className="w-full max-w-xs px-4 py-2 bg-background border border-border rounded-lg text-foreground text-center tracking-widest font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          <div className="flex gap-2">
            <Button onClick={verifyAndEnable} disabled={verifyCode.length !== 6}>
              Verify & Enable
            </Button>
            <Button variant="outline" onClick={() => { setSetupStep('idle'); setVerifyCode(''); }}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main status view
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Two-Factor Authentication</h3>
        </div>
        {status?.enabled ? (
          <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400 font-medium">Enabled</span>
        ) : (
          <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 font-medium">Disabled</span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Add an extra layer of security to your account by requiring a verification code from your authenticator app during login.
      </p>

      {status?.enabled ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Recovery codes remaining: <span className="font-medium text-foreground">{status.recoveryCodesRemaining}</span>
          </p>

          {!showDisable ? (
            <Button variant="outline" size="sm" className="text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={() => setShowDisable(true)}>
              <ShieldOff className="w-4 h-4 mr-2" />
              Disable 2FA
            </Button>
          ) : (
            <div className="space-y-2 p-4 border border-red-500/30 rounded-lg bg-red-500/5">
              <p className="text-sm text-red-400">Confirm your password to disable 2FA:</p>
              <input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="Enter password"
                className="w-full max-w-xs px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={handleDisable}>
                  Confirm Disable
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setShowDisable(false); setDisablePassword(''); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button onClick={startSetup}>
          <ShieldCheck className="w-4 h-4 mr-2" />
          Enable 2FA
        </Button>
      )}
    </div>
  );
}
