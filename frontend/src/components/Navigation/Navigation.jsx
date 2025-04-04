import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaceOfWorship, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 ${
        isScrolled ? 'shadow-md bg-white' : 'bg-white'
      } transition-all duration-300`}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex items-center">
          <NavLink to="/" className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors duration-300 flex items-center gap-2">
            <FontAwesomeIcon icon={faPlaceOfWorship} size="lg" className="text-powder-blue" />
            StayCation
          </NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isLoaded && sessionUser && (
            <NavLink
              to="/spots/new"
              className="bg-powder-blue hover:bg-blue-300 text-black font-semibold py-2 px-4 rounded-full transition-colors duration-300"
            >
              Create a New Spot
            </NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </div>

        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 p-2"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-2 px-4">
          {sessionUser && (
            <NavLink
              to="/spots/new"
              className="block py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create a New Spot
            </NavLink>
          )}
          <div className="py-2">
            <ProfileButton user={sessionUser} isMobile={true} onCloseMenu={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;