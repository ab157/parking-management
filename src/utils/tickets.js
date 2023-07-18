export const getTickets = async (cb) => {
  try {
    const res = await fetch("http://localhost:3031/tickets");
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    cb(null, data);
  } catch (err) {
    cb(err.message, null);
  }
};

export const createNewTicket = async (ticket, cb) => {
  try {
    const res = await fetch("http://localhost:3031/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });
    cb(null, res.status);
  } catch (err) {
    cb(err.message, null);
  }
};
