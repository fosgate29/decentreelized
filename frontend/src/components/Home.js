import React, {useEffect} from "react";
import GoogleMapReact from 'google-map-react'
import { useTranslation } from 'react-i18next';
import fleekStorage from '@fleekhq/fleek-storage-js'
import axiosapi from "../axiosapi";
import Marker from './Marker';


export function Home({ userAddress }) {

    const { t } = useTranslation(); 
    const [poapEvent, setPoapEvent] = React.useState(null);
    const [poapBadge, setPoapBadge] = React.useState(null);

    const fetchData = async () => {

      const {data, status} = await axiosapi.nfts.getPOPEvent();
      if(status === 200){
        setPoapEvent(data);
      }

    }

    const fetchDataBadge = async () => {

        const {data, status} = await axiosapi.nfts.getPOPBadge(userAddress);
        if(status === 200){
            setPoapBadge(data);
        }
  
      }
  
    useEffect(()=>{
      fetchData();
      fetchDataBadge();
    },[])


    return(
    <div>


      <div className="row">

          

          <div className="col-12">
            <div className="col-4">
                <img src="../poap.svg" />
            </div>
            <div className="col-8">
                <button type="button" class="btn btn-primary">
                    POAP Badges <span class="badge badge-light">{poapBadge ? poapBadge.length : '0'}</span>
                    <span class="sr-only">number of badges</span>
                </button>
            </div>
            <div>
                {poapBadge ?                    
                
                <div>
                    <img src={poapBadge[0].event.image_url} />
                    <div class="list-group">
                        <a href={poapBadge[0].event.event_url} class="list-group-item list-group-item-action active">
                            Event name: {poapBadge[0].event.name}
                        </a>
                        <li class="list-group-item list-group-item-action">Start date: {poapBadge[0].event.start_date}</li>
                        <li class="list-group-item list-group-item-action">City: {poapBadge[0].event.city} - {poapBadge[0].event.country}</li>
                        <li class="list-group-item list-group-item-action">Description: {poapBadge[0].event.description}</li>                        
                    </div>
                </div>


                : 'No Events'}
            </div>

          </div>
          <hr />
          <hr />


          </div>

     

      <hr />
     </div> 

    )
  
}
