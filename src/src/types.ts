export interface Report {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  status: 'draft' | 'saved';
  hasUpdates?: boolean;
  deletedAt?: string;
}

export interface Section {
  id: string;
  title: string;
  type: 'text' | 'table';
  content: string;
}

export interface EditHistory {
  id: string;
  timestamp: string;
  author: string;
  type: 'EDIT' | 'VERSION' | 'PURGE';
  description: string;
}

export interface ExportHistory {
  id: string;
  timestamp: string;
  format: 'word' | 'excel' | 'pdf';
  fileName: string;
}

export interface KPI {
  id: string;
  name: string;
  category: string;
  unit: string;
  value: number;
}
