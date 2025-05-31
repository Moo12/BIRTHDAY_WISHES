import { ref } from 'vue';
import { projectFireStore, timestamp } from '@/firebase/config';
import { doc, collection, setDoc, addDoc } from "firebase/firestore";

const useCollection = (_collectionName) => {
  const error = ref(null);
  const collectionName = ref(_collectionName);
  const pending = ref(null)

  const addDocImp = async (docData, id = null) => {
    console.log("addDocImp")
    error.value = null;
    pending.value = true

    docData.metadata = docData.metadata ?? {}; 
    docData.metadata.created_at = docData.metadata.created_at ?? timestamp();
    docData.metadata.last_update = timestamp();

    console.log("add doc collection", collectionName.value)

    try {
      if (id) {
        const docRef = doc(projectFireStore, collectionName.value, id);
        await setDoc(docRef, docData);
        pending.value = false

        return docRef;
    } else {
        const colRef = collection(projectFireStore, collectionName.value);
        const docRef = await addDoc(colRef, docData);
        pending.value = false

        return docRef;
      }
    } catch (err) {
      error.value = "Could not add the document";
      pending.value = false

      return null
    }
  };


  return { error, pending, addDocImp };
};

export default useCollection;
