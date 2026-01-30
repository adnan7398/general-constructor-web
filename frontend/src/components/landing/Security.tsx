import { Shield, Lock, Server, FileCheck } from 'lucide-react';

const securityFeatures = [
    {
        icon: Shield,
        title: 'Enterprise-grade Security',
        description: 'AES-256 encryption at rest and TLS 1.3 in transit. Your data is protected by the highest standards.',
    },
    {
        icon: Lock,
        title: 'SSO & 2FA',
        description: 'Seamlessly integrate with your existing identity provider (Okta, Azure AD, Google) for secure access control.',
    },
    {
        icon: Server,
        title: 'Data Sovereignty',
        description: 'Choose where your data is stored with data centers available in the US, EU, Canada, and Australia.',
    },
    {
        icon: FileCheck,
        title: 'Compliance Ready',
        description: 'Built to help you meet regulatory requirements including GDPR, CCPA, and SOC 2 Type II.',
    },
];

const Security = () => {
    return (
        <section id="security" className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-800/20 skew-x-12 transform translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-slate-800/10 -skew-x-12 transform -translate-x-20"></div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Security you can build on
                        </h2>
                        <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                            We know that project data is your most valuable asset. That's why we've built ConstructFlow with a security-first architecture trusted by government agencies and global enterprises.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {securityFeatures.map((feature, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-primary-400">
                                            <feature.icon size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white rounded-xl p-8 shadow-2xl">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Badges Mockup */}
                                <div className="border border-slate-100 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                                    <div className="text-2xl font-bold text-slate-800 font-serif mb-2">SOC 2</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Type II Certified</div>
                                </div>
                                <div className="border border-slate-100 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                                    <div className="text-2xl font-bold text-slate-800 font-serif mb-2">ISO</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">27001 Certified</div>
                                </div>
                                <div className="border border-slate-100 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                                    <div className="text-2xl font-bold text-slate-800 font-serif mb-2">GDPR</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Compliant</div>
                                </div>
                                <div className="border border-slate-100 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                                    <div className="text-2xl font-bold text-slate-800 font-serif mb-2">FedRAMP</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ready</div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <a href="#" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                                    View our Trust Center
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Security;
