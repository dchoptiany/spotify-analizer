import React, { useState, useEffect } from 'react';
import { Flex } from "@tremor/react";





const LikedTracks = () => {

    const getData =  () => {

        try {
            const parsedSpotifyURL = `http://aws_hostname:6060/user/analyse`
            console.log(parsedSpotifyURL)
            DataCollectorRequest(parsedSpotifyURL)
            .then(response => {
              console.log(response)
              return response.text();
            }) 
            .then(data => {
              requestData = JSON.parse(data);
              console.log(requestData);
     
              setUserData(requestData);
              setDisplay(true);
            })
            .catch(error => {
              console.log(error);
            });
        } catch (error) {
          console.error('Błąd podczas zapytania:', error);
        }
      
     }
     useEffect(() => {
        getData();
      }, []);
  return (
      <div className='tab'>

        </div>
    
    
  );


};

export default LikedTracks;