type CopyrightProps = {
  company: string;
  year?: number;
  className?: string;
};

export default function Copyright({
  company,
  year = new Date().getFullYear(),
  className,
}: CopyrightProps) {
  return (
    <p className={`text-center md:text-left ${className ?? ""}`}>
      © {year} {company}
    </p>
  );
}
