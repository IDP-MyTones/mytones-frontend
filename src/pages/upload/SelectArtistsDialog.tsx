import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import { blue } from '@mui/material/colors';
import {Artist, SimpleArtist} from "../../models/artist";
import {getHttp} from "../../service/http";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Icon } from '@mui/material';
import { Page } from 'src/utils/pagination';


export interface SimpleDialogProps {
    open: boolean;
    onClose: (value?: Artist) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, open } = props;

    const [artists, setArtists] = useState<Artist[]>([]);

    const handleClose = (artist?: Artist) => {
        onClose(artist);
    };

    const handleListItemClick = (artist: Artist) => {
        onClose(artist);
    };

    const fetchArtists = (value: string = '') => {
        if (!value) {
            return setArtists([]);
        }
        getHttp<Artist[]>("/artists/search", {value})
            .then(x => setArtists(x));
    }

    useEffect(fetchArtists, []);

    return (
        <Dialog onClose={() => handleClose()} open={open}>
            <Box sx={{p: '20px', height: '350px'}}>

            <TextField id="outlined-basic" label="Artist name" variant="outlined" onChange={e => fetchArtists(e.target.value)} />

            <List sx={{ pt: 0 }}>
                {artists.map((artist) => (
                    <ListItem disableGutters key={artist.id}>
                        <ListItemButton onClick={() => handleClose(artist)} key={artist.id}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }} src={artist.imageUrl}>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={artist.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            </Box>

        </Dialog>
    );
}

export const SelectArtists = (props: {selectedArtists: SimpleArtist[], setSelectedArtists: (a: SimpleArtist[]) => void}) => {
    const [open, setOpen] = React.useState(false);
    let { selectedArtists, setSelectedArtists } = props;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value?: Artist) => {
        setOpen(false);
        if (value) {
            selectedArtists = [...selectedArtists, value];
            setSelectedArtists(selectedArtists);
        }
    };

    const remove = (artist?: SimpleArtist) => {
        setSelectedArtists(selectedArtists.filter(a => a.id !== artist?.id))
    }

    return (
        <div>
            {
                selectedArtists.map(artist => <Button key={artist.id} onClick={() => remove(artist)}><Avatar src={artist.imageUrl}/></Button>)
            }
            <Button onClick={handleClickOpen}>
                <Icon baseClassName="fas" className="fa-plus-circle" sx={{ fontSize: 30, color: "black" }} />
            </Button>
            <SimpleDialog
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}