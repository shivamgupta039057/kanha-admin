import * as Yup from 'yup';

interface CategoryUpdateRow {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export const getValidationSchema = (updateRow: CategoryUpdateRow | undefined) =>
    Yup.object({
        name: Yup.string()
            .required('Name is required')
            .max(100, 'Name must be at most 100 characters'),
        description: Yup.string()
            .required('Description is required')
            .max(1000, 'Description must be at most 1000 characters'),
    });
