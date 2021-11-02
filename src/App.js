// MODULES
import React from 'react';

// COMPONENTS
import APathfinding from './components/APathfinding';

// STYLES
import './styles/index.css';

function App() {
  return (
    <div className="App">
      <APathfinding gridCount={600} />
    </div>
  );
}

export default App;