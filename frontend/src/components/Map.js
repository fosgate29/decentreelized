import React, {useEffect} from "react";
import GoogleMapReact from 'google-map-react'
import { useTranslation } from 'react-i18next';
import axios from "axios";

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

export function Map({ zoomLevel }) {  


    const { t } = useTranslation();
    const [w3words, setW3words] = React.useState(['','','',''])
    const [location, setLocation] = React.useState({lat: -16.717564,lng: -43.926281,})

    const fetchData = async () => {
      const {data, status} = await axios.get("https://jsonbox.io/box_5f924cceba34766ac835/users");
      if(status === 200){
        console.log(data);
      }

    }
  
    useEffect(()=>{
      fetchData();
    },[])

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
        <div style={{"fontWeight": 600, width: "200px", height: "38px", left: "45px", top: "42px"}}> 
          <div style={{background: "#FFFFFF", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)"}}>
            {w3words[0] ? <span style={{color:"red"}}>///</span>:''}{w3words[0]}
          </div>
        </div>   
      <div >
        {w3words[0] ? <img alt="Flag" src={w3words[3]}></img>:''}{ w3words[0] ? ' ' + t('near') + ' ':''}{w3words[1]}
      </div>
      <div class="d-flex" style={{ height: "400px", width:"400px"}}>
        <GoogleMapReact 
          bootstrapURLKeys={{ key: 'AIzaSyB6LdsRDkKpzudVSsomy4MmBzV7z3cN_HE' }}
          defaultCenter={location}
          defaultZoom={15}
          options={mapOptions}
          onClick={handleClick}        
        >          
        </GoogleMapReact>
        
       </div>
      
    </div>



    )
  
}


