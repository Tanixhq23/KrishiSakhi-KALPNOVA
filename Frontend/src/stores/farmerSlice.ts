import { createSlice } from '@reduxjs/toolkit';

const farmerSlice = createSlice({
  name: 'farmer',
  initialState: { profile: null, activities: [] },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    addActivity: (state, action) => {
      state.activities.push(action.payload);
    },
  },
});

export const { setProfile, addActivity } = farmerSlice.actions;
export default farmerSlice.reducer;
