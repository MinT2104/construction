import axiosInstance from "@/lib/configs/axiosInstance";
import mediaEndpoint from "@/lib/endpoints/media.endpoint";

const MediaService = {
  // upload image
  upload: async (formData: FormData) => {
    const response = await axiosInstance.post(mediaEndpoint.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(
      mediaEndpoint.uploadDocument,
      formData
    );
    return response.data;
  },

  uploadVideo: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post(
      mediaEndpoint.uploadVideo,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },
};

export default MediaService;
