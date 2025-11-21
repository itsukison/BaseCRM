
import { TableData } from './types';

// Base Brand Palette
export const COLORS = {
    BLUE: '#0000FF',
    BLACK: '#000000', 
    WHITE: '#FFFFFF',
    
    // Grayscale
    GRAY_0: '#FFFFFF',
    GRAY_10: '#EEF0F3',
    GRAY_15: '#DEE1E7',
    GRAY_30: '#B1B7C3',
    GRAY_50: '#717886',
    GRAY_60: '#5B616E',
    GRAY_80: '#32353D',
    GRAY_100: '#0A0B0D',

    // Secondary
    CERULEAN: '#3C8AFF',
    YELLOW: '#FFD12F',
    GREEN: '#66C800',
    LIME_GREEN: '#B6F569',
    RED: '#FC401F',
    PINK: '#FEA8CD'
};

export const BASE_BLUE = COLORS.BLUE;

export const INITIAL_TABLES: TableData[] = [
    {
        id: 'leads-1',
        name: '見込み顧客リスト (東京)',
        description: '東京のAIスタートアップおよびSaaS企業のリスト',
        columns: [
            { id: 'c1', title: '会社名', type: 'text', description: '企業名' },
            { id: 'c2', title: '業界', type: 'tag', description: '主な事業領域' },
            { id: 'c3', title: '調達額 (億円)', type: 'number', description: '資金調達の総額' },
            { id: 'c4', title: '代表者', type: 'text', description: 'CEOの名前' },
            { id: 'c5', title: 'ウェブサイト', type: 'url', description: '企業URL' },
            { id: 'c6', title: 'メモ', type: 'text', description: '自由記述', textOverflow: 'wrap' },
            // Increased default columns to 10
            { id: 'c7', title: 'Column 7', type: 'text', description: '' },
            { id: 'c8', title: 'Column 8', type: 'text', description: '' },
            { id: 'c9', title: 'Column 9', type: 'text', description: '' },
            { id: 'c10', title: 'Column 10', type: 'text', description: '' },
        ],
        rows: [
            { id: 'r1', c1: 'Sakura AI', c2: 'ロボティクス', c3: 12.5, c4: '田中 健太', c5: 'https://example.com', c6: '次回のカンファレンスで接触予定。プロダクトのデモを依頼する。' },
            { id: 'r2', c1: 'NeoFin Tech', c2: 'フィンテック', c3: 5.2, c4: '鈴木 美咲', c5: 'https://neofin.jp', c6: '' },
            { id: 'r3', c1: 'Cloud Base', c2: 'SaaS', c3: 30.0, c4: '佐藤 浩', c5: 'https://cloudbase.jp', c6: '急成長中のスタートアップ。採用を強化している模様。' },
            // Add a formula example row
            { id: 'r4', c1: 'Total Funding', c2: '集計', c3: '= [調達額 (億円)] * 1', c4: 'System', c5: '', c6: 'この行は計算用です' }
        ]
    }
];
