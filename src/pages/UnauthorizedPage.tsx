import { Card, Button } from 'antd';
import { ShieldAlert } from 'lucide-react';


export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <Card className="w-full max-w-md rounded-2xl shadow-lg border-0 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert size={40} className="text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this application. Please contact your administrator for access.
        </p>
        
        <Button
          type="primary"
          size="large"
          onClick={() => window.location.href = '/login'}
          className="w-full h-12 rounded-lg font-medium"
          style={{
            background: 'oklch(0.646 0.222 41.116)',
            borderColor: 'oklch(0.646 0.222 41.116)',
          }}
        >
          Back to Login
        </Button>
      </Card>
    </div>
  );
}
