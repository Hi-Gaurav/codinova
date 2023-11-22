import React from "react";
import Exchanges from "./components/exchanges";

const App = () => {
  const handleDataRefresh = () => {
    alert("Data refresh initiated");
    fetch("http://localhost:5000/fetch-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        alert(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <>
      <div className="flex justify-center w-full">
        <div className="text-center w-1/2 mb-10">
          <h1 className="font-bold text-xl">Top Crypto Exchange</h1>
          <h2>
            Compare all 190 top crypto exchanges. The list is ranked by trading
            volume.
          </h2>

          <div className="exchange border-b text-blue-600 font-bold mt-10">
            <button className="border-b-2 border-blue-600">Exchange</button>
          </div>

          <div className="exchanges">
            <Exchanges />
          </div>
          <button
            onClick={handleDataRefresh}
            className="bg-green-700 text-white font-bold px-4 py-1 rounded-full"
          >
            Fetch New Data From API
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
