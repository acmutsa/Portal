import { createContext, Dispatch, useContext, useState } from "react";

export interface GlobalContextProps {
	loggedIn: boolean;
	background: boolean;
}

export const initialState: GlobalContextProps = {
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
