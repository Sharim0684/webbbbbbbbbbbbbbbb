import { Button, InputBase, Typography,} from "@mui/material";
import {Box, Container, Stack } from '@mui/system';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
// import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
// import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
// import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect } from "react";
import Header from "../Header";
import './index.css'
import { useState } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
// import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import {Card, CardContent, Grid, } from "@mui/material";
// import Cookies from 'js-cookie'
import SidebarListItem from "../SidebarListItem";



const socialPlatforms = [
    { name: "Facebook", icon: <FacebookIcon color='primary' /> },
    { name: "Twitter", icon: <XIcon color="primary" sx={{fontSize:'20px'}} /> },
    { name: "Instagram", icon: <InstagramIcon color="primary"/> },
    { name: "LinkedIn", icon: <LinkedInIcon color="primary"/> },
  ];
  

const AccountsPage=()=>{

    const [selectedPlatforms, setSelectedPlatforms] = useState([]);


   

      const handleSelect = (platform) => {        
        setSelectedPlatforms((prev) =>
          prev.includes(platform)
            ? [...prev]
            : [...prev, platform]
        );
        
      };

    //    prev.filter((p) => p !== platform)
    
    useEffect(()=>{     
        // const newArr=localStorage.getItem('selectedPlatformsArr')
        // // const parsedArr=newArr
        // console.log(newArr)
        
    },[])

    const deleteItem=(name)=>{
       const filteredList=selectedPlatforms.filter((platform)=>name !==platform.name)
       setSelectedPlatforms(filteredList)

    }




    return(
        <container maxWidth="lg" sx={{}} >
            <Header/>
            <Container maxWidth="xl" sx={{border:"",marginTop:'20px'}}>
                <Stack direction='row' spacing={2}>
                    <Box sx={{flex:1,width:'400px',border:'',textAlign:'start',marginRight:'10px',paddingLeft:'20px'}}>
                        <Typography variant="h4" sx={{fontFamily:'poppins',color:'#561f5b',mt:12}}>Connected Platforms</Typography>
                        <Stack spacing={2} mt={8} ml={0} mr={2} border={''}>
                            {selectedPlatforms.map((platform)=>(
                               <SidebarListItem key={platform.name} platform={platform} deleteMedia={deleteItem} />
                            ))}
                           
                        </Stack>
                    </Box>

                    <Box sx={{flex:2, border:'', textAlign:'start'}}>
                        <Paper component="form" sx={{ p: '',background:'transparent',outline:'none',border:'none',boxShadow:'none', display: 'flex',mt:3,mb:3, alignItems: 'center', width: 200,}} >     
                            <InputBase 
                                sx={{ ml: 1, flex: 1,height:'100%',width:'100%' }}
                                placeholder="Search accounts"
                                inputProps={{ 'aria-label': 'search accounts' }}                                
                            />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search"> 
                                <SearchIcon  sx={{marginRight:'10px'}} />
                            </IconButton>      
                        </Paper>
                        <Button variant="outline" style={{height:'50px',width:'250px',borderRadius:'12px',color:'#561f5b',fontWeight:'500',background:'transparent',border:'2px solid #561f5b'}}>
                            <AddIcon sx={{fontSize:30,marginRight:'10px'}} /> Connect Accounts
                        </Button>   
                        <Stack  direction='row' spacing={4} sx={{border:'',pl:5,mt:5}}>
                            <Grid container spacing={2}>
                                {socialPlatforms.map((platform) => (
                                    <Grid item key={platform.name} xs={6} sm={3}>
                                    <Card>
                                        <CardContent style={{ textAlign: "center" }}>
                                        {platform.icon}
                                        <Typography sx={{color:'#561f5b',mt:1}}>{platform.name}</Typography>
                                        <Button                                            
                                            variant="contained"
                                            sx={{backgroundColor:"#561f5b",mt:1}}
                                            
                                            onClick={() => handleSelect(platform)}
                                            // disabled={selectedPlatforms.includes(platform)}
                                        >
                                            {selectedPlatforms.includes(platform) ? "Connected" : "Connect"}
                                        </Button>
                                        </CardContent>
                                    </Card>
                                    </Grid>
                                ))}
                            </Grid> 
                        </Stack>
                          
                    </Box>
                </Stack>
                
            </Container>

        </container>

    )
}
export default AccountsPage