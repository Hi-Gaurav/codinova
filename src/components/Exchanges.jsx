import React, { useState, useEffect } from "react";
import Search from "./search";
const apiKey = "FDAB8705-CEAA-4A23-8A5B-6CC30B8D44D9";
const host = "http://localhost:5000/get-exchanges";

const Exchanges = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (data) => {
    console.log("jndksvn");
    setSearchTerm(data);
  };

  const filteredData = data?.filter((item) =>
    item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    Promise.all([
      fetch(host).then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }),
    ])
      .then(([data1 /* , data2, ... */]) => {
        setData(data1);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const totalPages = Math.ceil(filteredData?.length / 10);
  console.log("Total pages", totalPages);

  //   console.log(data);
  function convertToBillions(number) {
    return (number / 1e9).toFixed(2);
  }

  function calculateDisplayedPages(currentPage, totalPages) {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }

  return (
    <>
      <div className="search flex justify-center mb-10 mt-10">
        <Search
          value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
          handleSearch={handleSearch}
        />
      </div>
      {filteredData?.length > 0 ? (
        <>
          <table className="w-full ">
            <thead>
              <tr className="border-b">
                <td className="text-left pl-10">Exchanges</td>
                <td className="text-right pr-10">24H Trade Volume</td>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .slice(currentPage * 10, currentPage * 10 + 10)
                .map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td className="text-left pl-10 flex gap-3">
                        {`${index + 1} . `}
                        <img
                          src={
                            item?.icon_url
                              ? item?.icon_url
                              : "https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-picture-icon-png-image_695350.jpg"
                          }
                          alt=""
                          className="h-7 w-7"
                        />
                        <a href={item?.website}>{item?.name}</a>
                      </td>
                      <td className="text-right pr-10">{`$${convertToBillions(
                        item?.volume_1day_usd
                      )} billion`}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <nav className="mt-10 mb-20 flex gap-5 justify-center">
            <button
              className="rounded-full border border-blue-300 px-10 py-2 font-bold text-blue-500"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </button>

            {calculateDisplayedPages(currentPage, totalPages).map((number) => (
              <button
                key={number}
                className={`w-10 h-10 p-2 rounded font-bold ${
                  currentPage === number
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="rounded-full border border-blue-300 px-10 py-2 font-bold text-white bg-blue-500"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </nav>
        </>
      ) : (
        <div className="font-bold text-red-700 text-2xl">No Data</div>
        // ""
      )}
    </>
  );
};

export default Exchanges;
