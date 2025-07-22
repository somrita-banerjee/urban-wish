// components/common/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LoginModal } from "@/components/LoginModal";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { clearLocalStorage, getToken, getUserType } from "@/lib/storage";

const Navbar = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) setIsLoggedIn(true);
    const type = getUserType();
    setUserType(type ?? "");
  }, []);

  const onLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogOut = () => {
    clearLocalStorage();
    setIsLoggedIn(false);
  };
  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 shadow-sm bg-white border-b">
        <Link to="/" className="text-xl font-bold text-primary">
          🛒 Urban Wish
        </Link>
        <div className="space-x-4 hidden sm:flex">
          <Link to="/cart">
            <Button variant="ghost">Cart</Button>
          </Link>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">My Account</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/me")}>
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setShowLoginModal(true)}>Login</Button>
          )}
        </div>
      </nav>

      <LoginModal
        open={showLoginModal}
        onLogin={() => onLogin()}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Navbar;
