import { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode; }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {children}
    </div>
  );
}

