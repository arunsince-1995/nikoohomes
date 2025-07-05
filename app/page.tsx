"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Download, 
  Phone, 
  Mail, 
  Home, 
  Car, 
  Trees, 
  Dumbbell,
  Waves,
  Users,
  Play,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { FeatureSteps } from "@/components/ui/feature-section";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Image from "next/image";
import { motion } from "framer-motion";
import { submitToGoogleSheets, submitToConsole, FormData } from "@/lib/form-handler";

// Animation hook for fade-in/slide-up on scroll
function useScrollFadeIn() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
}

export default function NikooHomesLanding() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'download' | 'explore' | 'sitevisit' | 'whatsapp'>('download');
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [navOpen, setNavOpen] = useState(false);

  // Add a single handler for all CTA buttons
  const handleShowModal = (type: 'download' | 'explore' | 'sitevisit' | 'whatsapp') => {
    setModalType(type);
    setShowModal(true);
  };

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', alt: 'Aerial View', title: 'Aerial View' },
    { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', alt: 'Living Room', title: 'Living Room' },
    { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80', alt: 'Kitchen', title: 'Modern Kitchen' },
    { src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', alt: 'Bedroom', title: 'Master Bedroom' },
    { src: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80', alt: 'Clubhouse', title: 'Clubhouse' },
    { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', alt: 'Pool', title: 'Swimming Pool' }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSubmit: FormData = {
        formType: modalType,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      // Always use Google Sheets for form submissions
      const result = await submitToGoogleSheets(formDataToSubmit);

      if (result.success) {
        // Show thank you popup instead of alert
        const messages = {
          download: 'Thank you! Your brochure download request has been submitted successfully. We\'ll send you the brochure shortly.',
          explore: 'Thank you! Your project exploration request has been submitted successfully. Our team will contact you soon.',
          sitevisit: 'Thank you! Your site visit request has been submitted successfully. We\'ll schedule your visit and contact you shortly.',
          whatsapp: 'Thank you! Your location request has been submitted successfully. We\'ll send you the location details on WhatsApp.',
        };
        setThankYouMessage(messages[modalType] || 'Thank you! Your request has been submitted successfully.');
        setShowThankYou(true);
        setShowModal(false);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [enqRef, enqVisible] = useScrollFadeIn();
  const [overviewRef, overviewVisible] = useScrollFadeIn();
  const [pricingRef, pricingVisible] = useScrollFadeIn();
  const [amenitiesRef, amenitiesVisible] = useScrollFadeIn();
  const [galleryRef, galleryVisible] = useScrollFadeIn();
  const [locationRef, locationVisible] = useScrollFadeIn();
  const [consultRef, consultVisible] = useScrollFadeIn();
  const [faqRef, faqVisible] = useScrollFadeIn();

  // Enable smooth scroll behavior globally
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
    return () => {
      if (typeof window !== "undefined") {
        document.documentElement.style.scrollBehavior = "auto";
      }
    };
  }, []);

  // Section anchor IDs for navigation
  const sectionLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'overview', label: 'Overview' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'location', label: 'Location' },
    { id: 'consult', label: 'Consultation' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Static Top Navbar */}
      <nav className={
        `fixed top-0 left-0 right-0 z-50 mx-auto max-w-5xl mt-2 px-2 ` +
        `sm:bg-white/90 sm:backdrop-blur sm:border-b sm:border-gray-200 sm:shadow-sm sm:rounded-full ` +
        `${navOpen ? '' : 'bg-transparent border-none shadow-none'}`
      }>
        <div className="flex justify-between items-center px-2 py-1">
          <div className="flex-1 flex justify-center items-center whitespace-nowrap gap-1 max-sm:hidden">
            {sectionLinks.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="px-3 py-1 mx-[5px] rounded-full font-medium transition-colors duration-200 text-sm sm:text-base bg-transparent text-gray-700 hover:bg-blue-100"
                style={{ scrollBehavior: 'smooth' }}
                onClick={() => setNavOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
          {/* Hamburger for mobile, right side, no dropdown */}
          <div className="flex-1 flex justify-end sm:hidden">
            <button
              className="flex items-center justify-center p-2 focus:outline-none"
              aria-label="Open menu"
              onClick={() => setNavOpen(true)}
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      {/* Modal Popup for Brochure Download */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 24, duration: 0.8 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md md:max-w-lg relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            {modalType === 'download' && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Download Brochure</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          className="inline-block h-4 w-4 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite] mr-2"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                        Submitting...
                      </>
                    ) : (
                      'Download Now'
                    )}
                  </button>
                </form>
              </>
            )}
            {modalType === 'explore' && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Explore Project Details</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          className="inline-block h-4 w-4 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite] mr-2"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Now'
                    )}
                  </button>
                </form>
              </>
            )}
            {modalType === 'sitevisit' && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Book a Site Visit</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          className="inline-block h-4 w-4 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite] mr-2"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                        Submitting...
                      </>
                    ) : (
                      'Schedule Now'
                    )}
                  </button>
                </form>
              </>
            )}
            {modalType === 'whatsapp' && (
              <>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Get Location on WhatsApp</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="WhatsApp Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div
                          className="inline-block h-4 w-4 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite] mr-2"
                          role="status"
                        >
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                        Submitting...
                      </>
                    ) : (
                      'Get Location'
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Thank You Popup */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md md:max-w-lg relative text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Success!</h2>
              <p className="text-gray-600 leading-relaxed">{thankYouMessage}</p>
            </div>
            <button
              onClick={() => setShowThankYou(false)}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/80 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')"
          }}
        ></div>
        
        <div className="relative z-20 container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Bhartiya City Nikoo Homes
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 font-light">
                  Garden Estate – Urban Living Near Airport NH 44
                </p>
                <div className="text-3xl lg:text-4xl font-bold text-yellow-400">
                  ₹ 50.4 Lakhs - ₹ 2.73 Crores
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: <Home className="w-6 h-6" />, text: "Total Land Parcel: 32 Acres" },
                  { icon: <Home className="w-6 h-6" />, text: "Total Towers: 4" },
                  { icon: <MapPin className="w-6 h-6" />, text: "Prime Location: Sadahalli, Near NH 44" },
                  { icon: <Star className="w-6 h-6" />, text: "By Bhartiya Urban" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-yellow-400">{feature.icon}</div>
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              <button
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
                onClick={() => handleShowModal('download')}
              >
                <Download className="w-5 h-5 inline mr-2 group-hover:animate-bounce" />
                Download Brochure
              </button>
            </div>

            {/* Right Content - Property Card */}
            <div className="lg:justify-self-end">
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img 
                  src="/api/placeholder/500/400" 
                  alt="Property" 
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800">Premium Living Awaits</h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Ready to Move</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Star className="w-5 h-5" />
                    <span className="font-semibold">RERA Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Lead Form */}
        {/* You can add your floating lead form here if needed */}
      </section>

      {/* Horizontal Enquiry Form */}
      <div
        ref={enqRef}
        className={`w-full flex justify-center py-8 transition-all duration-700 ${enqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <EnquiryForm 
          onSuccess={(message: string) => {
            setThankYouMessage(message);
            setShowThankYou(true);
          }}
        />
      </div>

      {/* Project Overview */}
      <section id="overview" ref={overviewRef} className={`py-20 bg-white transition-all duration-700 ${overviewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Project Overview</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover thoughtfully designed homes in a 32-acre integrated township by Bhartiya Urban. 
              Strategically located near Bangalore Airport with superior connectivity and lifestyle amenities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: <Home className="w-8 h-8" />, title: "Integrated Township Living", desc: "Complete ecosystem for modern families" },
              { icon: <Trees className="w-8 h-8" />, title: "Lush Gardens & Open Spaces", desc: "70% green spaces for healthy living" },
              { icon: <Star className="w-8 h-8" />, title: "Smart Architecture", desc: "Thoughtfully designed floor plans" }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl hover:shadow-xl transition-all duration-300">
                <div className="text-blue-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => handleShowModal('explore')}
            >
              Explore Project Details
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing & Floor Plans */}
      <section id="pricing" ref={pricingRef} className={`py-20 bg-gradient-to-br from-gray-50 to-blue-50 transition-all duration-700 ${pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Pricing & Floor Plans</h2>
            <p className="text-xl text-gray-600">Choose from our range of thoughtfully designed homes</p>
          </div>

          {/* Pricing Table */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Configuration</th>
                    <th className="px-6 py-4 text-left font-bold">Carpet Area (approx.)</th>
                    <th className="px-6 py-4 text-left font-bold">Price Starting From</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { config: "Studio", area: "450 sqft", price: "₹48 Lacs*" },
                    { config: "1 BHK", area: "650 sqft", price: "₹65 Lacs*" },
                    { config: "2 BHK", area: "950 sqft", price: "₹95 Lacs*" },
                    { config: "3 BHK", area: "1,350 sqft", price: "₹1.35 Crores*" },
                    { config: "4 BHK", area: "1,800 sqft", price: "₹1.80 Crores*" }
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-6 py-4 font-semibold text-gray-800">{row.config}</td>
                      <td className="px-6 py-4 text-gray-600">{row.area}</td>
                      <td className="px-6 py-4 font-bold text-green-600">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Floor Plan Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {["2 BHK", "3 BHK", "4 BHK"].map((plan, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
                  <Home className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan} Floor Plan</h3>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  onClick={() => handleShowModal('download')}
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Plan
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => handleShowModal('sitevisit')}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Book a Site Visit Now
            </button>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <div id="amenities" className="py-20">
        <StickyScroll
          content={[
            {
              title: "Resort-Style Swimming Pool",
              description:
                "Relax and unwind in our luxurious, temperature-controlled pool with a sun deck and kids' splash area.",
              content: (
                <Image
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  width={320}
                  height={240}
                  className="h-full w-full object-cover"
                  alt="Swimming Pool"
                />
              ),
            },
            {
              title: "Modern Clubhouse",
              description:
                "A vibrant social hub with lounge, café, co-working spaces, and event halls for all occasions.",
              content: (
                <Image
                  src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"
                  width={320}
                  height={240}
                  className="h-full w-full object-cover"
                  alt="Clubhouse"
                />
              ),
            },
            {
              title: "State-of-the-Art Gymnasium",
              description:
                "Stay fit with the latest equipment, personal trainers, and dedicated yoga and aerobics studios.",
              content: (
                <Image
                  src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80"
                  width={320}
                  height={240}
                  className="h-full w-full object-cover"
                  alt="Gymnasium"
                />
              ),
            },
            {
              title: "Lush Green Gardens",
              description:
                "Enjoy 70% open spaces, jogging tracks, themed gardens, and children's play areas.",
              content: (
                <Image
                  src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
                  width={320}
                  height={240}
                  className="h-full w-full object-cover"
                  alt="Gardens"
                />
              ),
            },
            {
              title: "Multipurpose Sports Courts",
              description:
                "Basketball, tennis, badminton, and more for an active lifestyle within the community.",
              content: (
                <Image
                  src="https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80"
                  width={320}
                  height={240}
                  className="h-full w-full object-cover"
                  alt="Sports Courts"
                />
              ),
            },
            {
              title: "Smart Home Features",
              description:
                "Experience convenience and security with smart locks, video door phones, and home automation.",
              content: (
                <Image
                  src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
                  width={320}
                  height={240}
                  className="h-full w-full object-cover"
                  alt="Smart Home"
                />
              ),
            },
          ]}
        />
      </div>

      {/* Project Gallery */}
      <section id="gallery" ref={galleryRef} className={`py-20 bg-gradient-to-br from-gray-900 to-blue-900 transition-all duration-700 ${galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Project Gallery</h2>
            <p className="text-xl text-blue-200">Take a virtual tour of your future home</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={galleryImages[currentImageIndex].src}
                alt={galleryImages[currentImageIndex].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">{galleryImages[currentImageIndex].title}</h3>
              </div>
            </div>

            {/* Navigation */}
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => handleShowModal('download')}
            >
              <Download className="w-5 h-5 inline mr-2" />
              Download Image Pack
            </button>
          </div>
        </div>
      </section>

      {/* Location & Map */}
      <section id="location" ref={locationRef} className={`py-20 bg-white transition-all duration-700 ${locationVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Prime Location</h2>
            <p className="text-xl text-gray-600">Strategic location with excellent connectivity</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Map */}
            <div className="bg-gray-200 rounded-3xl h-96 flex items-center justify-center shadow-xl">
              <div className="text-gray-500 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">Interactive Map</p>
                <p className="text-sm">Google Map integration would be placed here</p>
              </div>
            </div>

            {/* Landmarks */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">Nearby Landmarks</h3>
              {[
                { name: "Kempegowda International Airport", time: "25 mins", icon: <Car className="w-6 h-6" /> },
                { name: "NH 44", time: "2 mins", icon: <MapPin className="w-6 h-6" /> },
                { name: "Top Schools", time: "5-10 km", icon: <Home className="w-6 h-6" /> },
                { name: "Hospitals & Malls", time: "10-15 km", icon: <Star className="w-6 h-6" /> }
              ].map((landmark, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="text-blue-600">{landmark.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{landmark.name}</h4>
                    <p className="text-gray-600">{landmark.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => handleShowModal('whatsapp')}
            >
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Get Location on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Free Consultation */}
      <section id="consult" ref={consultRef} className={`py-20 bg-gradient-to-br from-blue-900 to-purple-900 transition-all duration-700 ${consultVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Free Expert Consultation</h2>
          <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
            Get personalized guidance from our real estate experts. Book your free 1:1 consultation today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => handleShowModal('sitevisit')}
            >
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Talk to Expert Now
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
              onClick={() => handleShowModal('sitevisit')}
            >
              <Phone className="w-5 h-5 inline mr-2" />
              Call Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" ref={faqRef} className={`py-20 bg-gray-50 transition-all duration-700 ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions about Nikoo Homes</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "What is the total project area of Bhartiya City Nikoo Homes?",
                answer: "The project spans across 32 acres with 4 towers, offering integrated township living."
              },
              {
                question: "What are the available configurations?",
                answer: "We offer Studio, 1 BHK, 2 BHK, 3 BHK, and 4 BHK apartments with modern amenities."
              },
              {
                question: "How far is the project from Bangalore Airport?",
                answer: "The project is strategically located just 25 minutes from Kempegowda International Airport."
              },
              {
                question: "What amenities are available?",
                answer: "The project features swimming pool, clubhouse, gymnasium, kids play area, jogging track, and smart home features."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Bhartiya City Nikoo Homes Garden Estate</h3>
          <p className="text-gray-400 mb-6">Urban Living Near Airport NH 44, Bangalore</p>
          <div className="flex justify-center space-x-6">
            <Phone className="w-6 h-6" />
            <Mail className="w-6 h-6" />
            <MessageCircle className="w-6 h-6" />
          </div>
          <p className="text-gray-500 mt-8 text-sm">© 2025 Bhartiya Urban. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile menu overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-[100] bg-white/95 flex flex-col items-center justify-center sm:hidden animate-fade-in">
          <button
            className="absolute top-6 right-6 text-3xl text-gray-700"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          >
            ×
          </button>
          {sectionLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="block w-full text-center px-6 py-4 text-2xl font-bold text-gray-700 hover:bg-gray-100 rounded-xl mb-2"
              style={{ scrollBehavior: 'smooth' }}
              onClick={() => setNavOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// EnquiryForm component
function EnquiryForm({ onSuccess }: { onSuccess: (message: string) => void }) {
  const [enqData, setEnqData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnqData({ ...enqData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSubmit: FormData = {
        formType: 'enquiry',
        name: enqData.name,
        email: enqData.email,
        phone: enqData.phone,
      };

      // Always use Google Sheets for form submissions
      const result = await submitToGoogleSheets(formDataToSubmit);

      if (result.success) {
        // Show thank you popup for enquiry form
        onSuccess('Thank you! Your enquiry has been submitted successfully. Our team will contact you soon.');
        setEnqData({ name: '', email: '', phone: '' });
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 items-center w-full max-w-3xl bg-white rounded-2xl shadow-2xl px-6 py-4 border border-gray-200 hover:shadow-3xl transition-all duration-300"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={enqData.name}
        onChange={handleChange}
        required
        className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-48 bg-gray-50 focus:bg-white transition-all duration-200"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={enqData.email}
        onChange={handleChange}
        required
        className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-56 bg-gray-50 focus:bg-white transition-all duration-200"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={enqData.phone}
        onChange={handleChange}
        required
        className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-40 bg-gray-50 focus:bg-white transition-all duration-200"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 w-full md:w-auto shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <div
              className="inline-block h-4 w-4 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite] mr-2"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            Submitting...
          </>
        ) : (
          'Enquire Now'
        )}
      </button>
    </form>
  );
}
