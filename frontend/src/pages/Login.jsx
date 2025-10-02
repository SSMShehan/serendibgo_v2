import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await login(data)
      const user = response.data?.user || response.user
      
      // Redirect based on user role
      let redirectPath = '/dashboard'
      
      if (user?.role === 'hotel_owner') {
        redirectPath = '/hotel-owner/dashboard'
      } else if (user?.role === 'admin') {
        redirectPath = '/admin'
      } else if (user?.role === 'guide') {
        redirectPath = '/guide/dashboard'
      } else if (user?.role === 'driver') {
        redirectPath = '/driver/dashboard'
      } else if (user?.role === 'staff') {
        redirectPath = '/staff'
      }
      
      navigate(redirectPath, { replace: true })
    } catch (error) {
      // Error is handled in the auth context
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Signing you in..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-base-content">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Sign in to your SerendibGo account
          </p>
        </div>

        {/* Login Form */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-base-content/50" />
                </div>
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.email.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`input input-bordered w-full pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-base-content/50" />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-base-content/50 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.password.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="label cursor-pointer">
                  <input type="checkbox" className="checkbox checkbox-sm" />
                  <span className="label-text ml-2">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-focus"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider">OR</div>

            {/* Social Login */}
            <div className="space-y-3">
              <button className="btn btn-outline w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-base-content/70">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-focus font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm text-base-content/70 hover:text-primary"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
