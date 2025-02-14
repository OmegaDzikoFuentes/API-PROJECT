import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { GiAztecCalendarSun } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import * as sessionActions from "../../store/session";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./ProfileButton.css"

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

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="profile-button">
      <motion.button
        onClick={toggleMenu}
        className="menu-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <GiAztecCalendarSun />
      </motion.button>
      <AnimatePresence>
        {showMenu && (
          <motion.ul
            className="profile-dropdown"
            ref={ulRef}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {user ? (
              <>
                <motion.li className="button-detail" whileHover={{ x: 5 }}>
                  Hello, {user.firstName}
                </motion.li>
                <motion.li className="button-detail" whileHover={{ x: 5 }}>
                  {user.email}
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <NavLink
                    className="button-detail manage-spots"
                    to="/manage-spots"
                    onClick={() => setShowMenu(false)}
                  >
                    Manage Spots
                  </NavLink>
                </motion.li>
                <motion.li className="button-detail" whileHover={{ x: 5 }}>
                  <motion.button
                    onClick={logout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Log Out
                  </motion.button>
                </motion.li>
              </>
            ) : (
              <>
                <motion.li className="button-detail" whileHover={{ x: 5 }}>
                  <OpenModalButton
                    modalComponent={<LoginFormModal />}
                    buttonText="Log In"
                    onButtonClick={() => setShowMenu(false)}
                  />
                </motion.li>
                <motion.li className="button-detail" whileHover={{ x: 5 }}>
                  <OpenModalButton
                    modalComponent={<SignupFormModal />}
                    buttonText="Sign Up"
                    onButtonClick={() => setShowMenu(false)}
                  />
                </motion.li>
              </>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProfileButton;
