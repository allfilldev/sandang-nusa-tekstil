"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Beranda", exact: true },
  { href: "/admin/artikel", label: "Artikel", exact: false },
  { href: "/admin/logo", label: "Logo", exact: false },
  { href: "/admin/akun", label: "Akun", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu admin">
      <ul className="flex flex-wrap items-center gap-2">
        {links.map((link) => {
          const current = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-4 font-display text-base font-bold transition-colors ${
                  current ? "bg-nila text-benang" : "text-nila hover:bg-nila-pudar/60"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
