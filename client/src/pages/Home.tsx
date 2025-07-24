import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Search, ShieldCheck, Star, Users, TrendingUp } from 'lucide-react';


const Home: React.FC = () => {
  return (
    <div className="bg-theme-background text-theme-text transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: 'url("https://images.pexels.com/photos/9966007/pexels-photo-9966007.jpeg")' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20 z-10" aria-hidden="true" />
        {/* Hero content */}
        <div className="relative z-20 w-full max-w-3xl mx-auto p-4 sm:p-8 rounded-2xl shadow-lg bg-white/90 dark:bg-gray-800/90 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
            Smart Matatu Schedules
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 mb-8">
            Experience seamless travel planning with real-time updates, intelligent route suggestions, and reliable departure times.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <Link 
              to="/schedules" 
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow transition w-full sm:w-auto"
            >
              Find Your Route
            </Link>
            <Link 
              to="/routes" 
              className="bg-white dark:bg-gray-700 border border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-300 font-bold px-6 py-3 rounded-lg shadow hover:bg-blue-50 dark:hover:bg-gray-600 transition w-full sm:w-auto"
            >
              Explore All Routes
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-theme-surface-muted/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            <div className="bg-theme-surface p-5 md:p-6 rounded-xl border border-theme-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
              <div className="bg-primary/10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Users className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-theme-text mb-1 md:mb-2">10K+</h3>
              <p className="text-sm md:text-base text-theme-text-muted">Happy Commuters</p>
            </div>
            <div className="bg-theme-surface p-5 md:p-6 rounded-xl border border-theme-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
              <div className="bg-green-500/10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <MapPin className="h-6 w-6 md:h-7 md:w-7 text-green-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-theme-text mb-1 md:mb-2">150+</h3>
              <p className="text-sm md:text-base text-theme-text-muted">Active Routes</p>
            </div>
            <div className="bg-theme-surface p-5 md:p-6 rounded-xl border border-theme-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
              <div className="bg-purple-500/10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Clock className="h-6 w-6 md:h-7 md:w-7 text-purple-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-theme-text mb-1 md:mb-2">24/7</h3>
              <p className="text-sm md:text-base text-theme-text-muted">Real-time Updates</p>
            </div>
            <div className="bg-theme-surface p-5 md:p-6 rounded-xl border border-theme-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
              <div className="bg-yellow-500/10 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Star className="h-6 w-6 md:h-7 md:w-7 text-yellow-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-theme-text mb-1 md:mb-2">4.8</h3>
              <p className="text-sm md:text-base text-theme-text-muted">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-theme-background px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-3">How It Works</h2>
            <p className="text-theme-text-muted text-lg max-w-2xl mx-auto">Get started in just three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group relative bg-theme-surface p-6 md:p-7 rounded-xl border border-theme-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary/90 to-primary-dark/90 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-xl font-semibold text-theme-text mb-3">1. Find Your Route</h3>
                <p className="text-theme-text-muted leading-relaxed text-sm md:text-base">
                  Search for your destination and browse through our comprehensive list of available matatu routes with real-time availability.
                </p>
              </div>
            </div>
            
            <div className="group relative bg-theme-surface p-6 md:p-7 rounded-xl border border-theme-border hover:border-green-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-xl font-semibold text-theme-text mb-3">2. View Schedules</h3>
                <p className="text-theme-text-muted leading-relaxed text-sm md:text-base">
                  Check real-time departure times, estimated arrival times, and live updates for your chosen route.
                </p>
              </div>
            </div>
            
            <div className="group relative bg-theme-surface p-6 md:p-7 rounded-xl border border-theme-border hover:border-purple-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-xl font-semibold text-theme-text mb-3">3. Travel Confidently</h3>
                <p className="text-theme-text-muted leading-relaxed text-sm md:text-base">
                  Head to the stage on time with confidence, knowing your matatu will arrive as scheduled.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Routes Section */}
      <section className="py-20 bg-theme-surface-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-3">Popular Routes</h2>
            <p className="text-theme-text-muted text-lg">Most traveled routes with the best ratings</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Route Card 1 */}
            <div className="group bg-theme-surface border border-theme-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
              <div className="relative overflow-hidden h-56">
                <img 
                  src="https://images.pexels.com/photos/31412564/pexels-photo-31412564.jpeg?auto=compress&w=800" 
                  alt="Aerial View of Nairobi Park with Reflective Lake" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Popular
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-theme-text">CBD → Westlands</h3>
                  <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">4.9</span>
                  </div>
                </div>
                <p className="text-theme-text-muted text-sm mb-4">Express route with minimal stops</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-theme-text-muted mr-1" />
                    <span className="text-sm text-theme-text-muted">15-20 min</span>
                  </div>
                  <span className="text-lg font-bold text-primary">KES 50</span>
                </div>
              </div>
            </div>
            {/* Route Card 2 */}
            <div className="group bg-theme-surface border border-theme-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
              <div className="relative overflow-hidden h-56">
                <img 
                  src="https://images.pexels.com/photos/3794803/pexels-photo-3794803.jpeg?auto=compress&w=800" 
                  alt="Aerial View of City Buildings"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Fast
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-theme-text">CBD → Kasarani</h3>
                  <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">4.7</span>
                  </div>
                </div>
                <p className="text-theme-text-muted text-sm mb-4">Direct route via Thika Road</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-theme-text-muted mr-1" />
                    <span className="text-sm text-theme-text-muted">25-35 min</span>
                  </div>
                  <span className="text-lg font-bold text-primary">KES 80</span>
                </div>
              </div>
            </div>
            {/* Route Card 3 */}
            <div className="group bg-theme-surface border border-theme-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
              <div className="relative overflow-hidden h-56">
                <img 
                  src="https://images.pexels.com/photos/29632598/pexels-photo-29632598.jpeg?auto=compress&w=800" 
                  alt="Aerial View of Urban Landscape in Malindi, Kenya"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-purple-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                  Premium
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-theme-text">CBD → Karen</h3>
                  <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">4.8</span>
                  </div>
                </div>
                <p className="text-theme-text-muted text-sm mb-4">Luxury route with premium service</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-theme-text-muted mr-1" />
                    <span className="text-sm text-theme-text-muted">30-45 min</span>
                  </div>
                  <span className="text-lg font-bold text-primary">KES 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-theme-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-theme-text mb-4">Why Choose Our Platform?</h2>
                <p className="text-theme-text-muted text-lg max-w-2xl mx-auto lg:mx-0">Experience the future of public transportation with our innovative features</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5 p-5 bg-theme-surface rounded-xl border border-theme-border/50 hover:border-primary/30 transition-all duration-300">
                  <div className="bg-green-500/10 p-3 rounded-xl flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-theme-text mb-2">Real-time Updates</h3>
                    <p className="text-theme-text-muted">Get live updates on delays, cancellations, and route changes instantly.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5 p-5 bg-theme-surface rounded-xl border border-theme-border/50 hover:border-blue-400/30 transition-all duration-300">
                  <div className="bg-blue-500/10 p-3 rounded-xl flex-shrink-0">
                    <ShieldCheck className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-theme-text mb-2">Verified Routes</h3>
                    <p className="text-theme-text-muted">All routes are verified and regularly updated by our team.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-5 p-5 bg-theme-surface rounded-xl border border-theme-border/50 hover:border-purple-400/30 transition-all duration-300">
                  <div className="bg-purple-500/10 p-3 rounded-xl flex-shrink-0">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-theme-text mb-2">Community Driven</h3>
                    <p className="text-theme-text-muted">Join thousands of commuters who trust our platform daily.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="relative rounded-xl overflow-hidden shadow-2xl transform group-hover:-translate-y-1 transition-transform duration-500">
                <img 
                  src="https://images.pexels.com/photos/30661414/pexels-photo-30661414.jpeg?auto=compress&w=800" 
                  alt="Colorful Matatu Bus in Nairobi" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto rounded-xl transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-theme-background/70 via-theme-background/20 to-transparent rounded-xl"></div>
              </div>
              <div className="absolute -bottom-5 -left-5 bg-gradient-to-r from-primary to-primary-dark p-5 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <p className="text-white font-bold text-base md:text-lg whitespace-nowrap">Trusted by 10,000+ daily commuters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"></div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Ready to Transform Your Commute?
            </h2>
            <p className="text-theme-text-muted text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of smart commuters who have already discovered the easiest way to plan their daily journeys. 
              Create an account to track your favorite routes or register as a driver to manage your schedules.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 text-white font-bold py-3.5 px-8 md:py-4 md:px-10 rounded-lg text-base md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
              >
                Get Started Free
              </Link>
              <Link 
                to="/routes" 
                className="bg-theme-surface hover:bg-theme-hover text-theme-text font-bold py-3.5 px-8 md:py-4 md:px-10 rounded-lg text-base md:text-lg transition-all duration-200 border border-theme-border shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20"
              >
                Explore All Routes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;