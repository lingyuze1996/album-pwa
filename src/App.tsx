import { useEffect, useState } from 'react';
import './App.css';
import type { Metadata } from '../types/metadata';
import { uploadFiles, listObjects } from './actions/api';
import { getOriginalUrl, getThumbnailUrl } from './utils/assetsUrlMapper';

function App() {
  const [files, setFiles] = useState<Metadata[]>([]);
  const [selected, setSelected] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageInput, setPageInput] = useState<string>('1');
  const [total, setTotal] = useState<number>(0);

  const refresh = async (p = page) => {
    try {
      const res = await listObjects({ page: p, pageSize });
      console.log(res);
      setFiles(res.items || []);
      setTotal(res.total || 0);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  useEffect(() => {
    console.log('Refreshing file list...');
    refresh(1);
  }, []);

  const handleUpload = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await uploadFiles(selected);
      setSelected(null);
      setPage(1);
      await refresh(1);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Upload error', e);
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (key: string) => {
  //   if (!confirm('Delete ' + key + '?')) return;
  //   try {
  //     await deleteObject(key);
  //     await refresh();
  //   } catch (e) {
  //     // eslint-disable-next-line no-console
  //     console.error('Delete error', e);
  //   }
  // };

  return (
    <div className="app-root">
      <header>
        <h1>Album PWA</h1>
      </header>

      <section className="upload">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setSelected(e.target.files)}
        />
        <button onClick={handleUpload} disabled={!selected || loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </section>

      <section className="list">
        <h2>Stored Media</h2>
        {files.length === 0 && <p>No media yet.</p>}
        <div className="paging">
          <label style={{ marginRight: 8 }}>
            Page size:
            <select
              value={pageSize}
              onChange={async (e) => {
                const ps = Math.max(1, Number(e.target.value) || 1);
                setPageSize(ps);
                setPage(1);
                setPageInput('1');
                await refresh(1);
              }}
              style={{ marginLeft: 6, marginRight: 12 }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
          <button
            onClick={async () => {
              if (page <= 1) return;
              const np = page - 1;
              setPage(np);
              await refresh(np);
            }}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span style={{ margin: '0 12px' }}>
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))} — {total}{' '}
            items
          </span>
          <label style={{ marginLeft: 8 }}>
            Go to page:
            <input
              type="number"
              min={1}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              style={{ width: 80, marginLeft: 6 }}
            />
          </label>
          <button
            onClick={async () => {
              const totalPages = Math.max(1, Math.ceil(total / pageSize));
              let np = Math.max(1, Number(pageInput) || 1);
              if (np > totalPages) np = totalPages;
              setPage(np);
              setPageInput(String(np));
              await refresh(np);
            }}
            style={{ marginLeft: 8 }}
          >
            Go
          </button>
          <button
            onClick={async () => {
              const totalPages = Math.max(1, Math.ceil(total / pageSize));
              if (page >= totalPages) return;
              const np = page + 1;
              setPage(np);
              await refresh(np);
            }}
            disabled={page >= Math.max(1, Math.ceil(total / pageSize))}
          >
            Next
          </button>
        </div>
        <ul>
          {files.map((f) => (
            <li key={f.id}>
              <div className="media-item">
                {f.type.startsWith('image') ? (
                  <img
                    src={getThumbnailUrl(f.id)}
                    alt={f.id}
                    className="thumb"
                  />
                ) : (
                  // ) : f.httpMetadata?.contentType?.startsWith('video') ? (
                  //   <video src={getObjectUrl(f.id)} controls className="thumb" />
                  <a
                    href={getOriginalUrl(f.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {f.id}
                  </a>
                )}
                <div className="meta">
                  <div className="key">{f.name}</div>
                  <div className="actions">
                    <button
                      onClick={() =>
                        window.open(getOriginalUrl(f.id), '_blank')
                      }
                    >
                      Open
                    </button>
                    {/* <button onClick={() => handleDelete(f.id)}>Delete</button> */}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
