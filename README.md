# Lead Dashboard - React Frontend

A React-based dashboard for monitoring lead processing with integrated OAuth authentication.

## Features

- **Real-time Dashboard**: Monitor lead processing status and statistics
- **OAuth Integration**: Automatic Google OAuth authentication via backend
- **Service Health Monitoring**: Check status of all backend services (including CRM)
- **Lead Management**: View and manage incoming leads
- **Responsive Design**: Works on desktop and mobile devices

## Authentication

This frontend integrates with the backend's automatic OAuth system:

- **Auto-authentication**: Backend handles OAuth automatically on startup
- **Status Checking**: Frontend checks authentication status on load
- **Token Management**: Refresh and disconnect functionality
- **User Info Display**: Shows authenticated user details

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Backend server deployed and accessible (e.g., on Render)
- Backend OAuth system configured
- (Optional) Mock CRM deployed and accessible (e.g., on Render)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Create a `.env` file in the root directory of the React app (e.g., `react/lead-dashboard/`):
     ```env
     REACT_APP_API_BASE=https://your-backend.onrender.com/api
     REACT_APP_API_KEY=your-api-key-here
     ```
   - Replace with your actual backend URL and API key (do not commit sensitive data).

3. Start the development server:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

4. **Build for production** (before deploying to a static host):
   ```bash
   npm run build
   ```
   Deploy the contents of the `build/` folder to your static hosting provider (Render Static Site, Vercel, Netlify, etc.).

### Backend & CRM Integration

- The frontend expects the following backend endpoints:
  - `/api/auth/check`, `/api/auth/refresh`, `/api/auth/disconnect`, `/api/auth/status`, `/api/auth/health`
  - `/api/dashboard` (dashboard data)
  - `/api/leads/{email}` (lead details)
- The backend should be configured to communicate with a public CRM endpoint (e.g., deployed mock CRM).
- The React dashboard displays service health as reported by the backend.

## Usage

1. **Start the Backend**: Ensure your backend is running and accessible.
2. **(Optional) Start the Mock CRM**: If using a mock CRM, ensure it is deployed and the backend is configured to use its public URL.
3. **Open the Frontend**: Navigate to your deployed React app or `http://localhost:3000` for local development.
4. **Authentication**: The app will automatically check authentication status.
5. **Dashboard**: View lead processing statistics and logs.
6. **Manage Auth**: Use the authentication panel to refresh or disconnect.

## Deployment

- **Build the app**: `npm run build`
- **Deploy the `build/` folder** to your static host (Render, Vercel, Netlify, etc.)
- **Set environment variables** in your host's dashboard if supported (for API base URL and API key)

## Troubleshooting

- **CORS Issues**: Ensure your backend allows requests from your frontend's domain.
- **API Errors**: Check browser dev tools (Network tab) for failed requests and error messages.
- **Service Health**: If CRM or other services show as unhealthy, verify backend configuration and service URLs.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Dependencies

- **React** - UI framework
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
