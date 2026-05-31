"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "../lib/redux/store";

interface Props {
	children: React.ReactNode;
}

export default function SessionProviderWrapper({ children }: Props) {
	return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
