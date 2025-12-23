export const getThumbnailUrl = (id: string) => {
  return `https://album.storage.daydayhealth.click/${encodeURIComponent(
    id
  )}/original`;
};
