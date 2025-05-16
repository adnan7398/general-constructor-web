import React from 'react';
import { Check, Star, Clock, Calculator, Users, ShieldCheck } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        <div className="bg-secondary-500 rounded-full p-2">
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-xl font-bold text-primary-500 mb-2">{title}</h3>
        <p className="text-accent-600">{description}</p>
      </div>
    </div>
  );
};

const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: <Star className="w-5 h-5 text-white" />,
      title: "Quality Excellence",
      description: "We use premium materials and follow strict quality control measures to ensure the highest standard of construction."
    },
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      title: "Timely Delivery",
      description: "We are committed to completing projects on schedule without compromising on quality or safety."
    },
    {
      icon: <Calculator className="w-5 h-5 text-white" />,
      title: "Transparent Pricing",
      description: "Our detailed cost estimates and transparent billing ensure there are no surprises in your budget."
    },
    {
      icon: <Users className="w-5 h-5 text-white" />,
      title: "Skilled Workforce",
      description: "Our team of experienced professionals brings expertise and craftsmanship to every project."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      title: "Safety Compliance",
      description: "We adhere to all safety regulations and maintain a safe working environment throughout the construction process."
    },
    {
      icon: <Check className="w-5 h-5 text-white" />,
      title: "End-to-End Solutions",
      description: "From design to completion, we handle all aspects of your project for a seamless experience."
    }
  ];

  return (
    <section id="why-choose-us" className="section bg-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-bold text-primary-500 relative inline-block">
              Why Choose Us
              <span className="absolute bottom-0 left-0 w-24 h-1 bg-secondary-500"></span>
            </h2>
            <p className="mt-8 mb-10 text-lg text-accent-600">
              At Divine Developer, we stand out from the competition through our commitment to excellence, innovation, and customer satisfaction.
            </p>

            <div className="space-y-8">
              {features.slice(0, 3).map((feature, index) => (
                <Feature
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/1451411/pexels-photo-1451411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Construction workers" 
              className="rounded-lg shadow-xl"
            />

            <div className="absolute top-0 right-0 bottom-0 left-0 bg-primary-500/20 rounded-lg"></div>

            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-lg shadow-xl max-w-xs">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="ml-2 text-accent-700 font-medium">100+ Happy Clients</span>
              </div>
              <p className="text-accent-600 italic text-sm">
                "Divine Developer transformed our vision into reality. Their attention to detail and commitment to quality is unmatched."
              </p>
              <p className="mt-2 font-medium">- Rajesh Sharma, Homeowner</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.slice(3).map((feature, index) => (
            <Feature
              key={index + 3}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;