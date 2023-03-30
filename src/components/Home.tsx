import React, { useEffect, useState } from "react";
import Status from "./status/Status";

interface ServerStatus {
  [key: string]: string;
}

const Home = () => {
  const serverList = [
    "https://dev.squeeg.ee",
    "https://staging.squeeg.ee",
    "https://app.squeeg.ee",
  ];

  const initialStatus: ServerStatus = serverList.reduce(
    (acc, serverURL) => ({ ...acc, [serverURL]: "offline" }),
    {}
  );

  const [status, setStatus] = useState<ServerStatus>(initialStatus);

  useEffect(() => {
    const pingServer = async (serverURL: string) => {
      try {
        const response = await fetch(serverURL);
        if (response.status === 200) {
          setStatus((prevStatus) => ({ ...prevStatus, [serverURL]: "online" }));
        } else {
          setStatus((prevStatus) => ({
            ...prevStatus,
            [serverURL]: "offline",
          }));
        }
      } catch (error) {
        setStatus((prevStatus) => ({ ...prevStatus, [serverURL]: "error" }));
      }
    };

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
      <div className="drag-region" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Status status={status} />
        {/* <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <div className={`status-annunciator ${status}`}>
            <span className="status-text"></span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
