import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const GuestlistAdmin = () => {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [bokningar, setBokningar] = useState([]);
  const [filtreradeBokningar, setFiltreradeBokningar] = useState([]);
  const [valdBokning, setValdBokning] = useState(null);
  const [uniktDatum, setUniktDatum] = useState([]);
  const [valtDatum, setValtDatum] = useState('');
  const [checkadeGäster, setCheckadeGäster] = useState({}); // Ställ in checkade gäster
  const [incheckadeGäster, setIncheckadeGäster] = useState([]); // Lista av incheckade gäster
  const [visarEndastIncheckade, setVisarEndastIncheckade] = useState(false);
  const ADMIN_PASSWORD = import.meta.env.VITE_GuestADMIN_PASSWORD;

  useEffect(() => {
    const hämtaBokningar = async () => {
      const querySnapshot = await getDocs(collection(db, 'guestlist'));
      const bokningsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sortera bokningarna i alfabetisk ordning efter bookingName
      const sorteradeBokningar = bokningsData.sort((a, b) =>
        a.bookingName.localeCompare(b.bookingName, 'sv', { sensitivity: 'base' })
      );

      setBokningar(sorteradeBokningar);
      setFiltreradeBokningar(sorteradeBokningar);

      // Hämta unika datum
      const datumLista = [...new Set(bokningsData.map(bokning => bokning.date))].sort();
      setUniktDatum(datumLista);
    };

    if (loggedIn) {
      hämtaBokningar();
    }
  }, [loggedIn]);

  useEffect(() => {
    // Hämta incheckade gäster för valt datum
    const hämtaIncheckadeGäster = async () => {
      if (!valtDatum) return;
      const checklistRef = doc(db, 'Checklist', valtDatum);
      const checklistSnap = await getDoc(checklistRef);

      if (checklistSnap.exists()) {
        const incheckade = checklistSnap.data().guests || [];
        setIncheckadeGäster(incheckade);
        // Skapa en map för att underlätta snabbare lookup
        const checkadeMap = incheckade.reduce((acc, gäst) => {
          acc[gäst] = true;
          return acc;
        }, {});
        setCheckadeGäster(checkadeMap);
      } else {
        setIncheckadeGäster([]);
        setCheckadeGäster({});
      }
    };

    hämtaIncheckadeGäster();
  }, [valtDatum]);

  const hanteraInloggning = (event) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
    } else {
      alert('Fel lösenord!');
    }
  };

  const filtreraBokningarEfterDatum = (event) => {
    const valt = event.target.value;
    setValtDatum(valt);
    setFiltreradeBokningar(valt ? bokningar.filter(bokning => bokning.date === valt) : bokningar);
    setIncheckadeGäster([]);
    setVisarEndastIncheckade(false); // Återställ visningen om man byter datum
  };

  const toggleCheckGäst = async (gäst, datum) => {
    const nyCheckadeGäster = { ...checkadeGäster };
    nyCheckadeGäster[gäst] = !nyCheckadeGäster[gäst];
    setCheckadeGäster(nyCheckadeGäster);

    const checklistRef = doc(db, 'Checklist', datum);

    try {
      if (nyCheckadeGäster[gäst]) {
        // Om vi markerar som checkad, lägg till gästen till checklistan
        await setDoc(checklistRef, { guests: arrayUnion(gäst) }, { merge: true });
      } else {
        // Om vi avmarkerar, ta bort gästen från checklistan
        await updateDoc(checklistRef, { guests: arrayRemove(gäst) });
      }
    } catch (error) {
      console.error('Fel vid uppdatering av checklistan:', error);
    }
  };

  const visaIncheckadeGäster = async () => {
    if (!valtDatum) {
      alert('Välj ett datum först!');
      return;
    }

    const checklistRef = doc(db, 'Checklist', valtDatum);
    const checklistSnap = await getDoc(checklistRef);

    if (checklistSnap.exists()) {
      const incheckade = checklistSnap.data().guests || [];
      // Sortera incheckade gäster i alfabetisk ordning
      const sorteradeIncheckade = incheckade.sort((a, b) => a.localeCompare(b, 'sv', { sensitivity: 'base' }));
      setIncheckadeGäster(sorteradeIncheckade);
    } else {
      setIncheckadeGäster([]);
    }

    setVisarEndastIncheckade(true);
  };

  const visaBokningarIgen = () => {
    setVisarEndastIncheckade(false);
    setIncheckadeGäster([]);
  };

  // För att se till att bokningspersonen hamnar först
  const sorteraGäster = (gäster, bokningsNamn) => {
    // Lägg till bokningspersonen i början av listan och sortera de övriga gästerna
    const allaGäster = [bokningsNamn, ...gäster];
    return allaGäster
      .map(g => g.trim())
      .filter(g => g !== '') // Ta bort tomma värden
      .sort((a, b) => a.localeCompare(b, 'sv', { sensitivity: 'base' }));
  };

  // Kontrollera om gästen finns bland de incheckade
  const ärCheckad = (gäst) => {
    return checkadeGäster[gäst] || false;
  };

  if (!loggedIn) {
    return (
      <div className="GuestlistAdmin">
        <form onSubmit={hanteraInloggning}>
          <label htmlFor="password">Lösenord:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Logga in</button>
        </form>
      </div>
    );
  }

  return (
    <div className="GuestlistAdmin">
      {/* Visa endast incheckade gäster */}
      {visarEndastIncheckade ? (
        <div>
          <button onClick={visaBokningarIgen}>Tillbaka</button>
          <h2>Incheckade gäster för {valtDatum}</h2>
          {incheckadeGäster.length > 0 ? (
            <ul>
              {incheckadeGäster.map((gäst, index) => (
                <li key={index}>{gäst}</li>
              ))}
            </ul>
          ) : (
            <p>Inga gäster har checkats in ännu.</p>
          )}
        </div>
      ) : (
        <>
          <div>
            <h2>Välj ett datum:</h2>
            <select value={valtDatum} onChange={filtreraBokningarEfterDatum}>
              <option value="">Visa alla datum</option>
              {uniktDatum.map((datum, index) => (
                <option key={index} value={datum}>
                  {datum}
                </option>
              ))}
            </select>
          </div>

          <button onClick={visaIncheckadeGäster}>Visa incheckade gäster</button>

          <div className="listor">
            <ul>
              {filtreradeBokningar.map((bokning) => (
                <li key={bokning.id} onClick={() => setValdBokning(bokning)}>
                  {bokning.bookingName} - {bokning.date}
                </li>
              ))}
            </ul>

            {valdBokning && (
              <div>
                <h2>Gäster för {valdBokning.bookingName}</h2>
                <ol>
  {sorteraGäster(valdBokning.GuestNames.split(', '), valdBokning.bookingName).map((gäst, index) => (
    <li key={index}>
      {gäst} {/* Gästens namn */}
      <input
        type="checkbox"
        checked={ärCheckad(gäst)} // Kontrollera om gästen är checkad
        onChange={() => toggleCheckGäst(gäst, valdBokning.date)}
      />
    </li>
  ))}
</ol>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GuestlistAdmin;
