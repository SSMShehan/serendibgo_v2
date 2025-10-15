import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowRight,
  Play,
  Shield,
  Clock,
  Heart
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Explore Sri Lanka",
      description: "Discover breathtaking destinations across the Pearl of the Indian Ocean"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Booking",
      description: "Book your perfect tour with just a few clicks"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Guides",
      description: "Travel with knowledgeable local guides"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "Your safety and security are our top priorities"
    }
  ]

  const stats = [
    { number: "500+", label: "Tours Available" },
    { number: "10K+", label: "Happy Travelers" },
    { number: "50+", label: "Destinations" },
    { number: "4.9", label: "Average Rating" }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "Amazing experience! The guides were knowledgeable and the scenery was breathtaking. Highly recommended!"
    },
    {
      name: "Ahmed Hassan",
      location: "Dubai, UAE",
      rating: 5,
      text: "SerendibGo made our Sri Lankan adventure unforgettable. Everything was perfectly organized."
    },
    {
      name: "Maria Garcia",
      location: "Madrid, Spain",
      rating: 5,
      text: "The cultural tours were incredible. We learned so much about Sri Lankan history and traditions."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/homepage-background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            <span className="text-white/90">Discover the Magic of</span>
            <br />
            <span className="text-[#E59B2C]">Sri Lanka</span>
          </h1>
          <div className="flex justify-center">
            <Link
              to="/tours"
              className="bg-white text-[#272C2F] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#DFE2E5] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              EXPLORE TOURS
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#DFE2E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#272C2F] mb-2">
                  {stat.number}
                </div>
                <div className="text-[#7B8F9D] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: 'url(/bg1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose SerendibGo?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              We provide exceptional travel experiences with unmatched service and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors duration-200">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Preview */}
      <section className="py-20 bg-[#DFE2E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#272C2F] mb-4">
              Featured Tours
            </h2>
            <p className="text-xl text-[#7B8F9D] max-w-2xl mx-auto">
              Discover our most popular and highly-rated tour experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample Tour Cards */}
            {[1, 2, 3].map((tour) => (
              <div key={tour} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-[#E59B2C]/20 to-[#725241]/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-[#E59B2C]/50" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#272C2F] mb-2">Amazing Tour {tour}</h3>
                  <p className="text-[#7B8F9D] mb-4">
                    Experience the beauty of Sri Lanka with this incredible tour package.
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-[#E59B2C] fill-current" />
                      <span className="text-sm font-medium text-[#272C2F]">4.9</span>
                      <span className="text-sm text-[#7B8F9D]">(128 reviews)</span>
                    </div>
                    <div className="text-lg font-bold text-[#E59B2C]">
                      LKR 25,000
                    </div>
                  </div>
                  <Link to="/tours" className="w-full bg-[#E59B2C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#725241] transition-colors text-center block">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/tours" className="bg-[#E59B2C] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#725241] transition-colors inline-flex items-center">
              View All Tours
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#272C2F] mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-[#7B8F9D] max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#DFE2E5] rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#E59B2C] fill-current" />
                  ))}
                </div>
                <p className="text-[#272C2F] mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#E59B2C]/10 rounded-full flex items-center justify-center mr-3">
                    <Heart className="w-5 h-5 text-[#E59B2C]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#272C2F]">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-[#7B8F9D]">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#E59B2C] to-[#725241]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of travelers who have discovered the magic of Sri Lanka with SerendibGo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-[#272C2F] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#DFE2E5] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Today
            </Link>
            <Link
              to="/tours"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#272C2F] transition-all duration-300"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
