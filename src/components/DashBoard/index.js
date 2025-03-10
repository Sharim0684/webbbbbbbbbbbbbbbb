import React from 'react'
import Container from '@mui/material/Container';
import MediaManagerImg from '../Assets/shared image.jpg'
import './index.css'
import Header from '../Header'
import {Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DashBoard=()=>{
    return( 
        <container maxwidth="xl" >
            <Header/>
            <Stack direction="row" justifyContent="center" alignItems='center' spacing={2} style={{border:'',height:'90vh'}}>
            <Box alignSelf='flex-start' sx={{flex:1,border:'',textAlign:'start'}}>
                <Typography variant='h3' sx={{fontFamily:'Poppins',color:'#561f5b',marginLeft:'100px',marginTop:'100px'}}>Hello User</Typography>
            </Box>
            <Box sx={{flex:2,height:"500px",border:'',display:'flex',flexDirection:"column",justifyContent:'center',alignItems:'center'}}>
                    <img src={MediaManagerImg} alt='MediaMangerImg' style={{height:'350px',width:'400px',backgroundColor:'transparent'}} />
                    <Typography variant='h5'sx={{textAlign:'',fontFamily:'poppins',color:'#561f5b'}}>Welcome to  Webapp</Typography>
                    <Typography variant='' sx={{fontFamily:'Poppins', color:'blue'}}>Thank you for using Webapp</Typography>
                    <Typography variant='' sx={{fontFamily:'Poppins',color:'#561f5b',marginBottom:'10px'}}>Smart solution to share block post.</Typography>
                    <Button sx={{marginTop:""}}><Link style={{textDecoration:'none',color:'white'}} to="/add-accounts" >Accounts</Link></Button>

            </Box>
            </Stack>
        </container>

    )
}
export default DashBoard