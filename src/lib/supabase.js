import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

// Custom storage adapter that works for both web and mobile
const customStorageAdapter = {
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key)
    } catch (error) {
      return null
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
      return null
    } catch (error) {
      return null
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key)
      return null
    } catch (error) {
      return null
    }
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})