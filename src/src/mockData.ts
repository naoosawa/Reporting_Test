import type { Report, Section, EditHistory, ExportHistory, KPI } from './types';

export const mockReports: Report[] = [
  {
    id: 'r1',
    title: '2024年度 サステナビリティデータブック',
    createdAt: '2024-04-01',
    updatedAt: '2024-04-10',
    author: '山田 太郎',
    status: 'saved',
    hasUpdates: true,
  },
  {
    id: 'r2',
    title: '2024年度 有価証券報告書（ESG開示）',
    createdAt: '2024-03-15',
    updatedAt: '2024-04-08',
    author: '田中 花子',
    status: 'draft',
  },
  {
    id: 'r3',
    title: '2023年度 統合報告書',
    createdAt: '2023-06-01',
    updatedAt: '2023-09-30',
    author: '佐藤 次郎',
    status: 'saved',
  },
  {
    id: 'r4',
    title: '2024年度 GHG排出量レポート',
    createdAt: '2024-04-05',
    updatedAt: '2024-04-12',
    author: '山田 太郎',
    status: 'draft',
    hasUpdates: true,
  },
];

export const mockDeletedReports: Report[] = [
  {
    id: 'rd1',
    title: '2022年度 サステナビリティレポート（旧版）',
    createdAt: '2022-06-01',
    updatedAt: '2023-01-01',
    author: '佐藤 次郎',
    status: 'saved',
    deletedAt: '2024-03-21',
  },
];

export const mockSections: Section[] = [
  { id: 's1', title: '1. 環境データ概要', type: 'text', content: '当社は2024年度においてGHG排出量の削減を進めました。以下にその詳細を報告します。' },
  { id: 's2', title: '2. GHG排出量', type: 'table', content: '' },
  { id: 's3', title: '3. エネルギー消費量', type: 'table', content: '' },
  { id: 's4', title: '4. 水使用量', type: 'text', content: '水使用量については前年度比5%の削減を達成しました。' },
  { id: 's5', title: '5. 廃棄物管理', type: 'text', content: '廃棄物のリサイクル率を向上させるため、各事業所での取り組みを強化しました。' },
];

export const mockEditHistory: EditHistory[] = [
  { id: 'h1', timestamp: '2024-04-10 14:32', author: '山田 太郎', type: 'VERSION', description: '版を保存（第3版）' },
  { id: 'h2', timestamp: '2024-04-10 13:15', author: '山田 太郎', type: 'EDIT', description: '「GHG排出量」テーブル更新' },
  { id: 'h3', timestamp: '2024-04-09 16:40', author: '田中 花子', type: 'EDIT', description: '「環境データ概要」本文修正' },
  { id: 'h4', timestamp: '2024-04-08 11:00', author: '山田 太郎', type: 'VERSION', description: '版を保存（第2版）' },
  { id: 'h5', timestamp: '2024-04-01 09:30', author: '山田 太郎', type: 'VERSION', description: '版を保存（第1版）' },
];

export const mockExportHistory: ExportHistory[] = [
  { id: 'e1', timestamp: '2024-04-10 15:00', format: 'pdf', fileName: 'SDB_2024_snap001.pdf' },
  { id: 'e2', timestamp: '2024-04-09 17:30', format: 'word', fileName: 'SDB_2024_snap002.docx' },
  { id: 'e3', timestamp: '2024-04-08 12:00', format: 'excel', fileName: 'SDB_2024_snap003.xlsx' },
];

export const mockKPIs: KPI[] = [
  { id: 'k1', name: 'Scope1排出量', category: '環境 / GHG排出量 / Scope1', unit: 'tCO2e', value: 12345 },
  { id: 'k2', name: 'Scope2排出量', category: '環境 / GHG排出量 / Scope2', unit: 'tCO2e', value: 6789 },
  { id: 'k3', name: 'Scope3排出量', category: '環境 / GHG排出量 / Scope3', unit: 'tCO2e', value: 98765 },
  { id: 'k4', name: 'エネルギー消費量', category: '環境 / エネルギー / 消費量', unit: 'GJ', value: 456789 },
  { id: 'k5', name: '再生可能エネルギー比率', category: '環境 / エネルギー / 再生可能', unit: '%', value: 23.4 },
  { id: 'k6', name: '水使用量', category: '環境 / 水 / 使用量', unit: 'm³', value: 12300 },
];
