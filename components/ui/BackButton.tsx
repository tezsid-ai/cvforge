import Link from "next/link";

const baseClasses =
  "inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/60 font-semibold text-zinc-200 backdrop-blur-sm transition hover:border-violet-400/70 hover:text-white hover:shadow-[0_0_0_1px_rgba(167,139,250,0.45),0_8px_20px_rgba(79,70,229,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400";

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

type BackButtonProps = {
  href?: string;
  onClick?: () => void;
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

export default function BackButton({
  href,
  onClick,
  label = "Back",
  size = "md",
  className = "",
}: BackButtonProps): React.JSX.Element {
  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`.trim();

  const content = (
    <>
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
