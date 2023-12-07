import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { convertDateFormat } from 'src/common/constant/constant';

export const AttendanceCard = ({ avatarSrc, studentName, timeAttendance }) => {
  return (
    <Card>
      <CardContent>
        <Avatar src={avatarSrc} alt="Student Avatar" style={{ width: '250px', height: '250px' }} />

        <Typography variant="h6" component="div" style={{ marginTop: '10px' }}>
          {studentName}
        </Typography>

        <Typography variant="body2" color="text.secondary" style={{ marginTop: '5px' }}>
          {convertDateFormat(timeAttendance)}
        </Typography>
      </CardContent>
    </Card>
  );
};
