import { Link as RouterLink } from 'react-router-dom';
import { Link, AppBar, Container, Toolbar, Typography } from 'components/MaterialUI';
import { useAppDispatch } from 'app/hooks';
import { roomActions } from 'slices/room/slice';

export const Header = ({ roomName = '' }) => {
  const dispatch = useAppDispatch();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ mr: 2, display: 'flex' }}
            onClick={() => dispatch(roomActions.resetRoom())}
          >
            <Link
              component={RouterLink}
              to="/"
              sx={{ color: '#f2f2f2', textDecoration: 'none', mr: '0.5rem' }}
            >
              Digi Room
            </Link>
            {roomName ? `- ${roomName}` : ''}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
