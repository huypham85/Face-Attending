import React, {useEffect, useState} from 'react';
import {Button, Chip, Container, FormHelperText, Grid, InputLabel, Select, TextField} from '@mui/material';
import Stack from "@mui/material/Stack";
import {getDatabase, onValue, ref} from "firebase/database";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import {useFormik} from "formik";
import {validate} from "../../common/Schema/courseSchema";
import {insertCourseToStudent, writeCourseData} from "../../common/services/services";

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

function FormAddUser({handleClose}) {
  const dbRef = getDatabase();
  const studentRef = ref(dbRef, 'Students');
  const [listStudents, setListStudents] = useState([]);
  const teachersRef = ref(dbRef, 'Teachers');
  const [listTeachers, setListTeachers] = useState([]);

  useEffect(() => {
    const studentsSub = onValue(studentRef, (snapshot) => {
      if (snapshot.exists()) {
        const studentsData = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setListStudents(studentsData);
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
      studentsSub();
      teachersSub();
    };
  }, []);

  const formik = useFormik({
    initialValues:
      {
        id: '',
        name: '',
        numberCredits: 1,
        teacherId: '',
        students: [],
      },
    validate,
    onSubmit: async (values) => {
      // insert course to student courses db
      values.students.map((student) => {
        insertCourseToStudent(student, values.id)
      });
      const studentsData = listStudents.map(({ id, name, photo }) => ({ id, name, photo }));
      values.students = studentsData.filter(student => values.students.includes(student.id));
      const courseData = {...values};
      courseData.students = courseData.students.reduce((acc, student) => {
        acc[student.id] = {
          id: student.id,
          name: student.name,
          photo: student.photo
        };
        return acc;
      }, {})

      writeCourseData(courseData, values.teacherId);
      handleClose();
    },
  });

  return (<Container maxWidth="sm">
    <form onSubmit={formik.handleSubmit}>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{my: 2}}/>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="id"
            label="Mã môn học"
            variant="outlined"
            fullWidth
            value={formik.values.id}
            onChange={formik.handleChange}
            error={formik.touched.id && Boolean(formik.errors.id)}
            helperText={formik.touched.id && formik.errors.id}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Tên môn học"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Số lượng tín chỉ"
            name="numberCredits"
            type={"number"}
            value={formik.values.numberCredits}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.numberCredits && Boolean(formik.errors.numberCredits)}
            helperText={formik.touched.numberCredits && formik.errors.numberCredits}
          />
        </Grid>
        <Grid item width={300}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Chọn sinh viên:
          </InputLabel>
          <Select
            label="Sinh viên"
            name="students"
            multiple
            value={formik.values.students}
            onChange={formik.handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
            renderValue={(selected) => (
              <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                {selected.map((value, index) => (
                  <Chip key={index} label={value.toString()}/>
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Object.entries(listStudents).map(([key, value]) => (
              <MenuItem
                key={key}
                value={`${value.id}`}
              >
                {value.id}: {value.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.students && formik.touched.students &&
            <FormHelperText error={formik.touched.students && Boolean(formik.errors.students)}>Vui lòng chọn các học
              sinh sẽ tham gia lớp học</FormHelperText>}
        </Grid>
        <Grid item width={300}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Chọn giảng viên:
          </InputLabel>
          <Select
            label="Chọn giảng viên"
            name="teacherId"
            value={formik.values.teacherId}
            onChange={formik.handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
            renderValue={(selected) => (
              <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                <Chip key={selected} label={selected}/>
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Object.entries(listTeachers).map(([key, value]) => (
              <MenuItem
                key={key}
                value={`${value.id}`}
              >
                {value.id}: {value.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.teacherId && formik.touched.teacherId &&
            <FormHelperText error={formik.touched.teacherId && Boolean(formik.errors.teacherId)}>Vui lòng chọn giảng viên
              cho lớp học</FormHelperText>}
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

export default FormAddUser;