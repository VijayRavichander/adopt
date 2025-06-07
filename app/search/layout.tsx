import { Suspense } from "react";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      {children}       {/* page subtree may now suspend safely */}
    </Suspense>
  );
}