import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function jsonCrudPlugin() {
  const dataDir = path.resolve(__dirname, 'data');
  const srcDataDir = path.resolve(__dirname, 'src', 'data');

  const getFilePath = (resource) => path.resolve(dataDir, `${resource}.json`);
  const getSrcFilePath = (resource) => path.resolve(srcDataDir, `${resource}.json`);

  const readData = (resource) => {
    const filePath = getFilePath(resource);
    const srcFilePath = getSrcFilePath(resource);
    try {
      if (!fs.existsSync(filePath)) {
        if (fs.existsSync(srcFilePath)) {
          return JSON.parse(fs.readFileSync(srcFilePath, 'utf-8'));
        }
        return [];
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch {
      return [];
    }
  };

  const writeData = (resource, data) => {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const jsonStr = JSON.stringify(data, null, 2);
    fs.writeFileSync(getFilePath(resource), jsonStr, 'utf-8');

    // Also sync src/data/ for fallback
    try {
      if (!fs.existsSync(srcDataDir)) {
        fs.mkdirSync(srcDataDir, { recursive: true });
      }
      fs.writeFileSync(getSrcFilePath(resource), jsonStr, 'utf-8');
    } catch (e) {
      console.warn(`Failed to sync src/data/${resource}.json`, e);
    }
  };

  const parseBody = (req) =>
    new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
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

  const sendJson = (res, statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end(JSON.stringify(data));
  };

  return {
    name: 'vite-plugin-json-crud',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        if (!pathname.startsWith('/api/')) {
          return next();
        }

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.end();
          return;
        }

        const match = pathname.match(/^\/api\/(jobs|freelancers|proposals|users)(?:\/([^/]+))?$/);
        if (!match) {
          return next();
        }

        const resource = match[1];
        const id = match[2];

        try {
          const items = readData(resource);

          // GET /api/:resource (Read all)
          if (req.method === 'GET' && !id) {
            return sendJson(res, 200, items);
          }

          // GET /api/:resource/:id (Read one)
          if (req.method === 'GET' && id) {
            const item = items.find((x) => String(x.id) === String(id));
            if (!item) {
              return sendJson(res, 404, { error: `${resource} item not found` });
            }
            return sendJson(res, 200, item);
          }

          // POST /api/:resource (Create)
          if (req.method === 'POST' && !id) {
            const body = await parseBody(req);
            const newItem = {
              id: body.id || (resource === 'proposals' ? `prop-${Date.now()}` : Date.now().toString()),
              ...body,
              createdAt: new Date().toISOString()
            };

            items.unshift(newItem);
            writeData(resource, items);
            return sendJson(res, 201, newItem);
          }

          // PUT /api/:resource/:id (Update)
          if (req.method === 'PUT' && id) {
            const body = await parseBody(req);
            const index = items.findIndex((x) => String(x.id) === String(id));
            if (index === -1) {
              return sendJson(res, 404, { error: `${resource} item not found` });
            }

            const updatedItem = {
              ...items[index],
              ...body,
              id: items[index].id,
              updatedAt: new Date().toISOString()
            };

            items[index] = updatedItem;
            writeData(resource, items);
            return sendJson(res, 200, updatedItem);
          }

          // DELETE /api/:resource/:id (Delete)
          if (req.method === 'DELETE' && id) {
            const index = items.findIndex((x) => String(x.id) === String(id));
            if (index === -1) {
              return sendJson(res, 404, { error: `${resource} item not found` });
            }

            const deletedItem = items.splice(index, 1)[0];
            writeData(resource, items);
            return sendJson(res, 200, {
              success: true,
              message: `${resource} deleted successfully`,
              deletedItem
            });
          }

          return sendJson(res, 405, { error: 'Method not allowed' });
        } catch (error) {
          console.error(`API Error on /api/${resource}:`, error);
          return sendJson(res, 500, { error: 'Internal server error' });
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsonCrudPlugin()],
  server: {
    watch: {
      ignored: ['**/data/**', '**/src/data/**']
    }
  }
});
