import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mahalla Textile Cluster',
    short_name: 'Mahalla Cluster',
    description: 'The largest B2B platform for the textile industry in Egypt.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/og-image.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
  };
}
