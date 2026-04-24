import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import axios from 'axios';
import BookingModal from '../components/BookingModal';
import { API_BASE_URL, UPLOADS_BASE_URL } from '../config/api';
import { CircleDot, Shield, Clock, MapPin, Phone, Calendar, Star, ChevronRight, Award, ImageOff } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  is_active: boolean | number;
}

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
}

const Home = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchClinics();
  }, []);

  const fetchServices = async () => {
    const res = await axios.get(`${API_BASE_URL}/services`);
    setServices(res.data.filter((service: Service) => Number(service.is_active) === 1));
  };

  const fetchClinics = async () => {
    const res = await axios.get(`${API_BASE_URL}/clinics`);
    setClinics(res.data);
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Trusted Dental Care Since 2010
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Smile Is Our Priority
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience exceptional dental care with our team of expert dentists. Modern treatments, 
                comfortable environment, and compassionate care for the whole family.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowBooking(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg shadow-blue-200 flex items-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </button>
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-lg font-semibold transition border border-gray-200 flex items-center"
                >
                  Our Services
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">15+</p>
                  <p className="text-gray-500 text-sm">Expert Dentists</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">50k+</p>
                  <p className="text-gray-500 text-sm">Happy Patients</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">2</p>
                  <p className="text-gray-500 text-sm">Clinic Locations</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-8 -left-8 w-72 h-72 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
               <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
                 <CircleDot className="w-20 h-20 mb-6 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Premium Dental Care</h3>
                <p className="opacity-90 mb-6">Advanced treatments with state-of-the-art technology for optimal oral health.</p>
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                  <span className="ml-2 font-semibold">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-2 uppercase tracking-wider">What We Offer</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Dental Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive dental services ranging from routine checkups to advanced cosmetic and restorative treatments.
            </p>
          </div>
          
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map(service => (
                  <div
                    key={service.id}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                  >
                  {/* Service Image */}
                  <div className="relative h-48 bg-gray-100">
                     {service.image ? (
                        <img
                          src={`${UPLOADS_BASE_URL}/services/${service.image}`}
                          alt={service.name}
                          className="w-full h-full object-contain bg-gray-50"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                     ) : null}
                    <div className={`${service.image ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-gray-200`}>
                      <ImageOff className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">₱{service.price}</span>
                    <span className="text-gray-500 flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration} min
                    </span>
                  </div>
                  <button
                    onClick={() => { setSelectedService(service); setShowBooking(true); }}
                    className="w-full bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-800 py-3 rounded-xl font-semibold transition flex items-center justify-center"
                  >
                    Book Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-2 uppercase tracking-wider">Why Choose Us</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Patients Trust Us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Dentists</h3>
              <p className="text-gray-600">Our team consists of board-certified dentists with years of experience in all dental specialties.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Hours</h3>
              <p className="text-gray-600">Extended evening and weekend appointments to accommodate your busy schedule.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Technology</h3>
              <p className="text-gray-600">State-of-the-art dental equipment and digital technology for precise and comfortable treatments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-2 uppercase tracking-wider">Our Locations</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visit Our Clinics</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Convenient locations with simple parking and easy access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {clinics.map(clinic => (
              <div key={clinic.id} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{clinic.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <p className="text-gray-600">{clinic.address}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <p className="text-gray-600">{clinic.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <p className="text-gray-600">{clinic.operating_hours}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBooking(true)}
                  className="text-blue-600 font-semibold hover:text-blue-700 flex items-center"
                >
                  Book at this location
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready For Your Next Visit?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule your appointment today and take the first step towards a healthier, brighter smile.
          </p>
          <button
            onClick={() => setShowBooking(true)}
            className="bg-white hover:bg-gray-50 text-blue-600 px-10 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-xl"
          >
            Book Your Appointment Now
          </button>
        </div>
      </section>

      {showBooking && (
        <BookingModal
          service={selectedService}
          clinics={clinics}
          onClose={() => { setShowBooking(false); setSelectedService(null); }}
          onSuccess={() => { setShowBooking(false); setSelectedService(null); }}
        />
      )}
    </div>
  );
};

export default Home;