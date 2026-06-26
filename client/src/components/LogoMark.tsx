import { BRAND } from '@/lib/brand';
import { cn } from '@/lib/utils';

/** Square display sizes — logo source is 512×512 RGBA with transparent padding */
const sizes = {
  xs: { className: 'h-6 w-6 min-h-6 min-w-6', px: 24 },
  sm: { className: 'h-8 w-8 min-h-8 min-w-8', px: 32 },
  md: { className: 'h-9 w-9 min-h-9 min-w-9', px: 36 },
  lg: { className: 'h-11 w-11 min-h-11 min-w-11', px: 44 },
  xl: { className: 'h-14 w-14 min-h-14 min-w-14', px: 56 },
  nav: { className: 'h-10 w-10 min-h-10 min-w-10 sm:h-11 sm:w-11 sm:min-h-11 sm:min-w-11', px: 44 },
} as const;

type LogoMarkProps = {
  size?: keyof typeof sizes;
  className?: string;
  alt?: string;
};

/** Brand mark — transparent PNG; wrapper prevents flex crush in tight headers */
export default function LogoMark({ size = 'md', className, alt }: LogoMarkProps) {
  const { className: sizeClass, px } = sizes[size];

  return (
    <span className={cn('inline-flex shrink-0 items-center justify-center', sizeClass, className)}>
      <img
        src={`${import.meta.env.BASE_URL}logo-mark.png`}
        alt={alt ?? BRAND.parentName}
        width={px}
        height={px}
        className="h-full w-full object-contain object-center"
        decoding="async"
        fetchPriority="high"
      />
    </span>
  );
}
