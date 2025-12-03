import admin from "firebase-admin"
import {readFileSync} from "fs"

const serviceAcount = JSON.parse(
    readFileSync("./src/config/apuesta2-fa00c-firebase-adminsdk-fbsvc-118777aefa.json", "utf-8")
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAcount),
    databaseURL: 'https://apuesta2.firebaseio.com'
});

export const db = admin.firestore();

// Clase de servicio para operaciones CRUD
class FirebaseService {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  async create(data) {
    const docRef = await this.collection.add(data);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  async getAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getById(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async query(field, operator, value) {
    const snapshot = await this.collection.where(field, operator, value).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async update(id, data) {
    await this.collection.doc(id).update(data);
    return this.getById(id);
  }

  async delete(id) {
    await this.collection.doc(id).delete();
    return { id, deleted: true };
  }
}

export default FirebaseService;