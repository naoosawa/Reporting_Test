import { useState } from 'react';
import {
  Box, Card, CardActionArea, CardContent, Typography,
  IconButton, Menu, MenuItem, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Skeleton,
  Snackbar, Alert, Avatar,
} from '@mui/material';
import {
  MoreVert, Delete, ContentCopy, DeleteOutlined, Info,
} from '@mui/icons-material';
import AppHeader, { HEADER_HEIGHT } from '../components/AppHeader';
import type { Report } from '../types';
import { useNavigate } from 'react-router-dom';

interface ReportListPageProps {
  reports: Report[];
  setReports: React.Dispatch<React.SetStateAction<Report[]>>;
  setDeletedReports: React.Dispatch<React.SetStateAction<Report[]>>;
}

export default function ReportListPage({
  reports,
  setReports,
  setDeletedReports,
}: ReportListPageProps) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, report: Report) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleDelete = () => {
    if (!selectedReport) return;
    setReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
    setDeletedReports((prev) => [
      ...prev,
      { ...selectedReport, deletedAt: new Date().toISOString().split('T')[0] },
    ]);
    setDeleteDialogOpen(false);
    setSnackbar({ open: true, message: `「${selectedReport.title}」をゴミ箱に移動しました` });
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
      hasUpdates: false,
    };
    setReports((prev) => [copy, ...prev]);
    handleMenuClose();
    setSnackbar({ open: true, message: 'レポートを複製しました' });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppHeader variant="list" />

      <Box sx={{ pt: `${HEADER_HEIGHT}px` }}>
        {/* Action bar: ゴミ箱ボタン */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: 3,
            py: 1,
          }}
        >
          <Button
            size="small"
            startIcon={<DeleteOutlined fontSize="small" />}
            onClick={() => navigate('/trash')}
            sx={{
              color: 'text.secondary',
              fontSize: '15px',
              fontWeight: 700,
              height: 42,
              '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
            }}
          >
            ゴミ箱
          </Button>
        </Box>

        {/* Card grid */}
        <Box sx={{ px: 3, pb: 4 }}>
          {loading ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={222} sx={{ borderRadius: 2 }} />
              ))}
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {/* File drop card */}
              <DropCard onNavigate={() => navigate('/editor/new')} />

              {/* Report cards */}
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onOpen={() => navigate(`/editor/${report.id}`)}
                  onMenuOpen={(e) => handleMenuOpen(e, report)}
                />
              ))}
            </Box>
          )}

          {/* Empty state (no reports at all) */}
          {!loading && reports.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                レポートがありません。新規作成してください。
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Context menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDuplicate}>
          <ContentCopy fontSize="small" sx={{ mr: 1 }} />
          複製
        </MenuItem>
        <MenuItem
          onClick={() => { setDeleteDialogOpen(true); handleMenuClose(); }}
          sx={{ color: 'error.main' }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          削除
        </MenuItem>
      </Menu>

      {/* Delete confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>レポートを削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            30日後に自動で完全削除されます。完全削除時は編集・出力履歴も削除されます。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ height: 36 }}>キャンセル</Button>
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ height: 36 }}>削除実行</Button>
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

// ---- Sub-components ----

function DropCard({ onNavigate }: { onNavigate: () => void }) {
  const [dragging, setDragging] = useState(false);

  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'primary.light',
        borderRadius: 2,
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        minHeight: 222,
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: 'primary.main' },
        ...(dragging && { borderColor: 'primary.main', bgcolor: 'primary.light' }),
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); onNavigate(); }}
      onClick={onNavigate}
    >
      {/* Upload icon circle */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="#35836d">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z" />
        </svg>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: '16px', color: 'text.primary', mb: '2px', lineHeight: 1.75 }}>
          ファイルをドラッグ&ドロップして作成
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          （ファイル形式：最大100MBのPDF）
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          またはファイルを選択して作成
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => { e.stopPropagation(); onNavigate(); }}
          sx={{
            height: 30,
            fontSize: '13px',
            fontWeight: 700,
            borderColor: 'rgba(53,131,109,0.5)',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          ファイルを選択
        </Button>
      </Box>
    </Box>
  );
}

function ReportCard({
  report,
  onOpen,
  onMenuOpen,
}: {
  report: Report;
  onOpen: () => void;
  onMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 222,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
      }}
    >
      <CardActionArea onClick={onOpen} sx={{ flex: 1, alignItems: 'flex-start' }}>
        <CardContent sx={{ p: 3, pb: '24px !important', height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Title row */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '4px', mb: '2px' }}>
              <Typography
                noWrap
                sx={{
                  fontSize: '20px',
                  fontWeight: 400,
                  color: 'text.primary',
                  flex: 1,
                  minWidth: 0,
                  lineHeight: 1.5,
                }}
              >
                {report.title}
              </Typography>
              <IconButton
                size="small"
                onClick={onMenuOpen}
                sx={{ flexShrink: 0, mt: '2px', mr: '-4px' }}
              >
                <MoreVert sx={{ fontSize: 20, color: 'text.secondary' }} />
              </IconButton>
            </Box>

            {/* 更新あり badge */}
            {report.hasUpdates && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid #fb8c00',
                  borderRadius: '4px',
                  px: 1,
                  py: '4px',
                  mt: '4px',
                }}
              >
                <Info sx={{ fontSize: 16, color: '#fb8c00' }} />
                <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '12px', lineHeight: 1.66 }}>
                  更新あり
                </Typography>
              </Box>
            )}
          </Box>

          {/* History / meta */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '11px', bgcolor: 'primary.light', color: 'primary.dark' }}>
                  {report.author.charAt(0)}
                </Avatar>
                <Typography variant="body2" sx={{ fontSize: '14px', color: 'text.primary', lineHeight: 1.57 }}>
                  {report.author}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  最終更新：
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {report.updatedAt}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '12px',
                color: 'text.primary',
                lineHeight: 1.66,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              GRIスタンダードを参照し、環境・社会・ガバナンス（ESG）への包括的な取り組みと詳細データを網羅した年次報告書です。
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

