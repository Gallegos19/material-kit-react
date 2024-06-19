// src/pages/index.tsx
"use client"

import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { paths } from '@/paths';
import { Sensor } from '@/components/dashboard/overview/budget';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

export default function Page(): React.JSX.Element {
  const [sensorData, setSensorData] = React.useState<any>(null);
  const [averageData, setAverageData] = React.useState<{ avgMes: number; avgTemperature: number; avgHumidity: number } | null>(
    null
  );
  const [dataBetweenDates, setDataBetweenDates] = React.useState<any[]>([]);

  // Fetch sensor data
  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${paths.api}data/`);
        const result = await response.json();
        setSensorData(result[0]);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    }

    fetchData();
    const sensorIntervalId = setInterval(fetchData, 5000);

    return () => clearInterval(sensorIntervalId);
  }, []);

  // Fetch average data
  React.useEffect(() => {
    async function fetchAverageData() {
      try {
        const response = await fetch(`${paths.api}data/average`);
        const result = await response.json();
        setAverageData({
          avgMes: result[0]._id,
          avgTemperature: result[0].avgTemperature,
          avgHumidity: result[0].avgHumidity,
        });
      } catch (error) {
        console.error('Error fetching average data:', error);
      }
    }

    fetchAverageData();
    const averageIntervalId = setInterval(fetchAverageData, 30000);

    return () => clearInterval(averageIntervalId);
  }, []);

  // Fetch data between dates
  React.useEffect(() => {
    const fetchDataBetweenDates = async () => {
      try {
        const startDate = '2024-06-01T00:00:00.000Z';
        const endDate = '2024-06-30T00:00:00.000Z';
        const url = `${paths.api}data/dates?dateStart=${encodeURIComponent(startDate)}&dateEnd=${encodeURIComponent(endDate)}`;

        const response = await fetch(url);
        const result = await response.json();
        setDataBetweenDates(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataBetweenDates();
    const datesIntervalId = setInterval(fetchDataBetweenDates, 5000);

    return () => clearInterval(datesIntervalId);
  }, []);

  if (!sensorData || !averageData || dataBetweenDates.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature1} humidity={sensorData.humidity1} sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature2} humidity={sensorData.humidity2} sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature3} humidity={sensorData.humidity3} sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature4} humidity={sensorData.humidity4} sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature5} humidity={sensorData.humidity5} sx={{ height: '100%' }} />
      </Grid>
      <Box width="100%" height={5} />
      <Grid item lg={3} xs={12}>
        <TableContainer component={Box} sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="average-data-table">
            <TableHead>
              <TableRow>
                <TableCell>No. Mes</TableCell>
                <TableCell>Temperatura promedio</TableCell>
                <TableCell>Humedad promedio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={averageData.avgMes}>
                <TableCell>{averageData.avgMes}</TableCell>
                <TableCell>{averageData.avgTemperature.toFixed(2)} °C</TableCell>
                <TableCell>{averageData.avgHumidity.toFixed(2)} %</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Box width="100%" height={20} />


      <Grid item lg={12} md={6} xs={12}>
        <TableContainer component={Box} sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="data-between-dates-table">
            <TableHead>
              <TableRow>
                <TableCell>Fecha Registrada</TableCell>
                <TableCell>Temperatura 1 </TableCell>
                <TableCell>Temperatura 2 </TableCell>
                <TableCell>Temperatura 3 </TableCell>
                <TableCell>Temperatura 4 </TableCell>
                <TableCell>Temperatura 5 </TableCell>
                <TableCell>Humedad 1</TableCell>
                <TableCell>Humedad 2</TableCell>
                <TableCell>Humedad 3</TableCell>
                <TableCell>Humedad 4</TableCell>
                <TableCell>Humedad 5</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataBetweenDates.map((data) => (
                <TableRow key={data._id}>
                  <TableCell>{data.dateRegistered}</TableCell>
                  <TableCell>{data.temperature1}°C</TableCell>
                  <TableCell>{data.temperature2}°C</TableCell>
                  <TableCell>{data.temperature3}°C</TableCell>
                  <TableCell>{data.temperature4}°C</TableCell>
                  <TableCell>{data.temperature5}°C</TableCell>
                  <TableCell>{data.humidity1}%</TableCell>
                  <TableCell>{data.humidity2}%</TableCell>
                  <TableCell>{data.humidity3}%</TableCell>
                  <TableCell>{data.humidity4}%</TableCell>
                  <TableCell>{data.humidity5}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
