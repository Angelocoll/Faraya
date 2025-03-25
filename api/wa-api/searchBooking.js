// api/wa-api/searchBooking.js
export default async function handler(req, res) {
  const { auth_hash, restid, email } = req.query;

  const apiUrl = `https://app.waiteraid.com/wa-api/searchBooking?auth_hash=${auth_hash}&restid=${restid}&email=${email}`;

  try {
    // Skicka begäran till den externa servern
    const response = await fetch(apiUrl);

    // Kontrollera om svaret är OK
    if (!response.ok) {
      return res.status(response.status).json({ error: "API request failed" });
    }

    // Hämta JSON-data
    const data = await response.json();

    // Skicka tillbaka datan till frontend
    return res.status(200).json(data);
  } catch (error) {
    // Vid fel, skicka tillbaka ett fel
    return res.status(500).json({ error: "Internal server error" });
  }
}
