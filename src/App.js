// src/App.js
import React from 'react';
import ArticleForm from './components/ArticleForm';
import './App.css'; // Assuming general styles are here

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 1, padding: '20px' }}>
        <ArticleForm />
      </div>
      <div style={{ flex: 2, padding: '20px' }}>
        {/* This part can be used for other components or displaying articles */}
        <p>Preview or other content goes here...</p>
      </div>
    </div>
  );
}

export default App;
