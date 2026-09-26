/* Exam images remain in this browser's IndexedDB. No upload endpoint is used. */
window.ChemistryExamFiles = (() => {
  const name = "chemistry-learning-exam-images";
  function open() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) { reject(new Error("此浏览器不支持本机图片存储")); return; }
      const request = indexedDB.open(name, 1);
      request.onupgradeneeded = () => request.result.createObjectStore("images");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("无法打开本机图片库"));
    });
  }
  async function transaction(mode, operation) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const tx = database.transaction("images", mode);
      let result;
      operation(tx.objectStore("images"), (value) => { result = value; });
      tx.oncomplete = () => { database.close(); resolve(result); };
      tx.onerror = () => { database.close(); reject(tx.error || new Error("本机图片操作失败")); };
      tx.onabort = () => { database.close(); reject(tx.error || new Error("本机图片操作中断")); };
    });
  }
  const key = (profileId, caseId) => `${profileId}:${caseId}`;
  return {
    put: (profileId, caseId, file) => transaction("readwrite", (store) => store.put(file, key(profileId, caseId))),
    remove: (profileId, caseId) => transaction("readwrite", (store) => store.delete(key(profileId, caseId))),
    get: (profileId, caseId) => transaction("readonly", (store, setResult) => {
      const request = store.get(key(profileId, caseId));
      request.onsuccess = () => setResult(request.result || null);
    }),
    removeProfile: (profileId) => transaction("readwrite", (store) => {
      const request = store.openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        if (String(cursor.key).startsWith(`${profileId}:`)) cursor.delete();
        cursor.continue();
      };
    })
  };
})();
