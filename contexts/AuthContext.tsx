import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import apiUrl from "../app/utils/api_url.json";
import { router } from "expo-router";
import mqtt, { MqttClient } from "mqtt";
import { createMqttOptions } from "../app/utils/mqttOptions";
import { useLanguage } from "./LanguageContext";

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
  const { t } = useLanguage();
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

  const waitForConnection = () => {
    if (client.current?.connected) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const handleConnect = () => {
        clearTimeout(timeout);
        client.current?.removeListener("error", handleError);
        resolve();
      };

      const handleError = (error: Error) => {
        clearTimeout(timeout);
        client.current?.removeListener("connect", handleConnect);
        reject(error);
      };

      const timeout = setTimeout(() => {
        client.current?.removeListener("connect", handleConnect);
        client.current?.removeListener("error", handleError);
        reject(new Error(t("Tempo esgotado ao conectar ao broker MQTT em {{address}}", { address: API_URL })));
      }, 10000);

      client.current?.once("connect", handleConnect);
      client.current?.once("error", handleError);
      client.current?.reconnect();
    });
  };

  useEffect(() => {
    const options = {
      ...createMqttOptions(),
      reconnectPeriod: 1000,
      connectTimeout: 10000,
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
          } else {
            console.error(`❌ Erro ao se inscrever no tópico ${topic}:`, err);
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

    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const username = await SecureStore.getItemAsync("username");
      const loggedEmail = await SecureStore.getItemAsync("loggedEmail");
      const role = await SecureStore.getItemAsync("role");

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

    return () => {
      client.current?.end(true);
      client.current = null;
    };
  }, []);

  const waitForResponse = async (topicFilter: string) => {
    await waitForConnection();

    return new Promise<any>((resolve) => {
      const timeout = setTimeout(() => {
        client.current?.removeListener("message", handleMessage);
        resolve({
          verified: false,
          create: false,
          message: t("O servidor não respondeu. Verifique o broker MQTT e tente novamente."),
        });
      }, 10000);

      const handleMessage = (topic: string, message: Buffer) => {
        if (topic === topicFilter) {
          clearTimeout(timeout);
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

    await waitForConnection();
    const resultPromise = waitForResponse(topicResponse);
    client.current?.publish("user/cadastro", JSON.stringify(payload));
    const result = await resultPromise;

    return result;
  };

  const confirmOtpLogin = async (loggedEmail: string, otpValue?: string) => {
    const payload = {
      email: loggedEmail,
      otpValue,
      requestId: requestId.current,
    };
    const topicResponse = `user/confirmOtpResponse/${requestId.current}`;

    await waitForConnection();
    const responsePromise = waitForResponse(topicResponse);
    client.current?.publish("user/confirmOtp", JSON.stringify(payload));
    const response = await responsePromise;

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
      alert(t("Falha ao verificar o código inserido"));
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const payload = { email, senha: password, requestId: requestId.current };
    const topicResponse = `user/loginResponse/${requestId.current}`;

    await waitForConnection();
    if (!client.current?.connected) {
      throw new Error(t("Cliente MQTT não está conectado em {{address}}.", { address: API_URL }));
    }

    const resultPromise = waitForResponse(topicResponse);
    client.current.publish("user/login", JSON.stringify(payload), (error) => {
      if (error) {
        console.error("❌ Erro ao publicar login no MQTT:", error);
      }
    });
    const result = await resultPromise;

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
