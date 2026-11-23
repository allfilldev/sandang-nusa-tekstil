import type { ProcessStep } from "@/domain/process";

interface ProcessThreadProps {
  steps: ProcessStep[];
}

export function ProcessThread({ steps }: ProcessThreadProps) {
  return (
    <div className="thread-list mt-8">
      <span aria-hidden="true" className="thread-fill" />
      <ol className="space-y-10">
        {steps.map((step, index) => (
          <li key={step.id} className="relative ps-16">
            <span
              aria-hidden="true"
              className="absolute start-0 top-0 grid size-10 place-items-center rounded-full bg-kunyit font-display text-lg font-extrabold text-nila"
            >
              {index + 1}
            </span>
            <h3 className="font-display text-xl font-bold leading-snug">{step.title}</h3>
            <p className="mt-2 max-w-[60ch]">{step.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
