import React, { useEffect, useState } from "react";
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
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Header from "../Header";
import SidebarListItem from "../SidebarListItem";
import FacebookLogo from "../Assets/facebook.png";
import InstragramLogo from "../Assets/instragram.png";
import LinkedInLogo from "../Assets/linkedin.png";
import TwitterLogo from "../Assets/twitter.jpg";
import Cookies from "js-cookie";

const socialPlatforms = [
  { name: "Facebook", logo: FacebookLogo },
  { name: "LinkedIn", logo: LinkedInLogo },
  { name: "Instagram", logo: InstragramLogo },
  { name: "Twitter", logo: TwitterLogo },
];

const AccountsPage = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== "http://localhost:3000") return;
      const { code } = event.data;
      console.log(code);
      if (code) {
        try {
          const response = await fetch(
            "https://graph.facebook.com/v18.0/oauth/access_token",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(code),
            }
          );

          const data = await response.json();
          console.log(data);
          console.log("facebook access token:", data.access_token);
        } catch (err) {
          console.error("Error exchanging code:", err);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleSelect = (platform) => {
    const width = 600;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    let oauthUrl = "";
    let loginUrl = "";

    if (platform.name === "Facebook") {
      setSelectedPlatforms((prev) => {
        const newPlatforms = prev.some((p) => p.name === platform.name)
          ? prev
          : [...prev, platform];
        Cookies.set("userPlatforms", JSON.stringify(newPlatforms), {
          expires: 30,
        });
        return newPlatforms;
      });

      // Update OAuth URL to use HTTP for local development
      oauthUrl = "https://www.facebook.com/v18.0/dialog/oauth"
          + "?response_type=code"
          + "&client_id=10091952917526567"
          + "&redirect_uri=" + encodeURIComponent("http://localhost:3000/facebook-callback")
          + "&scope=" + encodeURIComponent("email,public_profile,pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata");

      const popup = window.open(
        oauthUrl,
        "LoginPopup",
        `height=${height},width=${width},top=${top},left=${left}`
      );

      if (popup) {
        const pollTimer = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(pollTimer);
              return;
            }

            const currentUrl = popup.location.href;
            if (currentUrl.includes("facebook-callback")) {
              clearInterval(pollTimer);
              const urlParams = new URLSearchParams(
                new URL(currentUrl).search
              );
              const code = urlParams.get("code");
              const error = urlParams.get("error");

              if (error) {
                console.error("Facebook OAuth error:", error);
                setSelectedPlatforms((prev) =>
                  prev.filter((p) => p.name !== platform.name)
                );
                alert("Failed to connect to Facebook. Please try again.");
                popup.close();
                return;
              }

              if (code) {
                fetch("http://localhost:8000/accounts/facebook/token-exchange/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    code,
                    redirect_uri: "http://localhost:3000/facebook-callback",
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.access_token) {
                      console.log("Facebook access token:", data.access_token);
                      setAccessToken(data.access_token);
                      Cookies.set("facebook_access_token", data.access_token, {
                        expires: 30,
                      });
                      // Show success message in the main window
                      alert("Successfully connected to Facebook!");
                    }
                  })
                  .catch((err) => {
                    console.error("Error exchanging Facebook code:", err);
                    setSelectedPlatforms((prev) =>
                      prev.filter((p) => p.name !== platform.name)
                    );
                    // Show error message in the main window
                    alert("Failed to connect to Facebook. Please try again.");
                  })
                  .finally(() => {
                    popup.close();
                  });
              }
            }
          } catch (error) {
            // Ignore cross-origin errors until redirect happens
          }
        }, 500);

        window.addEventListener("unload", () => {
          clearInterval(pollTimer);
          if (!popup.closed) popup.close();
        });
      }
      return;
    } else if (platform.name === "LinkedIn") {
      oauthUrl =
        "https://www.linkedin.com/oauth/v2/authorization" +
        "?response_type=code" +
        "&client_id=86e36wve52muat" +
        "&redirect_uri=" +
        encodeURIComponent("http://localhost:3000/linkedin-callback") +
        "&scope=" +
        encodeURIComponent("openid profile w_member_social email");

      const popup = window.open(
        oauthUrl,
        "LoginPopup",
        `height=${height},width=${width},top=${top},left=${left}`
      );

      if (popup) {
        setSelectedPlatforms((prev) => {
          if (!prev.some((p) => p.name === platform.name)) {
            const newPlatforms = [...prev, platform];
            Cookies.set("userPlatforms", JSON.stringify(newPlatforms), {
              expires: 30,
            });
            return newPlatforms;
          }
          return prev;
        });

        const pollTimer = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(pollTimer);
              return;
            }

            const currentUrl = popup.location.href;
            if (currentUrl.includes("linkedin-callback")) {
              clearInterval(pollTimer);
              const urlParams = new URLSearchParams(
                new URL(currentUrl).search
              );
              const code = urlParams.get("code");

              if (code) {
                fetch("http://localhost:8000/accounts/linkedin/token-exchange/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    code,
                    redirect_uri: "http://localhost:3000/linkedin-callback",
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.access_token) {
                      console.log("LinkedIn access token:", data.access_token);
                      setAccessToken(data.access_token);
                    }
                  })
                  .catch((err) => {
                    console.error("Error exchanging LinkedIn code:", err);
                    setSelectedPlatforms((prev) =>
                      prev.filter((p) => p.name !== platform.name)
                    );
                  })
                  .finally(() => {
                    popup.close();
                  });
              }
            }
          } catch (error) {}
        }, 500);

        window.addEventListener("unload", () => {
          clearInterval(pollTimer);
          if (!popup.closed) popup.close();
        });
      }
      return;
    } else if (platform.name === "Instagram") {
      oauthUrl =
        "https://api.instagram.com/oauth/authorize" +
        "?response_type=code" +
        "&client_id=10091952917526567" +
        "&redirect_uri=https://127.0.0.1:8000/accounts/instagram/callback/" +
        "&scope=public_profile";
      loginUrl = "http://127.0.0.1:8000/accounts/instagram/login/";
    } else if (platform.name === "Twitter") {
      loginUrl = "http://127.0.0.1:8000/accounts/twitter/login/";
    }

    const popup = window.open(
      oauthUrl,
      "LoginPopup",
      `height=${height},width=${width},top=${top},left=${left}`
    );

    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? [...prev] : [...prev, platform]
    );
    Cookies.set("userPlatforms", JSON.stringify(selectedPlatforms), {
      expires: 30,
    });
  };

  const deleteItem = (name) => {
    const filteredList = selectedPlatforms.filter(
      (platform) => name !== platform.name
    );
    setSelectedPlatforms(filteredList);
    Cookies.set("userPlatforms", JSON.stringify(filteredList), { expires: 30 });
  };

  const createFacebookPost = async (content) => {
    const token = Cookies.get("facebook_access_token");
    if (!token) {
      alert("Please connect to Facebook first");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/accounts/facebook/create-post/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: content,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        console.log("Post created successfully:", data);
        alert("Post created successfully!");
        setPostContent("");
      } else {
        throw new Error(data.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post: " + error.message);
    }
  };

  useEffect(() => {
    Cookies.set("userPlatforms", JSON.stringify(selectedPlatforms), {
      expires: 30,
    });
  }, [selectedPlatforms]);

  useEffect(() => {
    const values = Cookies.get("userPlatforms");
    if (values) {
      try {
        setSelectedPlatforms(JSON.parse(values));
      } catch (err) {
        console.error("Error parsing userPlatforms cookie:", err);
      }
    }
  }, []);

  return (
    <Box>
      <Box sx={{ width: "100%" }}>
        <Header />
      </Box>

      <Container maxWidth="xl" sx={{ marginTop: "10px", padding: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box
            sx={{
              flex: 1,
              width: { xs: "100%", md: "400px" },
              textAlign: "start",
              paddingLeft: { xs: "10px", md: "20px" },
            }}
          >
            <Typography variant="h4" sx={{ fontFamily: "poppins", color: "#561f5b", mt: { xs: 4, md: 12 } }}>
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

          <Box sx={{ flex: 2, textAlign: "start" }}>
            <Paper
              component="form"
              sx={{
                background: "transparent",
                boxShadow: "none",
                display: "flex",
                mt: 3,
                mb: 3,
                alignItems: "center",
                width: { xs: "100%", sm: "300px" },
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search accounts"
                inputProps={{ "aria-label": "search accounts" }}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon sx={{ marginRight: "10px" }} />
              </IconButton>
            </Paper>

            <Button
              variant="outlined"
              sx={{
                height: "50px",
                width: { xs: "100%", sm: "250px" },
                borderRadius: "12px",
                color: "#561f5b",
                fontWeight: "500",
                border: "2px solid #561f5b",
              }}
            >
              <AddIcon sx={{ fontSize: 30, marginRight: "10px" }} /> Connect Accounts
            </Button>

            <Box sx={{ mt: 5, pl: { xs: 0, md: 5 } }}>
              <Grid container spacing={2}>
                {socialPlatforms.map((platform) => (
                  <Grid item key={platform.name} xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardContent style={{ textAlign: "center" }}>
                        <img
                          src={platform.logo}
                          alt="Logo"
                          style={{ height: "40px", width: "40px", borderRadius: "12px" }}
                        />
                        <Typography sx={{ color: "#561f5b", mt: 1 }}>
                          {platform.name}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "#561f5b", mt: 1 }}
                          onClick={() => handleSelect(platform)}
                          data-platform={platform.name}
                        >
                          {selectedPlatforms.some((p) => p.name === platform.name)
                            ? "Connected"
                            : "Connect"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Facebook Post Box */}
            {selectedPlatforms.some((p) => p.name === "Facebook") && (
              <Box sx={{ mt: 4, p: 2, border: "1px solid #561f5b", borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: "#561f5b", mb: 2 }}>
                  Create Facebook Post
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#561f5b" }}
                  onClick={() => createFacebookPost(postContent)}
                  disabled={!postContent.trim()}
                >
                  Post to Facebook
                </Button>
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default AccountsPage;
