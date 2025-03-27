
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  Basketball, 
  Calendar, 
  Users, 
  MessageCircle, 
  MapPin,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Basketball className="h-6 w-6 text-primary" />
          <span className="font-bold">BasketTourney</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/schedule" className="nav-link">
            <Calendar className="h-4 w-4" />
            Schedule
          </NavLink>
          <NavLink to="/teams" className="nav-link">
            <Users className="h-4 w-4" />
            Teams
          </NavLink>
          <NavLink to="/announcements" className="nav-link">
            <MessageCircle className="h-4 w-4" />
            Announcements
          </NavLink>
          <NavLink to="/courts" className="nav-link">
            <MapPin className="h-4 w-4" />
            Courts
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className="nav-link">
              <Settings className="h-4 w-4" />
              Admin
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 transition-transform hover:scale-105">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer w-full">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-md animate-fade-in">
            <nav className="flex flex-col p-6 space-y-4">
              <NavLink to="/" className="nav-link text-lg py-3" onClick={closeMenu} end>
                Home
              </NavLink>
              <NavLink to="/schedule" className="nav-link text-lg py-3" onClick={closeMenu}>
                <Calendar className="h-5 w-5 mr-2" />
                Schedule
              </NavLink>
              <NavLink to="/teams" className="nav-link text-lg py-3" onClick={closeMenu}>
                <Users className="h-5 w-5 mr-2" />
                Teams
              </NavLink>
              <NavLink to="/announcements" className="nav-link text-lg py-3" onClick={closeMenu}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Announcements
              </NavLink>
              <NavLink to="/courts" className="nav-link text-lg py-3" onClick={closeMenu}>
                <MapPin className="h-5 w-5 mr-2" />
                Courts
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className="nav-link text-lg py-3" onClick={closeMenu}>
                  <Settings className="h-5 w-5 mr-2" />
                  Admin
                </NavLink>
              )}
              <div className="pt-4 border-t">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <Button onClick={handleLogout} variant="destructive" className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button onClick={() => { navigate("/login"); closeMenu(); }}>
                      Login
                    </Button>
                    <Button 
                      onClick={() => { navigate("/register"); closeMenu(); }} 
                      variant="outline"
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
