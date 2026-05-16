# 🧾 Billify - Premium Invoicing for Freelancers

> **Polished invoicing for independent professionals.** Clear invoicing that keeps payments, clients, and GST organized with a beautiful, responsive dashboard.

![Billify](https://img.shields.io/badge/Billify-v1.0-b7ff3c?style=flat-square&labelColor=0a0f14)
![React](https://img.shields.io/badge/React-19.2.5-61dafb?style=flat-square&labelColor=0a0f14)
![Node.js](https://img.shields.io/badge/Node.js-Express-68a063?style=flat-square&labelColor=0a0f14)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-13aa52?style=flat-square&labelColor=0a0f14)

---

## ✨ Key Features

### 🔐 **Authentication & Account Management**
- 🔑 **JWT-based authentication** with secure login & registration
- 👤 **Complete profile management** - name, email, phone, GSTIN, address, bank details
- 🏢 **Brand customization** - Upload and store your company logo via ImageKit
- 💳 **Banking details** - Store account info, IFSC, bank name, and UPI ID
- 🔒 **Protected routes** - Authenticated API endpoints & frontend route guards

### 👥 **Smart Client Management**
- ➕ **Create clients** with complete contact & GST information
- 📋 **Centralized directory** - View and manage all your clients in one place
- ✏️ **Edit client details** - Keep information up-to-date
- 🗑️ **Delete clients** - Remove clients when no longer needed
- 🔍 **Quick search** - Find clients by name, email, or GST number

### 📄 **Advanced Invoicing**
- 🎯 **Auto-numbered invoices** in clean `BILL-0001` format
- ➕ **Dynamic line items** - Add multiple items per invoice with descriptions and amounts
- 🧮 **Automatic GST calculations** - Subtotal, tax amount, and total computed automatically
- 📊 **Status tracking** - Invoices marked as `paid`, `unpaid`, or `overdue`
- ⚡ **Smart status updates** - Auto-transition to `overdue` based on due date
- 🔎 **Advanced search** - Filter by invoice number, client name, email, or date range
- ✅ **Mark as paid** - Quick payment status updates
- 🗑️ **Delete invoices** - Remove unwanted records

### 📈 **Rich Dashboard Analytics**
- 💰 **Revenue overview** - Total, paid, unpaid, and overdue amounts at a glance
- 📅 **Month-wise analytics** - Revenue for selected month with breakdown
- 📊 **Day-wise trend charts** - Visual representation of daily revenue patterns
- 📉 **6-month trend analysis** - Long-term revenue tracking and forecasting
- 🎯 **Payment split visualization** - Paid vs unpaid/overdue comparison
- 🔝 **Key metrics** - Peak day, average invoice value, collection rate, open rate
- 📱 **Responsive charts** - Beautiful Recharts integration for data visualization

### 📥 **PDF & Email Features**
- 🎨 **Brand-ready PDFs** - Your logo, colors, and details on every invoice
- 💾 **Download PDFs** - Save invoices locally or share with clients
- 📧 **Email invoices** - Send PDFs directly to clients via SMTP
- 🔐 **Secure links** - Optional shareable portal links for clients
- 🎁 **QR codes** - Generate UPI payment QR codes for easy mobile payments
- 📦 **Batch operations** - Email multiple invoices efficiently

### 🤖 **AI-Powered Features** (via Groq API)
- 💬 **Smart payment reminders** - AI generates personalized reminder messages
- 🎭 **Tone control** - Choose between `friendly`, `professional`, or `strict` tones
- 👁️ **Preview & edit** - Review AI-generated content before sending
- 🚀 **One-click send** - Send reminders immediately or save for later
- 💡 **Context-aware** - Reminders reference specific invoice details

### 🌐 **Client Portal**
- 🔗 **Shareable links** - Send secure portal links to view invoices
- 👁️ **Invoice viewing** - Clients can view invoice details and payment status
- ✅ **Invoice acknowledgment** - Clients can confirm receipt
- 💳 **UPI payment QR** - Generate QR codes for easy mobile payments
- 🔐 **Token-based access** - Secure, time-limited access

### 🎨 **Beautiful UI/UX**
- 🌙 **Dark theme optimized** - Premium dark UI with neon accent colors
- ✨ **Smooth animations** - Framer-inspired transitions and interactions
- 📱 **Fully responsive** - Works perfectly on mobile, tablet, and desktop
- ♿ **Accessibility** - ARIA labels, keyboard navigation, semantic HTML
- 🎭 **Loading states** - Spinners and skeletons for smooth UX
- 🔔 **Toast notifications** - Real-time feedback with React Hot Toast

---

## 🛠️ Tech Stack

### **Frontend** ⚡
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.5 | UI library with hooks |
| **Vite** | 8.0.9 | Lightning-fast build tool |
| **Tailwind CSS** | 4.2.4 | Utility-first CSS framework |
| **React Router** | 6.30.1 | Client-side routing |
| **React Hook Form** | 7.56.4 | Efficient form handling |
| **Axios** | 1.8.2 | HTTP client |
| **Recharts** | 2.15.1 | React chart library |
| **React Icons** | 5.5.0 | Icon library |
| **React Hot Toast** | 2.5.2 | Toast notifications |

### **Backend** 🔧
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Runtime environment |
| **Express.js** | 4.21.1 | Web framework |
| **MongoDB** | Cloud | NoSQL database |
| **Mongoose** | 8.8.1 | MongoDB ODM |
| **JWT** | 9.0.2 | Authentication tokens |
| **Bcryptjs** | 2.4.3 | Password hashing |
| **Multer** | 1.4.5 | File upload handling |
| **ImageKit** | 1.3.6 | Remote image storage |
| **PDFKit** | 0.15.0 | PDF generation |
| **QRCode** | 1.5.4 | QR code generation |
| **Nodemailer** | Built-in | Email delivery |
| **Groq** | API | AI reminder generation |
| **CORS** | 2.8.5 | Cross-origin requests |
| **Dotenv** | 16.4.5 | Environment variables |

### **External Services**
- 🗄️ **MongoDB Atlas** - Cloud database hosting
- 📧 **Resend/SMTP** - Email delivery service
- 🤖 **Groq API** - LLaMA AI for reminder generation
- 📁 **ImageKit** - Cloud image storage & optimization
- 🔐 **JWT** - Secure authentication tokens

---

## 📊 Application Flow

### **User Journey**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Landing Page  ──→  Register/Login  ──→  Dashboard         │
│       (Public)         (Auth)            (Protected)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│  Dashboard Hub (Overview & Analytics)                       │
│  ├─ Revenue metrics & trends                               │
│  ├─ Quick invoice creation                                 │
│  ├─ Payment status overview                                │
│  └─ Navigation to all features                             │
└─────────────────────────────────────────────────────────────┘
        ├─────────────────┬──────────────────┬────────────────┐
        ↓                 ↓                  ↓                ↓
   ┌─────────┐      ┌──────────┐      ┌──────────┐      ┌─────────┐
   │ Clients │      │ Invoices │      │ Settings │      │ New     │
   ├─────────┤      ├──────────┤      ├──────────┤      │ Invoice │
   │ • Create│      │ • Create │      │ • Update │      ├─────────┤
   │ • View  │      │ • Search │      │ • Upload │      │ 1. Add  │
   │ • Edit  │      │ • Filter │      │   Logo   │      │    Items│
   │ • Delete│      │ • View   │      │ • Add    │      │ 2. Set  │
   │         │      │ • Download       │   Bank   │      │    Due  │
   │         │      │   PDFs   │      │   Details│      │    Date │
   │         │      │ • Email  │      │ • Change │      │ 3. Save │
   │         │      │ • Mark   │      │   Profile│      │ 4. Send │
   │         │      │   Paid   │      │          │      │    PDF  │
   └─────────┘      └──────────┘      └──────────┘      └─────────┘
        ↓                 ↓                                  ↓
    Client Data    Payment Reminders              Invoice Portal
    Directory      (AI-Generated)                  (Client View)
```

### **Invoice Creation Flow**

```
New Invoice Page
    ↓
1️⃣  Select Client
    ↓
2️⃣  Add Line Items (Item, Description, Rate, Qty)
    ↓
3️⃣  Auto-Calculate GST (5%, 12%, 18%)
    ↓
4️⃣  Set Invoice Due Date
    ↓
5️⃣  Preview with GST breakdown
    ↓
6️⃣  Save Invoice (Auto-numbered: BILL-0001)
    ↓
7️⃣  Options:
    ├─ 📥 Download PDF
    ├─ 📧 Email to Client
    ├─ 🔗 Share Portal Link
    └─ ⏰ Set Payment Reminder (AI-Generated)
```

### **Backend API Flow**

```
Frontend Request → Express Middleware Chain
    ↓
├─ CORS Check
├─ JSON Parser
├─ Auth Middleware (if protected)
│   └─ Verify JWT Token
└─ Route Handler
    ↓
    ├─ Validate Request
    ├─ MongoDB Query/Write
    ├─ File Processing (if needed)
    │   └─ PDFKit / ImageKit Upload
    ├─ Email/Notification (if needed)
    │   └─ Nodemailer / Groq API
    └─ Return JSON Response
        ↓
Frontend Updates UI with Response
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 16+ and npm/yarn
- MongoDB Atlas account
- Groq API key
- SMTP credentials (Gmail, Resend, etc.)
- ImageKit account (for logo storage)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/billify.git
cd billify
```

2. **Setup Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev  # Starts on port 3002
```

3. **Setup Frontend**
```bash
cd ../client
npm install
npm run dev  # Starts on port 5173
```

4. **Access the app**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3002/api`
- Health check: `http://localhost:3002/api/health`

---

## 📋 API Endpoints

### **Authentication** 🔐
```http
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/me                # Get current user
PUT    /api/auth/profile           # Update profile
POST   /api/auth/profile/logo      # Upload company logo
```

### **Clients** 👥
```http
POST   /api/clients                # Create new client
GET    /api/clients                # List all clients
PUT    /api/clients/:id            # Update client
DELETE /api/clients/:id            # Delete client
```

### **Invoices** 📄
```http
POST   /api/invoices               # Create invoice
GET    /api/invoices               # List invoices (filter by status)
GET    /api/invoices/:id           # Get invoice details
DELETE /api/invoices/:id           # Delete invoice
PATCH  /api/invoices/:id/mark-paid # Mark as paid
GET    /api/invoices/stats         # Dashboard analytics
```

### **PDF & Email** 📧
```http
GET    /api/pdf/:id                # Download invoice PDF
POST   /api/email/:id              # Email invoice to client
```

### **AI Reminders** 🤖
```http
POST   /api/ai/reminder/:invoiceId # Generate & send AI reminder
```

### **Client Portal** 🌐
```http
GET    /api/portal/:token          # View invoice (public link)
POST   /api/portal/:token/acknowledge    # Client acknowledges
GET    /api/portal/:token/upi-qr   # Get UPI payment QR code
```

### **Health** 💚
```http
GET    /api/health                 # Server health check
```

---

## 🌍 Environment Variables

### **Backend (.env)**
```env
# Server
PORT=3002
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/billify

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Email (SMTP)
EMAIL_FROM=noreply@billify.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# AI (Groq)
GROQ_API_KEY=gsk_xxxxx
GROQ_MODEL=llama-3.1-8b-instant

# Image Storage (ImageKit)
IMAGEKIT_ID=your_imagekit_id
IMAGEKIT_API_KEY=your_imagekit_api_key
IMAGEKIT_API_SECRET=your_imagekit_api_secret
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_account
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:3002
VITE_SERVER_URL=http://localhost:3002
```

---

## 📱 Pages & Routes

| Page | Route | Protected | Description |
|------|-------|-----------|-------------|
| Landing | `/` | ❌ | Marketing page |
| Login | `/login` | ❌ | User login |
| Register | `/register` | ❌ | User registration |
| Dashboard | `/dashboard` | ✅ | Analytics & overview |
| Clients | `/clients` | ✅ | Client management |
| New Invoice | `/invoices/new` | ✅ | Create invoice |
| Invoices | `/invoices` | ✅ | View & manage invoices |
| Invoice Details | `/invoices/:id` | ✅ | Invoice details |
| Settings | `/settings` | ✅ | Profile & preferences |
| Portal | `/portal/:token` | ❌ | Client invoice view |

---

## 🎨 Design Features

### **Color Palette**
- 🎨 **Dark Theme**: `#0a0f14` (background), `#e7eefc` (text)
- ✨ **Accent Green**: `#b7ff3c` (primary), `#9bff12` (bright)
- ⚠️ **Danger Red**: `#ff5d5d` (errors)
- 🌫️ **Muted**: `#93a0b8` (secondary text)

### **Animations**
- ✨ **Fade-in** - Elements reveal on mount
- 🎭 **Hover effects** - Interactive buttons & cards
- 🌊 **Wave animations** - Background orbs
- 📊 **Chart animations** - Smooth data visualizations
- 🔄 **Loading spinners** - Smooth rotation

### **Responsive Design**
- 📱 **Mobile**: Touch-friendly, single column
- 📱 **Tablet**: 2-3 column grid
- 🖥️ **Desktop**: Full feature set with sidebars

---

## 📦 Project Structure

```
billify/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── InvoiceTable.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ClientCard.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── LoadingState.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── NewInvoice.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── InvoiceDetails.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Portal.jsx
│   │   ├── context/           # React context
│   │   │   ├── AuthContext.jsx
│   │   │   └── useAuth.js
│   │   ├── api/               # API calls
│   │   │   ├── axios.js       # Axios instance
│   │   │   ├── authApi.js
│   │   │   ├── clientApi.js
│   │   │   ├── invoiceApi.js
│   │   │   └── aiApi.js
│   │   ├── utils/             # Utilities
│   │   │   ├── formatDate.js
│   │   │   ├── formatCurrency.js
│   │   │   ├── gstHelpers.js
│   │   │   └── usePageTitle.js
│   │   ├── index.css          # Tailwind styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── invoiceController.js
│   │   ├── pdfController.js
│   │   ├── emailController.js
│   │   ├── aiController.js
│   │   └── portalController.js
│   ├── models/                # MongoDB schemas
│   │   ├── User.js
│   │   ├── Client.js
│   │   └── Invoice.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── clients.js
│   │   ├── invoices.js
│   │   ├── pdf.js
│   │   ├── email.js
│   │   ├── ai.js
│   │   └── portal.js
│   ├── middleware/            # Express middleware
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── config/                # Configuration
│   │   └── db.js
│   ├── utils/                 # Utilities
│   │   ├── generatePDF.js
│   │   ├── sendEmail.js
│   │   └── groq.js
│   ├── uploads/               # Temp file storage
│   ├── server.js              # Entry point
│   └── package.json
│
├── README.md
├── .env.example
└── .gitignore
```

---

## 🔐 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - Bcryptjs with salt rounds  
✅ **CORS Protection** - Whitelist allowed origins  
✅ **Protected Routes** - Middleware auth checks  
✅ **Secure Tokens** - Limited expiry times  
✅ **Environment Variables** - No hardcoded secrets  
✅ **Multer File Validation** - Image-only uploads  
✅ **Input Validation** - Mongoose schema validation  

---

## 🎯 Key Highlights

### **For Freelancers** 🎨
- ⚡ **Quick invoicing** - Create invoices in 2 minutes
- 🎯 **GST compliant** - Automatic tax calculations
- 📊 **Financial insights** - Real-time revenue tracking
- 💳 **Payment reminders** - Never miss a payment
- 📱 **Mobile-friendly** - Invoice on the go

### **For Agencies** 🏢
- 👥 **Client management** - Centralized directory
- 📧 **Bulk operations** - Send multiple invoices
- 📈 **Analytics dashboard** - Revenue forecasting
- 🎨 **Branded invoices** - Your logo & colors
- 🤖 **AI automation** - Smart reminders

### **Developer Features** 👨‍💻
- 🏗️ **Clean architecture** - Modular, scalable code
- 📚 **Well-documented** - Clear API documentation
- 🧪 **Production-ready** - Error handling & logging
- ⚡ **Fast performance** - Optimized queries & caching
- 🔄 **Easy deployment** - Docker-ready structure

---

## 📞 Support & Contribution

For issues, feature requests, or contributions, please open an issue or pull request on GitHub.

---

## 📜 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Built with ❤️ for Indian Freelancers**

🌟 If you find this helpful, please give it a star!

import { generateReminder } from "./api/aiApi";
import { sendInvoiceEmail } from "./api/invoiceApi";

const ExampleAIUsage = ({ invoiceId }) => {
	const [draft, setDraft] = useState("");

	const loadReminder = async () => {
		const { data } = await generateReminder(invoiceId, { tone: "professional" });
		setDraft(data.data.reminder);
	};

	const sendReminder = async () => {
		await sendInvoiceEmail(invoiceId, {
			subject: "Payment reminder",
			message: draft,
			includePdf: false,
		});
	};

	return null;
};
```
