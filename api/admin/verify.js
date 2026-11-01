export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { key } = req.body || {};
  if (key === (process.env.ADMIN_PASSCODE || 'Himanshu@sahin')) {
    return res.status(200).json({ valid: true });
  }

  return res.status(401).json({ valid: false, error: 'Incorrect passcode.' });
}
