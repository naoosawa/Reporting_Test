import { AppBar, Toolbar, Box, Typography, Button, Breadcrumbs, Link, Chip } from '@mui/material';
import {
  Add, CheckCircleOutlined, History, RemoveRedEye, FileDownload,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const HEADER_HEIGHT = 80;

type HeaderVariant = 'list' | 'editor' | 'preview' | 'history' | 'trash';

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

/** SmartESG Reporting ロゴ */
function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}
      onClick={onClick}
    >
      {/* Circle icon */}
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ color: '#fff', fontSize: '13px', fontWeight: 700, lineHeight: 1 }}>S</Typography>
      </Box>
      <Typography
        sx={{ fontWeight: 700, fontSize: '18px', color: 'text.primary', lineHeight: 1, letterSpacing: '-0.3px' }}
      >
        SmartESG
      </Typography>
      <Typography
        sx={{ fontSize: '13px', color: 'primary.main', fontWeight: 500, lineHeight: 1 }}
      >
        Reporting
      </Typography>
    </Box>
  );
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
  const hasBreadcrumb = variant !== 'list' && reportTitle;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ height: HEADER_HEIGHT, zIndex: (t) => t.zIndex.drawer + 1 }}
    >
      <Toolbar
        sx={{
          height: HEADER_HEIGHT,
          minHeight: `${HEADER_HEIGHT}px !important`,
          px: 3,
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Left: Logo + optional breadcrumb stacked */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: hasBreadcrumb ? '4px' : 0,
            flex: variant === 'list' ? '0 0 auto' : '1 0 0',
            minWidth: 0,
          }}
        >
          <Logo onClick={() => navigate('/')} />
          {hasBreadcrumb && (
            <Breadcrumbs
              sx={{
                '& .MuiBreadcrumbs-separator': { color: 'text.secondary', mx: 0 },
                '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' },
              }}
            >
              <Link
                underline="hover"
                sx={{
                  fontSize: '14px',
                  color: 'primary.main',
                  cursor: 'pointer',
                  lineHeight: 1.57,
                  whiteSpace: 'nowrap',
                }}
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
              >
                レポート一覧
              </Link>
              {variant === 'trash' ? (
                <Typography sx={{ fontSize: '14px', color: 'text.primary', lineHeight: 1.57, whiteSpace: 'nowrap' }}>
                  ゴミ箱
                </Typography>
              ) : (
                <Typography
                  noWrap
                  sx={{ fontSize: '14px', color: 'text.primary', lineHeight: 1.57, maxWidth: 300 }}
                >
                  {reportTitle}
                </Typography>
              )}
            </Breadcrumbs>
          )}
        </Box>

        {/* Flex spacer for list variant */}
        {variant === 'list' && <Box sx={{ flex: 1 }} />}

        {/* Save status (editor only) */}
        {variant === 'editor' && saveStatus !== 'idle' && (
          <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {saveStatus === 'saving' ? '下書きを保存中…' : '下書きを保存済み'}
          </Typography>
        )}

        {/* Update count chip (editor only) */}
        {variant === 'editor' && updateCount > 0 && (
          <Chip
            label={`${updateCount}件の更新あり`}
            size="small"
            sx={{ bgcolor: '#fb8c00', color: 'white', fontSize: '12px', borderRadius: '4px', height: 26 }}
          />
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
          {variant === 'list' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/editor/new')}
              sx={{ height: 42 }}
            >
              新規レポート作成
            </Button>
          )}

          {variant === 'editor' && (
            <>
              <Button
                variant="outlined"
                startIcon={<CheckCircleOutlined />}
                onClick={onSaveVersion}
                sx={{ height: 42 }}
              >
                バージョンを保存
              </Button>
              <Button
                variant="outlined"
                startIcon={<History />}
                onClick={onHistory}
                sx={{ height: 42 }}
              >
                編集履歴
              </Button>
              <Button
                variant="contained"
                startIcon={<RemoveRedEye />}
                onClick={onPreview}
                sx={{ height: 42 }}
              >
                プレビュー
              </Button>
            </>
          )}

          {variant === 'preview' && (
            <>
              <Button
                variant="outlined"
                startIcon={<History />}
                onClick={onHistory}
                sx={{ height: 42 }}
              >
                編集履歴
              </Button>
              <Button
                variant="contained"
                startIcon={<FileDownload />}
                onClick={(e) => onExport?.(e)}
                sx={{ height: 42 }}
              >
                出力
              </Button>
            </>
          )}

          {variant === 'history' && (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onBack}
              sx={{ height: 42 }}
            >
              戻る
            </Button>
          )}

          {variant === 'trash' && (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onBack ?? (() => navigate('/'))}
              sx={{ height: 42 }}
            >
              戻る
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
