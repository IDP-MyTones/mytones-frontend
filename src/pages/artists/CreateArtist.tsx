import {useState} from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import * as React from "react";
import Button from "@mui/material/Button";
import {ImageLoader} from "../../components/images/loading";
import NoImage from '../../assets/images/no-img.png'
import {simplePostHttp} from "../../service/http";
import {store} from "../../store/store";
import {error, success} from "../../store/snack.reducer";
import {urlToBase64} from "../upload/Upload";
export interface BaseArtist {
    imageUrl?: string;
    name?: string;
    description?: string;
}

export interface CreateArtistDialogProps {
    open: boolean;
    onClose: (baseArtist?: BaseArtist) => void;
    onCreated: any;
}

function SimpleDialog(props: CreateArtistDialogProps) {
    const { onClose, open, onCreated } = props;

    const [artist, setArtist] = useState<BaseArtist>({})
    const handleClose = () => {
        onClose(artist)
    };

    const save = () => {

        const dto = {
            name: artist.name,
            description: artist.description,
            imageContent: urlToBase64(artist.imageUrl)
        }

        simplePostHttp("/artists", dto)
            .then(() => store.dispatch(success("Artist added")))
            .catch(() => store.dispatch(error("Error on adding artist")))
            .then(handleClose)
            .then(onCreated)
    }

    return (
        <Dialog onClose={() => handleClose()} open={open}>
            <Box sx={{p: '20px', width: '600px', overflowX: 'hidden'}}>
                <div className="relative mb-4 flex w-64 items-center justify-center">
                    <ImageLoader onChange={url => setArtist({...artist, imageUrl: url})} url={artist.imageUrl || NoImage} />
                </div>
                <div>
                    <TextField id="outlined-basic" sx={{display: 'flex', width: '100%', marginBottom: '15px' }} label="Name" variant="outlined"
                        value={artist.name || ''} onChange={e => setArtist({...artist, name: e.target.value})}/>
                </div>
                <div>
                    <TextField sx={{display: 'flex', width: '100%', }}
                        id="outlined-multiline-static"
                        label="Description"
                        multiline
                        rows={4}
                        value={artist.description}
                        onChange={e => setArtist({...artist, description: e.target.value})}
                    />
                </div>

                <div className="mt-3">
                    <Button variant="contained" onClick={save}>Save artist</Button>
                </div>
            </Box>

        </Dialog>
    );
}

export const CreateArtist = (props: {handleCreated: any}) => {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value?: BaseArtist) => {
        setOpen(false);
    }

    return (
        <div>

            <Button variant="contained" onClick={handleClickOpen}>Add artist</Button>

            <SimpleDialog
                open={open}
                onClose={handleClose}
                onCreated={props.handleCreated}
            />
        </div>
    );
}