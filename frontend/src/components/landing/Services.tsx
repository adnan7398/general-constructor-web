import { Home, Building2, HardHat, Warehouse, ArrowRight } from 'lucide-react';

const Services = () => {
    const services = [
        {
            icon: Home,
            title: "Construction Works",
            desc: "Comprehensive construction solutions for residential and commercial projects. We handle everything from foundation to finishing.",
            image: "https://images.unsplash.com/photo-1600596542815-e495d91d0ed2?q=80&w=1000&auto=format&fit=crop"
        },
        {
            icon: Building2,
            title: "Elevation & Facade Design",
            desc: "Stunning outer elevation designs that make your property stand out. Modern, classic, and contemporary facade solutions.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop"
        },
        {
            icon: Warehouse,
            title: "Renovation & Remodeling",
            desc: "Transform your existing space with our expert renovation services. We breathe new life into old structures.",
            image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop"
        },
        {
            icon: HardHat,
            title: "Structural & Civil Works",
            desc: "Expert structural engineering and civil works ensuring the safety, stability, and longevity of your buildings.",
            image: "https://images.unsplash.com/photo-1581094794329-cd56b507d4b5?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    return (
        <section id="services" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2 block">
                        Our Expertise
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        Comprehensive Construction Solutions
                    </h2>
                    <p className="text-slate-600 text-lg">
                        We deliver excellence across all sectors of the construction industry, ensuring every project meets global standards of quality and safety.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors z-10 transition-all"></div>
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 z-20 bg-amber-500 p-3 rounded-sm text-white shadow-lg">
                                    <service.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    {service.desc}
                                </p>
                                <a href="#" className="inline-flex items-center text-sm font-bold text-slate-400 group-hover:text-amber-600 uppercase tracking-wide transition-colors">
                                    Learn More <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
