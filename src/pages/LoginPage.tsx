import { useState } from 'react';
import { Button, Card, Alert, Typography } from 'antd';
import { WindowsOutlined } from '@ant-design/icons';
import blendLogo from '../../assets/BlendBlue.png';
import loginBg from '../../assets/login-bg.png'; // add your bg image

const { Title, Paragraph } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setLoginError(null);

    try {
      const authUrl = `${import.meta.env.VITE_MSAD_AUTHORITY}/oauth2/v2.0/authorize
        ?client_id=${import.meta.env.VITE_MSAD_CLIENT_ID}
        &response_type=code
        &redirect_uri=${encodeURIComponent(import.meta.env.VITE_REDIRECT_URL)}
        &scope=User.Read
        &response_mode=query`.replace(/\s/g, '');

      window.location.href = authUrl;
    } catch (error) {
      setLoginError('Failed to initiate login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: `url(${loginBg}) no-repeat`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: '50px',
      }}
    >
      <Card
        style={{
          width: 500,
          textAlign: 'center',
          paddingBottom: '16px',
        }}
      >
        {loginError && (
          <Alert
            message="Login Error"
            description={loginError}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {/* Header */}
        <div
          style={{
            display: 'flex',
            padding: '50px',
            alignItems: 'center',
            paddingBottom: '12px',
            paddingTop: '12px',
            marginBottom: '12px',
          }}
        >
          <div style={{ borderRight: '1px solid gray', paddingRight: '16px' }}>
            <img
              alt="Blend Logo"
              src={blendLogo}
              style={{ width: '200px' }}
            />
          </div>
          <div style={{ marginLeft: '16px', marginTop: '12px' }}>
            <Title level={3} style={{ margin: 0 }}>
              ReTrace
            </Title>
            {/* <Title level={3} style={{ margin: 0 }}>
              Nexus
            </Title> */}
          </div>
        </div>

        {/* Meta */}
        <Title level={4} style={{ marginBottom: '8px' }}>
          Single Sign-On
        </Title>
        <Paragraph style={{ marginBottom: '24px' }}>
          Sign in with your Microsoft account
        </Paragraph>

        {/* Login Button */}
        <Button
          onClick={handleMicrosoftLogin}
          loading={loading}
          style={{ width: '80%', marginBottom: '12px' }}
          type="primary"
        >
          <WindowsOutlined /> SSO Login
        </Button>

        {/* Footer */}
        <div style={{ marginTop: '24px', color: '#898989' }}>
          © Blend360 2026
        </div>
      </Card>
    </div>
  );
}
