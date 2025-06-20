import * as React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import BrandLogo from '../Assets/Innovators-Tech-Black 1.svg';

const pages = ['Accounts', 'Share Now'];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'white',
        width: '100%',
        boxShadow: '',
      }}
    >
      <Container maxWidth={false} sx={{ padding: { xs: '0 16px', md: '0 24px' } }}>
        <Toolbar disableGutters>
          {/* Brand Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ width: { xs: '150px', md: '200px' }, cursor: 'pointer' }}>
              <img src={BrandLogo} alt="Brand Logo" style={{ height: "50px" }} className="mb-3" />
            </Box>
          </Link>

          {/* Mobile Menu */}
          {isMobile ? (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon sx={{ color: '#561f5b' }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => {
                  const route =
                    page === 'Accounts'
                      ? '/add-accounts'
                      : page === 'Share Now'
                      ? '/sharePost'
                      : '/';

                  return (
                    <Link key={page} to={route} style={{ textDecoration: 'none', width: '100%' }}>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Typography
                          textAlign="center"
                          sx={{
                            color: '#561f5b',
                            fontFamily: 'poppins',
                            fontWeight: '600',
                            fontSize: '16px',
                          }}
                        >
                          {page}
                        </Typography>
                      </MenuItem>
                    </Link>
                  );
                })}
              </Menu>
            </Box>
          ) : (
            // Desktop Menu
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {pages.map((page) => {
                const route =
                  page === 'Accounts'
                    ? '/add-accounts'
                    : page === 'Share Now'
                    ? '/sharePost'
                    : '/';

                return (
                  <Link key={page} to={route} style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="hr"
                      sx={{
                        mr: 3,
                        color: '#561f5b',
                        fontFamily: 'poppins',
                        fontWeight: '600',
                        fontSize: '16px',
                        '&:hover': { color: '#420f45' },
                      }}
                    >
                      {page}
                    </Typography>
                  </Link>
                );
              })}
            </Box>
          )}

          {/* User Avatar and Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="avatar" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Link style={{ textDecoration: 'none' }} to="/profile">
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center', color: '#561f5b' }}>Profile</Typography>
                </MenuItem>
              </Link>
              <Link style={{ textDecoration: 'none' }} to="/history">
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center', color: '#561f5b' }}>Resent Post</Typography>
                </MenuItem>
              </Link>
              <Link style={{ textDecoration: 'none' }} to="/login">
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center', color: '#561f5b' }}>Logout</Typography>
                </MenuItem>
              </Link>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;