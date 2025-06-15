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
// import FacebookLogin from '@greatsumini/react-facebook-login';
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
// import XIcon from "@mui/icons-material/X";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Header from "../Header";
import SidebarListItem from "../SidebarListItem";
import FacebookLogo from '../Assets/facebook.png'
import InstragramLogo from '../Assets/instragram.png'
import LinkedInLogo from '../Assets/linkedin.png'
import TwitterLogo from '../Assets/twitter.jpg'
import Cookies from 'js-cookie'
// import { ConstructionOutlined } from "@mui/icons-material";

const socialPlatforms = [
  { name: "Facebook", logo:FacebookLogo },
  { name: "LinkedIn", logo:LinkedInLogo },
  { name: "Instagram", logo:InstragramLogo },
  { name: "Twitter", logo:TwitterLogo},

];

const AccountsPage = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]); 
  
  
  const getUrls=(platform)=>{
    switch (platform) {
      case "Facebook":
        return { 
                  tokenUrl : "https://127.0.0.1:8000/accounts/facebook/token-exchange/",
                  redirectUri: "http://localhost:3000/facebook-callback?platform=Facebook"
              }
       
      
      case "LinkedIn":
        return{ 
                tokenUrl: "https://127.0.0.1:8000/accounts/linkedin/token-exchange/",
                redirectUri: "http://localhost:3000/facebook-callback?platform=LinkedIn"
        }
        
      
    case "Instagram":
      return {
              tokenUrl:"https://127.0.0.1:8000/accounts/instagram/token-exchange/",
              redirectUri: "http://localhost:3000/facebook-callback?platform=Instagram"
            }
     
    
      default:
        return {
              tokenUrl:"",
              redirectUri:""
        };
    }
  }

  const getUserInfo=async(platform,accessToken)=>{
    const url=`https://graph.facebook.com/me?access_token=${accessToken}`
    const resp=await fetch(url)
    const data=await resp.json()
    console.log(`${platform}Id:`+ data.id)
    Cookies.set(`${platform}Id`,data.id, {expires:30})

  }
  
  

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== 'http://localhost:3000') return;
      const { code, platform } = event.data;
      console.log(code)
      console.log(platform)
      const urls=getUrls(platform)
      const{tokenUrl,redirectUri}=urls
      console.log("tokenUrl:"+ tokenUrl)
      console.log("redirectUri:"+ redirectUri)
      if (code) {
        try {
          const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        'Accept':'application/json'
             },
            body: JSON.stringify({code,'redirect_uri': redirectUri}),
          }); 
          const data = await response.json();
          console.log("data",data)
          console.log(platform+" accesstoken: ", data.access_token);
          const accessToken=data.access_token;
          if(accessToken){
            console.log(platform+"accessToken: "+accessToken)
            Cookies.set(`${platform}AccessToken`,JSON.stringify(accessToken), {expires:30})
            // getUserInfo(platform,accessToken)

            // localStorage.setItem(`${platform}AccessToken`, accessToken)
          }
        } catch (err) {
          console.error('Error exchanging code:', err);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
 

 

  



  const handleSelect =(platform) => {  
    // const state = Math.random().toString(36).substring(7);

    let oauthUrl="";
    
    if(platform.name==='Facebook'){

      const redirectUri = encodeURIComponent("http://localhost:3000/facebook-callback?platform=Facebook");
      oauthUrl="https://www.facebook.com/v18.0/dialog/oauth"
                  + "?response_type=code"
                  + "&client_id=993041052533877"
                  + `&redirect_uri=${redirectUri}`
                  + "&scope=email,public_profile";

    }
    else if(platform.name==="LinkedIn"){

      const redirectUri = encodeURIComponent("http://localhost:3000/linkedin-callback?platform=LinkedIn");
      oauthUrl="https://www.linkedin.com/oauth/v2/authorization"
                  + "?response_type=code"
                  + "&client_id=86e36wve52muat"
                  + `&redirect_uri=${redirectUri}`
                  + "&scope=openid%20profile%20w_member_social%20email"; 

      }
    else if(platform.name==='Instagram'){
      const scope = encodeURIComponent(
        "instagram_basic,instagram_content_publish,pages_show_list," +
        "pages_read_engagement,pages_manage_posts");
      const redirectUri = encodeURIComponent("http://localhost:3000/facebook-callback?platform=Instagram");
      oauthUrl="https://www.facebook.com/v18.0/dialog/oauth"
                  + "?response_type=code"
                  + "&client_id=694662202930768"
                  + `&redirect_uri=${redirectUri}`
                  + `&scope=${scope}`;
      
    }
    else if(platform.name==='Twitter'){

      oauthUrl="https://twitter.com/i/oauth2/authorize"
                  + "?response_type=code"
                  + "&client_id=RU5qckV3eER2OTlEMU5wV0l2VmQ6MTpjaQ"
                  + "&redirect_uri=https://127.0.0.1:8000/accounts/twitter/callback/"
                  + "&scope=tweet.read users.read follows.read";
    }    

    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;


    window.open(
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
    //       const params = new URLSearchParams(popup.location.search);
    //     const code = params.get('code');
    //        console.log(code)
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

    // const checkPopup = setInterval(() => {
    //   if (!popup || popup.closed) {
    //     clearInterval(checkPopup);
    //     return;
    //   }
 
    //   try {
    //     const currentUrl = popup?.location?.href || '';
    //     console.log(currentUrl)
    //     if (currentUrl.includes('callback')) {
    //       const urlParams = new URLSearchParams(new URL(currentUrl).search);
    //       const code = urlParams.get('code');
    //       console.log(urlParams)
    //       console.log(code)
         
    //       if (code) {
    //         console.log(`${platform.name} Auth Code:`, code);
           
    //         window.postMessage({
    //           code,
    //           platform: platform.name.toLowerCase()
    //         }, window.location.origin);
 
    //         popup.document.body.innerHTML = `
    //           <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial;background:#f0f2f5;">
    //             <div style="text-align:center;padding:30px;background:white;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
    //               <h2 style="color:#561f5b;margin:0;">✅ ${platform.name} Connected Successfully!</h2>
    //               <p style="color:#666;margin-top:10px;">This window will close automatically.</p>
    //             </div>
    //           </div>
    //         `;
 
    //         setTimeout(() => {
    //           popup.close();
    //           clearInterval(checkPopup);
    //         }, 1500);
    //       }
    //     }
    //   } catch (err) {
    //     if (!err.message.includes("cross-origin")) {
    //       console.error("Popup error:", err);
    //     }
    //   }
    // }, 500);



    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? [...prev]  : [...prev, platform],
    );
    
    
  };


 
  

 
  // prev.filter((p) => p !== platform)


//   const exchangeCodeForToken = async (code,tokenUrl) => {
//     try {
//         const response = await fetch({tokenUrl}, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ code }),
//         });
//         const data = await response.json();
//         console.log(data)
//         if (data.access_token) {
//             setAccessToken(data.access_token);
//             console.log("Access Token:", data.access_token);
//         } else {
//             console.error("Failed to get access token", data);
//         }
//     } catch (error) {
//         console.error("Error exchanging code for token:", error);
//     }
// };







  // Handle platform deletion
  
  
const createPost = async (content, image, platforms) => {
  try {
    const formData = new FormData();
    if (image) {
      formData.append('media', image);
    }
    formData.append('content', content);
    formData.append('platforms', JSON.stringify(platforms));

    const response = await fetch('https://127.0.0.1:8000/api/create-post/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

  const deleteItem = (name) => {
    const filteredList = selectedPlatforms.filter(
      (platform) => name !== platform.name
    );
    setSelectedPlatforms(filteredList);
    Cookies.set('userPlatforms',JSON.stringify(filteredList),{expires:30})
    // localStorage.setItem('userPlatforms',filteredList )
   
  };
  

  useEffect(() => {
    Cookies.set('userPlatforms', JSON.stringify(selectedPlatforms), { expires: 30 });
    // localStorage.setItem('userPlatforms', JSON.stringify(selectedPlatforms) )
  },[selectedPlatforms]);


 
  useEffect(() => {
    const values = Cookies.get('userPlatforms');
    if (values) {
      try {
        setSelectedPlatforms(JSON.parse(values));
      } catch (err) {
        console.error("Error parsing userPlatforms cookie:", err);
      }
    }
    // const values=localStorage.getItem('userPlatforms')
    // setSelectedPlatforms(JSON.parse(values))
  },[]);

  
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

