"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationLink } from "@/domain/site";

interface SiteNavProps {
  links: NavigationLink[];
}

const menuId = "site-menu";

function closeMenu() {
  const menu = document.getElementById(menuId);
  if (!menu || typeof menu.hidePopover !== "function") {
    return;
  }
  try {
    menu.hidePopover();
  } catch {
    return;
  }
}

export function SiteNav({ links }: SiteNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama">
      <button type="button" className="menu-button" popoverTarget={menuId} popoverTargetAction="toggle" aria-controls={menuId}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span>Menu</span>
      </button>
      <ul id={menuId} className="site-menu" popover="auto">
        {links.map((link) => {
          const isCurrent = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link href={link.href} aria-current={isCurrent ? "page" : undefined} onClick={closeMenu}>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
