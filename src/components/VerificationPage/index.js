import React,{useState,useEffect} from 'react';
import {Link}from 'react-router-dom'
import OtpInput from 'react-otp-input';
import BrandImg from '../Assets/Innovators-Tech-Black 1.svg'
import BrandLogo from '../Assets/logo symbol png.png';
import "@fontsource/poppins";
import './index.css'

const VerificationPage=()=>{
    const[otp,setOtp]=useState('')
    const[seconds,setSeconds]=useState(30)
    const [showTimer,setShowTimer]=useState(true)
    // const [validOtp,setIsValidOtp]=useState(true)
   
    useEffect(()=>{
       const timer=setInterval(()=>{
        setSeconds(seconds-1)
        if(seconds===0){
            setShowTimer(false)
        }
       }, 1000)

       return(()=>clearInterval(timer)) 
    })

    
    const renderTimer=()=>(
        <div className='webapp-vref-pg-timer-container'>
            <p className='webapp-vref-pg-timer'>00:{seconds<10 ? "0"+seconds : seconds}</p>
        </div>
    )

    const renderOtpField=()=>(
        <div className='webapp-vref-pg-otp-filed-containeer' >          
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderSeparator={<span style={{width:"10px"}}></span>}
                isInputNum={true}
                shouldAutoFocus={true} 
                inputStyle={{
                    width:"50px",
                    height:"50px",
                    outline:"none",
                    border:"1px solid #561f5b",
                    borderRadius:"8px",
                    color:"#561f5b",
                    fontSize:"18px",
                    fontFamily:"Poppins",
                    fontWeight:"500",
                }}
               
                renderInput={(props) => <input {...props} />}/>        
    </div>
    )

    const resendOtpReq=()=>{}

    
    const onSubmitOtp=(e)=>{
        e.preventDefault()
        const userEnteredOtp=otp
        console.log(userEnteredOtp)
    }


    return(
        <div className='webapp-vref-pg'>
            <div className='webapp-vref-pg-logo-sec'>
                <img src={BrandImg} alt="KHKR-InnovatorsTech" className='webapp-vref-pg-brand-img' />
            </div>
            <div className='webapp-vref-pg-form-sec'>
                <div className='webapp-vref-pg-brand-logo-container'>
                    <img src={BrandLogo} alt='KHKR-InnovatorsTech' className='webapp-vref-pg-brand-logo' />

                </div>
                <div className='webapp-vref-pg-form-container'>
                    <h1 className='webapp-vref-pg-recovery-text'>Verification</h1>
                    <p className='webapp-vref-pg-recovery-sub-text'>Enter 4 digits code that you received in your Email/Phone.</p>
                    <form className='webapp-vref-pg-form' onSubmit={onSubmitOtp}>
                        {renderOtpField()} 
                        <button type='submit' className='webapp-vref-pg-continue-btn'><Link className='webapp-verf-pg-cont-link' to="/set-new-paswd">Continue</Link></button> 
                    </form>
                    {showTimer ? renderTimer(): <p className='webapp-vref-pg-otp-resend-text'>Don't you receive otp? Click here to <span className='webapp-vref-pg-resend-text' onClick={resendOtpReq}>Resend</span></p> }     
                                     
                    <p className='webapp-vref-pg-signin-text'>Already have an account?? <Link className='webapp-verf-page-link'  to='/'><span className='webapp-vref-pg-span-text'>Sign in</span></Link></p>
                </div>
            </div>

        </div>
    )
}
export default VerificationPage;