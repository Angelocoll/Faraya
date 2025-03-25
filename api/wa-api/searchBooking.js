export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Tillåt alla ursprung, ändra om du vill specificera ursprung

  const { auth_hash, restid, email } = req.query;

  const apiUrl = `https://app.waiteraid.com/wa-api/searchBooking?auth_hash=${auth_hash}&restid=${restid}&email=${email}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: "API request failed" });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
