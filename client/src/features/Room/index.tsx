import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import ReactPlayer from 'react-player/youtube';
import { useParams } from 'react-router';
import { Header } from '../../components/Header';
import { ChatMessage as IChatMessage, exampleChat, exampleYTUrl } from './data';

export const ChatMessage: FC<{ chatItem: IChatMessage }> = ({ chatItem }) => (
  <Typography>
    [{chatItem.at.toLocaleTimeString()}] {chatItem.senderName}
    {chatItem.type === 'chat' ? ': ' : ' '}
    {chatItem.content}
  </Typography>
);

export const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();
  return (
    <>
      <Header roomId={roomId} />
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <Box maxWidth="50%" sx={{ p: 2 }}>
          <ReactPlayer url={exampleYTUrl} controls={false} />
          <Divider sx={{ my: 2 }} />
          <Paper variant="outlined">
            <Box display="flex" flexDirection="column" justifyContent="flex-end" height="40vh" p={2}>
              <Box mb={3}>
                {exampleChat.map(msg => (
                  <ChatMessage chatItem={msg} />
                ))}
              </Box>

              <TextField
                sx={{ justifySelf: 'flex-end' }}
                placeholder="Send a message"
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <IconButton color="primary">
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};
