import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import BrandImg from '../Assets/Innovators-Tech-Black 1.svg'
import BrandLogo from '../Assets/logo symbol png.png'
import validator from 'validator';

import "@fontsource/poppins";
import './index.css'

const SetNewPassword=()=>{
    const[data,setData]=useState({
        password:'',
        confirmPassword:''
    })

    const[error,setError]=useState({
        password:'',
        confirmPassword:''
    })

    const onEnterPassword=(e)=>{
        const{name,value}=e.target       
        setData((prev)=>({...prev,[name]:value}))
        validateInput(e)
          
        }
    

    const validateInput=(e)=>{
        const{name,value}=e.target
        setError((prev)=>{
            const stateObj={...prev,[name]:''}
            switch (name) {
                case 'password':
                    if(validator.isStrongPassword(value,{minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})){
                            stateObj[name]=""
                        }
                        else if(!validator.isStrongPassword(value,{minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})){
                            stateObj[name]="* Set strong password include AlphaNumeric and special chars."
                        }
                        else if(!value){
                            stateObj[name]="* Please enter password."
                        }
                        else if(data.confirmPassword && value !== data.confirmPassword){
                            stateObj['confirmPassword']="* Password and Confirm Password does not match."
                        }
                        else{
                            stateObj['confirmPassword']=data.confirmPassword ? "" : error.confirmPassword
                        }

                        break;
                    
                case 'confirmPassword':
                    if(!value){
                        stateObj[name]="* Please enter confirm password"
                    }
                    else if(data.password && value !== data.password){
                        stateObj[name]="* Password and Confirm Password does not match."
                    }
                    break;
                    
                    
            
                default:
                    break;
            }

            return stateObj;
        
        })
    }

    const onSubmitForm=(e)=>{
        e.preventDefault()
        const{password}=data
        console.log(password)
    }
    


    const renderNewPasswordField=()=>(
        <div className='webapp-setpswpg-input-field-container' >
            <input type='text' name='password' value={data.password} className='webapp-setpswpg-input-field' placeholder='Enter New Password' onChange={onEnterPassword} onBlur={validateInput} />
            {error.password && <span className='webapp-setpswpg-err'>{error.password}</span>}
        </div>
    )

    const renderConformPasswordField=()=>(
        <div className='webapp-setpswpg-input-field-container' >
            <input type='password' name='confirmPassword' value={data.confirmPassword} className='webapp-setpswpg-input-field' placeholder='Conform password' onChange={onEnterPassword} onBlur={validateInput} />
            {error.confirmPassword && <span className='webapp-setpswpg-err'>{error.confirmPassword}</span>}
        </div>
    )


    return(
        <div className='webapp-setpswpg-page'>
            <div className='webapp-setpswpg-brand-logo-sec'>
                <img src={BrandImg} alt='KHKR-InnovatorsTech' className='webapp-setpswpg-brand-img' />
            </div>
            <div className='webapp-setpswpg-form-sec'>
                <div className='webapp-setpswpg-brand-logo-section'>
                    <img src={BrandLogo} alt='KHKR-InnovatorsTech' className='webapp-setpswpg-brand-logo' />
                </div>
                <div className='webapp-setpswpg-form-container'>
                    <h1 className='webapp-setpswpg-setpsw-text'>Set New Password</h1>
                    <p className='webapp-setpswpg-setpsw-sub-text'>Set new password to your account so you can login.</p>
                    <form className='webapp-setpswpg-form' onSubmit={onSubmitForm}>
                        {renderNewPasswordField()}
                        {renderConformPasswordField()}
                        <button type='submit' className='webapp-setpswpg-update-btn'><Link className='webapp-setpsw-updt-link' to="/login">Update</Link></button> 
                    </form>
                    <p className='webapp-setpswpg-signup-text'>Need an account? <Link className='webapp-setpsw-spn-link' to="/sign-up" ><span className='webapp-setpswpg-signup-span-text'>Create one</span></Link></p>
                </div>
            </div>

        </div>

    )
}
export default SetNewPassword;