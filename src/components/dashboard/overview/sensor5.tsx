import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
//import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';
import {DropHalfBottom} from "@phosphor-icons/react/dist/ssr/DropHalfBottom"


export interface Sensor5Props {
  sx?: SxProps;
  value: number;
}

export function Sensor5({ value, sx }: Sensor5Props): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Sensor 5
            </Typography>
            <Typography variant="h4">{value}%</Typography>
          </Stack>
          <Avatar sx={{ backgroundColor: 'var(--mui-palette-secondary-main)', height: '56px', width: '56px' }}>
            <DropHalfBottom fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
