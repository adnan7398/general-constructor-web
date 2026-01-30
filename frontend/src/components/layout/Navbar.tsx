import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/90 backdrop-blur-md shadow-sm py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-slate-900 rounded-sm flex items-center justify-center text-amber-500 font-bold text-2xl shadow-lg border border-amber-500/20 group-hover:bg-slate-800 transition-colors">
                            D
                        </div>
                        <span className={`text-xl font-bold tracking-tight uppercase ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                            Divine <span className="text-amber-600">Developers</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center h-full space-x-8">
                        {[
                            { name: 'About', href: '#about' },
                            { name: 'Services', href: '#services' },
                            { name: 'Portfolio', href: '#portfolio' },
                            { name: 'Process', href: '#process' },
                            { name: 'Contact', href: '#contact' },
                        ].map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-600 hover:text-amber-600 font-medium text-sm uppercase tracking-wide transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/signin"
                            className="px-6 py-2 border border-slate-300 text-slate-700 font-bold text-sm uppercase tracking-wider hover:border-amber-500 hover:text-amber-600 transition-all rounded-sm"
                        >
                            Client Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-slate-700 hover:text-amber-600 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 py-6 px-6 flex flex-col space-y-4">
                    {[
                        { name: 'About', href: '#about' },
                        { name: 'Services', href: '#services' },
                        { name: 'Portfolio', href: '#portfolio' },
                        { name: 'Process', href: '#process' },
                        { name: 'Contact', href: '#contact' },
                    ].map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-bold text-slate-800 py-3 border-b border-gray-100 hover:text-amber-600 tracking-wide uppercase"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-4">
                        <Link
                            to="/signin"
                            className="block w-full py-4 text-center bg-slate-900 text-white font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors rounded-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Client Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
