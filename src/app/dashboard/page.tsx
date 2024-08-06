// Importaciones de componentes y bibliotecas necesarias para el diseño y funcionalidad
"use client"; // Indica que este código se ejecuta en el lado del cliente (navegador)

import * as React from "react"; // Importa la biblioteca React para construir la interfaz de usuario
import Grid from "@mui/material/Grid"; // Importa el componente Grid de Material-UI para el diseño de la página
import Box from "@mui/material/Box"; // Importa el componente Box de Material-UI para contenedores de diseño
import CircularProgress from "@mui/material/CircularProgress"; // Importa el componente CircularProgress para mostrar un indicador de carga
import { paths } from "@/paths"; // Importa rutas de API desde un archivo de configuración
import { Sensor } from "@/components/dashboard/overview/budget"; // Importa un componente Sensor personalizado desde una ruta específica
import Table from "@mui/material/Table"; // Importa el componente Table para tablas de datos
import TableBody from "@mui/material/TableBody"; // Importa el componente TableBody para el cuerpo de la tabla
import TableCell from "@mui/material/TableCell"; // Importa el componente TableCell para celdas de la tabla
import TableContainer from "@mui/material/TableContainer"; // Importa el componente TableContainer para el contenedor de la tabla
import TableHead from "@mui/material/TableHead"; // Importa el componente TableHead para el encabezado de la tabla
import TableRow from "@mui/material/TableRow"; // Importa el componente TableRow para filas de la tabla
import Typography from "@mui/material/Typography"; // Importa el componente Typography para texto con estilo
import Snackbar from "@mui/material/Snackbar"; // Importa el componente Snackbar para notificaciones
import Alert from "@mui/material/Alert"; // Importa el componente Alert para alertas dentro de Snackbar
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Label,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Brush,
} from "recharts"; // Importa varios componentes de Recharts para gráficos

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"]; // Define una serie de colores para los gráficos

export default function Page(): React.JSX.Element {
  // Define un componente funcional en React llamado Page

  // Define estados locales para almacenar datos y controlar el comportamiento del componente
  const [sensorData, setSensorData] = React.useState<any>(null); // Estado para almacenar datos de sensores
  const [averageData, setAverageData] = React.useState<{ avgMes: number; avgTemperature: number; avgHumidity: number } | null>(null); // Estado para almacenar datos promedio
  const [dataBetweenDates, setDataBetweenDates] = React.useState<any[]>([]); // Estado para almacenar datos entre fechas específicas
  const [openSnackbar, setOpenSnackbar] = React.useState(false); // Estado para controlar la visibilidad de Snackbar
  const [snackbarMessage, setSnackbarMessage] = React.useState(""); // Estado para almacenar el mensaje de Snackbar

  // Efecto para obtener datos de sensores cada 5 segundos
  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${paths.api}data/`); // Hace una solicitud a la API para obtener datos de sensores
        const result = await response.json(); // Convierte la respuesta en formato JSON
        setSensorData(result[0]); // Almacena los datos de sensores en el estado local
        checkThresholds(result[0]); // Verifica si los datos están fuera de los rangos normales
      } catch (error) {
        console.error("Error fetching sensor data:", error); // Muestra un mensaje de error si la solicitud falla
      }
    }

    fetchData(); // Llama a la función fetchData inmediatamente
    const sensorIntervalId = setInterval(fetchData, 5000); // Configura un intervalo para llamar a fetchData cada 5 segundos

    return () => clearInterval(sensorIntervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  // Efecto para obtener datos promedio cada 30 segundos
  React.useEffect(() => {
    async function fetchAverageData() {
      try {
        const response = await fetch(`${paths.api}data/average`); // Hace una solicitud a la API para obtener datos promedio
        const result = await response.json(); // Convierte la respuesta en formato JSON
        setAverageData({
          avgMes: result[0]._id, // Almacena el mes promedio
          avgTemperature: result[0].avgTemperature, // Almacena la temperatura promedio
          avgHumidity: result[0].avgHumidity, // Almacena la humedad promedio
        });
      } catch (error) {
        console.error("Error fetching average data:", error); // Muestra un mensaje de error si la solicitud falla
      }
    }

    fetchAverageData(); // Llama a la función fetchAverageData inmediatamente
    const averageIntervalId = setInterval(fetchAverageData, 30000); // Configura un intervalo para llamar a fetchAverageData cada 30 segundos

    return () => clearInterval(averageIntervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  // Efecto para obtener datos entre fechas específicas cada 5 segundos
  React.useEffect(() => {
    const fetchDataBetweenDates = async () => {
      try {
        const startDate = "2024-06-01T00:00:00.000Z"; // Define la fecha de inicio
        const endDate = "2024-08-30T00:00:00.000Z"; // Define la fecha de fin
        const url = `${paths.api}data/dates?dateStart=${encodeURIComponent(startDate)}&dateEnd=${encodeURIComponent(endDate)}`; // Construye la URL para la solicitud

        const response = await fetch(url); // Hace una solicitud a la API para obtener datos entre fechas
        const result = await response.json(); // Convierte la respuesta en formato JSON
        setDataBetweenDates(result); // Almacena los datos entre fechas en el estado local
      } catch (error) {
        console.error("Error fetching data:", error); // Muestra un mensaje de error si la solicitud falla
      }
    };

    fetchDataBetweenDates(); // Llama a la función fetchDataBetweenDates inmediatamente
    const datesIntervalId = setInterval(fetchDataBetweenDates, 5000); // Configura un intervalo para llamar a fetchDataBetweenDates cada 5 segundos

    return () => clearInterval(datesIntervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  // Función para verificar si los datos están fuera de los rangos normales
  const checkThresholds = (sensorData: any) => {
    let message = "";
    if (sensorData.temperature1 < 21 || sensorData.temperature1 > 26) {
      message += `Temperatura fuera de rango: ${sensorData.temperature1}°C. `;
    }
    if (sensorData.humidity1 < 30 || sensorData.humidity1 > 60) {
      message += `Humedad fuera de rango: ${sensorData.humidity1}%. `;
    }
    if (sensorData.temperature2 < 21 || sensorData.temperature2 > 26) {
      message += `Temperatura fuera de rango: ${sensorData.temperature2}°C. `;
    }
    if (sensorData.humidity2 < 30 || sensorData.humidity2 > 60) {
      message += `Humedad fuera de rango: ${sensorData.humidity2}%. `;
    }
    if (sensorData.temperature3 < 21 || sensorData.temperature3 > 26) {
      message += `Temperatura fuera de rango: ${sensorData.temperature3}°C. `;
    }
    if (sensorData.humidity3 < 30 || sensorData.humidity3 > 60) {
      message += `Humedad fuera de rango: ${sensorData.humidity3}%. `;
    }
    if (sensorData.temperature4 < 21 || sensorData.temperature4 > 26) {
      message += `Temperatura fuera de rango: ${sensorData.temperature4}°C. `;
    }
    if (sensorData.humidity4 < 30 || sensorData.humidity4 > 60) {
      message += `Humedad fuera de rango: ${sensorData.humidity4}%. `;
    }
    if (message) {
      setSnackbarMessage(message); // Almacena el mensaje de alerta en el estado local
      setOpenSnackbar(true); // Muestra el Snackbar
    }
  };

  // Muestra un indicador de carga si los datos aún no se han cargado
  if (!sensorData || !averageData || dataBetweenDates.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Función para cerrar el Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Datos para el gráfico de pastel de temperatura
  const temperatureData = [
    { name: "Temperatura", value: averageData.avgTemperature },
    { name: "Rest", value: 100 - averageData.avgTemperature },
  ];

  // Datos para el gráfico de pastel de humedad
  const humidityData = [
    { name: "Humedad", value: averageData.avgHumidity },
    { name: "Rest", value: 100 - averageData.avgHumidity },
  ];

  // Preparar datos para la gráfica de ojiva
  const ojivaData = dataBetweenDates.map((data) => ({
    date: new Date(data.dateRegistered).toLocaleDateString(),
    temperature: data.temperature1,
    humedity: data.humidity1,
  }));

  // Renderiza la interfaz de usuario
  return (
    <Grid container spacing={3}>
      {/* Muestra los datos de los sensores en un diseño de cuadrícula */}
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature1} humidity={sensorData.humidity1} sx={{ height: "100%" }} />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature2} humidity={sensorData.humidity2} sx={{ height: "100%" }} />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature3} humidity={sensorData.humidity3} sx={{ height: "100%" }} />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature4} humidity={sensorData.humidity4} sx={{ height: "100%" }} />
      </Grid>
      <Grid item lg={3} sm={6} xs={12}>
        <Sensor temperature={sensorData.temperature5} humidity={sensorData.humidity5} sx={{ height: "100%" }} />
      </Grid>
      <Box width="100%" height={5} />
      <Grid item lg={3} xs={12}>
        <Typography variant="h6">Temperatura promedio</Typography>
        <PieChart width={200} height={200}>
          <Pie
            data={temperatureData}
            cx={100}
            cy={100}
            innerRadius={50}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {temperatureData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label value={`${averageData.avgTemperature.toFixed(2)} °C`} position="center" fill="#000" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Grid>
      <Grid item lg={3} xs={12}>
        <Typography variant="h6">Humedad relativa</Typography>
        <PieChart width={200} height={200}>
          <Pie
            data={humidityData}
            cx={100}
            cy={100}
            innerRadius={50}
            outerRadius={80}
            fill="#82ca9d"
            paddingAngle={5}
            dataKey="value"
          >
            {humidityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label value={`${averageData.avgHumidity.toFixed(2)} %`} position="center" fill="#000" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Grid>
      <Box width="100%" height={20} />
      <Grid item lg={12} md={6} xs={12}>
        <TableContainer component={Box} sx={{ maxHeight: 400 }}>
          <Table stickyHeader aria-label="data-between-dates-table">
            <TableHead>
              <TableRow>
                <TableCell>Fecha Registrada</TableCell>
                <TableCell>Temperatura 1</TableCell>
                <TableCell>Temperatura 2</TableCell>
                <TableCell>Temperatura 3</TableCell>
                <TableCell>Temperatura 4</TableCell>
                <TableCell>Temperatura 5</TableCell>
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
      <Box width="100%" height={20} />
      <Grid item lg={12} md={6} xs={12}>
        <Typography variant="h6" gutterBottom>
          Ojiva de Temperaturas
        </Typography>
        <LineChart width={900} height={500} data={ojivaData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="humedity" stroke="#8084d8" />
          <Line type="monotone" dataKey="temperature" stroke="#69adfa" />
          <Brush />
        </LineChart>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
