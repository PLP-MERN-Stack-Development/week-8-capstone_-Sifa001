import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Phone, Car, Building, AlertCircle, Bus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: 'driver' | 'passenger';
  licenseNumber?: string;
  vehicleRegNumber?: string;
  operatorName?: string;
}

const Register: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterForm>();

  const watchRole = watch('role');
  const watchPassword = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      setLoading(true);
      
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-lg shadow p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Bus className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-theme-text">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-theme-text/80">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-theme-text mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    {...register('role', { required: 'Please select your role' })}
                    type="radio"
                    value="passenger"
                    className="sr-only peer"
                  />
                  <div className="flex items-center justify-center px-4 py-3 border-2 border-theme-border rounded-lg cursor-pointer hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/10 transition-colors">
                    <User className="h-5 w-5 mr-2 text-theme-text/80" />
                    <span className="text-sm font-medium text-theme-text">Passenger</span>
                  </div>
                </label>
                <label className="relative">
                  <input
                    {...register('role', { required: 'Please select your role' })}
                    type="radio"
                    value="driver"
                    className="sr-only peer"
                  />
                  <div className="flex items-center justify-center px-4 py-3 border-2 border-theme-border rounded-lg cursor-pointer hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/10 transition-colors">
                    <Car className="h-5 w-5 mr-2 text-theme-text/80" />
                    <span className="text-sm font-medium text-theme-text">Driver</span>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Basic Information */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-theme-text">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-theme-text/60" />
                </div>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-theme-border rounded-md leading-5 bg-theme-surface text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-theme-text">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-theme-text/60" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="block w-full pl-10 pr-3 py-2 border border-theme-border rounded-md leading-5 bg-theme-surface text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-theme-text">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-theme-text/60" />
                </div>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^(\+254|0)[17]\d{8}$/,
                      message: 'Please enter a valid Kenyan phone number'
                    }
                  })}
                  type="tel"
                  className="block w-full pl-10 pr-3 py-2 border border-theme-border rounded-md leading-5 bg-theme-surface text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="0712345678 or +254712345678"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-theme-text">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-theme-text/60" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type="password"
                  className="block w-full pl-10 pr-3 py-2 border border-theme-border rounded-md leading-5 bg-theme-surface text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-theme-text">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-theme-text/60" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value =>
                      value === watchPassword || 'Passwords do not match'
                  })}
                  type="password"
                  className="block w-full pl-10 pr-3 py-2 border border-theme-border rounded-md leading-5 bg-theme-surface text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Driver-specific fields */}
            {watchRole === 'driver' && (
              <>
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-theme-text">
                    License Number
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-theme-text/60" />
                    </div>
                    <input
                      {...register('licenseNumber', {
                        required: watchRole === 'driver' ? 'License number is required for drivers' : false
                      })}
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-theme-border rounded-md leading-5 bg-theme-surface text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      placeholder="Enter your license number"
                    />
                  </div>
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.licenseNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="vehicleRegNumber" className="block text-sm font-medium text-theme-text">
                    Vehicle Registration Number
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-theme-text/60" />
                    </div>
                    <input
                      {...register('vehicleRegNumber', {
                        required: watchRole === 'driver' ? 'Vehicle registration number is required for drivers' : false
                      })}
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-theme-border rounded-md leading-5 bg-theme-surface text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      placeholder="e.g., KCA 123A"
                    />
                  </div>
                  {errors.vehicleRegNumber && (
                    <p className="mt-1 text-sm text-red-500">{errors.vehicleRegNumber.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="operatorName" className="block text-sm font-medium text-theme-text">
                    Sacco/Operator Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-theme-text/60" />
                    </div>
                    <input
                      {...register('operatorName', {
                        required: watchRole === 'driver' ? 'Operator name is required for drivers' : false
                      })}
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-theme-border rounded-md leading-5 bg-theme-surface text-theme-text placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      placeholder="e.g., Westlands Sacco"
                    />
                  </div>
                  {errors.operatorName && (
                    <p className="mt-1 text-sm text-red-500">{errors.operatorName.message}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;