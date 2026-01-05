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

  async mergePdf(payload) {
    const response = await api.post('/v1/docs/merge-pdf', payload);
    return response.data;
  },

  async retry(id) {
    const response = await api.post(`/v1/docs/retry/${id}`);
    return response.data;
  },

   async download(file) {

    console.log(file)
    const response = await api.get(
      `/v1/docs/download/${file.id}`,
      {
        responseType: 'blob', 
      }
    );
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    });

    const url = window.URL.createObjectURL(blob);
    console.log(file)
    const a = document.createElement('a');
    a.href = url;
    a.download = file.file_url;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }
};