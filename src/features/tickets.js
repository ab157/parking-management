import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickets: [],
  isLoading: false,
  error: null,
  selectedTicket: {},
};

export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:3031/tickets");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue("No tickets found. ", error.message);
    }
  }
);

export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (newTicket) => {
    const res = await fetch("http://localhost:3031/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTicket),
    });

    const data = await res.json();
    return data;
  }
);

export const editTicket = createAsyncThunk(
  "tickets/updateTicket",
  async (updatedTicket) => {
    const res = await fetch(
      `http://localhost:3031/tickets/${updatedTicket.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updatedTicket),
      }
    );

    const data = await res.json();
    return data;
  }
);

const TicketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setSelectedTicket: (state, action) => {
      state.selectedTicket = state.tickets.find(
        (ticket) => ticket.id === action.payload.ticketId
      );
    },
  },
  extraReducers: (builder) => {
    // Fetching Tickets
    builder.addCase(fetchTickets.pending, (state) => (state.isLoading = true));
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tickets = action.payload;
    });
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // Create New Ticket
    builder.addCase(createTicket.pending, (state) => (state.isLoading = true));
    builder.addCase(createTicket.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tickets = [...state.tickets, action.payload];
    });
    builder.addCase(createTicket.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    // Edit ticket
    builder.addCase(editTicket.pending, (state) => (state.isLoading = true));
    builder.addCase(editTicket.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tickets = [...state.tickets, action.payload];
    });
    builder.addCase(editTicket.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const getTicketsState = (state) => state.tickets;
export const { setSelectedTicket } = TicketsSlice.actions;
export default TicketsSlice;
