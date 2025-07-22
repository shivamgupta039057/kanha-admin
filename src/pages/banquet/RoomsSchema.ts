import * as Yup from 'yup';

interface BanquetUpdateRow {
    _id: string;
    name: string;
    capacity: number;
    pricePerHour: number;
    amenities: string[];
    images: string[] | null;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export const getValidationSchema = (updateRow: BanquetUpdateRow | undefined) =>
    Yup.object({
        name: Yup.string()
            .required('Banquet Name is required')
            .max(100, 'Banquet Name must be at most 100 characters'),
        capacity: Yup.number()
            .typeError('Capacity must be a number')
            .required('Capacity is required')
            .integer('Capacity must be an integer')
            .min(1, 'Capacity must be at least 1'),
        pricePerHour: Yup.number()
            .typeError('Price per hour must be a number')
            .required('Price per hour is required')
            .positive('Price per hour must be a positive number'),
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
    });
