import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import {useNavigate} from "react-router-dom";

// ----------------------------------------------------------------------

export default function StudentTableRow({
                                          selected,
                                          name,
                                          id,
                                          dob,
                                          email,
                                          mainClass,
                                          gender,
                                          handleClick,
                                        }) {


  const navigate = useNavigate();
  const handleShowDetail = () => {
    navigate(`/students/${id}`);
  };

  return (
    <>
      <TableRow onClick={handleShowDetail} hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick}/>
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {id}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{name}</TableCell>
        <TableCell>{dob}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{gender === "male" ? "Nam" : " Nữ"}</TableCell>
        <TableCell>{mainClass}</TableCell>
      </TableRow>
    </>
  );
}

StudentTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
