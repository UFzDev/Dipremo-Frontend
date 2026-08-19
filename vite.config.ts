import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Definir la ruta absoluta local para la persistencia en disco
const historyDir = path.resolve(process.cwd(), 'history');
if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir, { recursive: true });
}

let activeFile = '';
const CSV_HEADERS = "Timestamp,RMS_X,RMS_Y,RMS_Z,Kurtosis_X,Kurtosis_Y,Kurtosis_Z,Velocity_ISO,Board_Temp,Comm_Health,Alarm_Status\n";

function createNewFile() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const filename = `motor_${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.csv`;
  activeFile = filename;
  const filePath = path.join(historyDir, filename);
  fs.writeFileSync(filePath, CSV_HEADERS, 'utf8');
  return filename;
}

function getActiveFile() {
  if (activeFile) return activeFile;
  const files = fs.readdirSync(historyDir).filter((f: string) => f.endsWith('.csv')).sort();
  if (files.length > 0) {
    activeFile = files[files.length - 1]; // Toma el más reciente
  } else {
    createNewFile();
  }
  return activeFile;
}

// Plugin personalizado para servir de API interna persistente
const localHistoryPlugin = () => {
  return {
    name: 'local-history-api',
    configureServer(server: any) {
      // POST: Generar un nuevo registro maestro
      server.middlewares.use('/api/history/new', (req: any, res: any) => {
        if (req.method === 'POST') {
          const newFile = createNewFile();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, activeFile: newFile }));
        }
      });

      // POST: Anexar bloque de datos con altísima velocidad
      server.middlewares.use('/api/history/append', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
             const currentFile = getActiveFile();
             const filePath = path.join(historyDir, currentFile);
             
             // Por robustez, si se borró manualmente, lo crea con headers
             if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, CSV_HEADERS, 'utf8');
             }
             
             fs.appendFileSync(filePath, body + '\n', 'utf8');
             
             res.setHeader('Content-Type', 'application/json');
             res.end(JSON.stringify({ success: true, appendedTo: currentFile }));
          });
        }
      });

      // GET: Descargar el archivo activo
      server.middlewares.use('/api/history/export', (req: any, res: any) => {
        if (req.method === 'GET') {
          const currentFile = getActiveFile();
          const filePath = path.join(historyDir, currentFile);
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${currentFile}"`);
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
          } else {
            res.statusCode = 404;
            res.end('Archivo no encontrado');
          }
        }
      });

      // GET: Leer el contenido actual para la tabla
      server.middlewares.use('/api/history/current', (req: any, res: any) => {
        if (req.method === 'GET') {
          const currentFile = getActiveFile();
          const filePath = path.join(historyDir, currentFile);
          if (fs.existsSync(filePath)) {
             res.setHeader('Content-Type', 'text/csv');
             res.end(fs.readFileSync(filePath, 'utf8'));
          } else {
             res.setHeader('Content-Type', 'text/csv');
             res.end(CSV_HEADERS);
          }
        }
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), localHistoryPlugin()],
})
