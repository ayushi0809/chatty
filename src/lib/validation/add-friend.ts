import {z} from 'zod';

export const addFreindValidator = z.object(
    {
        email: z.string().email()
    }
)