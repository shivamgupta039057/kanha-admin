import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import toast from 'react-hot-toast';
import { getValidationSchema } from './BlogSchema.ts';
import { API_ADD_BLOG, API_UPDATE_BLOG } from '../../utils/APIConstant.ts';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// CKEditor imports
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


// npm install --save @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic


interface BlogUpdateRow {
  _id: string;
  title: string;
  slug: string;
  content: string;
  images: string[]; // URLs or paths to images
  createdAt: string;
  updatedAt: string;
}

interface ModalProps {
  handleToggelModal: () => void;
  handleClearRow: () => void;
  openModal: boolean;
  updateRow: BlogUpdateRow | undefined;
}

const AddBlogPageModal: React.FC<ModalProps> = ({ handleToggelModal, openModal, updateRow, handleClearRow }) => {
  const queryClient = useQueryClient();
  const token = useSelector((state: any) => state.auth.accessToken);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // React Query mutation for adding a blog
  const addBlogMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await Apiservice.postAuth(`${API_ADD_BLOG}?type=blog`, formData, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-blog-list"] });
        toast.success("Blog added successfully");
        handleToggelModal();
        handleClearRow();
      } else {
        toast.error(res?.data?.message || "Failed to add blog.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while adding the blog.");
    },
  });

  // React Query mutation for editing a blog
  const editBlogMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: FormData }) => {
      return await Apiservice.postAuth(`${API_UPDATE_BLOG}/${id}`, formData, token);
    },
    onSuccess: (res: any) => {
      if (res && res.data.status) {
        queryClient.invalidateQueries({ queryKey: ["get-blog-list"] });
        toast.success("Blog updated successfully");
        handleToggelModal();
        handleClearRow();
      } else {
        toast.error(res?.data?.message || "Failed to update blog.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred while updating the blog.");
    },
  });

  const handleSubmit = async (values: any, resetForm: any) => {
    try {
      if (!token) {
        throw new Error("Token is missing.");
      }

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('slug', values.slug);
      formData.append('content', values.content);

      if (Array.isArray(values.images) && values.images.length > 0) {
        values.images.forEach((file: File) => {
          formData.append('thumbnail', file);
        });
      }

      if (updateRow) {
        // Edit Blog
        editBlogMutation.mutate({ id: updateRow._id, formData });
      } else {
        // Add Blog
        addBlogMutation.mutate(formData);
      }
      resetForm();
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };

  useEffect(() => {
    if (updateRow && Array.isArray(updateRow.images) && updateRow.images.length > 0) {
      setImagePreview(updateRow.images[0]);
    } else {
      setImagePreview(null);
    }
  }, [updateRow]);

  return (
    <Dialog open={openModal} fullWidth={true} maxWidth={'md'}>
      <DialogTitle>
        {updateRow ? "Edit" : "Add"} Blog
      </DialogTitle>
      <IconButton
        onClick={() => {
          handleToggelModal();
          handleClearRow();
          setImagePreview(null);
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
            slug: updateRow ? updateRow.slug || "" : "",
            content: updateRow ? updateRow.content || "" : "",
            images: [] as File[],
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
                {/* Slug Field */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Slug
                  </label>
                  <Field
                    type="text"
                    placeholder="Slug"
                    name="slug"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="slug" component="div" className="text-red-500 text-sm" />
                </div>
                {/* Images Field */}
                <div className="sm:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Images
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
                        setImagePreview(
                          files.length > 0
                            ? URL.createObjectURL(files[0])
                            : null
                        );
                      }
                    }}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage name="images" component="div" className="text-red-500 text-sm" />
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
                {/* Content Field (CKEditor) */}
                <div className="sm:col-span-2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Content
                  </label>
                  <div className="bg-white dark:bg-form-input rounded-lg border-[1.5px] border-stroke dark:border-form-strokedark">
                    <CKEditor
                      editor={ClassicEditor}
                      data={values.content}
                      onChange={(_event: any, editor: any) => {
                        const data = editor.getData();
                        setFieldValue('content', data);
                      }}
                    />
                  </div>
                  <ErrorMessage name="content" component="div" className="text-red-500 text-sm" />
                </div>
              </div>
              {/* Submit Button */}
              <DialogActions sx={{ paddingInline: '20px' }}>
                <button
                  type="submit"
                  className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {updateRow ? "Edit" : "Add"} Blog
                </button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default AddBlogPageModal