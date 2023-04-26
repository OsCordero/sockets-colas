const lblEscritorio = document.querySelector("h1");
const lblTicket = document.querySelector("small");
const btnAttend = document.querySelector("button");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es necesario");
}

const desktop = searchParams.get("escritorio");
lblEscritorio.innerText = desktop;

const socket = io();

socket.on("last-ticket", (last) => {
  //   lblNuevoTicket.innerText = `Ticket ${last}`;
});

socket.on("connect", () => {
  btnAttend.disabled = false;
});

socket.on("disconnect", () => {
  btnAttend.disabled = true;
});

btnAttend.addEventListener("click", () => {
  socket.emit("attend-ticket", { desktop }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerText = msg;
      return;
    }
    lblTicket.innerText = `Ticket ${ticket.number}`;
  });
});
