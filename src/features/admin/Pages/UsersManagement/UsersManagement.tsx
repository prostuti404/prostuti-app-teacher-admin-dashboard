import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import AdminsList from './AdminsList';
import TeachersList from './TeachersList';

const UsersManagement = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
            <Paper variant="outlined" sx={{ width: '100%', minHeight: '100vh', borderRadius: '10px', p: 3 }}>
                <Typography variant="h3" sx={{ mb: 3 }}>
                    Users Management
                </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="users management tabs">
                    <Tab label="Admins" />
                    <Tab label="Teachers" />
                </Tabs>
            </Box>
            
            <Box sx={{ p: 2, mt: 2 }}>
                {tabIndex === 0 && (
                    <AdminsList />
                )}
                {tabIndex === 1 && (
                    <TeachersList />
                )}
            </Box>
            </Paper>
        </Box>
    );
};

export default UsersManagement;
