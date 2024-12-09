import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleSitesClone } from './components/GoogleSitesClone';
import HomePage from './pages/Home/Home';

// NotFound Component
const NotFound = () => <h1>404: Page Not Found</h1>;

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<GoogleSitesClone />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
