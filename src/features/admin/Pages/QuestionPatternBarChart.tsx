// src/pages/admin/PracticeTest/QuestionPatternBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const QuestionPatternBarChart = ({ data }: { data: any[]; }) => {
    // Group by questionType (MCQ/Written)
    const grouped = data.reduce((acc: any, curr: any) => {
        acc[curr.questionType] = (acc[curr.questionType] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.keys(grouped).map((type) => ({
        type,
        count: grouped[type],
    }));

    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1976d2" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default QuestionPatternBarChart;
