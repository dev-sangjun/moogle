import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useDispatch } from "react-redux";
import isEmpty from "is-empty";
import ClipLoader from "react-spinners/ClipLoader";
import { getYear } from "../utils";
import { setMovie } from "../reducers";

const SEARCH_MOVIES = gql`
  query searchMovie($keyword: String!) {
    movies(keyword: $keyword) {
      id
      title
      overview
      rating
      release_date
      poster_path
    }
  }
`;

const SearchBar = props => {
  const { className } = props;
  const [keyword, setKeyword] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useDispatch();
  const textField = useRef();
  const onChange = e => {
    setKeyword(e.target.value);
    setShowSuggestions(true);
  };
  const onClick = e => {
    const index = Number(e.target.dataset.index);
    dispatch(setMovie(data.movies[index]));
    console.log(data.movies[index]);
    setKeyword("");
    setShowSuggestions(false);
  };
  const { error, loading, data } = useQuery(SEARCH_MOVIES, {
    variables: {
      keyword,
    },
  });
  const renderSuggestion = () =>
    data.movies.map((movie, index) => (
      <li
        className="suggestion"
        key={movie.id}
        onClick={onClick}
        data-index={index}
      >
        <span>{movie.title}</span>
        <span>
          {isNaN(movie.release_date) ? getYear(movie.release_date) : "Unknown"}
        </span>
      </li>
    ));
  useEffect(() => {
    document.addEventListener("mousedown", e => {
      if (
        !e.target.classList.contains("suggestion") &&
        !isEmpty(keyword) &&
        e.target !== textField.current
      )
        setShowSuggestions(false);
    });
  });
  if (error) console.log(error.message);
  return (
    <div className={className}>
      <TextField onChange={onChange} value={keyword} ref={textField} />
      {!isEmpty(keyword) && loading && (
        <div className="spinner-container">
          <ClipLoader className="spinner" size="20" color="white" />
        </div>
      )}
      <Suggestions>{showSuggestions && data && renderSuggestion()}</Suggestions>
    </div>
  );
};

const TextField = styled.input.attrs(() => ({
  type: "text",
  placeholder: "Search...",
}))`
  -webkit-appearance: none;
  -webkit-border-radius: 0;
  width: 100%;
  background-color: rgba(80, 80, 80, 1);
  font-size: 1em;
  color: white;
  height: 2rem;
  border: none;
  padding: 0 0.5rem;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: rgba(200, 200, 200, 1);
  }
`;

const Suggestions = styled.ul`
  list-style: none;
  width: 100%;
  background-color: rgba(80, 80, 80, 1);
  user-select: none;
  max-height: 20rem;
  overflow: auto;
  opacity: 0.8;
  .suggestion {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    span {
      pointer-events: none;
    }
    &:hover {
      background-color: rgba(120, 120, 120, 1);
    }
  }
`;

export default styled(SearchBar)`
  position: relative;
  background-color: transparent;
  border-radius: 0.25rem;
  color: white;
  .spinner-container {
    width: 1.25rem;
    height: 1.25rem;
    position: absolute;
    top: 0;
    right: 0.375rem;
    transform: translateY(0.375rem);
  }
`;
