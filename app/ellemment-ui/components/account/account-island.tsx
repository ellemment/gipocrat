// app/ellemment-ui/components/account/account-island.tsx
import { Link, Form } from '@remix-run/react';
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '#app/components/ui/avatar';
import { Button } from '#app/components/ui/button';
import { DynamicIsland } from '#app/components/ui/dynamic-island';
import { Icon } from '#app/components/ui/icon';
import { motion } from 'framer-motion';

interface User {
  id: string;
  name: string | null;
  username: string;
  email: string;
  image?: { id: string } | null;
}

interface AccountIslandProps {
  user: User;
}

export function AccountIsland({ user }: AccountIslandProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const userDisplayName = user.name || user.username;

  const triggerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image ? `/resources/user-images/${user.image.id}` : undefined} alt={userDisplayName} />
          <AvatarFallback>{userDisplayName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{userDisplayName}</span>
          <span className="text-xs opacity-70">{user.email}</span>
        </div>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Icon name="chevron-right" className="h-4 w-4" />
      </motion.div>
    </div>
  );

  const expandedContent = (
    <div className="mt-4 space-y-2">
      <Link to="/account/settings" className="flex items-center p-2 hover:opacity-80 rounded transition-opacity">
        <Icon name="settings" className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </Link>
      <Form action="/logout" method="POST" className="w-full">
        <Button type="submit" variant="ghost" className="w-full justify-start p-2 hover:opacity-80 rounded transition-opacity">
          <Icon name="exit" className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </Form>
    </div>
  );

  return (
    <DynamicIsland
      trigger={triggerContent}
      className="mx-auto"
    >
      {expandedContent}
    </DynamicIsland>
  );
}