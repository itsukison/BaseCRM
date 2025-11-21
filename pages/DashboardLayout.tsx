import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { AsciiBackground } from '../components/AsciiBackground';
import { TableData, Filter, SortState } from '../types';

interface DashboardLayoutProps {
    tables: TableData[];
    setTables: (tables: TableData[]) => void;
    currentTableId: string;
    setCurrentTableId: (id: string) => void;
    activeFilters: Filter[];
    setActiveFilters: (filters: Filter[]) => void;
    activeSorts: SortState[];
    setActiveSorts: (sorts: SortState[]) => void;
    selectedRowIds: Set<string>;
    setSelectedRowIds: (ids: Set<string>) => void;
    selectedCellIds: Set<string>;
    setSelectedCellIds: (ids: Set<string>) => void;
    updateCurrentTable: (updatedTableOrFn: TableData | ((prev: TableData) => TableData)) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    tables,
    setTables,
    currentTableId,
    setCurrentTableId,
    activeFilters,
    setActiveFilters,
    activeSorts,
    setActiveSorts,
    selectedRowIds,
    setSelectedRowIds,
    selectedCellIds,
    setSelectedCellIds,
    updateCurrentTable
}) => {
    const resetTableState = () => {
        setActiveFilters([]);
        setActiveSorts([]);
        setSelectedRowIds(new Set());
        setSelectedCellIds(new Set());
    };

    const contextValue = {
        tables,
        setTables,
        currentTableId,
        setCurrentTableId,
        activeFilters,
        setActiveFilters,
        activeSorts,
        setActiveSorts,
        selectedRowIds,
        setSelectedRowIds,
        selectedCellIds,
        setSelectedCellIds,
        updateCurrentTable,
        resetTableState
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden text-[#323232] font-sans bg-white">
            <AsciiBackground />

            <Sidebar
                tables={tables}
                currentTableId={currentTableId}
                onSelectTable={(id) => {
                    setCurrentTableId(id);
                    resetTableState();
                }}
            />

            <main className="flex-1 relative z-0 flex flex-col h-full overflow-hidden">
                <Outlet context={contextValue} />
            </main>
        </div>
    );
};
