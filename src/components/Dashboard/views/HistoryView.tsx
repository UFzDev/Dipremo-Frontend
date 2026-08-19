import { useState, useEffect, useMemo, useRef } from 'react'
import { type RMSData } from '../../../lib/algorithms/RMSEngine'

type HistoryViewProps = {
  // Mantenemos history por si se quisiera usar la vista en crudo, pero la ignoramos para la vista CSV.
  history: RMSData[];
};

type CSVRow = {
  timestamp: string;
  rmsX: string;
  rmsY: string;
  rmsZ: string;
  kurtX: string;
  kurtY: string;
  kurtZ: string;
  velIso: string;
  temp: string;
  health: string;
  tipo: string;
};

function HistoryView({}: HistoryViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    timestamp: '', rmsX: '', rmsY: '', rmsZ: '',
    kurtX: '', kurtY: '', kurtZ: '', velIso: '',
    temp: '', health: '', tipo: ''
  });

  const filterInputStyle = {
    width: '100%',
    padding: '0.2rem 0.4rem',
    fontSize: '11px',
    borderRadius: '4px',
    border: '1px solid var(--border-subtle)',
    outline: 'none',
    boxSizing: 'border-box' as const,
    background: 'var(--bg-card)',
    color: 'var(--text-main)'
  };


  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const rowsPerPage = 15;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para parsear una cadena CSV a nuestro objeto de estado
  const parseCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) return []; // Solo cabeceras o vacío
    
    // Ignoramos la cabecera (índice 0)
    const parsedData: CSVRow[] = lines.slice(1).map(line => {
      const cols = line.split(',');
      return {
        timestamp: cols[0] || '--',
        rmsX: cols[1] || '0',
        rmsY: cols[2] || '0',
        rmsZ: cols[3] || '0',
        kurtX: cols[4] || '0',
        kurtY: cols[5] || '0',
        kurtZ: cols[6] || '0',
        velIso: cols[7] || '0',
        temp: cols[8] || '0',
        health: cols[9] || '0',
        tipo: cols[10] || '--'
      };
    }).reverse(); // Mostramos los últimos registros primero

    return parsedData;
  };

  // 1. Cargar el archivo "Activo" desde nuestro Micro-Servidor Local al montar
  useEffect(() => {
    fetch('/api/history/current')
      .then(res => res.text())
      .then(text => {
        setCsvData(parseCSV(text));
      })
      .catch(err => console.error("Error cargando historial local:", err));
  }, []);

  // Recarga en vivo periódica visualmente (opcional, para sentir que ocurre algo)
  useEffect(() => {
    const liveTimer = setInterval(() => {
      fetch('/api/history/current')
        .then(res => res.text())
        .then(text => setCsvData(parseCSV(text)))
        .catch(() => {});
    }, 10000); // Sincroniza visualmente acorde a la escritura del backend
    return () => clearInterval(liveTimer);
  }, []);


  // --- MANEJADORES DE BOTONES ---

  const handleNewRecord = async () => {
    const confirm = window.confirm("¿Deseas iniciar un nuevo archivo de registro? El archivo actual quedará guardado.");
    if (confirm) {
      try {
        await fetch('/api/history/new', { method: 'POST' });
        setCsvData([]); // Limpiamos la tabla, ya que el nuevo está vacío
        setCurrentPage(1);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleExport = () => {
    // El navegador descargará automáticamente el archivo
    window.location.href = '/api/history/export';
  };

  const triggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvData(parseCSV(text));
        setCurrentPage(1);
      }
    };
    reader.readAsText(file);
    // Limpiamos el input para que se pueda volver a importar el mismo archivo si se desea.
    e.target.value = '';
  };


  // --- FILTRADO Y PAGINACIÓN ---
  const filteredHistory = useMemo(() => {
    return csvData.filter(row => {
      // Para el timestamp (fecha), comparamos solo la parte YYYY-MM-DD si es un selector de fecha
      const rowDateString = row.timestamp !== '--' ? new Date(row.timestamp).toISOString().split('T')[0] : '';
      const dateMatch = !filters.timestamp || rowDateString === filters.timestamp;

      // Para los campos numéricos, aplicamos coincidencia por prefijo (empezar con...)
      return (
        dateMatch &&
        (!filters.rmsX || row.rmsX.toLowerCase().startsWith(filters.rmsX.toLowerCase())) &&
        (!filters.rmsY || row.rmsY.toLowerCase().startsWith(filters.rmsY.toLowerCase())) &&
        (!filters.rmsZ || row.rmsZ.toLowerCase().startsWith(filters.rmsZ.toLowerCase())) &&
        (!filters.kurtX || row.kurtX.toLowerCase().startsWith(filters.kurtX.toLowerCase())) &&
        (!filters.kurtY || row.kurtY.toLowerCase().startsWith(filters.kurtY.toLowerCase())) &&
        (!filters.kurtZ || row.kurtZ.toLowerCase().startsWith(filters.kurtZ.toLowerCase())) &&
        (!filters.velIso || row.velIso.toLowerCase().startsWith(filters.velIso.toLowerCase())) &&
        (!filters.temp || row.temp.toLowerCase().startsWith(filters.temp.toLowerCase())) &&
        (!filters.health || row.health.toLowerCase().startsWith(filters.health.toLowerCase())) &&
        (!filters.tipo || row.tipo.toLowerCase().includes(filters.tipo.toLowerCase()))
      );
    });
  }, [csvData, filters]);

  const totalPages = Math.ceil(filteredHistory.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredHistory.slice(indexOfFirstRow, indexOfLastRow);



  return (
    <section style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
           <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Entrene una ia SVM con los datos del dataset final.</h2>
           <p style={{ margin: '0.25rem 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Historial de clasificación de vibraciones (.CSV)</p>
        </div>
        
        {/* BOTONES DE GESTIÓN */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           <input 
            type="file" 
            accept=".csv" 
            style={{ display: 'none' }} 
            ref={fileInputRef} 
            onChange={handleImport}
           />
            <button 
              className="btn btn-ghost"
              onClick={triggerImport}
              style={{ padding: '0.6rem 1rem', fontSize: '13px' }}
            >
              📂 Importar
            </button>
            <button 
              className="btn btn-ghost"
              onClick={handleExport}
              style={{ padding: '0.6rem 1rem', fontSize: '13px' }}
            >
              ⬇️ Exportar
            </button>
           <button 
             className="btn btn-primary"
             onClick={handleNewRecord}
             style={{ padding: '0.6rem 1rem', fontSize: '13px', borderRadius: '0.5rem', cursor: 'pointer', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 600 }}
           >
             ➕ Nuevo Registro
           </button>
        </div>
      </div>

        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', minWidth: '1100px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>TIMESTAMP</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>RMS X</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>RMS Y</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>RMS Z</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>KURT. X</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>KURT. Y</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>KURT. Z</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>VEL. ISO (mm/s)</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>TEMP. PLACA</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>CONEXIÓN</th>
                <th style={{ padding: '0.8rem 1rem', color: 'var(--text-muted)' }}>TIPO</th>
              </tr>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="date" style={filterInputStyle} value={filters.timestamp} onChange={e => handleFilterChange('timestamp', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Inicio..." style={filterInputStyle} value={filters.rmsX} onChange={e => handleFilterChange('rmsX', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Inicio..." style={filterInputStyle} value={filters.rmsY} onChange={e => handleFilterChange('rmsY', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Inicio..." style={filterInputStyle} value={filters.rmsZ} onChange={e => handleFilterChange('rmsZ', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Inicio..." style={filterInputStyle} value={filters.kurtX} onChange={e => handleFilterChange('kurtX', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Inicio..." style={filterInputStyle} value={filters.kurtY} onChange={e => handleFilterChange('kurtY', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Inicio..." style={filterInputStyle} value={filters.kurtZ} onChange={e => handleFilterChange('kurtZ', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Inicio..." style={filterInputStyle} value={filters.velIso} onChange={e => handleFilterChange('velIso', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Inicio..." style={filterInputStyle} value={filters.temp} onChange={e => handleFilterChange('temp', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Inicio..." style={filterInputStyle} value={filters.health} onChange={e => handleFilterChange('health', e.target.value)} /></th>
                <th style={{ padding: '0.4rem 0.5rem' }}><input type="text" placeholder="Buscar..." style={filterInputStyle} value={filters.tipo} onChange={e => handleFilterChange('tipo', e.target.value)} /></th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((row, idx) => (
                  <tr key={`${row.timestamp}-${idx}`} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'transparent' : '#fafafa' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {row.timestamp !== '--' ? new Date(row.timestamp).toLocaleString() : '--'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--error)', fontWeight: 700 }}>{row.rmsX}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--success)', fontWeight: 700 }}>{row.rmsY}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--primary)', fontWeight: 700 }}>{row.rmsZ}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>{row.kurtX}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>{row.kurtY}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>{row.kurtZ}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--text-main)' }}>{row.velIso}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{row.temp}°C</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#8b5cf6' }}>{row.health}%</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#6366f1', fontWeight: 600 }}>{row.tipo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ marginBottom: '1rem', fontSize: '32px' }}>📉</div>
                    <div style={{ fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>Archivo CSV sin registros</div>
                    <p style={{ fontSize: '13px', maxWidth: '400px', margin: '0 auto' }}>
                      El servidor local aún no ha capturado muestras en este bloque, o el archivo importado está vacío.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
            <button 
              className="btn btn-ghost" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '12px' }}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, padding: '0 1rem' }}>
              Página {currentPage} de {totalPages}
            </div>
            <button 
              className="btn btn-ghost" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '12px' }}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default HistoryView;
