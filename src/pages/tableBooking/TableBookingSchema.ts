import * as Yup from 'yup';

export interface TableBookingUpdateRow {
    _id: string;
    guestName: string;
    phone: string;
    date: string;
    timeSlot: string;
    numberOfGuests: number | string;
    tableNumber: string | number;
    specialRequest?: string;
    preOrderedItems?: string;
    createdAt: string;
    updatedAt: string;
}

export const getValidationSchema = (updateRow: TableBookingUpdateRow | undefined) =>
    Yup.object({
        guestName: Yup.string()
            .required('Guest name is required')
            .max(100, 'Guest name must be at most 100 characters'),
        phone: Yup.string()
            .required('Phone number is required')
            .matches(
                /^(\+?\d{1,4}[\s-])?(?!0+\s+,?$)\d{10,15}$/,
                'Phone number is not valid'
            ),
        date: Yup.string()
            .required('Date is required')
            .matches(
                /^\d{4}-\d{2}-\d{2}$/,
                'Date must be in YYYY-MM-DD format'
            ),
        timeSlot: Yup.string()
            .required('Time slot is required')
            .max(50, 'Time slot must be at most 50 characters'),
        numberOfGuests: Yup.number()
            .typeError('Number of guests must be a number')
            .required('Number of guests is required')
            .min(1, 'At least 1 guest is required')
            .max(100, 'Number of guests must be at most 100'),
        tableNumber: Yup.string()
            .required('Table number is required')
            .max(20, 'Table number must be at most 20 characters'),
        specialRequest: Yup.string()
            .max(500, 'Special request must be at most 500 characters')
            .nullable(),
        // preOrderedItems: Yup.string()
        //     .max(1000, 'Pre-ordered items must be at most 1000 characters')
        //     .nullable(),
    });
