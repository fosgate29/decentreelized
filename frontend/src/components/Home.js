import React, {useEffect} from "react";
import GoogleMapReact from 'google-map-react'
import { useTranslation } from 'react-i18next';
import fleekStorage from '@fleekhq/fleek-storage-js'
import axiosapi from "../axiosapi";
import Marker from './Marker';


export function Home({ ownerAddress }) {

    const { t } = useTranslation(); 
    const [poapEvent, setPoapEvent] = React.useState(null);

    const fetchData = async () => {

      const {data, status} = await axiosapi.nfts.getPOPEvent();
      if(status === 200){
        setPoapEvent(data);
      }

    }
  
    useEffect(()=>{
      fetchData();
    },[])


    return(
    <div>


      <div className="row">

          

          <div className="col-12">
          <img src="../poap.svg" />
          <h4>Get your badges here:</h4>
    
            <div>
                {poapEvent ?                    
                
                <div>
                    <img src={poapEvent.image_url} />
                    <div class="list-group">
                        <a href={poapEvent.attributes[5].value} class="list-group-item list-group-item-action active">
                            Event name: {poapEvent.name}
                        </a>
                        <a href={poapEvent.home_url} class="list-group-item list-group-item-action">Token page</a>
                        <li class="list-group-item list-group-item-action">Description: {poapEvent.description}</li>                        
                    </div>
                </div>


                : 'No Events'}
            </div>

          </div>
      </div>

      <hr />
     </div> 

    )
  
}
