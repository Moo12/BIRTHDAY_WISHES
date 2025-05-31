import { ref } from 'vue';
import { projectFireStore } from '../firebase/config';
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";

const getCollection = (_collectionName) => {
  const collectionName = _collectionName; // Store the collection name
  const documents = ref(null);
  const error = ref(null);
  let unsub = null; // Store the current unsubscribe function

  // Function to set up the Firestore listener (REAL-TIME)
  const subscribeToCollection = (conditions = []) => {
    // Use the dynamically passed collection name or the initial one if not provided
    if (unsub) {
      unsub();
    }

    try {
      let collectionRef = collection(projectFireStore, collectionName);


      if (conditions.length > 0) {
        const queries = conditions.map((condition) =>
          where(condition.field, condition.operator, condition.value)
        );
        collectionRef = query(collectionRef, ...queries);
      }

      unsub = onSnapshot(
        collectionRef,
        (snapshot) => {

          const results = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          console.log('snapshot', results)
          documents.value = results;
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

  return { documents, error, subscribeToCollection };
};

export default getCollection;
