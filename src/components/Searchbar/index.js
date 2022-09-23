import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { BsSearch } from "react-icons/bs";

const dataByKreis = require("../../data/dataByKreis.geojson");

const SearchbarWrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
  max-height: 239px;
  background: #f8f8f8;
  border-radius: 2px;
  position: relative;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin: 0,
  box-sizing: border-box;
  float: right;
  border-radius: 2px;
`;

const Input = styled.input`
  padding: 16px 24px 16px 52px;
  width: 100%;
  background: #f8f8f8;
  border: 0;
  box-sizing: border-box;
  border-radius: 2px;
`;

const SuggestionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 0px;
  max-height: 190px;
  order: 2;
  overflow: scroll;
`;

const SuggestionItem = styled.div`
  width: 100%;
  padding: 10px 24px 10px 52px;
  box-sizing: border-box;
  border-radius: 2px;
  &:hover {
    background-color: #e6e6e6;
  }
`;

// TODO: Rerenders not working
function Searchbar() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (value.length === 0) {
      setSuggestions([]);
      return;
    }
    const text = value.toLowerCase();
    const matches = dataByKreis.features
      .filter((d) => d.properties.GEN.toLowerCase().includes(text))
      .sort((a, b) => a.properties.GEN.localeCompare(b.properties.GEN))
      .map((d) => (
        <SuggestionItem key={d.properties.AGS}>
          {d.properties.GEN}
        </SuggestionItem>
      ));
    setSuggestions(matches);
    console.log(suggestions);
  }, [value]);

  return (
    <SearchbarWrapper id="searchbar-wrapper">
      <InputWrapper>
        <BsSearch
          width={16}
          height={16}
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            display: "inline-block",
          }}
        />
        <Input
          id="searchbar"
          placeholder="Kreis suchen"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </InputWrapper>
      <SuggestionWrapper id="suggestion-wrapper">
        {suggestions}
      </SuggestionWrapper>
    </SearchbarWrapper>
  );
}

export default Searchbar;
