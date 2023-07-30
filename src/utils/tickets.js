import { v4 as uuidv4 } from "uuid";

// To get all tickets
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

// To create new ticket
export const createNewTicket = async (ticket, cb) => {
  const newTicket = {
    id: uuidv4(),
    ...ticket,
  };
  try {
    const res = await fetch("http://localhost:3031/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTicket),
    });
    cb(null, res.status);
  } catch (err) {
    cb(err.message, null);
  }
};

// To edit ticket
export const editTicket = async (updatedTicket, cb) => {
  try {
    await fetch(`http://localhost:3031/tickets/${updatedTicket.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedTicket),
    });
    cb(null, updatedTicket);
  } catch (err) {
    cb(err.message, null);
  }
};

export function getHeadersForTicketsTable(userRole) {
  let headers = [
    {
      key: "id",
      header: "Ticket ID",
    },
    {
      key: "carNo",
      header: "Car No",
    },
    {
      key: "parkingFrom",
      header: "Parking From",
    },
    {
      key: "timeFrom",
      header: "Time From",
    },
    {
      key: "parkingTo",
      header: "Parking To",
    },
    {
      key: "timeTill",
      header: "Time Till",
    },
    {
      key: "parkingSlot",
      header: "Parking Slot",
    },
    {
      key: "status",
      header: "Status",
    },
    {
      key: "actions",
      header: "",
    },
  ];

  if (userRole !== "USER") {
    headers = [
      ...headers.slice(0, headers.length - 1),
      {
        key: "userName",
        header: "User Name",
      },
      headers[headers.length - 1],
    ];
  }
  return headers;
}

export const parkingSlots = [
  {
    id: "P1A",
    label: "P1A",
  },
  {
    id: "P1B",
    label: "P1B",
  },
  {
    id: "P1C",
    label: "P1C",
  },
  {
    id: "P1D",
    label: "P1D",
  },
  {
    id: "P1E",
    label: "P1E",
  },
  {
    id: "P1F",
    label: "P1F",
  },
  {
    id: "P1G",
    label: "P1G",
  },
  {
    id: "P1I",
    label: "P1I",
  },
];
