import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-600 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">
              DIVINE<span className="text-secondary-500">DEVELOPER</span>
            </h3>
            <p className="text-white/80 mb-6">
              Building excellence through innovation, quality, and reliability since 2010. We're committed to turning your vision into reality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 hover:bg-secondary-500 p-2 rounded-full transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-secondary-500 p-2 rounded-full transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-secondary-500 p-2 rounded-full transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-secondary-500 p-2 rounded-full transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#about" className="text-white/80 hover:text-white transition-colors duration-300">About Us</a>
              </li>
              <li>
                <a href="#services" className="text-white/80 hover:text-white transition-colors duration-300">Our Services</a>
              </li>
              <li>
                <a href="#projects" className="text-white/80 hover:text-white transition-colors duration-300">Projects</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Careers</a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-300">Blog</a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors duration-300">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6">Contact Information</h4>
            <ul className="space-y-4">
              <li className="flex">
                <svg className="w-5 h-5 mr-3 mt-1 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-white/80">
                  123 Construction Avenue,<br />
                  Bengaluru, Karnataka 560001,<br />
                  India
                </span>
              </li>
              <li className="flex">
                <svg className="w-5 h-5 mr-3 mt-1 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span className="text-white/80">+91 9876543210</span>
              </li>
              <li className="flex">
                <svg className="w-5 h-5 mr-3 mt-1 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span className="text-white/80">info@divinedeveloper.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-bold mb-6">Newsletter</h4>
            <p className="text-white/80 mb-6">
              Subscribe to our newsletter to receive updates on our latest projects and services.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary-500 rounded-l-md w-full"
              />
              <button type="submit" className="bg-secondary-500 hover:bg-secondary-600 px-4 py-2 rounded-r-md transition-colors duration-300">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <hr className="border-white/20 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Divine Developer. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-white/70">
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;