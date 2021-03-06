import AsyncStorage from '@react-native-async-storage/async-storage'
import type { GetCounts, PutCounts } from './Parent/Domain'

export class PersistService {
  private key: string

  constructor(key: string) {
    this.key = key
  }

  getCounts: GetCounts = async () => {
    const value = await AsyncStorage.getItem(this.key)
    if (!value) return { byId: {}, ids: [] }
    return JSON.parse(value)
  }

  putCounts: PutCounts = async (counts) => {
    await AsyncStorage.setItem(
      this.key,
      JSON.stringify(counts)
    )
  }
}

