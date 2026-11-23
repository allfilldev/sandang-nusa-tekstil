import type { QualityCheck, QualityReport } from "@/lib/articleQuality";

interface QualityPanelProps {
  report: QualityReport;
  headingId: string;
}

function CheckList({ checks }: { checks: QualityCheck[] }) {
  return (
    <ul className="space-y-3">
      {checks.map((check) => (
        <li key={check.id} className="flex gap-3">
          <span
            aria-hidden="true"
            className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
              check.ok ? "bg-berhasil text-benang" : check.level === "wajib" ? "bg-galat text-benang" : "bg-kunyit text-nila"
            }`}
          >
            {check.ok ? "✓" : "!"}
          </span>
          <div className="min-w-0">
            <p className="text-base font-bold leading-snug">
              <span className="sr-only">{check.ok ? "Sudah: " : "Perlu diperbaiki: "}</span>
              {check.label}
            </p>
            <p className="mt-0.5 text-[0.9375rem] leading-snug text-nila/80">{check.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Daftar periksa kualitas artikel. Isinya dihitung dari fungsi murni yang sama dengan yang dipakai server saat terbit.
export function QualityPanel({ report, headingId }: QualityPanelProps) {
  const required = report.checks.filter((check) => check.level === "wajib");
  const suggestions = report.checks.filter((check) => check.level === "saran");

  return (
    <section aria-labelledby={headingId} className="space-y-6">
      <div>
        <h2 id={headingId} className="font-display text-xl font-extrabold">
          Cek kualitas
        </h2>
        <p className="mt-1 text-[0.9375rem] text-nila/80">
          {report.missingRequired.length === 0
            ? "Semua yang wajib sudah terisi."
            : `${report.missingRequired.length} hal wajib belum terisi.`}{" "}
          {report.openSuggestions.length === 0
            ? "Semua saran SEO terpenuhi."
            : `${report.openSuggestions.length} saran SEO belum terpenuhi.`}
        </p>
      </div>
      <div>
        <h3 className="mb-3 font-display text-base font-extrabold uppercase tracking-wide text-nila/70">Wajib untuk terbit</h3>
        <CheckList checks={required} />
      </div>
      <div>
        <h3 className="mb-3 font-display text-base font-extrabold uppercase tracking-wide text-nila/70">Saran SEO</h3>
        <p className="mb-3 text-[0.9375rem] text-nila/80">Tidak menahan terbit, tetapi membantu artikel lebih mudah ditemukan.</p>
        <CheckList checks={suggestions} />
      </div>
    </section>
  );
}
