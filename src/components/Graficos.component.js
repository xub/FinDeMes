/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React, { useState, useEffect } from "react";

import { Button } from '@mui/material/';

import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Typography from '@mui/material/Typography';

import ReactECharts from 'echarts-for-react';

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

import { useOnlineStatus } from "./useOnlineStatus";

export default function Graficos(props) {

  const isOnline = useOnlineStatus();

  const [currentUser, setCurrentUser] = useState(undefined);
  const [showClienteBoard, setShowClienteBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const [data1, setData1] = useState([]);
  const [labels, setLabels] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);

  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: labels,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        //data: [820, 932, 901, 934, 1290, 1330, 1320],
        data: gastos,
        type: 'bar',
        smooth: true,
      },
      {
        //data: [820, 932, 901, 934, 1290, 1330, 1320],
        data: ingresos,
        type: 'bar',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  useEffect(() => {

    // si no hay user hay que loguearse 
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowClienteBoard(user.roles.includes("ROLE_USER"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    } else {
      props.history.push(process.env.PUBLIC_URL + "/login");
    }

    const GetData = async () => {
      try {
        const result = await UserService.getGrafico();
        if (result) {
          setData1(result.data);
          //console.log(result.data);

          var dataNueva = result.data;
          dataNueva.map(consola => {
            //console.log(consola.gastos);
            setLabels(consola.labels);
            setGastos(consola.gastos);
            setIngresos(consola.ingresos);
          })

        } else {
          props.history.push(process.env.PUBLIC_URL + "/login");
        }
      } catch (e) {
        props.history.push(process.env.PUBLIC_URL + "/login");
      }
    }
    GetData();

  }, []);

  const inicio = () => {
    props.history.push(process.env.PUBLIC_URL + "/")
  }

  return (
    <Paper>

      <AppBar style={{ background: '#fff159', alignItems: 'center' }} position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}

          >
            <ArrowBackIcon style={{ color: '#000' }} onClick={() => inicio()} />
          </IconButton>
          <Typography variant="h4" component="div" style={{ color: '#000' }} sx={{ flexGrow: 1 }}>
            Excel con totales por categorias
          </Typography>
        </Toolbar>
      </AppBar>

      <ReactECharts option={options} />
    </Paper>
  );
}