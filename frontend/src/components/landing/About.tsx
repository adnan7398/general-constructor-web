import { useState } from 'react';
import { Shield, Clock, Award, Hammer, ArrowRight, X } from 'lucide-react';

const About = () => {
    const [showLearnMore, setShowLearnMore] = useState(false);
    return (
        <section id="about" className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Image Grid */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1590644365607-1c5a2e9e3a7a?q=80&w=1000&auto=format&fit=crop"
                                alt="Modern Architecture"
                                className="rounded-sm object-cover h-64 w-full shadow-lg mt-8"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop"
                                alt="Construction Team"
                                className="rounded-sm object-cover h-64 w-full shadow-lg"
                            />
                        </div>
                        {/* Experience Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-slate-900 p-8 rounded-sm shadow-xl border-l-4 border-amber-500">
                            <p className="text-5xl font-bold text-white mb-1">25+</p>
                            <p className="text-slate-400 uppercase tracking-wider text-sm font-medium">Years of<br />Experience</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <div className="inline-block px-3 py-1 mb-4 border-l-4 border-amber-500 bg-slate-50">
                            <span className="text-slate-900 font-bold tracking-widest uppercase text-xs pl-2">
                                About Divine Developers
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            We Construct Infrastructure <br />
                            <span className="text-amber-600">That Lasts for Generations</span>
                        </h2>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                            Founded on the principles of integrity and innovation, Divine Developers has established itself as a leader in the construction industry. We combine modern technology with traditional craftsmanship to deliver projects that stand the test of time.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {[
                                { icon: Shield, title: "Experienced Team", desc: "A team of seasoned professionals dedicated to perfection." },
                                { icon: Award, title: "Quality & Timely Delivery", desc: "We respect deadlines without compromising on quality." },
                                { icon: Clock, title: "Innovative Designs", desc: "Modern technology meets creative architectural solutions." },
                                { icon: Hammer, title: "Customer-Centric", desc: "Your vision is our command; we build around your needs." }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 bg-amber-50 rounded-sm flex items-center justify-center text-amber-600">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a href="#services" className="text-amber-600 font-bold uppercase tracking-wide border-b-2 border-amber-600 hover:text-slate-900 hover:border-slate-900 transition-all pb-1 inline-flex items-center gap-2">
                                Explore Our Services <ArrowRight className="h-4 w-4" />
                            </a>

                            <button
                                onClick={() => setShowLearnMore(true)}
                                className="text-slate-500 font-bold uppercase tracking-wide border-b-2 border-transparent hover:text-amber-600 hover:border-amber-600 transition-all pb-1 inline-flex items-center gap-2"
                            >
                                Learn More <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Learn More Modal */}
            {showLearnMore && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-sm shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setShowLearnMore(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X className="h-6 w-6 text-slate-600" />
                        </button>

                        <div className="p-8 md:p-12">
                            <h3 className="text-3xl font-bold text-slate-900 mb-2">Our Story</h3>
                            <div className="w-20 h-1 bg-amber-500 mb-6"></div>

                            <div className="prose prose-slate max-w-none">
                                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                    Since our inception over 25 years ago, <span className="font-bold text-slate-900">Divine Developers</span> has been at the forefront of transforming the cityscape. What started as a small team of passionate engineers has grown into a premier construction firm, trusted by hundreds of families and businesses.
                                </p>

                                <h4 className="text-xl font-bold text-slate-900 mb-4">Our Mission</h4>
                                <p className="text-slate-600 mb-6">
                                    To deliver superior construction services with unwavering commitment to quality, safety, and timely delivery, ensuring every project we touch turns into a landmark.
                                </p>

                                <h4 className="text-xl font-bold text-slate-900 mb-4">Why We Are Different</h4>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-8">
                                    <li><strong>Legacy of Trust:</strong> Decades of experience in the local market.</li>
                                    <li><strong>Transparent Dealings:</strong> No hidden costs, honest communication.</li>
                                    <li><strong>End-to-End Solutions:</strong> From architectural design to interior finishing.</li>
                                    <li><strong>Post-Construction Support:</strong> We stay with you even after the keys are handed over.</li>
                                </ul>

                                <div className="bg-amber-50 p-6 rounded-sm border-l-4 border-amber-500">
                                    <p className="italic text-slate-700 font-medium">
                                        "We believe that every structure has a soul. Our job is to build the body that houses it perfectly."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};



export default About;
