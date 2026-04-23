import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ReportListPage from './pages/ReportListPage';
import ReportEditorPage from './pages/ReportEditorPage';
import EditHistoryPage from './pages/EditHistoryPage';
import PreviewPage from './pages/PreviewPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ReportListPage />} />
          <Route path="/editor/:id" element={<ReportEditorPage />} />
          <Route path="/history/:id" element={<EditHistoryPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
