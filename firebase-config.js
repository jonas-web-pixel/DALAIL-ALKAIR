// Import the Firebase core, Firestore, and Authentication modules from the CDN (v10+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your project's unique configuration keys
const firebaseConfig = {
  apiKey: "AIzaSyBIlmZXAVQ0RGS1BL_tbfyUjUKZYD9d3rY",
  authDomain: "dalail-alkhayr.firebaseapp.com",
  projectId: "dalail-alkhayr",
  storageBucket: "dalail-alkhayr.firebasestorage.app",
  messagingSenderId: "602204800156",
  appId: "1:602204800156:web:24d67d3be8f2d2ab319959",
  measurementId: "G-0JX7XE0XT1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database & Auth connections
const db = getFirestore(app);
const auth = getAuth(app);

// Your specific Admin email
const ADMIN_EMAIL = "dduckyounes@gmail.com";

---

## 🔐 AUTHENTICATION SYSTEM (Login, Signup, Roles)

// Monitor login status and handle role separation automatically
onAuthStateChanged(auth, (user) => {
    const adminPanel = document.querySelectorAll('.admin-only');
    const studentPanel = document.querySelectorAll('.student-only');
    const authButtons = document.querySelectorAll('.auth-btn'); // Buttons to open Login/Signup modals
    const logoutBtn = document.getElementById('logout-btn');

    if (user) {
        console.log("Logged in user:", user.email);
        
        // Hide Login/Signup trigger buttons because user is already authenticated
        authButtons.forEach(btn => btn.style.display = 'none');
        if (logoutBtn) logoutBtn.style.display = 'block';

        // Role Check
        if (user.email === ADMIN_EMAIL) {
            console.log("Access Granted: Admin logged in.");
            adminPanel.forEach(el => el.style.display = 'block');   // Show publish form / admin links
            studentPanel.forEach(el => el.style.display = 'none'); // Hide student-specific views
        } else {
            console.log("Access Granted: Student logged in.");
            adminPanel.forEach(el => el.style.display = 'none');   // Hide admin tools completely
            studentPanel.forEach(el => el.style.display = 'block'); // Show student metrics/portal
        }
    } else {
        console.log("No user is currently signed in.");
        // Reset view: hide all dashboard features, show entry buttons
        authButtons.forEach(btn => btn.style.display = 'block');
        if (logoutBtn) logoutBtn.style.display = 'none';
        adminPanel.forEach(el => el.style.display = 'none');
        studentPanel.forEach(el => el.style.display = 'none');
    }
});

// Student Registration Function
async function handleSignup(email, password) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("🎉 Registration successful! Welcome to the portal.");
        // If you have a function to close your modal UI, call it here
    } catch (error) {
        console.error("Signup Error:", error);
        alert("Error creating account: " + error.message);
    }
}

// Universal Login Function (Handles both Student and Admin)
async function handleLogin(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("👋 Welcome back!");
    } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed! Please check your credentials.");
    }
}

// Logout Function
async function handleLogout() {
    try {
        await signOut(auth);
        alert("Logged out successfully.");
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

---

## 📰 NEWS FEED SYSTEM

// Function to fetch news from Firestore and display it on the page
async function loadNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    try {
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            newsGrid.innerHTML = "";
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            let displayDate = "١٥ ماي ٢٠٢٦"; 
            if (data.createdAt) {
                const dateObj = data.createdAt.toDate();
                displayDate = dateObj.toLocaleDateString('ar-DZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }

            const cardHTML = `
                <div class="news-card">
                    <div class="news-img" style="background-image: url('${data.imageUrl || 'https://images.unsplash.com/photo-1584553421349-355dbcbaffd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}');">
                        <span class="news-date">${displayDate}</span>
                    </div>
                    <div class="news-content">
                        <h3>${data.title}</h3>
                        <p>${data.content}</p>
                        <a href="#" class="read-more">اقرأ المزيد <i class="fa-solid fa-arrow-left"></i></a>
                    </div>
                </div>
            `;
            
            newsGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

    } catch (error) {
        console.error("Error loading news from Firestore: ", error);
    }
}

---

## 🚀 INITIALIZATION

// Bind interactive forms when HTML structure completes loading
document.addEventListener("DOMContentLoaded", () => {
    loadNews();

    // Hook up Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            await handleLogin(email, password);
        });
    }

    // Hook up Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            await handleSignup(email, password);
        });
    }

    // Hook up Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});