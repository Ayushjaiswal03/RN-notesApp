import AsyncStorage from "@react-native-async-storage/async-storage"


// save -- store a JS value under `key`
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
    if (!json) return null; //Returns null if nothing found.                       
    return JSON.parse(json) as T;                 
  } catch (err) {
    console.error("storage.load error:", err);
    throw err;
  }
}

// remove -- delete key from AsyncStorage
export async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);            
  } catch (err) {
    console.error("storage.remove error:", err);
    throw err;
  }
}