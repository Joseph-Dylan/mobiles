import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState('');

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setScanResult(data);

    Alert.alert(
      'QR Escaneado',
      `Datos: ${data}`,
      [
        {
          text: 'Abrir en navegador',
          onPress: () => {
            if (Linking.canOpenURL(data)) {
              Linking.openURL(data);
            } else {
              Alert.alert("Error", "El código no contiene una URL válida.");
            }
          }
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  if (!permission) {
    return <Text>Cargando permisos...</Text>;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>No tiene permisos para acceder a la cámara</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Permitir acceso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanea el Código QR</Text>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        >
          <View style={styles.cameraOverlay}>
            <Text style={styles.cameraInstructions}>Enfoca el QR</Text>
          </View>
        </CameraView>
      </View>

      {scanned && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Resultado del escaneo:</Text>
          <Text style={styles.resultData}>{scanResult}</Text>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.resetButtonText}>Escanear de nuevo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cameraContainer: {
    width: '100%',
    height: '60%',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraInstructions: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultData: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#8B2453',
    padding: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
