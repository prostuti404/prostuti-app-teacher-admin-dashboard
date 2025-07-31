import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <Box component="footer" sx={{ p: 2, mt: 'auto', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" color="text.secondary" align="center">
                {'© '}
                <Link color="inherit" href="/">
                    Prostuti
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
                {' | '}
                <Link href="/privacy-policy" color="inherit">
                    Privacy Policy
                </Link>
            </Typography>
        </Box>
    );
};

export default Footer;