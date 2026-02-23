"use client";

import { createContext, useContext, useState } from "react";

export type DashboardSections = {
  "last-24h": boolean;
  "last-7d": boolean;
  "last-30d": boolean;
  older: boolean;
};

type DashboardNavContextType = {
  sections: DashboardSections | null;
  setSections: (sections: DashboardSections) => void;
};

const DashboardNavContext = createContext<DashboardNavContextType>({
  sections: null,
  setSections: () => {},
});

export function DashboardNavProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<DashboardSections | null>(null);
  return (
    <DashboardNavContext.Provider value={{ sections, setSections }}>
      {children}
    </DashboardNavContext.Provider>
  );
}

export function useDashboardNav() {
  return useContext(DashboardNavContext);
}
