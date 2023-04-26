const lblEscritorio = document.querySelector("h1");
const lblTicket = document.querySelector("small");
const btnAttend = document.querySelector("button");
const divAlert = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);
divAlert.style.display = "none";

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es necesario");
}

const desktop = searchParams.get("escritorio");
lblEscritorio.innerText = desktop;

const socket = io();

socket.on("connect", () => {
  btnAttend.disabled = false;
});

socket.on("disconnect", () => {
  btnAttend.disabled = true;
});

socket.on("pending-tickets", (tickets) => {
  lblPendientes.innerHTML = "";
  tickets.slice(0, 4).map((ticket) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerText = `Ticket ${ticket.number}`;
    lblPendientes.appendChild(li);
  });
  if (tickets.length === 0) {
    lblPendientes.innerText = "No hay tickets pendientes";
  }

  if (tickets.length > 4) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerText = `...${tickets.length - 4} más`;
    lblPendientes.appendChild(li);
  }
});

btnAttend.addEventListener("click", () => {
  socket.emit("attend-ticket", { desktop }, ({ ok, ticket, msg }) => {
    if (!ok) {
      divAlert.style.display = "";
      divAlert.innerText = msg;
      return;
    }
    lblTicket.innerText = `Ticket ${ticket.number}`;
  });
});
