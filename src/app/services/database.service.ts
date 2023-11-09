import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, setDoc, deleteDoc, updateDoc, getDoc, DocumentReference, DocumentData } from '@angular/fire/firestore';
@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	constructor(private firestore: Firestore) { }

	async getData<T>(dbPath: string): Promise<Array<T>> {
		const col = collection(this.firestore, dbPath);

		const querySnapshot = await getDocs(col);
		const arrAux: Array<T> = [];

		querySnapshot.forEach((doc) => {
			arrAux.push(doc.data() as T);
		});

		return arrAux;
	}

	async addData(dbPath: string, data: any) {
		const col = collection(this.firestore, dbPath);
		await addDoc(col, { ...data });
	}

	async addDataAutoId(dbPath: string, data: any): Promise<string> {
		const col = collection(this.firestore, dbPath);
		const newDoc = doc(col);
		data.id = newDoc.id;

		try {
			await setDoc(newDoc, { ...data });
		} catch (error) {
			deleteDoc(newDoc);
			throw new Error('There was a problem while uploading.', { cause: error });
		}

		return data.id;
	}

	updateDoc(dbPath: string, docId: string, data: any) {
		const docRef = doc(this.firestore, dbPath, docId);

		return updateDoc(docRef, { ...data });
	}

	getDocRef(dbPath: string, docId: string): DocumentReference<DocumentData> {
		return doc(this.firestore, dbPath, docId);
	}

	async getObjDataByRef<T>(docRef: DocumentReference<DocumentData>) {
		const docSnap = await getDoc(docRef);
		return docSnap.data() as T;
	}
}
