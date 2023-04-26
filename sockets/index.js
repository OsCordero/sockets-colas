const TicketControl = require("../api/models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  console.log("Client connected", socket.id);

  socket.emit("last-ticket", ticketControl.last);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });

  socket.on("next-ticket", (payload, callback) => {
    const next = ticketControl.next();
    callback(next);
    // socket.broadcast.socketemit("next-ticket", payload);
  });

  socket.on("attend-ticket", ({ desktop }, callback) => {
    if (!desktop) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }
    const ticket = ticketControl.attend(desktop);
    socket.broadcast.emit("last-four", ticketControl.lastFour);
    callback({
      ok: true,
      ticket,
    });
  });
};

module.exports = { socketController };
