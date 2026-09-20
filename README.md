# ✈️ Wanderlust Travel Agency — MERN Stack

A full-stack, production-ready travel agency web application built with MongoDB, Express.js, React.js, and Node.js.

---

## 🖼️ Features

| Feature | Details |
|---|---|
| **Browse Packages** | Grid/list view with search, category filters, price range, sort |
| **Package Details** | Full info with highlights, inclusions, photo, and booking form |
| **User Auth** | JWT-based register/login, protected routes, role system |
| **Booking System** | Date selection, traveler count, total calculation, confirmation |
| **User Dashboard** | View bookings, cancel, see spending stats |
| **Admin Dashboard** | CRUD packages, manage all bookings, update statuses |
| **Responsive Design** | Mobile-first, works on all screen sizes |
| **Toast Notifications** | Real-time feedback on all user actions |

---

## 🗂️ Project Structure

```
travel-agency/
├── package.json          ← Root scripts (concurrently)
│
├── server/               ← Node.js + Express API
│   ├── server.js         ← Entry point
│   ├── seed.js           ← Database seeder
│   ├── .env.example      ← Environment variables template
│   ├── config/
│   │   └── db.js         ← MongoDB connection
│   ├── models/
│   │   ├── User.js       ← User schema (bcrypt)
│   │   ├── Package.js    ← Travel package schema
│   │   └── Booking.js    ← Booking schema
│   ├── routes/
│   │   ├── authRoutes.js    ← /api/auth/*
│   │   ├── packageRoutes.js ← /api/packages/*
│   │   └── bookingRoutes.js ← /api/bookings/*
│   └── middleware/
│       └── authMiddleware.js ← JWT protect + adminOnly
│
└── client/               ← React frontend
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                  ← Router + Auth guards
        ├── index.js                ← React entry
        ├── index.css               ← Global design system
        ├── context/
        │   └── AuthContext.js      ← Global auth state
        ├── utils/
        │   └── api.js              ← Axios instance + API calls
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   ├── PackageCard.js
        │   └── BookingForm.js
        └── pages/
            ├── HomePage.js
            ├── PackagesPage.js
            ├── PackageDetailPage.js
            ├── LoginPage.js         ← Also exports RegisterPage
            ├── RegisterPage.js
            ├── BookingPage.js
            ├── DashboardPage.js
            ├── AdminPage.js
            └── NotFoundPage.js
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ — https://nodejs.org
- **MongoDB** v6+ (local) or a free [MongoDB Atlas](https://cloud.mongodb.com) cluster
- **npm** v9+

---

## 🚀 Setup & Run (Step-by-Step)

### 1. Clone / Download the project

```bash
git clone <your-repo-url>
cd travel-agency
```

### 2. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/travel-agency
JWT_SECRET=change_this_to_a_long_random_string
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> **Atlas URI example:**  
> `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-agency`

### 3. Install all dependencies

```bash
# From project root:
cd ..           # make sure you're in travel-agency/
npm run install-all
```

Or manually:
```bash
npm install                  # root
cd server && npm install     # backend
cd ../client && npm install  # frontend
```

### 4. Seed the database

```bash
npm run seed
# Creates: 2 users + 8 travel packages
```

**Created accounts:**
| Role  | Email | Password |
|---|---|---|
| Admin | admin@travelagency.com | admin123456 |
| User  | jane@example.com | user123456 |

### 5. Start development servers

```bash
# From project root — starts both client and server:
npm run dev
```

Or separately:
```bash
npm run server   # Express API on http://localhost:5000
npm run client   # React app on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 🔌 API Endpoints

### Auth  `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Create new account |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | 🔒 User | Get current user profile |
| PUT | `/profile` | 🔒 User | Update name / password |

### Packages  `/api/packages`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List packages (supports query params) |
| GET | `/:id` | Public | Get single package |
| POST | `/` | 👑 Admin | Create package |
| PUT | `/:id` | 👑 Admin | Update package |
| DELETE | `/:id` | 👑 Admin | Remove package |

**GET /api/packages query params:**
```
search=bali        ← full-text search
category=Beach     ← category filter
minPrice=500       ← minimum price
maxPrice=2000      ← maximum price
sort=-rating       ← sort field (prefix - for desc)
page=1             ← page number
limit=9            ← items per page
```

### Bookings  `/api/bookings`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | 🔒 User | Create booking |
| GET | `/user/:userId` | 🔒 User | Get user's bookings |
| GET | `/` | 👑 Admin | Get all bookings |
| PUT | `/:id/status` | 👑 Admin | Update booking status |
| DELETE | `/:id` | 🔒 User | Cancel booking |

---

## 📬 Postman API Testing

### Setup
1. Open Postman
2. Set **Base URL** variable: `http://localhost:5000`

### Example Requests

**Register:**
```http
POST {{base}}/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test1234"
}
```

**Login:**
```http
POST {{base}}/api/auth/login
Content-Type: application/json

{
  "email": "admin@travelagency.com",
  "password": "admin123456"
}
```
→ Copy the `token` from response.

**Get Packages (with filters):**
```http
GET {{base}}/api/packages?category=Beach&sort=-rating&limit=6
```

**Create Booking (auth required):**
```http
POST {{base}}/api/bookings
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "packageId": "<package_id_from_GET_packages>",
  "bookingDate": "2025-06-15",
  "travelers": 2,
  "specialRequests": "Vegetarian meals please",
  "contactPhone": "+91 98765 43210"
}
```

**Update Booking Status (admin):**
```http
PUT {{base}}/api/bookings/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{ "status": "confirmed" }
```

**Create Package (admin):**
```http
POST {{base}}/api/packages
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Paris City Break",
  "description": "A romantic escape to the City of Light.",
  "price": 1599,
  "duration": "5 Days / 4 Nights",
  "location": "Paris, France",
  "country": "France",
  "imageUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  "category": "City",
  "difficulty": "Easy",
  "maxGroupSize": 20,
  "highlights": ["Eiffel Tower", "Louvre Museum", "Montmartre Walk"],
  "included": ["Hotel stay", "Daily breakfast", "City tour"],
  "notIncluded": ["Flights", "Lunch & dinner", "Museum entries"]
}
```

---

## 🌱 Sample MongoDB Data

After running `npm run seed`, the database contains:

**8 packages** covering:
- 🏖 Magical Bali Getaway — $1,299
- 🏔 Swiss Alps Adventure — $2,899
- 🏛 Rajasthan Royal Heritage — $999
- 🌿 Amazon Jungle Expedition — $1,799
- 🚢 Mediterranean Cruise Escape — $3,499
- 🗾 Tokyo & Kyoto Cultural Immersion — $2,199
- 🦁 Serengeti Safari & Zanzibar — $3,899
- 🏕 Patagonia End of the World Trek — $2,599

---

## 🔐 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Server port (default: 5000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs (keep private!) |
| `NODE_ENV` | No | `development` or `production` |
| `CLIENT_URL` | No | Frontend URL for CORS (default: localhost:3000) |

---

## 🚀 Production Deployment

### Backend (Render / Railway / Heroku)
1. Push `server/` to a host of your choice
2. Set all environment variables on the platform
3. Set `NODE_ENV=production` and `CLIENT_URL=https://your-frontend.com`
4. Start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Build: `cd client && npm run build`
2. Set `REACT_APP_API_URL=https://your-backend.com/api` in `.env.production`
3. Deploy the `client/build/` folder

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Axios |
| Styling | Pure CSS with CSS Variables (design system) |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + bcryptjs |
| Notifications | React Toastify |
| Dev tooling | Nodemon, Concurrently |

---

## 📄 License

MIT — use freely for personal or commercial projects.
