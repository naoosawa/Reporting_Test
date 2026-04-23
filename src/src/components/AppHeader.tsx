import { AppBar, Toolbar, Box, Typography, Button, Breadcrumbs, Link, Chip } from '@mui/material';
import { Add, Save, History, Preview, FileDownload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

type HeaderVariant = 'list' | 'editor' | 'preview' | 'history';

interface AppHeaderProps {
  variant: HeaderVariant;
  reportTitle?: string;
  saveStatus?: 'idle' | 'saving' | 'saved';
  updateCount?: number;
  onSaveVersion?: () => void;
  onPreview?: () => void;
  onHistory?: () => void;
  onExport?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onBack?: () => void;
}

export default function AppHeader({
  variant,
  reportTitle,
  saveStatus = 'idle',
  updateCount = 0,
  onSaveVersion,
  onPreview,
  onHistory,
  onExport,
  onBack,
}: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ height: 64, px: 3, gap: 2 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mr: 2, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '18px' }}>
            SmartESG
          </Typography>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
            Reporting
          </Typography>
        </Box>

        {/* Breadcrumb for editor/preview/history */}
        {variant !== 'list' && reportTitle && (
          <Breadcrumbs sx={{ flex: 1, '& .MuiBreadcrumbs-separator': { color: 'text.disabled' } }}>
            <Link underline="hover" color="text.secondary" sx={{ fontSize: '14px', cursor: 'pointer' }} onClick={() => navigate('/')}>
              レポート一覧
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '14px' }}>
              {reportTitle}
            </Typography>
          </Breadcrumbs>
        )}

        {variant === 'list' && <Box sx={{ flex: 1 }} />}

        {/* Save status badge */}
        {variant === 'editor' && saveStatus !== 'idle' && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
            {saveStatus === 'saving' ? '下書きを保存中…' : '下書きを保存済み'}
          </Typography>
        )}

        {/* Update count badge */}
        {variant === 'editor' && updateCount > 0 && (
          <Chip
            label={`${updateCount}件の更新あり`}
            size="small"
            sx={{ bgcolor: 'error.main', color: 'white', fontSize: '12px', cursor: 'pointer' }}
          />
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {variant === 'list' && (
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/editor/new')}>
              新規レポート作成
            </Button>
          )}

          {variant === 'editor' && (
            <>
              <Button variant="outlined" startIcon={<Save />} onClick={onSaveVersion}>
                版を保存
              </Button>
              <Button variant="outlined" startIcon={<History />} onClick={onHistory}>
                編集履歴
              </Button>
              <Button variant="contained" startIcon={<Preview />} onClick={onPreview}>
                プレビュー
              </Button>
            </>
          )}

          {variant === 'preview' && (
            <>
              <Button variant="outlined" startIcon={<History />} onClick={onHistory}>
                編集履歴
              </Button>
              <Button variant="contained" startIcon={<FileDownload />} onClick={(e) => onExport?.(e)}>
                出力
              </Button>
            </>
          )}

          {variant === 'history' && (
            <Button variant="outlined" onClick={onBack}>
              戻る
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
