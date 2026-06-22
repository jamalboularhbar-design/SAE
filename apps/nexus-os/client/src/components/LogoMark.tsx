const sizes = {
  sm: "w-9 h-9",
  md: "w-11 h-11",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
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
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo-mark.png`}
      alt={alt}
      className={`${sizes[size]} shrink-0 object-contain bg-transparent ${className}`}
      decoding="async"
    />
  );
}
