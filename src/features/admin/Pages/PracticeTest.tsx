import { Link } from "react-router-dom";


// const PracticeTest = () => {
//     return (
//         <div>
//             <Link to="/admin/practice-test-creation">
//                 Practice Test
//             </Link>
//         </div>
//     );
// };

// src/pages/admin/PracticeTest/PracticeTest.tsx
// src/pages/admin/PracticeTest/PracticeTest.tsx
import { Box, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import Loader from '../../../shared/components/Loader';
import QuestionPatternTable from './QuestionPatternTable';
import QuestionPatternBarChart from './QuestionPatternBarChart';
import { useGetAllQuestionPatternsQuery } from "../../../redux/features/practiceTestApi";

function CustomTabPanel(props: any) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

const PracticeTest = () => {
    const [tab, setTab] = useState(0);
    const { data, isLoading } = useGetAllQuestionPatternsQuery();

    const patterns = data?.data?.data || [];

    if (isLoading) return <Loader />;

    return (
        <Box sx={{ width: '100%', p: 2 }}>
            <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>Practice Test</Typography>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="practice test tabs">
                    <Tab label="Overview" />
                    <Tab label="All Question Pattern" />
                </Tabs>
                <CustomTabPanel value={tab} index={0}>
                    {/* Overview Tab */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Pattern Overview
                        </Typography>
                        <QuestionPatternBarChart data={patterns} />
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Recent Patterns
                            </Typography>
                            <QuestionPatternTable
                                rows={patterns}
                                paginated={false}
                                maxRows={10}
                            />
                        </Box>
                    </Box>
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={1}>
                    {/* All Question Pattern Tab */}
                    <Box sx={{ mt: 2 }}>
                        <QuestionPatternTable
                            rows={patterns}
                            paginated={true}
                            rowsPerPageDefault={25}
                        />
                    </Box>
                </CustomTabPanel>
            </Paper>
        </Box>
    );
};

export default PracticeTest;
