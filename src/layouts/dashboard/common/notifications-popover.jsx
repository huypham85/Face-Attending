import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomModal from "../../../components/Modal/CustomModal";
import FormApproveFace from "../../../components/form/FormApproveFace";
import Stack from "@mui/material/Stack";

// ----------------------------------------------------------------------

export default function NotificationsPopover({listsFr, listStudents}) {
  const [openModal, setOpenModal] = useState(false);
  const [request, setRequest] = useState({});
  const [open, setOpen] = useState(null);
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  function getObjectsById(id) {
    const fr = listsFr.find((item) => item.id === id);
    const student = listStudents.find((item) => item.id === id);

    return { faceRequest: fr, student: student };
  }

  const handleShowConfirm = (id) => {
    setOpenModal(true);
    setRequest(getObjectsById(id));
  }


  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={listsFr.length} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone"/>
        </Badge>
      </IconButton>
      <CustomModal open={openModal} title={`Xác thực khuôn mặt của sinh viên `}>
        <FormApproveFace request={request} handleClose={() => setOpenModal(false)}/>
      </CustomModal>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{display: 'flex', alignItems: 'center', py: 2, px: 2.5}}>
          <Box sx={{flexGrow: 1}}>
            <Typography variant="subtitle1">Thông báo</Typography>
            <Typography variant="body2" sx={{color: 'text.secondary'}}>
              Bạn đang có {listsFr.length} yêu cầu xác thực khuôn mặt
            </Typography>
          </Box>
        </Box>

        <Divider sx={{borderStyle: 'dashed'}}/>

        <Scrollbar sx={{height: {xs: 340, sm: 'auto'}}}>
          <List
            disablePadding
          >
            {listsFr.map((fr) => (
              <NotificationItem key={fr.id} fr={fr} handleShowConfirm={handleShowConfirm}/>
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{borderStyle: 'dashed'}}/>

        <Box sx={{p: 1}}>
          <Button fullWidth disableRipple>
            Xem tất cả
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({fr, handleShowConfirm}) {
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px'
      }}
      onClick={() => handleShowConfirm(fr.id)}
    >
      <ListItemText
        primary={`Yêu cầu từ sinh viên ${fr.id}`}
        secondary={
          <React.Fragment>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{my: 1}}/>
            <Stack direction="row"
                   divider={<Divider orientation="vertical" flexItem/>}
                   spacing={2}>
              <Avatar alt={name} src={"/assets/images/avatars/avatar_2.jpg"}/>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.disabled',
                }}
              >
                Bạn nhận được yêu cầu xác nhận khuôn mặt từ sinh viên {fr.id}
              </Typography>
            </Stack>
          </React.Fragment>
        }
      />
    </ListItemButton>
  );
}

