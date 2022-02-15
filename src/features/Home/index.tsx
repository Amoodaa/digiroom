import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { FindCourses } from "./FindCoursesForm";
import { FindCoursesResults } from "./FindCoursesResults";
import { NewRoomForm } from "./NewRoomForm";

export const Home = () => {
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              Digi Room
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <NewRoomForm />
        <Divider sx={{ my: 2 }} />
        <FindCourses />
        <FindCoursesResults />
      </Container>
    </>
  );
};
