const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http');                  // NEW
const https = require('https');
const { Server } = require('socket.io');       // NEW
const cors = require('cors');

const authRoutes = require('./routes/auth.route');
const productRoutes = require('./routes/product.route');
const favoriteRoutes = require('./routes/favourite.route');
const chatRoute = require('./routes/chat.route');
const reportRoutes = require('./routes/report.routes')
const adminRoutes = require('./routes/admin.route')


const connectDB = require('./db/connectDB');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);  // ✅ Create HTTP server


app.use((req, res, next) => {
  req.io = io;
  next();
});

const io = new Server(server, {                // ✅ Attach Socket.IO
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/chats', chatRoute);
app.use('/api/reports', reportRoutes)
app.use('/api/admin', adminRoutes)

io.on("connection", (socket) => {

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("send_message", (data) => {
    io.to(data.conversationId).emit("receive_message", data);
  });


});

const pingInterval = 14 * 60 * 1000; // 14 minutes
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'Server is awake' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Auto-ping logic
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000/api/ping'; // Replace with your Render URL + /api/ping in production
  setInterval(() => {
    const protocol = backendUrl.startsWith('https') ? https : http;
    protocol.get(backendUrl, (res) => {
      console.log(`[${new Date().toISOString()}] Pinged server to keep it awake. Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`Error pinging server: ${err.message}`);
    });
  }, pingInterval);
});
