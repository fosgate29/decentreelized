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

export function MyNFT({ ownerAddress }) {

    const { t } = useTranslation();
    const [w3words, setW3words] = React.useState(['','','',''])
    const [location, setLocation] = React.useState({lat: -16.717564,lng: -43.926281,})
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [selectedFileHash, setSelectedFileHash] = React.useState(null);
    const [spinner, setSpinner] = React.useState(false);    
    const [nftTrees, setNftTrees] = React.useState([]);
    const [nftTreesMinted, setNftTreesMinted] = React.useState([]);


    const fetchData = async () => {
        console.log(ownerAddress)
      const {data, status} = await axiosapi.nfts.getAllMintedFromOwner(ownerAddress);
      console.log(data)
      if(status === 200){
        setNftTreesMinted(data);
      }

    }
  
    useEffect(()=>{
      fetchData();
    },[])

    
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
        api.convertTo3wa({lat:e.lat, lng:e.lng})
        .then(data => setW3words([data.words, 
          data.nearestPlace, 
          data.country,
          './flags/'+data.country + '@2x.png'
          ]) );      
    }

    return(
    <div>

      <div className="row">
              
        <div className="col-6">
            <div className="d-flex" style={{ height: "300px", width:"300px"}}>
                <GoogleMapReact 
                    bootstrapURLKeys={{ key: 'AIzaSyB6LdsRDkKpzudVSsomy4MmBzV7z3cN_HE' }}
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
        <div style={{"fontWeight": 600, width: "300px", height: "38px", left: "45px", top: "42px"}}> 
          <div style={{background: "#FFFFFF", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)"}}>
            {w3words[0] ? <span style={{color:"red"}}>///</span>:''}{w3words[0]}
          </div>
        </div>   
      <div >
        {w3words[0] ? <img alt="Flag" src={w3words[3]}></img>:''}{ w3words[0] ? ' ' + t('near') + ' ':''}{w3words[1]}
      </div>
        </div>

      </div>

      <div className="row">

          

          <div className="col-12">

          <h4>Your NFTrees:</h4>
          <div class="card-deck">
{nftTreesMinted.map((nfttree, index) => (
  <div className="card" style={{width: "18rem"}}>

      <div className="form-group">
          
              <img src={nfttree.image} className="card-img-top img-thumbnail img-fluid" />
              <div className="card-body">
                  <h5 className="card-title" style={{fontSize: "14px"}}>///{nfttree.w3w}</h5>
                  <p className="card-text">{nfttree.description}</p>
                  <input hidden className="form-control" type="text" name="nftid" value={nfttree._id} />
                  <a href="#" onClick={() => onClickShowMap(nfttree.w3w)} className="card-link">Show on the Map</a>
              </div>
      </div>
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
