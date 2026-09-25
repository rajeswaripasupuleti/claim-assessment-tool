import { useState, useEffect } from 'react';

const STATUSES = ['PROPOSED', 'UNDER_EVALUATION', 'ASSESSED'];

export default function AllClaims({ refreshKey }) {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [localRefresh, setLocalRefresh] = useState(0);

  useEffect(() => {
    fetch('/api/claims')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load claims: ${res.status}`);
        return res.json();
      })
      .then((data) => setClaims(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message));
  }, [refreshKey, localRefresh]);

  const handleStatusChange = async (claimId, newStatus) => {
    setUpdatingId(claimId);
    setError('');
    try {
      const res = await fetch(`/api/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to update status');
      }

      setLocalRefresh((k) => k + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2>All Claims</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>Title</th>
            <th style={{ padding: 8 }}>Description</th>
            <th style={{ padding: 8 }}>Status</th>
            <th style={{ padding: 8 }}>Created By</th>
            <th style={{ padding: 8 }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{claim.title}</td>
              <td style={{ padding: 8, maxWidth: 300 }}>{claim.description}</td>
              <td style={{ padding: 8 }}>
                <select
                  value={claim.status}
                  disabled={updatingId === claim.id}
                  onChange={(e) => handleStatusChange(claim.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ padding: 8 }}>{claim.createdBy}</td>
              <td style={{ padding: 8 }}>{new Date(claim.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {claims.length === 0 && !error && <p>No claims yet.</p>}
    </div>
  );
}