// components/common/Navbar.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginModal} from "@/features/auth/LoginModal";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
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
        <Link to="">
          <Button onClick={() => setShowLoginModal(true)}>login</Button>
        </Link>
      </div>
    </nav>

      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)}/>
      </>
  );
};

export default Navbar;
