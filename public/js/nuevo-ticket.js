const socket = io();

const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCrear = document.querySelector("button");

console.log("Nuevo Ticket HTML");

socket.on("last-ticket", (last) => {
  lblNuevoTicket.innerText = `Ticket ${last}`;
});

socket.on("connect", () => {
  btnCrear.disabled = false;
});

socket.on("disconnect", () => {
  btnCrear.disabled = true;
});

btnCrear.addEventListener("click", () => {
  socket.emit("next-ticket", null, (ticket) => {
    console.log("desde el server", ticket);
    lblNuevoTicket.innerText = ticket;
  });
});
