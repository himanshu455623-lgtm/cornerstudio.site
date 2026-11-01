import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'Himanshu@sahin';

app.use(express.json());

// Persistent store setup
const DATA_DIR = path.resolve('data');
const DATA_FILE = path.join(DATA_DIR, 'enquiries.json');

interface Enquiry {
  id: string;
  name: string;
  business: string;
  contact: string;
  message: string;
  status: 'new' | 'contacted' | 'archived';
  createdAt: string;
}

function initDataStore(): Enquiry[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }

  // Initial sample leads
  const initialLeads: Enquiry[] = [
    {
      id: 'enq_demo_1',
      name: 'Priya Sharma',
      business: 'Artisan Bakes & Treats',
      contact: '+91 98765 43210',
      message: 'Need a mobile-friendly menu and online cake pre-ordering setup.',
      status: 'new',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'enq_demo_2',
      name: 'Rajesh Varma',
      business: 'Varma Modern Salon',
      contact: 'rajesh@varmasalon.in',
      message: 'Looking for the Business plan with Google Maps and 1-tap WhatsApp booking.',
      status: 'contacted',
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    },
  ];

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialLeads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial leads:', err);
  }

  return initialLeads;
}

function readEnquiries(): Enquiry[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading enquiries:', err);
  }
  return initDataStore();
}

function saveEnquiries(enquiries: Enquiry[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(enquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving enquiries:', err);
  }
}

// Initialize on start
initDataStore();

// Admin verification middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['x-admin-key'] as string;
  const authQuery = req.query.key as string;
  const key = authHeader || authQuery;

  if (key === ADMIN_PASSCODE) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Invalid admin passcode.' });
}

/* ===== API ROUTES ===== */

// 1. Submit public enquiry
app.post('/api/enquiries', (req: Request, res: Response) => {
  const { name, business, contact, message } = req.body || {};

  if (!name || !business || !contact) {
    return res.status(400).json({ error: 'Name, business, and contact details are required.' });
  }

  const newEnquiry: Enquiry = {
    id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: String(name).trim(),
    business: String(business).trim(),
    contact: String(contact).trim(),
    message: String(message || '').trim(),
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  const current = readEnquiries();
  current.unshift(newEnquiry);
  saveEnquiries(current);

  res.status(201).json({
    success: true,
    message: 'Enquiry submitted successfully.',
    enquiry: newEnquiry,
  });
});

// 2. Admin: Verify passcode
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { key } = req.body || {};
  if (key === ADMIN_PASSCODE) {
    return res.json({ valid: true });
  }
  res.status(401).json({ valid: false, error: 'Incorrect admin passcode.' });
});

// 3. Admin: List all enquiries
app.get('/api/enquiries', requireAdmin, (_req: Request, res: Response) => {
  const enquiries = readEnquiries();
  res.json({ success: true, enquiries });
});

// 4. Admin: Update enquiry status
app.patch('/api/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!['new', 'contacted', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be new, contacted, or archived.' });
  }

  const current = readEnquiries();
  const index = current.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  current[index].status = status;
  saveEnquiries(current);

  res.json({ success: true, enquiry: current[index] });
});

// 5. Admin: Delete enquiry
app.delete('/api/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const current = readEnquiries();
  const filtered = current.filter((e) => e.id !== id);

  if (filtered.length === current.length) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  saveEnquiries(filtered);
  res.json({ success: true, message: 'Enquiry deleted.' });
});

/* ===== VITE / STATIC SERVING ===== */
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Corner Studio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
