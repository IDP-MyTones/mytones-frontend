import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {SnackState} from "../../store/snack.reducer";
import React, {useEffect, useState} from "react";
import {Alert, Snackbar} from "@mui/material";

export const Snack = () => {
    const snackState = useSelector<RootState>(state => state.snack) as SnackState;
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (snackState.message) {
            setOpen(true);
        }

    }, [snackState])

    const handleCloseSnackbar = () => {
        setOpen(false);
    }


    return  <Snackbar open={open} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} key={snackState.timestamp} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackState.level} sx={{ width: '100%' }}>
            {snackState.message}
        </Alert>
    </Snackbar>

}