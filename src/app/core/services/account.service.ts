import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AccountProfile } from '../../models/account-profile';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private firestore = inject(Firestore);
  private readonly collectionName = 'account_profiles';

  getAccountsByPlatform(platformId: string): Observable<AccountProfile[]> {
    const accountsRef = collection(this.firestore, 'account_profiles');
    // Consulta directa: "Trae las cuentas cuyo account_id coincida con la plataforma"
    const q = query(accountsRef, where('account_id', '==', platformId));
    return collectionData(q, { idField: 'id' }) as Observable<AccountProfile[]>;
  }

  // CREAR: Guardar una nueva cuenta con sus perfiles
  createAccount(account: AccountProfile) {
    const accountsRef = collection(this.firestore, this.collectionName);
    return addDoc(accountsRef, account);
  }

  // ACTUALIZAR: Modificar email, password o el array de perfiles
  updateAccount(accountId: string, data: Partial<AccountProfile>) {
    const accountDoc = doc(this.firestore, `${this.collectionName}/${accountId}`);
    return updateDoc(accountDoc, data);
  }

  // ELIMINAR: Borrar la cuenta completa
  deleteAccount(accountId: string) {
    const accountDoc = doc(this.firestore, `${this.collectionName}/${accountId}`);
    return deleteDoc(accountDoc);
  }
}