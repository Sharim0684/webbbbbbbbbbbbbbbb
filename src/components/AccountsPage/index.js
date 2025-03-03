import { Button, container, InputBase, ListItem, Typography,} from "@mui/material";
import { border, borderRadius, Box, Container, height, Stack } from '@mui/system';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import Header from "../Header";
import Modal from '@mui/material/Modal';
import Popover from '@mui/material/Popover';
import './index.css'
import { useState } from "react";


const AccountsPage=()=>{
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);    




    return(
        <container maxWidth="lg" sx={{}} >
            <Header/>
            <Container maxWidth="xl" sx={{border:"",marginTop:'20px'}}>
                <Stack direction='row' spacing={2}>
                    <Box sx={{flex:1,width:'400px',border:'',textAlign:'start',marginRight:'10px',paddingLeft:'20px'}}>
                        <Typography variant="h4" sx={{fontFamily:'poppins',color:'#561f5b',mt:3}}>Platforms</Typography>
                        <Stack spacing={2} mt={6} ml={4}>
                            <Box className="account-pg-sidenav-box" sx={{bgcolor:'aliceblue'}}>
                                <AccountTreeOutlinedIcon sx={{color:"#561f5b",mr:2}}/>
                                <Typography variant="h6" sx={{fontFamily:'poppins',color:'#561f5b'}} >All</Typography>
                            </Box>
                            <Box className="account-pg-sidenav-box">
                                <LinkedInIcon sx={{color:'blue',fontSize:"30px",mr:2}}/>
                            <Typography variant="h6" sx={{fontFamily:'poppins',color:'#561f5b'}} >LinkedIn</Typography>
                            </Box> 
                            <Box className="account-pg-sidenav-box">
                                <FacebookOutlinedIcon sx={{color:'blue',mr:2,fontSize:"30px"}} />
                                <Typography  variant="h6" sx={{fontFamily:'poppins',color:'#561f5b'}} >Facebook</Typography>
                            </Box>
                            <Box className="account-pg-sidenav-box">
                                <XIcon sx={{color:'white',backgroundColor:'black',mr:2,fontSize:"25px"}}/>
                                <Typography variant="h6" sx={{fontFamily:'poppins',color:'#561f5b'}} >X(Twitter)</Typography>
                            </Box>
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
                        <button type="button" onClick={handleOpen} style={{height:'70px',width:'200px',borderRadius:'12px',color:'#561f5b',fontWeight:'500',background:'transparent',border:'2px solid #561f5b'}}>
                            <AddIcon sx={{fontSize:30,marginRight:'10px'}} /> Connect Accounts
                        </button>                        
                        <Modal  open={open}>
                            <Box style={{background:'white',width:'65%',height:'500px',position:'absolute',top:'20%',left:"30%",padding:'10px',borderRadius:'12px'}}>
                                <Stack direction="row" justifyContent='space-between'>
                                    <Typography variant="h5" sx={{color:'#561f5b'}}>Connect Account</Typography>
                                    <Button onClick={handleClose} ><CloseIcon sx={{color:'#561f5b',fontSize:'20px'}}  /></Button>
                                </Stack>
                                <Stack  direction='row' spacing={4} sx={{border:'',pl:5,mt:5}}>
                                    <Paper sx={{width:"250px",height:'',padding:'10px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                        <Stack direction='row' spacing={2} sx={{width:'200px'}} >
                                            <FacebookOutlinedIcon sx={{color:'blue',mr:2,fontSize:"30px"}} />
                                            <Typography variant="h6" sx={{fontFamily:'poppins',color:'#561f5b'}} >Facebook</Typography>
                                        </Stack>
                                        <Button variant="contained" sx={{width:'200px',mt:4}} >Connect</Button>
                                    </Paper>
                                    <Paper sx={{width:"250px",height:'',padding:'10px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}} >
                                        <Stack direction='row' spacing={2} sx={{width:'200px'}} >
                                            <LinkedInIcon sx={{color:'blue',mr:2,fontSize:"30px"}} />
                                            <Typography variant="h6" sx={{fontFamily:'poppins',color:'#561f5b'}} >LinkedIn</Typography>
                                        </Stack>
                                        <Button variant="contained" sx={{width:'200px',mt:4}} >Connect</Button>
                                    </Paper>
                                    <Paper sx={{width:"250px",height:'',padding:'10px',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}} >
                                        <Stack direction='row' spacing={2} sx={{width:'200px'}}>
                                            <XIcon sx={{color:'blue',mr:2,fontSize:"30px"}} />
                                            <Typography variant="h6" sx={{fontFamily:'poppins',color:'#561f5b'}} >X(Twitter)</Typography>
                                        </Stack>
                                        <Button variant="contained" sx={{width:'200px',mt:4}} >Connect</Button>
                                    </Paper>
                                    
                                </Stack>
                            </Box>

                        </Modal>
                        
                    </Box>
                </Stack>
                
            </Container>

        </container>

    )
}
export default AccountsPage