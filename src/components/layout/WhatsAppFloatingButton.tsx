import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function WhatsAppFloatingButton() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <WhatsAppButton className="pointer-events-auto shadow-lg shadow-black/25" />
    </div>
  );
}
