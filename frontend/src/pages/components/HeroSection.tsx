import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" 
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 to-primary-600/70"></div>
      
      <div className="container relative z-10 text-white text-center md:text-left md:max-w-3xl lg:max-w-4xl">
        <div className="animate-fade-in">
          <h1 className="mb-4 font-bold leading-tight">
            Building Your Vision <br className="hidden md:block" />
            <span className="text-secondary-500">With Precision</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto md:mx-0">
            Quality civil construction services you can trust. From residential homes to commercial buildings, we deliver excellence at every step.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#contact" className="btn-primary group">
              Get a Free Quote
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </a>
            
            <a href="#services" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Explore Services
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 mx-auto text-center animate-bounce">
          <a href="#about" className="inline-block text-white/80 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;