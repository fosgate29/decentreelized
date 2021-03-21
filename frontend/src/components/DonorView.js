import React, {useEffect} from "react";
import GoogleMapReact from 'google-map-react'
import { useTranslation } from 'react-i18next';
import fleekStorage from '@fleekhq/fleek-storage-js'
import axiosapi from "../axiosapi";
import Marker from './Marker';

  const api = require("@what3words/api");       
  api.setOptions({ key: "VXBYI3XZ" });
  api.convertToCoordinates("carrão.bola.castelo")
  .then(data => console.log(data));

  const mapOptions = {
    mapTypeId: 'satellite',
    mapTypeControl: true,
  };

  api.availableLanguages()
  .then(data => console.log(data));

export function DonorView({ mint , ownerAddress}) {

    const endpoint = 'https://jsonbox.io/box_5f924cceba34766ac835';

    const { t } = useTranslation();
    const [w3words, setW3words] = React.useState(['','','',''])
    const [location, setLocation] = React.useState({lat: -16.717564,lng: -43.926281,})
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [selectedFileHash, setSelectedFileHash] = React.useState(null);
    const [spinner, setSpinner] = React.useState(false);
    const [info, setInfo] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [nftTrees, setNftTrees] = React.useState([]);

    const fetchData = async () => {
      const {data, status} = await axiosapi.nfts.getAll();
      if(status === 200){
        setNftTrees(data);
      }

    }
  
    useEffect(()=>{
      fetchData();
    },[])

    function onFileChange(e) {
      // Update the state
      setSelectedFile(e.target.files[0]);
    };

    function onDescriptionChange(e) {
      setDescription(e.target.value);
    };
    
    function onInfoChange(e) {
      // Update the state
      setInfo(e.target.value);
    };    

    function onClickShowMap(w3w){
      api.convertToCoordinates(w3w)
        .then(data => {
          setLocation({lat: data.coordinates.lat,lng: data.coordinates.lng,});
          showW3WText(w3w);
        });
    }

    const AnyReactComponent = ({text}: any) => <div className="marker" >{text}</div>;

    function showW3WText(w3w) {
      api.convertToCoordinates(w3w).then(coo => {
          api.convertTo3wa({lat:coo.coordinates.lat, lng:coo.coordinates.lng})
          .then(data => setW3words([data.words, 
            data.nearestPlace, 
            data.country,
            './flags/'+data.country + '@2x.png'
            ]) );
      })
    }

    function handleClick(e) {
        //e.preventDefault();
        api.convertTo3wa({lat:e.lat, lng:e.lng})
        .then(data => setW3words([data.words, 
          data.nearestPlace, 
          data.country,
          './flags/'+data.country + '@2x.png'
          ]) );

        api.convertTo3wa({lat:e.lat, lng:e.lng})
        .then(data => console.log(data)) ;
        
      }

    return(
    <div>
        
        

      <div className="row">
          <div className="col-6">
          <h5>Hi. Thanks for helping. Select some trees to mint a NFTree.</h5>
          <div style={{"fontWeight": 600, width: "300px", height: "38px", left: "45px", top: "42px"}}> 
          <div style={{background: "#FFFFFF", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)"}}>
            {w3words[0] ? <span style={{color:"red"}}>///</span>:''}{w3words[0]}
          </div>
        </div>   
      <div >
        {w3words[0] ? <img alt="Flag" src={w3words[3]}></img>:''}{ w3words[0] ? ' ' + t('near') + ' ':''}{w3words[1]}
      </div>

      
      <div className="d-flex" style={{ height: "400px", width:"400px"}}>
          <GoogleMapReact 
            bootstrapURLKeys={{ key: 'AIzaSyB6LdsRDkKpzudVSsomy4MmBzV7z3cN_HE' }}
            //defaultCenter={{lat: -16.717564,lng: -43.926281,}}
            center={location}
            defaultZoom={15}
            options={mapOptions}
            onClick={handleClick} 
            yesIWantToUseGoogleMapApiInternals       
          > 
              <Marker
                lat={location.lat}
                lng={location.lng}
              />
          </GoogleMapReact>
      </div>

          </div>
          <div className="col-6">

          <h4>Mint NFTrees:</h4>
          <div class="card-deck">
{nftTrees.map((nfttree, index) => (
  <div className="card" style={{width: "18rem"}}>
  <form
      onSubmit={(event) => {
      // This function just calls the mint callback with the
      // form's data.
      event.preventDefault();

      const formData = new FormData(event.target);
      const nftid = formData.get("nftid");
      const index = formData.get("index");
      console.log(nftTrees[index])

      const mintedTree = {w3w: nftTrees[index].w3w ,
                     image:nftTrees[index].image,
                     info: nftTrees[index].info,
                     description: nftTrees[index].description,
                     farmer_address: nftTrees[index].farmer_address,
                     _id:  nftTrees[index]._id,
                     owner_address: ownerAddress }

      axiosapi.nfts.mintedNft(mintedTree).then( res => {
              axiosapi.nfts.destroynft(nftid).then(res => {fetchData()})              
            })

      const uri = "https://jsonbox.io/box_5f924cceba34766ac835/nftsminted6/" + nftid;

      if (uri) {
          mint(uri);
      }
  }}
  >
      <div className="form-group">
          {console.log(nfttree)}
              <img src={nfttree.image} className="card-img-top img-thumbnail img-fluid" />
              <div className="card-body">
                  <h5 className="card-title" style={{fontSize: "14px"}}>///{nfttree.w3w}</h5>
                  <p className="card-text">{nfttree.description}</p>
                  <input hidden className="form-control" type="text" name="nftid" value={nfttree._id} />
                  <input hidden className="form-control" name="index" value={index} />
                  
                  <a href="#" onClick={() => onClickShowMap(nfttree.w3w)} className="card-link">Show on the Map</a>
                  <div className="form-group">
                      <input className="btn btn-success" type="submit" value="Mint" />
                  </div>
              </div>
      </div>
  </form>
  </div>
  ))}

        </div>
          </div>
      </div>

      <hr />
      <hr /> 
      


    </div>
    )
  
}
