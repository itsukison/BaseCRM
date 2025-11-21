
import React, { useState } from 'react';
import { Column, TableData } from '../types';
import { generateRows } from '../services/geminiService';
import { BASE_BLUE } from '../constants';
import { IconPlus, IconBolt } from './Icons';

interface TableCreatorProps {
    onTableCreated: (table: TableData) => void;
    onCancel: () => void;
}

export const TableCreator: React.FC<TableCreatorProps> = ({ onTableCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [columns, setColumns] = useState<Column[]>([
        { id: 'col_1', title: '会社名', type: 'text', description: '企業名' }
    ]);
    const [isGenerating, setIsGenerating] = useState(false);

    const addColumn = () => {
        const newId = `col_${columns.length + 1}`;
        setColumns([...columns, { id: newId, title: '', type: 'text', description: '' }]);
    };

    const updateColumn = (index: number, field: keyof Column, value: string) => {
        const newCols = [...columns];
        newCols[index] = { ...newCols[index], [field]: value };
        setColumns(newCols);
    };

    const handleCreateWithAI = async () => {
        setIsGenerating(true);
        try {
            // Generate initial rows
            const rows = await generateRows(columns, 5, description || name);
            
            const newTable: TableData = {
                id: `table_${Date.now()}`,
                name,
                description,
                columns,
                rows
            };
            onTableCreated(newTable);
        } catch (e) {
            alert("データ生成に失敗しました。APIキーを確認するか、もう一度お試しください。");
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white min-h-screen animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 border-l-4 border-black pl-6">
                <h2 className="text-3xl font-bold tracking-tight mb-2">データベース作成</h2>
                <p className="text-gray-500 font-mono text-sm">スキーマを定義してAIで自動入力</p>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">データベース名</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-lg font-medium transition-all"
                            placeholder="例: 新規リード顧客"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">コンテキスト / 説明</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm transition-all"
                            rows={2}
                            placeholder="どのようなデータを扱いますか？ (AI生成に使用されます)"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">スキーマ定義</label>
                    <div className="space-y-3">
                        {columns.map((col, idx) => (
                            <div key={col.id} className="flex gap-3 items-start p-4 bg-gray-50 border border-gray-100 rounded-lg group hover:border-gray-300 transition-all">
                                <div className="flex-1 space-y-2">
                                    <input 
                                        type="text"
                                        value={col.title}
                                        onChange={(e) => updateColumn(idx, 'title', e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-300 focus:border-blue-600 outline-none text-sm font-bold pb-1 placeholder-gray-400"
                                        placeholder="カラム名"
                                    />
                                    <input 
                                        type="text"
                                        value={col.description || ''}
                                        onChange={(e) => updateColumn(idx, 'description', e.target.value)}
                                        className="w-full bg-transparent outline-none text-xs text-gray-500 placeholder-gray-300"
                                        placeholder="説明 (オプション)"
                                    />
                                </div>
                                <div className="w-32">
                                    <select 
                                        value={col.type}
                                        onChange={(e) => updateColumn(idx, 'type', e.target.value as any)}
                                        className="w-full text-xs font-mono bg-white border border-gray-200 rounded p-2 outline-none focus:border-blue-500"
                                    >
                                        <option value="text">テキスト</option>
                                        <option value="number">数値</option>
                                        <option value="tag">タグ</option>
                                        <option value="url">URL</option>
                                        <option value="date">日付</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={addColumn}
                        className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 uppercase tracking-wider"
                    >
                        <IconPlus className="w-3 h-3" /> カラム追加
                    </button>
                </div>

                <div className="pt-8 flex gap-4 border-t border-gray-100">
                    <button 
                        onClick={handleCreateWithAI}
                        disabled={isGenerating || !name}
                        className="px-6 py-3 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                生成中...
                            </>
                        ) : (
                            <>
                                <IconBolt className="w-4 h-4" />
                                作成 & データ生成
                            </>
                        )}
                    </button>
                    <button 
                        onClick={onCancel}
                        className="px-6 py-3 text-gray-500 hover:text-black font-medium text-sm transition-colors"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
};