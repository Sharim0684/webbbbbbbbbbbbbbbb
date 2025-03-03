import React, { useState } from "react";
import { 
  Box, TextField, Select, MenuItem, Button, Typography, Card, CardContent 
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Test = () => {
  // Template settings
  const [selectedTemplate, setSelectedTemplate] = useState("Promotion");
  const [templateContent, setTemplateContent] = useState("{post_title}");
  const [preview, setPreview] = useState("");

  // Smart Tags
  const smartTags = ["{post_title}", "{}", "{company}", "{offer}"];

  // Update template selection
  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
  };

  // Insert Smart Tag into the editor
  const insertSmartTag = (tag) => {
    setTemplateContent((prev) => prev + " " + tag);
  };

  // Generate Preview
  const generatePreview = () => {
    const exampleData = {
      "{post_title}": "",
      "{company}": "",
      "{offer}": "",
    };

    // "{date}": new Date().toLocaleDateString(),


    let previewContent = templateContent;
    Object.keys(exampleData).forEach((key) => {
      previewContent = previewContent.replaceAll(key, exampleData[key]);
    });

    setPreview(previewContent);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto", textAlign: "center" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Facebook Post Template Editor
      </Typography>

      {/* Select Template */}
      <Select 
        value={selectedTemplate} 
        onChange={handleTemplateChange} 
        fullWidth sx={{ mb: 2 }}
      >
        <MenuItem value="Promotion">Promotion</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
        <MenuItem value="Announcement">Announcement</MenuItem>
      </Select>

      {/* Rich Text Editor */}
      <ReactQuill 
        value={templateContent} 
        onChange={setTemplateContent} 
        theme="snow"
      />

      {/* Smart Tags */}
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1">Smart Tags:</Typography>
        {smartTags.map((tag) => (
          <Button 
            key={tag} 
            variant="outlined" 
            size="small" 
            startIcon={<SmartToyIcon />} 
            onClick={() => insertSmartTag(tag)} 
            sx={{ m: 0.5 }}
          >
            {tag}
          </Button>
        ))}
      </Box>

      {/* Generate Preview Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={generatePreview} 
        sx={{ mt: 2 }}
      >
        Preview
      </Button>

      {/* Template Preview */}
      {preview && (
        <Card sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h6">Preview:</Typography>
            <Typography dangerouslySetInnerHTML={{ __html: preview }} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Test;

