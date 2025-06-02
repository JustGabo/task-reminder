import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function SignUpScreen() {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      // Validaciones iniciales
      if (!matricula || !password) {
        Alert.alert('Error', 'Por favor complete todos los campos');
        return;
      }

      // Validate matricula format: YY-XXXX-X-XXX
      const matriculaRegex = /^\d{2}-[A-Z]{4}-\d{1}-\d{3}$/;
      if (!matriculaRegex.test(matricula)) {
        Alert.alert('Error', 'La matrícula debe tener el formato: YY-XXXX-X-XXX\nEjemplo: 23-EISN-9-123');
        return;
      }

      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        Alert.alert('Error', 'La contraseña debe tener:\n' + passwordErrors.join('\n'));
        return;
      }

      setIsLoading(true);

      try {
        const backendResponse = await fetch('https://homework-backend-production.up.railway.app/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matricula, password }),
        });

        const userData = await backendResponse.json();
        
        if (!backendResponse.ok) {
          throw new Error(userData.message || 'Credenciales inválidas');
        }

        const { nombreCompleto, primerNombre } = userData;

        // 2. Si las credenciales son válidas, registrar en Supabase
        const email = `${matricula}@gmail.com`;
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              matricula,
              email_verified: true,
              nombre_completo: nombreCompleto,
              primer_nombre: primerNombre,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        Alert.alert(
          'Registro exitoso',
          'Tu cuenta ha sido creada correctamente',
          [{ text: 'OK', onPress: () => router.replace('login') }]
        );
      } catch (fetchError) {
        throw fetchError;
      }

    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo completar el registro');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePassword = (pass) => {
    const isNumeric = /^\d{6}$/.test(pass);
    const errors = [];
    
    if (!isNumeric) {
      errors.push('La contraseña debe ser de 6 dígitos numéricos');
    }

    return errors;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          {/* <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
          <Text style={styles.title}>Register</Text>
          <Text style={styles.subtitle}>Create an account to get started on loate.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={matricula}
              onChangeText={(text) => {
                // Convert to uppercase
                const upperText = text.toUpperCase();
                // Remove any spaces
                const noSpaces = upperText.replace(/\s/g, '');
                setMatricula(noSpaces);
              }}
              placeholder="Matrícula"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="characters"
              maxLength={15}  // Length including hyphens
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              secureTextEntry={!showPassword}
              placeholder="Password"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric"
              maxLength={6}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.passwordHelper}>
            La contraseña debe ser tu PIN de INTEC (6 dígitos)
          </Text> */}

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={() => {
              handleSignUp();
            }}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('login')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 70
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter_400Regular',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  registerButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  passwordHelper: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginLeft: 4,
    lineHeight: 18,
  },
}); 