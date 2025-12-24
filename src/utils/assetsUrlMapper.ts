export const getThumbnailUrl = (id: string) => {
  return `https://album.storage.daydayhealth.click/cdn-cgi/image/width=75/${encodeURIComponent(
    id
  )}/original`;
};

export const getOriginalUrl = (id: string) => {
  return `https://album.storage.daydayhealth.click/${encodeURIComponent(
    id
  )}/original`;
};
