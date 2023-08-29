import React, { useEffect, useState } from "react";
import ECAM from "./ecam/ECAM";
import Settings, { ServerList } from "./settings/Settings";
import Status from "./status/Status";
import { defaultServerList } from "./settings/defaults";

interface ServerStatus {
  [key: string]: {
    state: string;
    statusCode: number | null;
  };
}

const Home = () => {
  const [serverList, setServerList] = useState<Array<ServerList>>(JSON.parse(localStorage.getItem("serverList")) || defaultServerList);

  const serverListFromLocalStorage = localStorage.getItem("serverList");
  useEffect(() => {
    setIsLoaded(false);
    if (!serverListFromLocalStorage) {
      localStorage.setItem("serverList", JSON.stringify(defaultServerList));
    } else {
      setServerList(JSON.parse(serverListFromLocalStorage));
    }
  }, [serverListFromLocalStorage]);

  const initialStatus: ServerStatus = serverList.reduce(
    (acc, server) => ({
      ...acc,
      [server.url]: { state: "offline", statusCode: null },
    }),
    {}
  );

  const [status, setStatus] = useState<ServerStatus>(initialStatus);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const pingServer = async (server: string) => {
    try {
      const response = await fetch(server);
      console.log(
        `${server} responded with ${response.status} ${response.statusText}`
      );
      setStatus((prevStatus) => ({
        ...prevStatus,
        [server]: {
          state: response.status === 200 ? "online" : "offline",
          statusCode: response.status,
        },
      }));
    } catch (error) {
      setStatus((prevStatus) => ({
        ...prevStatus,
        [server]: { state: "error", statusCode: null },
      }));
    }
  };

  useEffect(() => {
    console.log(serverList);
    const intervalIds: NodeJS.Timeout[] = [];

    const pingPromises = serverList.map((server) => {
      return new Promise<void>((resolve, reject) => {
        const intervalId = setInterval(async () => {
          try {
            await pingServer(server.url);
            resolve();
          } catch (error) {
            console.log(error);
            reject();
          }
        }, 5000);
        intervalIds.push(intervalId);
      });
    });

    Promise.all(pingPromises)
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(false));

    return () => {
      intervalIds.forEach((intervalId) => {
        clearInterval(intervalId);
      });
    };
  }, [serverList]);

  return (
    <>
      <head>
        <title>Squeegee Status</title>
      </head>
      <div>
        <div className="drag-region" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Settings />
          <Status serverList={serverList} status={status} />
          {isLoaded && (
            <>
              <ECAM serverList={serverList} status={status} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
