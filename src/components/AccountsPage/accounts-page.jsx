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

  // Handle platform selection
  const handleSelect =async(platform) => {  
    const url="http://localhost:8000/api/facebook-login/"
    const options={
      method:'POST',
      headers:{
       "Content-Type":"application/json",
        Accept:"application/json",
        Authorization:'EAAXnjIV6x4YBOxJ7sjxD8OVEmgtxFJHfHJHFZBX1QbICmpMFoWZAHzzF42K4JsdYqlpZBUtrH8W2qrtomlGfTZAEQvLkc21bZBgBBW3IxscV2rlVEFx6NuAypGNBQgo7ixm8VOZA1hAtexL9NAU3RcVWQ90hHhqUYRBRp8504BVZAZC5ryQHm0MQXB9xVl6S8miDl6imbUIrZAhLSpyCZCd5vUFEKxFmqDcc4xvVLfuoZBqeZADt0xbRbzfVxH259pVYuaC3l1ZAudAZDZD'
      }
    }
    // const response=await fetch(url,options)
    // const responseData=await response.json()
    // console.log(responseData)
    try {
      const response = await fetch(url, options);
      if (response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const responseData = await response.json();
      console.log(responseData);
  } catch (error) {
      console.error("Fetch Error:", error.message);
  }

    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? [...prev]  : [...prev, platform]
    );
    
    Cookies.set('userPlatforms',JSON.stringify(selectedPlatforms),{expires:30})
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

  const responseFacebook = (response) => {
    if (!response.accessToken) {
      setError("Facebook login failed. Please try again.");
    } else {
      setUser(response);
      setError(null); // Clear error if login is successful
      window.location.reload(); // Reload to stay on the same page
    }
  };

  useEffect(()=>{
    const values=Cookies.get('userPlatforms')
    // const formatedData=JSON.parse(values)
    // setSelectedPlatforms(formatedData)
    // console.log(formatedData)

  },[])

  

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
                         <FacebookLogin
                          appId="960126086189816"
                          id="facebook"
                          style={{display:''}}
                          callback={responseFacebook}
                        /> 
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