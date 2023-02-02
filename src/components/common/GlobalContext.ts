import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface GlobalContextProps {
	member: boolean | null;
	admin: boolean | null;
}

export const initialState: GlobalContextProps = {
	member: null,
	admin: null,
};

export const GlobalContext = createContext<
	[GlobalContextProps, Dispatch<SetStateAction<GlobalContextProps>>]
>([initialState, () => {}]);

export const useGlobalContext = () => {
	return useContext(GlobalContext);
};
