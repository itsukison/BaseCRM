import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { TableData } from '../types';
import { IconDatabase } from '../components/Icons';

interface DashboardContextType {
    tables: TableData[];
    setCurrentTableId: (id: string) => void;
    resetTableState: () => void;
}

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { tables, setCurrentTableId, resetTableState } = useOutletContext<DashboardContextType>();

    const handleTableClick = (tableId: string) => {
        setCurrentTableId(tableId);
        resetTableState();
        navigate(`/dashboard/tables/${tableId}`);
    };

    const handleCreateClick = () => {
        navigate('/dashboard/create');
    };

    return (
        <div className="p-12 animate-in fade-in duration-500 overflow-y-auto h-full">
            <h1 className="text-4xl font-bold mb-8 tracking-tight text-[#323232]">ダッシュボード</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all group">
                    <h3 className="text-gray-500 text-xs font-bold font-mono uppercase tracking-wider mb-2 group-hover:text-blue-600">データベース数</h3>
                    <p className="text-4xl font-bold tracking-tighter text-[#323232]">{tables.length}</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all group">
                    <h3 className="text-gray-500 text-xs font-bold font-mono uppercase tracking-wider mb-2 group-hover:text-blue-600">総レコード数</h3>
                    <p className="text-4xl font-bold tracking-tighter text-[#323232]">
                        {tables.reduce((acc, t) => acc + t.rows.length, 0)}
                    </p>
                </div>
                <div className="p-6 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all group">
                    <h3 className="text-gray-500 text-xs font-bold font-mono uppercase tracking-wider mb-2 group-hover:text-green-600">システムステータス</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xl font-bold text-[#323232]">稼働中</p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-6 tracking-tight text-[#323232] border-b border-gray-100 pb-2">データベース一覧</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map(table => (
                    <div
                        key={table.id}
                        onClick={() => handleTableClick(table.id)}
                        className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <IconDatabase className="w-12 h-12 text-blue-600" />
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-[#323232] group-hover:text-blue-600 transition-colors mb-1">{table.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 h-10">{table.description || "No description provided."}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono text-gray-400 mt-4 pt-4 border-t border-gray-50">
                            <span>{table.rows.length} ROWS</span>
                            <span>{table.columns.length} COLS</span>
                        </div>
                    </div>
                ))}
                <div
                    onClick={handleCreateClick}
                    className="bg-[#f2f2f2] p-6 rounded-xl border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 h-48"
                >
                    <span className="text-3xl mb-2">+</span>
                    <span className="text-sm font-bold uppercase tracking-wider">新規作成</span>
                </div>
            </div>
        </div>
    );
};
