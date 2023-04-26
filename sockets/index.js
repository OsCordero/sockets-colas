const TicketControl = require("../api/models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.emit("last-ticket", ticketControl.last);
  socket.emit("last-four", ticketControl.lastFour);
  socket.emit("pending-tickets", ticketControl.tickets);
  socket.on("next-ticket", (payload, callback) => {
    const next = ticketControl.next();
    callback(next);
    socket.broadcast.emit("pending-tickets", next);
    socket.broadcast.emit("pending-tickets", ticketControl.tickets);
  });

  socket.on("attend-ticket", ({ desktop }, callback) => {
    if (!desktop) {
      return callback({ ok: false, msg: "El escritorio es obligatorio" });
    }
    const ticket = ticketControl.attend(desktop);
    if (!ticket) {
      callback({ ok: false, msg: "Ya no hay tickets pendientes" });
      return;
    }

    socket.broadcast.emit("last-four", ticketControl.lastFour);
    socket.emit("pending-tickets", ticketControl.tickets);
    callback({ ok: true, ticket });
  });
};

module.exports = { socketController };
