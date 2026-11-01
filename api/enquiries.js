export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, business, contact, message } = req.body || {};
    if (!name || !business || !contact) {
      return res.status(400).json({ error: 'Name, business, and contact details are required.' });
    }

    const newEnquiry = {
      id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim(),
      business: String(business).trim(),
      contact: String(contact).trim(),
      message: String(message || '').trim(),
      status: 'new',
      createdAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Enquiry received successfully.',
      enquiry: newEnquiry
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      enquiries: []
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
