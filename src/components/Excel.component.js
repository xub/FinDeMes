/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React from 'react';

import Paper from '@mui/material/Paper';

import { makeStyles } from '@mui/styles';

import ReactExport from "react-export-excel";


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
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
    iconos: {
        cursor: 'pointer'
    },
    inputMaterial: {
        width: '100%'
    }
}));

const dataSet1 = [];

const Excel = ({ url }) => {

    const styles = useStyles();
    const classes = useStyles();

    return (
        <Paper className={classes.root}>

            <ExcelFile>
                <ExcelSheet data={url} name="Balance">
                    <ExcelColumn label="Nombre" value="nombre" />
                    <ExcelColumn label="Importe" value="importe" />
                </ExcelSheet>
            </ExcelFile>

        </Paper>
    );
}
export default Excel;
