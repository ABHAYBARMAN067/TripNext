import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AppState = {
	searchQuery: string;
	selectedCity: string;
};

const initialState: AppState = {
	searchQuery: "",
	selectedCity: "",
};

const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setSearchQuery: (state, action: PayloadAction<string>) => {
			state.searchQuery = action.payload;
		},
		setSelectedCity: (state, action: PayloadAction<string>) => {
			state.selectedCity = action.payload;
		},
		resetSearch: (state) => {
			state.searchQuery = "";
			state.selectedCity = "";
		},
	},
});

export const { resetSearch, setSearchQuery, setSelectedCity } =
	appSlice.actions;
export default appSlice.reducer;
