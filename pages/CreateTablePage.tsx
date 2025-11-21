import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { TableCreator } from '../components/TableCreator';
import { TableData } from '../types';

interface CreateTablePageContextType {
    tables: TableData[];
    setTables: (tables: TableData[]) => void;
    setCurrentTableId: (id: string) => void;
    resetTableState: () => void;
}

export const CreateTablePage: React.FC = () => {
    const navigate = useNavigate();
    const { tables, setTables, setCurrentTableId, resetTableState } = useOutletContext<CreateTablePageContextType>();

    const handleTableCreated = (newTable: TableData) => {
        setTables([...tables, newTable]);
        setCurrentTableId(newTable.id);
        resetTableState();
        navigate(`/dashboard/tables/${newTable.id}`);
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return <TableCreator onTableCreated={handleTableCreated} onCancel={handleCancel} />;
};
