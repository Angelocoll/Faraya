import React, { useState, useEffect } from "react";
import "../Faraya.css";
import logo from "../assets/Farayah-Logo-removebg.png";
import backvideo from "../assets/m.mp4";
import menu from "../assets/Faraya.pdf";
import portfolio from "../assets/Faraya-port.png";

const FarayaEvent = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBackground, setNavBackground] = useState(false);

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
              <li>Hem</li>
              <span> | </span>
              <li onClick={() => window.open(menu, "_blank")}>Meny</li>
              <span> | </span>
              <li>Om Oss</li>
              <span> | </span>
              <li>Frågor & Svar</li>
              <span> | </span>
              <li>Galleri</li>
              <span> | </span>
              <li onClick={() => window.open("https://app.bokabord.se/reservation/?hash=cb2befb6ee8bf3ce782aee340dcdd0ed&version=new&mealid=47167&fbclid=PAZXh0bgNhZW0CMTEAAaZHG1wlEWO-sLxN-_PXlvIqn3boIeZagUFslAQspAYe0e0gYUbsou6b1rc_aem_3rjD3fidNy-cMGfdU1w8FA")} className="cta-button">Boka Bord</li>
            </ul>
          </div>
        </nav>
          <div className="socials">
          <i className="fab fa-instagram"  onClick={() => window.open("https://www.instagram.com/faraya.stockholm/", "_blank")}
    style={{ cursor: "pointer" }}></i>
          <i className="fab fa-tiktok" onClick={() => window.open("https://www.tiktok.com/@faraya.stockholm", "_blank")}
    style={{ cursor: "pointer" }}></i>
          </div>
      <header className="hero">
        <video preload="auto" autoPlay loop muted playsInline className="hero-video">
          <source src={backvideo} type="video/mp4" />
          Din webbläsare stöder inte videouppspelning.
        </video>

        <div className="hero-content">
          <div className="logo"><img src={logo} alt="Farayas logo" /></div>
          <button onClick={() => window.open("https://app.bokabord.se/reservation/?hash=cb2befb6ee8bf3ce782aee340dcdd0ed&version=new&mealid=47167&fbclid=PAZXh0bgNhZW0CMTEAAaZHG1wlEWO-sLxN-_PXlvIqn3boIeZagUFslAQspAYe0e0gYUbsou6b1rc_aem_3rjD3fidNy-cMGfdU1w8FA")} className="cta-button">Boka Bord</button>
        </div>
      </header>

      <section className="event-section">
        <div className="event-text">
          <h2>Faraya Event</h2>
          <h3><em>The one and only</em></h3>
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
          <button onClick={() => window.open("https://app.bokabord.se/reservation/?hash=cb2befb6ee8bf3ce782aee340dcdd0ed&version=new&mealid=47167&fbclid=PAZXh0bgNhZW0CMTEAAaZHG1wlEWO-sLxN-_PXlvIqn3boIeZagUFslAQspAYe0e0gYUbsou6b1rc_aem_3rjD3fidNy-cMGfdU1w8FA")} className="cta-button port">Boka Bord</button>
          </div>
        </div>
        <div className="event-image">
          <img src={portfolio} alt="Faraya Event" />
        <div className="highlight">
        </div>
        </div>
      </section>

      <section className="gallery">
     
      </section>

      <section className="faq">
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
             Det kostar 600kr per person och då ingår meza med 15 rätter 8 varma och 7 kalla i världsklass det ingår även flertals shower hela kvällen lång samt entre.
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="gradient"></div>
        <p>@ 2025 Farayah | Farayah: 076 xxx xx xx</p>
      </footer>
    </div>
  );
};

export default FarayaEvent;