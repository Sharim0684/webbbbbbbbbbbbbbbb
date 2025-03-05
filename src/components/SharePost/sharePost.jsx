import React, { useState, useRef,  } from "react";
import {
    Stack,
    Typography,
    Box,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Container,
    FormGroup,
    Modal,
    IconButton,
    Divider,
    Switch,
} from "@mui/material";
import Header from "../Header";
import { Close } from "@mui/icons-material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from '@mui/icons-material/X';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const CustomQuill = styled("div")({
    "& .ql-editor": {
        minHeight: "150px",
    },
    "&:hover .ql-toolbar, &:hover .ql-container": {
        borderColor: "#561f5b !important",
    },
});

const platforms = [
    { name: "Facebook", icon: <FacebookIcon color='primary' /> },
    { name: "Twitter", icon: <XIcon color="primary" sx={{ fontSize: '20px' }} /> },
    { name: "Instagram", icon: <InstagramIcon color="primary" /> },
    { name: "LinkedIn", icon: <LinkedInIcon color="primary" /> },
];

const SharePostPage = () => {
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [turnOffLikes, setTurnOffLikes] = useState(false);
    const [turnOffComments, setTurnOffComments] = useState(false);
    const [scheduleError, setScheduleError] = useState("");
    const [errors, setErrors] = useState({
        title: "",
        content: "",
        platform: ""
    });
    const [error, setError] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const quillRef = useRef(null);
    const navigate = useNavigate();


   

    const handlePlatformClick = (platform) => {
        setSelectedPlatforms([platform]);
        setError((prev)=>({...prev,content:''}));
    };

    const handleCheckboxClick = (platform) => {
        setSelectedPlatforms((prevSelected) => {
            const newSelected = prevSelected.includes(platform)
                ? prevSelected.filter((p) => p !== platform)
                : [...prevSelected, platform];
            return newSelected;
        });
        setError("");
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedPlatforms([]);
        } else {
            setSelectedPlatforms(platforms.map((p) => p.name));
        }
        setSelectAll(!selectAll);
        setError("");
    };

    const handleCancel = () => {
        setSelectedPlatforms([]);
        setShowCheckboxes(false);
        setSelectAll(false);
    };

    const likesSwitch = (event) => {
        setTurnOffLikes(event.target.checked);
    };

    const commentsSwitch = (event) => {
        setTurnOffComments(event.target.checked);
    };

    const handlePostChange = (content) => {
        setPostContent(content);

        if (selectedPlatforms.length === 0) {
            setErrors((prev) => ({ ...prev, content: "Please select a platform." }));
            return;
        }
       

        const characterLimit = selectedPlatforms.length > 1
            ? 270
            : platforms.find(p => p.name === selectedPlatforms[0])?.limit || 270;

        if (content.length > characterLimit) {
            setErrors((prev) => ({ ...prev, content: `Character limit exceeded! Max allowed: ${characterLimit} characters.` }));
        } else {
            setErrors((prev) => ({ ...prev, content: "" }));
        }
    };

    const handleTitleChange = (event) => {
        setPostTitle(event.target.value);
        setErrors((prev) => ({ ...prev, title: event.target.value.trim() ? "" : "Enter Post Title" }));
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadedFile(file);
        const fileUrl = URL.createObjectURL(file);
        const editor = quillRef.current.getEditor();

        editor.focus();

        const range = editor.getSelection() || { index: editor.getLength(), length: 0 };

        if (file.type.startsWith("image/")) {
            editor.insertEmbed(range.index, "image", fileUrl);
        } else if (file.type.startsWith("video/")) {
            editor.insertEmbed(range.index, "video", fileUrl);
        } else {
            editor.insertText(range.index, `[File: ${file.name}](${fileUrl})`);
        }
    };

    const handlePublish = () => {
        let newErrors = { title: "", content: "", platform: "" };

        if (!postTitle.trim()) newErrors.title = "Enter Post Title";
        if (!postContent.trim()) newErrors.content = "Enter Post Content";
        if (selectedPlatforms.length === 0) newErrors.platform = "Please select at least one platform.";

        setErrors(newErrors);

        if (!newErrors.title && !newErrors.content && !newErrors.platform) {
            setPreviewOpen(true);
        }
    };

    const handleEdit = () => {
        setPreviewOpen(false);
    };

    const handlePost = () => {
    const contentPost=postContent.replaceAll(/<[^>]+>/g,"")
        console.log(postTitle)
        console.log(contentPost)
        console.log(uploadedFile.name)
        console.log(selectedPlatforms)
        console.log(turnOffComments)
        console.log(turnOffLikes)
        // navigate("/thankYouPage");
    };
    
    const handleSetupSchedule = () => {
        let newErrors = { title: "", content: "", platform: "" };

        if (!postTitle.trim()) newErrors.title = "Enter Post Title";
        if (!postContent.trim()) newErrors.content = "Enter Post Content";
        if (selectedPlatforms.length === 0) newErrors.platform = "Please select at least one platform.";

        setErrors(newErrors);

        if (!newErrors.title && !newErrors.content && !newErrors.platform) {
            setScheduleOpen(true);
        }
    };

    const handleSchedule = (date, time) => {
        if (!date || !time) {
            setScheduleError("Please select both date and time.");
            return;
        }

        setScheduleError("");
        setScheduleDate(date);
        setScheduleTime(time);
        // console.log("Post scheduled for:", date, time);
        navigate("/history");
    };

    const handleReminderToggle = (enabled) => {
        setReminderEnabled(enabled);
        console.log("Reminder enabled:", enabled);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
        ],
    };

    return (
        <Box>
      {/* Header */}
      <Box sx={{ width: "100%" }}>
        <Header />
      </Box>

            <Container maxWidth="xl" sx={{ border: "", marginTop: 5 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        minHeight: "auto",
                        padding: 0,
                        backgroundColor: "white",
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: "100%", md: "30%" },
                            padding: { xs: 2, md: 5 },
                            mt: 0,
                            borderRadius: 2,
                            backgroundColor: "white",
                        }}
                    >
                        <Stack direction={{ xs: "column", md: "row" }} spacing={10}>
                            <Box sx={{ width: { xs: "100%", md: "40%" }, gap: 2, mt: 3 }}>
                                <Typography variant="h4" sx={{ color: "#561f5b", textAlign: "left" }}>
                                    Select Platforms
                                </Typography>
                                {!showCheckboxes && (
                                    <Button
                                        variant="contained"
                                        onClick={() => setShowCheckboxes(true)}
                                        sx={{ marginLeft: 5, mt: 3, backgroundColor: "#561f5b", color: "white", "&:hover": { backgroundColor: "#420f45" } }}
                                    >
                                        Select
                                    </Button>
                                )}
                                {showCheckboxes && (
                                    <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                                        <Button variant="contained" onClick={handleSelectAll} sx={{ backgroundColor: "#561f5b", color: "white", "&:hover": { backgroundColor: "#420f45" } }}>
                                            {selectAll ? "Unselect" : "All"}
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={handleCancel} sx={{ backgroundColor: "#561f5b", color: "white", "&:hover": { backgroundColor: "#420f45" } }}>
                                            Cancel
                                        </Button>
                                    </Stack>
                                )}
                                <FormGroup sx={{ marginTop: 3, gap: 2, border: '' }}>
                                    {platforms.map(({ name, icon }) => (
                                        <Stack key={name} direction="row" alignItems="center" spacing={2}>
                                            {showCheckboxes && (
                                                <Checkbox
                                                    checked={selectedPlatforms.includes(name)}
                                                    onChange={() => handleCheckboxClick(name)}
                                                    sx={{
                                                        color: "#561f5b",
                                                        "&.Mui-checked": { color: "#561f5b" }
                                                    }}
                                                />
                                            )}
                                            <Button
                                                onClick={() => handlePlatformClick(name)}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-start",
                                                    color: selectedPlatforms.includes(name) ? "#561f5b" : "561f5b",
                                                    "&:hover": { backgroundColor: "#561f5b", color: "white" },
                                                    textTransform: "none",
                                                    width: "50%",
                                                }}
                                            >
                                                <Stack direction="row" justifyContent='flex-start' alignItems="center" spacing={3}>
                                                    {icon}
                                                    <Typography variant="h6">{name}</Typography>
                                                </Stack>
                                            </Button>
                                        </Stack>
                                    ))}
                                </FormGroup>
                            </Box>
                            <Stack spacing={2} sx={{ width: { xs: "100%", md: "70%" } }}>
                                <Typography variant="h4" sx={{ color: "#561f5b", textAlign: "left", fontSize: { xs: "1.5rem", md: "2rem" } }}>
                                    Create Post
                                </Typography>
                                <TextField
                                    label="Post Title"
                                    variant="outlined"
                                    value={postTitle}
                                    onChange={handleTitleChange}
                                    error={!!errors.title}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#561f5b"
                                            }
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#561f5b"
                                        }
                                    }}
                                />
                                {errors.title && (
                                    <Typography color="error" sx={{ mt: 0,mb:0,fontSize:"14px" }}>
                                        {errors.title}
                                    </Typography>
                                )}
                                <Typography variant="h6" sx={{ color: "#561f5b", textAlign: "left" }}>
                                    Post Content
                                </Typography>
                                <CustomQuill>
                                    <ReactQuill
                                        ref={quillRef}
                                        value={postContent}
                                        onChange={handlePostChange}
                                        style={{ height: "200px" }}
                                        modules={modules}
                                    />
                                </CustomQuill>
                                {errors.content && (
                                    <Typography color="error" sx={{ fontSize:"14px",mt: 0 }}>
                                        {errors.content}
                                    </Typography>
                                )}
                                {/* {errors.platform && (
                                    <Typography color="error" sx={{ mt: 0 }}>
                                        {errors.platform}
                                    </Typography>
                                )} */}
                                <Button
                                    variant="contained"
                                    onClick={() => setShowCheckboxes(true)}
                                    sx={{ mt: 3, backgroundColor: "#561f5b", color: "white", width:"20%", "&:hover": { backgroundColor: "#420f45" } }}
                                >
                                    Select
                                </Button>
                                {errors.platform && (
                                    <Typography color="error" sx={{ mt: "0px",mb:'0px',fontSize:"14px" }}>
                                        {errors.platform}
                                    </Typography>
                                )}
                                {/* toggle buttons sec */}
                                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" >
                                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginTop: 2,border:'' }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    sx={{
                                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                                            color: "#561f5b",
                                                        },
                                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                            backgroundColor: "#561f5b",
                                                        },
                                                    }}
                                                    checked={turnOffLikes}
                                                    onChange={likesSwitch}
                                                />
                                            }
                                            label={turnOffLikes ? "Turn on likes" : "Turn off likes"}
                                             />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    sx={{
                                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                                            color: "#561f5b",
                                                        },
                                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                            backgroundColor: "#561f5b",
                                                        },
                                                    }}
                                                    checked={turnOffComments}
                                                    onChange={commentsSwitch}
                                                />
                                            }
                                            label={turnOffComments ? "Turn on comments" : "Turn off comments"}
                                        />
                                    </Stack>
                                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: -5, }}>
                                        <Button
                                                variant="contained"
                                                onClick={handlePublish}
                                                color="primary"
                                                sx={{
                                                    backgroundColor: "#561f5b",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#420f45" },
                                                }}
                                            >
                                                Publish Now
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleSetupSchedule}
                                            sx={{
                                                backgroundColor: "#561f5b",
                                                color: "white",
                                                "&:hover": { backgroundColor: "#420f45" },
                                            }}
                                        >
                                            Setup Schedule
                                        </Button>
                                    </Stack>

                                </Stack >
                            </Stack>
                        </Stack>
                        {/* <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginTop: 2,border:'1px solid blue' }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                                color: "#561f5b",
                                            },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                backgroundColor: "#561f5b",
                                            },
                                        }}
                                        checked={turnOffLikes}
                                        onChange={likesSwitch}
                                    />
                                }
                                label={turnOffLikes ? "Turn on likes" : "Turn off likes"}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                                color: "#561f5b",
                                            },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                                backgroundColor: "#561f5b",
                                            },
                                        }}
                                        checked={turnOffComments}
                                        onChange={commentsSwitch}
                                    />
                                }
                                label={turnOffComments ? "Turn on comments" : "Turn off comments"}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: 2 }}>
                            <Button
                                variant="contained"
                                onClick={handlePublish}
                                color="primary"
                                sx={{
                                    backgroundColor: "#561f5b",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#420f45" },
                                }}
                            >
                                Publish Now
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSetupSchedule}
                                sx={{
                                    backgroundColor: "#561f5b",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#420f45" },
                                }}
                            >
                                Setup Schedule
                            </Button>
                        </Stack> */}
                    </Box>
                </Box>
            </Container>
            <Modal open={previewOpen} onClose={handleClosePreview}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", md: "50%" },
                        height: "auto",
                        maxHeight: "80vh",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 5,
                        borderRadius: 2,
                        overflowY: "auto",
                    }}
                >
                    <IconButton
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        onClick={handleClosePreview}
                    >
                        <Close />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ mb: 2, color: '#561f5b' }}>
                            {postTitle}
                        </Typography>
                        <Box sx={{ mb: 2, fontSize: '18px', fontWeight: "500", fontFamily: 'Poppins', color: '#424242' }}>
                            <div dangerouslySetInnerHTML={{ __html: postContent }} />
                        </Box>
                        {(uploadedFile || postContent.includes("http")) && <Divider sx={{ my: 2 }} />}
                        {uploadedFile && (
                            <Box sx={{ mb: 2 }}>
                                {uploadedFile.type.startsWith("image/") ? (
                                    <img
                                        src={URL.createObjectURL(uploadedFile)}
                                        alt="Uploaded"
                                        style={{ width: "200px", height: "200px", borderRadius: 4 }}
                                    />
                                ) : uploadedFile.type.startsWith("video/") ? (
                                    <video
                                        controls
                                        style={{ width: "200px", height: "200px", borderRadius: 4 }}
                                    >
                                        <source src={URL.createObjectURL(uploadedFile)} type={uploadedFile.type} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <Typography variant="body1">
                                        <a href={URL.createObjectURL(uploadedFile)} target="_blank" rel="noopener noreferrer">
                                            {uploadedFile.name}
                                        </a>
                                    </Typography>
                                )}
                            </Box>
                        )}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6">Selected Platforms:</Typography>
                            <Stack direction="row" spacing={1}>
                                {selectedPlatforms.map((platform) => {
                                    const platformData = platforms.find((p) => p.name === platform);
                                    return (
                                        <Box key={platform} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Box sx={{ color: platformData.color }}>{platformData.icon}</Box>
                                            <Typography>{platformData.name}</Typography>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEdit}
                                sx={{
                                    backgroundColor: "#561f5b",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#420f45" },
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePost}
                                sx={{
                                    backgroundColor: "#561f5b",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#420f45" },
                                }}
                            >
                                Post
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

            <Modal open={scheduleOpen} onClose={() => setScheduleOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", md: 400 },
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2, color: "#561f5b" }}>
                        Schedule Post
                    </Typography>
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Time"
                        type="time"
                        fullWidth
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    {scheduleError && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {scheduleError}
                        </Typography>
                    )}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={reminderEnabled}
                                onChange={(e) => handleReminderToggle(e.target.checked)}
                                sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: "#561f5b",
                                    },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                        backgroundColor: "#561f5b",
                                    },
                                }}
                            />
                        }
                        label="Set Reminder"
                    />
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => handleSchedule(scheduleDate, scheduleTime)}
                            sx={{
                                backgroundColor: "#561f5b",
                                color: "white",
                                "&:hover": { backgroundColor: "#420f45" },
                            }}
                        >
                            Schedule
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setScheduleOpen(false)}
                            sx={{
                                borderColor: "#561f5b",
                                color: "#561f5b",
                                "&:hover": { borderColor: "#420f45" },
                            }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </Box>
        // dqafkjwbnjkfnk
    );
};

export default SharePostPage;