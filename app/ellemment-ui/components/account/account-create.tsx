// app/ellemment-ui/components/account/account-create.tsx


import { Link } from '@remix-run/react';
import { Icon } from '#app/components/ui/icon';

interface CreateButtonProps {
  username: string;
}

export function CreateButton({ username }: CreateButtonProps) {
  return (
    <Link
      to={`/account/${username}/content/new`}
      className="flex items-center justify-center w-full p-4"
    >
      <Icon name="plus" className="mr-2 h-4 w-4" />
      <span className="text-sm">Create</span>
    </Link>
  );
}