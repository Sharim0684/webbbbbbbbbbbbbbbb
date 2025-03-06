import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { styled, width } from '@mui/system';
import BrandImg from '../Assets/Innovators-Tech-Black 1.svg';
import BrandLogo from '../Assets/logo symbol png.png';
import { HighlightTwoTone } from '@mui/icons-material';

const Container = styled(Box)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(to bottom right, #ffffff,#fffcdc)',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
    },
}));

const ImageSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
        alignItems: 'center',
        top: 30,
        width: "100px",
        height: "200px",
    },
}));

const LogoSection = styled(Box)({
    position: 'absolute',
    top: 20,
    left: 20,
});

const FormSection = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
        marginTop: '30px',
    },
}));

const VerificationPage = () => {
    const [otp, setOtp] = useState('');
    const [seconds, setSeconds] = useState(30);
    const [showTimer, setShowTimer] = useState(true);
    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => {
                if (prev === 1) {
                    setShowTimer(false);
                    clearInterval(timer);
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const resendOtpReq = () => {
        setSeconds(30);
        setShowTimer(true);
    };

    const onSubmitOtp = (e) => {
        e.preventDefault();
        if (otp.length === 4) {
            console.log(otp);
        }
    };

    return (
        <Container>
            <LogoSection>
                <img src={BrandImg} alt="KHKR-InnovatorsTech" style={{ height: 70, width: 200 }} />
            </LogoSection>

            <ImageSection>
                <img src={BrandLogo} alt="KHKR-InnovatorsTech" style={{ height: 300, }} />
            </ImageSection>

            <FormSection>
                <Typography variant="h4" fontWeight={600} gutterBottom>Verification</Typography>
                <Typography variant="body1" color="textSecondary" textAlign="center">
                    Enter 4 digits code that you received in your Email/Phone.
                </Typography>
                <form onSubmit={onSubmitOtp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                    <OtpInput
                        value={otp}
                        onChange={(otp) => {
                            if (/^\d*$/.test(otp)) {
                                setOtp(otp);
                            }
                        }}
                        numInputs={4}
                        renderSeparator={<span style={{ width: '10px' }}></span>}
                        inputStyle={{
                            width: 50,
                            height: 50,
                            outline: 'none',
                            border: '1px solid #561f5b',
                            borderRadius: 8,
                            color: '#561f5b',
                            fontSize: 18,
                            fontWeight: 500,
                            textAlign: 'center',
                        }}
                        renderInput={(props) => <input {...props} />}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#561f5b', width: 230, borderRadius: 2 }}
                        type="submit"
                        disabled={otp.length !== 4}
                    >
                        <Link to={otp.length === 4 ? "/set-new-paswd" : "#"} style={{ textDecoration: 'none', color: 'white' }}>Continue</Link>
                    </Button>
                </form>
                {showTimer ? (
                    <Typography variant="body2" color="#561f5b" mt={2}>00:{seconds < 10 ? `0${seconds}` : seconds}</Typography>
                ) : (
                    <Typography variant="body2" color="#561f5b" mt={2}>
                        Don't receive OTP? <span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={resendOtpReq}>Resend</span>
                    </Typography>
                )}
                <Typography variant="body2" mt={2}>
                    Already have an account? <Link to='/' style={{ textDecoration: 'none', fontWeight: 'bold', color: '#561f5b' }}>Sign in</Link>
                </Typography>
            </FormSection>
        </Container>
    );
};

export default VerificationPage;