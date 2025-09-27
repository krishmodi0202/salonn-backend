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

## For Admin Panel

### Overview
The admin panel needs to display comprehensive booking data, analytics, and management capabilities. Here are all the APIs and data points you'll need:

### 📊 Dashboard APIs

#### 1. **GET `/api/bookings`** - All Bookings List
```javascript
// Fetch all bookings for admin overview
fetch('http://localhost:5000/api/bookings')
```
**Use for:** Main bookings table, total bookings count

#### 2. **GET `/health`** - System Health Check
```javascript
// Check database connection and system status
fetch('http://localhost:5000/health')
```
**Use for:** System status indicator, database connection status

#### 3. **GET `/api/bookings/availability/:date`** - Daily Availability
```javascript
// Check bookings for specific date
fetch('http://localhost:5000/api/bookings/availability/2025-09-28')
```
**Use for:** Daily schedule view, slot management

### 📈 Analytics Data Points

#### Key Metrics to Display:
1. **Total Bookings** - `bookings.length`
2. **Today's Bookings** - Filter by `date === today`
3. **Pending Bookings** - Filter by `status === 'pending'`
4. **Confirmed Bookings** - Filter by `status === 'confirmed'`
5. **Cancelled Bookings** - Filter by `status === 'cancelled'`
6. **Revenue** - Sum of all `price` fields
7. **Popular Services** - Group by `service` field
8. **Popular Stylists** - Group by `stylist` field
9. **Peak Hours** - Group by `time` field
10. **Customer Data** - Extract from `customer` objects

### 🛠️ Management APIs

#### 4. **PUT `/api/bookings/:id`** - Update Booking
```javascript
// Update booking status or details
fetch('http://localhost:5000/api/bookings/BOOKING_ID', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'confirmed', // or 'cancelled', 'pending'
    price: 50,
    notes: 'Special instructions'
  })
})
```
**Use for:** Booking management, status updates

#### 5. **DELETE `/api/bookings/:id`** - Cancel/Delete Booking
```javascript
// Cancel or delete a booking
fetch('http://localhost:5000/api/bookings/BOOKING_ID', {
  method: 'DELETE'
})
```
**Use for:** Booking cancellation

#### 6. **GET `/api/bookings/:id`** - Single Booking Details
```javascript
// Get detailed info for specific booking
fetch('http://localhost:5000/api/bookings/BOOKING_ID')
```
**Use for:** Booking detail modal, edit forms

### 📋 Data Structure for Admin Panel

#### Booking Object Structure:
```javascript
{
  "_id": "unique_mongo_id",
  "bookingId": "BK1758959118019200", // Display this to users
  "date": "2025-09-28",
  "time": "09:30",
  "service": "haircut", // or "deluxe-package", "beard-trim", etc.
  "stylist": "mike", // or "john", "sarah", "any"
  "customer": {
    "name": "Krish Jignesh Modi",
    "phone": "1234567890",
    "email": "krish@example.com",
    "whatsapp": "1234567890"
  },
  "status": "confirmed", // "pending", "cancelled"
  "price": 50,
  "notes": "Special instructions",
  "createdAt": "2025-09-27T07:45:18.019Z",
  "updatedAt": "2025-09-27T07:45:18.019Z"
}
```

### 🎨 Admin Panel Components Needed

#### 1. **Dashboard Cards**
- Total Bookings Today
- Revenue Today
- Pending Approvals
- System Status

#### 2. **Bookings Table**
- Sortable columns: Date, Time, Customer, Service, Stylist, Status
- Filter by: Date range, Status, Stylist, Service
- Search by: Customer name, phone, booking ID
- Actions: View, Edit, Cancel, Confirm

#### 3. **Analytics Charts**
- Daily bookings trend (line chart)
- Service popularity (pie chart)
- Stylist workload (bar chart)
- Revenue over time (area chart)

#### 4. **Quick Actions**
- Add new booking (manual entry)
- Bulk status updates
- Export data to CSV
- Send notifications to customers

### 📱 Real-time Features

#### WebSocket Events (Future Enhancement):
- New booking notifications
- Status change alerts
- Customer check-ins
- System health updates

### 🔍 Search & Filter Examples

```javascript
// Filter bookings by date range
const todayBookings = allBookings.filter(booking => 
  booking.date === '2025-09-28'
);

// Filter by status
const pendingBookings = allBookings.filter(booking => 
  booking.status === 'pending'
);

// Search by customer name
const customerBookings = allBookings.filter(booking => 
  booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// Group by service for analytics
const serviceStats = allBookings.reduce((acc, booking) => {
  acc[booking.service] = (acc[booking.service] || 0) + 1;
  return acc;
}, {});
```

### 🚀 Quick Start for Admin Panel

1. **Fetch all bookings** on page load
2. **Calculate metrics** from the booking data
3. **Display in dashboard** cards and charts
4. **Implement real-time updates** by refetching data periodically
5. **Add management actions** for booking operations

### 📊 Sample API Calls for Admin Dashboard

```javascript
// Complete admin dashboard data fetch
async function fetchAdminData() {
  try {
    // Get all bookings
    const bookingsResponse = await fetch('/api/bookings');
    const bookingsData = await bookingsResponse.json();
    const bookings = bookingsData.data;
    
    // Get system health
    const healthResponse = await fetch('/health');
    const healthData = await healthResponse.json();
    
    // Calculate metrics
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === today);
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    
    return {
      bookings,
      health: healthData,
      metrics: {
        totalBookings: bookings.length,
        todayBookings: todayBookings.length,
        totalRevenue,
        pendingCount
      }
    };
  } catch (error) {
    console.error('Failed to fetch admin data:', error);
  }
}
```

This comprehensive guide provides everything needed to build a full-featured admin panel for your barber shop booking system.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License
# salonn-backend
