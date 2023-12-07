import React, {useEffect, useState} from 'react';
import {
  Button,
  Chip,
  Container,
  FormControlLabel,
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
import {useAuth} from "../../AuthContext";
import {getAuth} from "firebase/auth";
import {useFormik} from "formik";
import {validate} from "../../common/Schema/userSchema";
import {
  insertStudentToCourse,
  insertStudentToSession, insertTeacherToCourse, insertTeacherToSession,
  writeStudentData,
  writeTeacherData,
  writeUserData
} from "../../common/services/services";

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
  const coursesRef = ref(dbRef, 'Courses');
  const usersRef = ref(dbRef, 'Users');
  const { signup } = useAuth();
  const [listCourses, setListCourses] = useState([]);
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    // Use onValue to listen for changes in the Courses reference
    const coursesSub = onValue(coursesRef, (snapshot) => {
      if (snapshot.exists()) {
        const coursesData = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setListCourses(coursesData);
      }
    });
    const usersSub = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        setListUsers(usersData);
      }
    });

    return () => {
      coursesSub();
      usersSub();
    };
  }, []);

  const formik = useFormik({
    initialValues:
      {
        email: '',
        password: '',
        confirmPassword: '',
        id: '',
        role: 'teacher',
        dob: '',
        gender: 'male',
        mainClass: '',
        name: '',
        photo: '',
        courses: [],
      },
    validate,
    onSubmit: async (values) => {
      const { confirmPassword, password, role, ...userData } = values;

      userData.courses = userData.courses.reduce((acc, course) => {
        const [courseCode, isSelected] = course.split(': ');
        acc[courseCode] = isSelected === 'true';
        return acc;
      }, {});
      const dobParts = userData.dob.split('-');
      if (dobParts.length === 3) {
        userData.dob = `${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`;
      }

      const uid = await signup(values.email, values.password);
      // insert user to Users table
      await writeUserData(uid, values.id, values.email, values.role);
      if (values.role === 'student') {
        await writeStudentData(userData);
        values.courses.map(async (course) => {
          const courseId = course.split(':')[0];
          await insertStudentToCourse(courseId, values.id, values.photo, values.name);
          const courseInfo = listCourses.find((course) => course.id === courseId);
          const sessionInfo = courseInfo.sessions;
          for (const date in sessionInfo) {
            for (const id in sessionInfo[date]) {
              await insertStudentToSession(date, id, values.id);
            }
          }
        });
      } else {
        const { dob, mainClass, ...teacherData } = userData;
        await writeTeacherData(teacherData);
        values.courses.map(async (course) => {
          const courseId = course.split(':')[0];
          await insertTeacherToCourse(courseId, values.id);
          const courseInfo = listCourses.find((course) => course.id === courseId);
          const sessionInfo = courseInfo.sessions;
          for (const date in sessionInfo) {
            for (const id in sessionInfo[date]) {
              await insertTeacherToSession(date, id, values.id, values.name);
            }
          }
        });
      }
      handleClose();
    },
  });

  return (<Container maxWidth="sm">
    <form onSubmit={formik.handleSubmit}>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{my: 2}}/>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Tên người dùng"
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
            label="ID"
            name="id"
            value={formik.values.id}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.id && Boolean(formik.errors.id)}
            helperText={formik.touched.id && formik.errors.id}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Vai trò:</FormLabel>
          <RadioGroup row name="role" value={formik.values.role} onChange={formik.handleChange}>
            <FormControlLabel value="teacher" control={<Radio/>} label="Giảng viên"/>
            <FormControlLabel value="student" control={<Radio/>} label="Sinh viên"/>
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Ngày sinh:</FormLabel>
          <TextField
            name="dob"
            type="date"
            value={formik.values.dob}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.dob && Boolean(formik.errors.dob)}
            helperText={formik.touched.dob && formik.errors.dob}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel>Giới tính:</FormLabel>
          <RadioGroup row name="gender" value={formik.values.gender}
                      onChange={formik.handleChange}>
            <FormControlLabel value="male" control={<Radio/>} label="Nam"/>
            <FormControlLabel value="female" control={<Radio/>} label="Nữ"/>
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Lớp hành chính"
            name="mainClass"
            value={formik.values.mainClass}
            onChange={formik.handleChange}
            fullWidth
            error={formik.touched.mainClass && Boolean(formik.errors.mainClass)}
            helperText={formik.touched.mainClass && formik.errors.mainClass}
          />
        </Grid>
        <Grid item width={300}>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Chọn khoá học:
          </InputLabel>
          <Select
            label="Khoá học"
            name="courses"
            multiple
            value={formik.values.courses}
            onChange={formik.handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value.split(":")[0]} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Object.entries(listCourses).map(([key, value]) => (
              <MenuItem
                key={key}
                value={`${value.id}: ${true}`}
              >
                {value.id}: {value.name}
              </MenuItem>
            ))}
          </Select>
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