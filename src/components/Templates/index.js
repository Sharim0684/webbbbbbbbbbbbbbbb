import { Box, Stack, Typography } from '@mui/material';
import React from 'react'
import Header from '../Header';
import { Container } from 'react-bootstrap';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";



const Templates=()=>{

    const socialPlatforms = [
        { name: "Facebook", icon: <FacebookIcon color='primary' /> },
        { name: "Twitter", icon: <XIcon color="primary" sx={{fontSize:'20px'}} /> },
        { name: "Instagram", icon: <InstagramIcon color="primary"/> },
        { name: "LinkedIn", icon: <LinkedInIcon color="primary"/> },
      ];

    return(
        <container>
            <Header/>
            <container >
                <Stack direction='row' spacing={2} mt={2}sx={{padding:'20px'}}>
                    <Box flex={1} sx={{border:'1px solid blue',}}>
                        <Typography variant='h6' sx={{textAlign:'center',color:'#561f5b'}}>Platforms</Typography>
                        
                    </Box>
                    <Box flex={2} sx={{border:'1px solid red',backgroundColor:''}}>
                        <Box sx={{textAlign:'start',padding:'20px'}}>
                            <Typography variant='h5' sx={{color:'#561f5b',fontFamily:'poppins',mb:1}}>Facebook Templates Settings.</Typography>
                            <Typography variant='h7' sx={{fontFamily:'poppins',color:'grey'}} >You can setup Facebook post settings below.</Typography>
                        </Box>
                        <Box>
                            <Typography variant='h6' sx={{color:'#561f5b',fontFamily:'poppins',fontWeight:'500'}}>Custom message</Typography>
                            <Typography variant='h7' sx={{fontFamily:'poppins',color:'grey'}} >Custom message settings.</Typography>

                        </Box>
                    </Box>
                    <Box flex={1} sx={{border:'1px solid red'}}>
                        Preview section
                    </Box>

                </Stack>
            </container>
        </container>
    )
}
export default Templates;