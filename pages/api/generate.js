export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing' });
  }

  try {
    const { formData } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `Erstelle HTML Website für: ${formData.companyName}. Gib NUR HTML aus!`
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'API Error' });
    }

    return res.json({ html: data.content[0].text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
