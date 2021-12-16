import { useDataLayerValue } from "./DataLayer";
import { client } from "../ApolloProvider";
function useContextMethods() {
    const [, dispatch] = useDataLayerValue();

    const logout = async () => {
        if (localStorage.getItem("jwtToken")) {
            localStorage.removeItem("jwtToken");
            dispatch({ type: "LOGOUT" });
            await client.clearStore();
        }
    };

    const login = (userData) => {
        logout();
        localStorage.setItem("jwtToken", userData.token);

        dispatch({
            type: "LOGIN",
            payload: userData,
        });
    };
    return { login, logout };
}

export { useContextMethods };
