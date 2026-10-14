const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

// Ensure data directory and results file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(RESULTS_FILE)) {
  fs.writeFileSync(RESULTS_FILE, JSON.stringify([], null, 2));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

function readResults() {
  try {
    const raw = fs.readFileSync(RESULTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading results file:', e);
    return [];
  }
}

function writeResults(data) {
  try {
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing results file:', e);
  }
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() }));
    return;
  }

  if (pathname === '/api/sessions' && req.method === 'GET') {
    const results = readResults();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results));
    return;
  }

  if (pathname === '/api/sessions' && req.method === 'POST') {
    try {
      const session = await parseJsonBody(req);
      session.id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
      session.createdAt = new Date().toISOString();
      
      const allResults = readResults();
      allResults.unshift(session);
      writeResults(allResults);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, session }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/sessions' && req.method === 'DELETE') {
    writeResults([]);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'All session records cleared' }));
    return;
  }

  if (pathname === '/api/export/csv' && req.method === 'GET') {
    const results = readResults();
    const rows = [
      ['Session ID', 'Timestamp', 'Participant', 'Mode', 'Accuracy (%)', 'Avg RT (ms)', 'Total Trials', 'Hits', 'Misses', 'Trial Index', 'Scenario', 'Change Item', 'Trial Result', 'Trial RT (ms)', 'Target X', 'Target Y', 'Click X', 'Click Y'].join(',')
    ];

    results.forEach(s => {
      (s.trials || []).forEach((t, idx) => {
        rows.push([
          `"${s.id || ''}"`,
          `"${s.createdAt || ''}"`,
          `"${(s.username || '').replace(/"/g, '""')}"`,
          `"${s.mode || 'single-flicker'}"`,
          s.accuracy ?? '',
          s.avgReactionTime ?? '',
          s.totalTrials ?? '',
          s.hits ?? '',
          s.misses ?? '',
          idx + 1,
          `"${(t.scenario || '').replace(/"/g, '""')}"`,
          `"${(t.targetName || '').replace(/"/g, '""')}"`,
          t.correct ? 'Hit' : 'Miss',
          t.reactionTime ?? '',
          t.targetCenter ? t.targetCenter.x : '',
          t.targetCenter ? t.targetCenter.y : '',
          t.clickPos ? t.clickPos.x : '',
          t.clickPos ? t.clickPos.y : ''
        ].join(','));
      });
    });

    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=UTF-8',
      'Content-Disposition': 'attachment; filename="inattention_blindness_data.csv"'
    });
    res.end(rows.join('\n'));
    return;
  }

  // Serve static files from /public
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  // Security check: ensure path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA-style routing if needed, or 404
      const indexFallback = path.join(PUBLIC_DIR, 'index.html');
      if (fs.existsSync(indexFallback)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        fs.createReadStream(indexFallback).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

let currentPort = parseInt(process.env.PORT, 10) || 3000;

function startServer(port) {
  server.listen(port, () => {
    console.log(`====================================================`);
    console.log(`🧠 Inattention Blindness Prototype Server is RUNNING`);
    console.log(`🚀 Local URL: http://localhost:${port}`);
    console.log(`👤 Default Subject: Rishab Bajaj`);
    console.log(`📦 Architecture: Single Self-Contained Service`);
    console.log(`====================================================`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Notice: Port ${currentPort} is busy. Trying port ${currentPort + 1}...`);
    currentPort += 1;
    startServer(currentPort);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);

