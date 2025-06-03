// useAuth.js
import { ref } from 'vue';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, projectFireStore} from '@/firebase/config'; // Make sure this path matches your project

const user = ref(null);
const userRole = ref(null);
const authReady = ref(false);


const error = ref(null);

// roles.js
export const specialRoles = {
  'mosesorly@gmail.com': 'celebrant',
  'moosesm@gmail.com': 'admin'
};


// Monitor auth state on load
onAuthStateChanged(auth, async (currentUser) => {
  user.value = currentUser;
  authReady.value = false

  if (currentUser) {
    const snap = await getDoc(doc(projectFireStore, 'users', currentUser.uid));
    if (snap.exists()) {
      userRole.value = snap.data().role;
    }
  } else {
    userRole.value = null;
  }

  console.log("user role", userRole.value)

  authReady.value = true
});

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  error.value = null;
  try {
    const result = await signInWithPopup(auth, provider);
    user.value = result.user;

    console.log("createUserIfNotExists")
    createUserIfNotExists(user.value)
  } catch (err) {
    error.value = err.message;
  }
};

const createUserIfNotExists = async (user) => {
  console.log("imp", user.email)
  const ref = doc(projectFireStore, 'users', user.uid)
  console.log("57", ref)
  const snap = false; //await getDoc(ref)

  console.log("59")

  let role = specialRoles[user.email] || 'user';

  console.log("new role", role)

  //if (!snap.exists()) {
  if (!snap) {

    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      role: role
    })

    console.log("created")
  }
}

const logout = async () => {
  error.value = null;
  try {
    await signOut(auth);
    user.value = null;
  } catch (err) {
    error.value = err.message;
  }
};

export default function useAuth() {
  return {
    user,
    userRole,
    authReady,
    error,
    loginWithGoogle,
    logout
  };
}
