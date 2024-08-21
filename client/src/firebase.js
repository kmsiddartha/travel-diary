import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB_MvhpjWQf57gPUVDNj9UQ6Sw4bJk21ZQ',
  authDomain: 'trip-diary-ec554.firebaseapp.com',
  projectId: 'trip-diary-ec554',
  storageBucket: 'trip-diary-ec554.appspot.com',
  messagingSenderId: '388473412993',
  appId: '1:388473412993:web:88c428968842ecd020dc80',
  measurementId: 'G-J2MTNFC83G',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
