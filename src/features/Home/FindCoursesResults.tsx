import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { examplePlaylistSearch } from "./data";

export const FindCoursesResults = () => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      {examplePlaylistSearch.items.map(
        ({
          id: { playlistId, kind },
          snippet: { thumbnails, description, title },
        }) => (
          <Card
            sx={{
              width: 320,
              m: 2,
            }}
            key={kind + playlistId}
          >
            <CardMedia
              component="img"
              height="140"
              image={thumbnails.high.url}
              alt={title}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "calc(100% - 140px)",
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {title}
                </Typography>
                {description && (
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button onClick={() => playlistId}>Start this course!</Button>
              </CardActions>
            </Box>
          </Card>
        )
      )}
    </Box>
  );
};
