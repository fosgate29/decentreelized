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

export function DonorView({ zoomLevel }) {

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

    // On file upload (click the upload button)
    function onSubmit(e) {
      e.preventDefault();
      
      let newTree;

      if(selectedFile && w3words[0]){
        setSpinner(true);
        const uploadedFile = fleekStorage.upload({
          apiKey: 'CkjSqoo8LGad8ZSWmSSUng==',
          apiSecret: 'MZHypCPjUkUmsCHRc2jpT2IKfDKtmsgN4xQ9OVOxVPw=',
          key: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266/' + selectedFile.name,
          data: selectedFile,
        }).then( uploadedFile => { 
          setSelectedFileHash(uploadedFile.publicUrl);

          newTree = {w3w: w3words[0] ,
                     image: uploadedFile.publicUrl,
                     info: info,
                     description: description,
                     farmer_address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' }

          
         } ).then( () => {
              axiosapi.nfts.createnft(newTree).then( res => {
              setSpinner(false);
            })
         } )
      }

    };

    function onClickShowMap(w3w){
      api.convertToCoordinates(w3w)
        .then(data => {
          console.log(data); 
          console.log(location)
          setLocation({lat: data.coordinates.lat,lng: data.coordinates.lng,});
          console.log(location)
        });
    }

    const AnyReactComponent = ({text}: any) => <div className="marker" >{text}</div>;

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
    <div style={{font: "Source Sans Pro"}}>
    <h2>Find a tree</h2>
        <div style={{"fontWeight": 600, width: "200px", height: "38px", left: "45px", top: "42px"}}> 
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

      <hr />
      <hr />
      <h4>Mint NFTrees:</h4>
      {nftTrees.map((nfttree, index) => (
        <div className="card" style={{width: "18rem"}}>
          <img src={nfttree.image} className="card-img-top img-thumbnail img-fluid" />
          <div className="card-body">
            <h5 className="card-title">{nfttree.w3w}</h5>
            <p className="card-text">{nfttree.description}</p>
            <a href="#" onClick={() => onClickShowMap(nfttree.w3w)} className="card-link">/// {nfttree.w3w}</a>
            <a href="#" onClick={() => onClickShowMap(nfttree.w3w)} className="card-link">Mint</a>
          </div>
        </div>
      ))}

    </div>
    )
  
}
