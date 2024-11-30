import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAW0KwZWSYWA4qIORW3H3idl2O6H_r4DWg",
    authDomain: "mobil-31aa7.firebaseapp.com",
    projectId: "mobil-31aa7",
    storageBucket: "mobil-31aa7.firebasestorage.app",
    messagingSenderId: "100898415383",
    appId: "1:100898415383:web:cfeeea5597c57a26ad8d52",
    measurementId: "G-WBJJN40MYE"
  };

  export const uploadReferenceValues = async (values) => {
    try {
      await setDoc(doc(db, 'settings', 'referenceValues'), {
        values,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error uploading reference values:', error);
      return false;
    }
  };

  export const useReferenceValues = () => {
    const [referenceValues, setReferenceValues] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchReferenceValues = async () => {
        try {
          const docRef = doc(db, 'settings', 'referenceValues');
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setReferenceValues(docSnap.data().values);
          } else {
            setError('Referans değerleri bulunamadı');
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchReferenceValues();
    }, []);
  
    return { referenceValues, loading, error };
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);