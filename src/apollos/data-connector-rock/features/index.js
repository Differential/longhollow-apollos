import { featuresSchema, commentSchema } from '../../data-schema/index.js';

export const schema = [featuresSchema, commentSchema];
export { default as dataSource } from './data-source.js';
export { default as resolver } from './resolver.js';
