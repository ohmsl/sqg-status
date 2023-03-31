import React, { useEffect, useState } from "react";
import ECAM from "./ecam/ECAM";
import Status from "./status/Status";

interface ServerStatus {
  [key: string]: {
    state: string;
    statusCode: number | null;
  };
}

const Home = () => {
  const serverList = [
    "https://dev.squeeg.ee",
    "https://staging.squeeg.ee",
    "https://app.squeeg.ee",
  ];

  const initialStatus: ServerStatus = serverList.reduce(
    (acc, serverURL) => ({
      ...acc,
      [serverURL]: { state: "offline", statusCode: null },
    }),
    {}
  );

  const [status, setStatus] = useState<ServerStatus>(initialStatus);

  const pingServer = async (serverURL: string) => {
    try {
      const response = await fetch(serverURL);
      setStatus((prevStatus) => ({
        ...prevStatus,
        [serverURL]: {
          state: response.status === 200 ? "online" : "offline",
          statusCode: response.status,
        },
      }));
    } catch (error) {
      setStatus((prevStatus) => ({
        ...prevStatus,
        [serverURL]: { state: "error", statusCode: null },
      }));
    }
  };

  useEffect(() => {
    const intervalIds: NodeJS.Timeout[] = [];

    serverList.forEach((serverURL) => {
      const intervalId = setInterval(() => pingServer(serverURL), 5000);
      intervalIds.push(intervalId);
    });

    return () => {
      intervalIds.forEach((intervalId) => {
        clearInterval(intervalId);
      });
    };
  }, []);

  return (
    <div>
      <head>
        <title>Squeegee Status</title>
      </head>
      <div className="drag-region" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Status status={status} />
        <ECAM status={status} />
      </div>
    </div>
  );
};

export default Home;
