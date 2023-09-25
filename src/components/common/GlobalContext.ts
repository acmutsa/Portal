import { createContext, Dispatch, SetStateAction, useContext } from "react";

// TODO: Should we separate the loading state from the unknown state? I don't like that we're checking the `member` property for null. Checking member + admin could be bundled together, in my opinion.
export interface GlobalContextProps {
	member: boolean | null;
	admin: boolean | null;
}

export const initialState: GlobalContextProps = {
	member: null,
	admin: null,
};

/**
 * GlobalContext provides a global state for the application.
 * Works just like useState, but the state is accessible from any component.
 * 
 * Right now, this is just used for sharing the user's login status across the app.
 * For anything heavier, look into using Zustand or Jotai. I would stay away from Redux unless there is an explicit reasoning.
 */
export const GlobalContext = createContext<
	[GlobalContextProps, Dispatch<SetStateAction<GlobalContextProps>>]
>([initialState, () => {}]);

export const useGlobalContext = () => {
	return useContext(GlobalContext);
};
