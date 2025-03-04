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
    Grid,
    useMediaQuery,
    useTheme,
    Menu,
    IconButton,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event"; 
import Header from "../Header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";

const SetupSchedulePage = () => {
    const [tabValue, setTabValue] = useState(0);
    const [title, setTitle] = useState("");
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
    const [anchorEl, setAnchorEl] = useState(null); 
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleSleepDayChange = (day) => (event) => {
        const updatedSleepDays = { ...sleepDays, [day]: event.target.checked };
        setSleepDays(updatedSleepDays);

        if (event.target.checked) {
            setSelectedSleepDays([...selectedSleepDays, day]);
        } else {
            setSelectedSleepDays(selectedSleepDays.filter((d) => d !== day));
        }
    };

    const handleCreateSchedule = () => {
        const newErrors = {};

        if (!title) {
            newErrors.title = "Title is required";
        }
        if (!startDate) {
            newErrors.startDate = "Start date is required";
        }
        if (!postInterval) {
            newErrors.postInterval = "Post interval is required";
        }
        if (selectedSleepDays.length === 0) {
            newErrors.sleepDays = "At least one sleep day is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const scheduleData = {
            id: Date.now(), 
            title,
            date: startDate.toISOString().split("T")[0], 
            platforms: ["Facebook", "Twitter"], 
            status: "not posted", 
        };

        navigate("/history", { state: { newSchedule: scheduleData } });
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <Box>
            <Box sx={{ width: "100%" }}>
                <Header />
            </Box>
            <Container
                style={{
                    backgroundColor: "white",
                    padding: isMobile ? "10px" : "20px",
                    borderRadius: "8px",
                    marginTop: "5px",
                }}
            >
                <Box
                    sx={{
                        padding: 0,
                        backgroundColor: "white",
                        minHeight: "auto",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: isMobile ? "100%" : "50%",
                            backgroundColor: "white",
                            padding: 0,
                            borderRadius: 0,
                            boxShadow: 0,
                        }}
                    >
                        <Typography variant="h4" sx={{ color: "#561f5b", mb: 3, textAlign: "center" }}>
                            Create Schedule
                        </Typography>

                        {tabValue === 0 && (
                            <Box>
                                <TextField
                                    label="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                    sx={{
                                        mb: 3,
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#561f5b",
                                            },
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#561f5b",
                                        },
                                    }}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                />

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                label="Start Date & Time"
                                                value={startDate}
                                                onChange={(newValue) => setStartDate(newValue)}
                                                renderInput={(params) => (
                                                    <TextField 
                                                        {...params} 
                                                        fullWidth 
                                                        error={!!errors.startDate}
                                                        helperText={errors.startDate}
                                                        sx={{
                                                            "& .MuiPickersDay-daySelected": {
                                                                backgroundColor: "red",
                                                                color: "white",
                                                            },
                                                            "& .MuiPickersDay-today": {
                                                                backgroundColor: "orange",
                                                                color: "white",
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Post Interval</InputLabel>
                                            <Select
                                                value={postInterval}
                                                onChange={(e) => setPostInterval(e.target.value)}
                                                label="Post Interval"
                                                error={!!errors.postInterval}
                                            >
                                                <MenuItem value={1}>Minute</MenuItem>
                                                <MenuItem value={60}>Hour</MenuItem>
                                                <MenuItem value={1440}>Day</MenuItem>
                                                <MenuItem value={10080}>Week</MenuItem>
                                                <MenuItem value={43200}>Month</MenuItem>
                                                <MenuItem value={525600}>Year</MenuItem>
                                            </Select>
                                            {errors.postInterval && (
                                                <Typography color="error" variant="body2">
                                                    {errors.postInterval}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Set Sleep Days
                                    </Typography>
                                    <TextField
                                        label="Selected Sleep Days"
                                        value={selectedSleepDays.join(", ")}
                                        fullWidth
                                        sx={{ mt: 0 }}
                                        disabled
                                        error={!!errors.sleepDays}
                                        helperText={errors.sleepDays}
                                        InputProps={{
                                            endAdornment: (
                                                <IconButton onClick={handleOpenMenu}>
                                                    <EventIcon />
                                                </IconButton>
                                            ),
                                        }}
                                    />
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleCloseMenu}
                                    >
                                        {Object.keys(sleepDays).map((day) => (
                                            <MenuItem key={day}>
                                                <FormControlLabel
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
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
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
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default SetupSchedulePage;