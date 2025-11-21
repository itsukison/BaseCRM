import React, { useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { TableView } from '../components/TableView';
import { ChatWidget } from '../components/ChatWidget';
import { TableData, Filter, SortState } from '../types';

interface TablePageContextType {
    tables: TableData[];
    updateCurrentTable: (updatedTableOrFn: TableData | ((prev: TableData) => TableData)) => void;
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
}

export const TablePage: React.FC = () => {
    const { tableId } = useParams<{ tableId: string }>();
    const navigate = useNavigate();
    const {
        tables,
        updateCurrentTable,
        setCurrentTableId,
        activeFilters,
        setActiveFilters,
        activeSorts,
        setActiveSorts,
        selectedRowIds,
        setSelectedRowIds,
        selectedCellIds,
        setSelectedCellIds
    } = useOutletContext<TablePageContextType>();

    // Set current table ID when component mounts or tableId changes
    React.useEffect(() => {
        if (tableId) {
            setCurrentTableId(tableId);
        }
    }, [tableId, setCurrentTableId]);

    const currentTable = useMemo(() =>
        tables.find(t => t.id === tableId),
        [tables, tableId]);

    const filteredTable = useMemo(() => {
        if (!currentTable) return null;

        let processedRows = [...currentTable.rows];

        // Multi-Filter Logic (AND)
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

        // Multi-Sort Logic (Priority based on array order)
        if (activeSorts.length > 0) {
            processedRows.sort((a, b) => {
                for (const sort of activeSorts) {
                    const valA = a[sort.columnId];
                    const valB = b[sort.columnId];

                    if (valA === valB) continue;

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

    // If table not found, redirect to dashboard
    if (!currentTable) {
        navigate('/dashboard');
        return null;
    }

    if (!filteredTable) {
        return <div>Loading...</div>;
    }

    return (
        <>
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
            <ChatWidget
                table={currentTable}
                onApplyFilter={(f) => setActiveFilters(f ? [f] : [])}
                onApplySort={(s) => setActiveSorts(s ? [s] : [])}
                onUpdateTable={updateCurrentTable}
                selectedRowIds={selectedRowIds}
                selectedCellIds={selectedCellIds}
            />
        </>
    );
};
