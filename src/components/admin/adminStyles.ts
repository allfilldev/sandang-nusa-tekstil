const buttonBase =
  "inline-flex min-h-12 scale-100 items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-display text-base font-bold transition-[background-color,color,scale] duration-150 active:scale-[0.97] disabled:cursor-wait disabled:opacity-60";

export const primaryButtonClass = `${buttonBase} bg-nila text-benang hover:bg-nila/85`;
export const secondaryButtonClass = `${buttonBase} border-2 border-nila bg-benang text-nila hover:bg-nila hover:text-benang`;
export const dangerButtonClass = `${buttonBase} bg-galat text-benang hover:bg-galat/85`;
export const accentButtonClass = `${buttonBase} bg-kunyit text-nila hover:bg-kunyit/80`;

export const textLinkClass =
  "font-semibold text-nila underline decoration-nila/40 underline-offset-4 hover:decoration-nila";

// Tautan yang berdiri sendiri (bukan di dalam kalimat) dibuat setinggi 48 px agar mudah disentuh di HP.
export const tapLinkClass = `${textLinkClass} inline-flex min-h-12 items-center`;

export const cardClass = "squircle rounded-sheet bg-benang p-5 shadow-sm ring-1 ring-nila/10 md:p-8";

export const sectionHeadingClass = "font-display text-xl font-extrabold leading-tight md:text-2xl";

export const pageTitleClass = "font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl";

export const labelClass = "block font-display text-base font-bold";

export const hintClass = "mt-1 block text-[0.9375rem] leading-snug text-nila/75";
