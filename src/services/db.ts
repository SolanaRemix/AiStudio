import { db, auth, doc, getDoc, setDoc, deleteDoc, collection, getDocs, query, where } from '../firebase';

export interface BulkGeneration {
  id: string;
  uid: string;
  key: string;
  status: string;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

class DatabaseService {
  async getBulkGenerations(): Promise<BulkGeneration[]> {
    const user = auth.currentUser;
    if (!user) return [];
    
    const path = `users/${user.uid}/bulk_generations`;
    try {
      const q = query(collection(db, path));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as BulkGeneration);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }

  async addBulkGenerations(generations: BulkGeneration[]) {
    const user = auth.currentUser;
    if (!user) return;

    for (const gen of generations) {
      const path = `users/${user.uid}/bulk_generations/${gen.id}`;
      try {
        await setDoc(doc(db, path), { ...gen, uid: user.uid });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    }
  }

  async deleteBulkGeneration(id: string) {
    const user = auth.currentUser;
    if (!user) return;

    const path = `users/${user.uid}/bulk_generations/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}

export const dbService = new DatabaseService();
