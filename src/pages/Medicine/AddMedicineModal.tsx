import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import apiEndPoints from '../../constant/apiendpoints.ts';
import localStorageKeys from '../../constant/localStorageKeys.ts';
import toast from 'react-hot-toast';
import { getValidationSchema } from './MedicineSchema.ts';


interface ModalProps {
    handleToggelModal: () => void;
    handleClearRow: () => void;
    getSpecailization: () => void;
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

const SpecializaitionModal: React.FC<ModalProps> = ({ handleToggelModal, openModal, updateRow, handleClearRow, getSpecailization }) => {

    console.log("updateRowupdateRow", updateRow);


    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const handleSubmit = async (values: any, resetForm: any) => {
        console.log("valuesvaluesvalues", updateRow);

        try {
            const token = localStorage.getItem(localStorageKeys.token)
            if (!token) {
                throw new Error("Token is missing.")
            }
            if (updateRow) {
                const formData = new FormData();
                // formData.append("folderName", "specialization")
                formData.append('medicineName', values.specialization);
                formData.append('medicineStock', values.stock);
                formData.append('medicineManufacturerDate', values.manufacturerDate);
                formData.append('medicineExpiryDate', values.expiryDate);
                if (values.image) {
                    formData.append('medicineImages', values.image);
                }
                // formData.append('id', updateRow?._id)
                const res = await Apiservice.postAuth(`${apiEndPoints.medicine.update}/${updateRow._id}`, formData, token)
                if (res && res.data.success) {
                    toast.success("Medicine Edit successfully")
                    resetForm()
                    getSpecailization()
                    handleToggelModal()
                    handleClearRow()
                }
            }

            if (!updateRow) {
                const formData = new FormData();
                // formData.append("folderName", "specialization")

                formData.append('medicineName', values.specialization);
                formData.append('medicineStock', values.stock);
                formData.append('medicineManufacturerDate', values.manufacturerDate);
                formData.append('medicineExpiryDate', values.expiryDate);


                if (values.image) {
                    formData.append('medicineImages', values.image);
                }
                const res = await Apiservice.postAuth(apiEndPoints.medicine.add, formData, token)
                if (res && res.data.status == 201) {
                    toast.success("Specialization Added successfully")
                    resetForm()
                    getSpecailization()
                    handleToggelModal()
                    handleClearRow()
                }
            }
        } catch (error) {
            console.log(error)
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
                {updateRow ? "Edit" : "Add"} Medicine
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
                        specialization: updateRow ? updateRow.medicineName : '',
                        stock: updateRow ? updateRow.medicineStock : '',
                        manufacturerDate: updateRow ? updateRow.medicineManufacturerDate : '',
                        expiryDate: updateRow ? updateRow.medicineExpiryDate : '',
                        image: null as File | null,
                    }}
                    validationSchema={getValidationSchema(updateRow)}
                    onSubmit={(values, { resetForm }) =>
                        handleSubmit(values, resetForm)
                    }

                    context={{ updateRow }}
                >
                    {({ setFieldValue }) => (
                        <Form>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Specialization Field */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Medicine Name
                                    </label>
                                    <Field
                                        type="text"
                                        placeholder="Medicine Name"
                                        name="specialization"
                                        className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                    />
                                    <ErrorMessage name="specialization" component="div" className="text-red-500 text-sm" />
                                </div>
                                {/*  */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Medicine Stock
                                    </label>
                                    <Field
                                        type="text"
                                        name="stock"
                                        placeholder="Medicine Stock"
                                        className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                    />
                                    <ErrorMessage name="stock" component="div" className="text-red-500 text-sm" />
                                </div>
                                {/*  */}

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Medicine Manufacturer Date
                                    </label>
                                    <Field
                                        type="date"
                                        name="manufacturerDate"
                                        placeholder="Medicine Manufacturer Date"
                                        className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                    />
                                    <ErrorMessage name="manufacturerDate" component="div" className="text-red-500 text-sm" />
                                </div>
                                {/*  */}

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Medicine Expiry Date
                                    </label>
                                    <Field
                                        type="date"
                                        name="expiryDate"
                                        className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                                    />
                                    <ErrorMessage name="expiryDate" component="div" className="text-red-500 text-sm" />
                                </div>
                                {/*  */}

                                {/* Image Field */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Medicine Image
                                    </label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            if (event.currentTarget.files) {
                                                const file = event.currentTarget.files[0];
                                                setFieldValue('image', file);
                                                setImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <img src={imagePreview} alt="Image Preview" className="w-32 h-32 object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <DialogActions sx={{ paddingInline: '20px' }}>
                                <button
                                    type="submit"
                                    className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                >
                                    {updateRow ? "Edit" : "Add"} Medicine
                                </button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}

export default SpecializaitionModal