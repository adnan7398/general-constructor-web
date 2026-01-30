import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
    const reviews = [
        {
            name: "Rajesh Kumar",
            role: "CEO, TechSpace Solutions",
            content: "Divine Developers managed our commerical complex project with exceptional professionalism. The attention to detail and adherence to timelines were impressive.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Priya Sharma",
            role: "Homeowner",
            content: "Our experience with Divine Developers for our dream villa was seamless. They understood our vision perfectly and executed it with precision. Highly recommended.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "Vikram Malhotra",
            role: "Director, Malhotra Logistics",
            content: "The industrial warehouse they built for us is world-class. Their knowledge of industrial standards and safety protocols gave us immense confidence.",
            image: "https://randomuser.me/api/portraits/men/76.jpg"
        }
    ];

    return (
        <section id="testimonials" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2 block">
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        What Our Clients Say
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-white p-8 rounded-sm shadow-md border border-slate-100 relative">
                            <Quote className="absolute top-8 right-8 text-amber-100 h-10 w-10" />
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                                ))}
                            </div>
                            <p className="text-slate-600 italic mb-8 leading-relaxed">
                                "{review.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={review.image}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
