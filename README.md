# Billify

Billify is a full-stack invoicing SaaS app for freelancers and small teams. It provides client management, invoice generation, analytics, PDF export, and email delivery in a clean dashboard workflow.

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, React Router v6, React Hook Form, Axios, Recharts, React Icons, React Hot Toast
- Backend: Node.js, Express.js, MongoDB + Mongoose, JWT, Multer, Nodemailer, PDFKit

## Current Features

### Authentication and Account

- Register and login with JWT-based auth
- Protected API routes and authenticated frontend routes
- Profile update support (name, email, phone, GSTIN, address)
- Brand logo upload and storage
- Bank details support (account name, account number, IFSC, bank name, UPI)

### Client Management

- Create client
- List all user clients
- Edit client details
- Delete client

### Invoicing

- Create invoices with dynamic line items
- Automatic invoice number generation in `BILL-0001` format
- GST-based calculations (subtotal, GST amount, total)
- Invoice listing with status filtering: `paid`, `unpaid`, `overdue`
- Mark invoice as paid
- Delete invoice
- Search invoices by invoice number, client name, or client email
- Auto-status update from `unpaid` to `overdue` based on due date

### Dashboard Analytics

- Total invoices, paid invoices, unpaid/overdue invoices
- Revenue for selected month
- Day-wise trend for selected month
- Revenue trend for last 6 months
- Payment split view (paid vs unpaid/overdue)
- Compact insight metrics: peak day, averages, collection/open rates

### PDF and Email

- Generate invoice PDF from server
- Download invoice PDF from UI
- Email invoice with PDF attachment via SMTP

### AI Features

- AI payment reminder generation with tone control: `friendly`, `professional`, `strict`
- Reminder preview/edit flow in frontend before sending

## Frontend Pages

- Landing page
- Login
- Register
- Dashboard
- Clients
- New Invoice
- Invoices
- Settings

## API Endpoints

### Auth

- `POST /api/auth/register` Register user
- `POST /api/auth/login` Login user
- `GET /api/auth/me` Get current user
- `PUT /api/auth/profile` Update profile
- `POST /api/auth/profile/logo` Upload logo

### Clients

- `POST /api/clients` Create client
- `GET /api/clients` List clients
- `PUT /api/clients/:id` Update client
- `DELETE /api/clients/:id` Delete client

### Invoices

- `POST /api/invoices` Create invoice
- `GET /api/invoices` List invoices (supports status query)
- `GET /api/invoices/:id` Get invoice by ID
- `DELETE /api/invoices/:id` Delete invoice
- `PATCH /api/invoices/:id/mark-paid` Mark invoice as paid
- `GET /api/invoices/stats` Dashboard analytics (supports `month=YYYY-MM`)

### PDF and Email

- `GET /api/pdf/:id` Generate and download invoice PDF
- `POST /api/email/:id` Send invoice by email

### AI

- `POST /api/ai/reminder/:invoiceId` Generate AI reminder (optionally send immediately)

### Health

- `GET /api/health` Server health check

## Project Structure

- `client/` React app
- `server/` Express API
- `.env.example` Example environment configuration

## Setup

1. Clone repository
2. Copy `.env.example` to `.env` and fill all values
3. Install server dependencies

```bash
cd server
npm install
```

4. Install client dependencies

```bash
cd ../client
npm install
```

5. Start backend

```bash
cd ../server
npm run dev
```

6. Start frontend

```bash
cd ../client
npm run dev
```

## Environment Variables

### Backend

- `PORT` API port (default `5000`)
- `MONGODB_URI` MongoDB connection string
- `JWT_SECRET` JWT signing secret
- `JWT_EXPIRES_IN` Token expiry (example: `7d`)
- `CLIENT_URL` Frontend URL for CORS
- `SMTP_HOST` SMTP host
- `SMTP_PORT` SMTP port
- `SMTP_SECURE` `true` for SSL, else `false`
- `SMTP_USER` SMTP username
- `SMTP_PASS` SMTP password
- `EMAIL_FROM` Email sender label/address
- `GROQ_API_KEY` Groq API key
- `GROQ_MODEL` Optional Groq model (default: `llama-3.1-8b-instant`)

### Frontend

- `VITE_API_URL` API base URL
- `VITE_SERVER_URL` Server base URL (used for uploaded assets)

## Example AI API Responses

### POST /api/ai/reminder/:invoiceId

Request body:

```json
{
	"tone": "professional"
}
```

Response:

```json
{
	"message": "AI reminder generated",
	"data": {
		"invoiceId": "...",
		"clientEmail": "client@example.com",
		"tone": "professional",
		"subject": "Payment reminder: BILL-0012",
		"reminder": "Hello John, this is a reminder...",
		"sent": false
	}
}
```

## Minimal React Usage Example

```jsx
import { useState } from "react";
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
