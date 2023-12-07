import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import CustomModal from '../../../components/Modal/CustomModal';
import FormAddUser from '../../../components/form/FormAddUser';
import { getDatabase, onValue, ref } from 'firebase/database';
import {
  deleteStudentAttendance,
  deleteStudentCourses,
  deleteStudentSession,
  deleteUserByUid,
  insertTeacherToCourse,
  insertTeacherToSession,
  rejectFaceRequest,
} from '../../../common/services/services';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);

  const dbRef = getDatabase();
  const usersRef = ref(dbRef, 'Users');
  const [listUsers, setListUsers] = useState([]);
  const coursesRef = ref(dbRef, 'Courses');
  const [listCourses, setListCourses] = useState([]);
  const studentsRef = ref(dbRef, 'Students');
  const [listStudents, setListStudents] = useState([]);
  const teachersRef = ref(dbRef, 'Teachers');
  const [listTeachers, setListTeachers] = useState([]);
  const attendanceRef = ref(dbRef, 'Attendance');
  const [listAttendance, setListAttendance] = useState([]);

  useEffect(() => {
    const usersSub = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setListUsers(usersData);
      }
    });
    const coursesSub = onValue(coursesRef, (snapshot) => {
      if (snapshot.exists()) {
        const coursesData = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setListCourses(coursesData);
      }
    });
    const studentsSub = onValue(studentsRef, (snapshot) => {
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

    const attendanceSub = onValue(attendanceRef, (snapshot) => {
      if (snapshot.exists()) {
        const attendanceData = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setListAttendance(attendanceData);
      }
    });

    return () => {
      usersSub();
      studentsSub();
      teachersSub();
      coursesSub();
      attendanceSub();
    };
  }, []);
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = listUsers.map((n) => n.email);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: listUsers,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleDelete = async (uid, userId, role) => {
    if (role === 'student') {
      await rejectFaceRequest(userId);
      const values = Object.keys(listStudents.find((student) => userId === student.id).courses);
      values.forEach(async (courseId) => {
        await deleteStudentCourses(userId, courseId);
        const courseInfo = listCourses.find((course) => course.id === courseId);
        const sessionInfo = courseInfo.sessions;
        for (const date in sessionInfo) {
          for (const id in sessionInfo[date]) {
            await deleteStudentSession(date, id, userId);
          }
        }
      });
      await deleteStudentAttendance(userId);
    } else {
      const values = Object.keys(listTeachers.find((teacher) => userId === teacher.id).courses || {});
      values.map(async (courseId) => {
        await insertTeacherToCourse(courseId, '');
        const courseInfo = listCourses.find((course) => course.id === courseId);
        const sessionInfo = courseInfo.sessions;
        for (const date in sessionInfo) {
          for (const id in sessionInfo[date]) {
            await insertTeacherToSession(date, id, '', '');
          }
        }
      });
    }
    deleteUserByUid(uid, userId, role);
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Người dùng</Typography>

        <Button
          onClick={() => setOpenModal(true)}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Thêm người dùng mới
        </Button>
      </Stack>
      <CustomModal open={openModal} title="Thêm người dùng mới">
        <FormAddUser handleClose={() => setOpenModal(false)} />
      </CustomModal>
      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={listUsers.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'email', label: 'Email' },
                  { id: 'id', label: 'Id người dùng' },
                  { id: 'role', label: 'Vai trò' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      uid={row.uid}
                      email={row.email}
                      id={row.id}
                      role={row.role}
                      avatarUrl={
                        row.avatarUrl ? row.avatarUrl : `/assets/images/avatars/avatar_2.jpg`
                      }
                      selected={selected.indexOf(row.email) !== -1}
                      handleDeleteUser={handleDelete}
                      handleClick={(event) => handleClick(event, row.id)}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, listUsers.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={listUsers.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
