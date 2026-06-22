import { BRAND } from '@/lib/brand';
import { cn } from '@/lib/utils';

const sizes = {
  xs: 'w-6 h-6',
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-11 h-11',
  xl: 'w-14 h-14',
} as const;

type LogoMarkProps = {
  size?: keyof typeof sizes;
  className?: string;
  alt?: string;
};

/** Brand mark — uses the canonical PNG at /logo-mark.png */
export default function LogoMark({ size = 'md', className, alt }: LogoMarkProps) {
  return (
    <img
      src="/logo-mark.png"
      alt={alt ?? BRAND.parentName}
      className={cn(sizes[size], 'shrink-0 object-contain', className)}
    />
  );
}
