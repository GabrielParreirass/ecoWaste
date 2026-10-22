import { useLanguage } from "../../contexts/LanguageContext";
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

const QRCodeScanner = ({ onScan }:any) => {
  const { t } = useLanguage();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    onScan(result.data);
  };

  if (!permission) {
    return <Text>{t("Solicitando permissão para acessar a câmera...")}</Text>;
  }

  if (!permission.granted) {
    return <Text>{t("Permissão para câmera negada.")}</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      {scanned && (
        <Button title={t("Ler novamente")} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

export default QRCodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
});
