import React, { useState, useEffect } from 'react';
import { getShowcaseProjects, Project } from '../../api/projects';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  quote: string;
  imageUrl: string;
}

const API_BASE = 'https://general-constructor-web-2.onrender.com';

// Fallback projects if API fails
const fallbackProjects = [
  { _id: '1', name: "Luxury Villa Complex", projectType: "residential" as const, image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", description: "A collection of 12 premium villas with modern amenities and sustainable features.", status: 'completed' as const },
  { _id: '2', name: "Corporate Headquarters", projectType: "commercial" as const, image: "https://images.pexels.com/photos/256219/pexels-photo-256219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", description: "A 10-story office building with state-of-the-art facilities and energy-efficient design.", status: 'completed' as const },
  { _id: '3', name: "Community Center", projectType: "public" as const, image: "https://images.pexels.com/photos/162539/architecture-building-amsterdam-reflection-162539.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", description: "A multi-purpose community center with recreational and educational facilities.", status: 'completed' as const },
  { _id: '4', name: "Apartment Complex", projectType: "residential" as const, image: "https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", description: "A 50-unit apartment complex with modern amenities and green spaces.", status: 'completed' as const },
  { _id: '5', name: "Shopping Mall", projectType: "commercial" as const, image: "https://images.pexels.com/photos/2096085/pexels-photo-2096085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", description: "A multi-level shopping center with retail spaces, food court, and entertainment zones.", status: 'completed' as const },
  { _id: '6', name: "Highway Extension", projectType: "infrastructure" as const, image: "https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", description: "A 15-km highway extension with bridges and drainage systems.", status: 'completed' as const },
];

const ProjectsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getShowcaseProjects();
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (error) {
        console.error('Error fetching showcase projects:', error);
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Rajesh Sharma",
      position: "Homeowner",
      quote: "Divine Developer exceeded our expectations in building our dream home. Their attention to detail and commitment to quality is truly remarkable.",
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Priya Patel",
      position: "Business Owner",
      quote: "Our commercial building was completed on time and within budget. The team at Divine Developer was professional, responsive, and a pleasure to work with.",
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Arun Mehta",
      position: "Property Developer",
      quote: "We have worked with Divine Developer on multiple projects, and they consistently deliver high-quality construction with excellent project management.",
      imageUrl: "https://randomuser.me/api/portraits/men/67.jpg"
    }
  ];

  const categories = ['all', ...new Set(projects.map(p => p.projectType))];

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(project => project.projectType === activeTab);

  const getImageUrl = (img?: string) => {
    if (!img || img.includes('via.placeholder.com')) return 'https://placehold.co/600x400/1e293b/94a3b8?text=Project';
    if (img.startsWith('http')) return img;
    return `${API_BASE}${img}`;
  };

  return (
    <section id="projects" className="section bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-bold text-primary-500 relative inline-block">
            Our Projects
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary-500"></span>
          </h2>
          <p className="mt-8 text-lg text-accent-600 max-w-3xl mx-auto">
            Browse through our portfolio of successful projects that showcase our expertise and craftsmanship.
          </p>
        </div>

        {/* Project Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeTab === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-accent-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <div key={project._id} className="group">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(project.image)}
                      alt={project.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <p className="mt-2 text-white/80">{project.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-500 bg-primary-100 rounded-full">
                      {project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1)}
                    </span>
                    {project.location && (
                      <span className="ml-2 text-xs text-accent-500">{project.location}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12 text-accent-500">
            <p>No projects found in this category.</p>
          </div>
        )}

        {/* Testimonials */}
        <div className="mt-24">
          <h2 className="text-center font-bold text-primary-500 mb-16 relative inline-block">
            Client Testimonials
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary-500"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="card bg-white p-8">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-primary-600">{testimonial.name}</h3>
                    <p className="text-sm text-accent-500">{testimonial.position}</p>
                  </div>
                </div>
                <p className="text-accent-600 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 bg-primary-500 rounded-lg shadow-xl p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">150+</p>
              <p className="text-white/80">Projects Completed</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">12+</p>
              <p className="text-white/80">Years of Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50+</p>
              <p className="text-white/80">Team Members</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">100+</p>
              <p className="text-white/80">Happy Clients</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
