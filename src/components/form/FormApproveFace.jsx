import React from 'react';
import {
  Button,
  Container,
} from '@mui/material';
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import {approveFaceRequest, rejectFaceRequest} from "../../common/services/services";


function FormApproveFace({handleClose, request}) {
  const handleApproveFace = () => {
    approveFaceRequest(request.faceRequest, request.student);
    handleClose();
  }

  const handleRejectFace = () => {
    rejectFaceRequest(request.faceRequest.id);
    handleClose();
  }

  return (<Container>
      <Stack direction="column" alignItems="center">
        <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={3}>
          <Card sx={{ maxWidth: 250 }}>
            <Box
              component="img"
              alt={"Khuôn mặt cũ"}
              src={request.student.currentFace ? request.student.currentFace : request.student.photo}
              sx={{
                borderRadius: 3,
                top: 0,
                width: 1,
                height: 1,
                objectFit: 'cover',
              }}
            />

            <Stack spacing={2} sx={{ p: 3 }}>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                Khuôn mặt cũ
              </Stack>
            </Stack>
          </Card>
          <Card sx={{ maxWidth: 250 }}>
            <Box
              component="img"
              alt={"Khuôn mặt mới"}
              src={request.faceRequest.currentFace}
              sx={{
                borderRadius: 3,
                top: 0,
                width: 1,
                height: 1,
                objectFit: 'cover',
              }}
            />

            <Stack spacing={2} sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                Khuôn mặt mới
              </Stack>
            </Stack>
          </Card>

        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{my: 2}}/>
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary" onClick={handleApproveFace}>
            Xác nhận khuôn mặt
          </Button>
          <Button variant="contained" color="error" onClick={handleRejectFace}>
            Xoá yêu cầu
          </Button>
        </Stack>
      </Stack>
  </Container>);
}

export default FormApproveFace;