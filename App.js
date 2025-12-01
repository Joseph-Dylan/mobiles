import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return; // Prevenir múltiples escaneos al mismo tiempo
    setScanned(true);
    setScanResult(data);
    Alert.alert('QR Escaneado', `Datos: ${data}`);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permisos...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No tiene permisos para acceder a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanea el Código QR</Text>

      {/* Vista de la cámara */}
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          ref={cameraRef}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          type={Camera.Constants.Type.back} // Puedes cambiar a 'front' si quieres usar la cámara frontal
        >
          <View style={styles.cameraOverlay}>
            {/* Cualquier overlay que quieras agregar */}
            <Text style={styles.cameraInstructions}>Enfoca el QR</Text>
          </View>
        </Camera>
      </View>

      {/* Mostrar el resultado del escaneo */}
      {scanned && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Resultado del escaneo:</Text>
          <Text style={styles.resultData}>{scanResult}</Text>
          <TouchableOpacity style={styles.resetButton} onPress={() => setScanned(false)}>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cameraContainer: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
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
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
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
