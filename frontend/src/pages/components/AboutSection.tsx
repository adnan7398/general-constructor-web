import React from 'react';
import { Award, Clock, Users, Shield } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-bold text-primary-500 relative inline-block">
            About Divine Developer
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary-500"></span>
          </h2>
          <p className="mt-8 text-lg text-accent-600 max-w-3xl mx-auto">
            Building excellence through innovation, quality, and reliability since 2010.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Construction site" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white p-6 rounded-lg shadow-lg hidden md:block">
                <p className="font-heading text-4xl font-bold">12+</p>
                <p className="text-sm font-medium">Years of Experience</p>
              </div>
            </div>
          </div>

          <div className="animate-slide-up">
            <h3 className="text-2xl font-bold text-primary-600 mb-4">Excellence in Construction</h3>
            <p className="mb-6 text-accent-700">
              Divine Developer is a premier civil construction company with a reputation for delivering high-quality projects on time and within budget. Our team of experienced professionals is dedicated to bringing your vision to life with precision and excellence.
            </p>
            <p className="mb-8 text-accent-700">
              We specialize in residential, commercial, and industrial construction, offering end-to-end solutions from planning and design to execution and finishing. Our commitment to quality, innovation, and customer satisfaction has made us a trusted name in the construction industry.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-secondary-500/10 p-3 rounded-full mr-4">
                  <Award className="w-6 h-6 text-secondary-500" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-600">Quality</h4>
                  <p className="text-sm text-accent-600">Premium materials & craftsmanship</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-secondary-500/10 p-3 rounded-full mr-4">
                  <Clock className="w-6 h-6 text-secondary-500" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-600">Timeliness</h4>
                  <p className="text-sm text-accent-600">On-time project delivery</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-secondary-500/10 p-3 rounded-full mr-4">
                  <Users className="w-6 h-6 text-secondary-500" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-600">Expert Team</h4>
                  <p className="text-sm text-accent-600">Skilled professionals</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-secondary-500/10 p-3 rounded-full mr-4">
                  <Shield className="w-6 h-6 text-secondary-500" />
                </div>
                <div>
                  <h4 className="font-bold text-primary-600">Integrity</h4>
                  <p className="text-sm text-accent-600">Transparent processes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;