import type { FaqItem } from "@/domain/faq";
import { resolveTokens } from "@/lib/tokens";

interface FaqSectionProps {
  heading: string;
  faqs: FaqItem[];
}

export function FaqSection({ heading, faqs }: FaqSectionProps) {
  return (
    <section className="mt-12">
      <h2 className="heading-thread font-display text-3xl font-bold leading-tight">{heading}</h2>
      <div className="mt-6 divide-y divide-dashed divide-nila/30 border-y border-dashed border-nila/30">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-5">
            <h3 className="font-display text-xl font-bold leading-snug">{faq.question}</h3>
            <p className="mt-2 max-w-[68ch]">{resolveTokens(faq.answer)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
