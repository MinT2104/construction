export interface VideoResponse {
  success: boolean;
  message: string;
  data: Video;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    standard: Thumbnail;
    maxres: Thumbnail;
  };
  channelId: string;
  channelTitle: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  url: string;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

// videoResponse {
//     success: true,
//     message: 'Lấy danh sách video Trọng Hoài thành công',
//     data: {
//       channelName: 'Trọng Hoài Xây Dựng',
//       channelId: 'UCg90bQIe2pkZoqyfEUZhIaw',
//       channelUrl: 'https://www.youtube.com/channel/UCg90bQIe2pkZoqyfEUZhIaw',
//       channelCustomUrl: 'https://www.youtube.com/@tronghoaixaydung',
//       channelVideosUrl: 'https://www.youtube.com/channel/UCg90bQIe2pkZoqyfEUZhIaw/videos',
//       channelThumbnail: 'https://yt3.ggpht.com/KZpy7fM-CyYYSkLBCZGjbsHuogz7NXnCo7jyduIC75I9E9eha-r3HD0cbsF7YPbiL_cIjHq5x4o=s800-c-k-c0x00ffffff-no-rj',
//       subscriberCount: 756,
//       viewCount: 97997,
//       videoCount: 12,
//       totalVideos: 12,
//       videos: [
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object],
//         [Object], [Object]
//       ]
//     }
//   }

export interface getAllVideosResponse {
  success: boolean;
  message: string;
  data: {
    channelName: string;
    channelId: string;
    channelUrl: string;
    channelCustomUrl: string;
    channelVideosUrl: string;
    channelThumbnail: string;
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
    totalVideos: number;
    videos: Video[];
  };
}
