import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Tabs,
    Tab,
    Container,
} from "@mui/material";

import Header from "../Header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";  // Importing useNavigate

const SetupSchedulePage = () => {
    const [tabValue, setTabValue] = useState(0); // For tabs
    const [title, setTitle] = useState("Untitled schedule");
    const [startDate, setStartDate] = useState(new Date());
    const [postInterval, setPostInterval] = useState(1);
    const [orderPostsBy, setOrderPostsBy] = useState("latest_to_old");
    const [sleepTimer, setSleepTimer] = useState({ start: "", end: "" });
    const [sleepDays, setSleepDays] = useState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
    });
    const [selectedSleepDays, setSelectedSleepDays] = useState([]);

    const navigate = useNavigate();  // useNavigate hook for routing

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSleepDayChange = (day) => (event) => {
        setSleepDays({ ...sleepDays, [day]: event.target.checked });
        if (event.target.checked) {
            setSelectedSleepDays([...selectedSleepDays, day]);
        } else {
            setSelectedSleepDays(selectedSleepDays.filter((d) => d !== day));
        }
    };

    const handleCreateSchedule = () => {
        console.log("Schedule Created:", {
            title,
            startDate,
            postInterval,
            orderPostsBy,
            sleepTimer,
            sleepDays,
        });
        navigate("/schedule");  // Navigate to Schedule page
    };

    const handleCancel = () => {
        navigate("/");  // Navigate to Home page
    };

    return (
        <container maxWidth="lg" sx={{}} >
            <Header/>
            <Container style={{ backgroundColor: 'white', padding:'20px', borderRadius: '8px',marginTop:'5px' }}>
        <Box
            sx={{
                padding: 0,
                backgroundColor: "white",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    width: "50%",
                    backgroundColor: "white",
                    padding: 0,
                    borderRadius: 0,
                    boxShadow: 0,
                }}
            >
                <Typography variant="h4" sx={{ color: "#561f5b", mb: 3, textAlign: "center" }}>
                    Create Schedule
                </Typography>

                {/* Tabs */}
                <Typography variant="h5" sx={{ color: "#561f5b", mb: 3, textAlign: "left" }}>
                    Settings
                </Typography>

                {/* Settings Tab Content */}
                {tabValue === 0 && (
                    <Box>
                        {/* Title */}
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            sx={{ mb: 3 }}
                        />

                        {/* Start Date & Time */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, mb: 3 }}>
                            {/* Start Date & Time */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Start Date & Time"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} sx={{ width: "48%" }} />
                                    )}
                                />
                            </LocalizationProvider>

                            {/* Post Interval */}
                            <FormControl sx={{ width: "48%" }}>
                                <InputLabel>Post Interval</InputLabel>
                                <Select
                                    value={postInterval}
                                    onChange={(e) => setPostInterval(e.target.value)}
                                    label="Post Interval"
                                >
                                    <MenuItem value={1}>Minute</MenuItem>
                                    <MenuItem value={60}>Hour</MenuItem>
                                    <MenuItem value={1440}>Day</MenuItem>
                                    <MenuItem value={10080}>Week</MenuItem>
                                    <MenuItem value={43200}>Month</MenuItem>
                                    <MenuItem value={525600}>Year</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Order Posts By */}
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Order Posts By</InputLabel>
                            <Select
                                value={orderPostsBy}
                                onChange={(e) => setOrderPostsBy(e.target.value)}
                                label="Order Posts By"
                            >
                                <MenuItem value="latest_to_old">Start from the latest to old posts</MenuItem>
                                <MenuItem value="old_to_latest">Start from the oldest to new posts</MenuItem>
                                <MenuItem value="random">Randomly</MenuItem>
                                <MenuItem value="random_no_duplicates">Randomly without duplicates</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Sleep Timer */}
                        <Box sx={{ mb: 3, display: "flex", flexDirection: "column", maxWidth: "70%" }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Set a Sleep Timer
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <TextField
                                    label="Start Time"
                                    type="time"
                                    value={sleepTimer.start}
                                    onChange={(e) =>
                                        setSleepTimer({ ...sleepTimer, start: e.target.value })
                                    }
                                    sx={{ mr: 2, flexGrow: 1 }}
                                    InputLabelProps={{
                                        style: { textAlign: "center", width: "100%" }
                                    }}
                                />
                                <TextField
                                    label="End Time"
                                    type="time"
                                    value={sleepTimer.end}
                                    onChange={(e) =>
                                        setSleepTimer({ ...sleepTimer, end: e.target.value })
                                    }
                                    sx={{ flexGrow: 1 }}
                                    InputLabelProps={{
                                        style: { textAlign: "center", width: "100%" }
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Sleep Days */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Set Sleep Days
                            </Typography>
                            <Box>
                                {Object.keys(sleepDays).map((day) => (
                                  <FormControlLabel
                                  key={day}
                                  control={
                                      <Checkbox
                                          checked={sleepDays[day]}
                                          onChange={handleSleepDayChange(day)}
                                          sx={{
                                              color: "#561f5b", 
                                              "&.Mui-checked": {
                                                  color: "#561f5b", 
                                              },
                                          }}
                                      />
                                  }
                                  label={day}
                              />
                              
                                ))}
                            </Box>
                            <TextField
                                label="Selected Sleep Days"
                                value={selectedSleepDays.join(", ")}
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled
                            />
                        </Box>

                        {/* Buttons */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleCancel}
                                sx={{
                                    backgroundColor: "#561f5b",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#420f45" },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCreateSchedule}
                                sx={{
                                    backgroundColor: "#561f5b",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#420f45" },
                                }}
                            >
                                Create
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Other Tab Contents */}
                {tabValue === 1 && <Box>Post Filter</Box>}
                {tabValue === 2 && <Box>Accounts & Template</Box>}
            </Box>
        </Box>
        </Container>
          </container>
    );
};

export default SetupSchedulePage;
