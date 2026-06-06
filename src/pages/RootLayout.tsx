import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Banner } from "./Utils";

function RootLayout() {
  return (
    <div className="max-w-300 w-full mx-auto mt-4 px-4 min-h-dvh flex flex-col">
      <Banner />
      <RootNavbar />
      <div className="flex-1 my-15">
        <Outlet />
      </div>
    </div>
  );
}

function RootNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav>
      <div className="flex justify-between items-center gap-3">
        <p className="text-2xl md:text-4xl text-center font-bold">
          Restaurant Reviews
        </p>
        {/* <div className="flex items-center gap-4 text-lg"></div> */}
        <div className="hidden md:flex items-center gap-4 text-2xl font-bold">
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
        <div className="flex flex-col items-center px-6 py-6 gap-4 font-bold text-xl">
          {GetNavItems()}
        </div>
      </div>
    </nav>
  );
}

function GetNavItems() {
  return (
    <>
      <NavLink
        to="/restaurants"
        end
        className={({ isActive }) =>
          isActive ? "text-blue-700" : "text-blue-500"
        }
      >
        Restaurants
      </NavLink>
      <NavLink
        to="/login"
        end
        className={({ isActive }) =>
          isActive ? "text-blue-700" : "text-blue-500"
        }
      >
        Login
      </NavLink>
      <NavLink
        to="/register"
        end
        className={({ isActive }) =>
          isActive ? "text-blue-700" : "text-blue-500"
        }
      >
        Register
      </NavLink>
    </>
  );
}

export default RootLayout;
