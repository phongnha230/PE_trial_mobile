const { initializeApp } = require('firebase/app');
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require('firebase/auth');
const {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDrvcqp1jQocJ4Q6vArpuz8nWwE8e5H4ow",
  authDomain: "petrial-5940f.firebaseapp.com",
  projectId: "petrial-5940f",
  storageBucket: "petrial-5940f.firebasestorage.app",
  messagingSenderId: "129549233218",
  appId: "1:129549233218:web:5c1ffac62c80a0c459d1db",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const TEST_EMAIL = 'grader@bookshelf.com';
const TEST_PASSWORD = 'GraderPass123!';

async function seed() {
  console.log('--- 1. Authenticating Test User ---');
  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
    console.log(`Created new test account: ${TEST_EMAIL}`);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`Test account already exists. Signing in...`);
      userCredential = await signInWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
      console.log(`Signed in successfully as ${TEST_EMAIL}`);
    } else {
      console.error('Auth error:', error.message);
      throw error;
    }
  }

  const user = userCredential.user;
  console.log(`User UID: ${user.uid}`);

  console.log('\n--- 2. Checking Firestore Books Collection ---');
  try {
    const q = query(collection(db, 'books'), where('userId', '==', user.uid));
    const snap = await getDocs(q);
    console.log(`Current books in Firestore for this user: ${snap.size}`);

    if (snap.size >= 3) {
      console.log('Books collection already has 3 or more documents for this user.');
      snap.forEach((doc) => {
        console.log(` - [${doc.id}]: "${doc.data().title}" by ${doc.data().author} (${doc.data().status})`);
      });
      return;
    }

    const sampleBooks = [
      {
        userId: user.uid,
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Fiction',
        status: 'Reading',
        rating: 5,
        favorite: true,
        notes: 'Classic sci-fi masterpiece exploring politics and ecology.',
        createdAt: serverTimestamp(),
      },
      {
        userId: user.uid,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        genre: 'Academic',
        status: 'Finished',
        rating: 4,
        favorite: false,
        notes: 'A handbook of agile software craftsmanship and best practices.',
        createdAt: serverTimestamp(),
      },
      {
        userId: user.uid,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        genre: 'Non-Fiction',
        status: 'To Read',
        rating: null,
        favorite: true,
        notes: 'A brief history of humankind from the stone age to modern era.',
        createdAt: serverTimestamp(),
      },
    ];

    console.log('\n--- 3. Seeding 3 Sample Documents ---');
    for (const b of sampleBooks) {
      const docRef = await addDoc(collection(db, 'books'), b);
      console.log(`Added: "${b.title}" -> Document ID: ${docRef.id}`);
    }
    console.log('\nSeeding completed successfully!');
  } catch (err) {
    console.error('Firestore Error:', err.message);
    if (err.message.includes('permission-denied') || err.message.includes('Missing or insufficient permissions')) {
      console.log('\n[NOTICE]: Firestore Rules currently reject this write.');
      console.log('Please copy content of firestore.rules and click Publish in Firebase Console -> Firestore -> Rules!');
    }
  }
}

seed().then(() => {
  console.log('\nDone!');
  process.exit(0);
}).catch((e) => {
  console.error('Script failed:', e);
  process.exit(1);
});
