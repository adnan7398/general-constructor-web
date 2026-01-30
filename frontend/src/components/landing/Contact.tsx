import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { submitQuote } from '../../api/quotes';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        service: 'Residential Construction',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await submitQuote({
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                service: formData.service,
                message: formData.message
            });
            setSuccess(true);
            setFormData({ firstName: '', lastName: '', email: '', service: 'Residential Construction', message: '' });
        } catch (err) {
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" className="py-24 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <div>
                        <span className="text-amber-600 font-bold tracking-widest uppercase text-xs mb-2 block">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                            Start Your Project With Us
                        </h2>
                        <p className="text-slate-600 text-lg mb-12">
                            Ready to bring your vision to life? Contact our team for a consultation. We are committed to turning your concepts into concrete reality.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-sm">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg mb-1">Office Location</h4>
                                    <p className="text-slate-500">4 Sarvapalli, Mall Ave,<br />Lucknow</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-sm">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg mb-1">Phone Number</h4>
                                    <p className="text-slate-500">8737822663</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-sm">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg mb-1">Email Address</h4>
                                    <p className="text-slate-500 break-all">divine.developers002@gmail.com</p>
                                </div>
                            </div>

                            {/* Map Embed */}
                            <div className="rounded-sm overflow-hidden h-48 shadow-md border border-slate-200 mt-4">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.877298275988!2d80.9482879!3d26.8436553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd0815166297%3A0x60846c483984af5!2sMall%20Ave%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1706600000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-slate-50 p-10 rounded-sm border border-slate-100 shadow-lg">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
                        {success ? (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                <strong className="font-bold">Success!</strong>
                                <span className="block sm:inline"> Your message has been sent. We will contact you soon.</span>
                                <button onClick={() => setSuccess(false)} className="mt-2 text-sm underline">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Project Type</label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                    >
                                        <option>Residential Construction</option>
                                        <option>Commercial Complex</option>
                                        <option>Industrial Infrastructure</option>
                                        <option>Renovation / Interior</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                        placeholder="Tell us about your project requirements..."
                                    ></textarea>
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-8 py-4 bg-slate-900 text-white font-bold uppercase tracking-wider hover:bg-amber-600 transition-all rounded-sm flex items-center justify-center gap-2 disabled:bg-slate-400"
                                >
                                    {loading ? 'Sending...' : 'Send Message'} <Send className="h-5 w-5" />
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Contact;
