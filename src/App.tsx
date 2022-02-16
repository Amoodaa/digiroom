import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { red } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Home } from "features/Home";
import { Room } from "features/Room";
import { Route, Routes } from "react-router";

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* The rest of your application */}
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </ThemeProvider>
  );
}
