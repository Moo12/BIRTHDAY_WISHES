import { ref } from 'vue';
import { projectFireStore, timestamp } from '@/firebase/config';
import { doc, collection, setDoc, addDoc } from "firebase/firestore";

const useCollection = () => {
  const error = ref(null);
  const pending = ref(null)

  const addDocImp = async (collectionName, docData, id = null) => {
    console.log("addDocImp")
    error.value = null;
    pending.value = true

    docData.metadata = docData.metadata ?? {}; 
    docData.metadata.created_at = docData.metadata.created_at ?? timestamp();
    docData.metadata.last_update = timestamp();

    console.log("add doc collection", collectionName)

    try {
      if (id) {
        const docRef = doc(projectFireStore, collectionName, id);
        await setDoc(docRef, docData);
        pending.value = false

        return docRef;
    } else {
        const colRef = collection(projectFireStore, collectionName);
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
