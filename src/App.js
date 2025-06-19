import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, User, Mail, Calendar, Database, Shield, ShieldCheck, ShieldX, Settings } from 'lucide-react';
import './App.css'; // Assuming your Tailwind CSS is configured via index.css or postcss
import { API_CONFIG, API_KEY } from './config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

// Authentication Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_CONFIG.ENDPOINTS.AUTH.CHECK);
      setAuthStatus(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setAuthStatus({ authenticated: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
      if (response.data.success) {
        await checkAuthStatus();
      }
    } catch (err) {
      console.error('Failed to refresh auth:', err);
    }
  };

  const disconnectAuth = async () => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.DISCONNECT);
      if (response.data.success) {
        setAuthStatus({ authenticated: false });
      }
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    // Periodically check auth status in case backend re-authenticates itself
    const authCheckInterval = setInterval(checkAuthStatus, 300000); // Every 5 minutes
    return () => clearInterval(authCheckInterval);
  }, []);

  return (
    <AuthContext.Provider value={{
      authStatus,
      loading,
      error,
      checkAuthStatus,
      refreshAuth,
      disconnectAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Common UI Components ---

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex items-center space-x-2 p-6 rounded-lg shadow-lg bg-white">
      <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      <span className="text-lg font-semibold text-gray-700">Loading...</span>
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-6 rounded-lg shadow-lg bg-white max-w-md mx-auto">
      <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Try Again
      </button>
    </div>
  </div>
);

// --- Auth Status Component ---

const AuthStatus = () => {
  const { authStatus, refreshAuth, disconnectAuth } = useAuth();

  if (!authStatus) return null;

  const handleLoginClick = () => {
    // Redirect to the backend's Google login endpoint
    window.location.href = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.AUTH.LOGIN;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {authStatus.authenticated ? (
            <ShieldCheck className="w-7 h-7 text-green-600" />
          ) : (
            <ShieldX className="w-7 h-7 text-red-600" />
          )}
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              Authentication Status
            </h3>
            <p className="text-sm text-gray-600">
              {authStatus.authenticated ? 'Connected to Google Services' : 'Not authenticated (Manual setup required)'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {authStatus.authenticated ? (
            <>
              <button
                onClick={refreshAuth}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button
                onClick={disconnectAuth}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="px-5 py-2 text-base bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Authenticate Backend Now
            </button>
          )}
        </div>
      </div>
      {authStatus.user_info && authStatus.authenticated && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-y-2 items-center text-sm text-gray-700">
          <div className="flex items-center space-x-2 mr-4">
            <User className="w-4 h-4 text-gray-500" />
            <span>{authStatus.user_info.name || authStatus.user_info.email || 'N/A'}</span>
          </div>
          {authStatus.user_info.email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{authStatus.user_info.email}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Lead Details Modal/Component ---
const LeadDetails = ({ lead, onClose }) => {
  if (!lead) return null;

  const getLeadTypeColor = (leadType) => {
    switch (leadType) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      case 'spam': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCrmStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XCircle className="w-7 h-7" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Lead Email</p>
            <p className="text-lg font-semibold text-gray-900">{lead.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg text-gray-800">{lead.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Company</p>
            <p className="text-lg text-gray-800">{lead.company || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Message</p>
            <p className="text-lg text-gray-800 whitespace-pre-wrap">{lead.message || 'N/A'}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Lead Type</p>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getLeadTypeColor(lead.lead_type)}`}>
                {lead.lead_type || 'Unknown'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">CRM Status</p>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCrmStatusColor(lead.crm_status)}`}>
                {lead.crm_status || 'Pending'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Timestamp</p>
            <p className="text-lg text-gray-800">{formatTimestamp(lead.timestamp)}</p>
          </div>
          {lead.crm_response && (
            <div>
              <p className="text-sm font-medium text-gray-500">CRM Response</p>
              <pre className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(lead.crm_response, null, 2)}
              </pre>
            </div>
          )}
          {lead.error_message && (
            <div>
              <p className="text-sm font-medium text-gray-500">Error Message</p>
              <p className="text-lg text-red-600">{lead.error_message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Dashboard Component ---

const Dashboard = () => {
  const { authStatus, loading: authLoading, checkAuthStatus } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_CONFIG.ENDPOINTS.DASHBOARD);
      if (response.data.status === 'success') {
        setDashboardData(response.data.data);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadDetails = async (leadEmail) => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.LEADS}/${encodeURIComponent(leadEmail)}`);
      if (response.data.status === 'success') {
        setSelectedLead(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch lead details');
      }
    } catch (err) {
      console.error('Error fetching lead details:', err);
      alert(`Could not fetch lead details: ${err.response?.data?.detail || err.message}`); // Use alert temporarily
    }
  };

  useEffect(() => {
    // Only fetch dashboard data if authenticated
    if (authStatus?.authenticated) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
      return () => clearInterval(interval);
    }
  }, [authStatus?.authenticated]); // Re-fetch when auth status changes

  // Show loading while checking auth
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Show authentication required screen if not authenticated
  if (!authStatus?.authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-8 rounded-xl shadow-lg bg-white max-w-md mx-auto">
          <ShieldX className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            The backend application's connection to Google services is not yet authenticated.
            Please initiate the one-time authentication process.
          </p>
          <button
            onClick={() => window.location.href = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.AUTH.LOGIN}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Authenticate Backend Now
          </button>
          <button
            onClick={checkAuthStatus}
            className="w-full mt-3 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Check Status Again
          </button>
          <p className="text-xs text-gray-500 mt-4">
            (This is a one-time setup. Once authenticated, the backend manages tokens automatically.)
          </p>
        </div>
      </div>
    );
  }

  // Show dashboard loading or error
  if (loading && !dashboardData) {
    return <LoadingSpinner />;
  }

  if (error && !dashboardData) {
    return <ErrorDisplay error={error} onRetry={fetchDashboardData} />;
  }

  // --- Helper functions for rendering ---
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLeadTypeColor = (leadType) => {
    switch (leadType) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      case 'spam': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp; // Fallback if invalid date string
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter antialiased">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Lead Processing Dashboard</h1>
              <p className="text-gray-600 mt-2 text-lg">Monitor incoming leads and processing status</p>
            </div>
            <div className="flex items-center space-x-4">
              {loading && (
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              )}
              <button
                onClick={fetchDashboardData}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center space-x-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        <AuthStatus />

        {dashboardData && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 border border-gray-200">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Database className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Processed</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.stats?.total_processed || 0}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 border border-gray-200">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.stats?.completed || 0}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 border border-gray-200">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-7 h-7 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.stats?.processing || 0}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 border border-gray-200">
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.stats?.failed || 0}</p>
                </div>
              </div>
            </div>

            {/* Service Health Status */}
            <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Backend Service Health</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dashboardData.service_health && Object.entries(dashboardData.service_health).map(([service, status]) => (
                  <div key={service} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200">
                    <span className="font-medium text-gray-900 capitalize text-base">{service.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        status.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        status.status === 'authenticated' ? 'bg-green-100 text-green-800' : // If authenticated is its status, treat as healthy
                        status.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {status.status}
                      </span>
                      {status.error_message && (
                        <AlertCircle className="w-5 h-5 text-red-500" title={status.error_message} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trigger Logs */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent Trigger Logs</h2>
                <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" title="Manage Logs" />
              </div>
              <div className="p-6">
                {dashboardData.trigger_logs && dashboardData.trigger_logs.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.trigger_logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((log, index) => (
                      <div
                        key={log.id || index}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 ease-in-out"
                        onClick={() => log.lead_email && fetchLeadDetails(log.lead_email)}
                      >
                        <div className="flex items-start sm:items-center space-x-4 mb-3 sm:mb-0">
                          {getStatusIcon(log.status)}
                          <div>
                            <p className="font-semibold text-lg text-gray-900">{log.type || 'Webhook Received'}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                              {log.lead_email && (
                                <div className="flex items-center space-x-1">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span>{log.lead_email}</span>
                                </div>
                              )}
                              {log.lead_name && (
                                <div className="flex items-center space-x-1">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span>{log.lead_name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end text-left sm:text-right w-full sm:w-auto">
                          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                            {log.lead_type && (
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getLeadTypeColor(log.lead_type)}`}>
                                {log.lead_type} Lead
                              </span>
                            )}
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              log.crm_status === 'success' ? 'bg-green-100 text-green-800' : 
                              log.crm_status === 'failed' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              CRM: {log.crm_status || 'Pending'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1 sm:mt-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatTimestamp(log.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Database className="w-16 h-16 text-gray-400 mx-auto mb-5" />
                    <p className="text-gray-500 text-lg">No trigger logs available. Start sending leads!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {selectedLead && <LeadDetails lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
};

// --- Main App Component (simplified for Canvas) ---
const App = () => {
  // In a Canvas environment, we generally render one main component
  // instead of using a full routing solution like react-router-dom.
  // The AuthProvider naturally wraps the Dashboard.
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
};

export default App;
