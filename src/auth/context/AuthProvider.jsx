import { useReducer, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import { types } from "../types/types";

export const AuthProvider = ({ children }) => {
    const initialState = JSON.parse(localStorage.getItem('authState')) || {
        logged: false,
        user: null
    };

    const onLogin = (user) => {
        const newState = { logged: true, user };
        localStorage.setItem('authState', JSON.stringify(newState));
        dispatch({ type: types.login, payload: user });
    };

    const onLogout = () => {
        localStorage.removeItem('authState');
        dispatch({ type: types.logout });
    };

    const [authState, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        localStorage.setItem('authState', JSON.stringify(authState));
    }, [authState]);

    return (
        <AuthContext.Provider value={{ ...authState, onLogin, onLogout, logged: authState.logged }}>
            {children}
        </AuthContext.Provider>
    );
};