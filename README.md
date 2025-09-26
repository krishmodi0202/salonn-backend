# Barber Shop Backend API

A Node.js/Express backend API for managing barber shop bookings with MongoDB integration.

## Features

- ✅ Create, read, update, and delete bookings
- ✅ Check availability for specific dates
- ✅ Prevent double bookings for same stylist/time slot
- ✅ Customer information management
- ✅ Booking status tracking (confirmed, pending, cancelled)
- ✅ Unique booking ID generation
- ✅ CORS enabled for frontend integration

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Update the `.env` file with your MongoDB credentials:
```env
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD_HERE@salonn.c7ehxtu.mongodb.net/barber-shop?retryWrites=true&w=majority&appName=salonn
PORT=5000
NODE_ENV=development
```

**Important:** Replace `YOUR_PASSWORD_HERE` with your actual MongoDB Atlas password.

### 3. Start the Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Base URL: `/api/bookings`

#### GET `/api/bookings`
- **Description:** Get all bookings
- **Response:** 
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

#### POST `/api/bookings`
- **Description:** Create a new booking
- **Body:**
```json
{
  "date": "2024-01-15",
  "time": "10:00",
  "service": "Haircut",
  "stylist": "John Doe",
  "customer": {
    "name": "Jane Smith",
    "phone": "+1234567890",
    "email": "jane@example.com",
    "whatsapp": "+1234567890"
  }
}
```

#### GET `/api/bookings/availability/:date`
- **Description:** Check availability for a specific date
- **Example:** `/api/bookings/availability/2024-01-15`
- **Response:**
```json
{
  "success": true,
  "date": "2024-01-15",
  "bookedSlots": [...]
}
```

#### PUT `/api/bookings/:id`
- **Description:** Update booking status
- **Body:**
```json
{
  "status": "cancelled"
}
```

#### DELETE `/api/bookings/:id`
- **Description:** Delete a booking
- **Response:**
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

## Data Models

### Booking Schema
```javascript
{
  date: String (required),
  time: String (required),
  service: String (required),
  stylist: String (required),
  customer: {
    name: String (required),
    phone: String (required),
    email: String (optional),
    whatsapp: String (optional)
  },
  status: String (enum: ['confirmed', 'pending', 'cancelled']),
  bookingId: String (auto-generated unique ID),
  notes: String (optional),
  price: Number (optional),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Development

The project uses:
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **body-parser** - Request body parsing
- **nodemon** - Development auto-restart

## Testing

To test the API, you can use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- Frontend applications

Example curl command:
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15",
    "time": "10:00",
    "service": "Haircut",
    "stylist": "John Doe",
    "customer": {
      "name": "Jane Smith",
      "phone": "+1234567890"
    }
  }'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License
# salonn-backend
