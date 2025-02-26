import React, { useState } from 'react';
import { Container, FormControl, FormControlLabel, Switch, Select, MenuItem, Typography, Box } from '@mui/material';

const AutoPostSettings = () => {
    const [autoPost, setAutoPost] = useState(false);
    const [autoLog, setAutoLog] = useState(true);

    return (
        <Container style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#561f5b', fontWeight: 'bold', textAlign: 'left' }}>Auto Post Settings</Typography>
           
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} p={2} bgcolor="#f9f9f9" borderRadius={2}>
                <Box>
                    <Typography variant="subtitle1" sx={{ color: '#561f5b', fontWeight: 'bold', textAlign: 'left' }}>Share posts automatically</Typography>
                    <Typography variant="body2" color="textSecondary">
                        When you publish a new WordPress post, the plugin shares the post on all active social accounts automatically.
                    </Typography>
                </Box>
                <Switch checked={autoPost} onChange={() => setAutoPost(!autoPost)} sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#561f5b",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#561f5b",
                    },
                }} />
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} p={2} bgcolor="#f9f9f9" borderRadius={2}>
                <Box>
                    <Typography variant="subtitle1" sx={{ color: '#561f5b', fontWeight: 'bold', textAlign: 'left' }}>Share posts type</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Automatically share specific post types, like blogs or products, to your social accounts when published.
                    </Typography>
                </Box>
                <FormControl sx={{ minWidth: 120 }}>
                    <Select
                        defaultValue="Posts"
                        sx={{
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#561f5b',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#561f5b',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#561f5b',
                            }
                        }}
                        MenuProps={{
                            PaperProps: {
                                sx: {
                                    '& .MuiMenuItem-root:hover': {
                                        backgroundColor: '#561f5b',
                                        color: 'white',
                                    },
                                }
                            }
                        }}
                    >
                        <MenuItem value="Posts">Posts</MenuItem>
                        <MenuItem value="Products">Products</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} p={2} bgcolor="#f9f9f9" borderRadius={2}>
                <Box>
                    <Typography variant="subtitle1" sx={{ color: '#561f5b', fontWeight: 'bold', textAlign: 'left' }}>Share post delay</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Optimize your sharing strategy with flexible timing options: use the dropdown menu to select when your posts will be shared after publishing.
                    </Typography>
                </Box>
                <FormControl>
                    <Select defaultValue="Immediately" sx={{
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#561f5b',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#561f5b',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#561f5b',
                        }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                '& .MuiMenuItem-root:hover': {
                                    backgroundColor: '#561f5b',
                                    color: 'white',
                                },
                            }
                        }
                    }}>
                        <MenuItem value="Immediately">Immediately</MenuItem>
                        <MenuItem value="After 5 minutes">After 5 minutes</MenuItem>
                        <MenuItem value="After 10 minutes">After 10 minutes</MenuItem>
                        <MenuItem value="After 30 minutes">After 30 minutes</MenuItem>
                        <MenuItem value="After 1 hour">After 1 hour</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} p={2} bgcolor="#f9f9f9" borderRadius={2}>
                <Box>
                    <Typography variant="subtitle1" sx={{ color: '#561f5b', fontWeight: 'bold', textAlign: 'left' }}>Enable auto post log</Typography>
                    <Typography variant="body2" color="textSecondary">
                        If you don't want to keep the shared post logs, you need to disable the option. Disabling the option prevents you from viewing your insights and you might encounter duplicate posts when you use the schedule module.
                    </Typography>
                </Box>
                <Switch checked={autoLog} onChange={() => setAutoLog(!autoLog)} sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#561f5b",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#561f5b",
                    },
                }} />
            </Box>
        </Container>
    );
};

export default AutoPostSettings;
