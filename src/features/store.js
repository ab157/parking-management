import { configureStore } from "@reduxjs/toolkit";
// import CreateSlice from "./CreateSlice";
import TicketsSlice from "./tickets";

const store = configureStore({
  reducer: {
    // [CreateSlice.name]: CreateSlice.reducer,
    [TicketsSlice.name]: TicketsSlice.reducer,
  },
});

export default store;
