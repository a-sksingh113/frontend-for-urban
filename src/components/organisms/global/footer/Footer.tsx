import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import { FooterLinks, Copyright } from "@/components/molecules/global/footer";

export function Footer() {
  const company = "FixAnything";
  const links = [
    { href: "#", label: "Contact" },
    { href: "#", label: "Terms" },
    { href: "#", label: "Privacy" },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-slate-600 md:flex-row">
          <Copyright company={company} />
          <FooterLinks links={links} />
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
