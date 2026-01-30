import { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { getShowcaseProjects, Project } from '../../api/projects';

const API_BASE = 'https://general-constructor-web-2.onrender.com';

const Portfolio = () => {
    const categories = ["All", "Residential", "Commercial", "Infrastructure"];
    const [activeCategory, setActiveCategory] = useState("All");
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getShowcaseProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch showcase projects");
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = activeCategory === "All"
        ? projects
        : projects.filter(p => p.projectType.toLowerCase() === activeCategory.toLowerCase());

    const getImageUrl = (img?: string) => {
        if (!img || img.includes('via.placeholder.com')) return 'https://placehold.co/600x800/f3f4f6/9ca3af?text=Project+Image';
        if (img.startsWith('http')) return img;
        return `${API_BASE}${img}`;
    };

    return (
        <section id="portfolio" className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2 block">
                            Our Portfolio
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Featured Projects
                        </h2>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 text-sm font-bold uppercase tracking-wide rounded-sm transition-all ${activeCategory === cat
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-sm bg-slate-100 aspect-[4/5] cursor-pointer">
                            <img
                                src={getImageUrl(project.images?.[0] || project.image)}
                                alt={project.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 block">
                                    {project.projectType}
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {project.name}
                                </h3>
                                <p className="text-slate-300 text-sm mb-4">
                                    {project.location || "Location TBD"}
                                </p>
                                <div className="h-0 group-hover:h-auto overflow-hidden transition-all">
                                    <button className="text-white hover:text-amber-400 font-bold uppercase tracking-wide text-sm inline-flex items-center gap-2">
                                        View Details <ExternalLink className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="px-8 py-4 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold uppercase tracking-wider transition-all rounded-sm inline-flex items-center gap-2">
                        View All Projects <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
