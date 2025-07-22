import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ADD_ROOM, API_UPDATE_ROOM } from '../../utils/APIConstant.ts';

interface ModalProps {
  handleToggelModal: () => void;
  openModal: boolean;
  updateRow: {
    _id: string,
    roomNumber: string,
    createdAt: string,
    updatedAt: string
  } | undefined,
  param: string,
  getFunction: () => void,
  setUpdateRow: (row: any) => void
}

const AddRoomNumber: React.FC<ModalProps> = ({ handleToggelModal ,  openModal, updateRow, param, setUpdateRow }) => {
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.accessToken);

  // React Query mutation for adding a room number
  const addRoomNumberMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await Apiservice.postAuth(`${API_ADD_ROOM}/${param}`, formData, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-room-view"] });
        toast.success("Room number added successfully");
        // setOpenAddModal(false);
        handleToggelModal();
      } else {
        toast.error(res?.data?.message || "Failed to add room number.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while adding the room number.");
    },
  });

  // React Query mutation for editing a room number
  const editRoomNumberMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
      return await Apiservice.postAuth(`${API_UPDATE_ROOM}/${id}`, formData, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-room-view"] });
        toast.success("Room number updated successfully");
        setUpdateRow(null);
        handleToggelModal();
      } else {
        toast.error(res?.data?.message || "Failed to update room number.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while updating the room number.");
    },
  });

  const handleSubmit = async (values: any, resetForm: any) => {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }

      // const formData = new FormData();
      // formData.append('roomNumber', values.roomNumber);
      const obj = {
        roomNumber: values.roomNumber
      }

      if (updateRow) {
        // Edit Room Number
        editRoomNumberMutation.mutate({ id: updateRow._id, formData: obj });
      } else {
        // Add Room Number
        addRoomNumberMutation.mutate(obj);
      }
      resetForm();
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <Dialog open={openModal} fullWidth={true} maxWidth={'sm'}>
      <DialogTitle>
        {updateRow ? "Edit" : "Add"} Room Number
      </DialogTitle>
      <IconButton
        onClick={() => {
          handleToggelModal()
        }}
        aria-label="close"
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={{
            roomNumber: updateRow ? updateRow.roomNumber : '',
          }}
          validate={values => {
            const errors: { roomNumber?: string } = {};
            if (!values.roomNumber) {
              errors.roomNumber = 'Room number is required';
            }
            return errors;
          }}
          onSubmit={(values, { resetForm }) =>
            handleSubmit(values, resetForm)
          }
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Room Number
                </label>
                <Field
                  type="text"
                  placeholder="Enter Room Number"
                  name="roomNumber"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage name="roomNumber" component="div" className="text-red-500 text-sm" />
              </div>
              <DialogActions sx={{ paddingInline: '20px' }}>
                <button
                  type="submit"
                  className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {updateRow ? "Edit" : "Add"} Room Number
                </button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddRoomNumber