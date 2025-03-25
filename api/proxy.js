// api/proxy.js

export default async function handler(req, res) {
  const { auth_hash, restid, email } = req.query; // Hämta query-parametrarna från URL

  try {
    // Skicka begäran vidare till det externa API:et
    const response = await fetch(
      `https://app.waiteraid.com/wa-api/searchBooking?auth_hash=${auth_hash}&restid=${restid}&email=${email}`
    );

    https: if (!response.ok) {
      throw new Error(`API-fel: ${response.status}`);
    }

    // Läs data från API-svaret
    const data = await response.json();

    // Skicka tillbaka datan till frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("Fel i proxy-funktionen:", error);
    res.status(500).json({ error: "Något gick fel med API-anropet." });
  }
}
