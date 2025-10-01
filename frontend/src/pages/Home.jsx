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
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-shadow">
            Discover the Magic of{' '}
            <span className="text-accent">Sri Lanka</span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-white/90">
            Experience breathtaking landscapes, rich culture, and unforgettable adventures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/tours"
              className="btn btn-accent btn-lg text-lg px-8 py-3 hover:scale-105 transition-transform duration-200"
            >
              Explore Tours
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button 
              className="btn btn-outline btn-lg text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-gray-900 transition-all duration-200"
              onClick={() => {
                const video = document.querySelector('video');
                if (video) {
                  video.play();
                }
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Play Video
            </button>
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
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-base-content/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Why Choose SerendibGo?
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              We provide exceptional travel experiences with unmatched service and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">
                  {feature.title}
                </h3>
                <p className="text-base-content/70">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Preview */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Featured Tours
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Discover our most popular and highly-rated tour experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample Tour Cards */}
            {[1, 2, 3].map((tour) => (
              <div key={tour} className="card bg-base-100 shadow-lg card-hover">
                <figure className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-primary/50" />
                  </div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title">Amazing Tour {tour}</h3>
                  <p className="text-base-content/70">
                    Experience the beauty of Sri Lanka with this incredible tour package.
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span className="text-sm font-medium">4.9</span>
                      <span className="text-sm text-base-content/70">(128 reviews)</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      $299
                    </div>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <Link to="/tours" className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/tours" className="btn btn-primary btn-lg">
              View All Tours
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-base-content/80 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-base-content">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-base-content/70">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
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
              className="btn btn-accent btn-lg text-lg px-8 py-3"
            >
              Get Started Today
            </Link>
            <Link
              to="/tours"
              className="btn btn-outline btn-lg text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-primary"
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
