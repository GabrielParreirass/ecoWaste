import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import apiUrl from "../app/utils/api_url.json";
import { router } from "expo-router";
import mqtt, { MqttClient } from "mqtt";
import { createMqttOptions } from "../app/utils/mqttOptions";

interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    username: string | null;
    loggedEmail: string | null;
  };
  onRegister?: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<any>;
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
  const client = useRef<MqttClient | null>(null);
  const requestId = useRef(Date.now().toString());

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const username = await SecureStore.getItemAsync("username");
      const loggedEmail = await SecureStore.getItemAsync("loggedEmail");
      const role = await SecureStore.getItemAsync("role");
      const options = {
        clientId: "frontend_" + Math.random().toString(16).substr(2, 8),
        username: "csilab", 
        password: "WhoAmI#2024", 
      };

      client.current = mqtt.connect(API_URL, options);

      client.current.on("connect", () => {
        console.log("✅ Conectado ao broker MQTT");

        const topics = [
          `user/cadastroResponse/${requestId.current}`,
          `user/confirmOtpResponse/${requestId.current}`,
          `user/loginResponse/${requestId.current}`,
        ];

        topics.forEach((topic) => {
          client.current?.subscribe(topic, (err) => {
            if (!err) {
              console.log(`📡 Inscrito no tópico ${topic}`);
            }
          });
        });
      });

      client.current.on("close", () => {
        console.log("❌ Conexão com broker MQTT foi encerrada");
      });

      client.current.on("error", (err) => {
        console.error("❌ Erro no cliente MQTT:", err);
      });

      client.current.on("offline", () => {
        console.log("⚠️ Cliente MQTT offline");
      });

      if (token) {
        setAuthState({
          token,
          authenticated: true,
          username,
          loggedEmail,
        });

        if (role == "ecomorador") {
          router.navigate("/(private)/ecomorador/pages/home/page");
        } else if (role == "ecotaxista") {
          router.navigate("/(private)/ecotaxista/pages/home/page");
        }
      } else {
        console.log("❌ Nenhum usuario logado!");
        router.navigate("/");
      }
    };

    loadToken();
  }, []);

  const waitForResponse = (topicFilter: string) => {
    return new Promise<any>((resolve) => {
      const handleMessage = (topic: string, message: Buffer) => {
        if (topic === topicFilter) {
          const parsed = JSON.parse(message.toString());
          resolve(parsed);
          client.current?.removeListener("message", handleMessage);
        }
      };

      client.current?.on("message", handleMessage);
    });
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    const payload = {
      name,
      email,
      password,
      requestId: requestId.current,
      role,
    };
    const topicResponse = `user/cadastroResponse/${requestId.current}`;

    client.current?.publish("user/cadastro", JSON.stringify(payload));
    const result = await waitForResponse(topicResponse);

    return result;
  };

  const confirmOtpLogin = async (loggedEmail: string, otpValue?: string) => {
    const payload = {
      email: loggedEmail,
      otpValue,
      requestId: requestId.current,
    };
    const topicResponse = `user/confirmOtpResponse/${requestId.current}`;

    client.current?.publish("user/confirmOtp", JSON.stringify(payload));
    const response = await waitForResponse(topicResponse);

    if (response.otpVerified) {
      const { token, username, role } = response;

      setAuthState({
        token,
        authenticated: true,
        loggedEmail,
        username,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync("username", username);
      await SecureStore.setItemAsync("loggedEmail", loggedEmail);
      await SecureStore.setItemAsync("role", role);

      if (role == "ecomorador") {
        router.navigate("/(private)/ecomorador/pages/home/page");
      } else if (role == "ecotaxista") {
        router.navigate("/(private)/ecotaxista/pages/home/page");
      }

      return true;
    } else {
      alert("Falha ao verificar o código inserido");
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const payload = { email, senha: password, requestId: requestId.current };
    const topicResponse = `user/loginResponse/${requestId.current}`;

    client.current?.publish("user/login", JSON.stringify(payload));
    const result = await waitForResponse(topicResponse);

    return result.verified;
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
