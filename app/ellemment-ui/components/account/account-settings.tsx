

// app/ellemment-ui/components/account/account-footer.tsx


import { NavLink } from '@remix-run/react'


export function AccountSettings() {
  return (
    <div className="flex items-center justify-start p-4">
      <NavLink to="/account/settings" className="flex items-center text-zinc-900 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
        <span className="text-md font-semibold">Settings</span>
      </NavLink>
    </div>
  );
}