import {useEffect, useState} from 'react';

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
import CourseTableRow from '../course-table-row';
import UserTableHead from '../course-table-head';
import TableEmptyRows from '../table-empty-rows';
import CourseTableToolbar from '../course-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import CustomModal from "../../../components/Modal/CustomModal";
import {getDatabase, onValue, ref} from "firebase/database";
import {deleteUserByUid} from "../../../common/services/services";
import FormAddCourse from "../../../components/form/FormAddCourse";
import FormAddSession from "../../../components/form/FromAddSession";
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------

export default function CoursePage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModalCourse, setOpenModalCourse] = useState(false);
  const [openModalSession, setOpenModalSession] = useState(false);

  const dbRef = getDatabase();
  const coursesRef = ref(dbRef, 'Courses');
  const [listCourses, setListCourses] = useState([]);


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

    return () => {
      coursesSub();
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
      const newSelecteds = listCourses.map((n) => n.name);
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
    inputData: listCourses,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const navigate = useNavigate();
  const handleShowSessions = (courseId) => {
    navigate(`/courses/${courseId}`)
  }

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Khoá học</Typography>

        <Stack direction="row" spacing={3}>
          <Button onClick={() => setOpenModalCourse(true)} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            Thêm khoá học
          </Button>
          <Button onClick={() => setOpenModalSession(true)} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            Thêm tiết học
          </Button>
        </Stack>
      </Stack>
      <CustomModal open={openModalCourse} title="Thêm khoá học">
        <FormAddCourse handleClose={() => setOpenModalCourse(false)} />
      </CustomModal>
      <CustomModal open={openModalSession} title="Thêm tiết học">
        <FormAddSession handleClose={() => setOpenModalSession(false)} />
      </CustomModal>
      <Card>
        <CourseTableToolbar
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
                rowCount={listCourses.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Tên khoá học' },
                  { id: 'id', label: 'Mã khoá học' },
                  { id: 'teacher', label: 'Giảng viên' },
                  { id: 'credits', label: 'Số tín chỉ' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CourseTableRow
                      key={row.id}
                      name={row.name}
                      id={row.id}
                      teacher={row.teacherId}
                      credits={row.numberCredits}
                      selected={selected.indexOf(row.name) !== -1}
                      handleShowSessions={handleShowSessions}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, listCourses.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={listCourses.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
