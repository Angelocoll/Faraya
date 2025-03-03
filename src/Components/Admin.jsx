import "../Admin.css"; // Importera CSS
import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../firebaseConfig"; // Firebase config om du vill spara info till Firestore
import { doc, addDoc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";


const Admin = () => {
  const correctUsername = "admin";
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;


  // State för inloggning, text och bilder
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqList, setFaqList] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");  // Lägg till här

  // Hämta "Om oss"-text från Firebase
  const fetchAboutText = async () => {
    const docRef = doc(db, "AboutText", "aboutText");  // Hämta från "AboutText" collection
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAboutText(docSnap.data().text);
    }
  };

  // Hämta FAQ från Firebase
  const fetchFAQs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "FAQ"));
      const faqs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFaqList(faqs);
    } catch (error) {
      console.error("Error fetching FAQs: ", error);
    }
  };

  const handleUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dajhncx2u", // Din Cloudinary cloud_name
        uploadPreset: "Faraya", // Din upload_preset
        sources: ["local"], // Endast lokal filuppladdning
        multiple: false, // Tillåt bara en bild
        showAdvancedOptions: false, // Visa inte avancerade alternativ
        autoMinify: true, // Minifiera bilder automatiskt
        maxFileSize: 2000000, // Max storlek på filen 2MB
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          // När uppladdning lyckas, spara den uppladdade bildens URL
          setImageUrl(result.info.secure_url);
          try {
            // Försök att lägga till bilden i Firestore
            await addDoc(collection(db, "Image"), {
                url: result.info.secure_url,
                public_id: publicId,
              });
              fetchImages();
          } catch (firestoreError) {
            console.error("Firestore: uppladdnings fel", firestoreError);
          }
        } else if (error) {
          console.error("Cloudinary uppladdnings fel", error);
        }
      }
    );
  
    // Öppna widgeten så användaren kan välja en bild
    myWidget.open();
  };
  

  // Hämta FAQ när sidan laddas
  useEffect(() => {
    fetchFAQs();
  }, []);

  // Hämta bilder från Firebase
  const fetchImages = async () => {
    const querySnapshot = await getDocs(collection(db, "Image"));  // Hämta från "Image" collection
    const images = querySnapshot.docs.map(doc => doc.data().url);
    setImages(images);
  };

  // Hantera inloggning
  const handleLogin = () => {
    if (username === correctUsername && password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError("");
      localStorage.setItem("isLoggedIn", "true");
      fetchAboutText();
      fetchFAQs();
      fetchImages();
    } else {
      setError("Fel användarnamn eller lösenord!");
    }
  };

  // Hantera utloggning
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };


  const removeImage = async (publicId) => {
    try {
      const response = await fetch('/api/deleteImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Image deleted successfully:', data);
      } else {
        const error = await response.json();
        console.error('Error deleting image:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  

  // Ta bort en FAQ
  const handleRemoveFAQ = async (id) => {
    try {
      const docRef = doc(db, "FAQ", id);
      await deleteDoc(docRef);
      fetchFAQs(); // Uppdatera FAQ-listan efter borttagning
      alert("Fråga har tagits bort!");
    } catch (error) {
      console.error("Error deleting FAQ: ", error);
    }
  };

  // Spara "Om oss"-text i Firebase
  const handleSaveAboutText = async () => {
    const docRef = doc(db, "AboutText", "aboutText");  // Hämta från "AboutText" collection
    await setDoc(docRef, { text: aboutText });
    alert("Texten har sparats!");
  };

  // Spara FAQ i Firebase
  const handleSaveFAQ = async () => {
    if (faqQuestion.trim() && faqAnswer.trim()) {
      try {
        // Lägg till ny FAQ i Firestore
        await addDoc(collection(db, "FAQ"), {
          question: faqQuestion,
          answer: faqAnswer,
        });
        setFaqQuestion("");
        setFaqAnswer("");
        fetchFAQs();  // Hämta FAQ igen för att uppdatera listan
        alert("Fråga och svar har sparats!");
      } catch (error) {
        console.error("Error saving FAQ: ", error);
      }
    } else {
      alert("Fråga och svar kan inte vara tomma!");
    }
  };

  // Spara bilder i Firebase
  const handleSaveImages = async () => {
    const imagesRef = collection(db, "Image");  // Spara till "Image" collection
    images.forEach(async (imageUrl) => {
      await addDoc(imagesRef, { url: imageUrl });
    });
    alert("Bilderna har sparats!");
  };

  return (
    <div className="admin-container">
      {isLoggedIn ? (
        <div className="dashboard">
          <h2>Välkommen till Adminpanelen!</h2>
          <p>Du är nu inloggad.</p>
          <button onClick={handleLogout}>Logga ut</button>

          {/* Ladda upp bild */}
          <div className="image-upload">
         
            <div className="images-preview">
              {images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} alt={`uploaded ${index}`} className="preview-img" />
                  <button onClick={() => removeImage(index)}>Ta bort</button>
                </div>
              ))}
            </div>
            <button onClick={handleUpload}>Upload image</button>
          </div>

          {/* Om oss - Textarea */}
          <div className="about-section">
            <textarea
              placeholder="Ändra texten om oss..."
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              rows="5"
            />
            <button onClick={handleSaveAboutText}>Spara Om Oss</button>
          </div>

          {/* FAQ - Fråga och Svar */}
          <div className="faq-section">
            <input
              type="text"
              placeholder="Fråga"
              value={faqQuestion}
              onChange={(e) => setFaqQuestion(e.target.value)}
            />
            <input
              type="text"
              placeholder="Svar"
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
            />
            <button onClick={handleSaveFAQ}>Spara Fråga och Svar</button>
          </div>

          {/* FAQ lista */}
          <div className="faq-list">
            <h3>FAQ Lista</h3>
            <ul>
              {faqList.map((faq) => (
                <li key={faq.id}>
                  <span style={{color: "black"}}>{faq.question}</span>
                  <button onClick={() => handleRemoveFAQ(faq.id)}>Ta bort</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="login-box">
          <h2>Admin Login</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Logga in</button>
        </div>
      )}
    </div>
  );
};

export default Admin;
