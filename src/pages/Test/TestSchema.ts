import * as Yup from 'yup';
interface UpdateRow {
    _id: string,
    image: string | null,
    specialization: string,
    createdAt: string,
    updatedAt: string 
}
export const getValidationSchema = (updateRow: UpdateRow | undefined) =>
    Yup.object({
        specialization: Yup.string()
            .nullable()
            .when([], {
                is: () => !updateRow,
                then: (schema) => schema.required('Specialization is required'),
                otherwise: (schema) => schema.notRequired(),
            }),
            
            TestAmount: Yup.number()
      .typeError('Amount must be a number')
      .required('Amount is required')
      .positive('Amount must be positive')
      .max(100000, 'Amount cannot exceed 100,000'),
  });