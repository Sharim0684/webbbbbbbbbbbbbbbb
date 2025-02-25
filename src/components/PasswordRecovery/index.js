import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input';
import validator from 'validator';
import BrandImg from '../Assets/Innovators-Tech-Black 1.svg'
import BrandLogo from '../Assets/logo symbol png.png';
import "@fontsource/poppins";
import './index.css'

const PasswordRecovery=()=>{
    const [chooseOption,setChooseOption]=useState({
        email:'',        
        mobile:'',
        question:'',
        answer:'',
        emailId:'',
    })
    const [optSelect,setOptSelect]=useState({
        email:false,
        mobile:false,
    })
    const [phoneNumber,setPhoneNumber]=useState('')
    const[isValid,setIsValid]=useState(true)
    const[error,setError]=useState({
        answer:'',
        email:'',
        checkbox:'',
        question:'',
        emailId:''
    })
    
    const onInputChange=(e)=>{
        const {name,value}=e.target;
        setChooseOption((prev)=>({
            ...prev,[name]:value
        }))        
        validateSelection(e)
    }
   
   

    const setInput=(e)=>{
        const{checked,value,name}=e.target
        switch (name) {

            case "email":
                if(checked && !chooseOption.mobile){
                    setChooseOption((prev)=>({...prev,[name]:value}))
                    setOptSelect((prev)=>({
                       email:!prev.email
                    }))
                }
                else if(!checked){
                    setChooseOption((prev)=>({...prev,[name]:''}))
                    setOptSelect((prev)=>({email:!prev.email}))
                }
                else if(checked && chooseOption.mobile){
                    setChooseOption((prev)=>({...prev,[chooseOption.mobile]:'',[chooseOption.email]:''}))
                    setOptSelect({
                        email:false,
                        mobile:false
                    })
                    
                }               
                break;

            case "mobile":
                if(checked && !chooseOption.email){
                    setChooseOption((prev)=>({...prev,[name]:value}))
                    setOptSelect((prev)=>({
                        mobile:!prev.mobile
                     }))
                }
                else if(!checked){
                    setChooseOption((prev)=>({...prev,[name]:''}))
                    setOptSelect((prev)=>({mobile:!prev.mobile}))
                }
                else if(checked && chooseOption.email){
                    setChooseOption((prev)=>({...prev,[chooseOption.email]:''}))
                    setOptSelect({
                        email:false,
                        mobile:false
                    })
                }
                break;

            default:
                break;
        }
        validateSelection(e);    
    }

    const validateSelection=(e)=>{
        const{checked,name,value}=e.target
        setError((prev)=>{
            const stateObj={...prev,[name]:''}
            switch (name) {
                case 'email':
                    if(checked && chooseOption.mobile){
                        stateObj['checkbox']="* Choose only one option."

                    }
                    else if(!checked && !chooseOption.mobile){
                        stateObj['checkbox']="* Choose atleast one option."

                    }        
                    else{
                        stateObj['checkbox']=''
                    }            
                    break;

                case 'mobile':
                    if(checked && chooseOption.email){
                        stateObj['checkbox']="* Choose only one option."
                    }
                    else if(!checked && !chooseOption.email){
                        stateObj['checkbox']="* Choose atleast one option."
                    }
                    else{
                        stateObj['checkbox']=""
                    }
                    break;

                case 'answer':
                    if(!value){
                        stateObj[name]="* Please enter answer."
                    }
                    break;
                case 'question':
                    if(!value){
                        stateObj[name]="* choose one security question."
                    }
                    break;

                case 'emailId':
                    if(!validator.isEmail(value)){
                        stateObj[name]="* Please enter a valid email."
                    }
                    else if(!value.endsWith("gmail.com")){
                        stateObj[name]="* Please enter valid email."
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
       setIsValid(true)
    }

    const validatePhoneNum=()=>{
    const num=phoneNumber
    console.log(!num)
    if(!num){
        setIsValid(false)
    }
    else if(!isValidPhoneNumber(num)){
        setIsValid(false)
    }
    

    }

    const onSubmitForm=(e)=>{
        e.preventDefault()
        const{emailId,question,answer}=chooseOption
        const newObj={
            emailId,
            phoneNumber,
            question,
            answer
        }
        console.log(newObj)
    }

    const renderCheckboxFields=()=>(
        <div className='webapp-pswrecovery-pg-input-field-container webapp-pswrecovery-checkbox-sec'>
            <div className='webapp-pswrecovery-pg-checkbox-container'>
                <input  id='email' name="email" value="email"  checked={optSelect.email}  type='checkbox'  className='webapp-pswrecovery-pg-checkbox'onClick={setInput} />
                <label htmlFor='email' className='webapp-pswrecovery-pg-label'>Email</label>
            </div>
            <div className='webapp-pswrecovery-pg-checkbox-container'>
                <input type='checkbox' id='mobile' name="mobile" value="mobile"  checked={optSelect.mobile}  className='webapp-pswrecovery-pg-checkbox' onClick={setInput} />
                <label htmlFor='mobile' className='webapp-pswrecovery-pg-label'>Mobile</label>
            </div>
            {error.checkbox && <span className='webapp-pswrecovery-pg-err'>{error.checkbox}</span>}
        </div>
    )
   
    const renderEmailField=()=>(
        <div className='webapp-pswrecovery-pg-input-field-container' >
            <input type='text' name='emailId' value={chooseOption.emailId} className='webapp-pswrecovery-pg-input-field' placeholder='Enter your Email'onChange={onInputChange} onBlur={validateSelection} />
            {error.emailId && <span className='webapp-pswrecovery-pg-err'>{error.emailId}</span>}

        </div>
    )

    const renderPhoneNumberField=()=>(
        <div className='webapp-pswrecovery-pg-input-field-container recovery-pg-phoneno-container' >
            <div>
            <PhoneInput defaultCountry="IN"  name="phoneNumber" placeholder="Enter your Phone number" value={phoneNumber} onChange={getPhoneNO} onBlur={validatePhoneNum}  id='webapp-recovery-pg-phone-field'/>
            </div>
            {isValid ? "" :  <span className='webapp-pswrecovery-pg-err phoneno-err'>* Please enter a valid phone number.</span>}
            </div>
    )

    const renderSecurityQuestionField=()=>(
        <div className='webapp-pswrecovery-pg-security-qs-field-container' >
            <label htmlFor='questions' className='webapp-pswrecovery-pg-qs-label'>Select your security question?</label>
            <select id='questions' name='question' className='webapp-pswrecovery-pg-qs-select' onClick={onInputChange} onBlur={validateSelection}  >
                <option  className='option'></option>
                <option className='option'>Who is your favourite cricket player?</option>
                <option className='option'>Which is your favourite movie?</option>
                <option className='option'>What is your mother's madien name?</option>
                <option className='option'>Name the school which you studied ssc?</option>
            </select>
            {error.question && <span className='webapp-pswrecovery-pg-err'>{error.question}</span>}


        </div>
    )

    const renderAnswerField=()=>(
        <div className='webapp-pswrecovery-pg-input-field-container' >
            <input type='text' name='answer' className='webapp-pswrecovery-pg-input-field' placeholder='Type your answer here' onChange={onInputChange} onBlur={validateSelection}/>
            {error.answer && <span className='webapp-pswrecovery-pg-err'>{error.answer}</span>}
        </div>
    )

    
    


    return(
        <div className='webapp-pswrecovery-pg'>
            <div className='webapp-pswrecovery-pg-logo-sec'>
                <img src={BrandImg} alt="KHKR-InnovatorsTech" className='webapp-pswrecovery-pg-brand-img' />
            </div>
            <div className='webapp-pswrecovery-pg-form-sec'>
                <div className='webapp-pswrecovery-pg-brand-logo-container'>
                    <img src={BrandLogo} alt='KHKR-InnovatorsTech' className='webapp-pswrecovery-pg-brand-logo' />

                </div>
                <div className='webapp-pswrecovery-pg-form-container'>
                    <h1 className='webapp-pswrecovery-pg-recovery-text'>Recover Your Password</h1>
                    <p className='webapp-pswrecovery-pg-recovery-sub-text'>Choose <strong>one</strong> option below, we will send a 4 digits code to you.</p>
                    <form className='webapp-pswrecovery-pg-form' onSubmit={onSubmitForm} >
                        {renderCheckboxFields()}
                        {chooseOption.email && renderEmailField()}
                        {chooseOption.mobile && renderPhoneNumberField()}  
                        {renderSecurityQuestionField()}  
                        {renderAnswerField()}                   
                        <button type='submit' className='webapp-pswrecovery-pg-continue-btn'><Link className='webapp-pswrecovery-pg-verif-link' to="/verification">Continue</Link></button> 
                    </form>
                    <p className='webapp-pswrecovery-pg-signin-text'>Already have an account?? <Link className='webapp-pswrecovery-pg-link' to="/"> <span className='webapp-pswrecovery-pg-span-text'>Sign in</span></Link></p>
                </div> 
            </div>

        </div>
    )
}
export default PasswordRecovery;