import api from "./api";

export const DocumentService = {
async getQueue(mode, deviceId = null) {
    const response = await api.get('/v1/docs', {
      params: { 
        mode: mode,
        device_id: deviceId 
      }
    });
    return response.data;
  },

  async upload(payload) {
    const response = await api.post('/v1/docs/upload', payload);
    return response.data;
  },

  async retry(id) {
    const response = await api.post(`/v1/docs/retry/${id}`);
    return response.data;
  },

  download(fileUrl, filename) {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = filename || "processed_image";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};