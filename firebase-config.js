// Import the Firebase core and Firestore modules from the CDN (v10+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Initialize Firestore Database connection
const db = getFirestore(app);

// Function to fetch news from Firestore and display it on the page
async function loadNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    try {
        // Create a query to pull documents from the "news" collection, sorted by newest first
        const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        // If we have data in Firestore, clear out the static placeholder cards
        if (!querySnapshot.empty) {
            newsGrid.innerHTML = "";
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Format the timestamp to a readable Arabic date style
            let displayDate = "١٥ ماي ٢٠٢٦"; // Fallback date
            if (data.createdAt) {
                const dateObj = data.createdAt.toDate();
                displayDate = dateObj.toLocaleDateString('ar-DZ', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }

            // Create the HTML structure for each news card dynamically
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
            
            // Append the new card into our grid container
            newsGrid.insertAdjacentHTML('beforeend', cardHTML);
        });

    } catch (error) {
        console.error("Error loading news from Firestore: ", error);
    }
}

// Run the function as soon as the DOM page finishes loading
document.addEventListener("DOMContentLoaded", loadNews);