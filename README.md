# 💻 IT Services Department
### Hindustan Projects Pvt. Ltd.

IT Services division of **Hindustan Projects Pvt. Ltd.**, based in Bhilwara, Rajasthan, India.

We build and manage digital solutions for our clients and for the company's other departments (Architecture & Construction, Marketing).

---

## 🛠️ Services Offered

- Website Design & Development
- Web Application Development
- Digital Marketing Support
- IT Consulting & Solutions
- Maintenance & Support

---

## 📁 About This Repository

This repository contains the source code for the IT Services website/platform, maintained by the IT department of Hindustan Projects Pvt. Ltd.

### 🚀 Technical Overview & Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL via Prisma ORM (hosted on Neon.tech) |
| Auth | JWT in httpOnly cookies + bcrypt |
| Image Storage | Cloudinary |
| Email | Resend (primary) / Nodemailer SMTP (fallback) |

### 🗂 Project Structure

```
hindustan-projects-website/
├── client/                  # React 19 + Vite 8 + Tailwind CSS v4
│   └── src/
│       ├── components/      # UI components
│       ├── pages/           # Public pages + Admin dashboard pages
│       ├── layouts/         # RootLayout, AdminLayout
│       ├── hooks/           # Custom React hooks (TanStack Query)
│       └── utils/           # API client, motion helpers
│
└── server/                  # Node.js + Express 5 + Prisma ORM
    ├── prisma/
    │   ├── schema.prisma    # All DB models
    │   └── seed.js          # Seed data
    └── src/
        ├── routes/          # All API routes
        ├── controllers/     # Business logic
        ├── middleware/       # Auth, security, error handling
        └── utils/           # Mailer, Cloudinary, Logger
```

### ⚡ Local Development Setup

#### Prerequisites
- Node.js v18+
- PostgreSQL (or Neon.tech free account)

#### 1. Clone & Install
```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

#### 2. Environment Variables
Copy `.env.example` to `.env` inside the `server/` directory and configure the variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_SECRET_PATH`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `INTEGRATION_MASTER_KEY`

#### 3. Database Setup
```bash
cd server
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to DB
npx prisma db seed     # Seed default data
```

#### 4. Run Dev Servers
```bash
# Terminal 1 — Frontend (http://localhost:5173)
cd client && npm run dev

# Terminal 2 — Backend (http://localhost:5000)
cd server && npm run dev
```

---

## 🏢 Company

**Hindustan Projects Pvt. Ltd.**  
📍 Bhilwara, Rajasthan, India  

- 🌐 Main Org: [hindustan-groups](https://github.com/hindustan-groups)  
- 📂 All Projects: [hindustan-projects](https://github.com/hindustan-groups/hindustan-projects)  
- 📧 Email: info@hindustanprojects.in
- 📱 Phone: +91-7597000601  

---
⭐ Part of Hindustan Projects Pvt. Ltd. — Building structures. Building solutions.
