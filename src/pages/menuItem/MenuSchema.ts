import * as Yup from 'yup';

interface MenuUpdateRow {
    _id: string;
    name: string;
    description: string;
    price: number | string;
    createdAt: string;
    updatedAt: string;
}

export const getValidationSchema = (updateRow: MenuUpdateRow | undefined) =>
    Yup.object({
        name: Yup.string()
            .required('Name is required')
            .max(100, 'Name must be at most 100 characters'),
        description: Yup.string()
            .required('Description is required')
            .max(1000, 'Description must be at most 1000 characters'),
        price: Yup.number()
            .typeError('Price must be a number')
            .required('Price is required')
            .min(0, 'Price must be at least 0'),
    });
