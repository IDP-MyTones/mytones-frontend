import {Artist, SimpleArtist} from "../../models/artist";
import {useEffect, useState} from "react";
import {getHttp} from "../../service/http";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import {blue} from "@mui/material/colors";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import Button from "@mui/material/Button";
import {Track} from "../../models/track";
import {formatDuration} from "../favorites/Favorites";

export interface AddTrackDialogProps {
    open: boolean;
    onClose: (value?: Track) => void;
}

function SimpleDialog(props: AddTrackDialogProps) {
    const { onClose, open } = props;

    const [tracks, setTracks] = useState<Track[]>([]);

    const handleClose = (track?: Track) => {
        onClose(track);
    };

    const handleListItemClick = (track: Track) => {
        onClose(track);
    };

    const fetchTracks = (value: string = '') => {
        if (!value) {
            return setTracks([]);
        }
        getHttp<Track[]>("/tracks/search", {value})
            .then(x => setTracks(x));
    }

    useEffect(fetchTracks, []);

    return (
        <Dialog onClose={() => handleClose()} open={open}>
            <Box sx={{p: '20px', height: '350px', width: '600px'}}>

                <TextField id="outlined-basic" sx={{display: 'flex', width: '100%', }} label="Track name" variant="outlined" onChange={e => fetchTracks(e.target.value)} />

                <List sx={{ pt: 0 }}>
                    {tracks.map((track) => (
                        <ListItem disableGutters key={track.id}>
                            <ListItemButton onClick={() => handleClose(track)} key={track.id}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }} src={track.imageUrl}>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={track.name} />
                                <ListItemText primary={formatDuration(track.duration)} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

        </Dialog>
    );
}

export const AddTrack = ({selectTrack}: {selectTrack: (a?: Track) => void}) => {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value?: Track) => {
        setOpen(false);
        if (value) {
            selectTrack(value);
        }
    };

    return (
        <div>

            <Button variant="contained" onClick={handleClickOpen}>Add track</Button>

            <SimpleDialog
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}