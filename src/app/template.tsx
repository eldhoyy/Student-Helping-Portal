"use client";

import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("page-ready");
    return () => document.documentElement.classList.remove("page-ready");
  }, []);

  return <div className="page-transition-shell">{children}</div>;
}
