import React from 'react';
import { Building2, Hammer, PaintBucket, Loader as Road, Home, Wrench } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <div className="card group hover:bg-primary-500 hover:text-white transition-all duration-300">
      <div className="mb-6 text-secondary-500 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors duration-300">{title}</h3>
      <p className="text-accent-600 group-hover:text-white/90 transition-colors duration-300">{description}</p>
    </div>
  );
};

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: <Building2 className="w-12 h-12" />,
      title: "Residential Construction",
      description: "Custom homes built to your specifications with quality materials and expert craftsmanship."
    },
    {
      icon: <Hammer className="w-12 h-12" />,
      title: "Commercial Construction",
      description: "Office buildings, retail spaces, and industrial facilities constructed to meet your business needs."
    },
    {
      icon: <Road className="w-12 h-12" />,
      title: "Infrastructure Development",
      description: "Roads, bridges, and drainage systems built with durability and functionality in mind."
    },
    {
      icon: <PaintBucket className="w-12 h-12" />,
      title: "Interior Finishing",
      description: "High-quality interior work including painting, flooring, and custom cabinetry for a perfect finish."
    },
    {
      icon: <Home className="w-12 h-12" />,
      title: "Renovation & Remodeling",
      description: "Transform existing spaces with our comprehensive renovation and remodeling services."
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: "Maintenance & Repair",
      description: "Ongoing maintenance and repair services to keep your property in excellent condition."
    }
  ];

  return (
    <section id="services" className="section bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-bold text-primary-500 relative inline-block">
            Our Services
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary-500"></span>
          </h2>
          <p className="mt-8 text-lg text-accent-600 max-w-3xl mx-auto">
            We offer a comprehensive range of construction services tailored to meet your specific needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="#contact" className="btn-primary">
            Request a Service
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;