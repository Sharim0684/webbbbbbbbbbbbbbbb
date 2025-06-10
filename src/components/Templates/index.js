import { Box, Button, Menu,MenuItem, Stack, Typography,Card,CardContent,TextField, Container } from '@mui/material';
import React,{useEffect, useState} from 'react'
import Header from '../Header';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SellIcon from '@mui/icons-material/Sell';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Preview from './Preview';


// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

const options = [
  'Only Custom message','Link Card','Featured Image'
];




  // const smartTags = ["{post_title}","{post_id}","{post_category}","{post_author_name}","{post_terms}"];




const Templates=()=>{
    const [anchorEl, setAnchorEl] = useState(null);
    const [option, setOption] = useState(options[1]);
    const [preview, setPreview] = useState("true");    
    const [templateContent, setTemplateContent] = useState("");
    const [selectedFile, setSelectedFile] = useState('');
    const [link, setLink]=useState('')
    const [previewImg,setPreviewImg]=useState("")

    
    const open = Boolean(anchorEl);

    function getStyles(name, personName,) {
        return {
          fontWeight: personName.includes(name)
            ? Typography.fontWeightMedium
            : Typography.fontWeightRegular,
        };
      }

     

      const generatePreview = () => {
        const exampleData = {
          "{post_title}": "",
          "{post_id}": "",
          "{post_category}": "",
          "{post_author_name}":"",
          "{post_terms}":""
        };
    
        // "{date}": new Date().toLocaleDateString(),
    
    
        let previewContent = templateContent;
        Object.keys(exampleData).forEach((key) => {
          previewContent = previewContent.replaceAll(key, exampleData[key]);
        });
    
        setPreview(previewContent);
      };

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
      setAnchorEl(null);
    };

    const handleChange = (event) => {
        console.log(event.target.value)
        setOption(event.target.value)
    //     const {
    //       target: { value },
    //     } = event;
    //     setOption(
    //       // On autofill we get a stringified value.
    //       typeof value === 'string' ? value.split(',') : value,
    //     );
    //   
    }

     // Insert Smart Tag into the editor
    // const insertSmartTag = (tag) => {
    //     setTemplateContent((prev) => prev + " " + tag);
    //     // generatePreview()
    //     handleClose()

    // };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setSelectedFile(URL.createObjectURL(file));
      // setPreviewImg(URL.createObjectURL(file))
    };

    

    return(
        <container>
            {/* <Header/> */}
            <Container maxWidth="xl" >
                <Stack direction='row' spacing={2} mt={2}sx={{padding:'20px'}}>
                    <Box flex={1} sx={{border:'',}}>
                        <Typography variant='h6' sx={{textAlign:'center',color:'#561f5b'}}>Platforms</Typography>
                        
                    </Box>
                    <Box flex={2} sx={{border:'',backgroundColor:'',padding:"20px"}}>
                        <Box sx={{textAlign:'start',padding:'20px'}}>
                            <Typography variant='h5' sx={{color:'#561f5b',fontFamily:'poppins',mb:1}}>Templates Settings.</Typography>
                            <Typography variant='h7' sx={{fontFamily:'poppins',color:'grey'}} >You can setup post settings below.</Typography>
                        </Box>
                        <Box sx={{border:''}}>
                            <Box sx={{textAlign:'start',padding:'20px'}}>
                                <Typography variant='h6' sx={{color:'#561f5b',fontFamily:'poppins',fontWeight:'500'}}>Custom message</Typography>
                                <Typography variant='h7' sx={{fontFamily:'poppins',color:'grey'}} >Custom message settings.</Typography>
                            </Box>
                            {/* <Button  id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                
                                sx={{color:'#561f5b',fontWeight:'500',fontFamily:'poppins',border:'',marginLeft:'450px'}}
                                onClick={handleClick}><SellIcon sx={{mr:2}} /> Show Smart Tags 
                            </Button> */}
                            {/* <Menu id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}>
                                    {smartTags.map((tag)=>(
                                <MenuItem onClick={()=>insertSmartTag(tag)} >{tag}</MenuItem>
                            ))}
                            </Menu> */}
                            <Box mt={2}>                                
                                       <TextField
                                            id="filled-multiline-static"                                           
                                            multiline
                                            rows={4}
                                            
                                            sx={{width:'95%',}}
                                            value={templateContent}
                                            onChange={(e)=>setTemplateContent(e.target.value)}
                                            />                                
                            </Box>
                            <Stack spacing={2} direction="row" justifyContent='space-between' alignItems="center" sx={{border:'',mr:2,ml:2,mt:2}}>
                                <Box sx={{textAlign:'start'}}>
                                    <Typography variant='h6' sx={{color:'#561f5b',fontFamily:'poppins',fontWeight:'500'}} >Posting Type</Typography>
                                    <Typography variant='h7' sx={{fontFamily:'poppins',color:'grey'}} >Post styling and Type setup.</Typography>
                                </Box>
                                <Box>
                                <FormControl sx={{width: 150, }}>
                                        <Select                                        
                                        displayEmpty
                                        value={option}
                                        onChange={handleChange}
                                        input={<OutlinedInput />}
                                        
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                        {/* <MenuItem disabled value="">
                                            <em>Placeholder</em>
                                        </MenuItem> */}
                                        {options.map((eachOption) => (
                                            <MenuItem
                                            key={eachOption}
                                            value={eachOption}
                                            
                                            >
                                            {eachOption}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>

                                </Box>
                            </Stack>

                            {/* File Upload Section */}

                            {option==='Link Card' ? (<Stack spacing={2} justifyContent="flex-start" alignItems="flex-start" sx={{border:'',mr:2,ml:2,mt:2}}>
                               <Box mt={2}>
                                <Typography variant='h6' sx={{ color: '#561f5b', fontWeight: '500',textAlign:'start' }}>Upload File</Typography>
                                <input type="file" onChange={handleFileChange} />
                              </Box>
                              <Box mt={2}sx={{width:"100%"}}>
                              <Typography variant='h6' sx={{ color: '#561f5b', fontWeight: '500',textAlign:'start' }}>Enter a Link</Typography>
                              <TextField
                                fullWidth
                                type="url"
                                placeholder="Enter a valid URL"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                              />
                              </Box>
                            </Stack>
                          ): option==='Featured Image' ? (<Box mt={2} sx={{textAlign:"start",ml:2}}>
                            <Typography variant='h6' sx={{ color: '#561f5b', fontWeight: '500' }}>Upload File</Typography>
                            <input type="file" onChange={handleFileChange} />
                          </Box>): ""}                          

                            
                              
                           
                            
                        </Box>
                    </Box>
                    <Box flex={1} sx={{border:''}}>
                        {/* Preview section */}
                        {preview && (<Preview option={option} data={templateContent} file={selectedFile} link={link}/>)}  
                    </Box>

                </Stack>
            </Container>
        </container>
    )
}
export default Templates;

