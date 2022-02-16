import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { FindCourses } from "./FindCoursesForm";
import { FindCoursesResults } from "./FindCoursesResults";
import { Header } from "../../components/Header";
import { NewRoomForm } from "./NewRoomForm";

export const Home = () => {
  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <NewRoomForm />
        <Divider sx={{ my: 2 }} />
        <FindCourses />
        <FindCoursesResults />
      </Container>
    </>
  );
};
