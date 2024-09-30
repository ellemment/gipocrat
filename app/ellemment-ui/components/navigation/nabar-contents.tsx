// app/ellemment-ui/components/navigation/nabar-contents.tsx

import { Link } from '@remix-run/react';
import { Container } from '#app/components/ui/container';

const NavbarContents = () => {
  return (
    <nav className="text-inherit py-8">
      <Container>
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-4 lg:col-span-1">
            <h2 className="text-xs font-medium text-muted-foreground mb-4">Explore iPad</h2>
            <ul className="space-y-2">
              <li><Link to="/ipad" className="text-xl font-semibold text-inherit hover:text-muted-foreground">Explore All iPad</Link></li>
              <li><Link to="/ipad-pro" className="text-xl font-semibold text-inherit hover:text-muted-foreground">iPad Pro</Link></li>
              <li><Link to="/ipad-air" className="text-xl font-semibold text-inherit hover:text-muted-foreground">iPad Air</Link></li>
              <li><Link to="/ipad" className="text-xl font-semibold text-inherit hover:text-muted-foreground">iPad</Link></li>
              <li><Link to="/ipad-mini" className="text-xl font-semibold text-inherit hover:text-muted-foreground">iPad mini</Link></li>
              <li><Link to="/apple-pencil" className="text-xl font-semibold text-inherit hover:text-muted-foreground">Apple Pencil</Link></li>
              <li><Link to="/keyboards" className="text-xl font-semibold text-inherit hover:text-muted-foreground">Keyboards</Link></li>
            </ul>
          </div>
          <div className="col-span-4 lg:col-span-1 hidden lg:block">
            <h2 className="text-xs font-medium text-muted-foreground mb-4">Shop iPad</h2>
            <ul className="space-y-1">
              <li><Link to="/shop-ipad" className="text-xs font-medium text-inherit hover:text-muted-foreground">Shop iPad</Link></li>
              <li><Link to="/ipad-accessories" className="text-xs font-medium text-inherit hover:text-muted-foreground">iPad Accessories</Link></li>
              <li><Link to="/apple-trade-in" className="text-xs font-medium text-inherit hover:text-muted-foreground">Apple Trade In</Link></li>
              <li><Link to="/financing" className="text-xs font-medium text-inherit hover:text-muted-foreground">Financing</Link></li>
              <li><Link to="/college-offer" className="text-xs font-medium text-inherit hover:text-muted-foreground">College Student Offer</Link></li>
            </ul>
          </div>
          <div className="col-span-4 lg:col-span-1 hidden lg:block">
            <h2 className="text-xs font-medium text-muted-foreground mb-4">More from iPad</h2>
            <ul className="space-y-1">
              <li><Link to="/ipad-support" className="text-xs font-medium text-inherit hover:text-muted-foreground">iPad Support</Link></li>
              <li><Link to="/applecare-plus" className="text-xs font-medium text-inherit hover:text-muted-foreground">AppleCare+ for iPad</Link></li>
              <li><Link to="/ipados" className="text-xs font-medium text-inherit hover:text-muted-foreground">iPadOS 18</Link></li>
              <li><Link to="/apple-intelligence" className="text-xs font-medium text-inherit hover:text-muted-foreground">Apple Intelligence</Link></li>
              <li><Link to="/apps-by-apple" className="text-xs font-medium text-inherit hover:text-muted-foreground">Apps by Apple</Link></li>
              <li><Link to="/icloud-plus" className="text-xs font-medium text-inherit hover:text-muted-foreground">iCloud+</Link></li>
              <li><Link to="/education" className="text-xs font-medium text-inherit hover:text-muted-foreground">Education</Link></li>
            </ul>
          </div>
          <div className="col-span-4 lg:col-span-1 hidden lg:block">
            {/* This column is intentionally left empty */}
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default NavbarContents;