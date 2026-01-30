import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Services from '../components/landing/Services';
import Process from '../components/landing/Process';
import Portfolio from '../components/landing/Portfolio';
import Stats from '../components/landing/Stats';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';

const LandingPage = () => {
    return (
        <div className="font-sans antialiased text-slate-900 bg-white overflow-x-hidden selection:bg-amber-100 selection:text-amber-900">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Services />
                <Process />
                <Portfolio />
                <Stats />
                <Testimonials />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
