// import React from 'react';
import './App.css';
import { NewsSnippet } from './components/NewsSnippet';
import { testNewsData } from './mockData';

function App() {
  return (
    <div className="App">
      <NewsSnippet data={testNewsData} />
    </div>
  );
}

export default App;
