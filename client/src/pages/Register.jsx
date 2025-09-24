import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Password validation checks
  const passwordChecks = {
    minLength: formData.password.length >= 6,
    hasNumber: /\d/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    passwordsMatch: formData.password === formData.confirmPassword && formData.password.length > 0
  }

  const allChecksPass = Object.values(passwordChecks).every(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!allChecksPass) {
      toast.error('Please meet all password requirements')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.register(formData)
      login(response.data.data, response.data.token)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center pt-10">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Create account</h2>
          <p className="mt-2 text-gray-400">Join us today</p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-800/30 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium text-gray-300">Password requirements:</p>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm">
                {passwordChecks.minLength ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <X className="h-4 w-4 text-red-400" />
                )}
                <span className={passwordChecks.minLength ? 'text-green-400' : 'text-gray-400'}>
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                {passwordChecks.hasNumber ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <X className="h-4 w-4 text-red-400" />
                )}
                <span className={passwordChecks.hasNumber ? 'text-green-400' : 'text-gray-400'}>
                  Contains a number
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                {passwordChecks.hasSpecialChar ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <X className="h-4 w-4 text-red-400" />
                )}
                <span className={passwordChecks.hasSpecialChar ? 'text-green-400' : 'text-gray-400'}>
                  Contains a special character
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                {passwordChecks.passwordsMatch ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <X className="h-4 w-4 text-red-400" />
                )}
                <span className={passwordChecks.passwordsMatch ? 'text-green-400' : 'text-gray-400'}>
                  Passwords match
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !allChecksPass}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              'Create account'
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link 
              to="/login" 
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register