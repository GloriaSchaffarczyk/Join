// storage.js
const STORAGE_URL = 'https://join-storage-14e4e-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * Speichert einen Wert unter einem bestimmten Key in der Firebase Realtime Database.
 *
 * @param {string} key - Der Key, unter dem der Wert gespeichert werden soll.
 * @param {any} value - Der zu speichernde Wert (Objekt, Array oder primitive Daten).
 * @returns {Promise<object>} - Ein Promise, das das Ergebnis der Anfrage zurückgibt.
 */
async function setItem(key, value) {
  return fetch(`${STORAGE_URL}${key}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`Fehler beim Speichern: ${res.status} ${res.statusText}`);
    }
    return res.json();
  });
}

/**
 * Ruft einen Wert unter einem bestimmten Key aus der Firebase Realtime Database ab.
 *
 * @param {string} key - Der Key, unter dem der Wert gespeichert ist.
 * @returns {Promise<any>} - Ein Promise, das den abgerufenen Wert zurückgibt.
 * @throws {string} - Wirft einen Fehler, wenn unter dem angegebenen Key keine Daten gefunden werden.
 */
async function getItem(key) {
  return fetch(`${STORAGE_URL}${key}.json`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Fehler beim Abruf: ${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      if (data === null) {
        throw `Could not find data with key "${key}".`;
      }
      return data;
    });
}


// const STORAGE_TOKEN = '5FUFRM30ZGT2TL1U71ILFGSO4KYDUCQ5ROAYXNGA';
// const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

// /**
//  * Sets an item in the storage.
//  * 
//  * @param {string} key - The key of the item.
//  * @param {string} value - The value to be stored.
//  * @returns {Promise<object>} - A promise that resolves to the response object.
//  */
// async function setItem(key, value) {
//     const payload = { key, value, token: STORAGE_TOKEN };
//     return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
//       .then(res => res.json());
//   }
  
//   /**
//    * Retrieves an item from the storage.
//    * 
//    * @param {string} key - The key of the item to retrieve.
//    * @returns {Promise<string>} - A promise that resolves to the retrieved value.
//    * @throws {string} - Throws an error if the requested data is not found.
//    */
//   async function getItem(key) {
//     const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
//     return fetch(url)
//       .then(res => res.json())
//       .then(res => {
//         if (res.data) {
//           return res.data.value;
//         }
//         throw `Could not find data with key "${key}".`;
//       });
//   }
  