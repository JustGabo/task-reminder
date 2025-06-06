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

export default function LoginScreen() {
  const [matricula, setMatricula] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Validaciones iniciales
      if (!matricula || !password) {
        Alert.alert('Error', 'Por favor complete todos los campos');
        return;
      }

      // Validate matricula format: YY-XXXX-X-XXX
      const matriculaRegex = /^\d{2}-[A-Z]{4}-\d{1}-\d{3}$/;
      if (!matriculaRegex.test(matricula)) {
        Alert.alert('Error', 'La matrícula debe tener el formato: YY-XXXX-X-XXX');
        return;
      }

      // Validate password (6 digits)
      if (!/^\d{6}$/.test(password)) {
        Alert.alert('Error', 'La contraseña debe ser de 6 dígitos numéricos');
        return;
      }

      setIsLoading(true);

      // 1. Primero validamos con el backend de INTEC
      const backendResponse = await fetch('https://homework-backend-production.up.railway.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, password }),
      });

      if (!backendResponse.ok) {
        const data = await backendResponse.json();
        throw new Error(data.message || 'Credenciales inválidas');
      }

      const userData = await backendResponse.json();
      const { nombreCompleto, primerNombre } = userData;

      // 2. Si las credenciales son válidas en INTEC, intentamos login en Supabase
      const email = `${matricula}@gmail.com`;
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        // Si el usuario no existe en Supabase, lo registramos
        if (supabaseError.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
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

          if (signUpError) throw signUpError;
          
          Alert.alert(
            'Cuenta creada',
            'Tu cuenta ha sido creada automáticamente. Por favor, inicia sesión nuevamente.',
            [{ text: 'OK' }]
          );
          return;
        }
        throw supabaseError;
      }

      router.replace('/');

    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo iniciar sesión');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Sign in if you already have an account.</Text>
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
              maxLength={15}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
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

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('signup')}>
              <Text style={styles.registerLink}>Register</Text>
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
  loginButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  registerLink: {
    color: '#007AFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
});
