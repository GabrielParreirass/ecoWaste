import { View, Text, Pressable, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PageTop from "../../../../../components/PageTop";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useAuth } from "../../../../../../contexts/AuthContext";
import mqtt, { MqttClient } from "mqtt";
import apiUrl from "../../../../../utils/api_url.json";
import { createMqttOptions } from "../../../../../utils/mqttOptions";

interface tipoColeta {
  peso: String;
  dia: String;
  horario: String;
  type: String;
  expira: String;
  status: String;
  id?: string; 
}

const ColetasEmEspera = () => {
  const API_URL = apiUrl.apiUrl;


  const { authState } = useAuth();
  const userEmail = authState?.loggedEmail;

  const [showEntulhos, setShowEntulhos] = useState(false);
  const [showResiduos, setShowResiduos] = useState(false);
  
  const [coletas, setColetas] = useState({ coletas: [] });
  const [filteredColetas, setFilteredColetas] = useState<tipoColeta[]>([]);
  const [currentFilter, setCurrentFilter] = useState("Todos"); // Novo estado para guardar o filtro ativo

  const client = useRef<MqttClient | null>(null);
  const requestId = useRef(Date.now().toString());
  const options = createMqttOptions();

  const cancelarColeta = (coleta: any) => {
    const payload = {
      coletaId: coleta.id,
      requestId: requestId.current,
    };
    client.current?.publish("user/cancelarColeta", JSON.stringify(payload));
    alert("Solicitação de cancelamento enviada! Aguarde...");
  };

  // Efeito para recriar a lista filtrada sempre que as coletas do servidor atualizarem ou o filtro mudar
  useEffect(() => {
    if (coletas && coletas.coletas) {
      if (currentFilter === "Todos") {
        setFilteredColetas(coletas.coletas);
      } else {
        const filtered = coletas.coletas.filter(
          (i: tipoColeta) => i.type === currentFilter
        );
        setFilteredColetas(filtered);
      }
    }
  }, [coletas, currentFilter]);

  useEffect(() => {
    if (!userEmail) return; // Evita tentar conectar antes de ter o email

    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(`user/getColetasResponse/${requestId.current}`);
      client.current?.subscribe(`user/cancelarColetaResponse/${requestId.current}`);

      // Assim que conecta, solicita as coletas
      const payload = {
        email: userEmail,
        requestId: requestId.current,
      };
      client.current?.publish("user/getColetas", JSON.stringify(payload));
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);
      
  
      if (topic === `user/getColetasResponse/${requestId.current}`) {
        try {
          const formatedColetas = JSON.parse(message.toString());
          setColetas(formatedColetas);
        } catch (e) {
          console.error("Erro ao parsear as coletas", e);
        }
      }

      if (topic === `user/cancelarColetaResponse/${requestId.current}`) {
        console.log("✅ Coleta cancelada pelo servidor! Buscando lista atualizada...");
        // Solicita a lista atualizada logo após o cancelamento confirmar
        const payload = {
          email: userEmail,
          requestId: requestId.current,
        };
        client.current?.publish("user/getColetas", JSON.stringify(payload));
      }
    });

    return () => {
      // Cleanup para evitar múltiplas conexões caso o componente desmonte
      if (client.current) {
        client.current.end();
      }
    };
  }, [userEmail]); // Depende do userEmail para inicializar corretamente


  return (
    <ScrollView>
      <PageTop />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <Ionicons name="time-outline" size={60} color="green" />
        </View>
      </View>

      {showEntulhos || showResiduos ? (
        <View>
          {showEntulhos ? (
            <ScrollView>
              <View style={styles.containerMainInfos}>
                {filteredColetas.map((i: tipoColeta, index: number) => (
                  <View key={index} style={styles.containerInfos}>
                    <Text style={styles.textInfos}>Tipo: {i.type}</Text>
                    <Text style={styles.textInfos}>Quantidade: {i.peso}</Text>
                    <Text style={styles.textInfos}>Dia: {i.dia}</Text>
                    <Text style={styles.textInfos}>Horário: {i.horario}</Text>
                    <Text style={styles.textInfos}>Expira em: {i.expira}</Text>
                    <Text style={styles.textInfos}>Status: {i.status}</Text>
                  </View>
                ))}

                <Pressable
                  onPress={() => setShowEntulhos(!showEntulhos)}
                  style={styles.button3}
                >
                  <Text style={styles.textButton}>Fechar</Text>
                </Pressable>
              </View>
            </ScrollView>
          ) : (
            <ScrollView>
              <View style={styles.containerMainInfos}>
                {filteredColetas.map((i: tipoColeta, index: number) => (
                  <View key={index} style={styles.containerInfos}>
                    <Text style={styles.textInfos}>Tipo: {i.type}</Text>
                    <Text style={styles.textInfos}>Quantidade: {i.peso}</Text>
                    <Text style={styles.textInfos}>Dia: {i.dia}</Text>
                    <Text style={styles.textInfos}>Horário: {i.horario}</Text>
                    <Text style={styles.textInfos}>Expira em: {i.expira}</Text>
                    <Text style={styles.textInfos}>Status: {i.status}</Text>
                    <View style={styles.containerButtons}>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#fabd06" }]}
                        onPress={() => {
                          // Função de editar aqui
                        }}
                      >
                        <Text style={styles.textButton}>Editar coleta</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#fa0606" }]}
                        onPress={() => cancelarColeta(i)}
                      >
                        <Text style={styles.textButton}>Cancelar coleta</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <Pressable
                  onPress={() => setShowResiduos(!showResiduos)}
                  style={styles.button3}
                >
                  <Text style={styles.textButton}>Fechar</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      ) : (
        <>
          <View>
            <Text style={styles.title}>
              Aqui estão suas solicitações de coleta. Clique para detalhes
            </Text>
          </View>
          <View style={styles.containerButtons}>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurrentFilter("Todos");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Todos</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurrentFilter("Papel");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Papel</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurrentFilter("Plastico");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Plástico</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurrentFilter("Vidro");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Vidro</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurrentFilter("Metal");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Metal</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurrentFilter("Organico");
                setShowResiduos(!showResiduos);
              }}
            >
              <Text style={styles.textButton}>Resíduo Orgânico</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => {
                setCurrentFilter("Entulhos");
                setShowEntulhos(!showEntulhos);
              }}
            >
              <Text style={styles.textButton}>Entulhos</Text>
            </Pressable>
          </View>
          <View style={styles.containerButtons}>
            <Pressable style={styles.button2} onPress={() => router.back()}>
              <Text style={styles.textButton}>Voltar</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default ColetasEmEspera;

const styles = StyleSheet.create({
  containerIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    backgroundColor: "white",
    borderRadius: 50, // Corrigido de "50%" para número (React Native padrão)
    width: 100,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
    borderColor: "#96cda9",
    borderWidth: 4,
  },
  title: {
    padding: 20,
    textAlign: "center",
    textTransform: "uppercase",
    color: "#0fa05f",
    fontWeight: "bold",
  },
  containerButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0fa05f",
    width: "70%",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    margin: 10,
    padding: 15,
    borderRadius: 20,
  },
  button2: {
    backgroundColor: "#0fa05f",
    marginTop: 80,
    width: "30%",
    display: "flex",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
  },
  button3: {
    backgroundColor: "#0fa05f",
    marginTop: 30,
    marginBottom: 30,
    width: "30%",
    display: "flex",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
  },
  textButton: {
    color: "white",
  },
  containerMainInfos: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  containerInfos: {
    backgroundColor: "#0fa05f",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    width: "90%",
    margin: "auto",
    borderRadius: 20,
    borderWidth: 8,
    borderColor: "#d7f3f3",
    marginTop: 20,
  },
  textInfos: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    margin: 10,
  },
});