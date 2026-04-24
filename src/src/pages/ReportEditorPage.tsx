import { useState } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemText, Typography,
  Button, IconButton, Divider, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Chip, FormControlLabel, Switch, Radio,
  RadioGroup, FormControl, FormLabel, Checkbox, FormGroup,
  Select, MenuItem, InputLabel, Tooltip, Snackbar, Alert,
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Badge,
} from '@mui/material';
import {
  Add, DragIndicator, Close, Refresh, TableChart,
  TextFields, Warning,
} from '@mui/icons-material';
import AppHeader, { HEADER_HEIGHT } from '../components/AppHeader';
import { mockSections, mockKPIs, mockReports } from '../mockData';
import type { Section, KPI } from '../types';
import { useNavigate, useParams } from 'react-router-dom';

const DRAWER_WIDTH = 240;
const RIGHT_PANEL_WIDTH = 320;

// View Settings Panel
function ViewSettingsPanel({ onClose }: { onClose: () => void }) {
  const [showTarget, setShowTarget] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [displayMode, setDisplayMode] = useState('yearly');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [targets, setTargets] = useState(['2030年目標', '2025年中期目標']);

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>View設定</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel sx={{ fontSize: '12px', mb: 1 }}>表示形式</FormLabel>
        <RadioGroup value="table">
          <FormControlLabel value="table" control={<Radio size="small" />} label={<Typography variant="body2">表</Typography>} />
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={<Switch checked={showComparison} onChange={(e) => setShowComparison(e.target.checked)} size="small" />}
        label={<Typography variant="body2">比較表示</Typography>}
        sx={{ mb: 1, display: 'flex' }}
      />
      <FormControlLabel
        control={<Switch checked={showTarget} onChange={(e) => setShowTarget(e.target.checked)} size="small" />}
        label={<Typography variant="body2">目標を表示</Typography>}
        sx={{ mb: 2, display: 'flex' }}
      />

      {showTarget && (
        <Box sx={{ ml: 2, mb: 2 }}>
          <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
            <InputLabel>年度</InputLabel>
            <Select value={selectedYear} label="年度" onChange={(e) => setSelectedYear(e.target.value)}>
              {['2024', '2025', '2026', '2030'].map((y) => (
                <MenuItem key={y} value={y}>{y}年度</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>目標を選択</Typography>
          <FormGroup>
            {targets.map((t) => (
              <FormControlLabel key={t} control={<Checkbox defaultChecked size="small" />} label={<Typography variant="body2">{t}</Typography>} />
            ))}
          </FormGroup>
          <Button size="small" startIcon={<Add />} sx={{ mt: 1 }} onClick={() => setTargets([...targets, '新しい目標年度'])}>
            目標年度を追加
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel sx={{ fontSize: '12px', mb: 1 }}>表示切替</FormLabel>
        <RadioGroup value={displayMode} onChange={(e) => setDisplayMode(e.target.value)} row>
          <FormControlLabel value="yearly" control={<Radio size="small" />} label={<Typography variant="body2">年度別</Typography>} />
          <FormControlLabel value="site" control={<Radio size="small" />} label={<Typography variant="body2">事業所別</Typography>} />
        </RadioGroup>
      </FormControl>

      {displayMode === 'yearly' && (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>表示期間</InputLabel>
          <Select defaultValue="3years" label="表示期間">
            <MenuItem value="1year">1年間</MenuItem>
            <MenuItem value="3years">3年間</MenuItem>
            <MenuItem value="5years">5年間</MenuItem>
          </Select>
        </FormControl>
      )}

      {displayMode === 'site' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>表示事業所</Typography>
          <FormGroup>
            {['全社', '東京本社', '大阪支社', '名古屋支社'].map((site) => (
              <FormControlLabel key={site} control={<Checkbox defaultChecked size="small" />} label={<Typography variant="body2">{site}</Typography>} />
            ))}
          </FormGroup>
        </Box>
      )}
    </Box>
  );
}

// KPI Settings Panel
function KpiSettingsPanel({ onClose }: { onClose: () => void }) {
  const [scale, setScale] = useState('none');
  const [comma, setComma] = useState(true);
  const [decimal, setDecimal] = useState('0');
  const [rounding, setRounding] = useState('round');
  const [negative, setNegative] = useState('minus');
  const [addYoY, setAddYoY] = useState(false);
  const [addYoYPct, setAddYoYPct] = useState(false);

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>KPI設定</Typography>
        <IconButton size="small" onClick={onClose}><Close fontSize="small" /></IconButton>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel sx={{ fontSize: '12px', mb: 1 }}>数値スケール</FormLabel>
        <RadioGroup value={scale} onChange={(e) => setScale(e.target.value)}>
          <FormControlLabel value="none" control={<Radio size="small" />} label={<Typography variant="body2">なし</Typography>} />
          <FormControlLabel value="100" control={<Radio size="small" />} label={<Typography variant="body2">百（×100）</Typography>} />
          <FormControlLabel value="1000" control={<Radio size="small" />} label={<Typography variant="body2">千（×1,000）</Typography>} />
          <FormControlLabel value="10000" control={<Radio size="small" />} label={<Typography variant="body2">万（×10,000）</Typography>} />
          <FormControlLabel value="k" control={<Radio size="small" />} label={<Typography variant="body2">k（×1,000）</Typography>} />
          <FormControlLabel value="M" control={<Radio size="small" />} label={<Typography variant="body2">M（×1,000,000）</Typography>} />
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={<Switch checked={comma} onChange={(e) => setComma(e.target.checked)} size="small" />}
        label={<Typography variant="body2">カンマ区切り</Typography>}
        sx={{ mb: 2, display: 'flex' }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel sx={{ fontSize: '12px', mb: 1 }}>小数点以下桁数</FormLabel>
        <RadioGroup value={decimal} onChange={(e) => setDecimal(e.target.value)} row>
          {['0', '1', '2', '3', '4', '5'].map((d) => (
            <FormControlLabel key={d} value={d} control={<Radio size="small" />} label={<Typography variant="body2">{d}桁</Typography>} />
          ))}
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel sx={{ fontSize: '12px', mb: 1 }}>丸め処理</FormLabel>
        <RadioGroup value={rounding} onChange={(e) => setRounding(e.target.value)}>
          <FormControlLabel value="round" control={<Radio size="small" />} label={<Typography variant="body2">四捨五入</Typography>} />
          <FormControlLabel value="floor" control={<Radio size="small" />} label={<Typography variant="body2">切り捨て</Typography>} />
          <FormControlLabel value="ceil" control={<Radio size="small" />} label={<Typography variant="body2">切り上げ</Typography>} />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel sx={{ fontSize: '12px', mb: 1 }}>マイナス表記</FormLabel>
        <RadioGroup value={negative} onChange={(e) => setNegative(e.target.value)}>
          <FormControlLabel value="minus" control={<Radio size="small" />} label={<Typography variant="body2">-123</Typography>} />
          <FormControlLabel value="paren" control={<Radio size="small" />} label={<Typography variant="body2">(123)</Typography>} />
          <FormControlLabel value="triangle" control={<Radio size="small" />} label={<Typography variant="body2">▲123</Typography>} />
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={<Switch checked={addYoY} onChange={(e) => setAddYoY(e.target.checked)} size="small" />}
        label={<Typography variant="body2">前年比（数値）を追加</Typography>}
        sx={{ mb: 1, display: 'flex' }}
      />
      <FormControlLabel
        control={<Switch checked={addYoYPct} onChange={(e) => setAddYoYPct(e.target.checked)} size="small" />}
        label={<Typography variant="body2">前年比（%）を追加</Typography>}
        sx={{ mb: 2, display: 'flex' }}
      />

      <Button size="small" variant="outlined" fullWidth sx={{ mt: 1 }}>
        個別KPI設定を解除
      </Button>
    </Box>
  );
}

// View Add Modal
function ViewAddModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (name: string, kpis: KPI[]) => void }) {
  const [viewName, setViewName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedKPIs, setSelectedKPIs] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredKPIs = mockKPIs.filter((k) =>
    k.name.includes(search) || k.category.includes(search)
  );

  const toggleKPI = (kpi: KPI) => {
    setSelectedKPIs((prev) =>
      prev.find((k) => k.id === kpi.id)
        ? prev.filter((k) => k.id !== kpi.id)
        : [...prev, kpi]
    );
  };

  const handleAdd = () => {
    if (selectedKPIs.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      onAdd(viewName || 'View', selectedKPIs);
      setLoading(false);
      setViewName('');
      setSearch('');
      setSelectedKPIs([]);
      onClose();
    }, 800);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Viewを追加
        <IconButton size="small" onClick={onClose}><Close /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="View名（任意）"
          fullWidth
          size="small"
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="KPIを検索"
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="例: GHG、エネルギー"
          sx={{ mb: 1.5 }}
        />
        {selectedKPIs.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
            {selectedKPIs.map((k) => (
              <Chip
                key={k.id}
                label={k.name}
                size="small"
                onDelete={() => toggleKPI(k)}
                sx={{ bgcolor: '#e2edea', color: 'primary.main' }}
              />
            ))}
          </Box>
        )}
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, maxHeight: 240, overflowY: 'auto' }}>
          {filteredKPIs.map((kpi) => (
            <Box
              key={kpi.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: selectedKPIs.find((k) => k.id === kpi.id) ? '#e2edea' : 'transparent',
                '&:hover': { bgcolor: '#f5f5f5' },
                '&:last-child': { borderBottom: 'none' },
              }}
              onClick={() => toggleKPI(kpi)}
            >
              <Checkbox
                size="small"
                checked={Boolean(selectedKPIs.find((k) => k.id === kpi.id))}
                sx={{ p: 0.5, mr: 1 }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{kpi.name}</Typography>
                <Typography variant="caption" color="text.secondary">{kpi.category}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>{kpi.unit}</Typography>
            </Box>
          ))}
        </Box>
        {selectedKPIs.length === 0 && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            KPIを1件以上選択してください
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>取消</Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={selectedKPIs.length === 0 || loading}
        >
          {loading ? '確定中…' : 'View確定'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Update Notification Dialog
function UpdateNotificationDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <Warning color="error" />
        KPI・目標値の更新通知
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          以下のViewでKPIまたは目標値が更新されています。確認して再出力を検討してください。
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>View名</TableCell>
              <TableCell>KPI名</TableCell>
              <TableCell>変更前</TableCell>
              <TableCell>変更後</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>GHG排出量</TableCell>
              <TableCell>Scope1排出量</TableCell>
              <TableCell>12,000 tCO2e</TableCell>
              <TableCell sx={{ color: 'error.main', fontWeight: 500 }}>12,345 tCO2e</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>GHG排出量</TableCell>
              <TableCell>Scope2排出量</TableCell>
              <TableCell>7,100 tCO2e</TableCell>
              <TableCell sx={{ color: 'error.main', fontWeight: 500 }}>6,789 tCO2e</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" color="error" onClick={onClose}>更新実行</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ReportEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = mockReports.find((r) => r.id === id) || mockReports[0];

  const [sections, setSections] = useState<Section[]>(mockSections);
  const [activeSection, setActiveSection] = useState<Section>(mockSections[0]);
  const [rightPanel, setRightPanel] = useState<'view' | 'kpi' | null>(null);
  const [addViewModalOpen, setAddViewModalOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const updateCount = report?.hasUpdates ? 2 : 0;

  const handleSaveVersion = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setSnackbar({ open: true, message: '版を保存しました' });
    }, 1000);
  };

  const handleAddView = (_name: string, _kpis: KPI[]) => {
    const newSection: Section = {
      id: `s${Date.now()}`,
      title: `${sections.length + 1}. View（表）`,
      type: 'table',
      content: '',
    };
    setSections((prev) => [...prev, newSection]);
    setActiveSection(newSection);
    setSnackbar({ open: true, message: 'Viewを追加しました' });
  };

  const handleAddSection = () => {
    const newSection: Section = {
      id: `s${Date.now()}`,
      title: `${sections.length + 1}. 新しいセクション`,
      type: 'text',
      content: '',
    };
    setSections((prev) => [...prev, newSection]);
    setActiveSection(newSection);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppHeader
        variant="editor"
        reportTitle={report?.title}
        saveStatus={saveStatus}
        updateCount={updateCount}
        onSaveVersion={handleSaveVersion}
        onPreview={() => navigate(`/preview/${id}`)}
        onHistory={() => navigate(`/history/${id}`)}
      />

      <Box sx={{ display: 'flex', pt: `${HEADER_HEIGHT}px` }}>
        {/* S-2-2-1: Section sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { top: HEADER_HEIGHT, height: `calc(100% - ${HEADER_HEIGHT}px)`, width: DRAWER_WIDTH },
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              セクション
            </Typography>
          </Box>
          <List dense sx={{ flex: 1, overflowY: 'auto' }}>
            {sections.map((section) => (
              <ListItemButton
                key={section.id}
                selected={activeSection.id === section.id}
                onClick={() => setActiveSection(section)}
                sx={{ py: 0.75, px: 2 }}
              >
                <DragIndicator fontSize="small" sx={{ mr: 1, color: 'text.disabled', cursor: 'grab' }} />
                {section.type === 'table' ? (
                  <TableChart fontSize="small" sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }} />
                ) : (
                  <TextFields fontSize="small" sx={{ mr: 1, color: 'text.secondary', flexShrink: 0 }} />
                )}
                <ListItemText
                  primary={section.title}
                  slotProps={{ primary: { variant: 'body2', noWrap: true } }}
                />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 1 }}>
            <Button
              fullWidth
              startIcon={<Add />}
              onClick={handleAddSection}
              sx={{ justifyContent: 'flex-start', color: 'primary.main' }}
            >
              セクション追加
            </Button>
          </Box>
        </Drawer>

        {/* S-2-2-2: Main edit area */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', px: 3, py: 4, overflow: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 800,
              bgcolor: 'background.paper',
              p: '40px 48px',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              minHeight: 600,
            }}
          >
            {/* Update notification banner */}
            {updateCount > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1.5,
                  mb: 3,
                  bgcolor: '#feebee',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'error.light',
                  cursor: 'pointer',
                }}
                onClick={() => setUpdateDialogOpen(true)}
              >
                <Warning color="error" fontSize="small" />
                <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                  {updateCount}件のKPI・目標値に更新があります。確認して再出力を検討してください。
                </Typography>
              </Box>
            )}

            {/* Report title */}
            <Typography
              variant="h2"
              sx={{ mb: 4, color: 'text.primary', borderBottom: '2px solid', borderColor: 'divider', pb: 2 }}
            >
              {report?.title}
            </Typography>

            {/* Current section content */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" sx={{ mb: 2 }}>{activeSection.title}</Typography>

              {activeSection.type === 'text' ? (
                <TextField
                  multiline
                  fullWidth
                  minRows={6}
                  defaultValue={activeSection.content || 'ここにテキストを入力してください。'}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '16px',
                      lineHeight: 1.8,
                    },
                  }}
                />
              ) : (
                <Box>
                  {/* Table view */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View設定">
                        <Button
                          size="small"
                          variant={rightPanel === 'view' ? 'contained' : 'outlined'}
                          onClick={() => setRightPanel(rightPanel === 'view' ? null : 'view')}
                        >
                          View設定
                        </Button>
                      </Tooltip>
                      <Tooltip title="KPI設定">
                        <Button
                          size="small"
                          variant={rightPanel === 'kpi' ? 'contained' : 'outlined'}
                          onClick={() => setRightPanel(rightPanel === 'kpi' ? null : 'kpi')}
                        >
                          KPI設定
                        </Button>
                      </Tooltip>
                    </Box>
                    <Tooltip title="Viewを更新">
                      <IconButton size="small" color={updateCount > 0 ? 'error' : 'default'}>
                        <Badge badgeContent={updateCount > 0 ? '!' : 0} color="error">
                          <Refresh fontSize="small" />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Table size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
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
                      <TableRow>
                        <TableCell>Scope1排出量</TableCell>
                        <TableCell>tCO2e</TableCell>
                        <TableCell align="right">13,200</TableCell>
                        <TableCell align="right">12,800</TableCell>
                        <TableCell align="right" sx={{ color: updateCount > 0 ? 'error.main' : 'inherit', fontWeight: updateCount > 0 ? 700 : 400 }}>
                          12,345 {updateCount > 0 && <Refresh sx={{ fontSize: 12, verticalAlign: 'middle' }} />}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Scope2排出量</TableCell>
                        <TableCell>tCO2e</TableCell>
                        <TableCell align="right">7,800</TableCell>
                        <TableCell align="right">7,500</TableCell>
                        <TableCell align="right" sx={{ color: updateCount > 0 ? 'error.main' : 'inherit', fontWeight: updateCount > 0 ? 700 : 400 }}>
                          6,789 {updateCount > 0 && <Refresh sx={{ fontSize: 12, verticalAlign: 'middle' }} />}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Scope3排出量</TableCell>
                        <TableCell>tCO2e</TableCell>
                        <TableCell align="right">105,000</TableCell>
                        <TableCell align="right">101,200</TableCell>
                        <TableCell align="right">98,765</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Box>

            {/* Add View button */}
            <Button
              variant="outlined"
              startIcon={<TableChart />}
              onClick={() => setAddViewModalOpen(true)}
              sx={{ mt: 2 }}
            >
              Viewを追加
            </Button>
          </Paper>
        </Box>

        {/* S-2-2-3: Right properties panel */}
        {rightPanel && (
          <Box
            sx={{
              width: RIGHT_PANEL_WIDTH,
              flexShrink: 0,
              bgcolor: 'background.paper',
              borderLeft: '1px solid',
              borderColor: 'divider',
              position: 'fixed',
              right: 0,
              top: HEADER_HEIGHT,
              bottom: 0,
              overflowY: 'auto',
            }}
          >
            {rightPanel === 'view' && <ViewSettingsPanel onClose={() => setRightPanel(null)} />}
            {rightPanel === 'kpi' && <KpiSettingsPanel onClose={() => setRightPanel(null)} />}
          </Box>
        )}
      </Box>

      {/* View Add Modal */}
      <ViewAddModal
        open={addViewModalOpen}
        onClose={() => setAddViewModalOpen(false)}
        onAdd={handleAddView}
      />

      {/* Update notification dialog */}
      <UpdateNotificationDialog
        open={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
      />

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
