import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User { _id: string; name: string; email: string; avatar: string; friends: string[]; }
interface UserState { currentUser: User | null; }

const userSlice = createSlice({
  name: "user",
  initialState: { currentUser: null } as UserState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<User | null>) { state.currentUser = action.payload; },
    addFriend(state, action: PayloadAction<string>) {
      if (state.currentUser && !state.currentUser.friends.includes(action.payload))
        state.currentUser.friends.push(action.payload);
    },
    removeFriend(state, action: PayloadAction<string>) {
      if (state.currentUser)
        state.currentUser.friends = state.currentUser.friends.filter(id => id !== action.payload);
    },
    logout(state) { state.currentUser = null; },
  },
});

export const { setCurrentUser, addFriend, removeFriend, logout } = userSlice.actions;
export default userSlice.reducer;
