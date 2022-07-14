import { makeStyles } from '@mui/styles';
import { createTheme } from "@mui/material/styles";

let direction = "ltr";

export const useStyles = makeStyles((theme) => ({
    pie: {
    },
    root: {
        flexGrow: 1,
        width: '100%',
    },
    menuButton: {
        marginRight: '2px',
    },
    title: {
        flexGrow: 1,
    },
    logo: {
        maxWidth: 900,
    },
    container: {
        maxHeight: 440,
    },
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: '#fff',
        border: '2px solid #000',
        boxShadow: 5,
        padding: (2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    modal1: {
        position: 'absolute',
        width: 400,
        backgroundColor: '#fff',
        border: '2px solid #000',
        boxShadow: 5,
        padding: (2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    iconos: {
        cursor: 'pointer'
    },
    inputMaterial: {
        width: '100%'
    }


}));

export const useTheme = createTheme(
    {
        direction: direction,
        palette: {
            mode: "light",
        },
    }
);

