import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const clientSchema = z.object({
  expediente: z.string().min(1, 'Expediente is required'),
  nombre: z.string().min(1, 'Nombre is required'),
  apellidos: z.string().min(1, 'Apellidos is required'),
  telefono: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  fecha_nacimiento: z.string().optional().or(z.literal('')),
  notas_generales: z.string().optional().or(z.literal(''))
});

export const sessionSchema = z.object({
  client_id: z.number().int().positive('Client ID is required'),
  fecha: z.string().min(1, 'Fecha is required'),
  profesional: z.string().min(1, 'Profesional is required'),
  tratamiento: z.string().min(1, 'Tratamiento is required'),
  zona: z.string().optional().or(z.literal('')).nullable(),
  producto: z.string().optional().or(z.literal('')),
  lote: z.string().optional().or(z.literal('')),
  cantidad: z.number().optional().nullable(),
  tecnica: z.string().optional().or(z.literal('')),
  observaciones: z.string().optional().or(z.literal('')),
  incidencias: z.string().optional().or(z.literal('')).nullable(),
  proxima_revision: z.string().optional().or(z.literal('')),
  injection_points: z.any().optional(),
  products_used: z.string().optional().or(z.literal('')).nullable()
});
