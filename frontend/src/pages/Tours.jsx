import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Users, Star, ArrowRight } from 'lucide-react'

const Tours = () => {
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Discover Amazing Tours
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Explore the beauty of Sri Lanka with our carefully curated tour experiences
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card bg-base-200 shadow-lg mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search tours..."
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select className="select select-bordered">
                  <option>All Categories</option>
                  <option>Adventure</option>
                  <option>Cultural</option>
                  <option>Nature</option>
                  <option>Beach</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Duration</span>
                </label>
                <select className="select select-bordered">
                  <option>Any Duration</option>
                  <option>1 Day</option>
                  <option>2-3 Days</option>
                  <option>4-7 Days</option>
                  <option>1+ Weeks</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price Range</span>
                </label>
                <select className="select select-bordered">
                  <option>Any Price</option>
                  <option>Under $100</option>
                  <option>$100 - $300</option>
                  <option>$300 - $500</option>
                  <option>$500+</option>
                </select>
              </div>
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">
                Search Tours
              </button>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Sample Tour Cards */}
          {[1, 2, 3, 4, 5, 6].map((tour) => (
            <div key={tour} className="card bg-base-100 shadow-lg card-hover">
              <figure className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-primary/50" />
                </div>
              </figure>
              <div className="card-body">
                <h2 className="card-title">Amazing Tour {tour}</h2>
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
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1 text-sm text-base-content/70">
                    <Calendar className="w-4 h-4" />
                    <span>3 Days</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-base-content/70">
                    <Users className="w-4 h-4" />
                    <span>Max 12</span>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link to={`/tours/${tour}`} className="btn btn-primary btn-sm">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn btn-outline btn-lg">
            Load More Tours
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tours
