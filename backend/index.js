const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const http = require('http');                  // NEW
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

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/chats', chatRoute);
app.use('/api/reports', reportRoutes)
app.use('/api/admin', adminRoutes)

// ✅ Socket.IO Logic
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Join conversation room
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined room: ${conversationId}`);
  });

  // Receive & broadcast messages
  socket.on("send_message", (data) => {
    /*
      data = {
        conversationId,
        senderId,
        text
      }
    */
    io.to(data.conversationId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
