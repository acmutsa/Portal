import { createContext, Dispatch, useContext, useState } from "react";

export interface GlobalContextProps {
	ready: boolean;
	loggedIn: boolean;
	background: boolean;
}

export const initialState: GlobalContextProps = {
	ready: false,
	loggedIn: false,
	background: true,
};
export const GlobalContext = createContext<[GlobalContextProps, Dispatch<GlobalContextProps>]>([
	initialState,
	() => {},
]);

export const useGlobalContext = () => {
	return useContext(GlobalContext);
};
