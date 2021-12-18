import React, { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "./reducer";

const DataLayerContext = createContext(); // removed export

export function DataLayer({ children }) {
    return (
        <DataLayerContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </DataLayerContext.Provider>
    );
}

export function useDataLayerValue() {
    return useContext(DataLayerContext);
}
