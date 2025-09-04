"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User as UserIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  tokenRemaining: number;
  logoutAction: () => Promise<void>;
  profileHref?: string;
};

export default function ProfileDropdown({
  tokenRemaining,
  logoutAction,
  profileHref = "/dashboard",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLinkClick = () => setIsOpen(false);

  const tokens = tokenRemaining ?? 0;

  return (
    <div ref={ref} className="relative text-sm cursor-pointer">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-expanded={isOpen}
        aria-controls="profile-dropdown"
        aria-label="Toggle profile menu"
        className="flex flex-col items-center group cursor-pointer focus:outline-none"
      >
        <UserIcon className="text-muted-foreground" />
      </button>

      <ul
        id="profile-dropdown"
        role="listbox"
        className={cn(
          "absolute top-full -left-35 mt-2 w-44 z-100 bg-white border border-slate-200 rounded-lg shadow-lg transition-all duration-300 transform",
          isOpen
            ? "opacity-100 translate-y-1 pointer-events-auto"
            : "opacity-0 translate-y-0 pointer-events-none"
        )}
        tabIndex={0}
      >
        {/* Tokens badge */}
        <li className="px-4 py-2 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Tokens</span>
            <span className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold w-5 h-5">
              {tokens}
            </span>
          </div>
        </li>

        {/* Dashboard/Profile */}
        <li role="option" aria-selected="false" onClick={handleLinkClick}>
          <Link
            href={profileHref}
            className="flex w-full items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <UserIcon className="mr-2 w-5 h-5" />
            Dashboard
          </Link>
        </li>

        {/* Logout via Server Action */}
        <li role="option" aria-selected="false" onClick={handleLinkClick}>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center px-4 py-2 text-red-600 hover:bg-gray-100 hover:text-red-700 transition-colors cursor-pointer"
            >
              <LogOut className="mr-2 w-5 h-5" />
              Logout
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
}
