import { Link, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logout from "../components/Logout";
import { Banner } from "./Utils";

function AppLayout() {
  return (
    <div className="max-w-300 w-full mx-auto px-4 min-h-screen flex flex-col mt-5">
      <Banner />
      <Navbar />
      <div className="flex-1 flex justify-center py-10">
        <Outlet />
      </div>
    </div>
  );
}

function Navbar() {
  const { role, name } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav>
      <div className="flex justify-between items-center gap-3">
        <p className="text-xl md:text-3xl font-bold">
          {role == "owner" ? (
            <Link to="/my-restaurants">Restaurant Owners</Link>
          ) : (
            <Link to="/restaurants">Restaurant Reviews</Link>
          )}
        </p>
        {/* <div className="flex items-center gap-4 text-lg"></div> */}
        <div className="hidden md:flex items-center gap-4 text-lg">
          <p className="font-semibold capitalize text-black/80">
            Welcome, <span className="font-bold text-black">{name}</span>
          </p>
          <GetNavItems />
        </div>
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 
    ${isMenuOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="flex flex-col items-center px-6 py-6 gap-4">
          {/* Welcome name at top of mobile menu */}
          <span className="text-gray-600 pb-2">
            Welcome, <b className="text-orange-500">{name}</b>
          </span>

          {/* Nav items stacked */}
          {GetNavItems()}
        </div>
      </div>
    </nav>
  );
}

function GetNavItems() {
  const { user, role } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <>
      {user && role === "reviewer" && (
        <>
          <Link
            to="/restaurants"
            className="text-blue-500 hover:text-blue-600 font-bold cursor-pointer text-lg"
          >
            Restaurants
          </Link>
        </>
      )}
      {user && role == "owner" && (
        <>
          {!isActive("/my-restaurants") && (
            <Link
              to="/my-restaurants"
              className="text-blue-500 hover:text-blue-600 font-bold cursor-pointer text-lg"
            >
              My Restaurants
            </Link>
          )}
          {!isActive("/my-restaurants/add") && (
            <Link
              to="/my-restaurants/add"
              className="text-blue-500 hover:text-blue-600 font-bold cursor-pointer text-lg"
            >
              Add Restaurant
            </Link>
          )}
        </>
      )}
      <Logout />
    </>
  );
}

export default AppLayout;
