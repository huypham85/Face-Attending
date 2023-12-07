import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {useTheme} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import {useResponsive} from 'src/hooks/use-responsive';

import {bgBlur} from 'src/theme/css';

import Iconify from 'src/components/iconify';

import Searchbar from './common/searchbar';
import {HEADER, NAV} from './config-layout';
import AccountPopover from './common/account-popover';
import NotificationsPopover from './common/notifications-popover';
import {getDatabase, onValue, ref} from "firebase/database";
import {useEffect, useState} from "react";

// ----------------------------------------------------------------------

export default function Header({onOpenNav}) {
  const theme = useTheme();
  const dbRef = getDatabase();
  const frRef = ref(dbRef, 'FaceRequests');
  const [listFr, setListFr] = useState([]);
  const studentsRef = ref(dbRef, 'Students');
  const [listStudents, setListStudents] = useState([]);

  useEffect(() => {
    const frSub = onValue(frRef, (snapshot) => {
      if (snapshot.exists()) {
        const frData = Object.keys(snapshot.val()).map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }));
        setListFr(frData);
      }else {
        setListFr([...listFr]);
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

    return () => {
      frSub();
      studentsSub();
    };
  }, []);
  const lgUp = useResponsive('up', 'lg');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{mr: 1}}>
          <Iconify icon="eva:menu-2-fill"/>
        </IconButton>
      )}

      <Searchbar/>

      <Box sx={{flexGrow: 1}}/>

      <Stack direction="row" alignItems="center" spacing={1}>
        <NotificationsPopover listsFr={listFr} listStudents={listStudents}/>
        <AccountPopover/>
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: {lg: 5},
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
