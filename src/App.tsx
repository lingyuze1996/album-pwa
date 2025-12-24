import { useEffect, useState } from 'react';
import './App.css';
import type { Metadata } from '../types/metadata';
import { uploadFiles, listObjects } from './actions/api';
import { getOriginalUrl, getThumbnailUrl } from './utils/assetsUrlMapper';

function App() {
  const [files, setFiles] = useState<Metadata[]>([]);
  const [selected, setSelected] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      const list = await listObjects();
      console.log(list);
      setFiles(list);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  useEffect(() => {
    console.log('Refreshing file list...');
    refresh();
  }, []);

  const handleUpload = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await uploadFiles(selected);
      setSelected(null);
      await refresh();
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
