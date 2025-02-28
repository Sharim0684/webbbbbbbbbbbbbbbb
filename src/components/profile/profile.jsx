import React, { useState, useEffect } from "react";
import { 
  Box, Avatar, Typography, TextField, Button, Paper, Grid, Container 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
const initialProfile = {
  name: "John Doe",
  email: "johndoe@example.com",
  mobile: "123-456-7890",
  bio: "Web Developer | Tech Enthusiast",
  image: localStorage.getItem("profileImage") || "https://via.placeholder.com/100",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile);
  const [tempProfile, setTempProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  // Save Image to Local Storage
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempProfile((prevProfile) => ({ ...prevProfile, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Changes
  const handleSave = () => {
    setProfile(tempProfile);
    localStorage.setItem("profileData", JSON.stringify(tempProfile));
    localStorage.setItem("profileImage", tempProfile.image);
    setIsEditing(false);
  };

  // Cancel Edit (Restore Old Data)
  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  // Load Profile Data from Local Storage (if exists)
  useEffect(() => {
    const storedData = localStorage.getItem("profileData");
    if (storedData) {
      setProfile(JSON.parse(storedData));
      setTempProfile(JSON.parse(storedData));
    }
  }, []);

  return (
    <container maxWidth="lg" sx={{ padding: 0 }}>
            <Header />
    <Container maxWidth="sm" sx={{ bgcolor: "white", minHeight: "auto", display: "flex", justifyContent: "center", alignItems: "center", p: 5,mt: 1 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "white", boxShadow: "none" }}>
            
            {/* Profile Image & Upload Option */}
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Avatar
                src={tempProfile.image}
                alt="Profile"
                sx={{ width: 100, height: 100, mx: "auto" }}
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                />
              )}
            </Box>

            {/* Profile Info */}
            {isEditing ? (
              <Box>
                <TextField 
                  label="Name" fullWidth 
                  value={tempProfile.name} 
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} 
                  sx={{ mb: 2,"& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#561f5b",
                                            },
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#561f5b",
                                        },}} 
                />
                <TextField 
                  label="Email" fullWidth 
                  value={tempProfile.email} 
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })} 
                  sx={{ mb: 2,"& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                        borderColor: "#561f5b",
                    },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                    color: "#561f5b",
                },}} 
                />
                <TextField 
                  label="Mobile Number" fullWidth 
                  value={tempProfile.mobile} 
                  onChange={(e) => setTempProfile({ ...tempProfile, mobile: e.target.value })} 
                  sx={{ mb: 2,"& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                        borderColor: "#561f5b",
                    },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                    color: "#561f5b",
                },}} 
                />
                <TextField 
                  label="Bio" fullWidth multiline rows={2} 
                  value={tempProfile.bio} 
                  onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })} 
                  sx={{ mb: 2,"& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                        borderColor: "#561f5b",
                    },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                    color: "#561f5b",
                },}} 
                />
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>{profile.name}</Typography>
                <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>{profile.email}</Typography>
                <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>{profile.mobile}</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{profile.bio}</Typography>
              </Box>
            )}

            {/* Action Buttons */}
            {isEditing ? (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={handleSave}
                  sx={{ 
                    py: 1.2, 
                    fontSize: "16px", 
                    backgroundColor: "#561f5b", 
                    color: "white", 
                    "&:hover": { backgroundColor: "#441447" }
                  }}
                >
                  Save
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={handleCancel}
                  sx={{ 
                    py: 1.2, 
                    fontSize: "16px", 
                    backgroundColor: "#888", 
                    color: "white", 
                    "&:hover": { backgroundColor: "#666" }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => setIsEditing(true)}
                  sx={{ 
                    py: 1.2, 
                    fontSize: "16px", 
                    backgroundColor: "#561f5b", 
                    color: "white", 
                    "&:hover": { backgroundColor: "#441447" }
                  }}
                >
                  Edit Profile
                </Button>

                {/* Change Password Button (Always Visible) */}
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate("/set-new-paswd")}
                  sx={{ 
                    py: 1.2, 
                    fontSize: "16px", 
                    backgroundColor: "#561f5b", 
                    color: "white", 
                    "&:hover": { backgroundColor: "#441447" }
                  }}
                >
                  Change Password
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </container>
  );
};

export default ProfilePage;
