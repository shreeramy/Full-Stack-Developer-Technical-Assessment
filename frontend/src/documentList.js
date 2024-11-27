import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './documentList.css'; // Import the CSS file

const DocumentList = () => {
  // State variables for documents, search, sorting, loading, and error
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState(''); // state for ordering by name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE_URL = 'http://192.168.1.13:9000';

  // References for the input fields
  const docNameRef = useRef(null);
  const docContentRef = useRef(null);
  const docSizeRef = useRef(null);

  // Fetching documents with searchTerm and sortOrder (ordering)
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        let url = `${BASE_URL}/api/documents/`;
        const params = new URLSearchParams();

        if (searchTerm) {
          params.append('search', searchTerm);
        }

        if (sortOrder) {
          params.append('ordering', sortOrder);
        }

        url = `${url}?${params.toString()}`;

        const response = await axios.get(url);
        if (response.status === 200) {
          setDocuments(response.data.results);
        } else {
          throw new Error('Failed to fetch documents');
        }
      } catch (err) {
        setError('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [searchTerm, sortOrder]);

  // Handle adding a new document
  const handleAddDocument = async (name, content, size) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/documents/`, {
        name,
        content,
        size
      });
      const newDocument = response.data;
      setDocuments((prevDocuments) => [...prevDocuments, newDocument]);

      // Clear the input fields after adding the document
      docNameRef.current.value = '';
      docContentRef.current.value = '';
      docSizeRef.current.value = '';
    } catch (err) {
      setError('Failed to add document');
    }
  };

  // Handle deleting a document
  const handleDeleteDocument = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/documents/${id}/`);
      setDocuments((prevDocuments) =>
        prevDocuments.filter((doc) => doc.id !== id)
      );
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  // Handle viewing document content
  const handleViewDocument = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/documents/${id}/`);
      const documentData = response.data;
      alert(`Content of ${documentData.name}: ${documentData.content}`);
    } catch (err) {
      setError('Failed to fetch document content');
    }
  };

  return (
    <div className="container">
      <h1>Document List</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by document name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Sorting buttons */}
      <div>
        <button className="sort-btn" onClick={() => setSortOrder('name')}>
          Sort by Name
        </button>
        <button className="sort-btn" onClick={() => setSortOrder('created_at')}>
          Sort by Date
        </button>
      </div>

      {/* Loading and Error state */}
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Document table */}
      {documents.length !== 0 && (
        <table>
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Created Date</th>
              <th>File Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.created_at}</td>
                <td>{doc.size} bytes</td>
                <td>
                  <button onClick={() => handleDeleteDocument(doc.id)}>Delete</button>
                  <button onClick={() => handleViewDocument(doc.id)}>View Content</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Document Form */}
      <div className="form-container">
        <h2>Add Document</h2>
        <input
          type="text"
          ref={docNameRef}
          placeholder="Document Name"
        />
        <input
          type="text"
          ref={docContentRef}
          placeholder="Document Content"
        />
        <input
          type="number"
          ref={docSizeRef}
          placeholder="Document Size"
        />
        <button
          onClick={() =>
            handleAddDocument(
              docNameRef.current.value,
              docContentRef.current.value,
              docSizeRef.current.value
            )
          }
        >
          Add Document
        </button>
      </div>
    </div>
  );
};

export default DocumentList;
