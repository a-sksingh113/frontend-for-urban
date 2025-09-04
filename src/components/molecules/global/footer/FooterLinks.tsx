import Link from "next/link";

type FooterLinksProps = {
  links: { href: string; label: string }[];
  className?: string;
};

export default function FooterLinks({ links, className }: FooterLinksProps) {
  return (
    <nav className={className} aria-label="Footer">
      <ul className="flex flex-wrap items-center justify-center gap-5">
        {links.map(({ href, label }, idx) => (
          <li key={idx}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
