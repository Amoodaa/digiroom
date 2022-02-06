import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import { NewRoomForm } from "./NewRoomForm";
import { FindCourses } from "./FindCoursesForm";
import { FindCoursesResults } from "./FindCoursesResults";

export const Home = () => {
  return (
    <Container maxWidth="xl" sx={{ p: 2 }}>
      <NewRoomForm />
      <Divider sx={{ my: 2 }} />
      <FindCourses />
      <FindCoursesResults />
    </Container>
  );
};
