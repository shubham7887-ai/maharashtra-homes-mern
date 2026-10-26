# Maharashtra Homes — MERN Property Marketplace

A starter MERN-stack property marketplace for Maharashtra with three workflows:
- **Rent** — browse rental homes
- **Buy** — browse homes for sale
- **Sell / List** — publish a property listing

## Stack
- React + Vite
- Node.js + Express REST API
- MongoDB + Mongoose
- JWT authentication (register/login)
- Responsive CSS, property search and filters

## Run locally

### 1. Requirements
Install Node.js 18+ and MongoDB (local instance or MongoDB Atlas).

### 2. Configure the API
```bash
cd server
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
npm install
npm run dev
```
The API runs at `http://localhost:5000`.

### 3. Run the frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in your terminal (usually `http://localhost:5173`).

The frontend uses `/api` and Vite proxies it to the Express server. Demo listings are seeded in the client so the UI is useful before connecting a database; API listings take over when available.

## API endpoints
- `GET /api/health`
- `GET /api/properties?purpose=rent|buy&city=Pune&search=...`
- `GET /api/properties/:id`
- `POST /api/properties` (JWT required)
- `PUT /api/properties/:id` (JWT required; owner only)
- `DELETE /api/properties/:id` (JWT required; owner only)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (JWT required)

## Notes before production
This is a starter project, not a live real-estate inventory. Demo data and image URLs are illustrative. Before launch, add image upload/storage, email/phone verification, rate limiting, moderation/reporting, stronger validation, automated tests, privacy/terms pages, and deployment configuration. Never store secrets in frontend code.
