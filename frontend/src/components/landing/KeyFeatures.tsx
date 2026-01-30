import { BarChart3, Users, FileText, Layers, ShieldCheck, Clock } from 'lucide-react';

const icons = {
    project: Layers,
    cost: BarChart3,
    team: Users,
    docs: FileText,
    compliance: ShieldCheck,
    time: Clock,
};

const features = [
    {
        icon: icons.project,
        title: 'Project Management',
        description: 'Keep projects on track with centralized tasks, schedules, and real-time collaboration tools.',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: icons.cost,
        title: 'Financial Control',
        description: 'Track budgets, change orders, and expenses in real-time to maximize profitability.',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        icon: icons.team,
        title: 'Resource Planning',
        description: 'Optimize workforce allocation and equipment usage across all your active sites.',
        color: 'bg-violet-50 text-violet-600',
    },
    {
        icon: icons.docs,
        title: 'Document Management',
        description: 'Store, organize, and share blueprints, contracts, and RFIs with version control.',
        color: 'bg-amber-50 text-amber-600',
    },
    {
        icon: icons.compliance,
        title: 'Quality & Safety',
        description: 'Standardize inspections, track incidents, and ensure compliance with safety regulations.',
        color: 'bg-rose-50 text-rose-600',
    },
    {
        icon: icons.time,
        title: 'Time & Scheduling',
        description: 'Advanced Gantt charts and timeline views to deliver projects ahead of schedule.',
        color: 'bg-cyan-50 text-cyan-600',
    },
];

const KeyFeatures = () => {
    return (
        <section id="features" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Everything you need to build better
                    </h2>
                    <p className="text-lg text-slate-600">
                        A complete suite of tools designed to help construction professionals manage the entire project lifecycle from pre-construction to closeout.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 group border border-slate-100"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyFeatures;
