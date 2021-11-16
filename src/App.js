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

        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column-reverse',
      }}
      className="App"
    >
      <APathfinding />
    </div>
  );
}

export default App;
