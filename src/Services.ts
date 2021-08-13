import AsyncStorage from '@react-native-async-storage/async-storage'
import type { GetCount, PutCount } from './Domain'

export class PersistService {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  getCount: GetCount = async () => {
    const value = await AsyncStorage.getItem(this.key)
    return JSON.parse(value || '0')
  }

  putCount: PutCount = async (count) => {
    await AsyncStorage.setItem(
      this.key,
      `${count}`
    )
  }
}

