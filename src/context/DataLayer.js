import React, { createContext, useContext, useReducer } from 'react';
import { initialState, reducer } from "./reducer";

const DataLayerContext = createContext();

const DataLayer = ({ children }) => (
    <DataLayerContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </DataLayerContext.Provider>
);

const useDataLayerValue = () => useContext(DataLayerContext);

export { DataLayerContext, DataLayer, useDataLayerValue };