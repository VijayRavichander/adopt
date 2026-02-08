import Link from "next/link";
import { Dog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface NavLink {
  href: string;
  label: string;
  active?: boolean;
}

interface AppHeaderProps {
  links?: NavLink[];
  children?: ReactNode;
}

export default function AppHeader({ links = [], children }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex min-w-screen justify-center py-5">
      <nav className="mx-4 mt-4 flex w-full max-w-5xl items-center justify-between gap-4 rounded-full px-6 py-2 bg-white/90 backdrop-blur-3xl shadow-lg ring-1 ring-white/40">
        <p className="text-xl sm:text-3xl font-medium tracking-tight text-black/90">
          <Link href="/search">
            <Dog className="inline h-8 w-8 sm:h-10 sm:w-10" /> Adopt
          </Link>
        </p>

        <div className="flex space-x-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={`text-lg sm:text-2xl hover:bg-transparent hover:underline ${
                  link.active ? "underline" : ""
                }`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
          {children}
        </div>
      </nav>
    </header>
  );
}
