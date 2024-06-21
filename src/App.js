import React from 'react';
import ArticleList from './component/ArticleList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-center">React News Portal</h1>
      </header>
      <main>
        <ArticleList />
      </main>
    </div>
  );
}

export default App;
