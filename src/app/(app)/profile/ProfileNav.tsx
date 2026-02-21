"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Suchprofil", href: "/profile" },
  { label: "CV & Karriere", href: "/profile/cv" },
];

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b mb-8">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/profile"
            ? pathname === "/profile"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
