import React, { useState } from "react";
import styled from "@emotion/styled";
import { BsSearch } from "react-icons/bs";

const dataByKreis = require("../../data/dataByKreis.geojson");

const InputWrapper = styled.div`
  width: 100%;
  margin: 20px 0px;
  float: right;
  border-radius: 2px;
  position: relative;
`;

const Input = styled.input`
  padding: 16px 24px 16px 52px;
  width: 100%;
  background: #f8f8f8;
  border: 0;
  box-sizing: border-box;
  border-radius: 2px;
  &:focus {
    outline: none;
  }
`;

const SuggestionsWrapper = styled.div`
  width: 100%;
  max-height: 176px;
  box-sizing: border-box;
  overflow: auto;
  border-radius: 2px;
  position: absolute;
  background: #f8f8f8;
`;

const Suggestion = styled.div`
  width: 100%;
  padding: 10px 24px 10px 52px;
  box-sizing: border-box;
  border-radius: 2px;
  &:hover,
  &:focus {
    background-color: #e6e6e6;
  }
`;

function Searchbar({ setActiveKreis }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  function handleSelect(d) {
    setActiveKreis(d);
    setValue(d.properties.GEN);
    setSuggestions([]);
  }

  function getSuggestions(text) {
    const searchTerm = text.toLocaleLowerCase();

    const matches =
      searchTerm.length === 0
        ? []
        : dataByKreis.features
            .filter((d) => d.properties.GEN.toLowerCase().includes(searchTerm))
            .sort((a, b) => a.properties.GEN.localeCompare(b.properties.GEN))
            .map((d) => (
              <Suggestion
                key={d.properties.DEBKG_ID}
                id={d.properties.DEBKG_ID}
                value={d.properties.GEN}
                onClick={() => handleSelect(d)}
              >
                {d.properties.GEN}
              </Suggestion>
            ));
    setSuggestions(matches);
    setValue(text);
  }

  return (
    <InputWrapper id="input-wrapper">
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
        type="text"
        placeholder="Kreis suchen"
        value={value}
        onChange={(e) => getSuggestions(e.target.value)}
      />
      <SuggestionsWrapper id="suggestions-wrapper">
        {suggestions}
      </SuggestionsWrapper>
    </InputWrapper>
  );
}

export default Searchbar;
