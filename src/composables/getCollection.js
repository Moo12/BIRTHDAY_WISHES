// composables/useFirestoreCollection.js
import { ref } from 'vue';
import { projectFireStore } from '../firebase/config';
import { collection, query, where, onSnapshot } from "firebase/firestore";

const useFirestoreCollection = () => {
  const documents = ref(null);
  const error = ref(null);
  let unsub = null; // unsubscribe function

  // Main subscription method — accepts collection name + conditions
  const subscribeToCollection = (collectionName, conditions = []) => {
    // Prevent duplicate listeners
    if (unsub) unsub();

    try {
      let collectionRef = collection(projectFireStore, collectionName);

      if (conditions.length > 0) {
        const queries = conditions.map((cond) =>
          where(cond.field, cond.operator, cond.value)
        );
        collectionRef = query(collectionRef, ...queries);
      }

      unsub = onSnapshot(
        collectionRef,
        (snapshot) => {
          documents.value = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          error.value = null;
        },
        (err) => {
          console.error(err.message);
          documents.value = null;
          error.value = "Could not fetch the data";
        }
      );
    } catch (err) {
      console.error('Error in subscribeToCollection:', err.message);
      error.value = "Failed to set up Firestore listener";
    }
  };

  // Optional: call this when component unmounts
  const unsubscribe = () => {
    if (unsub) unsub();
  };

  return {
    documents,
    error,
    subscribeToCollection,
    unsubscribe,
  };
};

export default useFirestoreCollection;
