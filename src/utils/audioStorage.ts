/**
 * IndexedDB storage for custom user audio files (MP3, M4A, WAV, etc.)
 * Avoids localStorage 5MB quota limitation and allows direct high-quality audio files from mobile.
 */

const DB_NAME = 'RomanticAppAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_audio';
const AUDIO_KEY = 'user_song';

interface StoredAudio {
  id: string;
  blob: Blob;
  fileName: string;
  fileSize: number;
  mimeType: string;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCustomAudio(file: File | Blob, fileName: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record: StoredAudio = {
      id: AUDIO_KEY,
      blob: file,
      fileName: fileName || 'uploaded_song.mp3',
      fileSize: file.size,
      mimeType: file.type || 'audio/mpeg',
      updatedAt: Date.now(),
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getCustomAudio(): Promise<{ blob: Blob; fileName: string; fileSize: number } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(AUDIO_KEY);

      request.onsuccess = () => {
        const result = request.result as StoredAudio | undefined;
        if (result && result.blob) {
          resolve({
            blob: result.blob,
            fileName: result.fileName,
            fileSize: result.fileSize,
          });
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('Could not read custom audio from IndexedDB:', err);
    return null;
  }
}

export async function removeCustomAudio(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(AUDIO_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('Could not delete custom audio from IndexedDB:', err);
  }
}
