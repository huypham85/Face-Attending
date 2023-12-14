import React, {useEffect, useState} from 'react';
import {
  Button,
  Chip,
  Container,
  FormControlLabel, FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@mui/material';
import Stack from "@mui/material/Stack";
import {getDatabase, onValue, ref} from "firebase/database";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import {validate} from "../../common/Schema/sessionSchema";
import {writeSessionData} from "../../common/services/services";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function FormAddSession({handleClose}) {
  const dbRef = getDatabase();
  const coursesRef = ref(dbRef, 'Courses');
  const [listCourses, setListCourses] = useState([]);
  const teachersRef = ref(dbRef, 'Teachers');
  const [listTeachers, setListTeachers] = useState([]);


  useEffect(() => {
    const coursesSub = onValue(coursesRef, (snapshot) => {
      if (snapshot.exists()) {
        const coursesData = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setListCourses(coursesData);
      }
    });

    const teachersSub = onValue(teachersRef, (snapshot) => {
      if (snapshot.exists()) {
        const teachersData = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setListTeachers(teachersData);
      }
    });

    return () => {
      coursesSub();
      teachersSub();
    };
  }, []);

  const formik = useFormik({
    initialValues:
      {
        courseId: '',
        courseName: '',
        date: '',
        endCheckInTime: '',
        endTime: '',
        id: '',
        roomNo: '',
        startCheckInTime: '',
        startTime: '',
        students: {},
        teacherId: '',
        teacherName: '',
      },
    validate,
    onSubmit: async (values) => {
      const sessionData = {...values}
      sessionData.students = listCourses.find(course => course.id === sessionData.courseId).students;
      for (const key in sessionData.students) {
        sessionData.students[key] = "";
      }
      sessionData.endCheckInTime = sessionData.endCheckInTime.split("T").reverse().join(" ");
      sessionData.startCheckInTime = sessionData.startCheckInTime.split("T").reverse().join(" ");
      sessionData.courseName = listCourses.find(course => course.id === sessionData.courseId).name;
      sessionData.teacherId = listCourses.find(course => course.id === sessionData.courseId).teacherId;
      sessionData.teacherName = listTeachers.find(teacher => teacher.id === sessionData.teacherId).name;
      sessionData.id = `${sessionData.courseId}_${new Date().getTime()}`
      writeSessionData(sessionData);
      handleClose();
    },
  });

  return (<Container maxWidth="sm">
    <form onSubmit={formik.handleSubmit}>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{my: 2}}/>
      <Grid item width={300}>
        <InputLabel>
          Mã khoá học
        </InputLabel>
        <Select
          name="courseId"
          value={formik.values.courseId}
          onChange={formik.handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
          renderValue={(selected) => (
            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
              <Chip key={selected} label={selected}/>
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {Object.entries(listCourses).map(([key, value]) => (
            <MenuItem
              key={key}
              value={`${value.id}`}
            >
              {key}: {value.name}
            </MenuItem>
          ))}
        </Select>
        {formik.errors.courseId && formik.touched.courseId &&
          <FormHelperText error={formik.touched.courseId && Boolean(formik.errors.courseId)}>Vui lòng chọn một khoá học</FormHelperText>}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormLabel>Ngày học</FormLabel>
          <TextField
            name="date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Thời gian kết thúc điểm danh</FormLabel>
          <TextField
            name="endCheckInTime"
            type="datetime-local"
            value={formik.values.endCheckInTime}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.endCheckInTime && Boolean(formik.errors.endCheckInTime)}
            helperText={formik.touched.endCheckInTime && formik.errors.endCheckInTime}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Thời gian kết thúc tiết học</FormLabel>
          <TextField
            name="endTime"
            type="time"
            value={formik.values.endTime}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.endTime && Boolean(formik.errors.endTime)}
            helperText={formik.touched.endTime && formik.errors.endTime}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Tên phòng"
            name="roomNo"
            value={formik.values.roomNo}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.roomNo && Boolean(formik.errors.roomNo)}
            helperText={formik.touched.roomNo && formik.errors.roomNo}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Thời gian bắt đầu điểm danh</FormLabel>
          <TextField
            name="startCheckInTime"
            type="datetime-local"
            value={formik.values.startCheckInTime}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.startCheckInTime && Boolean(formik.errors.startCheckInTime)}
            helperText={formik.touched.startCheckInTime && formik.errors.startCheckInTime}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Thời gian bắt đầu tiết học</FormLabel>
          <TextField
            name="startTime"
            type="time"
            value={formik.values.startTime}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.startTime && Boolean(formik.errors.startTime)}
            helperText={formik.touched.startTime && formik.errors.startTime}
          />
        </Grid>
      </Grid>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{my: 1}}/>
      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained" color="primary">
          Thêm
        </Button>
        <Button variant="contained" color="error" onClick={handleClose}>
          Huỷ
        </Button>
      </Stack>
    </form>
  </Container>);
}

export default FormAddSession;