import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaceOfWorship, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from 'framer-motion';
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

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
    <motion.div 
      className={`navigation ${isScrolled ? 'scrolled' : ''}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="logo">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <NavLink to="/" className="nav-brand">
          StayCation
        </NavLink>
          <FontAwesomeIcon icon={faPlaceOfWorship} size="2x" />
        </motion.div>
        
      </div>
      {isLoaded && (
        <>
          <div className="nav-links desktop-nav">
            {sessionUser && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                
              </motion.div>
            )}
            <ProfileButton user={sessionUser} />
          </div>
          <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </div>
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                className="mobile-nav"
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {sessionUser && (
                  <NavLink to="/spots/new" className="create-spot-button" onClick={() => setIsMobileMenuOpen(false)}>
                    Create a New Spot
                  </NavLink>
                )}
                
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

export default Navigation;
