import http from './http-img';

class ImgService {
  uploadImg(img, type) {
    http.defaults.headers['Content-type'] = type;
    return http.post('/img', img);
  }
}

export default new ImgService();