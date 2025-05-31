import { ref } from 'vue';
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { projectFireStore, timestamp } from '@/firebase/config';

const useDocument = (_collectionName) => {
  const error = ref(null);
  const isPending = ref(false);
  const collectionName = _collectionName 

  const _deleteDoc = async (id) => {
    isPending.value = true;
    error.value = null;

    let success = true
    
    try {
      await deleteDoc(doc(projectFireStore, collectionName, id));
    } catch (err) {
      console.error(err);
      error.value = "Could not delete the document";
      success = false;
    } finally {
      isPending.value = false;
      return success;
    }
  };

  const _docExists = async (id) => {
    isPending.value = true;
    error.value = null;

    try {
      const docRef = doc(projectFireStore, collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (err) {
      console.error(err);
      error.value = "Could not check document existence";
      return false;
    } finally {
      isPending.value = false;
    }
  };

  const _updateDoc = async (updates, id) => {
    isPending.value = true;
    error.value = null;

    updates.metadata = updates?.metadata || {};
    updates.metadata.last_update = timestamp();

    console.log("updates ", updates)

    try {
      await updateDoc(doc(projectFireStore, collectionName, id), updates);
    } catch (err) {
      console.error(err);
      error.value = "Could not update the document";
    } finally {
      isPending.value = false;
    }
  };

  return { error, isPending, _deleteDoc, _updateDoc };
};

export default useDocument;
