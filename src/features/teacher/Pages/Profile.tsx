import { Avatar, Box, Button, Card, Paper, Typography, Tabs, Tab } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import CustomTextField from "../../../shared/components/CustomTextField";
import CustomLabel from "../../../shared/components/CustomLabel";
import Loader from "../../../shared/components/Loader";
import { useGetTeacherProfileQuery, useUpdateTeacherMutation } from "../../../redux/features/teacher/teacherApi";
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ErrorResponse {
    message: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`,
    };
}

const Profile = () => {
    // Tab management
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // to hide the default input field for file upload
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    // below state stores the selected image url
    const [tempAvatar, setTempAvatar] = useState('');

    //below state is for showing the upload button on hovering the avatar
    const [isHovering, setIsHovering] = useState(false);
    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
        subjects: [] as string[],
        jobType: "",
        email: "",
        password: "",
        confirmPassword: "",
        assignedWorks: []
    });
    const [noFieldError, setNoValidFieldError] = useState<null | string>(null);

    // below state handles the selected image file and ready it to upload
    const [profileImg, setProfileImg] = useState<File | null>(null);
    // redux state
    const { data: fetchedProfileData, isLoading, } = useGetTeacherProfileQuery({});
    const [updateTeacher, { isLoading: updateLoading, }] = useUpdateTeacherMutation();

    // making the error message available for only 5 seconds
    useEffect(() => {
        setTimeout(() => {
            setNoValidFieldError(null);
        }, 5000);
    }, [noFieldError]);

    // handling the loading instances
    if (isLoading || updateLoading) {
        return <Loader />;
    }

    console.log("fetched profile data", fetchedProfileData.data);

    // extracting teacher data from backend
    const { teacherId, email, joinedDate, name, phone, subjects, assignedWorks } = fetchedProfileData?.data || [];

    // form data handler
    //^ handling non file form data
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData((prevState) => ({ ...prevState, [name]: value }));
    };

    //^handling the avatar change
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setTempAvatar(URL.createObjectURL(file));
            // Store the file separately for the form submission
            setProfileImg(file);
        }
    };

    //* handling the submitted form data
    const handleGeneralSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const teacherInfo = new FormData();

        // Append avatar if available
        if (profileImg) teacherInfo.append("avatar", profileImg);

        // Append profileData as a JSON string based on condition
        teacherInfo.append(
            'profileData',
            JSON.stringify({
                ...(profileData.name && { name: profileData.name }),
                ...(profileData.phone && { phone: profileData.phone }),
                ...(profileData.subjects && profileData.subjects.length > 0 && { subjects: profileData.subjects }),
                ...(profileData.jobType && { jobType: profileData.jobType }),
            })
        );

        const updateResult = await updateTeacher({ teacherInfo, teacherId });

        // error handling when update request is sent with empty fields
        if (updateResult.error) {
            const errorData = (updateResult.error as FetchBaseQueryError).data as ErrorResponse;
            setNoValidFieldError(errorData.message);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Password update logic here
        if (profileData.password !== profileData.confirmPassword) {
            setNoValidFieldError("Passwords do not match");
            return;
        }

        const passwordUpdateData = {
            password: profileData.password
        };

        // Add API call for password update
        console.log("Password update data:", passwordUpdateData);
    };

    return (
        <Box sx={{ width: '100%', height: '100vh' }}>
            <Paper variant="outlined" sx={{ width: '100%', height: '100vh', borderRadius: '25px', p: 3 }}>
                {/* show error */}
                {
                    noFieldError && (
                        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#fae3e4', color: "#ed5c96", p: 1, borderRadius: 3, mb: 3 }}>
                            <Grid size={12}>
                                <Typography variant='h5' align="center">{noFieldError}</Typography>
                            </Grid>
                        </Box>
                    )
                }

                {/* top profile title */}
                <Box component="section" sx={{ mb: 3 }}>
                    <Typography variant='h3'>Profile</Typography>
                </Box>

                {/* profile picture and teacher name */}
                <Box component="section" sx={{ display: 'flex', justifyContent: 'flex-start', gap: 3, mb: 3 }}>
                    {/* avatar section */}
                    <Box sx={{ position: 'relative' }}>
                        <Avatar alt="teacher-photo" src={tempAvatar || ''} sx={{ width: "130px", height: "130px" }}
                            onMouseOver={() => setIsHovering(true)}
                            onMouseOut={() => setIsHovering(false)}
                        />
                        {/* new image upload button */}
                        {
                            isHovering && (
                                <Button component="label"
                                    role={undefined}
                                    size="small"
                                    variant="outlined"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ position: 'absolute', top: "40%", left: '5px', color: "gray.700", borderRadius: "8px", cursor: "pointer" }}
                                    onMouseOver={() => setIsHovering(true)}
                                    onMouseOut={() => setIsHovering(false)}
                                >
                                    Upload New
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={handleAvatarChange}
                                    />
                                </Button>)
                        }
                    </Box>
                    {/* avatar section ends */}
                    <Box component="div" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 0.5 }}>
                        <Typography variant="h3">{name || "Teacher Name"}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: "650" }}>{teacherId}</Typography>
                    </Box>
                </Box>

                {/* Tabs section */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs"
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: '#1976d2',
                                height: '3px'
                            }
                        }}
                    >
                        <Tab label="General" {...a11yProps(0)} sx={{
                            textTransform: 'none',
                            fontWeight: tabValue === 0 ? 600 : 400,
                            color: tabValue === 0 ? '#1976d2' : 'inherit'
                        }} />
                        <Tab label="Password" {...a11yProps(1)} sx={{
                            textTransform: 'none',
                            fontWeight: tabValue === 1 ? 600 : 400,
                            color: tabValue === 1 ? '#1976d2' : 'inherit'
                        }} />
                        <Tab label="Activity" {...a11yProps(2)} sx={{
                            textTransform: 'none',
                            fontWeight: tabValue === 2 ? 600 : 400,
                            color: tabValue === 2 ? '#1976d2' : 'inherit'
                        }} />
                    </Tabs>
                </Box>

                {/* General Tab */}
                <TabPanel value={tabValue} index={0}>
                    <form onSubmit={handleGeneralSubmit}>
                        <Box component="section" sx={{ flexGrow: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: "600", mb: 2 }}>General Settings</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                Here you can change the general setting to your account
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <CustomLabel fieldName="Email" />
                                    <CustomTextField
                                        value={email || profileData.email}
                                        name="email"
                                        placeholder={email || ""}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <CustomLabel fieldName="Contact Number" />
                                    <CustomTextField
                                        name="phone"
                                        value={phone || profileData.phone}
                                        placeholder={phone || ""}
                                        handleInput={handleInput}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <CustomLabel fieldName="Subject" />
                                    <CustomTextField
                                        value={subjects?.join(", ") || profileData.subjects?.join(", ")}
                                        name="subjects"
                                        placeholder={subjects?.join(", ") || ""}
                                        handleInput={handleInput}
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <CustomLabel fieldName="Assigned to" />
                                    <CustomTextField
                                        value={assignedWorks || "Teacher"}
                                        name="jobType"
                                        placeholder={"Job"}
                                        handleInput={handleInput}
                                        disabled={true}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button variant='contained' type='submit'
                                    sx={{ width: '120px', height: '38px', borderRadius: '8px', fontSize: '14px' }}>
                                    Save
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </TabPanel>

                {/* Password Tab */}
                <TabPanel value={tabValue} index={1}>
                    <form onSubmit={handlePasswordSubmit}>
                        <Box component="section" sx={{ flexGrow: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: "600", mb: 2 }}>Password Settings</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                                Here you can change your password
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <CustomLabel fieldName="New Password" />
                                    <CustomTextField
                                        type="password"
                                        name="password"
                                        value={profileData.password}
                                        placeholder="Enter new password"
                                        handleInput={handleInput}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <CustomLabel fieldName="Confirm Password" />
                                    <CustomTextField
                                        type="password"
                                        name="confirmPassword"
                                        value={profileData.confirmPassword}
                                        placeholder="Confirm new password"
                                        handleInput={handleInput}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                <Button variant='contained' type='submit'
                                    sx={{ width: '120px', height: '38px', borderRadius: '8px', fontSize: '14px' }}>
                                    Update
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </TabPanel>

                {/* Activity Tab */}
                <TabPanel value={tabValue} index={2}>
                    <Box component="section" sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: "600", mb: 2 }}>Activity</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                            Your recent activities
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.8, px: 1.5, py: 0.8, borderRadius: 2 }}>
                                    <AccessTimeOutlinedIcon fontSize="large" color="disabled" />
                                    <Box component='div'>
                                        <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>Accepted flashcard</Typography>
                                        <Typography variant="subtitle1" color="grey.500" sx={{ fontSize: '14px', fontWeight: '500' }}>3 minutes ago</Typography>
                                    </Box>
                                </Card>
                            </Grid>
                            {assignedWorks && assignedWorks.map((work: string, index: number) => (
                                <Grid size={12} key={index}>
                                    <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.8, px: 1.5, py: 0.8, borderRadius: 2 }}>
                                        <AccessTimeOutlinedIcon fontSize="large" color="disabled" />
                                        <Box component='div'>
                                            <Typography variant="subtitle1" sx={{ fontSize: '14px', fontWeight: '600' }}>Assigned to {work}</Typography>
                                            <Typography variant="subtitle1" color="grey.500" sx={{ fontSize: '14px', fontWeight: '500' }}>Since {joinedDate}</Typography>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default Profile;