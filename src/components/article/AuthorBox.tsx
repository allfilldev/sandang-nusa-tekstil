import Link from "next/link";
import type { Author } from "@/domain/author";

interface AuthorBoxProps {
  author: Author;
}

export function AuthorBox({ author }: AuthorBoxProps) {
  const yearsOfExperience = author.stats?.yearsOfExperience;
  const completedProjects = author.stats?.completedProjects;
  const hasStats = yearsOfExperience !== undefined || completedProjects !== undefined;
  const linkClassName = "underline decoration-nila/40 underline-offset-4 hover:decoration-nila";

  return (
    <aside id="author-bio" aria-label="Tentang penulis" className="squircle rounded-card border border-nila/10 bg-benang p-6">
      <p className="font-display text-xl font-extrabold">Tentang penulis</p>
      <p className="mt-4 font-display text-lg font-bold leading-snug">{author.name}</p>
      <p className="text-base text-nila/80">{author.jobTitle}</p>
      <p className="mt-3 text-base">{author.bio}</p>
      {hasStats ? (
        <dl className="mt-4 grid grid-cols-2 gap-4 text-base">
          {yearsOfExperience !== undefined ? (
            <div className="flex flex-col-reverse">
              <dt className="text-nila/80">tahun pengalaman</dt>
              <dd className="font-display text-2xl font-extrabold text-nila">{yearsOfExperience}</dd>
            </div>
          ) : null}
          {completedProjects !== undefined ? (
            <div className="flex flex-col-reverse">
              <dt className="text-nila/80">proyek selesai</dt>
              <dd className="font-display text-2xl font-extrabold text-nila">{completedProjects}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
      <ul className="mt-5 space-y-2 text-base font-semibold">
        <li>
          <Link href="/tentang" className={linkClassName}>
            Tentang kami
          </Link>
        </li>
        <li>
          <Link href="/kontak" className={linkClassName}>
            Kontak
          </Link>
        </li>
        <li>
          <Link href="/kebijakan-editorial" className={linkClassName}>
            Kebijakan editorial
          </Link>
        </li>
      </ul>
    </aside>
  );
}
