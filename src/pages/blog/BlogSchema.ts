import * as Yup from 'yup';

export const getValidationSchema = () =>
    Yup.object({
        title: Yup.string()
            .required('Title is required')
            .max(100, 'Title must be at most 100 characters'),
        slug: Yup.string()
            .required('Slug is required')
            .max(100, 'Slug must be at most 100 characters'),
        content: Yup.string()
            .required('Content is required')
            .max(5000, 'Content must be at most 5000 characters'),
        images: Yup.mixed()
            .test('required', 'At least one image is required', function (value) {
                if (value && Array.isArray(value) && value.length > 0) {
                    return true;
                }
                return false;
            })
            .test('fileType', 'Only image files are allowed', function (value) {
                if (!value || !Array.isArray(value)) return true;
                for (const file of value) {
                    if (
                        file &&
                        file.type &&
                        !['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'].includes(file.type)
                    ) {
                        return false;
                    }
                }
                return true;
            })
            .test('fileSize', 'Each image must be less than 2MB', function (value) {
                if (!value || !Array.isArray(value)) return true;
                for (const file of value) {
                    if (file && file.size && file.size > 2 * 1024 * 1024) {
                        return false;
                    }
                }
                return true;
            }),
    });
