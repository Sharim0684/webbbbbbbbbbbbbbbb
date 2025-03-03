import React, { useState, useEffect } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Header from "../Header";
import SidebarListItem from "../SidebarListItem";

const socialPlatforms = [
  { name: "Facebook", icon: <FacebookIcon color="primary" /> },
  { name: "Twitter", icon: <XIcon color="primary" sx={{ fontSize: "20px" }} /> },
  { name: "Instagram", icon: <InstagramIcon color="primary" /> },
  { name: "LinkedIn", icon: <LinkedInIcon color="primary" /> },
];

const AccountsPage = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

 
  const handleSelect = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  
  const deleteItem = (name) => {
    const filteredList = selectedPlatforms.filter(
      (platform) => name !== platform.name
    );
    setSelectedPlatforms(filteredList);
  };

  return (
    <Box>
            <Box sx={{ width: "100%",   }}>
                <Header />
            </Box>
      <Container maxWidth="xl" sx={{ marginTop: "10px" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          
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
              sx={{ fontFamily: "poppins", color: "#561f5b", mt: 12 }}
            >
              Connected Platforms
            </Typography>
            <Stack spacing={2} mt={8} mr={2}>
              {selectedPlatforms.map((platform) => (
                <SidebarListItem
                  key={platform.name}
                  platform={platform}
                  deleteMedia={deleteItem}
                />
              ))}
            </Stack>
          </Box>

         
          <Box sx={{ flex: 2, textAlign: "start" }}>
            
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
              <AddIcon sx={{ fontSize: 30, marginRight: "10px" }} /> Connect
              Accounts
            </Button>

            {/* Social Platforms Grid */}
            <Stack direction="row" spacing={4} sx={{ pl: 5, mt: 5 }}>
              <Grid container spacing={2}>
                {socialPlatforms.map((platform) => (
                  <Grid item key={platform.name} xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardContent style={{ textAlign: "center" }}>
                        {platform.icon}
                        <Typography sx={{ color: "#561f5b", mt: 1 }}>
                          {platform.name}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#561f5b", mt: 1 }}
                          onClick={() => handleSelect(platform)}
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
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default AccountsPage;