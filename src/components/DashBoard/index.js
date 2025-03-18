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
        <Box>
            <Box sx={{width:"100%"}}>
                <Header/>
            </Box>
            <Container maxWidth="xl" >            
            <Stack direction={{xs:"column", md:"row"}} justifyContent="center" alignItems='center'  spacing={2} sx={{border:'',height:'auto',marginTop:'10px'}}>
            <Box alignSelf='flex-start' sx={{flex:1,border:'',width:'100%',textAlign:'start'}}>
                <Typography variant='h3' sx={{fontFamily:'Poppins',color:'#561f5b',marginLeft:'',marginTop:'50px',textAlign:"center"}}>Hello User</Typography>
            </Box>
            <Box  sx={{flex:2,height:"500px",width:"auto",border:'',display:'flex',flexDirection:"column",justifyContent:'center',alignItems:'center',marginTop:"20px"}}>
                    <img src={MediaManagerImg} alt='MediaMangerImg' style={{height:'350px',width:"350px",backgroundColor:'transparent'}} />
                    <Typography variant='h5'sx={{textAlign:'',fontFamily:'poppins',color:'#561f5b'}}>Welcome to  Webapp</Typography>
                    <Typography variant='' sx={{fontFamily:'Poppins', color:'blue'}}>Thank you for using Webapp</Typography>
                    <Typography variant='' sx={{fontFamily:'Poppins',color:'#561f5b',marginBottom:'10px'}}>Smart solution to share block post.</Typography>
                    <Button sx={{marginTop:""}}><Link style={{textDecoration:'none',color:'white'}} to="/add-accounts" >Accounts</Link></Button>
            </Box>
            </Stack>
        </Container>
        </Box>
        

    )
}
export default DashBoard