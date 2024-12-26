const socketIo = require('socket.io');

let io;
const campaignOwners = {};

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*", // Adjust for frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Register campaign owner
    socket.on('registerOwner', (campaignId) => {
      campaignOwners[campaignId] = socket.id;
      console.log(`Campaign owner of campaign id ${campaignId} registered with socket ID ${socket.id}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      for (const campaignId in campaignOwners) {
        if (campaignOwners[campaignId] === socket.id) {
          delete campaignOwners[campaignId];
          console.log(`Campaign owner pf campaign id ${campaignId} disconnected`);
        }
      }
    });
  });
};

const notifyCampaignOwner = (campaignId, message) => {
  const socketId = campaignOwners[campaignId];
  if (socketId) {
    io.to(socketId).emit('newReplyNotification', message);
    console.log(`Notification sent to campaign owner ${campaignId}: ${message}`);
  } else {
    console.log(`No active connection for campaign owner ${campaignId}`);
  }
};

module.exports = { initializeSocket, notifyCampaignOwner };
