import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  // Estados para el login
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  
  // Estados para la cámara
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const validarLogin = () => {
    const validUser = "admin";
    const validPass = "1234";
    
    if (usuario === validUser && pass === validPass) {
      Alert.alert("Inicio de sesión exitoso");
      setLoggedIn(true);
    } else {
      Alert.alert("Usuario o contraseña incorrectos, intenta de nuevo");
    }
  };

  const cambiarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permiso denegado, se necesita acceso a las imágenes");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const abrirCamara = () => {
    setShowCamera(true);
  };

  const tomarFoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhoto(result.uri);
      setImageUrl(result.uri); // Usar la foto tomada como imagen de perfil
    }
  };

  const tomarOtraFoto = () => {
    setPhoto(null);
  };

  const cerrarCamara = () => {
    setShowCamera(false);
    setPhoto(null);
  };

  const cerrarSesion = () => {
    setLoggedIn(false);
    setUsuario("");
    setPass("");
    setImageUrl(null);
    setShowCamera(false);
    setPhoto(null);
  };

  // Pantalla de permisos de cámara
  if (!permission) return <View />;

  if (!permission.granted && showCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Necesitas permitir acceso a la cámara</Text>
        <Button title="Dar permiso" onPress={requestPermission} />
        <Button title="Cancelar" onPress={cerrarCamara} color="#666" />
      </View>
    );
  }

  // Pantalla de cámara con CameraView
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        {!photo ? (
          <>
            <CameraView ref={cameraRef} style={styles.cameraView} />
            <View style={styles.cameraButtons}>
              <TouchableOpacity style={styles.takePhotoButton} onPress={tomarFoto} />
              <TouchableOpacity style={styles.cancelButton} onPress={cerrarCamara}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Image source={{ uri: photo }} style={styles.previewImage} />
            <View style={styles.cameraButtons}>
              <TouchableOpacity style={styles.usePhotoButton} onPress={cerrarCamara}>
                <Text style={styles.usePhotoButtonText}>Usar foto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.takeAnotherButton} onPress={tomarOtraFoto}>
                <Text style={styles.takeAnotherButtonText}>Tomar otra</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  }

  // Pantalla principal
  return (
    <View style={styles.container}>
      {!loggedIn ? (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <TextInput 
            placeholder='Usuario' 
            value={usuario} 
            onChangeText={setUsuario} 
            style={styles.input}
          />
          <TextInput 
            placeholder='Contraseña' 
            value={pass} 
            onChangeText={setPass} 
            secureTextEntry 
            style={styles.input}
          />
          <TouchableOpacity onPress={validarLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <Text style={styles.welcomeText}>Bienvenido {usuario}</Text>
          
          <TouchableOpacity onPress={cambiarImagen}>
            <Image 
              source={{ uri: imageUrl || 'https://static.vecteezy.com/system/resources/previews/005/005/840/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg' }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
          
          <Text style={styles.changePhotoText}>Toca la imagen para cambiarla</Text>
          
          <View style={styles.photoButtons}>
            <TouchableOpacity onPress={abrirCamara} style={styles.cameraButton}>
              <Text style={styles.buttonText}>Abrir Cámara</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
              <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  cameraButtons: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    marginLeft: -40,  // Ajuste para centrar el botón
    alignItems: 'center',
  },
  takePhotoButton: {
    backgroundColor: '#007bff',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  usePhotoButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  usePhotoButtonText: {
    color: 'white',
    fontSize: 16,
  },
  takeAnotherButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  takeAnotherButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loginContainer: {
    width: '100%',
    padding: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  profileContainer: {
    width: '100%',
    padding: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  changePhotoText: {
    marginTop: 15,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
