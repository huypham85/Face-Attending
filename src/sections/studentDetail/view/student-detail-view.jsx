import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { child, get, getDatabase, ref } from 'firebase/database';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material';
import CourseCard from '../../students/course-card';
import SessionInfo from '../../../components/Modal/SessionsInfo';
// ----------------------------------------------------------------------

export default function StudentDetailView() {
  const [openModal, setOpenModal] = useState(false);
  const { studentId } = useParams();
  const [student, setStudent] = useState({});
  const [courses, setCourse] = useState([]);
  const [currentCourse, setCurrentCourse] = useState({});
  const dbRef = ref(getDatabase());

  useEffect(() => {
    get(child(dbRef, `Students/${studentId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setStudent(snapshot.val());
      }
    });
    get(child(dbRef, `Courses`)).then((snapshot) => {
      if (snapshot.exists()) {
        const coursesArray = Object.entries(snapshot.val()).map(([courseId, courseData]) => ({
          id: courseId,
          ...courseData,
        }));
        setCourse([...coursesArray]);
      }
    });
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Thông tin chi tiết sinh viên {student.name}</Typography>
      </Stack>
      <Paper elevation={1} style={{ padding: 20, marginTop: 20 }}>
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
          <Grid item xs={6}>
            <Avatar
              alt={student.name}
              src={student.photo}
              sx={{ width: 400, height: 400, marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <Avatar
              alt={student.name}
              src={student.currentFace}
              sx={{ width: 100, height: 100, marginBottom: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {student.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              @{student.id}
            </Typography>
            <Typography variant="body1" paragraph>
              Lớp hành chính: {student.mainClass}
            </Typography>
            <Typography variant="body1" paragraph>
              Email: {student.email}
            </Typography>
            <Typography variant="body1" paragraph>
              Ngày sinh: {student.dob}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Stack direction="row" alignItems="center" justifyContent="space-between" m={3}>
        <Typography variant="h4">Các lớp học đã tham gia</Typography>
      </Stack>
      <Grid container spacing={2}>
        {Object.keys(student?.courses || {}).map((courseStudent) => (
          <CourseCard
            key={courseStudent}
            setOpen={setOpenModal}
            setCourse={setCurrentCourse}
            course={courses?.find((item) => item.id === courseStudent)}
          />
        ))}
      </Grid>
      <SessionInfo
        studentId={studentId}
        dbRef={dbRef}
        currentCourse={currentCourse}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Container>
  );
}
