import { Link } from 'wouter';
import { BRAND } from '@/lib/brand';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/product"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Features</span></Link></li>
              <li><Link href="/pricing"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Pricing</span></Link></li>
              <li><Link href="/success-metrics"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Success Metrics</span></Link></li>
              <li><Link href="/roi"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">ROI Calculator</span></Link></li>
              <li><Link href="/changelog"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Changelog</span></Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Solutions</h4>
            <ul className="space-y-2">
              <li><Link href="/case-studies"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Case Studies</span></Link></li>
              <li><Link href="/product?utm_source=travel"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Travel & Hospitality</span></Link></li>
              <li><Link href="/product?utm_source=healthcare"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Healthcare</span></Link></li>
              <li><Link href="/product?utm_source=saas"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">SaaS & Technology</span></Link></li>
              <li><Link href="/product?utm_source=manufacturing"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Manufacturing</span></Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/request-demo"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Request Demo</span></Link></li>
              <li><Link href="/start-trial"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Start Free Trial</span></Link></li>
              <li><Link href="/referral"><span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Referral Program</span></Link></li>
              <li><a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">Book a Call</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-muted-foreground">Privacy Policy</span></li>
              <li><span className="text-sm text-muted-foreground">Terms of Service</span></li>
              <li><span className="text-sm text-muted-foreground">Security</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">{BRAND.productName}</span>
            <span className="text-xs text-muted-foreground">{BRAND.tagline}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {BRAND.parentName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
