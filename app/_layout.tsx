import { router, Stack } from "expo-router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { useSegments, usePathname } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

function MainLayout() {
  const { authState } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();

  useEffect(() => {
    if (authState?.authenticated && pathname.startsWith("/(auth)")) {
      console.log("Caiu aqui!!!!");
      router.replace("/(private)/ecomorador/pages/home/page");
    }
  }, [authState?.authenticated, pathname]);

  return (
    <>
      {authState?.authenticated ? (
        <Stack>
          <Stack.Screen
            name="(private)/ecomorador/pages/home/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/profile/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/solicitarColeta/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/solicitarColeta/coletasEmEspera/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/solicitarColeta/coletasAgendadas/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/solicitarColeta/confirmarColeta/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/solicitarColeta/novaColeta/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/ecocoins/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/ecocoins/transferirReceber/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/ecocoins/transferirReceber/pagar/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/ecocoins/transferirReceber/pagar/pagarComChave/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/ecocoins/transferirReceber/receber/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/ecocoins/transferirReceber/extrato/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/ecocoins/boasCausas/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/manutencao/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/beneficios/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/beneficios/iptu/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/beneficios/supermercado/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/beneficios/supermercado/meusCupons/page"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(private)/ecomorador/pages/beneficios/supermercado/cuponsDisponiveis/page"
            options={{ headerShown: false }}
          />
        </Stack>
      ) : (
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)/signUp/page"
            options={{ headerShown: false, title: "Cadastro" }}
          />
          <Stack.Screen
            name="(auth)/signUp/ecomorador/page"
            options={{ headerShown: false, title: "Cadastro" }}
          />
          <Stack.Screen
            name="(auth)/signUp/ecomorador/telaEcolixeira"
            options={{ headerShown: false, title: "Tela ecolixeira" }}
          />
          <Stack.Screen
            name="(auth)/logIn/page"
            options={{ headerShown: false, title: "Login" }}
          />
          <Stack.Screen
            name="(auth)/logIn/ecomorador/page"
            options={{ headerShown: false, title: "Login" }}
          />
        </Stack>
      )}
    </>
  );
}
