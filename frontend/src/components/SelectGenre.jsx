import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchDataByGenre } from "../store";

export default function SelectGenre({ genres = [], type }) {
  const dispatch = useDispatch();

  // If no genres available, render a disabled select
  if (!genres.length) {
    return (
      <Select disabled className="flex">
        <option>No genres available</option>
      </Select>
    );
  }

  return (
    <Select
      className="flex"
      onChange={(e) => {
        dispatch(
          fetchDataByGenre({
            genres,
            genre: e.target.value,
            type,
          })
        );
      }}
    >
      {genres.map((genre) => (
        <option value={genre.id} key={genre.id}>
          {genre.name}
        </option>
      ))}
    </Select>
  );
}

const Select = styled.select`
  margin-left: 5rem;
  cursor: pointer;
  font-size: 1.4rem;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
