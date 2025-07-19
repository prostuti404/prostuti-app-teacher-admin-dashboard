import {Box, Button, Divider, Paper, Typography, Snackbar, Alert as MuiAlert, Pagination} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid2';
import SearchIcon from '@mui/icons-material/Search';
import {useState} from "react";
import {
    useReviewQuestionMutation,
    useGetAllApprovedQuestionsQuery,
    useGetCategoryQuery
} from "../../../redux/features/question/questionApi";
import {getUniqueStrings} from "../../../utils/typeSafeUniqueArrays";
import Loader from "../../../shared/components/Loader";
import CustomLabel from "../../../shared/components/CustomLabel.tsx";
import CustomTextField from "../../../shared/components/CustomTextField.tsx";
import CustomAutoComplete from "../../../shared/components/CustomAutoComplete.tsx";
import {hasDataProperty} from "../../../utils/TypeGuardForErrorMessage.ts";

const ProofCheck = () => {
    const [filter, setFilter] = useState<Record<string, string | undefined>>({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [page, setPage] = useState(1);
    const questionsPerPage = 10;
    const navigate = useNavigate();

    // Redux hooks
    const [reviewQuestion, { isLoading: isReviewing, error }] = useReviewQuestionMutation();

    const {
        data: questionData,
        isLoading: questionsLoading,
        isFetching,
        refetch
    } = useGetAllApprovedQuestionsQuery(filter);

    const {data: categoryData} = useGetCategoryQuery({
        category: filter.category,
        ...(filter.division && {division: filter.division}),
        ...(filter.subject && {subject: filter.subject}),
        ...(filter.chapter && {chapter: filter.chapter})
    });


    // Data transformation
    const questionTypes = ['MCQ', 'Written'];
    const categories = getUniqueStrings(categoryData?.data || [], 'type');
    const divisions = getUniqueStrings(categoryData?.data || [], 'division');
    const subjects = getUniqueStrings(categoryData?.data || [], 'subject');
    const chapters = getUniqueStrings(categoryData?.data || [], 'chapter');
    const hasChapters = categoryData?.data?.some(item => item.chapter);

    // Handlers
    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFilter((prevState) => {
            const newState = {...prevState, [name]: value === '' ? undefined : value};
            if (name === 'category') {
                delete newState.division;
                delete newState.subject;
                delete newState.chapter;
            } else if (name === 'division') {
                delete newState.subject;
                delete newState.chapter;
            } else if (name === 'subject') {
                delete newState.chapter;
            }
            return newState;
        });
    };

    const handleReview = async (id: string, isApproved: boolean) => {
        await reviewQuestion({ id, body: { isApproved } });
        setOpenSnackbar(true);
        refetch();
    };

    if (questionsLoading || isReviewing) {
        return <Loader />;
    }

    const allQuestions = questionData?.data.data || [];
    const paginatedQuestions = allQuestions.slice(
        (page - 1) * questionsPerPage,
        page * questionsPerPage
    );

    return (
        <Box sx={{width: '100%', height: 'auto'}}>
            <Paper variant="outlined" sx={{width: '100%', height: 'auto', borderRadius: '10px', p: 3}}>
                <Box sx={{display: "flex", flexDirection: 'column', gap: '20px', position: 'relative'}}>
                    <Grid container spacing={2}>
                        <Grid size={2}>
                            <CustomLabel fieldName={'Category'}/>
                            <CustomAutoComplete
                                options={categories}
                                value={filter.category}
                                handleInput={handleFilter}
                                name={'category'}
                            />
                        </Grid>
                        <Grid size={2}>
                            <CustomLabel fieldName={'Question Type'}/>
                            <CustomAutoComplete
                                options={questionTypes}
                                value={filter.type}
                                handleInput={handleFilter}
                                name={'type'}
                            />
                        </Grid>
                        <Grid size={2}>
                            <CustomLabel fieldName={'Division'}/>
                            <CustomAutoComplete
                                options={divisions}
                                value={filter.division}
                                handleInput={handleFilter}
                                name={'division'}
                            />
                        </Grid>
                        <Grid size={2}>
                            <CustomLabel fieldName={'Subject'}/>
                            <CustomAutoComplete
                                options={subjects}
                                value={filter.subject}
                                handleInput={handleFilter}
                                name={'subject'}
                            />
                        </Grid>
                        {hasChapters && (
                            <Grid size={2}>
                                <CustomLabel fieldName={'Chapter'}/>
                                <CustomAutoComplete
                                    options={chapters}
                                    value={filter.chapter}
                                    handleInput={handleFilter}
                                    name={'chapter'}
                                />
                            </Grid>
                        )}
                        <Grid size={2} sx={{alignSelf: 'flex-end'}}>
                            <Button variant="contained" sx={{
                                width: '100%',
                                height: '44px',
                                borderRadius: '8px',
                                fontSize: '14px',
                            }}
                                    onClick={() => refetch()}
                            >
                                <SearchIcon/> Search
                            </Button>
                        </Grid>
                    </Grid>
                    <Paper variant="outlined" sx={{width: '100%', p: 2, borderRadius: '8px', mb: 3}}>
                        {isFetching ? <Loader/> : paginatedQuestions.length === 0 ? (
                            <Typography variant="h3" align="center">No Questions Available</Typography>
                        ) : (
                            paginatedQuestions.map((question, index: number) => (
                                <Grid container spacing={2} key={question._id} sx={{position: 'relative', mb: 2}}>
                                    <Box sx={{position: 'absolute', right: 16, top: 16, display: 'flex', gap: 1}}>
                                        <Button
                                            onClick={() => handleReview(question._id, true)}
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleReview(question._id, false)}
                                            variant="contained"
                                            size="small"
                                            color="error"
                                        >
                                            Reject
                                        </Button>
                                    </Box>

                                    <Grid size={12}>
                                        <CustomLabel fieldName={`Question-${index + 1}`}/>
                                        <CustomTextField
                                            name={'question'}
                                            disabled
                                            value={question.title}
                                        />
                                    </Grid>
                                    {question?.type === 'MCQ' && question?.options.map((option: string, i: number) => (
                                        <Grid size={3} key={i}>
                                            <CustomTextField
                                                name={option}
                                                disabled
                                                value={option}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid size={12} sx={{mb: 2}}>
                                        <CustomLabel fieldName={'Answer Description'}/>
                                        <CustomTextField
                                            name={'answer_description'}
                                            disabled
                                            value={question.description}
                                            multiline={true}
                                            rows={4}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <Divider/>
                                    </Grid>
                                </Grid>
                            ))
                        )}
                        {allQuestions.length > questionsPerPage && (
                            <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                                <Pagination
                                    count={Math.ceil(allQuestions.length / questionsPerPage)}
                                    page={page}
                                    onChange={(event, value) => setPage(value)}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </Paper>
                </Box>
            </Paper>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <MuiAlert
                    onClose={() => setOpenSnackbar(false)}
                    severity={hasDataProperty(error) ? "error" : "success"}
                    sx={{width: '100%'}}
                >
                    {hasDataProperty(error) ? error.data.message : "Action successful"}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default ProofCheck;