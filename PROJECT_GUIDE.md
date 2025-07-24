# Matatu Scheduler Development Guide
## MERN Stack Application for Nairobi Matatu Scheduling

### Table of Contents
1. [Project Architecture Overview](#project-architecture-overview)
2. [Database Schema Design](#database-schema-design)
3. [RESTful API Design](#restful-api-design)
4. [Frontend Architecture](#frontend-architecture)
5. [Real-time Features](#real-time-features)
6. [Authentication System](#authentication-system)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Guide](#deployment-guide)
10. [Kenyan-Specific Considerations](#kenyan-specific-considerations)

---

## Project Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │   Express API   │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • React Router  │    │ • REST APIs     │    │ • Collections   │
│ • State Mgmt    │    │ • Socket.io     │    │ • Indexes       │
│ • Components    │    │ • Auth Middleware│    │ • Validation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack Details
- **Frontend**: React 18, React Router, Axios, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io, JWT
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with role-based access
- **Real-time**: Socket.io for live updates
- **Styling**: Tailwind CSS for mobile-first responsive design

---

## Database Schema Design

### Core Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String, // hashed
  phone: String,
  role: String, // 'driver' | 'passenger'
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date,
  // Driver-specific fields
  licenseNumber: String, // for drivers
  vehicleRegNumber: String, // for drivers
  operatorName: String, // matatu sacco name
}
```

#### 2. Routes Collection
```javascript
{
  _id: ObjectId,
  routeName: String, // "CBD-Westlands"
  startLocation: {
    name: String, // "Kencom"
    coordinates: [Number, Number] // [lat, lng]
  },
  endLocation: {
    name: String, // "Westlands"
    coordinates: [Number, Number]
  },
  distance: Number, // in km
  estimatedDuration: Number, // in minutes
  fare: Number, // in KES
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Schedules Collection
```javascript
{
  _id: ObjectId,
  routeId: ObjectId, // reference to Routes
  driverId: ObjectId, // reference to Users
  vehicleRegNumber: String,
  departureTime: Date,
  actualDepartureTime: Date, // when actually departed
  estimatedArrivalTime: Date,
  actualArrivalTime: Date,
  status: String, // 'scheduled', 'departed', 'arrived', 'cancelled'
  passengerCount: Number,
  capacity: Number,
  fare: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Schedule Updates Collection
```javascript
{
  _id: ObjectId,
  scheduleId: ObjectId, // reference to Schedules
  userId: ObjectId, // who reported the update
  updateType: String, // 'departure', 'arrival', 'delay', 'cancellation'
  message: String,
  timestamp: Date,
  isVerified: Boolean, // verified by driver or multiple reports
  createdAt: Date
}
```

### Database Indexes
```javascript
// Performance optimization indexes
db.schedules.createIndex({ routeId: 1, departureTime: 1 })
db.schedules.createIndex({ driverId: 1, createdAt: -1 })
db.routes.createIndex({ "startLocation.coordinates": "2dsphere" })
db.scheduleUpdates.createIndex({ scheduleId: 1, timestamp: -1 })
```

---

## RESTful API Design

### Authentication Endpoints
```javascript
POST /api/auth/register
Body: { name, email, password, phone, role }
Response: { user, token }

POST /api/auth/login
Body: { email, password }
Response: { user, token }

GET /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Response: { user }
```

### Routes Endpoints
```javascript
GET /api/routes
Query: { search?, startLocation?, endLocation? }
Response: { routes: Route[] }

GET /api/routes/:id
Response: { route: Route }

POST /api/routes (Admin/Driver only)
Body: { routeName, startLocation, endLocation, distance, estimatedDuration, fare }
Response: { route: Route }
```

### Schedules Endpoints
```javascript
GET /api/schedules
Query: { routeId?, date?, status?, limit?, offset? }
Response: { schedules: Schedule[], total: Number }

GET /api/schedules/:id
Response: { schedule: Schedule }

POST /api/schedules (Driver only)
Body: { routeId, departureTime, capacity, fare }
Response: { schedule: Schedule }

PUT /api/schedules/:id (Driver only)
Body: { actualDepartureTime?, status?, passengerCount? }
Response: { schedule: Schedule }

DELETE /api/schedules/:id (Driver only)
Response: { message: String }
```

### Schedule Updates Endpoints
```javascript
GET /api/schedules/:id/updates
Response: { updates: ScheduleUpdate[] }

POST /api/schedules/:id/updates
Body: { updateType, message }
Response: { update: ScheduleUpdate }
```

---

## Frontend Architecture

### Component Hierarchy
```
App
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Footer
├── Auth
│   ├── Login
│   ├── Register
│   └── Profile
├── Routes
│   ├── RouteList
│   ├── RouteDetail
│   └── RouteSearch
├── Schedules
│   ├── ScheduleList
│   ├── ScheduleDetail
│   ├── ScheduleForm (Driver)
│   └── ScheduleUpdate
├── Dashboard
│   ├── PassengerDashboard
│   └── DriverDashboard
└── Common
    ├── LoadingSpinner
    ├── ErrorBoundary
    └── Modal
```

### State Management Strategy
```javascript
// Context-based state management
const AppContext = createContext();

// State structure
const initialState = {
  user: null,
  routes: [],
  schedules: [],
  loading: false,
  error: null,
  socketConnected: false
};

// Actions
const actionTypes = {
  SET_USER: 'SET_USER',
  SET_ROUTES: 'SET_ROUTES',
  SET_SCHEDULES: 'SET_SCHEDULES',
  ADD_SCHEDULE: 'ADD_SCHEDULE',
  UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};
```

### Key Components Implementation

#### Route Search Component
```javascript
const RouteSearch = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const handleSearch = async () => {
    // API call to search routes
  };
  
  return (
    <div className="p-4">
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="From (e.g., Kencom)"
          value={searchParams.from}
          onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="To (e.g., Westlands)"
          value={searchParams.to}
          onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
        />
        <input 
          type="date" 
          value={searchParams.date}
          onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
        />
        <button type="submit">Search Matatus</button>
      </form>
    </div>
  );
};
```

---

## Real-time Features

### Socket.io Implementation

#### Server-side Setup
```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Socket authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.user.name} connected`);
  
  // Join route-specific rooms
  socket.on('join-route', (routeId) => {
    socket.join(`route-${routeId}`);
  });
  
  // Handle schedule updates
  socket.on('schedule-update', (data) => {
    // Broadcast to all users following this route
    socket.to(`route-${data.routeId}`).emit('schedule-updated', data);
  });
  
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.name} disconnected`);
  });
});
```

#### Client-side Setup
```javascript
import io from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AppContext);
  
  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_API_URL, {
        auth: {
          token: localStorage.getItem('token')
        }
      });
      
      setSocket(newSocket);
      
      // Listen for schedule updates
      newSocket.on('schedule-updated', (data) => {
        // Update local state
        dispatch({ type: 'UPDATE_SCHEDULE', payload: data });
      });
      
      return () => newSocket.close();
    }
  }, [user]);
  
  return socket;
};
```

---

## Authentication System

### JWT Authentication Middleware
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based authorization
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Usage
app.post('/api/schedules', authMiddleware, authorizeRole(['driver']), createSchedule);
```

### Frontend Auth Context
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user
      verifyToken(token);
    }
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error) {
      throw error.response.data.message;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
**Estimated Time: 10-15 hours**

#### Backend Setup
- [ ] Initialize Node.js project with Express
- [ ] Set up MongoDB connection with Mongoose
- [ ] Create user authentication system
- [ ] Implement JWT middleware
- [ ] Set up basic project structure

#### Frontend Setup
- [ ] Create React application
- [ ] Set up Tailwind CSS
- [ ] Implement routing with React Router
- [ ] Create authentication context
- [ ] Build login/register components

### Phase 2: Core Features (Week 3-4)
**Estimated Time: 15-20 hours**

#### Database & API
- [ ] Design and implement MongoDB schemas
- [ ] Create RESTful API endpoints for routes
- [ ] Implement schedule CRUD operations
- [ ] Add data validation and error handling
- [ ] Set up API documentation

#### Frontend Core
- [ ] Build route search functionality
- [ ] Create schedule listing components
- [ ] Implement driver dashboard
- [ ] Add passenger dashboard
- [ ] Create mobile-responsive design

### Phase 3: Real-time Features (Week 5)
**Estimated Time: 8-12 hours**

- [ ] Integrate Socket.io server-side
- [ ] Implement real-time schedule updates
- [ ] Add live notifications
- [ ] Create update reporting system
- [ ] Test real-time functionality

### Phase 4: Advanced Features (Week 6)
**Estimated Time: 10-15 hours**

- [ ] Add geolocation features
- [ ] Implement schedule verification system
- [ ] Add user ratings/feedback
- [ ] Create admin panel
- [ ] Optimize performance

### Phase 5: Testing & Deployment (Week 7-8)
**Estimated Time: 8-12 hours**

- [ ] Write unit tests
- [ ] Perform integration testing
- [ ] Set up deployment pipeline
- [ ] Deploy to production
- [ ] User acceptance testing

---

## Testing Strategy

### Backend Testing
```javascript
// Example test for schedule API
describe('Schedules API', () => {
  test('should create a new schedule', async () => {
    const scheduleData = {
      routeId: '60f1b2b3c4d5e6f7a8b9c0d1',
      departureTime: new Date(),
      capacity: 14,
      fare: 50
    };
    
    const response = await request(app)
      .post('/api/schedules')
      .set('Authorization', `Bearer ${driverToken}`)
      .send(scheduleData)
      .expect(201);
    
    expect(response.body.schedule).toHaveProperty('_id');
    expect(response.body.schedule.fare).toBe(50);
  });
});
```

### Frontend Testing
```javascript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import RouteSearch from './RouteSearch';

test('should search for routes', async () => {
  render(<RouteSearch />);
  
  fireEvent.change(screen.getByPlaceholderText('From'), {
    target: { value: 'Kencom' }
  });
  
  fireEvent.change(screen.getByPlaceholderText('To'), {
    target: { value: 'Westlands' }
  });
  
  fireEvent.click(screen.getByText('Search Matatus'));
  
  // Assert API call was made
  expect(mockAxios.get).toHaveBeenCalledWith('/api/routes', {
    params: { from: 'Kencom', to: 'Westlands' }
  });
});
```

---

## Deployment Guide

### Environment Variables
```bash
# Backend (.env)
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/matatu-scheduler
JWT_SECRET=your-jwt-secret-key
CLIENT_URL=http://localhost:3000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
```

### Docker Setup
```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]

# Frontend Dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Production Deployment Checklist
- [ ] Set up MongoDB Atlas cluster
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipeline

---

## Kenyan-Specific Considerations

### Local Context Integration
1. **Popular Routes**: Focus on major Nairobi routes
   - CBD to Westlands
   - CBD to Kasarani
   - CBD to Embakasi
   - CBD to Ngong Road areas

2. **Terminology**: Use local terms
   - "Matatu" instead of "minibus"
   - "Stage" for bus stops
   - "Sacco" for operator organizations
   - "Tao" for fare

3. **Payment Integration**: Consider M-Pesa integration for future versions

4. **Language Support**: Implement Swahili translations for key terms

5. **Mobile-First Design**: Prioritize mobile experience (feature phones consideration)

### Cultural Considerations
- **Trust System**: Implement driver verification through Sacco membership
- **Community Reporting**: Allow passengers to report schedule updates
- **Offline Capability**: Cache recent schedules for offline viewing
- **Low Bandwidth**: Optimize for slow internet connections

---

## Required NPM Packages

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.3",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "socket.io": "^4.6.1",
    "express-validator": "^6.15.0",
    "helmet": "^6.1.5",
    "express-rate-limit": "^6.7.0"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "nodemon": "^2.0.22"
  }
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.10.0",
    "axios": "^1.3.6",
    "socket.io-client": "^4.6.1",
    "@heroicons/react": "^2.0.17",
    "react-hook-form": "^7.43.9",
    "date-fns": "^2.29.3"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3"
  }
}
```

---

## Success Metrics & Evaluation

### Technical Metrics
- [ ] All API endpoints return proper HTTP status codes
- [ ] Real-time updates work within 2 seconds
- [ ] Mobile responsive design (works on screens 320px+)
- [ ] Authentication system prevents unauthorized access
- [ ] Database queries optimized (response time < 200ms)

### Functional Metrics
- [ ] Users can register as drivers or passengers
- [ ] Drivers can create and manage schedules
- [ ] Passengers can search and view schedules
- [ ] Real-time updates reflect actual departures
- [ ] System handles at least 100 concurrent users

### User Experience Metrics
- [ ] Intuitive navigation for non-technical users
- [ ] Clear error messages in English/Swahili
- [ ] Works on basic Android devices
- [ ] Loads within 3 seconds on 3G connection
- [ ] Offline mode shows cached data

---

## Final Tips for Success

1. **Start Simple**: Begin with basic CRUD operations before adding real-time features
2. **Test Early**: Write tests as you develop, not after
3. **Documentation**: Keep your API documentation updated
4. **Version Control**: Use Git with meaningful commit messages
5. **Security**: Never store plain text passwords or expose sensitive data
6. **Performance**: Use database indexes and optimize queries
7. **User Feedback**: Test with potential users throughout development
8. **Error Handling**: Implement comprehensive error handling
9. **Scalability**: Design with growth in mind
10. **Local Testing**: Test with realistic Kenyan scenarios and data

Remember: This is a learning project. Focus on understanding each concept thoroughly rather than rushing through implementation. Good luck with your Matatu Scheduler application!