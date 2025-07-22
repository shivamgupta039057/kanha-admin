import { Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, MenuItem, Select } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import apiEndPoints from '../../constant/apiendpoints.ts';
import localStorageKeys from '../../constant/localStorageKeys.ts';
import toast from 'react-hot-toast';
import { getValidationSchema } from './TableBookingSchema.ts';
import { API_ADD_BANQUET, API_ADD_BOOKING, API_ADD_GALLERY, API_ADD_MENU, API_BANQUET_UPDATE, API_ROOM_ADD, API_ROOM_UPDATE, API_UPDATE_GALLERY, API_UPDATE_MENU } from '../../utils/APIConstant.ts';
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

  preOrderData : {
    _id : string,
    name : string
  }
}

const AddTableBookingModal: React.FC<ModalProps> = ({ handleToggelModal, openModal, updateRow, handleClearRow , preOrderData }) => {
  console.log("preOrderDatapreOrderData" , preOrderData);
  
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.accessToken);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // React Query mutation for adding a room
  const addRoomMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return await Apiservice.postAuth(`${API_ADD_BOOKING}`, data, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-table-booking-list"] });
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
        queryClient.invalidateQueries({ queryKey: ["get-table-booking-list"] });
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
    console.log("valuesvaluesvalues" , values);
    
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }
      const data = {
        guestName: values.guestName,
        phone: values.phone,
        date: values.date,
        timeSlot: values.timeSlot,
        numberOfGuests: values.numberOfGuests,
        tableNumber: values.tableNumber,
        // preOrderedItems: values.preOrderedItems
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



  
  return (
    <Dialog open={openModal} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>
        {updateRow ? "Edit" : "Add"} Room
      </DialogTitle>
      <IconButton
        onClick={() => {
          handleToggelModal()
          handleClearRow()
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
            guestName: updateRow ? updateRow.guestName || "" : "",
            phone: updateRow ? updateRow.phone || "" : "",
            date: updateRow ? updateRow.date || "" : "",
            timeSlot: updateRow ? updateRow.timeSlot || "" : "",
            numberOfGuests: updateRow ? updateRow.numberOfGuests || "" : "",
            tableNumber: updateRow ? updateRow.tableNumber || "" : "",
            specialRequest: updateRow ? updateRow.specialRequest || "" : "",
            preOrderedItems: updateRow
              ? Array.isArray(updateRow.preOrderedItems)
                ? updateRow.preOrderedItems
                : updateRow.preOrderedItems
                ? [updateRow.preOrderedItems]
                : []
              : [],
          }}
          // validationSchema={getValidationSchema(updateRow)}
          onSubmit={(values, { resetForm }) => {
            // Convert preOrderedItems to array of ids if not already
            const submitValues = {
              ...values,
              preOrderedItems: Array.isArray(values.preOrderedItems)
                ? values.preOrderedItems
                : values.preOrderedItems
                ? [values.preOrderedItems]
                : [],
            };
            handleSubmit(submitValues, resetForm);
          }}
          context={{ updateRow }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guest Name Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Guest Name
                  </label>
                  <Field
                    type="text"
                    placeholder="Guest Name"
                    name="guestName"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="guestName" component="div" className="text-red-500 text-sm" />
                </div>
                
                {/* Phone Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Phone
                  </label>
                  <Field
                    type="text"
                    placeholder="Phone"
                    name="phone"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Date Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Date
                  </label>
                  <Field
                    type="date"
                    placeholder="Date"
                    name="date"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Time Slot Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Time Slot
                  </label>
                  <Field
                    type="time"
                    placeholder="Time Slot"
                    name="timeSlot"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="timeSlot" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Number of Guests Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Number of Guests
                  </label>
                  <Field
                    type="number"
                    placeholder="Number of Guests"
                    name="numberOfGuests"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="numberOfGuests" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Table Number Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Table Number
                  </label>
                  <Field
                    type="text"
                    placeholder="Table Number"
                    name="tableNumber"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="tableNumber" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Special Request Field */}
                <div className="sm:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Special Request
                  </label>
                  <Field
                    as="textarea"
                    name="specialRequest"
                    placeholder="Special Request"
                    rows={2}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="specialRequest" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Pre-Ordered Items Field - MUI Multiple Select */}
                {/* <div className="sm:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Pre-Ordered Items
                  </label>
                  <Field name="preOrderedItems">
                    {({ field }) => (
                      <div>
                        <FormControl fullWidth>
                          <Select
                            multiple
                            displayEmpty
                            value={field.value || []}
                            onChange={e => setFieldValue("preOrderedItems", e.target.value)}
                            renderValue={selected => {
                              if (!selected || selected.length === 0) {
                                return <span className="text-gray-400">Select Pre-Ordered Items</span>;
                              }
                              // Find names for selected ids
                              return (
                                <div className="flex flex-wrap gap-1">
                                  {(selected as string[]).map(id => {
                                    const item = Array.isArray(preOrderData)
                                      ? preOrderData.find((d: any) => d._id === id)
                                      : null;
                                    return (
                                      <Chip
                                        key={id}
                                        label={item ? item.name : id}
                                        size="small"
                                        style={{ marginRight: 2 }}
                                      />
                                    );
                                  })}
                                </div>
                              );
                            }}
                            inputProps={{ 'aria-label': 'Pre-Ordered Items' }}
                            className="bg-transparent"
                          >
                            {Array.isArray(preOrderData) && preOrderData.length > 0 ? (
                              preOrderData.map((item: any) => (
                                <MenuItem key={item._id} value={item._id}>
                                  {item.name}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled value="">
                                No items available
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </Field>
                  <ErrorMessage name="preOrderedItems" component="div" className="text-red-500 text-sm" />
                </div> */}
              </div>
              {/* Submit Button */}
              <DialogActions sx={{ paddingInline: '20px' }}>
                <button
                  type="submit"
                  className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {updateRow ? "Edit" : "Add"} Table Booking
                </button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddTableBookingModal