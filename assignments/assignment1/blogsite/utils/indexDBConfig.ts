import { rejects } from "assert";

const INDEXDB = 'readingList'
let request: IDBOpenDBRequest;
let db: any;
let version = 1;

export async function dbInti() {
    return new Promise((resolve, reject) => {
        if (!('indexedDB' in window)) {
            return reject("Index DB is not supported");
        }

        request = indexedDB.open(INDEXDB, 1)

        request.onupgradeneeded = (e: any) => {
            db = e.target.result;

            if (!db.objectStoreNames.contains(INDEXDB)) {
                console.log('upgrading object store');
                db.createObjectStore(INDEXDB, { keyPath: 'slug', autoIncrement: true });
            }
        }

        request.onsuccess = (e: any) => {
            db = e.target.result;

            if (!db.objectStoreNames.contains(INDEXDB)) {
                console.log('creating object store');
                db.createObjectStore(INDEXDB, { keyPath: 'slug', autoIncrement: true });
            }

            resolve(e.target.result);
        }

        request.onerror = (e: any) => {
            reject(e.target.error)
        }
    })
}

export async function addReadingList(slug: any, email: any) {
    return new Promise(async (resolve, rejects) => {
        db = await dbInti()
        const tx = await db.transaction(INDEXDB, "readwrite");
        const store = await tx.objectStore(INDEXDB)
        store.add({ slug, email });
        tx.oncomplete = function () {
            resolve(true);
            db.close();
        };
    })
}

export async function getReadingList() {
    return new Promise<any[]>(async (resolve, reject) => {
        db = await dbInti()
        const tx = await db.transaction(INDEXDB, "readonly");
        const store = await tx.objectStore(INDEXDB)
        const query = store.getAll();

        query.onsuccess = () => {
            resolve(query.result);
        }
        query.onerror = () => {
            reject(query.error);
        }
        tx.oncomplete = function () {
            db.close;
        }
    })
}

export async function removeFromList(slug: string) {
    return new Promise(async (resolve, reject) => {
        db = await dbInti()
        const tx = await db.transaction(INDEXDB, "readwrite");
        const store = await tx.objectStore(INDEXDB)
        const deleteSlug = store.delete(slug);
        
        deleteSlug.onsuccess = function () {
            resolve(true);
        }
        deleteSlug.onerror = function () {
            reject(false);
        }
        tx.oncomplete = function () {
            db.close;
        }
    })
}