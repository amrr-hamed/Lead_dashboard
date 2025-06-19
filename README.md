# 🤖 LeadFilter Pro - AI Agent Template

A modular AI Agent Template that automates lead processing workflows using LangGraph, featuring real-time webhook triggers, Google Sheets integration, CRM automation, and intelligent lead classification.

## 🎯 **Project Overview**

LeadFilter Pro is a production-ready AI Agent Template that demonstrates a complete business workflow automation:

- **Trigger**: Real-time webhook events from contact forms
- **Data Collection**: Google Sheets integration for lead enrichment
- **AI Processing**: Intelligent lead classification (Hot/Cold/Spam)
- **CRM Integration**: Automated lead creation and management
- **Notifications**: Email confirmations via Gmail OAuth
- **Monitoring**: Real-time dashboard with processing logs

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Form      │───▶│  Backend API    │───▶│  AI Agent       │
│   (Trigger)     │    │  (FastAPI)      │    │  (LangGraph)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  React Dashboard│    │  Mock CRM       │
                       │  (Monitoring)   │    │  (Integration)  │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 **Live Demo**


- **Dashboard**: [https://lead-dashboard-pmnb.onrender.com/](https://lead-dashboard-pmnb.onrender.com/)  
- **Backend API**: [https://agentic-lead-filter-crm.onrender.com](https://agentic-lead-filter-crm.onrender.com)  
- **Mock CRM**: [https://mock-crm.onrender.com](https://mock-crm.onrender.com)

## 🛠️ **Technology Stack**

### **Backend**
- **Framework**: FastAPI (Python)
- **AI Agent**: LangGraph + LangChain
- **Authentication**: OAuth 2.0 (Google)
- **Database**: SQLite (tokens) + Google Sheets (lead data)
- **Email**: Gmail API (OAuth)

### **Frontend**
- **Framework**: React 18
- **Styling**: TailwindCSS
- **State Management**: React Context
- **HTTP Client**: Axios

### **Deployment**
- **Platform**: Render
- **Services**: 4 separate microservices
- **Environment**: Production-ready

## 📋 **Features**

### **1. Real-time Webhook Triggers**
- Contact form submissions via webhook
- Immediate processing with background tasks
- Event logging and monitoring

### **2. Intelligent Lead Processing**
- **AI Classification**: Hot/Cold/Spam leads
- **Data Enrichment**: Google Sheets integration
- **Confidence Scoring**: ML-based decision making

### **3. CRM Integration**
- Automated lead creation
- Status tracking and updates
- Mock CRM for testing (easily replaceable)

### **4. OAuth 2.0 Authentication**
- Google OAuth for Gmail and Sheets
- Secure token storage and refresh
- Multi-user support ready

### **5. Real-time Dashboard**
- Live processing logs
- Service health monitoring
- Lead status tracking
- Authentication status

## 🔧 **Installation & Setup**

### **Prerequisites**
- Python 3.11+
- Node.js 18+
- Google Cloud Console account
- OpenAI API key

### **Local Development**

1. **Clone the repository**
```bash
git clone <repository-url>
cd leadfilter-pro
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd react/lead-dashboard
npm install
```

4. **Environment Configuration**
```bash
# Create .env file in backend/
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SALES_TEAM_EMAIL=your_email@gmail.com
GOOGLE_SHEET_URL=your_google_sheet_url
MOCK_CRM_URL=http://localhost:8001
```

5. **Start Services**
```bash
# Terminal 1: Backend API
cd backend && python main.py

# Terminal 2: Mock CRM
cd backend && python mock_crm.py

# Terminal 3: React Dashboard
cd react/lead-dashboard && npm start

# Terminal 4: Webhook Form
cd frontend && python -m http.server 8080
```

## 🔐 **OAuth 2.0 Setup**

### **Google Cloud Console**
1. Create a new project
2. Enable Gmail and Google Sheets APIs
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:8000/api/auth/callback`

### **Production Setup**
1. Update redirect URI to: `https://leadfilter-backend.onrender.com/api/auth/callback`
2. Set environment variables in Render dashboard

## 📊 **API Endpoints**

### **Webhook Endpoints**
- `POST /api/webhook` - Receive lead data
- `GET /api/dashboard` - Get processing logs
- `GET /api/leads/{email}` - Get specific lead details

### **Authentication Endpoints**
- `GET /api/auth/check` - Check auth status
- `GET /api/auth/status` - Detailed auth info
- `POST /api/auth/refresh` - Refresh tokens
- `POST /api/auth/disconnect` - Revoke access

### **Health Check Endpoints**
- `GET /health` - Service health
- `GET /readyz` - Readiness check
- `GET /system` - System information

## 🏗️ **Modular Architecture**

### **Agent Workflow (LangGraph)**
```
fetch_lead_data → analyze_lead → push_to_crm → notify_sales_manager → finalize
```

### **Service Modules**
- **`agent/`**: LangGraph workflow and nodes
- **`services/`**: External service integrations
- **`auth/`**: OAuth 2.0 management
- **`api/`**: FastAPI routes and handlers

### **Frontend Components**
- **AuthContext**: OAuth state management
- **Dashboard**: Real-time monitoring
- **ServiceHealth**: Health status display

## 🚀 **Deployment**

### **Render Deployment**
1. Connect GitHub repository to Render
2. Use `render.yaml` for blueprint deployment
3. Set environment variables
4. Deploy all 4 services

### **Environment Variables**
```bash
# Required
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional (for email notifications)
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SALES_TEAM_EMAIL=your_email@gmail.com

# Business Configuration
GOOGLE_SHEET_URL=your_google_sheet_url
```

## 🧪 **Testing**

### **Webhook Testing**
```bash
curl -X POST https://leadfilter-backend.onrender.com/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "lead_email": "test@example.com",
    "lead_name": "Test User",
    "phone": "+1234567890",
    "message": "Interested in your services"
  }'
```

### **Health Checks**
```bash
curl https://leadfilter-backend.onrender.com/health
curl https://leadfilter-backend.onrender.com/api/auth/check
```

## 📈 **Scalability Features**

- **Multi-user Support**: OAuth tokens per user
- **Background Processing**: Async webhook handling
- **Modular Services**: Independent deployment
- **Database Abstraction**: Easy to switch from SQLite to PostgreSQL
- **CRM Agnostic**: Mock CRM easily replaceable with real CRM

## 🔄 **Extensibility**

### **Adding New Triggers**
1. Create new webhook endpoint
2. Add trigger node to LangGraph workflow
3. Update dashboard to display new trigger type

### **Adding New Data Sources**
1. Create new service in `services/` directory
2. Implement data fetching methods
3. Update `fetch_lead_data_node`

### **Adding New CRM Systems**
1. Create new CRM service class
2. Implement lead creation methods
3. Update `push_to_crm_node`

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📄 **License**

MIT License - see LICENSE file for details

## 🆘 **Support**

For issues and questions:
- Create GitHub issue
- Check deployment logs in Render dashboard
- Verify environment variables configuration

---

**Built with ❤️ using LangGraph, FastAPI, and React** 
