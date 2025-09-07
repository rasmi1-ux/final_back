
# final_back

## API Documentation

### Users Endpoints

#### `GET /api/users/`
Get all fields.

#### `GET /api/users/home`
Get 3 fields for the home page.

#### `POST /api/users/login`
Login with email and password.
**Body:** `{ email, password }`

#### `POST /api/users/signup`
Register a new user.
**Body:** `{ email, password, role }`

#### `POST /api/users/booking`
Book a field.
**Body:** `{ fieldId, date, duration, email, price }`

#### `GET /api/users/bookings/:email`
Get all bookings for a user by email.

#### `DELETE /api/users/bookings/:id/:email`
Delete a booking by booking id and user email.

---

### Admin Endpoints

#### `POST /api/admin/fields`
Add a new field.
**Body:** `{ field, location, price, img, description, size, amenities, rating }`

#### `DELETE /api/admin/fields/:id`
Delete a field by id.

#### `GET /api/admin/allBookings`
Get all bookings with field details.

#### `POST /api/admin/bookings`
Add a booking to history.
**Body:** `{ date, duration, field_id, email, price, img, field }`

#### `DELETE /api/admin/bookings/:id`
Delete a booking by booking id.

---

## Notes
- All endpoints return JSON.
