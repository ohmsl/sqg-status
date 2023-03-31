import React from "react";

type StatusProps = {
  status: {
    [key: string]: {
      state: string;
      statusCode: number | null;
    };
  };
};

const serverList = [
  "https://dev.squeeg.ee",
  "https://staging.squeeg.ee",
  "https://app.squeeg.ee",
];

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
