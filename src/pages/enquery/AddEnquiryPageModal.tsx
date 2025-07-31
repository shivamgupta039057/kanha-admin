import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import toast from 'react-hot-toast';
import { getValidationSchema } from './EnquiryPageSchema.ts';
import { API_GET_ALL_ENQUIRY_STATUS } from '../../utils/APIConstant.ts';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ModalProps {
  handleToggelModal: () => void;
  handleClearRow: () => void;
  openModal: boolean;
  updateRow: {
    _id: string,
    status?: string,
    createdAt?: string,
    updatedAt?: string
  } | undefined
}

const AddEnquiryPageModal: React.FC<ModalProps> = ({ handleToggelModal, openModal, updateRow, handleClearRow }) => {
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.accessToken);

  // React Query mutation for updating enquiry status
  const editEnquiryMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return await Apiservice.postAuth(`${API_GET_ALL_ENQUIRY_STATUS}/${id}`, { status }, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        // Refetch the enquiry data after a successful update
        queryClient.invalidateQueries({ queryKey: ["get-enquiry-list"] });
        toast.success("Enquiry status updated successfully");
        handleToggelModal();
        handleClearRow();
      } else {
        toast.error(res?.data?.message || "Failed to update enquiry status.");
      }
    },
    onError: (error: any) => {
      console.log("Error updating enquiry status:", error);
      toast.error(error?.message || "An error occurred while updating the enquiry status.");
    },
  });

  const handleSubmit = async (values: any, resetForm: any) => {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }
      if (updateRow) {
        // Update enquiry status
        editEnquiryMutation.mutate({ id: updateRow._id, status: values.status });
      }
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while submitting the form.");
    }
  };

 

  
  return (
    <Dialog open={openModal} fullWidth={true} maxWidth={'sm'}>
      <DialogTitle>
        {updateRow ? "Edit" : "Add"} Room
      </DialogTitle>
      <IconButton
        onClick={() => {
          handleToggelModal()
          handleClearRow()
          setImagePreview(null)
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
            status: updateRow ? updateRow.status || "new" : "new",
          }}
          validationSchema={getValidationSchema(updateRow)}
          onSubmit={(values, { resetForm }) =>
            handleSubmit(values, resetForm)
          }
          context={{ updateRow }}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Status Change
                </label>
                <Field
                  as="select"
                  name="status"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="new">New</option>
                  <option value="responded">Responded</option>
                  <option value="closed">Closed</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
              </div>
              <DialogActions sx={{ paddingInline: '20px' }}>
                <button
                  type="submit"
                  className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {updateRow ? "Update" : "Set"} Status
                </button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddEnquiryPageModal