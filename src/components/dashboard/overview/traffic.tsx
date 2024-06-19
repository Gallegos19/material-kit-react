'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

export interface TrafficProps {
  chartSeries: number[];
  labels: string[];
  sx?: React.CSSProperties;
}

export function Traffic({ chartSeries, labels, sx }: TrafficProps): React.ReactElement {
  const formatPercentage = (value: number) => value.toFixed(2);

  return (
    <Card sx={sx}>
      <CardHeader title="Promedios mensuales" />
      <CardContent>
        <TableContainer>
          <Table>
            <TableBody>
              {labels.map((label, index) => (
                <TableRow key={label}>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2">{label}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">{formatPercentage(chartSeries[index])}%</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
