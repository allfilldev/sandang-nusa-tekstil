import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "outlineLight";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  className?: string;
}

const baseClasses =
  "inline-flex min-h-12 scale-100 items-center justify-center rounded-full px-7 py-3 font-display text-base font-bold transition-[background-color,color,scale] duration-150 active:scale-[0.97]";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-nila text-benang hover:bg-nila/85",
  secondary: "border-2 border-nila text-nila hover:bg-nila hover:text-benang",
  accent: "bg-kunyit text-nila hover:bg-benang",
  outlineLight: "border-2 border-benang text-benang hover:bg-benang hover:text-nila",
};

export function ButtonLink({ href, children, variant = "primary", external = false, className = "" }: ButtonLinkProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
