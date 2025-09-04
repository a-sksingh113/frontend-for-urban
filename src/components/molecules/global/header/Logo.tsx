import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href={"/"}
      className="inline-flex items-center font-bold tracking-wide"
    >
      LOGO
    </Link>
  );
}
