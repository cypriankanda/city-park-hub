
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: email input, 2: success message
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    console.log('Password reset requested for:', email);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parking-navy via-blue-800 to-parking-red flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-parking-navy to-parking-red p-3 rounded-2xl">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-parking-navy">
              {step === 1 ? 'Reset Password' : 'Check Your Email'}
            </CardTitle>
            <p className="text-gray-600">
              {step === 1 
                ? 'Enter your email to receive reset instructions'
                : 'We\'ve sent password reset instructions to your email'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-parking-navy"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-parking-red hover:bg-red-700 text-white font-semibold rounded-lg">
                  Send Reset Instructions
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    We've sent password reset instructions to:
                  </p>
                  <p className="font-semibold text-parking-navy">{email}</p>
                  <p className="text-sm text-gray-600">
                    Please check your inbox and click the reset link within 15 minutes.
                  </p>
                </div>
                <Button 
                  onClick={() => setStep(1)} 
                  variant="outline" 
                  className="w-full h-12 border-parking-navy text-parking-navy hover:bg-parking-navy hover:text-white"
                >
                  Send Again
                </Button>
              </div>
            )}

            <div className="text-center">
              <Link 
                to="/login" 
                className="text-sm text-parking-navy hover:text-blue-800 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>

            {step === 1 && (
              <div className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-parking-navy hover:text-blue-800 font-medium">
                  Sign in here
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
