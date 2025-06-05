// src/pages/admin/PracticeTest/QuestionPatternTable.tsx
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Button } from '@mui/material';
import { useState } from 'react';

interface QuestionPatternTableProps {
    rows: any[];
    paginated?: boolean;       // determines if pagination is enabled
    rowsPerPageDefault?: number;
    maxRows?: number;          // used for showing a subset (e.g., 10 in Overview)
}

const columns = [
    { id: 'category', label: 'Category', minWidth: 100 },
    { id: 'division', label: 'Division', minWidth: 80 },
    { id: 'type', label: 'Type', minWidth: 80 },
    { id: 'subject', label: 'Subject Name', minWidth: 120 },
    { id: 'action', label: 'Action', minWidth: 80 }
];

const QuestionPatternTable = ({
    rows,
    paginated = false,
    rowsPerPageDefault = 25,
    maxRows
}: QuestionPatternTableProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);

    // Flatten the patterns
    const flattenedRows = rows.flatMap((pattern) =>
        (pattern.category_id || []).map((cat: any) => ({
            key: `${pattern._id}_${cat._id}`,
            category: pattern.questionType,
            division: cat.division,
            type: cat.type,
            subject: cat.subject,
        }))
    );

    // For non-paginated (overview) version, only show maxRows items
    const dataToShow = paginated
        ? flattenedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : flattenedRows.slice(0, maxRows);

    return (
        <Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden', borderRadius: '10px' }}>
            <TableContainer sx={{ maxHeight: '60vh' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataToShow.map((row) => (
                            <TableRow hover key={row.key}>
                                <TableCell>{row.category}</TableCell>
                                <TableCell>{row.division}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.subject}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            // Implement your action here, e.g., navigation or modal
                                            alert(`You clicked on ${row.subject}`);
                                        }}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {paginated && (
                <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    count={flattenedRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={e => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                />
            )}
        </Paper>
    );
};

export default QuestionPatternTable;
