
# final_back

## API Documentation

### Users Endpoints


# ⚽ Field Booking Backend (Express + PostgreSQL)

This is the **backend** for the field booking app. It provides APIs for user authentication, field management, and booking operations.

## 🏗️ Tech Stack

- Node.js + Express
- PostgreSQL (via `pg`)
- `dotenv`, `cors`, `morgan`

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create a PostgreSQL database (e.g., `fieldsdb`)

# 3. Start PostgreSQL and create DB tables
# (You need to create tables for users, fields, bookings, history)

# 4. Start the server
node server.js
```

## 🗂️ Project Structure
```
final_back/
├── routes/
│   ├── admin.js      # admin endpoints
│   └── users.js      # user endpoints
├── db.js             # pg client
└── server.js         # app entry
```

## 📡 API Endpoints

The API will run on: http://localhost:3000

### 👤 User Routes

**Base URL**: `/api/users`

| Method | Endpoint                   | Description                       |
|--------|----------------------------|-----------------------------------|
| GET    | `/`                        | Get all fields                    |
| GET    | `/home`                    | Get 3 fields for home page        |
| POST   | `/login`                   | Log in user                       |
| POST   | `/signup`                  | Register new user                 |
| POST   | `/booking`                 | Book a field                      |
| GET    | `/bookings/:email`         | Get bookings by user email        |
| DELETE | `/bookings/:id/:email`     | Delete a booking by id/email      |

#### 🔸 POST `/api/users/signup`
Registers a new user.
```json
{
	"email": "user@example.com",
	"password": "123456",
	"role": "user"
}
```

#### 🔸 POST `/api/users/login`
Logs in an existing user.
```json
{
	"email": "user@example.com",
	"password": "123456"
}
```

#### 🔸 POST `/api/users/booking`
Book a field.
```json
{
	"fieldId": 1,
	"date": "2025-09-08",
	"duration": 2,
	"email": "user@example.com",
	"price": 100
}
```

#### 🔸 GET `/api/users/bookings/:email`
Returns a list of bookings for the user.

#### 🔸 DELETE `/api/users/bookings/:id/:email`
Deletes a booking by booking id and user email.

---

### 🛠️ Admin Routes

**Base URL**: `/api/admin`

| Method | Endpoint                | Description                       |
|--------|-------------------------|-----------------------------------|
| POST   | `/fields`               | Add a new field                   |
| DELETE | `/fields/:id`           | Delete a field by id              |
| GET    | `/allBookings`          | Get all bookings (with field info)|
| POST   | `/bookings`             | Add a booking to history          |
| DELETE | `/bookings/:id`         | Delete a booking by id            |

#### 🔸 POST `/api/admin/fields`
Add a new field.
```json
{
	"field": "Main Field",
	"location": "City Center",
	"price": 100,
	"img": "url.jpg",
	"description": "Nice field",
	"size": "5x5",
	"amenities": "lights,parking",
	"rating": 4.5
}
```

#### 🔸 DELETE `/api/admin/fields/:id`
Deletes a field by id.

#### 🔸 GET `/api/admin/allBookings`
Returns all bookings with field details.

#### 🔸 POST `/api/admin/bookings`
Add a booking to history.
```json
{
	"date": "2025-09-08",
	"duration": 2,
	"field_id": 1,
	"email": "user@example.com",
	"price": 100,
	"img": "url.jpg",
	"field": "Main Field"
}
```

#### 🔸 DELETE `/api/admin/bookings/:id`
Deletes a booking by booking id.

