const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { ensureConnected } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Tighten to client domain in production
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to Database: start at boot, and make every API request wait for the
// connection (required on Vercel, which freezes the process between requests)
ensureConnected().then(() => {
  console.log('Database initialization check complete.');
});
app.use('/api', async (req, res, next) => {
  if (req.path === '/health/probe') return next();
  try {
    await ensureConnected();
  } catch (err) {
    console.error('Database connection wait failed:', err.message);
  }
  next();
});

// Import route groups
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const doctorRoutes = require('./routes/doctors');
const testimonialRoutes = require('./routes/testimonials');
const faqRoutes = require('./routes/faqs');
const settingsRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');

// Mount route groups
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Network probe: can this server reach the Atlas hosts at all? (no credentials used)
app.get('/api/health/probe', async (req, res) => {
  const dns = require('dns').promises;
  const net = require('net');
  const tls = require('tls');
  const uri = process.env.MONGODB_URI || '';
  const host = (uri.match(/@([^/?]+)/) || [])[1];
  const out = { host, srv: null, tcp: [], tls: [] };
  try {
    const srv = await dns.resolveSrv(`_mongodb._tcp.${host}`);
    out.srv = srv.map(s => `${s.name}:${s.port}`);
    const attempt = (fn) => new Promise(resolve => {
      const started = Date.now();
      const done = (msg) => resolve(`${msg} (${Date.now() - started}ms)`);
      try { fn(done); } catch (e) { done(`error ${e.message}`); }
    });
    for (const s of srv) {
      out.tcp.push(`${s.name}: ` + await attempt(done => {
        const c = net.connect({ host: s.name, port: s.port, timeout: 7000 }, () => { c.destroy(); done('ok'); });
        c.on('timeout', () => { c.destroy(); done('timeout'); });
        c.on('error', e => done(`error ${e.code || e.message}`));
      }));
      out.tls.push(`${s.name}: ` + await attempt(done => {
        const c = tls.connect({ host: s.name, port: s.port, servername: s.name, timeout: 7000 }, () => { c.destroy(); done('ok'); });
        c.on('timeout', () => { c.destroy(); done('timeout'); });
        c.on('error', e => done(`error ${e.code || e.message}`));
      }));
    }
  } catch (e) {
    out.error = e.code || e.message;
  }
  res.json(out);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dbConnected: global.dbConnected || false,
    // Why the database isn't connected (credentials removed), to diagnose deployments
    dbError: global.dbConnected ? undefined : (global.dbLastError || 'Not connected yet'),
    // Which cluster the server is configured for — host only, never credentials
    dbTarget: (() => {
      const uri = process.env.MONGODB_URI || '';
      if (!uri) return 'MONGODB_URI is not set';
      const m = uri.match(/@([^/?]+)/);
      const db = (uri.match(/@[^/]+\/([^?]*)/) || [])[1];
      return `${m ? m[1] : 'no @ found in value'} | db: ${db || '(none)'} | starts: ${uri.slice(0, 14)} | length: ${uri.length}`;
    })()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Home Healthcare Services API is running...',
    version: '1.0.0'
  });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
