import React from "react";
import building_ic from "../../public/static/building_ic.svg";
import search_ic from "../../public/static/search_ic.svg";

const Search = (props) => {
  return (
    <>
      <div className="search border rounded-2xl flex p-2 w-fit items-center">
        <img src={building_ic} alt="" className="h-5 w-5" />
        <input
          type="text"
          name=""
          id=""
          placeholder="Find an Exchange"
          className="px-8"
          onChange={(e) => props?.handleSearch(e.target.value)}
        />
        <img
          src={search_ic}
          alt=""
          className="h-5 w-5"
          style={{ filter: "invert(1)" }}
        />
      </div>
    </>
  );
};

export default Search;
