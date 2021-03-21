import React, {useEffect} from "react";
import GoogleMapReact from 'google-map-react'
import { useTranslation } from 'react-i18next';
import fleekStorage from '@fleekhq/fleek-storage-js'
import axiosapi from "../axiosapi";
import Marker from './Marker';

  const api = require("@what3words/api");       
  api.setOptions({ key: "VXBYI3XZ" });
  api.convertToCoordinates("challenger.anyone.hassled")
  .then(data => console.log(data));

  const mapOptions = {
    mapTypeId: 'satellite',
    mapTypeControl: true,
  };

  api.availableLanguages()
  .then(data => console.log(data));

export function Map({ farmerAddress }) {  

    const endpoint = 'https://jsonbox.io/box_5f924cceba34766ac835';

    const { t } = useTranslation();
    const [w3words, setW3words] = React.useState(['','','',''])
    const [location, setLocation] = React.useState({lng: -64.674319, lat: -38.054725})
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [selectedFileHash, setSelectedFileHash] = React.useState(null);
    const [spinner, setSpinner] = React.useState(false);
    const [info, setInfo] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [nftTrees, setNftTrees] = React.useState([]);
    const [nftTreesMinted, setNftTreesMinted] = React.useState([]);

    const fetchData = async () => {
      const {data, status} = await axiosapi.nfts.getAllFromFarmer(farmerAddress);
      if(status === 200){
        console.log(data);
        setNftTrees(data);
      }
    }

    const fetchDataMinted = async () => {
      const {data, status} = await axiosapi.nfts.getAllMintedFromFarmer(farmerAddress);
      console.log(data)
      if(status === 200){
        console.log(data);
        setNftTreesMinted(data);
      }
    }
  
    useEffect(()=>{
      fetchData();
      fetchDataMinted();
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
          key: farmerAddress+'/' + selectedFile.name,
          data: selectedFile,
        }).then( uploadedFile => { 
          setSelectedFileHash(uploadedFile.publicUrl);

          newTree = {w3w: w3words[0] ,
                     image: uploadedFile.publicUrl,
                     info: info,
                     description: description,
                     farmer_address: farmerAddress }

          
         } ).then( () => {
              axiosapi.nfts.createnft(newTree).then( res => {
              setSpinner(false);
              fetchData();
            })
         } )
      }

    };

    function onClickShowMap(w3w){
      //const w3w = e.value;
      //console.log(w3w);
      //setLocation
      api.convertToCoordinates(w3w)
        .then(data => {
          console.log(data); 
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
    <div style={{font: "Source Sans Pro"}}>
    
        

      <div className="row">
          <div className="col-6">
          <h5>Hello Luiz!! Welcome. Please zoom your land and select trees to create NFTrees</h5>
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
                text="My Marker"
                color="blue"
              />
          </GoogleMapReact>
      </div>
          </div>
          <div className="col-6">

          <h4>Offer a new Tree:</h4>
      <form>
        <div class="form-row">
          <div class="form-group col-md-6">
              <label for="exampleFormControlInput1">Wikipedia link</label>
              <input class="form-control" onChange={onInfoChange} name="wikipediaInfo" type="text" placeholder="https://en.wikipedia.org/wiki/Handroanthus_impetiginosus" />
              <small id="wikipediaHelpBlock" className="form-text text-muted">
                Add Wikipedia link about the specie of this tree to give more info.
              </small>
          </div>
          <div class="form-group col-md-6">
              <label for="exampleFormControlTextarea1">Select a file</label>
              <div class="custom-file">
                    <input type="file" onChange={onFileChange} className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
                    <label className="custom-file-label" for="inputGroupFile01">{selectedFile ? selectedFile.name : 'Choose file' }</label>   
                    <small id="wikipediaHelpBlock" className="form-text text-muted">
                      Select a picture of this area.
                    </small>
              </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
              <label for="exampleFormControlTextarea1">Description:</label>
              <textarea name="description" onChange={onDescriptionChange} className="form-control" rows="3"></textarea>
              <small id="descriptionHelpBlock" className="form-text text-muted">
                Write about why you like this area, this tree, a brief history about it or you.
              </small>
          </div>
          <div class="form-group col-md-1">
             <label for="exampleFormControlTextarea1"></label>
             <input className="btn btn-primary" onClick={onSubmit} type="submit" value="Offer Tree" />                     
          </div>
          <div class="form-group col-md-5">
            <div>
              {spinner ? <div className="spinner-border text-success" role="status">
                          <span className="sr-only">Loading...</span> </div> 
                      : selectedFileHash ? 'Success!! NFT created' : ''}
              </div>
          </div>
        </div>
      </form>

          </div>
      </div>

      <hr />
      <h4>My Trees:</h4>
      <div class="card-deck">
        {nftTrees.map((nfttree, index) => (
          <div className="card" style={{width: "18rem"}}>
            <img src={nfttree.image} className="card-img-top img-thumbnail img-fluid" />
            <div className="card-body">
              <h5 className="card-title">///{nfttree.w3w}</h5>
              <a href="#" onClick={() => onClickShowMap(nfttree.w3w)} className="card-link">Show on the Map</a>
              <div class="card-footer">
                <small class="text-muted">{nfttree.description}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr />
      <h4>My Minted Trees (Real NFTrees):</h4>
      <div class="card-deck">
        {nftTreesMinted.map((nfttree, index) => (
          <div className="card" style={{width: "18rem"}}>
            <img src={nfttree.image} className="card-img-top img-thumbnail img-fluid" />
            <div className="card-body">
              <h5 className="card-title">///{nfttree.w3w}</h5>
              <a href="#" onClick={() => onClickShowMap(nfttree.w3w)} className="card-link">Show on the Map</a>
              <div class="card-footer">
                <small class="text-muted">{nfttree.description}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

    

  


      <hr />
      
      

      
      
    </div>



    )
  
}


