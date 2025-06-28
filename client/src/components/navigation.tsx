import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Gift, Users, Calendar, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Gift },
    { path: '/employees', label: 'Employees', icon: Users },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
  ];

  const NavLink = ({ path, label, icon: Icon, mobile = false }: any) => {
    const isActive = location === path;
    const baseClasses = mobile 
      ? "flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-colors"
      : "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors";
    
    const activeClasses = isActive
      ? "bg-purple-100 text-purple-700"
      : "text-gray-600 hover:bg-gray-100";

    return (
      <Link href={path}>
        <Button
          variant="ghost"
          className={`${baseClasses} ${activeClasses}`}
          onClick={() => mobile && setIsOpen(false)}
        >
          <Icon className="w-5 h-5" />
          {label}
        </Button>
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <Gift className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                  Birthday Tracker
                </h1>
                <h1 className="text-lg font-bold text-gray-900 sm:hidden">
                  Tracker
                </h1>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                      <Gift className="text-white w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Tracker</h2>
                  </div>
                </div>
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink key={item.path} {...item} mobile />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
