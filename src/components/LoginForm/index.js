import React,{useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator'
import BrandImg from '../Assets/Innovators-Tech-Black 1.svg'
import BrandLogo from '../Assets/logo symbol png.png'
import "@fontsource/poppins";
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'


const LoginForm=()=>{
    const [email,setEmail]=useState('')
    const[phoneNumber,setPhoneNumber]=useState('')
    const[password,setPassword]=useState('')
    const[type,setType]=useState('password')
    const[iconStyle,setIconStyle]=useState('bi-eye')
    const [emailError,setEmailError]=useState(false)
    const[passwordError,setPasswordError]=useState(false)



    // useEffect(()=>{
    //    axios.get('https://jsonplaceholder.typicode.com/posts').then((res)=>console.log(res)).catch((e)=>console.log(e))
    // },[])
  

    

    const onChangeEmail=(e)=>{
        const inputValue=e.target.value
        if(validator.isEmail(inputValue)){
            setEmail(inputValue)
        }
        else if(validator.isMobilePhone(inputValue)){
            setPhoneNumber(inputValue)
        }
       
    }

    const onChangePassword=(e)=>{
        setPassword(e.target.value)
    }

    
    const onClickEyeIcon=()=>{
        if (type==='password'){
            setType('text')
            setIconStyle('bi-eye-slash')
        }
        else{setType('password');setIconStyle('bi-eye')}
    }

    const validateInput=(e)=>{
        const inputValue=e.target.value
        
        if(!validator.isEmail(inputValue)) {
            setEmailError(!emailError)
        }
        else if(!validator.isMobilePhone(inputValue)){
            setEmail(!emailError)
        }
        else if(!inputValue){
            setEmail(!emailError)
        }
    }

    const validatePassword=(e)=>{
        const {value}=e.target
        if(!value){
            setPasswordError(!passwordError)
        }
    }

    const onSubmitUserDetails=(e)=>{
        e.preventDefault()
        let userDetails={}        
        if (email){
            userDetails={email,password}

        }
        else if(phoneNumber){
            userDetails={phoneNumber,password}
        }
        console.log(userDetails)
        setEmail('')
        setPassword('')
        setPhoneNumber('')
    }

    const renderEmailField=()=>(
        <div className='webapp-loginpg-input-filed-container login-email-field' >
            <input type='text' name='email/phone' className='webapp-loginpg-input-field' placeholder='Enter your email/Phone number'  onChange={onChangeEmail} onBlur={validateInput} />
            {emailError && <span className='webapp-loginpg-err'>* Please enter a valid email/phone number.</span> }
        </div>
    )

    const renderPasswordField=()=>(
        <div className='webapp-loginpg-input-filed-container loginpg-password-field' >
            <input type={type} name='password' className='webapp-loginpg-input-field' placeholder='Enter your password' value={password} onChange={onChangePassword} onBlur={validatePassword} />
            <button type='button'className='webapp-login-eye-btn' onClick={onClickEyeIcon}><i className={`bi ${iconStyle}`}></i></button>
            {passwordError && <span className='webapp-loginpg-err'>* Please enter your password.</span> }

        </div>
    )

    return(
        <div className='webapp-login-page'>
            <div className='webapp-loginpg-brand-logo-sec'>
                <img src={BrandImg} alt='KHKR-InnovatorsTech' className='webapp-loginpg-brand-img' />
            </div>
            <div className='webapp-login-form-sec'>
                <div className='webapp-login-pg-brand-logo-section'>
                    <img src={BrandLogo} alt='KHKR-InnovatorsTech' className='webapp-loginpg-brand-logo' />
                </div>
                <div className='webapp-login-form-container'>
                    <h1 className='webapp-loginpg-signin-text'>Sign in</h1>
                    <p className='webapp-loginpg-signin-sub-text'>Please Login to continue to your account.</p>
                    <form className='webapp-login-form' onSubmit={onSubmitUserDetails} >
                        {renderEmailField()}
                        {renderPasswordField()}
                        <Link className='webapp-login-pg-nav-link' to="/forgot-paswd"><p className='webapp-loginpg-forget-pwd-text'>Forgot password?</p></Link>
                        <button type='submit' className='webapp-loginpg-signin-btn'><Link className='webapp-link' to="/" >Sign in</Link></button> 
                    </form>
                    {/* <p className='webapp-loginpg-err'>Invalid credentials</p> */}
                    <p className='webapp-loginpg-signup-text'>Need an account? <Link className='webapp-login-pg-nav-link' to="/sign-up"><span className='webapp-loginpg-signup-span-text'>Create one</span></Link></p>

                </div>
            </div>

        </div>

    )
}
export default LoginForm