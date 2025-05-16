import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-bold text-primary-500 relative inline-block">
            Contact Us
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-secondary-500"></span>
          </h2>
          <p className="mt-8 text-lg text-accent-600 max-w-3xl mx-auto">
            Have a project in mind or a question about our services? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-primary-500 text-white rounded-lg shadow-lg p-8 h-full">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-white/10 p-3 rounded-full mr-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Phone</h4>
                    <p className="text-white/80">+91 9795766478</p>
                    <p className="text-white/80">+91 9876543211</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/10 p-3 rounded-full mr-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-white/80">info@divinedeveloper.com</p>
                    <p className="text-white/80">contact@divinedeveloper.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/10 p-3 rounded-full mr-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Location</h4>
                    <p className="text-white/80">123 Construction Avenue</p>
                    <p className="text-white/80">Lucknow , Uttar pradesh 226017</p>
                    <p className="text-white/80">India</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/10 p-3 rounded-full mr-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Business Hours</h4>
                    <p className="text-white/80">Monday - Friday: 9am - 6pm</p>
                    <p className="text-white/80">Saturday: 10am - 4pm</p>
                    <p className="text-white/80">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary-600 mb-6">Send Us a Message</h3>
              
              {submitSuccess ? (
                <div className="bg-success-500/10 text-success-500 p-4 rounded-lg mb-6">
                  <p className="font-medium">Thank you for your message! We'll get back to you shortly.</p>
                </div>
              ) : null}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-accent-700 font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input bg-gray-50 text-accent-700"
                      placeholder="Your Name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-accent-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input bg-gray-50 text-accent-700"
                      placeholder="youremail@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-accent-700 font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input bg-gray-50 text-accent-700"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-accent-700 font-medium mb-2">Service Interested In</label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="input bg-gray-50 text-accent-700"
                    >
                      <option value="">Select a service</option>
                      <option value="residential">Residential Construction</option>
                      <option value="commercial">Commercial Construction</option>
                      <option value="infrastructure">Infrastructure Development</option>
                      <option value="interior">Interior Finishing</option>
                      <option value="renovation">Renovation & Remodeling</option>
                      <option value="maintenance">Maintenance & Repair</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-accent-700 font-medium mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input bg-gray-50 text-accent-700"
                    placeholder="Tell us about your project or inquiry..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary w-full flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Send Message
                      <Send className="w-5 h-5 ml-2" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        
       {/* Map */}
        <div className="mt-16 rounded-lg overflow-hidden shadow-lg h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.758567220707!2d80.94615911452082!3d26.8466939831577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2a3fe89e009%3A0x88217915d804aa5a!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1621849280034!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location - Lucknow"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;