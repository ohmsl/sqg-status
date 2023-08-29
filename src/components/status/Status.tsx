import React from "react";
import { ServerList } from "../settings/Settings";

type StatusProps = {
  status: {
    [key: string]: {
      state: string;
      statusCode: number | null;
    };
  };
  serverList: Array<ServerList>;
};

const Status: React.FC<StatusProps> = ({ status, serverList }) => {
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
            key={serverURL.tag}
            className={`status-annunciator ${status[serverURL.url].state}`}
          >
            <span className="status-text">
              {serverURL.tag}{" "}
              Fail
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Status;
