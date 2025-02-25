import React,{useState} from 'react';
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Link } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import validator from 'validator';
import BrandImg from '../Assets/Innovators-Tech-Black 1.svg';
import BrandLogo from '../Assets/logo symbol png.png';
import "@fontsource/poppins";
import 'react-phone-number-input/style.css'
import './index.css'

const SignUpForm=()=>{

    const [formData,setFormData]=useState({
        username:'',
        email:'',
        recoveryEmail:'',
        password:'',
        confirmPassword:'',
        answer:'',
        question:''
        
    })
    const [phoneNumber,setPhoneNumber]=useState('')
    const[isValid,setIsValid]=useState(true)

    const [error,setError]=useState({
        username:'',
        email:'',
        recoveryEmail:'',
        password:'',
        confirmPassword:'',
        answer:'',
        question:'',

    })
   
    const onInputChange=(e)=>{
        const {name,value}=e.target;
        setFormData((prev)=>({
            ...prev,[name]:value
        }))        
        validateInput(e)
    }

    const validateInput=(e)=>{
        let {name,value}=e.target

        setError((prev)=>{
            const stateObj={...prev,[name]:''};

            switch (name) {
                case "username":
                    if(!value){
                        stateObj[name]="* Please enter your name."
                    }                    
                    break;

                case "email":
                    if(!validator.isEmail(value)){
                        stateObj[name]="* Please enter valid Email."
                    }
                    else if(!value.endsWith("gmail.com")){
                        stateObj[name]="* Please enter valid Email."
                    }
                    break;
                
                case "recoveryEmail":
                    if(!validator.isEmail(value)){
                        stateObj[name]="* Please enter valid Email."
                    }
                    else if(!value.endsWith("gmail.com")){
                        stateObj[name]="* Please enter valid Email."
                    }
                    else if(formData.email && value === formData.email ){
                        stateObj[name]="* Email and recoveryEmail shoud not be same."
                    }
                    break;

                
                
                
                case 'answer':
                    if(!value){
                        stateObj[name]="* Please enter your answer."
                    }
                    break;
                case 'question':
                    if(!value){
                        stateObj[name]="* Choose one security question."
                    }
                    break;

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
                    else if(formData.confirmPassword && value !== formData.confirmPassword){
                        stateObj['confirmPassword']="* Password and Confirm Password does not match."
                    }
                    else{
                        stateObj['confirmPassword']=formData.confirmPassword ? "" : error.confirmPassword
                    }
                    break;
                
                case 'confirmPassword':
                    if(!value){
                        stateObj[name]="* Please enter confirm password"
                    }
                    else if(formData.password && value !== formData.password){
                        stateObj[name]="* Password and Confirm Password does not match."
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        })

    }

    const getPhoneNO=(value)=>{
        setPhoneNumber(value)
    }

    const validatePhoneNum=(e)=>{
       const num=e.target.value;
       if(!isValidPhoneNumber(num)){
        setIsValid((prev)=>(!prev))
       }
     }

   
   
    const onSubmitForm=(e)=>{
        e.preventDefault()
        const{username,email,recoveryEmail,password,question,answer}=formData
        const newUserObj={
            id: uuidv4(),
            name:username,
            email,
            recoveryEmail,
            phoneNumber,
            question,
            password,
            answer
        }
        console.log(newUserObj)
        setFormData({username:'',email:'',recoveryEmail:'',password:'',confirmPassword:'',question:'',answer:''})
        setPhoneNumber('')
    }
    
    

   

    const renderNameField=()=>(
        <div className='webapp-signup-pg-input-filed-container' >
            <input type='text' name='username' className='webapp-signup-pg-input-field' placeholder='Enter your Name' value={formData.username} onChange={onInputChange} onBlur={validateInput} />
            {error.username && <span className='webapp-signup-pg-err'>{error.username}</span>}
        </div>
    )

    const renderEmailField=()=>(
        <div className='webapp-signup-pg-input-filed-container' >
            <input type='text' name='email' className='webapp-signup-pg-input-field' placeholder='Enter your Email' value={formData.email} onChange={onInputChange} onBlur={validateInput} />
            {error.email && <span className='webapp-signup-pg-err'>{error.email}</span>}

        </div>
    )

    const renderRecoveryEmailField=()=>(
        <div className='webapp-signup-pg-input-filed-container' >
            <input type='text' name='recoveryEmail' className='webapp-signup-pg-input-field' placeholder='Enter your Recovery Email' value={formData.recoveryEmail} onChange={onInputChange} onBlur={validateInput} />
            {error.recoveryEmail && <span className='webapp-signup-pg-err'>{error.recoveryEmail}</span>}

        </div>
    )

    const renderPhoneNumberField=()=>(
        <div className='webapp-signup-pg-input-filed-container phone-container' >
            <div>
                <PhoneInput defaultCountry="IN"  name="phoneNumber" placeholder="Enter your Phone number" value={phoneNumber} onChange={getPhoneNO} onBlur={validatePhoneNum}  className='webapp-signup-pg-phone-field'/>
            </div>
            {isValid ? "":  <span className='webapp-signup-pg-err signup-pg-ph-err'>* Please enter a valid phone number.</span>}
        </div>
    )
    
    const renderPasswordField=()=>(
        <div className='webapp-signup-pg-input-filed-container' >
            <input type='password' name='password' className='webapp-signup-pg-input-field' placeholder='Enter Password' value={formData.password} onChange={onInputChange} onBlur={validateInput} />
            {error.password && <span className='webapp-signup-pg-err'>{error.password}</span>}
        </div>
    )

    const renderConfirmPasswordField=()=>(
        <div className='webapp-signup-pg-input-filed-container' >
            <input type='text' name='confirmPassword' className='webapp-signup-pg-input-field' placeholder='Confirm Password' value={formData.confirmPassword} onChange={onInputChange} onBlur={validateInput} />
            {error.confirmPassword && <span className='webapp-signup-pg-err'>{error.confirmPassword}</span>}

        </div>
    )

    const renderSecurityQuestionField=()=>(
        <div className='webapp-signup-pg-security-qs-field-container' >
            <label htmlFor='questions' className='webapp-signup-pg-qs-label'>Choose one question for your security?</label>
            <select id='questions' name='question' className='webapp-signup-pg-qs-select' onClick={onInputChange} onBlur={validateInput} >
                <option  className='option'></option>
                <option className='option'>Who is your favourite cricket player?</option>
                <option className='option'>Which is your favourite movie?</option>
                <option className='option'>What is your mother's madien name?</option>
                <option className='option'>Name the school which you studied ssc?</option>
            </select>
            {error.question && <span className='webapp-signup-pg-err'>{error.question}</span>}


        </div>
    )
    const renderAnswerField=()=>(
        <div className='webapp-signup-pg-input-filed-container' >
            <input type='text' name='answer' className='webapp-signup-pg-input-field' placeholder='Type your answer here' value={formData.answer} onChange={onInputChange} onBlur={validateInput} />
            {error.answer && <span className='webapp-signup-pg-err'>{error.answer}</span>}
        </div>
    )


    return(
        <div className='webapp-signup-pg'>
            <div className='webapp-signup-pg-brand-img-sec'>
                <img src={BrandImg} alt="KHKR-InnovatorsTech" className='webapp-signup-pg-brand-img' />
            </div>
            <div className='webapp-signup-pg-form-sec'>
                <div className='webapp-signup-pg-brand-logo-container'>
                    <img src={BrandLogo} alt='KHKR-InnovatorsTech' className='webapp-signup-pg-brand-logo' />
                </div>
                <div className='webapp-signup-pg-form-container'>
                    <h1 className='webapp-signup-pg-signup-text'>Sign up</h1>
                    <p className='webapp-signup-pg-signup-sub-text'>Sign up to enjoy the feature of Revolutie</p>
                    <form className='webapp-signup-pg-form' onSubmit={onSubmitForm}>
                        {renderNameField()}
                        {renderEmailField()}
                        {renderRecoveryEmailField()}
                        {renderPhoneNumberField()}
                        {renderPasswordField()}
                        {renderConfirmPasswordField()}     
                        {renderSecurityQuestionField()}
                        {renderAnswerField()}
                        <button type='submit' className='webapp-signup-pg-signup-btn'><Link className='webapp-signup-link' to="/login">Sign up</Link></button> 
                    </form>
                    <p className='webapp-signup-pg-signin-text'>Already have an account?? <Link className='webapp-signup-pg-link' to='/login'><span className='webapp-signup-pg-span-text'>Sign in</span></Link></p>
                </div>
            </div>

        </div>
    )
}
export default SignUpForm;