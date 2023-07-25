import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickets: [],
  isLoading: false,
  error: null,
};

export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async () => {
    const res = await fetch("http://localhost:3031/tickets");
    const data = await res.json();
    return data;
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

const TicketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
  },
});

export default TicketsSlice;
