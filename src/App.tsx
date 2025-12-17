import { useEffect, useState } from 'react';
import './App.css';
import { uploadFile, listObjects, getObjectUrl, deleteObject } from './api';

type Obj = {
  key: string;
  size?: number;
  httpMetadata?: { contentType?: string };
};

function App() {
  const [files, setFiles] = useState<Obj[]>([]);
  const [selected, setSelected] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      const list = await listObjects();
      setFiles(list);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleUpload = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await uploadFile(selected);
      setSelected(null);
      await refresh();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Upload error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Delete ' + key + '?')) return;
    try {
      await deleteObject(key);
      await refresh();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Delete error', e);
    }
  };

  return (
    <div className="app-root">
      <header>
        <h1>Ruby Album</h1>
      </header>

      <section className="upload">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) =>
            setSelected(e.target.files ? e.target.files[0] : null)
          }
        />
        <button onClick={handleUpload} disabled={!selected || loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </section>

      <section className="list">
        <h2>Stored Media</h2>
        {files.length === 0 && <p>No media yet.</p>}
        <ul>
          {files.map((f) => (
            <li key={f.key}>
              <div className="media-item">
                {f.httpMetadata?.contentType?.startsWith('image') ? (
                  <img
                    src={getObjectUrl(f.key)}
                    alt={f.key}
                    className="thumb"
                  />
                ) : f.httpMetadata?.contentType?.startsWith('video') ? (
                  <video src={getObjectUrl(f.key)} controls className="thumb" />
                ) : (
                  <a
                    href={getObjectUrl(f.key)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {f.key}
                  </a>
                )}
                <div className="meta">
                  <div className="key">{f.key}</div>
                  <div className="actions">
                    <button
                      onClick={() =>
                        (window.location.href = getObjectUrl(f.key))
                      }
                    >
                      Open
                    </button>
                    <button onClick={() => handleDelete(f.key)}>Delete</button>
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
