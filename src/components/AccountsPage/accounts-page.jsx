import React, { useEffect, useState,} from "react";
import {  useLocation, useParams, useSearchParams } from "react-router-dom";
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
import { ConstructionOutlined } from "@mui/icons-material";

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
  // const searchParams=useSearchParams()
  // const location=useLocation()

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== 'http://localhost:3000') return;
      const { code } = event.data;
      console.log(code)
      if (code) {
        try {
          const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(code),
          });

          const data = await response.json();
          console.log(data)
          console.log('facebook access token:', data.access_token);
        } catch (err) {
          console.error('Error exchanging code:', err);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
 

  // const checkLoginStatus = () => {
  //   // Check URL parameters for access_token or error
  //   console.log("interval called ")
  //   const params = new URLSearchParams(window.location.hash.substring(1));
  //   console.log(params)
  //   // const accessToken = params.get("access_token");
  //   // const error = params.get("error");

  //   // if (accessToken) {
  //   //   console.log("Login Successful! Token:", accessToken);
  //   // } else if (error) {
  //   //   console.error("Login Error:", error);
  //   // } else {
  //   //   console.warn("Login popup closed without completing authentication.");
  //   // }
  // };

   // Handle platform selection
  // const openInstagramLogin = () => {
  //   const oauthUrl = "https://api.instagram.com/oauth/authorize"
  //     + "?response_type=code"
  //     + "&client_id=10091952917526567"
  //     + "&redirect_uri=https://127.0.0.1:8000/accounts/instagram/callback/"
  //     + "&scope=public_profile";
   
  //     console.log("authurl",oauthUrl)

  //   const width = 600, height = 600;
  //   const left = (window.innerWidth - width) / 2;
  //   const top = (window.innerHeight - height) / 2;
  //  console.log("dimensions",left,top)
  //   const popup = window.open(
  //     oauthUrl,
  //     "LoginPopup",
  //     `height=${height},width=${width},top=${top},left=${left}`
  //   );
  //  console.log("popup")
  //   const interval = setInterval(() => {
  //     try {
  //       console.log("interval try block",popup)
  //       console.log("window locatin",popup.location.href)
  //       console.log("try block location",popup.location.global.location)
  //       // console.log("try block location href",popup.location.href)



  //       if (popup && popup.location) {
  //         console.log("pop checking",popup.location)
  //         // Check if popup URL matches redirect URI
  //         // console.log("pop checking href",popup.location.href)
  //         // console.log("verif popup location",popup.location.href)
  //         const urlParams = new URLSearchParams(popup.location.search);
  //         const authCode = urlParams.get("code");
  //         console.log("code",authCode,urlParams)
  //         if (authCode) {
  //           console.log("Authorization Code:", authCode);
  //           // You can send this code to your backend for token exchange
  //         }
 
  //         // clearInterval(interval);
  //         // popup.close();

  //         if (popup.location.href.startsWith("https://127.0.0.1:8000/accounts/instagram/callback/")) {
  //           console.log("verif popup location",popup.location.href)
  //           const urlParams = new URLSearchParams(popup.location.search);
  //           const authCode = urlParams.get("code");
  //           console.log("code",authCode)
  //           if (authCode) {
  //             console.log("Authorization Code:", authCode);
  //             // You can send this code to your backend for token exchange
  //           }
   
  //           clearInterval(interval);
  //           popup.close();
  //         }
  //       }
  //     } catch (error) {
  //       // Ignore cross-origin errors until redirect happens
  //     }
  //   }, 1000);
  // };



  const handleSelect =(platform) => {  
    let oauthUrl="";
    let loginUrl=""
    // let tokenUrl="";
    if(platform.name==='Facebook'){
      oauthUrl="https://www.facebook.com/v18.0/dialog/oauth"
                  + "?response_type=code"
                  + "&client_id=697730906253832"
                  + "&redirect_uri=http://localhost:3000/facebook-callback"
                  + "&scope=email,public_profile";

      loginUrl="https://127.0.0.1:8000/accounts/facebook/login/"
   

      // tokenUrl = "https://graph.facebook.com/v18.0/oauth/access_token"

    }
    else if(platform.name==="LinkedIn"){
      // oauthUrl="https://www.linkedin.com/oauth/v2/authorization"
      //             + "?response_type=code"
      //             + "&client_id=86embapip2hnsy"
      //             + "&redirect_uri=http://127.0.0.1:8000/api/linkedin_auth/callback/"
      //             + "&scope=openid%20profile%20w_member_social%20email";  
      loginUrl="http://127.0.0.1:8000/api/linkedin_auth/login/"
      // tokenUrl="https://www.linkedin.com/oauth/v2/accessToken"
      }
    else if(platform.name==='Instagram'){
      oauthUrl="https://api.instagram.com/oauth/authorize"
                  + "?response_type=code"
                  + "&client_id=10091952917526567"
                  + "&redirect_uri=https://127.0.0.1:8000/accounts/instagram/callback/"
                  + "&scope=public_profile";
      loginUrl="http://127.0.0.1:8000/accounts/instagram/login/"
      // tokenUrl="https://api.instagram.com/oauth/access_token"
    }
    else if(platform.name==='Twitter'){
      // oauthUrl="https://twitter.com/i/oauth2/authorize"
      //             + "?response_type=code"
      //             + "&client_id=RU5qckV3eER2OTlEMU5wV0l2VmQ6MTpjaQ"
      //             + "&redirect_uri=https://127.0.0.1:8000/accounts/twitter/callback/"
      //             + "&scope=tweet.read users.read follows.read";

      loginUrl="http://127.0.0.1:8000/accounts/twitter/login/"
      // tokenUrl="https://api.twitter.com/2/oauth2/token"
    }    

    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    

    const popup=window.open(
      oauthUrl,
      "LoginPopup",
      `height=${height},width=${width},top=${top},left=${left}`,
      
    );
    // const popup=window.open(loginUrl, "_self");

   

 
    // const checkPopup = setInterval(()=>{
    //     console.log('popup opened')
       
    //     if(!popup || popup.closed){
    //       clearInterval(checkPopup)
    //       return;
    //     }
        
    //     try{
    //       console.log("entered into try block")
    //       const Params = new URLSearchParams(popup);
    //       const code = Params.get("code");
    //        console.log(Params)
    //       // console.log(code)

    //       // const popupUrl=popup.location
    //       // console.log(popupUrl)
       
    //       // if(popupUrl.includes("code=")){
    //       //   console.log("entered into if block")
    //       //   const authCode=new URL(popupUrl).searchParams.get("code");
    //       //   console.log(authCode)
          
    //       //   popup.close()
    //       //   clearInterval(checkPopup)
    //       //   // exchangeCodeForToken(authCode,tokenUrl)
    //       // }
         
    //     }
    //     catch(error){
    //      console.log(error);
    //      }
        
    //   },1000) ;


    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? [...prev]  : [...prev, platform],
      Cookies.set('userPlatforms', JSON.stringify(selectedPlatforms),{expires:30})
    );
  };

 
  

 
  // prev.filter((p) => p !== platform)


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
                          // onClick={()=>{openInstagramLogin()}}
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
