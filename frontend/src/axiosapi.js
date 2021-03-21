import axios from "axios";

const endpoint = 'https://jsonbox.io/box_5f924cceba34766ac835';

const getAllFromFarmer = farmerAddress => {
  return axios.get(endpoint + "/nfts12?q=farmer_address:"+farmerAddress);
};

const getAll = () => {
  return axios.get(endpoint + "/nfts12?sort=_createdOn");  
};

const createnft = treenft => {
  return axios.post(endpoint + "/nfts12", treenft);
};

const mintedNft = treenft => {
  return axios.post(endpoint + "/nftsminted6", treenft);
};

const getAllMintedFromFarmer = farmerAddress => {
  return axios.get(endpoint + "/nftsminted6?q=farmer_address:"+farmerAddress);
};


const getAllMintedFromOwner = donorAddress => {
  return axios.get(endpoint + "/nftsminted6?q=owner_address:"+donorAddress);
};

const destroynft = id => {
  return axios.delete(endpoint + `/nfts12/${id}`);
};

export default {
  nfts: {
    getAll,
    getAllFromFarmer,
    createnft,
    mintedNft,
    destroynft,
    getAllMintedFromFarmer,
    getAllMintedFromOwner
  }
};