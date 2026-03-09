import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  currentUser: { _id: string; name: string; email: string; avatar: string; friends: string[] } | null;
}

const userSlice = createSlice({
  name: "user",
  initialState: { currentUser: null } as UserState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserState["currentUser"]>) {
      state.currentUser = action.payload;
    },
    addFriend(state, action: PayloadAction<string>) {
      if (state.currentUser && !state.currentUser.friends.includes(action.payload)) {
        state.currentUser.friends.push(action.payload);
      }
    },
    removeFriend(state, action: PayloadAction<string>) {
      if (state.currentUser) {
        state.currentUser.friends = state.currentUser.friends.filter(id => id !== action.payload);
      }
    },
  },
});

export const { setCurrentUser, addFriend, removeFriend } = userSlice.actions;
export default userSlice.reducer;
