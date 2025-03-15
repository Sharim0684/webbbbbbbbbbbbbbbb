import React, { useEffect, useState,} from "react";
import {
  Button,
  InputBase,
  Typography,
  Box,
  Container,
  Stack,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import FacebookLogin from '@greatsumini/react-facebook-login';
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Header from "../Header";
import SidebarListItem from "../SidebarListItem";
import FacebookLogo from '../Assets/facebook.png'
import InstragramLogo from '../Assets/instragram.png'
import LinkedInLogo from '../Assets/linkedin.png'
import SnapchatLogo from '../Assets/sanpchat.png'
import Cookies from 'js-cookie'

const socialPlatforms = [
  { name: "Facebook", logo:FacebookLogo },
  { name: "LinkedIn", logo:LinkedInLogo },
  { name: "Instagram", logo:InstragramLogo },
  { name: "Snapchat", logo:SnapchatLogo},

];

const AccountsPage = () => {


  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const checkLoginStatus = () => {
    // Check URL parameters for access_token or error
   
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");
    const error = params.get("error");
    console.log(params)

    if (accessToken) {
      console.log("Login Successful! Token:", accessToken);
    } else if (error) {
      console.error("Login Error:", error);
    } else {
      console.warn("Login popup closed without completing authentication.");
    }
  };

  // Handle platform selection
  const handleSelect =async(platform) => {  
   
   
    //url handling and pop display///

    // const currentURL = window.location.href;
    // const targetURL = `http://localhost:8000/api/facebook-login/ ? redirect=${encodeURIComponent(currentURL)}`;
    // window.location.href = targetURL; 

    let loginUrl='';
    if(platform.name==='Facebook'){
      loginUrl="http://localhost:8000/api/facebook-login/"
    }
    else if(platform.name==="LinkedIn"){
      loginUrl=''
    }
    else if(platform.name==='Instagram'){
      loginUrl=''
    }
    else if(platform.name==='Snapchat'){
      loginUrl=''
    }   

  // with appId provide //////

  // const appId="9296047703797645"
  // const redirectUrl=window.location.origin
  // const loginUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
  //   redirectUrl
  // )}&response_type=token`;

    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup=window.open(
      loginUrl,
      "LoginPopup",
      `height=${height},width=${width},top=${top},left=${left}`
    );
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? [...prev]  : [...prev, platform],
      // Cookies.set('userPlatforms', JSON.stringify(selectedPlatforms),{expires:30})
    );

    const checkPopupClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopupClosed);
        // window.location.reload(); // Refresh page after login success
        checkLoginStatus()
      }
    }, 1000);
   
   
  };
  // prev.filter((p) => p !== platform)



  // Handle platform deletion
  const deleteItem = (name) => {
    const filteredList = selectedPlatforms.filter(
      (platform) => name !== platform.name
    );
    setSelectedPlatforms(filteredList);
    // Cookies.set('userPlatforms',JSON.stringify(filteredList),{expires:30})
   
  };


 
  useEffect(() => {
    Cookies.set('userPlatforms', JSON.stringify(selectedPlatforms), { expires: 30 });
  }, [selectedPlatforms]);


 
  useEffect(() => {
    const values = Cookies.get('userPlatforms');
    if (values) {
      try {
        setSelectedPlatforms(JSON.parse(values));
      } catch (err) {
        console.error("Error parsing userPlatforms cookie:", err);
      }
    }
  }, []);

  // useEffect(()=>{
  //   const values=Cookies.get('userPlatforms')
  //   const formatedData=JSON.parse(values)   
  //   setSelectedPlatforms(formatedData)
   

  // },[])

  

  return (
    <Box>
      {/* Header */}
      <Box sx={{ width: "100%" }}>
        <Header />
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ marginTop: "10px", padding: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          {/* Connected Platforms Section */}
          <Box
            sx={{
              flex: 1,
              width: { xs: "100%", md: "400px" },
              textAlign: "start",
              paddingLeft: { xs: "10px", md: "20px" },
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontFamily: "poppins", color: "#561f5b", mt: { xs: 4, md: 12 } }}
            >
              Connected Platforms
            </Typography>
            <Stack spacing={2} mt={{ xs: 4, md: 8 }} mr={2}>
              {selectedPlatforms.map((platform) => (
                <SidebarListItem
                  key={platform.name}
                  platform={platform}
                  deleteMedia={deleteItem}
                />
              ))}
            </Stack>
          </Box>

          {/* Search and Social Platforms Section */}
          <Box sx={{ flex: 2, textAlign: "start" }}>
            {/* Search Bar */}
            <Paper
              component="form"
              sx={{
                background: "transparent",
                outline: "none",
                border: "none",
                boxShadow: "none",
                display: "flex",
                mt: 3,
                mb: 3,
                alignItems: "center",
                width: { xs: "100%", sm: "300px" },
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, height: "100%", width: "100%" }}
                placeholder="Search accounts"
                inputProps={{ "aria-label": "search accounts" }}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon sx={{ marginRight: "10px" }} />
              </IconButton>
            </Paper>

            {/* Connect Accounts Button */}
            <Button
              variant="outlined"
              sx={{
                height: "50px",
                width: { xs: "100%", sm: "250px" },
                borderRadius: "12px",
                color: "#561f5b",
                fontWeight: "500",
                background: "transparent",
                border: "2px solid #561f5b",
                "&:hover": { border: "2px solid #561f5b" },
              }}
            >
              <AddIcon sx={{ fontSize: 30, marginRight: "10px" }} /> Connect Accounts
            </Button>

            {/* Social Platforms Grid */}
            <Box sx={{ mt: 5, pl: { xs: 0, md: 5 } }}>
              <Grid container spacing={2}>
                {socialPlatforms.map((platform) => (
                  <Grid item key={platform.name} xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardContent style={{ textAlign: "center" }}>
                        <img src={platform.logo} alt="Logo" style={{height:'40px',width:'40px',borderRadius:'12px',backgroundColor:'transparent'}}/>
                        <Typography sx={{ color: "#561f5b", mt: 1 }}>
                          {platform.name}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#561f5b", mt: 1 }}
                          onClick={()=>handleSelect(platform)} 
                        >
                         
                          {selectedPlatforms.includes(platform)
                            ? "Connected"
                            : "Connect"}
                        </Button>
                         {/* <FacebookLogin
                          appId="960126086189816"
                          id="facebook"
                          style={{display:''}}
                          callback={responseFacebook}
                        />  */}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default AccountsPage;

