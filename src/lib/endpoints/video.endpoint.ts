export const videoEndpoints = {
  getVideosFromChannel: (channelId: string) => `/youtube/channel/${channelId}`,
  getVideosFromTrongHoaiXayDung: () => `/youtube/tronghoaixaydung`,
  getDirectVideoLinksFromTrongHoaiXayDung: () =>
    `/youtube/tronghoaixaydung/links`,
  getStructuredDataForTrongHoaiXayDungVideos: () =>
    `/youtube/tronghoaixaydung/seo`,
  getVideos: () => `/youtube/video`,
  getVideosByTag: (tag: string) => `/youtube/video/tag/${tag}`,
};
