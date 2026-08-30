/**
 * Al Huda Real Estate - Backend Server (Express REST API)
 * Specialized for Sheikh Zayed City, Egypt | Currency: EGP
 * Supports Local File Uploads (Images & Videos) via Multer
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Data directory & paths
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');
const SEED_BACKUP_FILE = path.join(DATA_DIR, 'seed_backup.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure uploads & data directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration for Local File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBaseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `alhuda-${cleanBaseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter (Images and Videos only)
const fileFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.mp4', '.mov', '.webm', '.avi', '.mkv'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are supported!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB max per file (supports high quality videos & photos)
  }
});

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static frontend files and uploads
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper: Read Database
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      if (fs.existsSync(SEED_BACKUP_FILE)) {
        const seedData = fs.readFileSync(SEED_BACKUP_FILE, 'utf8');
        fs.writeFileSync(DB_FILE, seedData, 'utf8');
        return JSON.parse(seedData);
      }
      return { properties: [], viewings: [], inquiries: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database:', err);
    return { properties: [], viewings: [], inquiries: [] };
  }
}

// Helper: Write Database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing database:', err);
    return false;
  }
}

// ============================================================================
// API ROUTES
// ============================================================================

// 0. File Upload Route (Multiple Images & Videos)
app.post('/api/upload', upload.array('media_files', 25), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded.'
      });
    }

    const uploadedUrls = req.files.map(file => `/uploads/${file.filename}`);
    return res.status(200).json({
      success: true,
      message: 'Files uploaded successfully',
      urls: uploadedUrls,
      count: uploadedUrls.length
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
});

// 1. GET /api/properties - Filter and list Sheikh Zayed properties
app.get('/api/properties', (req, res) => {
  const db = readDB();
  let results = [...(db.properties || [])];

  const { search, status, type, district, minPrice, maxPrice, bedrooms, amenity, featured } = req.query;

  // Search keyword (Title, District, Description in AR/EN)
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    results = results.filter(p => {
      const titleAr = (p.title?.ar || '').toLowerCase();
      const titleEn = (p.title?.en || '').toLowerCase();
      const districtAr = (p.location?.district?.ar || '').toLowerCase();
      const districtEn = (p.location?.district?.en || '').toLowerCase();
      const descAr = (p.description?.ar || '').toLowerCase();
      const descEn = (p.description?.en || '').toLowerCase();
      return (
        titleAr.includes(q) ||
        titleEn.includes(q) ||
        districtAr.includes(q) ||
        districtEn.includes(q) ||
        descAr.includes(q) ||
        descEn.includes(q)
      );
    });
  }

  // Status (for-sale / for-rent / furnished-rent)
  if (status && status !== 'all') {
    results = results.filter(p => p.status === status);
  }

  // Property Type
  if (type && type !== 'all') {
    results = results.filter(p => p.type === type);
  }

  // District / Compound in Sheikh Zayed
  if (district && district !== 'all') {
    results = results.filter(p => {
      const dAr = p.location?.district?.ar || '';
      const dEn = p.location?.district?.en || '';
      return dAr.includes(district) || dEn.toLowerCase().includes(district.toLowerCase());
    });
  }

  // Min Price (in EGP)
  if (minPrice && !isNaN(Number(minPrice))) {
    results = results.filter(p => Number(p.price) >= Number(minPrice));
  }

  // Max Price (in EGP)
  if (maxPrice && !isNaN(Number(maxPrice))) {
    results = results.filter(p => Number(p.price) <= Number(maxPrice));
  }

  // Bedrooms (e.g. 2, 3, 4, 5)
  if (bedrooms && bedrooms !== 'all' && !isNaN(Number(bedrooms))) {
    const beds = Number(bedrooms);
    results = results.filter(p => Number(p.specs?.bedrooms || 0) >= beds);
  }

  // Amenity
  if (amenity && amenity !== 'all') {
    results = results.filter(p => Array.isArray(p.amenities) && p.amenities.includes(amenity));
  }

  // Featured flag
  if (featured === 'true') {
    results = results.filter(p => p.featured === true);
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// 2. GET /api/properties/:id - Get single property
app.get('/api/properties/:id', (req, res) => {
  const db = readDB();
  const property = db.properties.find(p => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  res.json({ success: true, data: property });
});

// 3. POST /api/properties - Create new property in Sheikh Zayed
app.post('/api/properties', (req, res) => {
  const db = readDB();
  const newProp = {
    id: `prop-zayed-${Date.now()}`,
    title: req.body.title || { ar: '', en: '' },
    description: req.body.description || { ar: '', en: '' },
    price: Number(req.body.price) || 0,
    currency: 'EGP',
    type: req.body.type || 'villa',
    status: req.body.status || 'for-sale',
    location: {
      city: { ar: 'مدينة الشيخ زايد', en: 'Sheikh Zayed City' },
      district: req.body.location?.district || { ar: 'الشيخ زايد', en: 'Sheikh Zayed' },
      country: { ar: 'مصر', en: 'Egypt' },
      address: req.body.location?.address || { ar: 'مدينة الشيخ زايد', en: 'Sheikh Zayed City' }
    },
    specs: {
      bedrooms: Number(req.body.specs?.bedrooms) || 3,
      bathrooms: Number(req.body.specs?.bathrooms) || 3,
      area_sqm: Number(req.body.specs?.area_sqm) || 0,
      area_sqft: Math.round((Number(req.body.specs?.area_sqm) || 0) * 10.7639),
      floors: Number(req.body.specs?.floors) || 1
    },
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : [],
    images: Array.isArray(req.body.images) && req.body.images.length > 0 ? req.body.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'],
    videos: Array.isArray(req.body.videos) ? req.body.videos : [],
    featured: Boolean(req.body.featured),
    badge: req.body.badge || { ar: '', en: '' },
    created_at: new Date().toISOString()
  };

  db.properties.unshift(newProp);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Property added successfully', data: newProp });
});

// 4. PUT /api/properties/:id - Update property
app.put('/api/properties/:id', (req, res) => {
  const db = readDB();
  const index = db.properties.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  const existing = db.properties[index];
  const updated = {
    ...existing,
    title: req.body.title || existing.title,
    description: req.body.description || existing.description,
    price: Number(req.body.price) || existing.price,
    currency: 'EGP',
    type: req.body.type || existing.type,
    status: req.body.status || existing.status,
    location: {
      city: { ar: 'مدينة الشيخ زايد', en: 'Sheikh Zayed City' },
      district: req.body.location?.district || existing.location.district,
      country: { ar: 'مصر', en: 'Egypt' },
      address: req.body.location?.address || existing.location.address
    },
    specs: {
      bedrooms: Number(req.body.specs?.bedrooms) ?? existing.specs?.bedrooms,
      bathrooms: Number(req.body.specs?.bathrooms) ?? existing.specs?.bathrooms,
      area_sqm: Number(req.body.specs?.area_sqm) ?? existing.specs?.area_sqm,
      area_sqft: Math.round((Number(req.body.specs?.area_sqm) || existing.specs?.area_sqm || 0) * 10.7639),
      floors: Number(req.body.specs?.floors) ?? existing.specs?.floors
    },
    amenities: Array.isArray(req.body.amenities) ? req.body.amenities : existing.amenities,
    images: Array.isArray(req.body.images) ? req.body.images : existing.images,
    videos: Array.isArray(req.body.videos) ? req.body.videos : (existing.videos || []),
    featured: req.body.featured !== undefined ? Boolean(req.body.featured) : existing.featured,
    badge: req.body.badge || existing.badge,
    updated_at: new Date().toISOString()
  };

  db.properties[index] = updated;
  writeDB(db);
  res.json({ success: true, message: 'Property updated successfully', data: updated });
});

// 5. DELETE /api/properties/:id - Delete property
app.delete('/api/properties/:id', (req, res) => {
  const db = readDB();
  const initialLen = db.properties.length;
  db.properties = db.properties.filter(p => p.id !== req.params.id);
  if (db.properties.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  writeDB(db);
  res.json({ success: true, message: 'Property deleted successfully' });
});

// 6. GET /api/viewings - Get all viewing bookings
app.get('/api/viewings', (req, res) => {
  const db = readDB();
  res.json({ success: true, count: db.viewings?.length || 0, data: db.viewings || [] });
});

// 7. POST /api/viewings - Book a viewing
app.post('/api/viewings', (req, res) => {
  const db = readDB();
  const property = db.properties.find(p => p.id === req.body.property_id);

  const newViewing = {
    id: `view-${Date.now()}`,
    property_id: req.body.property_id || null,
    property_title: property ? property.title : { ar: 'طلب معاينة عام بالشيخ زايد', en: 'General Zayed Viewing' },
    client_name: req.body.client_name,
    client_phone: req.body.client_phone,
    client_email: req.body.client_email || '',
    preferred_date: req.body.preferred_date,
    preferred_time: req.body.preferred_time || '12:00',
    viewing_mode: req.body.viewing_mode || 'in-person',
    notes: req.body.notes || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };

  if (!db.viewings) db.viewings = [];
  db.viewings.unshift(newViewing);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Viewing booked successfully', data: newViewing });
});

// 8. PATCH /api/viewings/:id - Update viewing status
app.patch('/api/viewings/:id', (req, res) => {
  const db = readDB();
  const viewing = (db.viewings || []).find(v => v.id === req.params.id);
  if (!viewing) {
    return res.status(404).json({ success: false, message: 'Viewing not found' });
  }
  if (req.body.status) viewing.status = req.body.status;
  writeDB(db);
  res.json({ success: true, message: 'Viewing updated', data: viewing });
});

// 9. DELETE /api/viewings/:id - Delete viewing
app.delete('/api/viewings/:id', (req, res) => {
  const db = readDB();
  db.viewings = (db.viewings || []).filter(v => v.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Viewing deleted' });
});

// 10. GET /api/inquiries - Get all contact messages
app.get('/api/inquiries', (req, res) => {
  const db = readDB();
  res.json({ success: true, count: db.inquiries?.length || 0, data: db.inquiries || [] });
});

// 11. POST /api/inquiries - Submit contact message
app.post('/api/inquiries', (req, res) => {
  const db = readDB();
  const newInq = {
    id: `inq-${Date.now()}`,
    name: req.body.name,
    email: req.body.email || '',
    phone: req.body.phone,
    subject: req.body.subject || 'General Inquiry',
    message: req.body.message,
    status: 'new',
    created_at: new Date().toISOString()
  };

  if (!db.inquiries) db.inquiries = [];
  db.inquiries.unshift(newInq);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Inquiry received', data: newInq });
});

// 12. PATCH /api/inquiries/:id - Update inquiry status
app.patch('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  const inq = (db.inquiries || []).find(i => i.id === req.params.id);
  if (!inq) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  if (req.body.status) inq.status = req.body.status;
  writeDB(db);
  res.json({ success: true, message: 'Inquiry updated', data: inq });
});

// 13. DELETE /api/inquiries/:id - Delete inquiry
app.delete('/api/inquiries/:id', (req, res) => {
  const db = readDB();
  db.inquiries = (db.inquiries || []).filter(i => i.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'Inquiry deleted' });
});

// 14. GET /api/stats - Admin Dashboard Stats in EGP
app.get('/api/stats', (req, res) => {
  const db = readDB();
  const props = db.properties || [];
  const viewings = db.viewings || [];
  const inquiries = db.inquiries || [];

  const totalValueEGP = props.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  const typeBreakdown = {};
  props.forEach(p => {
    typeBreakdown[p.type] = (typeBreakdown[p.type] || 0) + 1;
  });

  const forSaleCount = props.filter(p => p.status === 'for-sale').length;
  const forRentCount = props.filter(p => p.status === 'for-rent').length;
  const furnishedRentCount = props.filter(p => p.status === 'furnished-rent').length;

  res.json({
    success: true,
    data: {
      totalProperties: props.length,
      totalPortfolioValueEGP: totalValueEGP,
      totalViewings: viewings.length,
      pendingViewings: viewings.filter(v => v.status === 'pending').length,
      totalInquiries: inquiries.length,
      newInquiries: inquiries.filter(i => i.status === 'new').length,
      typeBreakdown,
      forSaleCount,
      forRentCount,
      furnishedRentCount
    }
  });
});

// 15. POST /api/reset - Restore Default Sample Database
app.post('/api/reset', (req, res) => {
  if (fs.existsSync(SEED_BACKUP_FILE)) {
    const seedData = fs.readFileSync(SEED_BACKUP_FILE, 'utf8');
    fs.writeFileSync(DB_FILE, seedData, 'utf8');
    return res.json({ success: true, message: 'Database reset to default Sheikh Zayed seed.' });
  }
  res.status(500).json({ success: false, message: 'Seed backup file not found.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`💎 AL HUDA REAL ESTATE - SHEIKH ZAYED PORTAL RUNNING`);
  console.log(`🌐 Web App:         http://localhost:${PORT}`);
  console.log(`🔒 Hidden Admin:    http://localhost:${PORT}/admin.html`);
  console.log(`📁 Uploads Dir:     ${UPLOADS_DIR}`);
  console.log(`====================================================`);
});
