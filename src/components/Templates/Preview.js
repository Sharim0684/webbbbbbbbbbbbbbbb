import { Typography,Box, Card, CardHeader,Avatar, CardMedia, CardContent, Link } from "@mui/material";
import React from "react";
import BrandLogo from '../Assets/logo symbol png.png'



const Preview=(props)=>{
    const{option,data,file,link}=props
    const message=data
    const date=new Date()

    const getLinkCardview=()=>(
        <Card sx={{border:'',p:2,}}>
            <CardHeader sx={{backgroundColor:'lightgrey',textAlign:"start"}}
                avatar={
                <Avatar sx={{ bgcolor:"red", }} aria-label="recipe">
                    K
                </Avatar>
                }       
                    title="KhkrInnovatorsTechSolutions"
                    subheader={date.toLocaleDateString()}
            />
            <Typography variant="h6" color="#561f5b" sx={{overflowWrap:"break-word",textAlign:'center'}} >{message}</Typography>

            <CardMedia
                component="img"
                height="150"
                width="90%"
                image={file? file : BrandLogo}                
                alt="image"
                sx={{border:'',objectFit:'contain',mb:2,mt:2}}
            />    
            {/* <img src={file?file:BrandLogo} alt="img" style={{width:'100%'}}/> */}
            <CardContent>
                <Link href="#" underline="hover">{link ? link :'www.khkrinnovatorstech.com'}</Link>
            </CardContent>
        </Card> 
    )

    const getOnlyCustomMessageView=()=>(
        <Card sx={{p:2}} >
            <CardHeader sx={{backgroundColor:'lightgrey',textAlign:'start'}}  avatar={
                <Avatar sx={{ bgcolor:"red", }} aria-label="recipe">
                    K
                </Avatar>
                }       
                    title="KhkrInnovatorsTechSolutions"
                    subheader={date.toLocaleDateString()}
            />    
             <CardContent>
                {/* <Link href="#" underline="hover">"https://KHKRInnovatorsTech.com"</Link> */}
                <Typography variant="h6" color="#561f5b" sx={{ overflowWrap: "break-word",textAlign:'start'}}>{data}</Typography>
            </CardContent>    
        </Card>
    )

    const getFeaturedImageView=()=>(
        <Card sx={{p:2}}>
        <CardHeader sx={{backgroundColor:'lightgrey'}}  avatar={
            <Avatar sx={{ bgcolor:"red", }} aria-label="recipe">
                K
            </Avatar>
            }       
                title="KhkrInnovatorsTechSolutions"
                subheader={date.toLocaleDateString()}
        />    
         <CardMedia
                component="img"
                height="150"
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
        <Box sx={{width:"100%",border:''}}>
            <Typography mb={5}>Preview</Typography>
            {getCustomviews(option)}
           
           
            {/* {getLinkCardview()} */}
            {/* {getOnlyCustomMessageView()} */}
            {/* {getFeaturedImageView()} */}
        </Box>
    )
}
export default Preview