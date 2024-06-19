// src/app/dashboard/customers/metadata.ts
import type { Metadata } from 'next';
import { config } from '@/config';

export const metadata: Metadata = { title: `Customers | Dashboard | ${config.site.name}` };
