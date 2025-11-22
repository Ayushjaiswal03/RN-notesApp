import AsyncStorage from "@react-native-async-storage/async-storage"

export async function save<T = any>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);           
    await AsyncStorage.setItem(key, json);         
  } catch (err) {
    console.error("storage.save error:", err);     
    throw err;
  }
}


export async function load<T = any>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key); 
    if (!json) return null;                        
    return JSON.parse(json) as T;                 
  } catch (err) {
    console.error("storage.load error:", err);
    throw err;
  }
}