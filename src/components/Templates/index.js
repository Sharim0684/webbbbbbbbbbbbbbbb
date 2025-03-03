import { Box, Button, Menu,MenuItem, Stack, Typography } from '@mui/material';
import React,{useState} from 'react'
import Header from '../Header';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SellIcon from '@mui/icons-material/Sell';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Only Custom message','Link Card','Featured Image'
];


function getStyles(name, personName,) {
    return {
      fontWeight: personName.includes(name)
        ? Typography.fontWeightMedium
        : Typography.fontWeightRegular,
    };
  }

  const smartTags = ["{post_title}","{post_id}","{post_category}","{post_author_name}","{post_terms}"];




const Templates=()=>{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [personName, setPersonName] = React.useState([]);
    const [templateContent, setTemplateContent] = useState("{post_title}");
    
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
    //   setAnchorEl(null);
    console.log(e.target)
    };

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setPersonName(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
     // Insert Smart Tag into the editor
  const insertSmartTag = (tag) => {
    setTemplateContent((prev) => prev + " " + tag);
  };

    

    return(
        <container>
            <Header/>
            <container >
                <Stack direction='row' spacing={2} mt={2}sx={{padding:'20px'}}>
                    <Box flex={1} sx={{border:'1px solid blue',}}>
                        <Typography variant='h6' sx={{textAlign:'center',color:'#561f5b'}}>Platforms</Typography>
                        
                    </Box>
                    <Box flex={2} sx={{border:'1px solid red',backgroundColor:'',padding:"20px"}}>
                        <Box sx={{textAlign:'start',padding:'20px'}}>
                            <Typography variant='h5' sx={{color:'#561f5b',fontFamily:'poppins',mb:1}}>Facebook Templates Settings.</Typography>
                            <Typography variant='h7' sx={{fontFamily:'poppins',color:'grey'}} >You can setup Facebook post settings below.</Typography>
                        </Box>
                        <Box sx={{border:'1px solid blue'}}>
                            <Box sx={{textAlign:'start',padding:'20px'}}>
                                <Typography variant='h6' sx={{color:'#561f5b',fontFamily:'poppins',fontWeight:'500'}}>Custom message</Typography>
                                <Typography variant='h7' sx={{fontFamily:'poppins',color:'grey'}} >Custom message settings.</Typography>
                            </Box>
                            <Button  id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                
                                sx={{color:'#561f5b',fontWeight:'500',fontFamily:'poppins',border:'',marginLeft:'450px'}}
                                onClick={handleClick}><SellIcon sx={{mr:2}} /> Show Smart Tags 
                            </Button>
                            <Menu id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}>
                                    {smartTags.map((tag)=>(
                                <MenuItem onClick={()=>insertSmartTag(tag)} >{tag}</MenuItem>
                            ))}
                                {/* <MenuItem sx={{fontSize:'16px'}} onClick={handleClose}>Post ID</MenuItem> */}
                                {/* <MenuItem onClick={handleClose}>Post Title</MenuItem>
                                <MenuItem onClick={handleClose}>Post Category</MenuItem>
                                <MenuItem onClick={handleClose}>Post Author Name</MenuItem>
                                <MenuItem onClick={handleClose}>Post Tags</MenuItem>
                                <MenuItem onClick={handleClose}>Post Terms</MenuItem> */}
                            </Menu>
                            <Box mt={2}>
                                <textarea cols={90} rows={5} style={{borderRadius:'12px',padding:'10px'}}>
                                
                                </textarea>
                            </Box>
                            <Stack spacing={2} direction="row" justifyContent='space-between' alignItems="center" sx={{border:'1px solid blue',mr:2,ml:2,p:2}}>
                                <Box sx={{textAlign:'start'}}>
                                    <Typography variant='h6' sx={{color:'#561f5b',fontFamily:'poppins',fontWeight:'500'}} >Posting Type</Typography>
                                    <Typography variant='h7' sx={{fontFamily:'poppins',color:'grey'}} >Post styling and Type setup.</Typography>
                                </Box>
                                <Box>
                                <FormControl sx={{width: 150, }}>
                                        <Select
                                        multiple
                                        displayEmpty
                                        value={personName}
                                        onChange={handleChange}
                                        input={<OutlinedInput />}
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                            return <em></em>;
                                            }

                                            return selected.join(', ');
                                        }}
                                        MenuProps={MenuProps}
                                        inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                        {/* <MenuItem disabled value="">
                                            <em>Placeholder</em>
                                        </MenuItem> */}
                                        {names.map((name) => (
                                            <MenuItem
                                            key={name}
                                            value={name}
                                            style={getStyles(name, personName,)}
                                            >
                                            {name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>

                                </Box>
                            </Stack>
                            
                        </Box>
                    </Box>
                    <Box flex={1} sx={{border:'1px solid red'}}>
                        Preview section
                    </Box>

                </Stack>
            </container>
        </container>
    )
}
export default Templates;