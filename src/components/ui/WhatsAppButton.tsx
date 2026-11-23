import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  compact?: boolean;
  className?: string;
}

const baseClasses =
  "inline-flex min-h-16 scale-100 items-center gap-3 whitespace-nowrap rounded-full bg-whatsapp py-4 font-display font-bold text-whatsapp-ink transition-[background-color,scale] duration-150 hover:bg-whatsapp-hover active:scale-[0.97] md:px-8 md:text-xl";

export function WhatsAppButton({ compact = false, className = "" }: WhatsAppButtonProps) {
  const sizeClasses = compact ? "px-4 text-base" : "px-6 text-lg";

  return (
    <a
      href={whatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${sizeClasses} ${className}`}
    >
      <WhatsAppIcon className="size-7 shrink-0" />
      Chat WhatsApp Sekarang
    </a>
  );
}
