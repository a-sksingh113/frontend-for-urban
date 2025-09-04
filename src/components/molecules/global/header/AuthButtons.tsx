import Link from "next/link";

type AuthButtonsProps = {
  loginHref?: string;
  signupHref?: string;
  showSignup?: boolean;
  className?: string;
};

export default function AuthButtons({
  loginHref = "/login",
  signupHref = "/signup",
  showSignup = true,
  className,
}: AuthButtonsProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-4 text-sm">
        <Link href={loginHref} className="text-slate-700 hover:text-slate-900">
          Login
        </Link>
        {showSignup && (
          <Link
            href={signupHref}
            className="rounded-md bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>
        )}
      </div>
    </div>
  );
}
