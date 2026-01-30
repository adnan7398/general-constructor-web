import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="bg-primary-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
                        Ready to build smarter?
                    </h2>
                    <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto relative z-10">
                        Join over 5,000 leading construction firms managing $50B+ in volume on ConstructFlow.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <Link
                            to="/demo"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all transform hover:-translate-y-1"
                        >
                            Schedule a Demo
                        </Link>
                        <Link
                            to="/pricing"
                            className="w-full sm:w-auto px-8 py-4 bg-primary-700 text-white font-bold rounded-xl border border-primary-500 hover:bg-primary-800 transition-all flex items-center justify-center gap-2"
                        >
                            View Pricing
                            <ArrowRight size={18} />
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-primary-200 opacity-80">
                        No credit card required for trial. Setup takes less than 5 minutes.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
