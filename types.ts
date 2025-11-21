export type ColumnType = 'text' | 'number' | 'tag' | 'url' | 'email' | 'date';

export type TextOverflowMode = 'wrap' | 'clip' | 'visible';

export interface Column {
  id: string;
  title: string;
  type: ColumnType;
  description?: string; // For AI context
  textOverflow?: TextOverflowMode;
}

export interface Row {
  id: string;
  [columnId: string]: any;
}

export interface TableData {
  id: string;
  name: string;
  description: string;
  columns: Column[];
  rows: Row[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  type?: 'text' | 'action_log';
}

export interface Filter {
  columnId: string;
  operator: 'contains' | 'equals' | 'greater' | 'less';
  value: string;
}

export interface SortState {
  columnId: string;
  direction: 'asc' | 'desc';
}