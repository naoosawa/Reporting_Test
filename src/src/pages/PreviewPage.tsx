import { useState } from 'react';
import {
  Box, Typography, Paper, Button, Drawer, List, ListItem,
  IconButton, Menu, MenuItem, Divider,
  Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import {
  PictureAsPdf, Description, GridOn, Download, ChevronRight,
  ExpandMore, History,
} from '@mui/icons-material';
import AppHeader from '../components/AppHeader';
import { mockExportHistory, mockSections, mockReports } from '../mockData';
import type { ExportHistory } from '../types';
import { useNavigate, useParams } from 'react-router-dom';

const HISTORY_PANEL_WIDTH = 320;

function FormatIcon({ format }: { format: ExportHistory['format'] }) {
  if (format === 'pdf') return <PictureAsPdf sx={{ color: '#d32f2f' }} />;
  if (format === 'word') return <Description sx={{ color: '#0277bd' }} />;
  return <GridOn sx={{ color: '#388e3c' }} />;
}

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = mockReports.find((r) => r.id === id) || mockReports[0];
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [redownloading, setRedownloading] = useState<string | null>(null);

  const handleExport = (format: 'word' | 'excel' | 'pdf') => {
    setExportMenuAnchor(null);
    setTimeout(() => {
      alert(`${format.toUpperCase()}形式で出力しました`);
    }, 500);
  };

  const handleRedownload = (entry: ExportHistory) => {
    setRedownloading(entry.id);
    setTimeout(() => setRedownloading(null), 1500);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppHeader
        variant="preview"
        reportTitle={report?.title}
        onHistory={() => navigate(`/history/${id}`)}
        onExport={(e) => setExportMenuAnchor(e?.currentTarget || null)}
        onBack={() => navigate(`/editor/${id}`)}
      />

      <Box sx={{ display: 'flex', pt: '64px' }}>
        {/* S-4-1: Preview area */}
        <Box sx={{ flex: 1, px: 3, py: 4, display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={2}
            sx={{
              width: '100%',
              maxWidth: 794,
              minHeight: 1123,
              p: '60px 72px',
              bgcolor: 'white',
              borderRadius: 1,
            }}
          >
            {/* Report header */}
            <Box sx={{ mb: 4, pb: 2, borderBottom: '2px solid', borderColor: 'primary.main' }}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500, display: 'block', mb: 0.5 }}>
                SmartESG Reporting
              </Typography>
              <Typography variant="h2" sx={{ color: 'text.primary', mb: 1 }}>
                {report?.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                作成者: {report?.author} | 更新日: {report?.updatedAt}
              </Typography>
            </Box>

            {/* Sections */}
            {mockSections.map((section, idx) => (
              <Box key={section.id} sx={{ mb: 4 }}>
                <Typography
                  variant="h3"
                  sx={{ mb: 2, pb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  {section.title}
                </Typography>
                {section.type === 'text' ? (
                  <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
                    {section.content || 'ここにテキスト内容が表示されます。'}
                  </Typography>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>指標名</TableCell>
                        <TableCell>単位</TableCell>
                        <TableCell align="right">2022年度</TableCell>
                        <TableCell align="right">2023年度</TableCell>
                        <TableCell align="right">2024年度</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {idx === 1 && (
                        <>
                          <TableRow>
                            <TableCell>Scope1排出量</TableCell><TableCell>tCO2e</TableCell>
                            <TableCell align="right">13,200</TableCell><TableCell align="right">12,800</TableCell><TableCell align="right">12,345</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Scope2排出量</TableCell><TableCell>tCO2e</TableCell>
                            <TableCell align="right">7,800</TableCell><TableCell align="right">7,500</TableCell><TableCell align="right">6,789</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Scope3排出量</TableCell><TableCell>tCO2e</TableCell>
                            <TableCell align="right">105,000</TableCell><TableCell align="right">101,200</TableCell><TableCell align="right">98,765</TableCell>
                          </TableRow>
                        </>
                      )}
                      {idx === 2 && (
                        <>
                          <TableRow>
                            <TableCell>エネルギー消費量</TableCell><TableCell>GJ</TableCell>
                            <TableCell align="right">480,000</TableCell><TableCell align="right">468,000</TableCell><TableCell align="right">456,789</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>再生可能エネルギー比率</TableCell><TableCell>%</TableCell>
                            <TableCell align="right">18.0</TableCell><TableCell align="right">21.0</TableCell><TableCell align="right">23.4</TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                )}
              </Box>
            ))}
          </Paper>
        </Box>

        {/* Toggle tab for history panel */}
        <Box
          sx={{
            position: 'fixed',
            right: historyPanelOpen ? HISTORY_PANEL_WIDTH : 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            transition: 'right 0.2s',
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => setHistoryPanelOpen((v) => !v)}
            sx={{
              minWidth: 32,
              width: 32,
              height: 120,
              p: 1,
              borderRadius: '4px 0 0 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <History fontSize="small" />
            <Typography variant="caption" sx={{ fontSize: '10px', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              出力履歴
            </Typography>
            {historyPanelOpen ? <ChevronRight fontSize="small" /> : <ExpandMore fontSize="small" sx={{ transform: 'rotate(-90deg)' }} />}
          </Button>
        </Box>

        {/* S-4-2: Export history panel */}
        <Drawer
          variant="persistent"
          anchor="right"
          open={historyPanelOpen}
          sx={{
            width: historyPanelOpen ? HISTORY_PANEL_WIDTH : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: HISTORY_PANEL_WIDTH,
              top: 64,
              height: 'calc(100% - 64px)',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>出力履歴</Typography>
              <IconButton size="small" onClick={() => setHistoryPanelOpen(false)}>
                <ChevronRight />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {mockExportHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary">出力履歴はありません。</Typography>
            ) : (
              <List dense disablePadding>
                {mockExportHistory.map((entry) => (
                  <ListItem
                    key={entry.id}
                    disablePadding
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', mb: 0.5 }}>
                      <FormatIcon format={entry.format} />
                      <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography variant="body2" noWrap>{entry.fileName}</Typography>
                        <Typography variant="caption" color="text.secondary">{entry.timestamp}</Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<Download fontSize="small" />}
                      onClick={() => handleRedownload(entry)}
                      disabled={redownloading === entry.id}
                      sx={{ ml: 4 }}
                    >
                      {redownloading === entry.id ? '生成中…' : '再ダウンロード'}
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Drawer>
      </Box>

      {/* Export menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={() => setExportMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleExport('word')}>
          <Description sx={{ mr: 1, color: '#0277bd' }} /> Word (.docx)
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>
          <GridOn sx={{ mr: 1, color: '#388e3c' }} /> Excel (.xlsx)
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          <PictureAsPdf sx={{ mr: 1, color: '#d32f2f' }} /> PDF (.pdf)
        </MenuItem>
      </Menu>
    </Box>
  );
}
