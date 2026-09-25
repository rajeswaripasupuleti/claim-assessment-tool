import { useState } from 'react';

export default function CreateClaim({ onClaimCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description || !createdBy) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, createdBy }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setSuccess(`Claim "${data.title}" created.`);
      setTitle('');
      setDescription('');
      setCreatedBy('');

      if (onClaimCreated) {
        onClaimCreated();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 24, borderBottom: '1px solid #eee' }}>
      <h2>Propose a Claim</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Claim Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Reduces wrinkles by 20%"
          />
        </label>

        <label>
          Claim Description
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full claim text, including conditions (e.g. duration, usage frequency)"
          />
        </label>

        <label>
          Your Name / User ID
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            placeholder="business team member identifier"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Claim'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: 12 }}>{success}</p>}
    </div>
  );
}