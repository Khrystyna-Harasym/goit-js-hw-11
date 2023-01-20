import axios from 'axios';


async function fetchData(q, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '32834305-7ef8b7e7b5ec21fd9a207269c';
  const URL = `${BASE_URL}?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  const response = await axios.get(URL);
  return response;
}

export { fetchData };