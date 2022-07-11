/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React from 'react';

import Paper from '@mui/material/Paper';
import { useTheme, useStyles } from "./styles.js"
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


const dataSet1 = [];

const Excel = ({ url }) => {

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
