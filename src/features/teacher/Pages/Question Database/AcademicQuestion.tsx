import { Box, Button, Divider, Paper, Typography, Snackbar, Alert as MuiAlert, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid2';
import CustomLabel from "../../../../shared/components/CustomLabel";
import CustomAutoComplete from "../../../../shared/components/CustomAutoComplete";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import { useDeleteQuestionMutation, useGetAllAcademicQuestionsQuery, useGetCategoryQuery } from "../../../../redux/features/question/questionApi";
import Loader from "../../../../shared/components/Loader";
import CustomTextField from "../../../../shared/components/CustomTextField";
import DeleteConfirmation from "../../../../shared/components/DeleteConfirmation";
import { hasDataProperty } from "../../../../utils/TypeGuardForErrorMessage";
import { getUniqueStrings } from "../../../../utils/typeSafeUniqueArrays";

const AcademicQuestion = () => {
    const [filter, setFilter] = useState<Record<string, string | undefined>>({});
    const [questionId, setQuestionId] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [filterToSubmit, setFilterToSubmit] = useState<Record<string, string | undefined>>({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [page, setPage] = useState(1);
    const questionsPerPage = 10;
    const navigate = useNavigate();

    // Question type options
    const questionTypes = ['MCQ', 'Written'];

    // Get category data for filtering
    const { data: categoryData } = useGetCategoryQuery({
        category: 'Academic',
        ...(filter.division && { division: filter.division }),
        ...(filter.subject && { subject: filter.subject }),
        ...(filter.chapter && { chapter: filter.chapter })
    });

    // redux call for getting the list of questions
    const { data: questionData, isLoading: filteredDataLoading, isFetching, refetch } = useGetAllAcademicQuestionsQuery(filterToSubmit);
    console.log('filters', filterToSubmit);

    // delete question function from redux
    const [deleteQuestion, { isLoading: questionDeleting, error }] = useDeleteQuestionMutation();

    // Get unique values for filters
    const divisions = getUniqueStrings(categoryData?.data || [], 'division');
    const subjects = getUniqueStrings(categoryData?.data || [], 'subject');
    const chapters = getUniqueStrings(categoryData?.data || [], 'chapter');

    // Check if chapters exist in the data
    const hasChapters = categoryData?.data?.some(item => item.chapter);

    //^ selecting the filters
    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilter((prevState) => {
            const newState = { ...prevState, [name]: value === '' ? undefined : value };
            // Clear dependent fields when parent field changes
            if (name === 'division') {
                delete newState.subject;
                delete newState.chapter;
            } else if (name === 'subject') {
                delete newState.chapter;
            }
            return newState;
        });
    };

    //*go back functionality
    const handleGoBack = () => {
        navigate('/teacher/question-database');
    };

    // confirming the filters to fetch data based on that
    const confirmFilter = (e: React.MouseEvent) => {
        e.preventDefault();
        // checking whether one or more filter keys value are undefined then deleting that key
        const cleanedFilter = Object.entries(filter).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== '' && value !== 'All') {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, string>);

        setPage(1);
        // setFilterToSubmit({ ...cleanedFilter, page: page.toString(), limit: '10' });
        setFilterToSubmit(cleanedFilter);
        refetch();
    };

    //^handle delete from database
    const deleteQuestionFromDatabase = async (id: string) => {
        await deleteQuestion(id);
        setQuestionId('');
        setOpenSnackbar(true);
    };

    //*delete confirmation functions
    const handleDeleteClickOpen = () => {
        setOpen(true);
    };

    const handleDeleteClose = () => {
        setOpen(false);
    };

    if (filteredDataLoading || questionDeleting) {
        return (<Loader />);
    }
    const allQuestions = questionData?.data.data || [];
    const paginatedQuestions = allQuestions.slice(
        (page - 1) * questionsPerPage,
        page * questionsPerPage
    );

    return (
        <Box sx={{ width: '100%', height: 'auto' }}>
            <Paper variant="outlined" sx={{ width: '100%', height: 'auto', borderRadius: '10px', p: 3 }}>
                {/* top title and button section */}
                <Box component="section" sx={{ display: 'flex', gap: '20px', justifyContent: 'flex-start', alignItems: 'center', mb: 3 }}>
                    <Button variant='outlined' sx={{ width: '36px', height: '36px', borderRadius: '8px', borderColor: "grey.700", color: "#3F3F46" }}
                        onClick={handleGoBack}
                    >
                        <ArrowBackIcon fontSize='small' />
                    </Button>
                    <Typography variant='h3'>Academic Question</Typography>
                </Box>

                {/* filter and question database section */}
                <Box sx={{ display: "flex", flexDirection: 'column', gap: '20px', position: 'relative' }}>
                    {/* filters */}
                    <Grid container spacing={2}>
                        <Grid size={2}>
                            <CustomLabel fieldName={'Category'} />
                            <CustomTextField
                                name={'Category'}
                                disabled
                                defaultValue={'Academic'}
                                value='Academic'
                            />
                        </Grid>
                        <Grid size={2}>
                            <CustomLabel fieldName={'Question Type'} />
                            <CustomAutoComplete
                                options={questionTypes}
                                value={filter.type}
                                defaultValue={filter.type}
                                handleInput={handleFilter}
                                name={'type'}
                            />
                        </Grid>
                        <Grid size={2}>
                            <CustomLabel fieldName={'Division'} />
                            <CustomAutoComplete
                                options={divisions}
                                value={filter.division}
                                defaultValue={filter.division}
                                handleInput={handleFilter}
                                name={'division'}
                            />
                        </Grid>
                        <Grid size={2}>
                            <CustomLabel fieldName={'Subject'} />
                            <CustomAutoComplete
                                options={subjects}
                                value={filter.subject}
                                defaultValue={filter.subject}
                                handleInput={handleFilter}
                                name={'subject'}
                            />
                        </Grid>
                        {hasChapters && (
                            <Grid size={2}>
                                <CustomLabel fieldName={'Chapter'} />
                                <CustomAutoComplete
                                    options={chapters}
                                    value={filter.chapter}
                                    defaultValue={filter.chapter}
                                    handleInput={handleFilter}
                                    name={'chapter'}
                                />
                            </Grid>
                        )}
                        <Grid size={2} sx={{ alignSelf: 'flex-end' }}>
                            <Button variant='contained' sx={{ width: '100%', height: '44px', borderRadius: '8px', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}
                                onClick={(e) => confirmFilter(e)}
                            >
                                Search <SearchIcon />
                            </Button>
                        </Grid>
                    </Grid>
                    {/* filters end */}
                    {/* question section */}
                    <Paper variant='outlined' sx={{ width: '100%', height: '100%', p: 2, borderRadius: '8px', mb: 3 }}>
                        {/* fetching the questions */}
                        {
                            (isFetching) && (<Loader />)
                        }
                        {
                            paginatedQuestions.length === 0 && (
                                <Typography variant='h3' align="center">No Questions Available</Typography>
                            )
                        }
                        {
                            paginatedQuestions.map((question: typeof questionData, index: number) => (
                                <Grid container spacing={2} key={index}>
                                    {/* delete question button */}
                                    <Button
                                        onClick={() => {
                                            handleDeleteClickOpen();
                                            setQuestionId(question._id);
                                        }}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            borderRadius: '5px',
                                            width: '15px',
                                            minWidth: '15px',
                                            height: '15px',
                                            borderColor: "grey.700",
                                            color: "#3F3F46",
                                            position: 'absolute',
                                            right: '20px',
                                            p: 1,
                                            "&:hover": {
                                                backgroundColor: 'red',
                                                color: 'white',
                                                borderColor: 'red',
                                            }
                                        }}>
                                        X
                                    </Button>

                                    {/* question title  */}
                                    <Grid size={12}>
                                        <CustomLabel fieldName={`Question-${(page - 1) * questionsPerPage + index + 1}`} />
                                        <CustomTextField
                                            name={'question'}
                                            disabled
                                            placeholder={question.title}
                                        />
                                    </Grid>
                                    {/* options for mcq */}
                                    {
                                        question?.type === 'MCQ' && question?.options.map((option: string, index: number) => (
                                            <Grid size={3} key={index}>
                                                <CustomTextField
                                                    name={option}
                                                    disabled
                                                    placeholder={option}
                                                />
                                            </Grid>
                                        )
                                        )
                                    }
                                    <Grid size={12} sx={{ mb: 2 }}>
                                        <CustomLabel fieldName={'Answer Description'} />
                                        <CustomTextField
                                            name={'answer_description'}
                                            disabled
                                            placeholder={question.description}
                                            multiline={true}
                                            rows={4}
                                        />
                                    </Grid>
                                    <Grid size={12} sx={{ mb: 2 }}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                            ))
                        }
                        {/* Pagination */}
                        {allQuestions.length > questionsPerPage && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
            {/* delete confirmation modal */}
            <DeleteConfirmation
                type="question"
                id={questionId}
                deleteFunction={deleteQuestionFromDatabase}
                handleDeleteClose={handleDeleteClose}
                open={open}
            />
            {/* Alert message */}
            {hasDataProperty(error) && (
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={4000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <MuiAlert
                        onClose={() => setOpenSnackbar(false)}
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        {error.data.message}
                    </MuiAlert>
                </Snackbar>
            )}
        </Box>
    );
};

export default AcademicQuestion;