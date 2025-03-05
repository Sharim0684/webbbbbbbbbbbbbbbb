import { Typography,Box, Card, CardHeader,Avatar, CardMedia, CardContent, Link } from "@mui/material";
import React from "react";
import BrandLogo from '../Assets/logo symbol png.png'



const Preview=(props)=>{
    const{option}=props
    const date=new Date()

    const getLinkCardview=()=>(
        <Card sx={{border:'1px solid blue'}}>
            <CardHeader
                avatar={
                <Avatar sx={{ bgcolor:"red", }} aria-label="recipe">
                    K
                </Avatar>
                }       
                    title="KhkrInnovatorsTechSolutions"
                    subheader={date.toLocaleDateString()}
            />

            <CardMedia
                component="img"
                height="190"
                width="90%"
                image={BrandLogo}                
                alt="image"
                sx={{border:'',objectFit:'contain'}}
            />    
            <CardContent>
                <Link href="#" underline="hover">"https://KHKRInnovatorsTech.com"</Link>
            </CardContent>
        </Card> 
    )

    const getOnlyCustomMessageView=()=>(
        <Card>
            <CardHeader  avatar={
                <Avatar sx={{ bgcolor:"red", }} aria-label="recipe">
                    K
                </Avatar>
                }       
                    title="KhkrInnovatorsTechSolutions"
                    subheader={date.toLocaleDateString()}
            />    
             <CardContent>
                <Link href="#" underline="hover">"https://KHKRInnovatorsTech.com"</Link>
            </CardContent>    
        </Card>
    )

    const getFeaturedImageView=()=>(
        <Card>
        <CardHeader  avatar={
            <Avatar sx={{ bgcolor:"red", }} aria-label="recipe">
                K
            </Avatar>
            }       
                title="KhkrInnovatorsTechSolutions"
                subheader={date.toLocaleDateString()}
        />    
         <CardMedia
                component="img"
                height="190"
                width="90%"
                image={BrandLogo}                
                alt="image"
                sx={{border:'',objectFit:'contain'}}
            /> 
            
    </Card>
        
    )

    const getCustomviews=(option)=>{
        switch (option) {

            case "Link Card":
                return getLinkCardview();
                

            case 'Featured Image':
                return getFeaturedImageView();
               

            case 'Only Custom message':
                return getOnlyCustomMessageView();
                

            default:
               return null
            }


    }

    


    return(
        <Box>
            <Typography mb={5}>Preview</Typography>
            {getCustomviews(option)}
           
           
            {/* {getLinkCardview()} */}
            {/* {getOnlyCustomMessageView()} */}
            {/* {getFeaturedImageView()} */}
        </Box>
    )
}
export default Preview