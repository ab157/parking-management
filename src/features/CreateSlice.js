import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  tickets: [],
  error: null,
  isLoading: false,
};

const CreateSlice = createSlice({
  name: "create",
  initialState,
  reducers: {
    closeModal: (state) => {
      state.isOpen = true;
    },
  },
});

export default CreateSlice;

/*
export const fetchTickets = createAsyncThunk(
  "create/fetchTickets",
  async () => {
    const res = await axios("http://localhost:3031/tickets");
    const data = await res.json();

    return data;
  }
);

extraReducers: (builder) => {
    builder.addCase(fetchTickets.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tickets = action.payload;
    });
    builder.addCase(fetchTickets.rejected, (state, action) => {
      (state.isLoading = false), (state.error = action.error.message);
    });
  },
*/
