import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
import {useNavigate} from "react-router-dom";
// ----------------------------------------------------------------------

export default function TeacherTableRow({
  selected,
  name,
  id,
  email,
  gender,
  deviceId,
  handleClick,
  handleShowSessions,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const navigate = useNavigate();
  const handleShowDetail = () => {
    navigate(`/teachers/${id}`);
  };

  return (
    <>
      <TableRow onClick={handleShowDetail} hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {id}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{name}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{gender === "male" ? "Nam" : " Nữ"}</TableCell>
        <TableCell>{deviceId}</TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={() => handleShowSessions(id)} sx={{ color: 'black' }}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 0 }} />
          Xem các tiết học
        </MenuItem>
      </Popover>
    </>
  );
}

TeacherTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
