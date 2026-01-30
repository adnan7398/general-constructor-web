import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getHeroContent } from '../../api/website';

const Hero = () => {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getHeroContent();
                if (data) setContent(data);
            } catch (error) {
                console.error('Failed to fetch hero content');
            }
        };
        fetchContent();
    }, []);

    const tagline = content?.tagline || "Building Dreams, Engineering Reality";
    const subtext = content?.subtext || "Divine Developers delivers substantial construction solutions with a focus on quality, integrity, and innovation. From residential complexes to commercial infrastructure, we build the foundations for the future.";

    return (
        <div className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                    alt="Construction Site"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/70"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center md:text-left">
                <div className="max-w-4xl">
                    <div className="inline-block px-4 py-1.5 mb-6 border border-amber-500/30 rounded-full bg-amber-500/10 backdrop-blur-sm animate-fade-in-up">
                        <span className="text-amber-400 font-semibold tracking-wider uppercase text-xs">
                            Premier Construction Services
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100 font-display">
                        {tagline}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed animate-fade-in-up delay-200">
                        {subtext}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up delay-300">
                        <Link
                            to="/#projects"
                            className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-600/20 flex items-center justify-center gap-2"
                        >
                            View Our Projects
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            to="/#contact"
                            className="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white text-white font-bold rounded-sm uppercase tracking-wider transition-all hover:bg-white/5 flex items-center justify-center"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-10 text-white/50 hover:text-white transition-colors">
                <a href="#about" className="flex flex-col items-center gap-2">
                    <span className="text-xs uppercase tracking-widest">Explore</span>
                    <ChevronDown className="h-6 w-6" />
                </a>
            </div>
        </div>
    );
};

export default Hero;
