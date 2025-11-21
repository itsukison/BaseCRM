
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TableView } from './components/TableView';
import { TableCreator } from './components/TableCreator';
import { ChatWidget } from './components/ChatWidget';
import { AsciiBackground } from './components/AsciiBackground';
import { LandingPage } from './components/LandingPage';
import { INITIAL_TABLES } from './constants';
import { TableData, Filter, SortState } from './types';
import { IconDatabase } from './components/Icons';

const App: React.FC = () => {
    const [tables, setTables] = useState<TableData[]>(INITIAL_TABLES);
    const [currentTableId, setCurrentTableId] = useState<string>(INITIAL_TABLES[0].id);
    const [activeView, setActiveView] = useState<string>('landing'); // Default to landing
    
    // Changed to Arrays for Multi-Rule Support
    const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
    const [activeSorts, setActiveSorts] = useState<SortState[]>([]);

    // Selection State (Lifted from TableView)
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
    const [selectedCellIds, setSelectedCellIds] = useState<Set<string>>(new Set());

    const handleCreateTable = (newTable: TableData) => {
        setTables([...tables, newTable]);
        setCurrentTableId(newTable.id);
        setActiveView('table');
        // Reset selection
        setSelectedRowIds(new Set());
        setSelectedCellIds(new Set());
    };

    const updateCurrentTable = (updatedTableOrFn: TableData | ((prev: TableData) => TableData)) => {
        setTables(prevTables => {
            if (typeof updatedTableOrFn === 'function') {
                return prevTables.map(t => t.id === currentTableId ? updatedTableOrFn(t) : t);
            }
            return prevTables.map(t => t.id === updatedTableOrFn.id ? updatedTableOrFn : t);
        });
    };

    const currentTable = useMemo(() => 
        tables.find(t => t.id === currentTableId), 
    [tables, currentTableId]);

    const filteredTable = useMemo(() => {
        if (!currentTable) return null;
        
        let processedRows = [...currentTable.rows];

        // 1. Multi-Filter Logic (AND)
        if (activeFilters.length > 0) {
            processedRows = processedRows.filter(row => {
                return activeFilters.every(filter => {
                    const val = row[filter.columnId];
                    const strVal = String(val ?? '').toLowerCase();
                    const filterVal = filter.value.toLowerCase();

                    switch (filter.operator) {
                        case 'contains': return strVal.includes(filterVal);
                        case 'equals': return strVal === filterVal;
                        case 'greater': 
                            const numValG = parseFloat(strVal);
                            const numFilterG = parseFloat(filterVal);
                            return !isNaN(numValG) && !isNaN(numFilterG) && numValG > numFilterG;
                        case 'less': 
                            const numValL = parseFloat(strVal);
                            const numFilterL = parseFloat(filterVal);
                            return !isNaN(numValL) && !isNaN(numFilterL) && numValL < numFilterL;
                        default: return true;
                    }
                });
            });
        }

        // 2. Multi-Sort Logic (Priority based on array order)
        if (activeSorts.length > 0) {
            processedRows.sort((a, b) => {
                for (const sort of activeSorts) {
                    const valA = a[sort.columnId];
                    const valB = b[sort.columnId];

                    if (valA === valB) continue; // Try next sort rule

                    // Handle missing values (always last)
                    if (valA === undefined || valA === null || valA === '') return 1;
                    if (valB === undefined || valB === null || valB === '') return -1;

                    let comparison = 0;
                    if (typeof valA === 'number' && typeof valB === 'number') {
                        comparison = valA - valB;
                    } else {
                        const strA = String(valA).toLowerCase();
                        const strB = String(valB).toLowerCase();
                        if (strA < strB) comparison = -1;
                        if (strA > strB) comparison = 1;
                    }

                    return sort.direction === 'asc' ? comparison : -comparison;
                }
                return 0;
            });
        }

        return { ...currentTable, rows: processedRows };
    }, [currentTable, activeFilters, activeSorts]);

    // Render Landing Page if active
    if (activeView === 'landing') {
        return <LandingPage onEnter={() => setActiveView('dashboard')} />;
    }

    // Main App Layout
    const renderContent = () => {
        if (activeView === 'create-table') {
            return <TableCreator onTableCreated={handleCreateTable} onCancel={() => setActiveView('dashboard')} />;
        }
        
        if (activeView === 'dashboard') {
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
                                onClick={() => {
                                    setCurrentTableId(table.id);
                                    setActiveView('table');
                                    setActiveFilters([]);
                                    setActiveSorts([]);
                                    setSelectedRowIds(new Set());
                                    setSelectedCellIds(new Set());
                                }}
                                className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                             >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <IconDatabase className="w-12 h-12 text-blue-600"/>
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
                            onClick={() => setActiveView('create-table')}
                            className="bg-[#f2f2f2] p-6 rounded-xl border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 h-48"
                        >
                            <span className="text-3xl mb-2">+</span>
                            <span className="text-sm font-bold uppercase tracking-wider">新規作成</span>
                         </div>
                    </div>
                </div>
            );
        }

        if (activeView === 'table' && filteredTable) {
            return (
                <TableView 
                    table={filteredTable} 
                    onUpdateTable={updateCurrentTable}
                    activeSorts={activeSorts}
                    onUpdateSorts={setActiveSorts}
                    activeFilters={activeFilters}
                    onUpdateFilters={setActiveFilters}
                    selectedRowIds={selectedRowIds}
                    onSelectRowIds={setSelectedRowIds}
                    selectedCellIds={selectedCellIds}
                    onSelectCellIds={setSelectedCellIds}
                />
            );
        }

        return <div>データベースを選択してください</div>;
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden text-[#323232] font-sans bg-white">
            <AsciiBackground />
            
            <Sidebar 
                activeView={activeView}
                setActiveView={setActiveView}
                tables={tables}
                currentTableId={currentTableId}
                onSelectTable={(id) => {
                    setCurrentTableId(id);
                    // Reset sorts/filters when changing tables
                    setActiveFilters([]);
                    setActiveSorts([]);
                    setSelectedRowIds(new Set());
                    setSelectedCellIds(new Set());
                }}
            />

            <main className="flex-1 relative z-0 flex flex-col h-full overflow-hidden">
                {renderContent()}
                
                {activeView === 'table' && currentTable && (
                    <ChatWidget 
                        table={currentTable} 
                        onApplyFilter={(f) => setActiveFilters(f ? [f] : [])} 
                        onApplySort={(s) => setActiveSorts(s ? [s] : [])}
                        onUpdateTable={updateCurrentTable}
                        selectedRowIds={selectedRowIds}
                        selectedCellIds={selectedCellIds}
                    />
                )}
            </main>
        </div>
    );
};

export default App;
