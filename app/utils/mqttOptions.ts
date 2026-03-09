export const createMqttOptions = () => {
  return {
    clientId: "frontend_" + Math.random().toString(16).substring(2, 8),
    username: "csilab",
    password: "WhoAmI#2024",
  };
};