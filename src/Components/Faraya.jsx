import React, { useState, useEffect, useRef } from "react";
import "../Faraya.css";
import logo from "../assets/Farayah-Logo-removebg.png";
import backvideo from "../assets/newone.mp4";
import menu from "../assets/Faraya.pdf";
import portfolio from "../assets/Faraya-port.png";
import place from "../assets/place.webp";
import posterSrc from "../assets/place.webp"
//bestversiondd

import { db } from "../firebaseConfig"; 
import { collection, getDocs, doc, getDoc} from "firebase/firestore";

const FarayaEvent = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [faqList, setFaqList] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBackground, setNavBackground] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const videoRef = useRef(null); // Använd useRef för att referera till videon
  const [images, setImages] = useState([]);

  // Refs för sektionerna
  const homeSectionRef = useRef(null);
  const eventSectionRef = useRef(null);
  const faqSectionRef = useRef(null);
  const gallerySectionRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.muted = true;
      video.play()
        .then(() => {
          console.log("Video started playing");
        })
        .catch((error) => {
          console.log("Autoplay failed:", error);
          // Visa poster-bilden genom att lägga till en klass
          video.classList.add('show-poster');
        });
        video.addEventListener('loadedmetadata', () => {
          if (video.classList.contains('show-poster')) {
            // Dölj knappen med JavaScript
            const playButton = video.querySelector(
              '::-webkit-media-controls-play-button'
            );
            if (playButton) {
              playButton.style.display = 'none';
            }
          }
        })
    }
  }, []);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "FAQ")); // Hämta FAQ från Firestore
        const faqs = querySnapshot.docs.map((doc) => doc.data()); // Extrahera datan
        setFaqList(faqs); // Uppdatera faqList med hämtad data
      } catch (error) {
        console.error("Error fetching FAQs: ", error);
      }
    };
    fetchFAQs();
  }, []);

  useEffect(() => {
    const fetchAboutText = async () => {
      const docRef = doc(db, "AboutText", "aboutText");  // Hänvisar till dokumentet "aboutText" i "AboutText"-collectionen
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedText = docSnap.data().text;
        setAboutText(fetchedText);  // Sätt "Om oss"-texten i state
      } else {
        console.log("No AboutText document found.");
      }
    };
    fetchAboutText();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Image"));
        const imagesData = querySnapshot.docs.map((doc) => doc.data().url); // Förutsatt att varje bild har ett "url"-fält
        setImages(imagesData); // Sätt bilderna i state
      } catch (error) {
        console.error("Error fetching images: ", error);
      }
    };
    fetchImages();
  }, []);

  

  const handleScroll = (e, sectionRef) => {
    e.preventDefault();
    // Scrolla till den specifika sektionen med smooth scroll
    sectionRef.current.scrollIntoView({
      behavior: "smooth",
    });
    setMenuOpen(false);
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setNavBackground(true);
      } else {
        setNavBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const splitText = (text) => {
    const textLength = text.length;

    // Dela texten vid den sista punkten för 50%
    const firstPartEnd = Math.floor(textLength * 0.5);
    const firstPart = text.slice(0, firstPartEnd);
    const firstDotIndex = firstPart.lastIndexOf(".");
    const part1 = text.slice(0, firstDotIndex + 1); // Första delen

    // Dela texten vid den sista punkten för 25%
    const secondPartStart = firstDotIndex + 1;
    const secondPartEnd = Math.floor(textLength * 0.75);
    const secondPart = text.slice(secondPartStart, secondPartEnd);
    const secondDotIndex = secondPart.lastIndexOf(".");
    const part2 = text.slice(secondPartStart, secondPartStart + secondDotIndex + 1); // Andra delen

    // Resten av texten (25%)
    const part3 = text.slice(secondPartStart + secondDotIndex + 1); // Tredje delen

    return [part1, part2, part3];
  };


  const [part1, part2, part3] = splitText(aboutText);

  return (
    <div className="container">
      <nav className={`navbar ${navBackground ? "navbar-scrolled" : ""}`}>
        <div className="logon">
          <img src={logo} alt="" />
          <h1>Faraya Club</h1>
        </div>

        <div
          className={`hamburger-icon ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <a href="#home" onClick={(e) => handleScroll(e, homeSectionRef)}>Hem</a>
            </li>
            <span> | </span>
            <li onClick={() => {window.open(menu, "_blank"); 
              setMenuOpen(false);
              }}>Meny</li>
            <span> | </span>
            <li>
              <a href="#event-section" onClick={(e) => handleScroll(e, eventSectionRef)}>Om Oss</a>
            </li>
            <span> | </span>
            <li>
              <a href="#gallery" onClick={(e) => handleScroll(e, gallerySectionRef)}>Galleri</a>
            </li>
            <span> | </span>
            <li>
              <a href="#FAQ" onClick={(e) => handleScroll(e, faqSectionRef)}>Frågor & Svar</a>
            </li>
            <span> | </span>
            <li
              onClick={() => {
                window.open(
                  "https://app.bokabord.se/reservation/?hash=cb2befb6ee8bf3ce782aee340dcdd0ed&version=new&mealid=47167&fbclid=PAZXh0bgNhZW0CMTEAAaZHG1wlEWO-sLxN-_PXlvIqn3boIeZagUFslAQspAYe0e0gYUbsou6b1rc_aem_3rjD3fidNy-cMGfdU1w8FA",
                  "_blank"
                )
                setMenuOpen(false);
              }}
              className="cta-button"
            >
              Boka Bord
            </li>
          </ul>
        </div>
      </nav>
      <div className="socials">
          <i className="fab fa-instagram"  onClick={() => window.open("https://www.instagram.com/faraya.stockholm/", "_blank")}
    style={{ cursor: "pointer" }}></i>
          <i className="fab fa-tiktok" onClick={() => window.open("https://www.tiktok.com/@faraya.stockholm", "_blank")}
    style={{ cursor: "pointer" }}></i>
          </div>
      <header  id="home" ref={homeSectionRef} className="hero">
        <div className="shadow"></div>
        <video id="Video" ref={videoRef} preload="auto" autoPlay loop muted playsInline className="hero-video" poster={posterSrc}>
          <source src={backvideo} />
          Din webbläsare stöder inte videouppspelning.
        </video>

        <style>{`
        video.show-poster {
          background-image: url('${posterSrc}');
          background-size: cover;
          background-position: center;
        }

        video.show-poster > source {
          display: none;
        }
      `}</style>
        
        <div className="hero-content">
          <div className="logo">
            <img src={logo} alt="Farayas logo" />
          </div>
          <button
            onClick={() =>
              window.open(
                "https://app.bokabord.se/reservation/?hash=cb2befb6ee8bf3ce782aee340dcdd0ed&version=new&mealid=47167&fbclid=PAZXh0bgNhZW0CMTEAAaZHG1wlEWO-sLxN-_PXlvIqn3boIeZagUFslAQspAYe0e0gYUbsou6b1rc_aem_3rjD3fidNy-cMGfdU1w8FA",
                "_blank"
              )
            }
            className="cta-button"
          >
            Boka Bord
          </button>
        </div>
      </header>

      <section id="event-section" className="event-section" ref={eventSectionRef}>
        <div className="event-text">
          <h2>Faraya Event</h2>
          <h3>
            <em>The one and only</em>
          </h3>
          <p>{part1}</p> {/* Första 50% av texten */}
          <p>{part2}</p> {/* Andra 25% av texten */}
          <p>{part3}</p> {/* Tredje 25% av texten */}
          <div className="ctaButtonBox">
            <button
              onClick={() =>
                window.open(
                  "https://app.bokabord.se/reservation/?hash=cb2befb6ee8bf3ce782aee340dcdd0ed&version=new&mealid=47167&fbclid=PAZXh0bgNhZW0CMTEAAaZHG1wlEWO-sLxN-_PXlvIqn3boIeZagUFslAQspAYe0e0gYUbsou6b1rc_aem_3rjD3fidNy-cMGfdU1w8FA",
                  "_blank"
                )
              }
              className="cta-button port"
            >
              Boka Bord
            </button>
          </div>
        </div>
        <div className="event-image">
          <img src={portfolio} alt="Faraya Event" />
          <div className="highlight"></div>
        </div>
      </section>

      <section id="gallery" className="gallery" ref={gallerySectionRef}>
      {images.length === 0 ? (
            <p>Laddar bilder...</p>
          ) : (
            images.map((imageUrl, index) => (
              <div key={index} className="gallery-item">
                <img src={imageUrl} alt={`Gallery image ${index + 1}`} />
              </div>
            ))
          )}
      </section>

      <section id="FAQ" className="faq" ref={faqSectionRef}>
        <div className="gradient"></div>
        <h2>Frågor</h2>
        {faqList.length === 0 ? (
          <p>Hämtar frågor...</p>
        ) : (
          faqList.map((faq, index) => (
            <div className="faq-item" key={index} onClick={() => toggleFAQ(index)}>
              <div className="faq-question">{faq.question} ↓</div>
              {openFAQ === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))
        )}
      </section>

      <footer>
        <p className="phone">Faraya: 076 xxx xx xx</p>
        <div className="gradient"></div>
        <p>@ 2025 Faraya</p>
      </footer>
    </div>
  );
};

export default FarayaEvent;
