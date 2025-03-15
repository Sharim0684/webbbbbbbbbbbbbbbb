import React from "react";
import { Container } from "react-bootstrap";
import NotFoundImg from '../Assets/404-pages.png'
import { Box, Button, Stack,} from "@mui/material";

const NotFoundPage=()=>(
    <Container>
      <Stack spacing={5} mt={5} direction='column' justifyContent='center' alignItems='center' sx={{display:''}}>
        <Box sx={{border:''}}>
            <img src={NotFoundImg} alt="404 NotFound" style={{width:'100%'}} />
        </Box>
        <Box>
            <Button variant="outlined" color="error">Back</Button>
        </Box>
      </Stack>

    </Container>
)
export default NotFoundPage;