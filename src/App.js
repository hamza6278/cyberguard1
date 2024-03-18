import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Header from './components/Header';
import Login from './pages/Login';
import SupervisorDashboard from './pages/Dashboards/Supervisor/SupervisorDashboard';
import TechnicianDashboard from './pages/Dashboards/Technician/TechnicianDashboard';
import AnalyzerDashboard from './pages/Dashboards/Analyzer/AnalyzerDashboard';
import AdminDashboard from './pages/Dashboards/Admin/AdminDashboard';
import ViewSoftware from './pages/Dashboards/Analyzer/ViewSoftware';
import ViewResultPage from './pages/Dashboards/Analyzer/ViewResultPage';
import GenerateRemarksPage from './pages/Dashboards/Supervisor/GenrateRemarks';
import DuplicatePage from './pages/Dashboards/Technician/DuplicatePage'; 
import SoftwareTestingPage from './pages/Dashboards/Technician/SoftwareTestingPage';
import TestedSoftware from './pages/Dashboards/Technician/TestedSoftware';
import Page1 from './pages/Dashboards/Analyzer/Page1';
import Page2 from './pages/Dashboards/Analyzer/Page2';
import Page3 from './pages/Dashboards/Analyzer/Page3';
import GenerateHashPage from './pages/Dashboards/Analyzer/GenerateHash';
import VTPage from './pages/Dashboards/Analyzer/VTpage';
import ViewPasswords from './pages/Dashboards/Admin/ViewPassword'; 
import RegisterUser from './pages/Dashboards/Admin/RegisterUser';
import ApproveUser from './pages/Dashboards/Admin/ApproveUser';
import { NotificationProvider } from './context/NotificationContext'; // Adjust the path based on your project structure
import Notifications from './pages/Dashboards/Admin/Notifications';
import NotificationAnalyzer from './pages/Dashboards/Analyzer/Notifications';
import NotificationSupervisor from './pages/Dashboards/Supervisor/NotificationSupervisor';
import AddApi from './pages/Dashboards/Admin/AddApi'; 
import Register from './pages/Register';

//import NotificationContext from '../../../context/NotificationContext';
// Update the path accordingly



function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/analyzer_notifications" element={<NotificationAnalyzer />} />
            <Route path="/technician" element={<TechnicianDashboard />} />
            <Route path="/analyzer" element={<AnalyzerDashboard />} />
            <Route path="/supervisor" element={<SupervisorDashboard />} />
            <Route path="/supervisor_notifications" element={<NotificationSupervisor />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/analyzer/viewSoftware" element={<ViewSoftware />} />
            <Route path="/analyzer/viewResult" element={<ViewResultPage />} />
            <Route path="/analyzer/generateHash" element={<GenerateHashPage />} />
            <Route path="/analyzer/vtPage" element={<VTPage />} />
            <Route path="/technician/SoftwareTestingPage" element={<SoftwareTestingPage />} />
            <Route path="/technician/duplicate" element={<DuplicatePage />} />
            <Route path="/tested-software" element={<TestedSoftware />} />
            <Route path="/analyzer" element={<AnalyzerDashboard />} />
            <Route path="/analyzer/page1" element={<Page1 />} />
            <Route path="/analyzer/Page2" element={<Page2 />} />
            <Route path="/analyzer/Page3" element={<Page3 />} />
            <Route path="/supervisor/generateRemarks" element={<GenerateRemarksPage />} />
            <Route path="/admin/viewPasswords" element={<ViewPasswords />} />
            <Route path="/admin/RegisterUser" element={<RegisterUser />} />
            <Route path="/admin/ApproveUser" element={<ApproveUser />} />
            <Route path="/analyzer" element={<NotificationAnalyzer />} />
            <Route path="/analyzer" element={<NotificationAnalyzer />} />
            <Route path="/analyzer/analyzerdashboard" element={<AnalyzerDashboard />} />
            <Route path="/admin/AddApi" element={<AddApi />} />
            <Route path="/register" element={<Register />} />

          </Routes>
        </NotificationProvider>
      </Router>
      
    </div>
  );
}

export default App;
