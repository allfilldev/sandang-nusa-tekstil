import type { ProcessStep } from "@/domain/process";

interface ProcessOverviewProps {
  steps: ProcessStep[];
}

export function ProcessOverview({ steps }: ProcessOverviewProps) {
  return (
    <ol className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
      {steps.map((step, index) => (
        <li key={step.id} className="relative flex flex-col items-start gap-3 lg:items-center lg:text-center">
          <span
            aria-hidden="true"
            className="relative z-10 grid size-12 place-items-center rounded-full bg-kunyit font-display text-xl font-extrabold text-nila"
          >
            {index + 1}
          </span>
          {index < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute left-[calc(50%+1.5rem)] top-6 hidden w-[calc(100%-2rem)] border-t-2 border-dashed border-nila/40 lg:block"
            />
          ) : null}
          <p className="font-display text-base font-bold leading-snug">{step.title}</p>
        </li>
      ))}
    </ol>
  );
}
