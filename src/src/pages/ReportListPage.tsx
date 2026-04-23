import { useState } from 'react';
import {
  Box, Card, CardContent, CardActionArea, Typography, Chip,
  IconButton, Menu, MenuItem, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Skeleton,
  Tabs, Tab, Tooltip, Snackbar, Alert, Grid,
} from '@mui/material';
import {
  MoreVert, Delete, ContentCopy, Upload, DeleteOutlined,
  RestoreFromTrash,
} from '@mui/icons-material';
import AppHeader from '../components/AppHeader';
import { mockReports, mockDeletedReports } from '../mockData';
import type { Report } from '../types';
import { useNavigate } from 'react-router-dom';

export default function ReportListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [deletedReports, setDeletedReports] = useState<Report[]>(mockDeletedReports);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purgeDialogOpen, setPurgeDialogOpen] = useState(false);
  const [loading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, report: Report) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDelete = () => {
    if (!selectedReport) return;
    setReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
    setDeletedReports((prev) => [...prev, { ...selectedReport, deletedAt: new Date().toISOString().split('T')[0] }]);
    setDeleteDialogOpen(false);
    setSnackbar({ open: true, message: `「${selectedReport.title}」をゴミ箱に移動しました` });
  };

  const handleRestore = (report: Report) => {
    setDeletedReports((prev) => prev.filter((r) => r.id !== report.id));
    setReports((prev) => [...prev, { ...report, deletedAt: undefined }]);
    setSnackbar({ open: true, message: `「${report.title}」を復元しました` });
  };

  const handlePurge = () => {
    if (!selectedReport) return;
    setDeletedReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
    setPurgeDialogOpen(false);
    setSnackbar({ open: true, message: `「${selectedReport.title}」を完全削除しました` });
  };

  const handleDuplicate = () => {
    if (!selectedReport) return;
    const copy: Report = {
      ...selectedReport,
      id: `${selectedReport.id}-copy-${Date.now()}`,
      title: `${selectedReport.title} (コピー)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    setReports((prev) => [copy, ...prev]);
    handleMenuClose();
    setSnackbar({ open: true, message: 'レポートを複製しました' });
  };

  const autoDeleteDate = (deletedAt: string) => {
    const d = new Date(deletedAt);
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString('ja-JP');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppHeader variant="list" />

      <Box sx={{ pt: '64px' }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Tab label="レポート一覧" />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DeleteOutlined fontSize="small" />
                  ゴミ箱 {deletedReports.length > 0 && `(${deletedReports.length})`}
                </Box>
              }
            />
          </Tabs>

          {/* S-1-1: Report List */}
          {tab === 0 && (
            <>
              {/* Import area */}
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3,
                  mb: 3,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main', bgcolor: '#e2edea' },
                }}
              >
                <Upload sx={{ color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  PDFをドラッグ＆ドロップ、またはクリックして参考資料をインポート
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  PDF形式 / 最大100MB
                </Typography>
              </Box>

              {loading ? (
                <Grid container spacing={2}>
                  {[1, 2, 3].map((i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                    </Grid>
                  ))}
                </Grid>
              ) : reports.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    レポートがありません。新規作成してください。
                  </Typography>
                  <Button variant="contained" startIcon={<Upload />} onClick={() => navigate('/editor/new')}>
                    新規レポート作成
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {reports.map((report) => (
                    <Grid key={report.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card sx={{ position: 'relative', cursor: 'pointer' }}>
                        <CardActionArea onClick={() => navigate(`/editor/${report.id}`)}>
                          <CardContent sx={{ pb: '12px !important' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="body1" sx={{ flex: 1, pr: 1, lineHeight: 1.4, fontWeight: 700 }}>
                                {report.title}
                              </Typography>
                              <Tooltip title="メニュー">
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleMenuOpen(e, report)}
                                  sx={{ mt: -0.5 }}
                                >
                                  <MoreVert fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                              {report.hasUpdates && (
                                <Chip label="更新あり" size="small" color="error" sx={{ fontSize: '11px', height: 20 }} />
                              )}
                              <Chip
                                label={report.status === 'draft' ? '下書き' : '保存済み'}
                                size="small"
                                sx={{
                                  fontSize: '11px',
                                  height: 20,
                                  bgcolor: report.status === 'draft' ? '#e1f5fe' : '#e2edea',
                                  color: report.status === 'draft' ? '#01579b' : '#235749',
                                }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {report.author} · 更新: {report.updatedAt}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {/* S-1-3: Trash */}
          {tab === 1 && (
            <>
              {deletedReports.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">ゴミ箱は空です。</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    ゴミ箱内のレポートは削除から30日後に自動で完全削除されます
                  </Typography>
                  {deletedReports.map((report) => (
                    <Card key={report.id}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', py: '12px !important' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {report.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {report.deletedAt && `削除日: ${report.deletedAt} · 完全削除予定: ${autoDeleteDate(report.deletedAt)}`}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          startIcon={<RestoreFromTrash />}
                          onClick={() => handleRestore(report)}
                          sx={{ mr: 1 }}
                        >
                          復元
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => { setSelectedReport(report); setPurgeDialogOpen(true); }}
                        >
                          完全削除
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Card context menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDuplicate}>
          <ContentCopy fontSize="small" sx={{ mr: 1 }} />複製
        </MenuItem>
        <MenuItem
          onClick={() => { setDeleteDialogOpen(true); handleMenuClose(); }}
          sx={{ color: 'error.main' }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />削除
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>レポートを削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            30日後に自動で完全削除されます。完全削除時は編集・出力履歴も削除されます。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>削除実行</Button>
        </DialogActions>
      </Dialog>

      {/* Purge confirmation dialog */}
      <Dialog open={purgeDialogOpen} onClose={() => setPurgeDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>完全削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            編集・出力履歴も含めてすべて削除されます。この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPurgeDialogOpen(false)}>キャンセル</Button>
          <Button variant="contained" color="error" onClick={handlePurge}>完全削除実行</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
