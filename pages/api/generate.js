export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: `Erstelle eine vollständige professionelle HTML-Website.

UNTERNEHMENSDATEN:
- Name: ${formData.companyName}
- Tagline: ${formData.tagline || 'Ihre digitale Lösung'}
- Beschreibung: ${formData.description}
- Services: ${formData.services.length > 0 ? formData.services.join(', ') : 'Web Design, Marketing, Beratung'}
- Telefon: ${formData.phone || 'Nicht angegeben'}
- Email: ${formData.email}
- Adresse: ${formData.address || 'Nicht angegeben'}
- Farbe: ${formData.color}

ANFORDERUNGEN:
1. Komplettes HTML mit <!DOCTYPE>, <html>, <head>, <body>
2. Responsive und mobile-friendly
3. Modern und professionell
4. Benutze die angegebene Farbe überall
5. Services als ansprechende Cards
6. Inline CSS (alles im <head>)
7. Kein JavaScript
8. Header, Hero, Über uns, Services, Kontakt, Footer

Gib NUR das komplette HTML aus!`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ 
        error: 'Failed to generate website',
        details: error.error?.message || 'Unknown error'
      });
    }

    const data = await response.json();
    const htmlContent = data.content[0].text;

    return res.status(200).json({ 
      html: htmlContent,
      success: true 
    });

  } catch (error) {
    console.error('Generation Error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
}
