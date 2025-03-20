import React, { useEffect, useState,} from "react";
import { useSearchParams } from "react-router-dom";
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
  // const[searchParms]=useSearchParams()

 

  const checkLoginStatus = () => {

    // const code=searchParms.get("code")
    // Check URL parameters for access_token or error
    // const params = new URLSearchParams(window.location.hash.substring(1));
    const params = new URLSearchParams(window.location);
    const accessToken = params.get("access_token");
    const error = params.get("error");
     console.log(params)

    // if (accessToken) {
    //   console.log("Login Successful! Token:", accessToken);
    // } else if (error) {
    //   console.error("Login Error:", error);
    // } else {
    //   console.warn("Login popup closed without completing authentication.");
    // }
  };

  // Handle platform selection
  const handleSelect =(platform) => {  
   
    //url handling and pop display///

    // const currentURL = window.location.href;
    // const targetURL = `http://localhost:8000/api/facebook-login/ ? redirect=${encodeURIComponent(currentURL)}`;
    // window.location.href = targetURL; 

    // let loginUrl='';
    // if(platform.name==='Facebook'){
    //   loginUrl=""
    // }
    // else if(platform.name==="LinkedIn"){
    //   loginUrl="http://127.0.0.1:8000/linkedin/login/"
    // }
    // else if(platform.name==='Instagram'){
    //   loginUrl=''
    // }
    // else if(platform.name==='Snapchat'){
    //   loginUrl=''
    // }   

  // with appId provide //////

  const clientId = "770hhbho9r3su0";  
  const redirectUri = "http://localhost:3000/linkedin-callback";
  const scope = "r_liteprofile r_emailaddress";
  // const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
   // const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  const loginUrl="http://127.0.0.1:8000/linkedin/login/"
    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup=window.open(
      loginUrl,
      "LoginPopup",
      `height=${height},width=${width},top=${top},left=${left}`
    );
    //  const popup=window.open(linkedInAuthUrl, "_self");
   

    const checkPopupClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkPopupClosed);
        checkLoginStatus()
      }
    }, 1000);

    // setSelectedPlatforms((prev) =>
    //   prev.includes(platform) ? [...prev]  : [...prev, platform],
    //   Cookies.set('userPlatforms', JSON.stringify(selectedPlatforms),{expires:30})
    // );
   
   
  };
  // prev.filter((p) => p !== platform)



  // Handle platform deletion
  const deleteItem = (name) => {
    const filteredList = selectedPlatforms.filter(
      (platform) => name !== platform.name
    );
    setSelectedPlatforms(filteredList);
    Cookies.set('userPlatforms',JSON.stringify(filteredList),{expires:30})
   
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

// import React, { useState, useEffect } from "react";
// import { Button, Typography } from "@mui/material";
// import axios from "axios";

// const CLIENT_ID = "770hhbho9r3su0"; // Replace with your LinkedIn Client ID
// const REDIRECT_URI = "http://127.0.0.1:8000/linkedin/callback/"; // Must match LinkedIn App settings
// const STATE = "web-app"; // A random string for security

// const AccountsPage = () => {
//   const [accessToken, setAccessToken] = useState(null);
//   const [error, setError] = useState(null);

//   const handleLogin = () => {
//     const linkedInAuthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
//       REDIRECT_URI
//     )}&state=${STATE}&scope=r_liteprofile%20r_emailaddress`;

//     window.open(linkedInAuthURL, "_self"); // Opens LinkedIn login in the same tab
//   };

//   const fetchAccessToken = async (authCode) => {
//     try {
//       const response = await axios.post(
//         "https://www.linkedin.com/oauth/v2/accessToken",
//         new URLSearchParams({
//           grant_type: "authorization_code",
//           code: authCode,
//           redirect_uri: REDIRECT_URI,
//           client_id: CLIENT_ID,
//           client_secret: "YOUR_LINKEDIN_CLIENT_SECRET", // Replace with your LinkedIn Client Secret
//         }),
//         {
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         }
//       );

//       setAccessToken(response.data.access_token);
//       setError(null);
//     } catch (err) {
//       setError("Failed to get access token. Please try again.");
//     }
//   };

//   // Check for auth code in URL after LinkedIn redirects
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");
//     const error = urlParams.get("error");
//     console.log(code)

//     if (code) {
//       fetchAccessToken(code);
//     } else if (error) {
//       setError("LinkedIn login failed.");
//     }
//   }, []);

//   return (
//     <div style={{ textAlign: "center", marginTop: "20px" }}>
//       <Button variant="contained" color="primary" onClick={handleLogin}>
//         Login with LinkedIn
//       </Button>

//       {accessToken && (
//         <Typography sx={{ marginTop: "20px", color: "green" }}>
//           ✅ Access Token: {accessToken}
//         </Typography>
//       )}

//       {error && (
//         <Typography sx={{ marginTop: "20px", color: "red" }}>
//           ❌ Error: {error}
//         </Typography>
//       )}
//     </div>
//   );
// };

// export default AccountsPage;
