import { Box, Typography, Container } from '@mui/material';

const PrivacyPolicy = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center">
                Privacy Policy
            </Typography>

            <Typography variant="body1" sx={{ fontSize: 15, lineHeight: 1.5, my: 4 }}>
                At Prostuti Technologies ("Prostuti," "we," "our"), we are concerned about your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal data when you use our platform (app, website, or related services). When you access our services, you agree to data collection and use as outlined in this policy.
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    1. What Data We Collect
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    We collect personal data that you provide directly, such as your "name," "email address," "phone number," and "payment information." We also gather account-based information, such as "study interests," "profile information," and "academic history." We additionally collect usage data, such as your use of the platform, "device information," and "location information" (if enabled). "Cookies" are used to enhance your experience by personalizing content and functionality.
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    2. How We Use Your Data
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    We utilize your personal data primarily to provide and improve our services, such as personalized study plans, exam preparation, and interactions with mentors. We also utilize the data to interact with you regarding account modifications, promotions, and support. Additionally, usage data enables us to gauge the performance of the platform and develop new features.
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    3. Who We Share Your Data With
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    We do not rent or sell your personal data. We will, however, share your information with "service providers," such as "payment processors" and "cloud service providers," that help us operate the platform. We will also share information as required by law or in relation to a business transfer (such as a "merger" or "sale of assets").
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    4. Data Storage and Retention
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    We keep your information secure, and we retain it for as long as necessary to provide you with our services or as required by law. We use "cookies" to collect information for functionality and personalization. You can control "cookies" through the settings in your browser, although some functionality will be affected if "cookies" are disabled.
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    5. Your Rights
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    You are entitled to your personal data. You can access it, modify it, or request its erasure. You can also withdraw from "marketing communications" and request a copy of your data in portable format. To invoke any such rights, please reach out to us at prostutiapp.tech@gmail.com
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    6. Note to Parents
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    Our website is designed for users above the age of 12 years. If you are a parent or guardian and believe your child has submitted personal data to us, please contact us so we can take appropriate action.
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    7. Changes to This Privacy Policy
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    We will amend this Privacy Policy from time to time to reflect our new practices or obligations imposed by law. We will inform you of any substantial changes in this Privacy Policy by email or platform notification. You are advised to view this policy periodically to be informed of such changes.
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    8. Contact Us
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    If you have any questions or concerns about this Privacy Policy or how we handle your personal data, please contact us at prostutiapp.tech@gmail.com
                </Typography>
            </Box>

        </Container>
    );
};

export default PrivacyPolicy;