import React, { useState } from 'react';

export default function WebsiteGenerator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    description: '',
    services: [],
    phone: '',
    email: '',
    address: '',
    color: '#3B82F6'
  });
  
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const value = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, services: value }));
  };

  const generateWebsite = async () => {
    if (!formData.companyName || !formData.email || !formData.description) {
      setError('Bitte fülle aus: Unternehmensname, E-Mail und Beschreibung!');
      return;
    }

    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fehler beim Generieren');
      }

      const data = await response.json();
      setGeneratedHTML(data.html);
      setStep(3);
    } catch (err) {
      setError('Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const downloadHTML = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedHTML], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.companyName.replace(/\s+/g, '_')}_website.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedHTML);
    alert('HTML kopiert!');
  };

  if (step === 3 && generatedHTML) {
    return (
      <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setStep(1)} style={{ padding: '10px 20px', cursor: 'pointer', background: 'white', border: '1px solid #ddd', borderRadius: '6px', fontWeight: '500' }}>← Neue Website</button>
            <button onClick={downloadHTML} style={{ padding: '10px 20px', cursor: 'pointer', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500' }}>⬇️ HTML herunterladen</button>
            <button onClick={copyCode} style={{ padding: '10px 20px', cursor: 'pointer', background: 'white', border: '1px solid #ddd', borderRadius: '6px', fontWeight: '500' }}>📋 Code kopieren</button>
          </div>
          <div style={{ padding: '15px', background: '#e8f5e9', borderRadius: '6px', marginBottom: '20px', color: '#2e7d32' }}>✅ Website erstellt!</div>
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '15px', background: '#f0f0f0', borderBottom: '1px solid #ddd', fontWeight: '500' }}>Vorschau: {formData.companyName}</div>
            <iframe srcDoc={generatedHTML} style={{ width: '100%', height: '700px', border: 'none' }} title="Website Preview" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>🌐 Website Generator</h1>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>Erstelle Websites in Minuten</p>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Unternehmensname *</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="z.B. Müller GmbH" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Tagline</label>
                <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="z.B. Ihre digitale Lösung" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Beschreibung *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Beschreibe dein Unternehmen..." rows="4" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Services (komma-getrennt)</label>
                <textarea name="services" value={formData.services.join(', ')} onChange={handleServiceChange} placeholder="z.B. Web Design, SEO, Marketing" rows="2" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>E-Mail *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="kontakt@beispiel.de" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Telefon</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+49 (0) XXX" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Adresse</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Straße 123, 12345 Stadt" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <button onClick={() => setStep(2)} style={{ padding: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>Weiter →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#333' }}>Primärfarbe</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'].map(color => (
                    <button key={color} onClick={() => setFormData(prev => ({ ...prev, color }))} style={{ width: '50px', height: '50px', background: color, border: formData.color === color ? '3px solid #333' : '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
              {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>⚠️ {error}</div>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>← Zurück</button>
                <button onClick={generateWebsite} disabled={loading} style={{ flex: 1, padding: '12px', background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}>{loading ? '⏳ Erstelle...' : '✨ Erstellen'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
