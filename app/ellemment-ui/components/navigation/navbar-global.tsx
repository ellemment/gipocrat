// app/ellemment-ui/components/navigation/navbar-global.tsx

import { useLocation, useNavigate } from "@remix-run/react";
import { DirectionAwareTabs } from "#app/components/ui/navtab";

interface GlobalNavbarProps {
  isAuthenticated: boolean;
}

export function GlobalNavbar({ isAuthenticated }: GlobalNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: 0,
      label: "Discover",
      content: null,
    },
    {
      id: 1,
      label: isAuthenticated ? "Account" : "Sign in",
      content: null,
    },
  ];

  const activeTabIndex = location.pathname === "/" ? 0 : 1;

  const handleTabChange = (newTabId: number) => {
    navigate(newTabId === 0 ? "/" : isAuthenticated ? "/account" : "/login");
  };

  return (
    <div className="fixed bottom-4 lg:bottom-8 left-0 right-0 flex justify-center w-full z-50 pointer-events-none">
      <nav className="w-full  pointer-events-auto">
        <DirectionAwareTabs
          tabs={tabs}
          className="bg-background shadow-xl"
          onChange={handleTabChange}
          activeTab={activeTabIndex}
        />
      </nav>
    </div>
  );
}