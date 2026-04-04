import { Routes, Route, Navigate } from 'react-router-dom';
import Header      from './Header.jsx';
import Sidebar     from './Sidebar.jsx';
import ContentPage from '../Pages/Content.jsx';
import PatientInfo from '../Pages/PatientInfo.jsx';
import AdminPage   from '../Pages/Admin.jsx';
import ChatbotPage from '../Chatbot/ChatbotPage.jsx';

export default function Dashboard() {
  return (
    <div style={styles.root}>
      <Header />
      <div style={styles.body}>
        <Sidebar />
        <main style={styles.main}>
          <Routes>
            <Route path="/"             element={<Navigate to="content" replace />} />
            <Route path="content"       element={<ContentPage />} />
            <Route path="patient-info"  element={<PatientInfo />} />
            <Route path="admin"         element={<AdminPage />} />
            <Route path="chatbot"       element={<ChatbotPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const styles = {
  root: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  body: { display: 'flex', flex: 1 },
  main: { flex: 1, overflow: 'auto', padding: '28px 32px', minWidth: 0 },
};
