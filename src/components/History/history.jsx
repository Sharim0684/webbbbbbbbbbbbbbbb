import React, { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    IconButton,
    Popover,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Header from "../Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const HistoryPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: "Post 1",
            date: "2025-02-26",
            platforms: ["Facebook", "Twitter"],
            status: "posted", 
        },
        {
            id: 2,
            title: "Post 2",
            date: "2025-03-02",
            platforms: ["Instagram"],
            status: "pending",
        },
        {
            id: 3,
            title: "Post 3",
            date: "2025-03-03",
            platforms: ["LinkedIn", "Facebook"],
            status: "pending",
        },
    ]);

    const [selectedPost, setSelectedPost] = useState(null);
    const [editData, setEditData] = useState({ title: "", date: "", platforms: [] });
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const platformsList = ["Facebook", "Twitter", "Instagram", "LinkedIn"];

    const handleOpenPopup = (event, post) => {
        setSelectedPost(post);
        setEditData({ title: post.title, date: post.date, platforms: post.platforms });
        setSelectedPlatforms(post.platforms);
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopup = () => {
        setSelectedPost(null);
        setSelectedPlatforms([]);
        setAnchorEl(null);
    };

    const handleEditChange = (field, value) => {
        setEditData({ ...editData, [field]: value });
    };

    const handlePlatformChange = (platform) => (event) => {
        if (event.target.checked) {
            setSelectedPlatforms([...selectedPlatforms, platform]);
        } else {
            setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
        }
    };

    const handleSaveChanges = () => {
        const updatedPosts = posts.map((post) =>
            post.id === selectedPost.id
                ? { ...post, ...editData, platforms: selectedPlatforms }
                : post
        );
        setPosts(updatedPosts);
        handleClosePopup();
    };

    const handleDeletePost = (postId) => {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
        handleClosePopup();
    };

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null); 
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i).toISOString().split("T")[0]);
        }
        return days;
    };

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <Box>
            <Box sx={{ width: "100%", boxShadow: 2, borderBottom: "2px solid #ccc" }}>
                <Header />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "auto",
                    backgroundColor: "white",
                    p: isSmallScreen ? 2 : 5,
                }}
            >
                <Box sx={{ width: isSmallScreen ? "100%" : "50%", height: "auto", backgroundColor: "white", borderRadius: 0, boxShadow: 0 }}>
                    <Typography variant="h4" sx={{ color: "#561f5b", mb: 4, textAlign: "center" }}>
                        Recent Posts 
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 4 }}>
                        <IconButton onClick={handlePreviousMonth}>
                            <ArrowBackIosIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ mx: 2 }}>
                            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
                        </Typography>
                        <IconButton onClick={handleNextMonth}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>

                    <Grid container spacing={1}>
                        {daysOfWeek.map((day) => (
                            <Grid item xs={12 / 7} key={day}>
                                <Typography variant="body1" sx={{ textAlign: "center", fontWeight: "bold" }}>
                                    {day}
                                </Typography>
                            </Grid>
                        ))}

                        {generateCalendarDays().map((day, index) => {
                            const post = posts.find((p) => p.date === day);
                            const isToday = day === new Date().toISOString().split("T")[0]; // Check if the day is today
                            return (
                                <Grid item xs={12 / 7} key={index}>
                                    <Box
                                        sx={{
                                            border: "1px solid #ccc",
                                            borderRadius: 1,
                                            padding: 1,
                                            backgroundColor: isToday
                                                ? "#561f5b" 
                                                : post
                                                    ? post.status === "pending"
                                                        ? "#c8e6c9"
                                                        : "#e0e0e0"
                                                    : "white",
                                                    color: isToday ? "white" : "black",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            "&:hover": {
                                                backgroundColor: post
                                                    ? post.status === "posted"
                                                        ? "white"
                                                        : "#c8e6c9"
                                                    : "#e0e0e0",
                                            },
                                        }}
                                        onClick={(e) => post && handleOpenPopup(e, post)}
                                    >
                                        <Typography variant="body1" sx={{ textAlign: "center" }}>
                                            {day ? new Date(day).getDate() : ""}
                                        </Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>

                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleClosePopup}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
                    >
                        <Box sx={{ p: 2, width: isSmallScreen ? "80vw" : 300, position: "relative" }}>
                            <IconButton
                                sx={{ position: "absolute", top: 8, right: 8 }}
                                onClick={handleClosePopup}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Typography variant="h6" sx={{ mb: 2 }}>
                                {selectedPost?.title}
                            </Typography>
                            <TextField
                                label="Title"
                                value={editData.title}
                                onChange={(e) => handleEditChange("title", e.target.value)}
                                fullWidth
                                disabled={selectedPost?.status === "posted"}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Date"
                                type="date"
                                value={editData.date}
                                onChange={(e) => handleEditChange("date", e.target.value)}
                                fullWidth
                                disabled={selectedPost?.status === "posted"}
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Platforms:
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                {platformsList.map((platform) => (
                                    <FormControlLabel
                                        key={platform}
                                        control={
                                            <Checkbox
                                                checked={selectedPlatforms.includes(platform)}
                                                onChange={handlePlatformChange(platform)}
                                                sx={{
                                                    color: "#561f5b",
                                                    "&.Mui-checked": {
                                                        color: "#561f5b",
                                                    },
                                                }}
                                                disabled={selectedPost?.status === "posted"}
                                            />
                                        }
                                        label={platform}
                                    />
                                ))}
                            </Box>
                            {selectedPost?.status === "pending" && (
                                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleSaveChanges}
                                        sx={{ backgroundColor: "#561f5b", color: "white" }}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDeletePost(selectedPost.id)}
                                        sx={{ backgroundColor: "#f44336", color: "white" }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Popover>
                </Box>
            </Box>
        </Box>
    );
};

export default HistoryPage;