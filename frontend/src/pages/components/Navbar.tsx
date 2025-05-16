import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <span className={`font-heading font-bold text-2xl ${isScrolled ? 'text-primary-500' : 'text-white'}`}>
              DIVINE<span className="text-secondary-500">DEVELOPER</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className={`font-medium hover:text-secondary-500 transition-colors ${isScrolled ? 'text-primary-600' : 'text-white'}`}>
              About
            </a>
            <a href="#services" className={`font-medium hover:text-secondary-500 transition-colors ${isScrolled ? 'text-primary-600' : 'text-white'}`}>
              Services
            </a>
            <a href="#why-choose-us" className={`font-medium hover:text-secondary-500 transition-colors ${isScrolled ? 'text-primary-600' : 'text-white'}`}>
              Why Us
            </a>
            <a href="#projects" className={`font-medium hover:text-secondary-500 transition-colors ${isScrolled ? 'text-primary-600' : 'text-white'}`}>
              Projects
            </a>
            <a href="#contact" className="btn-primary">
              Contact Us
            </a>
            <a href="/signin" className="btn-primary bg-secondary-700 text-white hover:bg-secondary-500 transition-colors">
              Admin Login
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-2xl focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-primary-500' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-primary-500' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a 
                href="#about" 
                className="font-medium text-primary-600 hover:text-secondary-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
              <a 
                href="#services" 
                className="font-medium text-primary-600 hover:text-secondary-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Services
              </a>
              <a 
                href="#why-choose-us" 
                className="font-medium text-primary-600 hover:text-secondary-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Why Us
              </a>
              <a 
                href="#projects" 
                className="font-medium text-primary-600 hover:text-secondary-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Projects
              </a>
              <a 
                href="#contact" 
                className="btn-primary text-center"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Top Contact Bar */}
      <div className={`bg-primary-600 text-white py-2 transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-1 md:space-y-0 items-center">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@divinedeveloper.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center mt-2 md:mt-0">
              <MapPin className="w-4 h-4 mr-2" />
              <span>123 Construction Avenue, Bengaluru, India</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;