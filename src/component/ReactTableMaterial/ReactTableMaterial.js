import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';


const ReactTableMaterial = ({columns,data}) => {

  const table = useMaterialReactTable({
    columns: useMemo(() => columns, [columns]), //must be memoized or stable
    data: useMemo(() => data, [data]), //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default ReactTableMaterial;
