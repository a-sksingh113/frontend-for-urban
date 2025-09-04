import Link from "next/link";

export type NavItem = { href: string; label: string; prefetch?: boolean };

type NavLinksProps = {
  items: NavItem[];
  className?: string;
};

export default function NavLinks({ items, className }: NavLinksProps) {
  return (
    <nav className={className} aria-label="Primary">
      <ul className="flex items-center gap-4 text-sm">
        {items.map(({ href, label, prefetch }, idx) => (
          <li key={idx}>
            <Link
              href={href}
              prefetch={prefetch}
              className="text-slate-700 hover:text-slate-900"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
