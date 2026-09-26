/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, InputLabel, TextField, Typography, InputAdornment, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ProstutiLogo from "../../assets/Dashboard-SVGs/ProstutiLogo";
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from "react";
import { TLoginError, TUser, TUserInfo } from "../../types/types";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUser } from "../../redux/features/auth/authSlice";
import { verifyToken } from "../../utils/verifyToken";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Error from "./Error";
import { RootState } from "../../redux/store";

const Login = () => {
    // state for data handling
    const navigate = useNavigate();
    // state for redux toolkit purposes
    const [login, { isLoading, error }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const existedUser = useAppSelector((state: RootState) => state.auth.user as TUser);

    const [credential, setCredential] = useState<TUserInfo>({
        email: '',
        password: '',
        rememberMe: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    //* below useEffect hook lets the user enter if they are previously logged in
    useEffect(() => {
        const loggedInUser = localStorage.getItem("persist:auth");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser({
                user: JSON.parse(foundUser.user),
                token: JSON.parse(foundUser.token),
            });
        }
        // error handling if no user is logged in
        if (!existedUser) {
            navigate('/');
        } else {
            // redirecting user if they are already logged in
            if (existedUser.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/teacher');
            }
        }
    }, []);

    //^ loader to make sure data loads correctly
    if (isLoading) {
        return (
            <Loader />
        );
    }

    //& error handling
    if (error) {
        return (
            <Error err={error as TLoginError} />
        );
    }

    //^ the below function only handles the change in the login form
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setCredential((prevState) => ({ ...prevState, [name]: value }));
    };

    //* submit the request to the server
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const userInfo = { ...credential };
        if (userInfo.rememberMe?.length === 0) {
            delete userInfo['rememberMe'];
        }
        // sending request to backend to log in the user
        try {
            const res = await login(userInfo).unwrap();
            const loggedInUser = verifyToken(res?.data?.accessToken);
            dispatch(setUser({
                user: loggedInUser,
                token: res?.data?.accessToken
            }));

            // redirecting user based on their role
            if (loggedInUser.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/teacher');
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (

        <Box component='div'
            sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
            {isLoading ?
                (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress /></Box>)
                :
                (
                    <Box sx={{ width: '360px', height: '482px' }}>
                        <Grid container spacing={1.5} sx={{ justifyContent: 'center', mb: '2rem' }}>
                            <Grid size={4} sx={{ alignSelf: 'center' }}><ProstutiLogo width="120px" height="80px" /></Grid>
                            <Grid size={12}><Typography variant="h3" align="center">Log in to your account</Typography></Grid>
                            <Grid size={12}><Typography
                                sx={{
                                    fontSize: '1rem',
                                    lineHeight: '24px',
                                    fontWeight: 400,
                                    color: '#475467'
                                }}
                                align="center">Welcome back! Please enter your details</Typography></Grid>
                        </Grid>
                        {/* login form starts */}
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                                <Grid size={12}>
                                    <InputLabel sx={{ fontSize: '15px', fontWeight: '600' }}>Email</InputLabel>
                                    <TextField
                                        name='email'
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        type="text"
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <InputLabel sx={{ fontSize: '15px', fontWeight: '600' }}>Password</InputLabel>
                                    <TextField
                                        name='password'
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        type={showPassword ? "text" : "password"}
                                        size="small"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid size={7}>
                                    <FormControlLabel
                                        style={{
                                            fontSize: '15px',
                                            lineHeight: '20px',
                                            fontWeight: 600,
                                            color: '#344054'
                                        }}
                                        label={
                                            <span style={{
                                                fontSize: '15px',
                                                lineHeight: '20px',
                                                fontWeight: 600,
                                                color: '#344054'
                                            }}>
                                                Remember for 30 days
                                            </span>
                                        }
                                        control={<Checkbox onChange={(e) => {
                                            e.target.checked ?
                                                setCredential({ ...credential, rememberMe: '30d' }) :
                                                setCredential({ ...credential, rememberMe: '' });
                                        }} />}
                                    />
                                </Grid>
                                <Grid size={5}>
                                    <Typography
                                        sx={{
                                            fontSize: '15px',
                                            lineHeight: '20px',
                                            fontWeight: 600,
                                            color: '#4883FC'
                                        }} align="right" >Forgot Password</Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Button
                                        type='submit'
                                        fullWidth
                                        variant="contained"
                                        size="medium"
                                        sx={{ borderRadius: '8px' }}>
                                        Sign in
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                )}

        </Box>
    );
};

export default Login;