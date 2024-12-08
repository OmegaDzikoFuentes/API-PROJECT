import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { GiAztecCalendarSun } from "react-icons/gi";
import * as sessionActions from "../../store/session";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
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
  };

  const ulClassName = `profile-dropdown ${showMenu ? "" : "hidden"}`;

  return (
    <div className="profile-button">
      <button onClick={toggleMenu} className="menu-button">
        <GiAztecCalendarSun />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <ul className="button-detail">Hello, {user.firstName}</ul>
            <ul className="button-detail">{user.email}</ul>
            <ul>
                  <NavLink className="button-detail manage-spots" to="/manage-spots" onClick={() => setShowMenu(false)}>
                  Manage Spots
                  </NavLink>
            </ul>
            <ul className="button-detail">
              <button onClick={logout}>Log Out</button>
            </ul>
          </>
        ) : (
          <>
            <ul className="button-detail">
              <OpenModalButton
                modalComponent={<LoginFormModal />}
                buttonText="Log In"
                onButtonClick={() => setShowMenu(false)}
              />
            </ul>
            <ul className="button-detail">
              <OpenModalButton
                modalComponent={<SignupFormModal />}
                buttonText="Sign Up"
                onButtonClick={() => setShowMenu(false)}
              />
            </ul>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
