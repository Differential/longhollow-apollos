import cloudinary from 'cloudinary';

(() => {
  cloudinary.config(true);
  cloudinary.config({
    private_cdn: false,
    secure: true,
  });
})();

const withCloudinary = (_url = '', options) => {
  const url = _url.replace(/:(443|80)/, '');
  // If we call this function twice, only the first transform will be applied
  if (url.startsWith('https://res.cloudinary.com')) {
    return url;
  }
  return cloudinary.url(url, {
    type: 'fetch',
    fetch_format: 'auto',
    width: '1920',
    // crop: 'limit',
    quality: 'auto',
    ...options,
  });
};

export default {
  resolver: {
    ImageMediaSource: {
      uri: ({ uri = '' }) => {
        if (!uri || typeof uri !== 'string') return null;
        if (uri.startsWith('http')) return withCloudinary(uri);
        if (uri.startsWith('//')) return withCloudinary(`https:${uri}`);
        return uri;
      },
    },
  },
};
