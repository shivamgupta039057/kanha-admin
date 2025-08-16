import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import apiEndPoints from '../../constant/apiendpoints.ts';
import localStorageKeys from '../../constant/localStorageKeys.ts';
import toast from 'react-hot-toast';
import { getValidationSchema } from './MenuSchema.ts';
import { API_ADD_BANQUET, API_ADD_GALLERY, API_ADD_MENU, API_BANQUET_UPDATE, API_ROOM_ADD, API_ROOM_UPDATE, API_UPDATE_GALLERY, API_UPDATE_MENU } from '../../utils/APIConstant.ts';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ModalProps {
  handleToggelModal: () => void;
  handleClearRow: () => void;
  openModal: boolean;
  updateRow: {
    _id: string,
    image: string | null,
    medicineName: string,
    medicineManufacturerDate: string,
    medicineExpiryDate: string,
    medicineStock: string,
    createdAt: string,
    updatedAt: string
  } | undefined
  categoryId  : string
}

const AddMenuModal: React.FC<ModalProps> = ({ handleToggelModal, openModal, updateRow, handleClearRow , categoryId }) => {
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.accessToken);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // React Query mutation for adding a room
  const addRoomMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return await Apiservice.postAuth(`${API_ADD_MENU}/${categoryId}`, data, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-menu-list" , categoryId] });
        toast.success(res?.data?.message);
        handleToggelModal();
        handleClearRow();
      } else {
        toast.error(res?.data?.message || "Failed to add category.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while adding the category.");
    },
  });

  // React Query mutation for editing a category
  const editRoomMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: { name: string; description: string } }) => {
      return await Apiservice.postAuth(`${API_UPDATE_MENU}/${id}`, data, token);
    },
    onSuccess: (res: any) => {  
      if (res && res.data.status) {
        // Refetch the category data after a successful update
        queryClient.invalidateQueries({ queryKey: ["get-menu-list" , categoryId] });
        toast.success("Category updated successfully");
        handleToggelModal();
        handleClearRow();
      } else {
        toast.error(res?.data?.message || "Failed to update category.");
      }
    },
    onError: (error: any) => {
      console.error("Error updating category:", error);
      toast.error(error?.message || "An error occurred while updating the category.");
    },
  });

  const handleSubmit = async (values: any, resetForm: any) => {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }
      const data = {
        name: values.name,
        description: values.description,
        price : values.price
      };

      if (updateRow) {
        // Edit Category
        editRoomMutation.mutate({ id: updateRow._id, data });
      } else {
        // Add Category
        addRoomMutation.mutate(data);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  useEffect(() => {
    if (updateRow) {
      setImagePreview(updateRow.image)
    }
  }, [updateRow])

  
  return (
    <Dialog open={openModal} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>
        {updateRow ? "Edit" : "Add"} Menu Item
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
            name: updateRow ? updateRow.name || "" : "",
            description: updateRow ? updateRow.description || "" : "",
            price: updateRow ? updateRow.price || "" : "",
          }}
          validationSchema={getValidationSchema(updateRow)}
          onSubmit={(values, { resetForm }) =>
            handleSubmit(values, resetForm)
          }
          context={{ updateRow }}
        >
          {() => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Name
                  </label>
                  <Field
                    type="text"
                    placeholder="Name"
                    name="name"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Price Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Price
                  </label>
                  <Field
                    type="number"
                    placeholder="Price"
                    name="price"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Description Field */}
                <div className="sm:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Description"
                    rows={3}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              {/* Submit Button */}
              <DialogActions sx={{ paddingInline: '20px' }}>
                <button
                  type="submit"
                  className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {updateRow ? "Edit" : "Add"} Menu Item
                </button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddMenuModal