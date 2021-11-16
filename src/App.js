// MODULES
import React from 'react';

// COMPONENTS
import APathfinding from './components/APathfinding';

// STYLES
import './styles/index.css';

function App() {
  return (
    <div
      style={{
        display: 'flex',
        margin: '2rem',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row-reverse',
      }}
      className="App"
    >
      <APathfinding />
    </div>
  );
}

export default App;
