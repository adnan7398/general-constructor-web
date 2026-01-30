import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 pt-20 pb-10 text-slate-300 border-t border-slate-800">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="w-10 h-10 bg-slate-800 rounded-sm flex items-center justify-center text-amber-500 font-bold text-2xl shadow-lg border border-amber-500/20 group-hover:bg-slate-700 transition-colors">
                                D
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight uppercase">
                                Divine <span className="text-amber-600">Developers</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
                            Building the future with precision, integrity, and innovation.
                            We are committed to delivering world-class construction solutions
                            for residential, commercial, and industrial projects.
                        </p>
                        <div className="flex space-x-4">
                            {[Instagram, Facebook, Twitter, Linkedin].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="https://instagram.com/divine_developers_"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-10 h-10 rounded-sm bg-slate-800 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all text-slate-400"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Services</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Residential</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Commercial</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Industrial</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Infrastructure</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Interiors</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#about" className="hover:text-amber-500 transition-colors">About Us</a></li>
                            <li><a href="#portfolio" className="hover:text-amber-500 transition-colors">Our Projects</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">News & Media</a></li>
                            <li><a href="#contact" className="hover:text-amber-500 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition-colors">Sitemap</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Divine Developers. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Designed for Excellence.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
