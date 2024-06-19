// src/app/dashboard/metadata.ts
import { config } from '@/config';
import type { Metadata } from 'next';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;
