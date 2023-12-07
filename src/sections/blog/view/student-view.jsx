import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import Scrollbar from '../../../components/scrollbar/scrollbar';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { deleteUserByUid } from '../../../common/services/services';
import TableEmptyRows from '../../products/table-empty-rows';
import { applyFilter, emptyRows, getComparator } from '../utils';
import TableNoData from '../../products/table-no-data';
import TablePagination from '@mui/material/TablePagination';
import Card from '@mui/material/Card';
import StudentTableRow from '../student-table-row';
import StudentTableHead from '../student-table-head';
import StudentTableToolbar from '../student-table-toolbar';

// ----------------------------------------------------------------------

export default function StudentView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dbRef = getDatabase();
  const coursesRef = ref(dbRef, 'Students');
  const [listStudents, setListStudents] = useState([]);

  useEffect(() => {
    const studentsSub = onValue(coursesRef, (snapshot) => {
      if (snapshot.exists()) {
        const studentsData = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setListStudents(studentsData);
      }
    });

    return () => {
      studentsSub();
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
      const newSelecteds = listStudents.map((n) => n.name);
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
    inputData: listStudents,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Danh sách sinh viên</Typography>
      </Stack>

      <Card>
        <StudentTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StudentTableHead
                order={order}
                orderBy={orderBy}
                rowCount={listStudents.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: 'Mã sinh viên' },
                  { id: 'name', label: 'Tên sinh viên' },
                  { id: 'dob', label: 'Ngày sinh' },
                  { id: 'email', label: 'Email' },
                  { id: 'gender', label: 'Giới tính' },
                  { id: 'mainClass', label: 'Lớp hành chính' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <StudentTableRow
                      key={row.id}
                      name={row.name}
                      id={row.id}
                      email={row.email}
                      gender={row.gender}
                      dob={row.dob}
                      mainClass={row.mainClass}
                      selected={selected.indexOf(row.name) !== -1}
                      handleDeleteUser={deleteUserByUid}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, listStudents.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={listStudents.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
