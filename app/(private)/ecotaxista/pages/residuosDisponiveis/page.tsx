import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import PageTop from "../../../../components/PageTop";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import DefaultButton from "../../../../components/DefaultButton";
import { router } from "expo-router";
import CardNovaColeta from "../../../../components/CardNovaColeta";
import * as Location from "expo-location";
import { LocationObjectCoords } from "expo-location";
import { useAuth } from "../../../../../contexts/AuthContext";
import mqtt, { MqttClient } from "mqtt";
import apiUrl from "../../../../utils/api_url.json";
import CustomModal from "../../../../components/popUps/CustomModal";
import { createMqttOptions } from "../../../../utils/mqttOptions";
import { WebView } from "react-native-webview";

// Função responsável por gerar o mapa usando Leaflet e OpenStreetMap
const gerarMapaHTML = (latitude: number, longitude: number, coletas: any[]) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { padding: 0; margin: 0; }
        #map { width: 100%; height: 100vh; }
        .custom-div-icon {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false // Oculta os botões de + e - para um visual mais limpo (opcional)
        }).setView([${latitude}, ${longitude}], 14);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const coletas = ${JSON.stringify(coletas)};
        
        coletas.forEach(function(coleta) {
          var color = coleta.horario == "--" ? "green" : "orange";
          
          var customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div style='background-color:" + color + "; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);'></div>",
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          var marker = L.marker([parseFloat(coleta.latitude), parseFloat(coleta.longitude)], {icon: customIcon}).addTo(map);
          
          marker.on('click', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify(coleta));
          });
        });
      </script>
    </body>
    </html>
  `;
};

const ResiduosDisponiveis = () => {
  const [materialSelecionado, setMaterialSelecionado] = useState("");
  const [showList, setShowList] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [coletas, setColetas] = useState({ coletas: [] });
  const [selectedColeta, setSelectedColeta] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const API_URL = apiUrl.apiUrl;
  const client = useRef<MqttClient | null>(null);
  const { authState } = useAuth();
  const userEmail = authState?.loggedEmail;

  const requestId = useRef(Date.now().toString());

  const [tranca, setTranca] = useState("");
  const [ultrassom, setUltrassom] = useState("");
  const [ajuda, setAjuda] = useState("");

  const coletasFiltradas =
    materialSelecionado === "Entulhos"
      ? coletas.coletas
      : coletas.coletas.filter(
          (c: any) =>
            c.type === materialSelecionado && c.status === "disponivel",
        );

  const options = createMqttOptions();

  useEffect(() => {
    client.current = mqtt.connect(API_URL, options);

    client.current.on("connect", () => {
      console.log("✅ Conectado ao broker MQTT");

      client.current?.subscribe(
        `user/getAllColetasResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/getAllColetasResponse/${requestId.current}`,
            );
          }
        },
      );

      client.current?.subscribe(
        `user/reservarColetaResponse/${requestId.current}`,
        (err) => {
          if (!err) {
            console.log(
              `📡 Inscrito no tópico user/reservarColetaResponse/${requestId.current}`,
            );
          }
        },
      );

      client.current?.subscribe("EcoWaste/tranca", (err) => {
        if (!err) console.log("Inscrito em EcoWaste/tranca");
      });

      client.current?.subscribe("EcoWaste/ultrassom", (err) => {
        if (!err) console.log("Inscrito em EcoWaste/ultrassom");
      });

      client.current?.subscribe("EcoWaste/ajuda", (err) => {
        if (!err) console.log("Inscrito em EcoWaste/ajuda");
      });
    });

    client.current.on("message", (topic, message) => {
      console.log(`📨 Mensagem no tópico ${topic}: ${message.toString()}`);

      if (topic == `user/getAllColetasResponse/${requestId.current}`) {
        const formatedColetas = JSON.parse(message.toString());
        setColetas(formatedColetas);
      }
      if (topic == `user/reservarColetaResponse/${requestId.current}`) {
        const formatedData = JSON.parse(message.toString());
        window.alert(formatedData.message);

        const payload = {
          email: userEmail,
          requestId: requestId.current,
        };
        client.current?.publish("user/getAllColetas", JSON.stringify(payload));
      }

      if (topic === "EcoWaste/tranca") {
        setTranca(message.toString());
      }
      if (topic === "EcoWaste/ultrassom") {
        setUltrassom(message.toString());
      }
      if (topic === "EcoWaste/ajuda") {
        setAjuda(message.toString());
      }
    });

    const payload = {
      email: userEmail,
      requestId: requestId.current,
    };
    client.current?.publish("user/getAllColetas", JSON.stringify(payload));

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão de localização negada");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const handleAgendarColeta = (selectedColeta: any) => {
    const payload = {
      idColeta: selectedColeta.id,
      coletor: userEmail,
      requestId: requestId.current,
    };
    client.current?.publish("user/reservarColeta", JSON.stringify(payload));
  };

  return (
    <ScrollView>
      <PageTop profile={false} />
      <View style={styles.containerIcon}>
        <View style={styles.icon}>
          <FontAwesome5 name="map-marked-alt" size={60} color="green" />
        </View>
      </View>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>Qual material deseja coletar:</Text>
      </View>

      {materialSelecionado ? (
        <View>
          {showHome ? (
            <View>
              <Text style={styles.title}>
                Material selecionado: {materialSelecionado}
              </Text>
              <View style={styles.containerCards}>
                <Pressable
                  style={styles.card2}
                  onPress={() => {
                    setShowMap(true);
                    setShowHome(false);
                  }}
                >
                  <FontAwesome5 name="map-marked-alt" size={60} color="white" />
                  <Text style={styles.textCard}>Ver no mapa</Text>
                </Pressable>
              </View>
              <View style={{ width: "70%", margin: "auto" }}>
                <DefaultButton
                  text={"Voltar"}
                  onPressButton={() => router.back()}
                />
              </View>
            </View>
          ) : null}

          {showMap ? (
            <View style={styles.mapContainer}>
              <Text style={styles.title}>Locais de coleta próximos</Text>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "green" }]}
                  />
                  <Text style={styles.legendText}>Disponíveis</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "orange" }]}
                  />
                  <Text style={styles.legendText}>Encontro</Text>
                </View>
              </View>

              {coletasFiltradas.length === 0 ? (
                <Text style={{ textAlign: "center", marginVertical: 20 }}>
                  Nenhuma coleta disponível para o material selecionado.
                </Text>
              ) : (
                <View style={styles.map}>
                  <WebView
                    originWhitelist={["*"]}
                    source={{
                      html: gerarMapaHTML(
                        location ? location.latitude : -22.256755,
                        location ? location.longitude : -45.696073,
                        coletasFiltradas
                      ),
                    }}
                    style={{ flex: 1 }}
                    onMessage={(event) => {
                      try {
                        const coletaClicada = JSON.parse(
                          event.nativeEvent.data
                        );
                        setSelectedColeta(coletaClicada);
                        setModalVisible(true);
                      } catch (error) {
                        console.log("Erro ao processar clique no mapa", error);
                      }
                    }}
                  />
                </View>
              )}

              <View style={styles.mapButtonContainer}>
                <DefaultButton
                  text="Voltar"
                  onPressButton={() => {
                    setShowMap(false);
                    setShowHome(true);
                  }}
                />
              </View>
            </View>
          ) : null}

          {showList ? (
            <View>
              <View style={styles.containerTitle}>
                <Text style={styles.title}>
                  Selecione da lista ou pesquise pelo código.
                </Text>
              </View>

              <View style={styles.containerInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Pesquisar código"
                />
                <Pressable style={styles.btnInput}>
                  <FontAwesome5 name="search" size={24} color="white" />
                </Pressable>
              </View>
              <View style={styles.containerKeys}>
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendColor, { backgroundColor: "green" }]}
                    />
                    <Text style={styles.legendText}>Disponíveis</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        { backgroundColor: "orange" },
                      ]}
                    />
                    <Text style={styles.legendText}>Encontro</Text>
                  </View>
                </View>
                {coletasFiltradas.map((i: any, index: any) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.key,
                      {
                        backgroundColor: i.horario == "--" ? "green" : "orange",
                      },
                    ]}
                    onPress={() => {
                      setSelectedColeta(i);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.textKeys}>
                      {i.type}: {i.peso}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={{ width: "70%", margin: "auto", paddingTop: 10 }}>
                <DefaultButton
                  text={"Voltar"}
                  onPressButton={() => {
                    setShowList(false);
                    setShowHome(true);
                  }}
                />
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.mainContainerCards}>
          <View style={styles.subContainerCards}>
            <CardNovaColeta
              text="Papel"
              background="blue"
              onPressCard={() => setMaterialSelecionado("Papel")}
            />
            <CardNovaColeta
              text="Metal"
              background="#ffb800"
              onPressCard={() => setMaterialSelecionado("Metal")}
            />
          </View>
          <View style={styles.subContainerCards}>
            <CardNovaColeta
              text="Plástico"
              background="red"
              onPressCard={() => setMaterialSelecionado("Plastico")}
            />
            <CardNovaColeta
              text="Orgânicos"
              background="brown"
              onPressCard={() => setMaterialSelecionado("Organico")}
            />
          </View>
          <View style={styles.subContainerCards}>
            <CardNovaColeta
              text="Vidro"
              background="green"
              onPressCard={() => setMaterialSelecionado("Vidro")}
            />
            <CardNovaColeta
              text="Entulhos"
              background="gray"
              onPressCard={() => setMaterialSelecionado("Entulhos")}
            />
          </View>
        </View>
      )}

      {selectedColeta && (
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          message={`Material selecionado: ${selectedColeta.type} \n Quantidade: ${selectedColeta.peso} \n Horario: ${selectedColeta.horario} \n Dia da semana: ${selectedColeta.dia}`}
          showInput={false}
          confirmButtonText="Agendar"
          onConfirm={() => {
            handleAgendarColeta(selectedColeta);
            setModalVisible(false);
          }}
        />
      )}
    </ScrollView>
  );
};

export default ResiduosDisponiveis;

const styles = StyleSheet.create({
  containerIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    backgroundColor: "white",
    borderRadius: 50,
    width: 100,
    height: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
    borderColor: "#96cda9",
    borderWidth: 4,
  },
  containerTitle: {
    maxWidth: "90%",
    margin: "auto",
    padding: 10,
  },
  title: {
    textAlign: "center",
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  containerBtns: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 30,
  },
  mainContainerCards: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    gap: 20,
    marginTop: 20,
    padding: 10,
  },
  subContainerCards: {
    display: "flex",
    flexDirection: "column",
    width: "30%",
    gap: 20,
  },
  card: {
    width: "25%",
  },
  card2: {
    backgroundColor: "#0fa05f",
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 175,
    width: 150,
    borderRadius: 10,
  },
  textCard: {
    color: "#fff",
    paddingTop: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  containerCards: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  mapContainer: {
    marginVertical: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 20,
    backgroundColor: "#e0f7ec",
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 100,
  },
  map: {
    width: "100%",
    height: 400,
  },
  mapButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
  },
  containerInput: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
  },
  input: {
    borderBottomColor: "#96cda9",
    borderBottomWidth: 2,
    width: "70%",
  },
  btnInput: {
    backgroundColor: "#0fa05f",
    padding: 8,
    borderRadius: 100,
  },
  containerKeys: {
    backgroundColor: "#96cda9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
    marginBottom: 30,
    width: "90%",
    padding: 20,
    margin: "auto",
    borderRadius: 15,
  },
  key: {
    padding: 15,
    backgroundColor: "#096600",
    width: "70%",
    borderRadius: 15,
  },
  textKeys: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});