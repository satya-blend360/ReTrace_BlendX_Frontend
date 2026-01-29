import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Spin, Alert } from 'antd';
import { useAuth } from '../contexts/AuthContext';

export default function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);
  const apiBase = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        // Exchange code for token using backend API
        const tokenResponse = await fetch(`${apiBase}/auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Token exchange failed');
        }

        const tokenData = await tokenResponse.json();

        // Store token data
        localStorage.setItem('token_data', JSON.stringify(tokenData));
        localStorage.setItem('access_token', tokenData.access_token);
        if (tokenData.expires_at) {
          localStorage.setItem('token_expires_at', tokenData.expires_at);
        }

        // Fetch user info from backend
        const userResponse = await fetch(`${apiBase}/auth/users/me`, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('user_info', JSON.stringify(userData));
        }

        // Store user info to database and get role
        const userInfoResponse = await fetch(`${apiBase}/warehouse/userinfo`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });

        if (userInfoResponse.ok) {
          const userInfoData = await userInfoResponse.json();

          // Check user role - only ADMIN can access
          if (userInfoData.data?.role !== 'GENERAL') {
            navigate('/unauthorized');
            return;
          }
        }

        login();
        navigate('/');
      } catch (error) {
        console.error('Authentication error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <Card className="w-full max-w-md rounded-2xl shadow-lg border-0 text-center">
        {error ? (
          <Alert
            message="Authentication Error"
            description={error}
            type="error"
            showIcon
          />
        ) : (
          <div>
            <Spin size="large" className="mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Completing Sign In
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your authentication...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}