const sizes = {
  sm: { className: "h-9 w-9 min-h-9 min-w-9", px: 36 },
  md: { className: "h-11 w-11 min-h-11 min-w-11", px: 44 },
  lg: { className: "h-14 w-14 min-h-14 min-w-14", px: 56 },
  xl: { className: "h-20 w-20 min-h-20 min-w-20", px: 80 },
} as const;

export function LogoMark({
  size = "md",
  className = "",
  alt = "Nexus OS",
}: {
  size?: keyof typeof sizes;
  className?: string;
  alt?: string;
}) {
  const { className: sizeClass, px } = sizes[size];

  return (
    <span className={`inline-flex shrink-0 items-center justify-center ${sizeClass} ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}logo-mark.png`}
        alt={alt}
        width={px}
        height={px}
        className="h-full w-full object-contain object-center bg-transparent"
        decoding="async"
      />
    </span>
  );
}
