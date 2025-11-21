import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DashboardLayout } from './pages/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TablePage } from './pages/TablePage';
import { CreateTablePage } from './pages/CreateTablePage';
import { INITIAL_TABLES } from './constants';
import { TableData, Filter, SortState } from './types';

const App: React.FC = () => {
    const [tables, setTables] = useState<TableData[]>(INITIAL_TABLES);
    const [currentTableId, setCurrentTableId] = useState<string>(INITIAL_TABLES[0].id);

    // Changed to Arrays for Multi-Rule Support
    const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
    const [activeSorts, setActiveSorts] = useState<SortState[]>([]);

    // Selection State (Lifted from TableView)
    const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
    const [selectedCellIds, setSelectedCellIds] = useState<Set<string>>(new Set());

    const updateCurrentTable = (updatedTableOrFn: TableData | ((prev: TableData) => TableData)) => {
        setTables(prevTables => {
            if (typeof updatedTableOrFn === 'function') {
                return prevTables.map(t => t.id === currentTableId ? updatedTableOrFn(t) : t);
            }
            return prevTables.map(t => t.id === updatedTableOrFn.id ? updatedTableOrFn : t);
        });
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/dashboard"
                    element={
                        <DashboardLayout
                            tables={tables}
                            setTables={setTables}
                            currentTableId={currentTableId}
                            setCurrentTableId={setCurrentTableId}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                            activeSorts={activeSorts}
                            setActiveSorts={setActiveSorts}
                            selectedRowIds={selectedRowIds}
                            setSelectedRowIds={setSelectedRowIds}
                            selectedCellIds={selectedCellIds}
                            setSelectedCellIds={setSelectedCellIds}
                            updateCurrentTable={updateCurrentTable}
                        />
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="create" element={<CreateTablePage />} />
                    <Route path="tables/:tableId" element={<TablePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
