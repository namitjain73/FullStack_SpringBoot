import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, BarChart3, Loader2 } from 'lucide-react';
import Dashboard from './Dashboard';
import './index.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setError('Please upload a CSV or Excel file.');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8081/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setData(response.data);
    } catch (err) {
      setError(err.response?.data || err.message || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-logo">
          <BarChart3 size={24} color="#ffffff" />
        </div>
        <h1>AutoViz Dashboard</h1>
      </header>

      {!data ? (
        <div className="upload-container">
          <div 
            className={`drop-zone ${isDragging ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".csv, .xlsx, .xls"
              onChange={handleFileInput}
            />
            <div className="drop-zone-content">
              {loading ? (
                <div className="loader"></div>
              ) : (
                <>
                  <UploadCloud size={72} className="drop-zone-icon" />
                  <h2>Drag & Drop your dataset</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                    Supports CSV, XLS, and XLSX files
                  </p>
                  <button className="button" style={{ marginTop: '2rem' }}>
                    Browse Files
                  </button>
                </>
              )}
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        </div>
      ) : (
        <Dashboard dataset={data} onReset={() => setData(null)} />
      )}
    </div>
  );
}

export default App;
