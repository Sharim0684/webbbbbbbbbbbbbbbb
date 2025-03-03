import React, { useState, useRef } from "react";
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
} from "@mui/material";
// import  Container from '@mui/system';
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
    { name: "Twitter", icon: <XIcon color="primary" sx={{fontSize:'20px'}} /> },
    { name: "Instagram", icon: <InstagramIcon color="primary"/> },
    { name: "LinkedIn", icon: <LinkedInIcon color="primary"/> },
];

const SharePostPage = () => {
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [errors, setErrors] = useState({
        title: "",
        content: "",
        platform: ""
    });
    const [error, setError] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const quillRef = useRef(null);
    const navigate = useNavigate();

    const handlePlatformClick = (platform) => {
        setSelectedPlatforms([platform]);
        setError("");
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
        navigate("/thankYouPage");
    };

    const handleSetupSchedule = () => {
        navigate("/schedulePage");
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
        <container maxWidth="lg" sx={{}} >
            <Header />
            <Container maxWidth="xl" sx={{ border: "", marginTop: 5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "auto",
                        padding: 0,
                        backgroundColor: "white",
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: 800,
                            width: "100%",
                            padding: 0,
                            mt: 0,
                            borderRadius: 2,
                            backgroundColor: "white",
                        }}
                    >

                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

                            <Box sx={{ width: { xs: "100%", md: "40%" }, gap: 2, mt: 3 }}>
                                <Typography variant="h4" sx={{ color: "#561f5b", textAlign: "left" }}>
                                    Select Platforms
                                </Typography>
                                {!showCheckboxes && (
                                    <Button
                                        variant="contained"
                                        onClick={() => setShowCheckboxes(true)}
                                        sx={{ marginLeft: 20, backgroundColor: "#561f5b", color: "white", "&:hover": { backgroundColor: "#420f45", } }}
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
                                <FormGroup sx={{ marginTop: 3 }}>
                                    {platforms.map(({ name, icon, color }) => (
                                        <Stack key={name} direction="row" alignItems="center" spacing={2}>
                                            {showCheckboxes && (
                                                <Checkbox checked={selectedPlatforms.includes(name)} onChange={() => handleCheckboxClick(name)} sx={{ color: "#561f5b", "&.Mui-checked": { color: "#561f5b" } }} />
                                            )}
                                            <Button onClick={() => handlePlatformClick(name)} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", backgroundColor: selectedPlatforms.includes(name) ? "#561f5b" : "transparent", color: selectedPlatforms.includes(name) ? "white" : "#561f5b", "&:hover": { backgroundColor: "#420f45", color: "white" }, textTransform: "none", width: "100%" }}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Box sx={{ color }}>{icon}</Box>
                                                    <span>{name}</span>
                                                </Stack>
                                            </Button>
                                        </Stack>
                                    ))}
                                </FormGroup>
                            </Box>


                            <Stack spacing={2} sx={{ width: { xs: "100%", md: "70%" } }}>
                                <Typography variant="h4" sx={{ color: "#561f5b", textAlign: "left", fontSize: { xs: "1.5rem", md: "2rem" } }}>
                                    Share Your Post
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
                                    <Typography color="error" sx={{ mt: 1 }}>
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
                                    <Typography color="error" sx={{ mt: 1 }}>
                                        {errors.content}
                                    </Typography>
                                )}
                                {errors.platform && (
                                    <Typography color="error" sx={{ mt: 1 }}>
                                        {errors.platform}
                                    </Typography>
                                )}

                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{
                                        backgroundColor: "#561f5b",
                                        color: "white",
                                        "&:hover": { backgroundColor: "#420f45" },
                                    }}
                                >
                                    Upload Media
                                    <input type="file" hidden onChange={handleFileUpload} />
                                </Button>
                            </Stack>
                        </Stack>


                        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: 3 }}>
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


                    <Modal open={previewOpen} onClose={handleClosePreview}>
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "50%",
                                height: "auto",
                                maxHeight: "80vh",
                                bgcolor: "background.paper",
                                boxShadow: 24,
                                p: 2,
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

                            <Typography variant="h5" sx={{ mb: 2 }}>
                                {postTitle}
                            </Typography>


                            <Box sx={{ mb: 2 }}>
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
                    </Modal>
                </Box>
            </Container>
        </container>
    );
};

export default SharePostPage;