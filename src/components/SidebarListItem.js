import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import {Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';



const SidebarListItem=(props)=>{
    const {platform,deleteMedia}=props
    const{icon,name}=platform

    const deleteItem=()=>{
        deleteMedia(name)
    }

    return(
        <Box sx={{display:'flex',justifyContent:'space-around',alignItems:'center',border:''}}>
            {icon}
            <Typography sx={{color:'#561f5b', width:'200px',border:''}} variant="h6"  >{name}</Typography>
            {/* <Button sx={{color:'#561f5b',mr:10,}} ><DeleteIcon /></Button> */}
            <IconButton aria-label="delete" sx={{mr:10}} onClick={deleteItem}><DeleteIcon sx={{fontSize:"20px"}} /></IconButton>
        </Box>

    )
}
export default SidebarListItem;