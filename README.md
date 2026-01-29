# BlendX Frontend - Inventory Intelligence Assistant

A modern React + TypeScript application featuring an AI-powered inventory management chatbot with Microsoft AD authentication, real-time analytics, and interactive dashboards.

## 🚀 Features

- **AI-Powered Chat Interface**: Intelligent inventory assistant for stockout analysis and predictions
- **Microsoft AD Authentication**: Secure OAuth 2.0 authentication flow
- **Real-time Analytics Dashboard**: Interactive charts and metrics using Recharts
- **Inventory Management**: Track stockouts, reorder status, and trend analysis
- **Responsive Design**: Built with Tailwind CSS for a modern, responsive UI
- **Type-Safe**: Full TypeScript support throughout the application

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- A **Microsoft Azure AD** application configured
- Access to the **backend API** and **n8n webhook**

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Ant Design** - UI component library
- **Lucide React** - Icon library
- **Recharts** - Charting library
- **Supabase** - Backend integration
- **@n8n/chat** - Chat widget integration

## 📦 Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd BlendX/frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Copy the example environment file and configure it with your credentials:

```bash
cp .env.example .env
```

Then edit the `.env` file with your actual values (see Environment Variables section below).

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.yourdomain.com` |
| `VITE_MSAD_AUTHORITY` | Microsoft AD authority URL | `https://login.microsoftonline.com/your-tenant-id` |
| `VITE_MSAD_CLIENT_ID` | Microsoft AD application client ID | `your-client-id-here` |
| `VITE_REDIRECT_URL` | OAuth redirect URL | `http://localhost:5173/callback` |

See `.env.example` for a complete template.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run typecheck` | Run TypeScript type checking |

## 🏗️ Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   └── Layout.tsx   # Main layout wrapper
│   ├── contexts/        # React contexts
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── lib/             # Utility libraries
│   │   └── database.types.ts  # Supabase type definitions
│   ├── pages/           # Page components
│   │   ├── LoginPage.tsx       # Login with Microsoft AD
│   │   ├── CallbackPage.tsx    # OAuth callback handler
│   │   ├── DashboardPage.tsx   # Analytics dashboard
│   │   ├── Chatpage.tsx        # AI chatbot interface
│   │   ├── EventDetailPage.tsx # Detailed event view
│   │   └── UnauthorizedPage.tsx # 403 error page
│   ├── utils/           # Utility functions
│   │   └── auth.ts      # Authentication helpers
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles and Tailwind imports
├── .env                 # Environment variables (create this)
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.ts       # Vite configuration
└── README.md            # This file
```

## 🔑 Authentication Flow

1. User clicks "Sign in with Microsoft" on the login page
2. Redirects to Microsoft AD OAuth authorization
3. User authenticates with Microsoft credentials
4. Microsoft redirects back to `/callback` with authorization code
5. Frontend exchanges code for access token via backend API
6. User information is stored in localStorage
7. User is redirected to the dashboard

## 💬 Chat Interface

The AI chatbot (`Chatpage.tsx`) provides:

- **Quick Questions**: Pre-configured queries for common inventory tasks
- **Real-time Streaming**: AI responses are streamed word-by-word
- **Loading States**: Multi-stage loading indicators showing AI progress
- **Root Cause Analysis**: Deep-dive into stockout events
- **Trend Analysis**: Historical data and pattern recognition
- **Predictions**: Proactive alerts for potential stockouts

### Chat API Integration

The chat uses a webhook endpoint for AI processing:

```typescript
POST https://n8n.demo.blend360.app/webhook/8287adab-e6d8-40f2-af4e-0cc26b6779b2
{
  "chatInput": "user message",
  "UserEmail": "user@domain.com"
}
```

## 🎨 Customization

### Tailwind CSS

Modify `tailwind.config.js` to customize:
- Color palette
- Font families
- Spacing scale
- Breakpoints
- Custom utilities

### Environment-specific Builds

For different environments (dev, staging, production), create separate `.env` files:

- `.env.development`
- `.env.staging`
- `.env.production`

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Static Hosting

The production build can be deployed to:
- **Vercel** (recommended for Vite apps)
- **Netlify**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**
- **GitHub Pages**

### Docker Deployment

A `Dockerfile` is included in the project. To build and run:

```bash
docker build -t blendx-frontend .
docker run -p 80:80 blendx-frontend
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: `Module not found` errors after installation
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: TypeScript errors in IDE
```bash
# Restart TypeScript server or run type check
npm run typecheck
```

**Issue**: Environment variables not working
- Ensure variables start with `VITE_`
- Restart dev server after changing `.env`
- Check that `.env` file is in the project root

**Issue**: Authentication redirect fails
- Verify `VITE_REDIRECT_URL` matches Azure AD configuration
- Check that the redirect URL is whitelisted in Azure AD app settings

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is proprietary software developed for BlendX.

## 📞 Support

For questions or issues, contact:
- **Email**: support@blend360.com
- **Internal Wiki**: [Link to internal documentation]

---

**Built with ❤️ by the BlendX Team**
