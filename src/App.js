import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import Pagination from './Pagination';
import './style.css';
import axios from 'axios';

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(
    'https://pokeapi.co/api/v2/pokemon'
  );
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let cancel;
    axios
      .get(currentPageUrl, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setLoading(false);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        setPokemon(res.data.results.map((p) => p.name));
      });

    return () => cancel();
  }, [currentPageUrl]);

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  if (loading) return 'Loading...';

  return (
    <div>
      <h1>Pokemon List</h1>
      <div className="container">
        <div className="pokemon-list">
          <PokemonList pokemon={pokemon} />
        </div>
        <Pagination
          gotoNextPage={nextPageUrl ? gotoNextPage : null}
          gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
        />
      </div>
    </div>
  );
}
