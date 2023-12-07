import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { child, get, getDatabase, ref } from 'firebase/database';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { Grid, Chip } from '@mui/material';
// ----------------------------------------------------------------------

export default function TeacherDetailView() {
  const { teacherId } = useParams();
  const [courseNames, setCourseNames] = useState([]);
  const [teacher, setTeacher] = useState({});
  const dbRef = ref(getDatabase());

  useEffect(() => {
    get(child(dbRef, `Teachers/${teacherId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setTeacher(snapshot.val());
      }
    });
    const fetchCourseNames = async () => {
      const courses = teacher.courses || {};
      const names = await Promise.all(
        Object.keys(courses).map((subject) => getCourseName(subject))
      );
      setCourseNames(names.filter((course) => course !== null));
    };

    fetchCourseNames();
  }, [teacher.courses]);

  const getCourseName = async (courseId) => {
    const snapshot = await get(child(dbRef, `Courses/${courseId}`));

    if (snapshot.exists()) {
      const courseInfo = snapshot.val();
      return { id: courseId, name: courseInfo.name };
    }
    return null;
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Thông tin chi tiết giảng viên {teacher.name}</Typography>
      </Stack>
      <Paper elevation={1} style={{ padding: 20, marginTop: 20 }}>
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item xs={6}>
            <Avatar
              alt={teacher.name}
              src={teacher.photo}
              sx={{ width: 400, height: 400, marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" gutterBottom>
              {teacher.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              @{teacher.id}
            </Typography>
            <Typography variant="body1" paragraph>
              Email: {teacher.email}
            </Typography>
            <Typography variant="body1" paragraph>
              Các lớp học đang dạy{' '}
            </Typography>
            <div>
              {courseNames.map((course) => (
                <Chip key={course.id} label={course.name} color={'primary'} />
              ))}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
