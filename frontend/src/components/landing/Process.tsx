import { ClipboardList, HardHat, CheckCircle, Key } from 'lucide-react';

const Process = () => {
    const steps = [
        {
            icon: ClipboardList,
            title: "Planning & Design",
            desc: "We begin with comprehensive site analysis, architectural design, and feasibility studies to ensure a solid foundation."
        },
        {
            icon: HardHat,
            title: "Pre-Construction",
            desc: "Detailed scheduling, resource allocation, and regulatory approvals are secured to streamline the execution phase."
        },
        {
            icon: CheckCircle,
            title: "Execution & Quality",
            desc: "Our skilled teams execute the build with rigorous quality controls and safety protocols at every milestone."
        },
        {
            icon: Key,
            title: "Handover",
            desc: "Final inspections, finishing touches, and a seamless handover process ensure the project is ready for occupancy."
        }
    ];

    return (
        <section id="process" className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-2 block">
                        How We Work
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Our Contruction Process
                    </h2>
                    <p className="text-slate-400 text-lg">
                        A systematic approach ensures every project is delivered on time, within budget, and to the highest quality standards.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row justify-between gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-700 z-0"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex-1 group">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-slate-800 border-4 border-slate-700 group-hover:border-amber-500 rounded-full flex items-center justify-center text-white mb-8 transition-colors duration-300 shadow-xl relative">
                                    <step.icon className="h-10 w-10 text-slate-300 group-hover:text-amber-500 transition-colors" />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-4 group-hover:text-amber-400 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed px-4">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
