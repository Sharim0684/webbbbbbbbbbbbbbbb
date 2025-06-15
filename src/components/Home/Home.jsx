import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Social Media Manager
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Manage your social media posts across multiple platforms
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="140"
              image="/images/facebook.png"
              alt="Facebook"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Facebook
              </Typography>
              <Typography>
                Manage your Facebook posts and schedule content
              </Typography>
              <Button
                component={RouterLink}
                to="/add-accounts"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Connect Facebook
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="140"
              image="/images/linkedin.png"
              alt="LinkedIn"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                LinkedIn
              </Typography>
              <Typography>
                Manage your LinkedIn posts and schedule content
              </Typography>
              <Button
                component={RouterLink}
                to="/add-accounts"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Connect LinkedIn
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" component="h2" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Multi-Platform Support
                  </Typography>
                  <Typography>
                    Post content to multiple social media platforms simultaneously
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Content Scheduling
                  </Typography>
                  <Typography>
                    Schedule your posts to be published at optimal times
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
