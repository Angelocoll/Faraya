import React, { useState } from 'react';
import { db } from "../firebaseConfig"; // Firebase config om du vill spara info till Firestore
import { addDoc, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore"; // Importera Firestore funktioner
import "../Gästlista.css";

const Gästlista = () => {
  const [email, setEmail] = useState('');
  const [gäster, setGäster] = useState([]);
  const [laddar, setLaddar] = useState(false);
  const [fel, setFel] = useState(null);
  const [antalPersoner, setAntalPersoner] = useState(null);
  const [harSkrivitEmail, setHarSkrivitEmail] = useState(false);
  const [förstaGäst, setFörstaGäst] = useState({ firstname: '', lastname: '' });
  const [bookingName, setBookingName] = useState('');
  const [date, setDate] = useState('');

  const HASH = import.meta.env.VITE_GUESTLIST_HASH;
  const API_ID = import.meta.env.VITE_GUESTLIST_ID;
  //test

  // Funktion för att kolla om e-post finns i Firestore
  const kollaEmailIFirestore = async (email) => {
    const q = query(collection(db, "guestlist"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null; 
    } else {
   
      const doc = querySnapshot.docs[0];
      return doc; 
    }
  };

  
  const hämtaBokningar = async () => {
    const idag = new Date();
    console.log("idag", idag);
    setLaddar(true);
    
    try {
      // Hämta data från API:et
      const svar = await fetch(`/api/proxy?auth_hash=${HASH}&restid=${API_ID}&email=${email}`);
  
   
  
      if (!svar.ok) {
        // Om HTTP-status inte är OK (t.ex. 404 eller 500)
        throw new Error(`HTTP-fel: ${svar.status} - ${svar.statusText}`);
      }
  
      // Logga hela svaret som text (för att se om det är HTML)
      const textData = await svar.text();
     
  
      // Kontrollera om svaret är HTML (detta kan vara en felsida)
      if (textData.includes('<!DOCTYPE html>')) {
        throw new Error("Fel: Servern skickade HTML istället för JSON.");
      }
  
      // Försök att tolka svaret som JSON
      let data;
      try {
        data = JSON.parse(textData);
      } catch (jsonError) {
        throw new Error("Fel: Servern skickade inte JSON, utan HTML eller annat format.");
      }
  
      // Kontrollera om data har bookings, annars ge ett felmeddelande
      if (!data.bookings) {
        throw new Error("Fel: Ingen bokningsdata mottogs från servern.");
      }
  
      const bokning = data.bookings.find(b => b.guest.email === email);
  
      if (!bokning) {
        setFel("Ingen bokning hittades för denna e-postadress.");
        setLaddar(false);
        return;
      }
  
      // Kolla om bokningen är i framtiden
      const bokningsDatum = new Date(bokning.date);
      if (bokningsDatum < idag.setHours(0, 0, 0, 0)) { // Jämför endast datum, inte tid
        setFel("Din bokning har redan passerat och kan inte längre användas.");
        setLaddar(false);
        return;
      }
  
      // Spara bokningsuppgifter
      setAntalPersoner(bokning.amount);
      setFörstaGäst({
        firstname: bokning.guest.firstname || '',
        lastname: bokning.guest.lastname || ''
      });
      setBookingName(`${bokning.guest.firstname} ${bokning.guest.lastname}`);
      setDate(bokning.date);
  
      // Kolla om gästlistan finns i Firestore
      const gästlista = await kollaEmailIFirestore(email);
      if (gästlista) {
        // Om gästlistan finns i Firestore, fyll i fälten med gamla namn
        const gamlaGäster = gästlista.data().GuestNames.split(', ').map(name => {
          const [firstname, lastname] = name.split(' ');
          return { firstname, lastname };
        });
        setGäster(gamlaGäster);
      } else {
        // Om ingen gästlista finns i Firestore, lämna fälten tomma
        setGäster(Array.from({ length: bokning.amount }, () => ({ firstname: '', lastname: '' })));
      }
  
    } catch (error) {
      // Logga och visa detaljerade felmeddelanden
      console.error("Fel vid hämtning:", error);
      setFel(error.message);
    } finally {
      setLaddar(false);
    }
  };
  
  

  const hanteraEmailChange = (event) => {
    setEmail(event.target.value);  // Uppdatera e-postadress när användaren skriver
  };

  const hanteraSubmitEmail = (event) => {
    event.preventDefault();  // Förhindra att sidan laddas om
    if (email) {
      setHarSkrivitEmail(true);  // Uppdatera state för att visa nästa steg
      hämtaBokningar();  // Hämtar bokningar baserat på e-post
    } else {
      setFel("Vänligen ange en giltig e-postadress.");
    }
  };

  const hanteraGästInfoChange = (index, field, value) => {
    const nyaGäster = [...gäster]; // Kopiera nuvarande gäster
    nyaGäster[index] = { ...nyaGäster[index], [field]: value }; // Skapa en ny objekt för den specifika gästen
    setGäster(nyaGäster); // Uppdatera state med den nya arrayen
  };

  // Funktion för att spara gäster till Firestore
  const sparaGästerTillFirebase = async () => {
    try {
      // Skapa en sträng med alla gästnamn
      const guestNames = gäster.map(gäst => `${gäst.firstname} ${gäst.lastname}`).join(', '); 
      
      // Kolla om gästlistan finns i Firestore
      const gästlista = await kollaEmailIFirestore(email);

      if (gästlista) {
        // Om gästlistan finns, uppdatera den
        const docRef = doc(db, "guestlist", gästlista.id); // Hämta referens till det dokumentet som vi ska uppdatera
        await updateDoc(docRef, {
          GuestNames: guestNames,  // Uppdatera gästnamn
          antal: antalPersoner, // Uppdatera antal personer
          bookingName: bookingName, // Uppdatera bokningsnamn
          date: date, // Uppdatera datumet
        });
        alert("Gästerna har uppdaterats i Firestore!");
      } else {
        // Om gästlistan inte finns, skapa ett nytt dokument
        await addDoc(collection(db, "guestlist"), {
          GuestNames: guestNames,  // Alla gästers namn
          antal: antalPersoner, // Antalet personer
          bookingName: bookingName, // Bokningsnamn (för- och efternamn på bokningspersonen)
          date: date, // Datumet bokningen gjordes för
          email: email, // Spara email för att kunna koppla till rätt gästlista
        });
        alert("Gästerna har sparats i Gästlistan!");
      }
    } catch (error) {
      console.error("Fel vid sparande utav gäster:", error);
      setFel("Ett fel uppstod vid sparande av gäster.");
    }
  };

  if (laddar) return <div>Laddar...</div>;
  if (fel) return <div>Fel: {fel}</div>;

  return (
    <div className='Guestlist'>
      <h1>Gästlista</h1>
      
      {/* Steg 1: Användaren skriver in sin e-postadress */}
      {!harSkrivitEmail && (
        <form onSubmit={hanteraSubmitEmail}>
          <label htmlFor="email">Ange din e-postadress:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={hanteraEmailChange}
            placeholder="Skriv in din e-post"
            required
          />
          <button type="submit">Fortsätt</button>
        </form>
      )}
      
      {/* Steg 2: Visa antal inputfält för gäster om bokningen hittas */}
      {antalPersoner && (
        <div>
          <h2>Fyll i för- och efternamn på varje gäst</h2>
          <form onSubmit={(e) => { e.preventDefault(); sparaGästerTillFirebase(); }}>
            {Array.from({ length: antalPersoner }).map((_, index) => (
              <div key={index}>
                <h3>Gäst {index + 1}</h3>
                
                <label htmlFor={`fornamn-${index}`}>Förnamn:</label> <br />
                <input
                  id={`fornamn-${index}`}
                  type="text"
                  value={index === 0 ? förstaGäst.firstname : gäster[index].firstname} // Autofyll för första gästen
                  onChange={(e) => hanteraGästInfoChange(index, 'firstname', e.target.value)}
                  placeholder="Förnamn"
                  required
                />
                <br />
                <label htmlFor={`efternamn-${index}`}>Efternamn:</label><br />
                <input
                  id={`efternamn-${index}`}
                  type="text"
                  value={index === 0 ? förstaGäst.lastname : gäster[index].lastname} 
                  onChange={(e) => hanteraGästInfoChange(index, 'lastname', e.target.value)}
                  placeholder="Efternamn"
                  required
                />
              </div>
            ))}
            <button type="submit">Spara</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Gästlista;
