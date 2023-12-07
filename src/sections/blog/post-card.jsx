import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import {Button, CardActions, CardContent, Grid} from "@mui/material";
import Box from "@mui/material/Box";

// ----------------------------------------------------------------------
const bull = (<Box
  component="span"
  sx={{display: 'inline-block', mx: '2px', transform: 'scale(0.8)'}}
>
  •
</Box>);
export default function PostCard({course, setOpen, setCourse}) {
  const handleShowAttendance = () => {
    setOpen(true);
    setCourse({...course});
  }

  return (<Grid item xs={3}>
    <Card sx={{minWidth: 275}}>
      <CardContent>
        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
          {course?.id}
        </Typography>
        <Typography variant="h5" component="div">
          {course?.name}
        </Typography>
        <Typography sx={{mb: 1.5}} color="text.secondary">
          {course?.numberCredits} tín chỉ
        </Typography>
        <Typography variant="body2">
          Sô lượng các tiết học: {Object.values(course?.sessions || {}).reduce((count, session) => {
          return count + Object.values(session).filter(value => value === true).length;
        }, 0)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleShowAttendance} size="small">Xem điểm danh</Button>
      </CardActions>
    </Card>
  </Grid>);
}

