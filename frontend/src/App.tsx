import React from 'react';
import MetricsDisplay from './components/MetricsDisplay';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>System Monitoring Dashboard</h1>
        <MetricsDisplay />
      </header>
    </div>
  );
};

export default App;
