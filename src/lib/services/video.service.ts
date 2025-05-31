import {
  getAllVideosResponse,
  VideoResponse,
} from "../types/modules/video.interface";
import { videoEndpoints } from "../endpoints/video.endpoint";
import axiosInstance from "../configs/axiosInstance";
class VideoService {
  /**
   * Get a list of videos
   * @param page Page number (starting from 1)
   * @param limit Number of videos per page
   */
  async getTrongHoaiXayDungVideos(
    limit: number = 50
  ): Promise<getAllVideosResponse> {
    try {
      const response = await axiosInstance.get(
        videoEndpoints.getVideosFromTrongHoaiXayDung() + `?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      return {
        success: false,
        message: "Không thể tải danh sách video",
        data: {
          channelName: "",
          channelId: "",
          channelUrl: "",
          channelCustomUrl: "",
          channelVideosUrl: "",
          channelThumbnail: "",
          subscriberCount: 0,
          viewCount: 0,
          videoCount: 0,
          totalVideos: 0,
          videos: [],
        },
      };
    }
  }

  /**
   * Get a single video by ID
   * @param id YouTube video ID
   */
  async getVideoByUrl(url: string): Promise<VideoResponse> {
    try {
      const response = await axiosInstance.get(
        videoEndpoints.getVideos() + `?url=${url}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching video:", error);
      return {
        success: false,
        message: "Không thể tải video",
        data: {
          id: "",
          title: "",
          description: "",
          publishedAt: "",
          thumbnails: {
            default: { url: "", width: 0, height: 0 },
            medium: { url: "", width: 0, height: 0 },
            high: { url: "", width: 0, height: 0 },
            standard: { url: "", width: 0, height: 0 },
            maxres: { url: "", width: 0, height: 0 },
          },
          channelId: "",
          channelTitle: "",
          duration: "",
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          url: "",
        },
      };
    }
  }
}

export const videoService = new VideoService();
