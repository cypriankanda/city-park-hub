
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff, Users, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userType: 'user' | 'admin') => {
    setIsLoading(true);
    try {
      if (userType === 'user') {
        await login('demo@parksmart.com', 'demo123', false);
      } else {
        await login('admin@parksmart.com', 'admin123', false);
      }
      navigate(userType === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error('Demo login error:', err);
      alert('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-parking-navy via-blue-800 to-parking-red p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-parking-navy to-parking-red p-3 rounded-2xl">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-parking-navy">Welcome Back</CardTitle>
            <p className="text-gray-600">Sign in to your ParkSmart account</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo Login Buttons */}
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-3">Try Demo Login</p>
              </div>
              <Button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={isLoading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <Users className="h-4 w-4" />
                Demo User Login
              </Button>
              <Button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Demo Admin Login
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 border-gray-300 focus:border-parking-navy"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-parking-navy"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="rounded border-gray-300 text-parking-navy focus:ring-parking-navy"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/reset-password" className="text-sm text-parking-red hover:text-red-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-parking-navy hover:bg-blue-800 text-white font-semibold rounded-lg"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-parking-red hover:text-red-700 font-medium">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
