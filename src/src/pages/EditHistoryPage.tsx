import { useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Paper, IconButton,
} from '@mui/material';
import { Close, History, Save } from '@mui/icons-material';
import AppHeader from '../components/AppHeader';
import { mockEditHistory, mockReports } from '../mockData';
import { useNavigate, useParams } from 'react-router-dom';

function DiffDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        変更内容を確認
        <IconButton size="small" onClick={onClose}><Close /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', display: 'block', mb: 1 }}>
              変更前
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#feebee', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                当社は2023年度においてGHG排出量の削減を進めました。<br />
                <Box component="span" sx={{ bgcolor: '#ffcccc', textDecoration: 'line-through' }}>Scope1排出量は12,800 tCO2eを記録し</Box>、
                前年比6%の削減を達成しました。
              </Typography>
            </Paper>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', display: 'block', mb: 1 }}>
              変更後
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                当社は2024年度においてGHG排出量の削減を進めました。<br />
                <Box component="span" sx={{ bgcolor: '#c8e6c9', fontWeight: 500 }}>Scope1排出量は12,345 tCO2eを記録し</Box>、
                前年比6%の削減を達成しました。
              </Typography>
            </Paper>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', display: 'block', mb: 1 }}>
            テーブル差分
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>指標名</TableCell>
                <TableCell align="right">変更前</TableCell>
                <TableCell align="right">変更後</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Scope1排出量</TableCell>
                <TableCell align="right" sx={{ bgcolor: '#feebee', color: 'error.main' }}>12,800</TableCell>
                <TableCell align="right" sx={{ bgcolor: '#e8f5e9', color: 'success.main', fontWeight: 500 }}>12,345</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function EditHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = mockReports.find((r) => r.id === id) || mockReports[0];
  const [diffDialogOpen, setDiffDialogOpen] = useState(false);

  const typeLabel = (type: string) => {
    switch (type) {
      case 'VERSION': return { label: '版を保存', color: '#e2edea', textColor: 'primary.dark', icon: <Save sx={{ fontSize: 14 }} /> };
      case 'EDIT': return { label: '編集', color: '#e8eaf6', textColor: '#3949ab', icon: null };
      case 'PURGE': return { label: '完全削除', color: '#feebee', textColor: 'error.main', icon: null };
      default: return { label: type, color: '#f5f5f5', textColor: 'text.secondary', icon: null };
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppHeader
        variant="history"
        reportTitle={report?.title}
        onBack={() => navigate(`/editor/${id}`)}
      />

      <Box sx={{ pt: '64px' }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <History sx={{ color: 'primary.main' }} />
            <Typography variant="h3" sx={{ fontWeight: 700 }}>編集履歴</Typography>
          </Box>

          {mockEditHistory.length === 0 ? (
            <Typography color="text.secondary">編集履歴はありません</Typography>
          ) : (
            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>日時</TableCell>
                    <TableCell>操作者</TableCell>
                    <TableCell>種別</TableCell>
                    <TableCell>内容</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockEditHistory.map((entry) => {
                    const { label, color, textColor, icon } = typeLabel(entry.type);
                    const isPurged = entry.type === 'PURGE';
                    return (
                      <TableRow key={entry.id} sx={{ opacity: isPurged ? 0.5 : 1 }}>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">{entry.timestamp}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{entry.author}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={icon || undefined}
                            label={label}
                            size="small"
                            sx={{
                              bgcolor: color,
                              color: textColor,
                              fontSize: '11px',
                              height: 22,
                              '& .MuiChip-icon': { color: textColor },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{entry.description}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          {!isPurged && entry.type === 'EDIT' && (
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => setDiffDialogOpen(true)}
                            >
                              変更内容を確認する
                            </Button>
                          )}
                          {!isPurged && entry.type === 'VERSION' && (
                            <Button size="small" variant="outlined">
                              この版を表示
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Box>
      </Box>

      <DiffDialog open={diffDialogOpen} onClose={() => setDiffDialogOpen(false)} />
    </Box>
  );
}
