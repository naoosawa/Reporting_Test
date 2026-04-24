import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ReportListPage from './pages/ReportListPage';
import ReportEditorPage from './pages/ReportEditorPage';
import EditHistoryPage from './pages/EditHistoryPage';
import PreviewPage from './pages/PreviewPage';
import TrashPage from './pages/TrashPage';
import { mockReports, mockDeletedReports } from './mockData';
import type { Report } from './types';

export default function App() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [deletedReports, setDeletedReports] = useState<Report[]>(mockDeletedReports);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ReportListPage
                reports={reports}
                setReports={setReports}
                setDeletedReports={setDeletedReports}
              />
            }
          />
          <Route
            path="/trash"
            element={
              <TrashPage
                setReports={setReports}
                deletedReports={deletedReports}
                setDeletedReports={setDeletedReports}
              />
            }
          />
          <Route path="/editor/:id" element={<ReportEditorPage />} />
          <Route path="/history/:id" element={<EditHistoryPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
