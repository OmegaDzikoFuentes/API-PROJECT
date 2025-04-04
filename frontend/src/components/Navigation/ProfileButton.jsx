import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { GiAztecCalendarSun } from "react-icons/gi";
import * as sessionActions from "../../store/session";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function ProfileButton({ user, isMobile, onCloseMenu }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const buttonRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target) && 
          buttonRef.current && !buttonRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(sessionActions.logout());
    navigate("/");
    setShowMenu(false);
    if (onCloseMenu) onCloseMenu();
  };

  const handleMenuItemClick = () => {
    setShowMenu(false);
    if (onCloseMenu) onCloseMenu();
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 hover:shadow-md transition-all duration-200"
      >
        <GiAztecCalendarSun className="h-5 w-5" />
        <span className="hidden md:inline">Menu</span>
      </button>
      
      {showMenu && (
        <ul 
          className={`absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-md py-2 z-50 ${isMobile ? 'top-full' : 'top-12'}`} 
          ref={ulRef}
        >
          {user ? (
            <>
              <li className="px-4 py-2 border-b border-gray-100">
                <div className="text-gray-800 font-semibold">
                  Hello, {user.firstName}
                </div>
                <div className="text-gray-600 text-sm truncate">{user.email}</div>
              </li>
              <li>
                <NavLink
                  to="/manage-spots"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                  onClick={handleMenuItemClick}
                >
                  Manage Spots
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                >
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="px-4 py-2">
                <OpenModalButton
                  modalComponent={<LoginFormModal />}
                  buttonText="Log In"
                  onButtonClick={handleMenuItemClick}
                />
              </li>
              <li className="px-4 py-2">
                <OpenModalButton
                  modalComponent={<SignupFormModal />}
                  buttonText="Sign Up"
                  onButtonClick={handleMenuItemClick}
                />
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;