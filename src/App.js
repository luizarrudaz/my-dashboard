import React from 'react';
import './App.css';

import AppRouter from './AppRouter';
import Navbar from './components/Navbar';

import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <AppRouter />
      </div>
    </Router>
  );
}

export default App;