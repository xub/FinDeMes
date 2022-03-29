/**
 * PWA FinDeFes
 * update 04/2022
 * By Sergio Sam 
 */

import React, { useState, useEffect } from "react";

import Paper from '@mui/material/Paper';
import { Button } from '@mui/material/';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import ReactECharts from 'echarts-for-react';

import UserService from "../services/user.service";

export default function Graficos(props) {
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
      <Breadcrumbs aria-label="breadcrumb">
        <Button style={{ color: "#fff", backgroundColor: "#2e7d32", }} variant="contained" onClick={() => inicio()}>Inicio</Button>
      </Breadcrumbs>
      <ReactECharts option={options} />
    </Paper>
  );
}