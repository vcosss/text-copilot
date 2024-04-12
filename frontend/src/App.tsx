import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DocumentViewer from './components/Home';
import LoginPage from './components/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/document-viewer" element={<DocumentViewer />} />
      </Routes>
    </Router>
  );
};

export default App;