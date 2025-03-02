import React, { useState, useEffect, useRef } from "react";
import "../Faraya.css";
import logo from "../assets/Farayah-Logo-removebg.png";
import backvideo from "../assets/newone.mp4";
import menu from "../assets/Faraya.pdf";
import portfolio from "../assets/Faraya-port.png";
import place from "../assets/place.png";

const FarayaEvent = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBackground, setNavBackground] = useState(false);
  const videoRef = useRef(null); // Använd useRef för att referera till videon

  // Refs för sektionerna
  const homeSectionRef = useRef(null);
  const eventSectionRef = useRef(null);
  const faqSectionRef = useRef(null);
  const gallerySectionRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.muted = true; // Se till att videon är mutad för autoplay
      video.play().then(() => {
        console.log("Video started playing");
      }).catch((error) => {
        console.log("Autoplay failed:", error);
      });
    }
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
        <video ref={videoRef} preload="auto" autoPlay loop muted playsInline className="hero-video">
          <source src={backvideo} />
          Din webbläsare stöder inte videouppspelning.
        </video>
        
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
          <p>
            Faraya Eventet grundades av Dani, en entreprenör från den natursköna
            bergsbyn Faraya, Libanon. Driven av kärleken till sin födelseort vill han
            hedra dess kultur och skönhet genom att skapa en exklusiv plats som
            kombinerar show, gastronomi och underhållning.
          </p>
          <p>
            Han fick en vision om att samla människor i en unik miljö där de kunde njuta av förstklassiga upplevelser.
          </p>
          <p>
            Idag är Faraya Eventet en eftertraktad destination som erbjuder spektakulära shower, utsökt mat och en magisk atmosfär. Det har stärkt både lokal turism och ekonomi, samtidigt som det skapar en oförglömlig upplevelse för sina besökare.
          </p>
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
        <div>
          <img src={place} alt="" />
        </div>
        <div>
          <img src={place} alt="" />
        </div>
        <div>
          <img src={place} alt="" />
        </div>
        <div>
          <img src={place} alt="" />
        </div>
        <div>
          <img src={place} alt="" />
        </div>
        <div>
          <img src={place} alt="" />
        </div>
      </section>

      <section id="FAQ" className="faq" ref={faqSectionRef}>
        <div className="gradient"></div>
        <h2>Frågor</h2>
        <div className="faq-item" onClick={() => toggleFAQ(1)}>
          <div className="faq-question">Hur bokar man bord? ↓</div>
          {openFAQ === 1 && <div className="faq-answer">Bokning sker via vår hemsida.</div>}
        </div>
        <div className="faq-item" onClick={() => toggleFAQ(2)}>
          <div className="faq-question">Vad är Adressen? ↓</div>
          {openFAQ === 2 && <div className="faq-answer">Adressen är XXXXXX.</div>}
        </div>
        <div className="faq-item" onClick={() => toggleFAQ(3)}>
          <div className="faq-question">Hur mycket kostar det? ↓</div>
          {openFAQ === 3 && (
            <div className="faq-answer">
              Det kostar 600kr per person och då ingår meza med 15 rätter, 8 varma och 7 kalla i världsklass. Det ingår även flertals shower hela kvällen lång samt entré.
            </div>
          )}
        </div>
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
