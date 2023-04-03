import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34936620-e9065520b73f9ad666c5d9e82';

  constructor() {
    this.query = '';
    this.page = 1;
    this.perPage = 40;
  }

 async fetchPhotos() {
    const {data} = await axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.perPage,
      },
    }); 
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  pageReset() {
    this.page = 1;
  }
}