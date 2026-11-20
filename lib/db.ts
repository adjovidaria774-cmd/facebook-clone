// Sauvegarde dans IndexedDB, la base de données du navigateur.
// Les données restent après un rafraîchissement ou la fermeture de la page.
const DB_NAME = "facebook-clone";
const STORE = "data"; // le « tiroir » qui contient nos données

// Ouvre la base (elle est créée à la première visite)
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Lit une valeur (undefined si rien n'a encore été enregistré sous cette clé)
export async function loadItem<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
    request.onsuccess = () => {
      db.close();
      resolve(request.result as T | undefined);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

// Enregistre une valeur (remplace l'ancienne)
export async function saveItem(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}
