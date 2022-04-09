import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const Header = ({ roomId = '' }) => (
  <AppBar position="static">
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Typography variant="h5" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
          Digi Room
        </Typography>
      </Toolbar>
    </Container>
  </AppBar>
);
