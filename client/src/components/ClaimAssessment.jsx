import { useState, useEffect } from 'react';

export default function ClaimAssessment() {
  const [claims, setClaims] = useState([]);
  const [claimId, setClaimId] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/api/claims')
      .then((res) => res.json())
      .then((data) => setClaims(data))
      .catch(() => setError('Failed to load claims list.'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!claimId || !uploadedBy || !file) {
      setError('Please select a claim, enter your name, and choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('claimId', claimId);
    formData.append('uploadedBy', uploadedBy);
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await fetch('/api/claims/assess', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24 }}>
      <h2>Claim Assessment</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Claim
          <select value={claimId} onChange={(e) => setClaimId(e.target.value)}>
            <option value="">Select a claim…</option>
            {claims.map((claim) => (
              <option key={claim.id} value={claim.id}>
                {claim.title} ({claim.status})
              </option>
            ))}
          </select>
        </label>

        <label>
          Your Name / User ID
          <input type="text" value={uploadedBy} onChange={(e) => setUploadedBy(e.target.value)} placeholder="evaluator identifier" />
        </label>

        <label>
          Test Report (CSV / Excel)
          <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Assessing...' : 'Get Assessment'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: 16 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid #ccc', borderRadius: 8 }}>
          <h3>Result</h3>
          <p><strong>Justified:</strong> {result.justified ? 'Yes' : 'No'}</p>
          <p><strong>Confidence Score:</strong> {(result.confidenceScore * 100).toFixed(1)}%</p>
          <p><strong>Reasoning:</strong> {result.reasoning}</p>
        </div>
      )}
    </div>
  );
}