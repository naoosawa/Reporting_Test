import { useState } from 'react';
import {
  Box, Typography, Button, Avatar, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { Replay, DeleteOutlined } from '@mui/icons-material';
import AppHeader, { HEADER_HEIGHT } from '../components/AppHeader';
import type { Report } from '../types';
import { useNavigate } from 'react-router-dom';

interface TrashPageProps {
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  deletedReports: Report[];
  setDeletedReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

export default function TrashPage({
  setReports,
  deletedReports,
  setDeletedReports,
}: TrashPageProps) {
  const navigate = useNavigate();
  const [purgeTarget, setPurgeTarget] = useState<Report | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const handleRestore = (report: Report) => {
    setDeletedReports((prev) => prev.filter((r) => r.id !== report.id));
    setReports((prev) => [...prev, { ...report, deletedAt: undefined }]);
    setSnackbar({ open: true, message: `「${report.title}」を復元しました` });
  };

  const handlePurgeConfirm = () => {
    if (!purgeTarget) return;
    setDeletedReports((prev) => prev.filter((r) => r.id !== purgeTarget.id));
    setPurgeTarget(null);
    setSnackbar({ open: true, message: `「${purgeTarget.title}」を完全削除しました` });
  };

  const purgeDate = (deletedAt: string) => {
    const d = new Date(deletedAt);
    d.setDate(d.getDate() + 30);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} 09:00`;
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppHeader variant="trash" reportTitle="ゴミ箱" onBack={() => navigate('/')} />

      <Box sx={{ pt: `${HEADER_HEIGHT}px` }}>
        <Box sx={{ px: 3, py: 2 }}>
          {deletedReports.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary" sx={{ fontSize: '16px' }}>
                ゴミ箱は空です。
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {deletedReports.map((report) => (
                <TrashCard
                  key={report.id}
                  report={report}
                  purgeDate={purgeDate}
                  onRestore={handleRestore}
                  onPurge={(r) => setPurgeTarget(r)}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Purge confirmation */}
      <Dialog open={Boolean(purgeTarget)} onClose={() => setPurgeTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>完全削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            編集・出力履歴も含めてすべて削除されます。この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPurgeTarget(null)} sx={{ height: 36 }}>キャンセル</Button>
          <Button variant="contained" color="error" onClick={handlePurgeConfirm} sx={{ height: 36 }}>
            完全削除実行
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function TrashCard({
  report,
  purgeDate,
  onRestore,
  onPurge,
}: {
  report: Report;
  purgeDate: (d: string) => string;
  onRestore: (r: Report) => void;
  onPurge: (r: Report) => void;
}) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        px: 2,
        py: 2,
      }}
    >
      {/* Title */}
      <Typography
        sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary', lineHeight: 1.5, mb: 1.5 }}
      >
        {report.title}
      </Typography>

      {/* Meta row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {/* Left: user + description */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '11px', bgcolor: 'primary.light', color: 'primary.dark' }}>
              {report.author.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.57 }}>
              {report.author}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: '14px',
              color: 'text.primary',
              lineHeight: 1.7,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            GRIスタンダードを参照し、環境・社会・ガバナンス（ESG）への包括的な取り組みと詳細データを網羅した年次報告書です。
          </Typography>
        </Box>

        {/* Right: delete info + buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, width: 216 }}>
          {report.deletedAt && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mb: '4px' }}>
              <Typography variant="caption" sx={{ color: 'error.main', lineHeight: 1.66 }}>
                完全削除日
              </Typography>
              <Typography variant="caption" sx={{ color: 'error.main', lineHeight: 1.66 }}>
                {purgeDate(report.deletedAt)}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              size="small"
              startIcon={<Replay sx={{ fontSize: 18 }} />}
              onClick={() => onRestore(report)}
              sx={{
                color: 'primary.main',
                fontSize: '15px',
                fontWeight: 700,
                height: 42,
                '&:hover': { bgcolor: 'transparent' },
              }}
            >
              復元
            </Button>
            <Button
              size="small"
              startIcon={<DeleteOutlined sx={{ fontSize: 18 }} />}
              onClick={() => onPurge(report)}
              sx={{
                color: 'text.secondary',
                fontSize: '15px',
                fontWeight: 700,
                height: 42,
                '&:hover': { bgcolor: 'transparent' },
              }}
            >
              完全削除
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
