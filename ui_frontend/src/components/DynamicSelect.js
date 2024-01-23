import React, { useState } from "react";
import { Button, Flex, Select, SelectItem } from "@tremor/react";
import generateLineChart from "./LineChartCombo";
import {  DataSketchesRequestCombo } from "../actions/authActions";

const DynamicSelect = ({startDate, endDate}) => {

  const initialOptions = [
    { label: "Pop", value: "Pop" },
    { label: "Rock", value: "Rock" },
    { label: "Rap", value: "Rap" },
    { label: "Blues", value: "Blues" },
    { label: "Classical", value: "Classical" },
    { label: "Dance", value: "Dance" },
    { label: "Disco", value: "Disco" },
    { label: "Hip-Hop", value: "Hip-Hop" },
    { label: "Jazz", value: "Jazz" },
    { label: "Latin", value: "Latin" },
    { label: "Metal", value: "Metal" },
    { label: "R&B", value: "R&B" },
    { label: "Techno", value: "Techno" },

  ];

  const initialDecades = [
    { label: "2020'", value: "2020" },
    { label: "2010'", value: "2010'" },
    { label: "2000'", value: "2000'" },
    { label: "90'", value: "90'" },
    { label: "80'", value: "80'" },
    { label: "70'", value: "70'" },
    { label: "60'", value: "60'" },
    { label: "50'", value: "50'" },
    { label: "40'", value: "40'" },
    { label: "30'", value: "30'" },
    { label: "20'", value: "20'" },
  ];

    
  const [selectItems, setSelectItems] = useState([{ genres: initialOptions, decades: initialDecades }]);
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedDecades, setSelectedDecades] = useState({});
  const [sketchesData, setData] = useState({})
  const [display, setDisplay] = useState(false);
  const [requestData, setRequest] = useState({});


    if (startDate === "" || endDate === "") {
        return (
          <div>
            Enter date
          </div>
        );
      }
  

  const handleButtonClick = () => {
    setSelectItems([...selectItems, { genres: initialOptions, decades: initialDecades }]);
  };

  const handleSelectChange = (selectIndex, value, isDecade) => {

    console.log(value)
    const selectedValuesCopy = { ...selectedValues };
    const selectedDecadesCopy = { ...selectedDecades };

    if (isDecade) {
        selectedDecadesCopy[selectIndex] = { ...selectedDecadesCopy[selectIndex], decade: value };
      setSelectedDecades(selectedDecadesCopy);

    } else {
      selectedValuesCopy[selectIndex] = { ...selectedValuesCopy[selectIndex], genre: value };
      setSelectedValues(selectedValuesCopy);

    }

  };

  const generateJsonData = ()=>{  
    let jsonData = [];
  
    for (let i of Object.keys(selectedValues)) {
      if(!(selectedValues[i].genre==="" || selectedDecades[i].decade==="")){
      let data = {
        genre: selectedValues[i].genre,
        decade: selectedDecades[i].decade,
      };
  
      jsonData.push(data);
    }
  }
  setRequest(jsonData);
    
  }

  const handleSubmit = async () => {
    generateJsonData();
    await new Promise(resolve => setTimeout(resolve, 500));

    if(requestData.length>0){
      request();
    }
  };

  const request =  () => {
    try {
        const parsedSpotifyURL = "http://aws_hostname:6060/data_sketch/trends/operation";
        if(startDate!="" && endDate!="" ){
        DataSketchesRequestCombo(parsedSpotifyURL, startDate, endDate,requestData)
        .then(response => {
          console.log(response)
          return response.text()
        }) 
        .then(data => {
          setDisplay(true);
          const cleanedData = data.replace(/"/g, '');
          console.log(data)
          let requestData = JSON.parse(atob(cleanedData));
          console.log(requestData)
   
          setData(requestData);
          setDisplay(true);
        })
       
        .catch(error => {
          console.log(error);
          setDisplay(false);
        });
       }
    } catch (error) {
      console.error('Błąd podczas zapytania:', error);
    }
    };



  return (
    <div clessName="scatter" style={{width:"100%"}}>
      <Flex justifyContent="center" alignItems="center" width="100%">
      <div className='url_desc2'>Click </div>
        <div className='add'> ADD </div>
        <div className='url_desc2'> to insert values</div>
      </Flex>
      <div style={{marginBottom:"2%"}}></div>
      {selectItems.map((selectSet, selectIndex) => (
        <Flex justifyContent="center" alignItems="center" key={selectIndex}>
          <Select
          className="select"
            placeholder="Select genre"
            value={selectedValues[selectIndex]?.genre || ""}
            onValueChange={(e) => handleSelectChange(selectIndex, e, false)}
          >
            {selectSet.genres.map((item, optionIndex) => (
              <SelectItem value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>

          <div style={{ margin: "2%" }}></div>

          <Select
          className="select"
            placeholder="Select decade"
            value={selectedDecades[selectIndex]?.decade || ""}
            onValueChange={(e) => handleSelectChange(selectIndex, e, true)}
          >
            {selectSet.decades.map((item, decadeIndex) => (
              <SelectItem key={decadeIndex} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </Flex>
      ))}
      <div style={{ margin: "2%" }}></div>
      <Button onClick={handleButtonClick}>ADD +</Button>
      <div style={{ margin: "2%" }}></div>
      <Button onClick={handleSubmit}>GENERATE</Button>
      <div style={{width:"100%"}}>

      <Flex justifyContent="center" alignItems="center" width="100%">
          {display && generateLineChart({ data: sketchesData, text: "Trends" })}
        </Flex>
        </div>
    </div>
  );
};

export default DynamicSelect;
