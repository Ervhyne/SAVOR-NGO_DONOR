import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">🍃</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SAVOR</h1>
          <p className="text-green-100 text-lg">Share food, spread hope</p>
        </div>

        {/* Loading Animation */}
        {isLoading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        ) : (
          <button 
            onClick={() => onComplete && onComplete()}
            className="px-6 py-3 bg-white text-green-600 rounded-full font-medium hover:bg-green-50 transition-colors"
          >
            Get Started
          </button>
        )}

        {/* Tagline */}
        <div className="mt-16">
          <p className="text-green-100 text-sm">Connecting donors with NGOs</p>
          <p className="text-green-200 text-xs mt-1">Reducing food waste, fighting hunger</p>
        </div>
      </div>
    </div>
  );
}
