import axios from "axios";

const endpoint = 'https://jsonbox.io/box_5f924cceba34766ac835';

const getAll = () => {
  return axios.get(endpoint + "/nfts2?sort=_createdOn");
};

const createnft = treenft => {
  return axios.post(endpoint + "/nfts2", treenft);
};

const destroynft = id => {
  return axios.delete(endpoint + `/nfts2/${id}`);
};

export default {
  nfts: {
    getAll,
    createnft,
    destroynft
  }
};