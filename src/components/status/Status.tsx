import React from "react";
import { serverList } from "../Home";

type StatusProps = {
  status: {
    [key: string]: {
      state: string;
      statusCode: number | null;
    };
  };
};

const Status: React.FC<StatusProps> = ({ status }) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        {serverList.map((serverURL) => (
          <div
            key={serverURL}
            className={`status-annunciator ${status[serverURL].state}`}
          >
            <span className="status-text">
              {serverURL === "https://app.squeeg.ee"
                ? "PROD"
                : serverURL === "https://dev.squeeg.ee"
                ? "DEV"
                : serverURL === "https://staging.squeeg.ee"
                ? "STAG"
                : serverURL === "https://api01.sqgee.com/"
                ? "API01"
                : serverURL === "https://api02.sqgee.com/"
                ? "API02"
                : serverURL === "https://api03.sqgee.com/"
                ? "API03"
                : serverURL === "https://api04.sqgee.com/"
                ? "API04"
                : serverURL === "https://api05.sqgee.com/"
                ? "API05"
                : serverURL === "https://api06.sqgee.com/"
                ? "API06"
                : serverURL === "https://api07.sqgee.com/"
                ? "API07"
                : serverURL === "https://api08.sqgee.com/"
                ? "API08"
                : serverURL === "https://api09.sqgee.com/"
                ? "API09"
                : "ERROR"}{" "}
              Fail
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Status;
