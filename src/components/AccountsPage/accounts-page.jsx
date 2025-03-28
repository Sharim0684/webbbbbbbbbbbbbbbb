import React, { useEffect, useState,} from "react";
import {  useParams, useSearchParams } from "react-router-dom";
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
import TwitterLogo from '../Assets/twitter.jpg'
import Cookies from 'js-cookie'

const socialPlatforms = [
  { name: "Facebook", logo:FacebookLogo },
  { name: "LinkedIn", logo:LinkedInLogo },
  { name: "Instagram", logo:InstragramLogo },
  { name: "Twitter", logo:TwitterLogo},

];

const AccountsPage = () => {


  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [searchParams] = useSearchParams();

 

  const checkLoginStatus =async () => {
   
    
   
    // Check URL parameters for access_token or error
    // const params = new URLSearchParams(window.location);
    // const code = params.get("code");
    // const error = params.get("error");
    //  console.log(params)

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

   

    let oauthUrl="";
    let tokenUrl="";
    if(platform.name==='Facebook'){
      oauthUrl="https://www.facebook.com/v18.0/dialog/oauth"
                  + "?response_type=code"
                  + "&client_id=629561893196546"
                  + "&redirect_uri=https://127.0.0.1:8000/accounts/facebook/callback/"
                  + "&scope=email,public_profile";

      tokenUrl = "https://graph.facebook.com/v18.0/oauth/access_token"

    }
    else if(platform.name==="LinkedIn"){
      oauthUrl="https://www.linkedin.com/oauth/v2/authorization"
                  + "?response_type=code"
                  + "&client_id=86embapip2hnsy"
                  + "&redirect_uri=http://127.0.0.1:8000/api/linkedin_auth/callback/"
                  + "&scope=openid%20profile%20w_member_social%20email";  
      tokenUrl="https://www.linkedin.com/oauth/v2/accessToken"
      }
    else if(platform.name==='Instagram'){
      oauthUrl="https://api.instagram.com/oauth/authorize"
                  + "?response_type=code"
                  + "&client_id=10091952917526567"
                  + "&redirect_uri=https://127.0.0.1:8000/accounts/instagram/callback/"
                  + "&scope=public_profile";

      tokenUrl="https://api.instagram.com/oauth/access_token"
    }
    else if(platform.name==='Twitter'){
      oauthUrl="https://twitter.com/i/oauth2/authorize"
                  + "?response_type=code"
                  + "&client_id=RU5qckV3eER2OTlEMU5wV0l2VmQ6MTpjaQ"
                  + "&redirect_uri=https://127.0.0.1:8000/accounts/twitter/callback/"
                  + "&scope=tweet.read users.read follows.read";
      tokenUrl="https://api.twitter.com/2/oauth2/token"
    }   

   
  // with appId provide //////



  //  const clientId = "770hhbho9r3su0";  
  // const redirectUri = "http://127.0.0.1:8000/linkedin/callback/";
  //  const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86embapip2hnsy&redirect_uri=${encodeURIComponent("redirectUri")}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  // const loginUrl="http://127.0.0.1:8000/linkedin/login/"

  //  const linkedInAuthURL = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78jeca4u9j43ag&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Flinkedin%2Fcallback%2F&scope=openid+profile+w_member_social+email"
  // const instaUrl = "https://api.instagram.com/oauth/authorize"
  // + "?response_type=code"
  // + "&client_id=10091952917526567"
  // + "&redirect_uri=https://127.0.0.1:8000/accounts/instagram/callback/"
  // +"&scope=public_profile";
  

  // &scope=r_liteprofile%20r_emailaddress
  // + "&scope=openid,profile,w_member_social,email";

    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup=window.open(
      oauthUrl,
      "LoginPopup",
      `height=${height},width=${width},top=${top},left=${left}`
    );
    // const popup=window.open(loginUrl, "_self");

   
    const checkPopup = setInterval(() => {
     
      if (!popup || popup.closed) {
          clearInterval(checkPopup);
          return;
      }
      try {
          const popupUrl = popup.location.href;
          console.log(popupUrl)
          if (popupUrl.includes("code=")) {
              const authCode = new URL(popupUrl).searchParams.get("code");
              popup.close();
              clearInterval(checkPopup);
              exchangeCodeForToken(authCode,tokenUrl);
          }
          // if(popup.location.origin==="http://127.0.0.1:8000"){
          //   console.log(true)
          // }
          
      } catch (error) {
          console.log("Waiting for login...");
      }
  }, 1000);



    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? [...prev]  : [...prev, platform],
      Cookies.set('userPlatforms', JSON.stringify(selectedPlatforms),{expires:30})
    );
   
   
  };
  // prev.filter((p) => p !== platform)
  // http://127.0.0.1:8000/linkedin/callback/
  // http://127.0.0.1:8000/linkedin/get-access-token/
  const exchangeCodeForToken = async (code,tokenUrl) => {
    try {
        const response = await fetch({tokenUrl}, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });
        const data = await response.json();
        console.log(data)
        if (data.access_token) {
            setAccessToken(data.access_token);
            console.log("Access Token:", data.access_token);
        } else {
            console.error("Failed to get access token", data);
        }
    } catch (error) {
        console.error("Error exchanging code for token:", error);
    }
};

//sharim given code///
// function getCookie(name) {
//   let cookies = document.cookie.split(';');
//   for (let i = 0; i < cookies.length; i++) {
//       let cookie = cookies[i].trim();
//       if (cookie.startsWith(name + '=')) {
//           return cookie.substring(name.length + 1);
//       }
//   }
//   return null;
// }

// // Access token fetch karein
// let token = getCookie('access_token');

// console.log("Access Token from Cookies:", token);



  // Handle platform deletion
  const deleteItem = (name) => {
    const filteredList = selectedPlatforms.filter(
      (platform) => name !== platform.name
    );
    setSelectedPlatforms(filteredList);
    Cookies.set('userPlatforms',JSON.stringify(filteredList),{expires:30})
   
  };

  // useEffect(()=>{
  //   const getAccessToken=async()=>{
  //     const url="/get-access-token/"
  //   const options={
  //     method:'GET'
  //   }
  //   const response=await fetch(url,options)
  //   const data=await response.json()
  //   console.log(data)
  //   }

  //   getAccessToken()
  // },)

 



 
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
  //   const code=Cookies.get('linkedin_access_token')
  //   const accessToken=JSON.parse(code)   
  //   console.log(accessToken)
   

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
// const REDIRECT_URI = "http://localhost:3000/add-accounts"; // Must match LinkedIn App settings
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
