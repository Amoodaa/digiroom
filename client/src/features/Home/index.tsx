import { useState } from 'react';
import { Header } from 'components/Header';
import { Container, Divider } from 'components/MaterialUI';
import { Searchbar } from './Searchbar';
import { SearchResults } from './SearchResults';
import { NewRoomForm } from './NewRoomForm';
import { RoomNameForm } from './RoomNameForm';

export const Home = () => {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);

  const handleSubmit = (formYoutubeUrl: string) => {
    setYoutubeUrl(formYoutubeUrl);
    setOpen(true);
  };

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ p: 2 }}>
        <NewRoomForm onSubmit={({ youtubeUrl }) => handleSubmit(youtubeUrl)} />
        <RoomNameForm open={open} handleClose={handleClose} youtubeUrl={youtubeUrl} />
        <Divider sx={{ my: 2 }} />
        <Searchbar />
        <SearchResults onYoutubeClick={handleSubmit} />
      </Container>
    </>
  );
};
