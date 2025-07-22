import * as Yup from 'yup';

interface UpdateRow {
    _id: string;
    title: string;
    type: string;
    price: number;
    withBreakfastPrice?: number;
    capacity: number;
    amenities: string[];
    images: string[] | null;
    description: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getValidationSchema = (updateRow: UpdateRow | undefined) =>
    Yup.object({
        title: Yup.string()
            .required('Room Title is required')
            .max(100, 'Room Title must be at most 100 characters'),
        type: Yup.string()
            .required('Room Type is required')
            .max(50, 'Room Type must be at most 50 characters'),
        price: Yup.number()
            .typeError('Base Price must be a number')
            .required('Base Price is required')
            .positive('Base Price must be a positive number'),
        withBreakfastPrice: Yup.number()
            .typeError('With Breakfast Price must be a number')
            .min(0, 'With Breakfast Price cannot be negative')
            .notRequired(),
        capacity: Yup.number()
            .typeError('Capacity must be a number')
            .required('Capacity is required')
            .integer('Capacity must be an integer')
            .min(1, 'Capacity must be at least 1'),
        amenities: Yup.array()
            .of(Yup.string().trim().min(1, 'Amenity cannot be empty'))
            .min(1, 'At least one amenity is required'),
        images: Yup.mixed()
            .test('required', 'At least one image is required', function (value) {
                if (updateRow && updateRow.images && updateRow.images.length > 0) {
                    // Editing, images not required if already present
                    return true;
                }
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
        description: Yup.string()
            .required('Description is required')
            .max(1000, 'Description must be at most 1000 characters'),
        isAvailable: Yup.boolean().required('Availability is required'),
    });
