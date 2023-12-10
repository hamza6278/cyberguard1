import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
//mport { useSoftwareData, SoftwareDataProvider } from './pages/Dashboards/SoftwareDataContext'; 

import Header from './components/Header';

import Login from './pages/Login';

import SupervisorDashboard from './pages/Dashboards/Supervisor/SupervisorDashboard';
import TechnicianDashboard from './pages/Dashboards/Technician/TechnicianDashboard';
import AnalyzerDashboard from './pages/Dashboards/Analyzer/AnalyzerDashboard';

import DuplicatePage from './pages/Dashboards/Technician/DuplicatePage'; 
import SoftwareTestingPage from './pages/Dashboards/Technician/SoftwareTestingPage';


import TestedSoftware from './pages/Dashboards/Technician/TestedSoftware';  // Imp

import Page1 from './pages/Dashboards/Analyzer/Page1';
import Page2 from './pages/Dashboards/Analyzer/Page2';
import Page3 from './pages/Dashboards/Analyzer/Page3';


function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/technician" element={<TechnicianDashboard/>}/>
          <Route path="/analyzer" element={<AnalyzerDashboard/>}/>
          <Route path="/supervisor" element={<SupervisorDashboard />} />

          <Route path="/technician/SoftwareTestingPage" element={<SoftwareTestingPage />} />
          <Route path="/technician/duplicate" element={<DuplicatePage />} />
          <Route path="/tested-software" element={<TestedSoftware />} />

        <Route path="/analyzer" element={<AnalyzerDashboard />} />
        <Route path="/analyzer/page1" element={<Page1 />} />
        <Route path="/analyzer/Page2" element={<Page2 />} />
        <Route path="/analyzer/Page3" element={<Page3 />} />
          
        </Routes>
         
      </Router>
    </div>
  );
}

export default App;
