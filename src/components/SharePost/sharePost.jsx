import React, { useState, useRef, useEffect } from "react";
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
import axios from 'axios';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const BASE_URL = 'http://127.0.0.1:8000/api';

const CustomQuill = styled("div")({
    "& .ql-editor": {
        minHeight: "150px",
    },
    "&:hover .ql-toolbar, &:hover .ql-container": {
        borderColor: "#561f5b !important",
    },
});

const SharePostPage = () => {
    const [userPlatforms, setUserPlatforms] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [enableLikes, setEnableLikes] = useState(true);
    const [enableComments, setEnableComments] = useState(true);
    const [error, setError] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [scheduleDate, setScheduleDate] = useState(null);
    const [scheduleTime, setScheduleTime] = useState(null);
    const [enableReminder, setEnableReminder] = useState(false);
    const [reminderTime, setReminderTime] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [scheduleError, setScheduleError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            try {
                // First check if we have a token
                const token = Cookies.get('authToken');
                if (!token) {
                    // Try auto-login with Facebook first
                    const facebookResponse = await axios.post(`${BASE_URL}/auth/auto-login/`, {
                        provider: 'facebook'
                    });

                    if (facebookResponse.status === 200) {
                        Cookies.set('authToken', facebookResponse.data.token);
                    } else {
                        // Try LinkedIn auto-login
                        const linkedinResponse = await axios.post(`${BASE_URL}/auth/auto-login/`, {
                            provider: 'linkedin'
                        });

                        if (linkedinResponse.status === 200) {
                            Cookies.set('authToken', linkedinResponse.data.token);
                        } else {
                            navigate('/login');
                            return;
                        }
                    }
                }

                // Fetch platforms
                const response = await axios.get(`${BASE_URL}/platforms/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.platforms) {
                    const platforms = response.data.platforms.map(platform => ({
                        key: platform.key,
                        name: platform.name,
                        logo: platform.logo || 
                            platform.key === 'facebook' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/640px-Facebook_Logo_%282019%29.png' :
                            platform.key === 'linkedin' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/640px-LinkedIn_Logo.svg.png' :
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/640px-Instagram_icon.png',
                        is_selected: platform.is_selected
                    }));
                    setUserPlatforms(platforms);
                    setSelectedPlatforms(platforms
                        .filter(platform => platform.is_selected)
                        .map(platform => platform.key));
                }
            } catch (err) {
                console.error('Error during auth check:', err);
                
            }
        };

        checkAuthAndFetch();
    }, [navigate]);

    const handleCheckboxClick = (platformKey) => {
        setSelectedPlatforms((prevSelected) => {
            const newSelected = prevSelected.includes(platformKey)
                ? prevSelected.filter((p) => p !== platformKey)
                : [...prevSelected, platformKey];
            return newSelected;
        });
        setError("");
    };

    const handlePlatformClick = (platformKey) => {
        if (selectedPlatforms.includes(platformKey)) {
            setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformKey));
        } else {
            setSelectedPlatforms([...selectedPlatforms, platformKey]);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedPlatforms([]);
        } else {
            setSelectedPlatforms(userPlatforms.map((p) => p.key));
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
        setEnableLikes(event.target.checked);
    };

    const commentsSwitch = (event) => {
        setEnableComments(event.target.checked);
    };

    const handlePostChange = (content) => {
        setPostContent(content);

        if (selectedPlatforms.length === 0) {
            setError("Please select a platform.");
            return;
        }

        const characterLimit = selectedPlatforms.length > 1
            ? 270
            : userPlatforms.find(p => p.key === selectedPlatforms[0])?.limit || 270;

        if (content.length > characterLimit) {
            setError(`Character limit exceeded! Max allowed: ${characterLimit} characters.`);
        } else {
            setError("");
        }
    };

    const handleTitleChange = (event) => {
        setPostTitle(event.target.value);
        setError(event.target.value.trim() ? "" : "Enter Post Title");
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setError('No file selected');
            return;
        }

        // Validate file type
        const fileType = file.type || '';
        if (!fileType.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('Image file size should be less than 10MB');
            return;
        }

        // Clear any existing files
        setMediaFiles([]);

        // Create thumbnail and set new file
        const preview = URL.createObjectURL(file);
        setMediaFiles([{
            file,
            preview,
            type: fileType
        }]);

        // Insert image into editor
        const editor = quillRef.current.getEditor();
        editor.focus();
        editor.insertEmbed(editor.getLength(), 'image', preview);
    };

    const handlePublish = () => {
        let newErrors = { title: "", content: "", platform: "" };

        if (!postTitle.trim()) newErrors.title = "Enter Post Title";
        if (!postContent.trim()) newErrors.content = "Enter Post Content";
        if (selectedPlatforms.length === 0) newErrors.platform = "Please select at least one platform.";

        setError(newErrors.platform);

        if (!newErrors.title && !newErrors.content && !newErrors.platform) {
            setPreviewOpen(true);
        }
    };

    const handleEdit = () => {
        setPreviewOpen(false);
    };

    const handlePost = async () => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            // Get credentials for selected platforms
            const credentialsResponse = await axios.get(`${BASE_URL}/social/get-credentials/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Prepare post data
            const formData = new FormData();
            formData.append('content', postContent);
            
            // Add media file if present
            if (mediaFiles && mediaFiles.length > 0) {
                formData.append('media', mediaFiles[0].file, mediaFiles[0].file.name);
            }

            // Add platforms
            selectedPlatforms.forEach(platform => {
                formData.append('platforms', platform);
            });

            // Add credentials for each platform
            Object.entries(credentialsResponse.data).forEach(([platform, credential]) => {
                if (selectedPlatforms.includes(platform)) {
                    formData.append(`credentials_${platform}`, credential.access_token);
                }
            });

            // Send post request
            const response = await axios.post(`${BASE_URL}/social/post/`, formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                // Handle success
                setPostTitle('');
                setPostContent('');
                setSelectedPlatforms([]);
                setEnableLikes(true);
                setEnableComments(true);
                setPreviewOpen(false);
                setMediaFiles([]);
                navigate('/thankYouPage');
            } else {
                throw new Error(response.data.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error posting:', error);
            setError(error.response?.data?.message || 'Failed to create post. Please try again.');
        }
    };

    const handleSetupSchedule = () => {
        let newErrors = { title: "", content: "", platform: "" };

        if (!postTitle.trim()) newErrors.title = "Enter Post Title";
        if (!postContent.trim()) newErrors.content = "Enter Post Content";
        if (selectedPlatforms.length === 0) newErrors.platform = "Please select at least one platform.";

        setError(newErrors.platform);

        if (!newErrors.title && !newErrors.content && !newErrors.platform) {
            setScheduleOpen(true);
        }
    };

    const handleSchedule = (date, time) => {
        if (!date || !time) {
            setError("Please select both date and time.");
            return;
        }

        setError("");
        setScheduleDate(date);
        setScheduleTime(time);

        const postText = postContent.replaceAll(/<[^>]+>/g, "");
        const userUploadedFile = mediaFiles[0] ? mediaFiles[0].name : '';
        const userScheduleDetails = {
            dateOfSchedule: date,
            timeOfSchedule: time,
            reminderEnabled: enableReminder,
            userPostDetails: {
                postTitle,
                postText,
                userUploadedFile,
                enableLikes,
                enableComments,
                selectedPlatforms
            }
        };

        console.log(userScheduleDetails);
        // navigate("/history");
    };

    const handleReminderToggle = (enabled) => {
        setEnableReminder(enabled);
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

    const quillRef = useRef(null);

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
                        <Stack direction="column" spacing={3}>
                            <Typography variant="h4" sx={{ color: "#561f5b", textAlign: "left" }}>
                                Select Platforms
                            </Typography>
                            {!showCheckboxes && (
                                <Button
                                    variant="contained"
                                    onClick={() => setShowCheckboxes(true)}
                                    sx={{ mt: 3, backgroundColor: "#561f5b", color: "white", width:"20%", "&:hover": { backgroundColor: "#420f45" } }}
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
                            {userPlatforms.map(({ key, name, logo }) => (
                                <Stack key={key} direction="row" alignItems="center" spacing={2}>
                                    {showCheckboxes && (
                                        <Checkbox
                                            checked={selectedPlatforms.includes(key)}
                                            onChange={() => handleCheckboxClick(key)}
                                            sx={{
                                                color: "#561f5b",
                                                "&.Mui-checked": { color: "#561f5b" }
                                            }}
                                        />
                                    )}
                                    <Button
                                        onClick={() => handlePlatformClick(key)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            color: selectedPlatforms.includes(key) ? "#561f5b" : "561f5b",
                                            "&:hover": { backgroundColor: "#561f5b", color: "white" },
                                            textTransform: "none",
                                            width: "100%",
                                        }}
                                    >
                                        <Stack direction="row" justifyContent='flex-start' alignItems="center" spacing={3}>
                                            <img src={logo} alt="Logo" style={{height:'30px',width:'30px',borderRadius:'12px'}} />
                                            <Typography variant="h6">{name}</Typography>
                                        </Stack>
                                    </Button>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                    <Box
                        sx={{
                            width: { xs: "100%", md: "60%" },
                            padding: { xs: 2, md: 5 },
                            mt: { xs: 3, md: 0 },
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h4" sx={{ color: "#561f5b", textAlign: "left", fontSize: { xs: "1.5rem", md: "2rem" } }}>
                                Create Post
                            </Typography>
                            <TextField
                                label="Post Title"
                                variant="outlined"
                                value={postTitle}
                                onChange={handleTitleChange}
                                error={!!error}
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
                            {error && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {error}
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
                            {error && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                variant="contained"
                                color="primary"
                                component="label"
                                sx={{
                                    backgroundColor: "#561f5b",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#420f45" },
                                    textTransform: "none",
                                    padding: "12px 24px",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "600"
                                }}
                            >
                                Upload Image
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ marginTop: 2 }}>
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
                                        checked={enableLikes}
                                        onChange={likesSwitch}
                                    />
                                }
                                label={enableLikes ? "Disable likes" : "Enable likes"}
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
                                        checked={enableComments}
                                        onChange={commentsSwitch}
                                    />
                                }
                                label={enableComments ? "Disable comments" : "Enable comments"}
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
                        </Stack>
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
                        {(mediaFiles[0] || postContent.includes("http")) && <Divider sx={{ my: 2 }} />}
                        {mediaFiles[0] && (
                            <Box sx={{ mb: 2 }}>
                                {mediaFiles && mediaFiles.length > 0 && mediaFiles[0]?.type?.startsWith("image/") ? (
                                    <img
                                        src={mediaFiles[0]?.preview || ''}
                                        alt="Uploaded"
                                        style={{ width: "200px", height: "200px", borderRadius: 4 }}
                                    />
                                ) : mediaFiles[0].type.startsWith("video/") ? (
                                    <video
                                        controls
                                        style={{ width: "200px", height: "200px", borderRadius: 4 }}
                                    >
                                        <source src={URL.createObjectURL(mediaFiles[0].file)} type={mediaFiles[0].type} />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <Typography variant="body1">
                                        <a href={URL.createObjectURL(mediaFiles[0].file)} target="_blank" rel="noopener noreferrer">
                                            {mediaFiles[0].file.name}
                                        </a>
                                    </Typography>
                                )}
                            </Box>
                        )}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6">Selected Platforms:</Typography>
                            <Stack direction="row" spacing={1}>
                                {selectedPlatforms.map((platform) => {
                                    const platformData = userPlatforms.find((p) => p.key === platform);
                                    const platformLogo = platformData?.logo || 
                                        platform === 'facebook' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/640px-Facebook_Logo_%282019%29.png' :
                                        platform === 'linkedin' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/640px-LinkedIn_Logo.svg.png' :
                                        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/640px-Instagram_icon.png';
                                    
                                    return (
                                        <Box key={platform} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <img src={platformLogo} alt="Logo" style={{height:"30px",width:'30px',borderRadius:'12px'}}/>
                                            <Typography>{platform === 'facebook' ? 'Facebook' : platform === 'linkedin' ? 'LinkedIn' : 'Instagram'}</Typography>
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
                                checked={enableReminder}
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
                        label={enableReminder ? "Disable reminder": "Enable reminder"}
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
 