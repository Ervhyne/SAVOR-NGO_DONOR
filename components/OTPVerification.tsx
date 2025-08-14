import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import type { AppPage } from '../App';

interface OTPVerificationProps {
  onNavigate: (page: AppPage) => void;
  onVerify: (otp: string) => boolean;
  email?: string;
}

export function OTPVerification({ onNavigate, onVerify, email }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    const success = onVerify(otpCode);
    if (!success) {
      toast.error('Invalid OTP code. Try 123456 for demo.');
    }
    // Navigation is handled by the parent component after successful verification
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    toast.success('OTP code resent successfully');
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('registration')}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Verify Your Account</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle>Enter Verification Code</CardTitle>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit code to {email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'your email'}
            </p>
          </CardHeader>
          <CardContent>
            {/* OTP Input */}
            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button onClick={handleVerify} className="w-full mb-4">
              Verify Account
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              {canResend ? (
                <Button variant="link" onClick={handleResend} className="text-sm">
                  Resend Code
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend code in {countdown}s
                </p>
              )}
            </div>

            {/* Demo Info */}
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-900 mb-2">Demo Mode</h3>
                <p className="text-sm text-blue-800">
                  Use code <span className="font-mono font-bold">123456</span> to verify your account
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
