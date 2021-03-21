import axios from "axios";

const endpoint = 'https://jsonbox.io/box_5f924cceba34766ac835';

const getAllFromFarmer = () => {
  //return axios.get(endpoint + "/nfts2?sort=_createdOn");
  return axios.get(endpoint + "/nfts2?q=farmer_address:0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
};

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
    getAllFromFarmer,
    createnft,
    destroynft
  }
};