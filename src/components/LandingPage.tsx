
import { Car, Clock, Shield, Smartphone, MapPin, CreditCard, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Real-Time Availability",
      description: "Find available parking spots instantly with live updates across the city."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Reserve in Advance",
      description: "Book your parking spot ahead of time and never worry about finding space."
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Cashless Payments",
      description: "Secure digital payments with multiple payment options for your convenience."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Optimized",
      description: "Easy-to-use interface designed for seamless mobile experience."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Safe",
      description: "Your data and payments are protected with enterprise-grade security."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you whenever needed."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "1,200+", label: "Parking Spots" },
    { number: "15+", label: "City Locations" },
    { number: "99.9%", label: "Uptime" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Executive",
      content: "ParkSmart has completely transformed my daily commute. No more circling blocks looking for parking!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Delivery Driver",
      content: "As a delivery driver, finding quick parking is crucial. This app saves me hours every day.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Tourist",
      content: "Visiting Nairobi was stress-free thanks to ParkSmart. Found parking near all major attractions easily.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-parking-navy via-blue-800 to-parking-red min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-slide-in-left">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Smart Parking
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  Made Simple
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
                Find, reserve, and pay for parking spots in Nairobi with just a few taps. 
                Join thousands of drivers who've already made parking hassle-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-parking-red hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-parking-navy px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:flex justify-center animate-slide-in-right">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl flex items-center justify-center animate-scale-in">
                  <Car className="h-32 w-32 lg:h-40 lg:w-40 text-white animate-pulse" />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-parking-red rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-white font-bold text-sm">LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl lg:text-5xl font-bold text-parking-navy mb-2">{stat.number}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-parking-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold text-parking-navy mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to hassle-free parking in Nairobi
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Find Parking",
                description: "Use our app to locate available parking spots near your destination in real-time."
              },
              {
                step: "02", 
                title: "Reserve Your Spot",
                description: "Book your preferred parking spot instantly and get turn-by-turn directions."
              },
              {
                step: "03",
                title: "Park & Pay",
                description: "Arrive at your reserved spot and pay securely through the app. It's that simple!"
              }
            ].map((step, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-20 h-20 bg-gradient-to-r from-parking-navy to-parking-red rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-parking-navy mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold text-parking-navy mb-6">Why Choose ParkSmart?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the features that make parking in Nairobi effortless and efficient
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in border-0 shadow-md" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-parking-navy to-parking-red rounded-lg flex items-center justify-center text-white mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-parking-navy mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-parking-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-bold text-parking-navy mb-6">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real feedback from drivers across Nairobi
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="animate-fade-in hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-parking-navy">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-parking-navy to-parking-red py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Parking Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of satisfied drivers in Nairobi. Start parking smarter today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-parking-navy hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-parking-navy px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                Sign In Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-parking-navy to-parking-red p-2 rounded-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">ParkSmart</span>
              </div>
              <p className="text-gray-400">
                Making urban parking simple, smart, and stress-free for everyone in Nairobi.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 hello@parksmart.co.ke</p>
                <p>📱 +254 700 000 000</p>
                <p>📍 Nairobi, Kenya</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ParkSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
