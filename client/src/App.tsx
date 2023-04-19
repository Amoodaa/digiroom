import { Route, Routes } from 'react-router';
import { CssBaseline, ThemeProvider } from 'components/MaterialUI';
import { Home } from 'features/Home';
import { RoomPage } from 'features/Room';
import { Snackbars } from 'components/Snackbar';
import { SnackbarProvider } from 'notistack';
import { UsernameDialoug } from 'components/UsernameDialoug';
import { theme } from 'assets/theme';
import 'assets/fonts';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Snackbars />
      </SnackbarProvider>
      {/* The rest of your application */}
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomName" element={<RoomPage />} />
      </Routes>
      <UsernameDialoug />
    </ThemeProvider>
  );
}
