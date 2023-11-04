import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDocs, setDoc, deleteDoc } from '@angular/fire/firestore';
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

	addData(dbPath: string, data: any) {
		const col = collection(this.firestore, dbPath);
		addDoc(col, { ...data });
	}

	addDataAutoId(dbPath: string, data: any) {
		const col = collection(this.firestore, dbPath);
		const newDoc = doc(col);
		data.id = newDoc.id;
		
		try {
			setDoc(newDoc, {...data});
		} catch (error) {
			deleteDoc(newDoc);
			throw new Error('There was a problem uploading the user.', {cause: error});
		}
		
		return data.id;
	}
}
