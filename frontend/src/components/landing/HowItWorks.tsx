import { ClipboardList, LayoutDashboard, TrendingUp, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: ClipboardList,
        title: 'Digitize Your Workflow',
        description: 'Import your existing spreadsheets and documents. Standardize processes across all teams and projects instantly.',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        icon: LayoutDashboard,
        title: 'Connect Field & Office',
        description: 'Enable real-time collaboration. Field data syncs automatically with the office dashboard for a single source of truth.',
        color: 'bg-indigo-100 text-indigo-600',
    },
    {
        icon: TrendingUp,
        title: 'Analyze & Optimize',
        description: 'Gain actionable insights from generated reports. Identify bottlenecks and improve efficiency project-over-project.',
        color: 'bg-teal-100 text-teal-600',
    },
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase tracking-wide mb-6">
                            How it Works
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                            From chaos to clarity in three simple steps
                        </h2>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            ConstructFlow replaces disparate tools and manual processes with a unified intelligent platform that grows with your business.
                        </p>

                        <div className="space-y-12">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="flex-shrink-0 relative">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${step.color} shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                            <step.icon size={26} />
                                        </div>
                                        {idx !== steps.length - 1 && (
                                            <div className="absolute top-14 left-7 w-0.5 h-12 bg-slate-200 -z-0"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-50 aspect-[4/3] group">
                            {/* Abstract Representation of UI Flow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>

                            {/* Floating Cards Animation */}
                            <div className="absolute top-[10%] left-[10%] w-[80%] bg-white rounded-xl shadow-card p-6 border border-slate-100 z-10 animate-fade-in">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                                    <div className="h-8 w-24 bg-primary-100 rounded-lg text-primary-600 text-xs flex items-center justify-center font-bold">In Progress</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                                    <div className="h-2 w-2/3 bg-slate-100 rounded"></div>
                                </div>
                            </div>

                            <div className="absolute top-[40%] right-[5%] w-[60%] bg-white rounded-xl shadow-card p-5 border border-slate-100 z-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <CheckCircle size={16} />
                                    </div>
                                    <div>
                                        <div className="h-3 w-20 bg-slate-200 rounded mb-1"></div>
                                        <div className="h-2 w-12 bg-slate-100 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-[10%] left-[15%] w-[70%] bg-white rounded-xl shadow-card-hover p-6 border border-slate-100 z-30 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-sm text-slate-500 mb-1">Project Budget</div>
                                        <div className="text-2xl font-bold text-slate-900">$2.4M</div>
                                    </div>
                                    <div className="h-10 w-24 bg-primary-500 rounded-lg text-white flex items-center justify-center text-sm font-medium">
                                        View Report
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
