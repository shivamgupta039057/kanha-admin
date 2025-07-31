import * as Yup from 'yup';

interface EnquiryUpdateRow {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getValidationSchema = (updateRow: EnquiryUpdateRow | undefined) =>
    Yup.object({
        status: Yup.string()
            .required('Status is required')
            .oneOf(['new', 'responded', 'closed'], 'Status must be one of: new, responded, closed'),
    });
