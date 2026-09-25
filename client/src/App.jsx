import { useState } from 'react';
import CreateClaim from './components/CreateClaim';
import ClaimAssessment from './components/ClaimAssessment';
import AllClaims from './components/AllClaims';

const TABS = [
  { key: 'propose', label: 'Propose Claim' },
  { key: 'assess', label: 'Assess Claim' },
  { key: 'all', label: 'All Claims' },
];

function App() {
  const [activeTab, setActiveTab] = useState('propose');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <nav style={{ display: 'flex', gap: 8, padding: 16, borderBottom: '1px solid #eee' }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #ccc',
              background: activeTab === tab.key ? '#646cff' : '#f9f9f9',
              color: activeTab === tab.key ? '#fff' : '#213547',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'propose' && (
        <CreateClaim
          onClaimCreated={() => {
            setRefreshKey((k) => k + 1);
            setActiveTab('assess');
          }}
        />
      )}
      {activeTab === 'assess' && <ClaimAssessment refreshKey={refreshKey} />}
      {activeTab === 'all' && <AllClaims refreshKey={refreshKey} />}
    </div>
  );
}

export default App;