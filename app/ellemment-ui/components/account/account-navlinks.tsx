// app/ellemment-ui/components/account/account-navlinks.tsx

import { Link } from '@remix-run/react';
import React, { useState } from 'react';
import { Button } from '#app/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '#app/components/ui/collapsible';
import { Icon, type IconName } from '#app/components/ui/icon';

interface NavLinkProps {
  to: string;
  icon: IconName;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children, className = '' }) => (
  <Link to={to} className={`flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md ${className}`}>
    <Icon name={icon} className="mr-3 h-4 w-4" />
    {children}
  </Link>
);

interface BetaVersionProps {
  version: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BetaVersion: React.FC<BetaVersionProps> = ({ version, isOpen, onOpenChange }) => (
  <Collapsible open={isOpen} onOpenChange={onOpenChange} className="space-y-2">
    <div className="flex items-center justify-between space-x-4 px-4">
      <h4 className="text-sm font-semibold">Beta {version}</h4>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 p-0">
          <Icon name={isOpen ? "chevron-down" : "chevron-right"} className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent className="space-y-2 ml-6">
      <NavLink to={`/account/beta`} icon="tokens">Overview</NavLink>
      <NavLink to={`/account/beta`} icon="shadow-inner">Application</NavLink>
      <NavLink to={`/account/beta`} icon="share-1">Changelog</NavLink>
    </CollapsibleContent>
  </Collapsible>
);

interface AccountNavLinksProps {
  username: string;
}

type BetaVersions = 'v1.0' | 'v2.0' | 'v3.0';

export function AccountNavLinks({ username }: AccountNavLinksProps) {
  const [openBetas, setOpenBetas] = useState<Record<BetaVersions, boolean>>({
    'v1.0': false,
    'v2.0': false,
    'v3.0': false,
  });

  const toggleBeta = (version: BetaVersions, open: boolean) => {
    setOpenBetas(prev => ({
      ...prev,
      [version]: open,
    }));
  };

  const betaVersions: BetaVersions[] = ['v1.0', 'v2.0', 'v3.0'];

  return (
    <div className="space-y-8 mt-12">
      <div>
      <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 tracking-wider">Application</h3>
        <nav className="space-y-1">
          {betaVersions.map(version => (
            <BetaVersion
              key={version}
              version={version}
              isOpen={openBetas[version]}
              onOpenChange={(open) => toggleBeta(version, open)}
            />
          ))}
        </nav>
      </div>
      <div>
        <nav className="mt-12 space-y-1">
        <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 tracking-wider">Account</h3>
          <NavLink to={`/account/${username}/content/new`} icon="plus">Create</NavLink>
          <NavLink to="/account" icon="magic-wand">Discover</NavLink>
          <NavLink to="/account" icon="bookmark">Favorites</NavLink>
          <NavLink to="/account" icon="dashboard">Library</NavLink>
          <NavLink to="/account" icon="update">Updates</NavLink>
        </nav>
      </div>
    </div>
  );
}