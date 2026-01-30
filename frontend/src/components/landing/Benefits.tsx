import { useState } from 'react';
import { Briefcase, HardHat, PenTool, Building2 } from 'lucide-react';

const benefits = [
    {
        id: 'owners',
        label: 'Owners',
        icon: Building2,
        title: 'Maximize ROI and visibility',
        description: 'Get real-time visibility into project health. Reduce risk and ensure your capital projects are delivered on budget and on schedule.',
        features: ['Portfolio-wide dashboard', 'Automated financial reporting', 'Risk mitigation tools', 'Capital planning'],
        image: 'bg-blue-900' // placeholder color
    },
    {
        id: 'managers',
        label: 'Project Managers',
        icon: Briefcase,
        title: 'Deliver projects with confidence',
        description: 'Eliminate administrative busywork. Keep teams aligned and track every RFI, submittal, and change order in one place.',
        features: ['Centralized documentation', 'Budget tracking', 'Schedule management', 'Resource allocation'],
        image: 'bg-slate-800'
    },
    {
        id: 'contractors',
        label: 'General Contractors',
        icon: HardHat,
        title: 'Streamline field operations',
        description: 'Connect the field to the trailer. ensure crews are building off the latest drawings and safety protocols are followed explicitly.',
        features: ['Mobile field app', 'Daily logs & photos', 'Safety inspections', 'Subcontractor management'],
        image: 'bg-orange-800'
    },
    {
        id: 'architects',
        label: 'Architects & Engineers',
        icon: PenTool,
        title: 'Collaborate on design seamlessly',
        description: 'Bridge the gap between design and construction. Resolve issues faster with integrated design review and markup tools.',
        features: ['Design coordination', 'RFI collaboration', 'Drawing management', '3D model viewing'],
        image: 'bg-emerald-900'
    }
];

const Benefits = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section id="benefits" className="py-24 bg-slate-900 text-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Built for every stakeholder
                    </h2>
                    <p className="text-lg text-slate-400">
                        Whether you're in the office or the field, ConstructFlow provides the specific tools you need to succeed.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Tabs */}
                    <div className="lg:w-1/3 space-y-4">
                        {benefits.map((benefit, idx) => (
                            <button
                                key={benefit.id}
                                onClick={() => setActiveTab(idx)}
                                className={`w-full text-left p-6 rounded-xl transition-all duration-300 border ${activeTab === idx
                                    ? 'bg-slate-800 border-primary-500 shadow-lg'
                                    : 'bg-transparent border-transparent hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${activeTab === idx ? 'bg-primary-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                        <benefit.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg ${activeTab === idx ? 'text-white' : 'text-slate-300'}`}>
                                            {benefit.label}
                                        </h3>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-2/3">
                        <div className="bg-slate-800 rounded-2xl p-8 md:p-12 h-full border border-slate-700 relative overflow-hidden">
                            {/* Content Transition */}
                            <div key={activeTab} className="relative z-10 animate-fade-in">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                                    {benefits[activeTab].title}
                                </h3>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                    {benefits[activeTab].description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    {benefits[activeTab].features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                                            <span className="text-slate-300 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <a href="#" className="inline-flex items-center text-primary-400 font-semibold hover:text-primary-300 transition-colors group">
                                    Learn more about solutions for {benefits[activeTab].label}
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </a>
                            </div>

                            {/* Decorative Background Graphic */}
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br from-primary-600/20 to-transparent rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Benefits;
