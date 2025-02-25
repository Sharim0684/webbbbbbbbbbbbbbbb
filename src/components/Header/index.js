import * as React from 'react';
import {Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import BrandLogo from '../Assets/Innovators-Tech-Black 1.svg'



const pages = ['Accounts', 'Auto Post', 'Post Schedules','Share Now','Templates'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (key) => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{bgcolor:'white',}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <Box sx={{width:'200px',border:''}}>
        <img src={BrandLogo} style={{height:"50px"}} className='mb-3'/>          
        </Box>            
         <Box sx={{ flexGrow: 1, display:"flex",justifyContent:'center',alignItems:'flex-end', }}>
            {/* {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 1,mr:2, color: '#561f5b', display: 'block', fontFamily:"Poppins",fontWeight:"600",fontSize:"16px" }}
              >
                {page}
              </Button>
            ))} */}
            <Link style={{textDecoration:'none',}} to="/add-accounts"><Typography variant='hr' sx={{mr:3,color:'#561f5b',fontFamily:'poppins',fontWeight:'600',fontSize:'16px'}}>Accounts</Typography></Link>
            <Typography variant='hr' sx={{mr:3,color:'#561f5b',fontFamily:'poppins',fontWeight:'600',fontSize:'16px'}}>Auto Post</Typography>
            <Typography variant='hr' sx={{mr:3,color:'#561f5b',fontFamily:'poppins',fontWeight:'600',fontSize:'16px'}}>Post Schedules</Typography>
            <Typography variant='hr' sx={{mr:3,color:'#561f5b',fontFamily:'poppins',fontWeight:'600',fontSize:'16px'}}>Share Now</Typography>
            <Typography variant='hr' sx={{mr:3,color:'#561f5b',fontFamily:'poppins',fontWeight:'600',fontSize:'16px'}}>Templates</Typography>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="avarar" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu} ><Typography sx={{ textAlign: 'center' }}>Profile</Typography></MenuItem>
              <MenuItem onClick={handleCloseUserMenu} ><Typography sx={{ textAlign: 'center' }}>Account</Typography></MenuItem>
              <MenuItem onClick={handleCloseUserMenu} ><Typography sx={{ textAlign: 'center' }}>DashBoard</Typography></MenuItem>
              <Link style={{textDecoration:'none'}} to="/login"><MenuItem onClick={handleCloseUserMenu} ><Typography sx={{ textAlign: 'center' }}>Logout</Typography></MenuItem></Link>
              {/* {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))} */}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;