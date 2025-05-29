import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import apiUrl from "../utils/api_url.json";
import { router } from "expo-router";

interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    username: string | null;
    loggedEmail: string | null;
  };
  onRegister?: (name: string, email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onConfirmOtp?: (loggedEmail: string, otpValue?: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "jwt-token";
const API_URL = apiUrl.apiUrl;
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
    username: string | null;
    loggedEmail: string | null;
  }>({
    token: null,
    authenticated: false,
    username: null,
    loggedEmail: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const username = await SecureStore.getItemAsync("username");
      const loggedEmail = await SecureStore.getItemAsync("loggedEmail");
      const coletas = await SecureStore.getItemAsync("coletas");

      if (token) {
        setAuthState({
          token: token,
          authenticated: true,
          username,
          loggedEmail,
        });

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        console.log(
          "👀 usuario logado com o token: ",
          token,
          username,
          loggedEmail,
          coletas
        );

        router.navigate("/(private)/ecomorador/pages/home/page");
      } else {
        console.log(" ❌ Nenhum usuario logado!");
        router.navigate("/");
      }
    };
    loadToken();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const result = await axios.post(`${API_URL}/cadastro`, {
      name,
      email,
      password,
    });
    return result.data;
  };

  const confirmOtpLogin = async (loggedEmail: string, otpValue?: string) => {
    const response = await axios.post(`${API_URL}/confirmOtpLogin`, {
      email: loggedEmail,
      otpValue,
    });

    if (response.data.otpVerified) {
      const token = response.data.token;
      const authenticated = true;
      const username = response.data.username;

      setAuthState({
        token,
        authenticated,
        loggedEmail,
        username,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, token);

      await SecureStore.setItemAsync("username", username);

      await SecureStore.setItemAsync("loggedEmail", loggedEmail);

      router.navigate("/(private)/ecomorador/pages/home/page");

      return true;
    } else {
      window.alert("Falha ao verificar o código inserido");
    }
  };

  const login = async (email: string, password: string) => {
    const result = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    if (result.data.verified) {
      return true;
    } else {
      return false;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";

    console.log("realizando logout");

    setAuthState({
      token: null,
      authenticated: false,
      loggedEmail: null,
      username: null,
    });

    router.navigate("/");
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    onConfirmOtp: confirmOtpLogin,
    authState,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
