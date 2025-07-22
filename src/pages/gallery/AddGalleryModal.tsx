import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import apiEndPoints from '../../constant/apiendpoints.ts';
import localStorageKeys from '../../constant/localStorageKeys.ts';
import toast from 'react-hot-toast';
import { getValidationSchema } from './RoomsSchema.ts';
import { API_ADD_BANQUET, API_ADD_GALLERY, API_BANQUET_UPDATE, API_ROOM_ADD, API_ROOM_UPDATE, API_UPDATE_GALLERY } from '../../utils/APIConstant.ts';
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
}

const AddGalleryModal: React.FC<ModalProps> = ({ handleToggelModal, openModal, updateRow, handleClearRow }) => {
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.accessToken);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // React Query mutation for adding a room
  const addRoomMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("dddddFormDataFormDataFormData" , FormData);
      
      return await Apiservice.postAuth(`${API_ADD_GALLERY}?type=gallery`, formData, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-gallery-list"] });
        toast.success("Room added successfully");
        handleToggelModal();
        handleClearRow();
      } else {
        toast.error(res?.data?.message || "Failed to add room.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while adding the room.");
    },
  });

  // React Query mutation for editing a room
  const editRoomMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
      return await Apiservice.postAuth(`${API_UPDATE_GALLERY}/${id}?type=gallery`, formData, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        // Refetch the room data after a successful update
        queryClient.invalidateQueries({ queryKey: ["get-gallery-list"] });
        toast.success("Room updated successfully");
        handleToggelModal();
        handleClearRow();
      } else {
        toast.error(res?.data?.message || "Failed to update room.");
      }
    },
    onError: (error: any) => {
      console.log("dddddddderror" , error);
      
      toast.error(error?.message || "An error occurred while updating the room.");
    },
  });

  const handleSubmit = async (values: any, resetForm: any) => {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('type', values.type);
      
      if (Array.isArray(values.image) && values.image.length > 0) {
        values.image.forEach((file: File) => {
          formData.append('image', file);
        });
      }

      if (updateRow) {
        // Edit Room
        editRoomMutation.mutate({ id: updateRow._id, formData });
      } else {
        // Add Room
        addRoomMutation.mutate(formData);
      }
      resetForm();
    } catch (error) {
      console.log(error);
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
            title: updateRow ? updateRow.title || "" : "",
            description: updateRow ? updateRow.description || "" : "",
            type: updateRow ? updateRow.type || "" : "",
            image: [] as File[],
          }}
          validationSchema={getValidationSchema(updateRow)}
          onSubmit={(values, { resetForm }) =>
            handleSubmit(values, resetForm)
          }
          context={{ updateRow }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Title
                  </label>
                  <Field
                    type="text"
                    placeholder="Title"
                    name="title"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Type Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Type
                  </label>
                  <Field
                    as="select"
                    name="type"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select Type</option>
                    <option value="room">Room</option>
                    <option value="banquet">Banquet</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="general">General</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Image Field */}
                <div className="sm:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (event.currentTarget.files) {
                        const files = Array.from(event.currentTarget.files);
                        setFieldValue('image', files);
                        setImagePreview(
                          files.length > 0
                            ? URL.createObjectURL(files[0])
                            : null
                        );
                      }
                    }}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
                  {imagePreview && typeof imagePreview === "string" && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        className="w-32 h-32 object-cover"
                      />
                    </div>
                  )}
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
                  {updateRow ? "Edit" : "Add"} Gallery
                </button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddGalleryModal