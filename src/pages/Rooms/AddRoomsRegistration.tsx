import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import apiEndPoints from '../../constant/apiendpoints.ts';
import localStorageKeys from '../../constant/localStorageKeys.ts';
import toast from 'react-hot-toast';
import { getValidationSchema } from './RoomsSchema.ts';
import { API_ROOM_ADD, API_ROOM_UPDATE } from '../../utils/APIConstant.ts';
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

const AddRoomsRegistration: React.FC<ModalProps> = ({ handleToggelModal, openModal, updateRow, handleClearRow }) => {
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.accessToken);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // React Query mutation for adding a room
  const addRoomMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("dddddFormDataFormDataFormData" , FormData);
      
      return await Apiservice.postAuth(`${API_ROOM_ADD}?type=rooms`, formData, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-roomData"] });
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
      return await Apiservice.postAuth(`${API_ROOM_UPDATE}/${id}?type=rooms`, formData, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        // Refetch the room data after a successful update
        queryClient.invalidateQueries({ queryKey: ["get-roomData"] });
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
      formData.append('type', values.type);
      formData.append('price', values.price);
      if (values.withBreakfastPrice !== undefined && values.withBreakfastPrice !== "") {
        formData.append('withBreakfastPrice', values.withBreakfastPrice);
      }
      formData.append('capacity', values.capacity);
      formData.append('amenities', JSON.stringify(values.amenities));
      if (Array.isArray(values.images) && values.images.length > 0) {
        values.images.forEach((file: File) => {
          formData.append('images', file);
        });
      }
      formData.append('description', values.description);
      formData.append('isAvailable', values.isAvailable);

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
            title: updateRow ? updateRow.title : '',
            type: updateRow ? updateRow.type : '',
            price: updateRow ? updateRow.price : '',
            withBreakfastPrice: updateRow ? updateRow.withBreakfastPrice : '',
            capacity: updateRow ? updateRow.capacity : null,
            amenities: updateRow ? updateRow.amenities || [] : [],
            images: [] as File[],
            description: updateRow ? updateRow.description : '',
            isAvailable: updateRow ? updateRow.isAvailable : true,
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
                    Room Title
                  </label>
                  <Field
                    type="text"
                    placeholder="Room Title"
                    name="title"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Type Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Room Type
                  </label>
                  <Field
                    type="text"
                    placeholder="e.g. Deluxe, Super Deluxe"
                    name="type"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Price Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Base Price (without breakfast)
                  </label>
                  <Field
                    type="text"
                    name="price"
                    placeholder="Base Price"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                </div>
                {/* With Breakfast Price Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Price with Breakfast (optional)
                  </label>
                  <Field
                    type="text"
                    name="withBreakfastPrice"
                    placeholder="With Breakfast Price"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="withBreakfastPrice" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Capacity Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Capacity
                  </label>
                  <Field
                    type="text"
                    name="capacity"
                    placeholder="Capacity"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="capacity" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Amenities Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Amenities
                  </label>
                  <Field
                    type="text"
                    name="amenities"
                    placeholder="e.g. WiFi, TV, AC"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="amenities" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Images Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Room Images
                  </label>
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (event.currentTarget.files) {
                        const files = Array.from(event.currentTarget.files);
                        setFieldValue('images', files);
                        // Show all selected images in preview
                        setImagePreview(
                          files.length > 0
                            ? files.map(file => URL.createObjectURL(file))
                            : null
                        );
                      }
                    }}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="images" component="div" className="text-red-500 text-sm" />
                  {imagePreview && Array.isArray(imagePreview) && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {imagePreview.map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt={`Image Preview ${idx + 1}`}
                          className="w-32 h-32 object-cover"
                        />
                      ))}
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
                    placeholder="Room Description"
                    rows={3}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
                </div>
                {/* isAvailable Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Is Available
                  </label>
                  <Field
                    as="select"
                    name="isAvailable"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value={true}>Available</option>
                    <option value={false}>Not Available</option>
                  </Field>
                  <ErrorMessage name="isAvailable" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              {/* Submit Button */}
              <DialogActions sx={{ paddingInline: '20px' }}>
                <button
                  type="submit"
                  className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {updateRow ? "Edit" : "Add"} Room
                </button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddRoomsRegistration