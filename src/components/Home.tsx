import React, { useEffect, useState } from "react";
import ECAM from "./ecam/ECAM";
import Status from "./status/Status";

interface ServerStatus {
  [key: string]: {
    state: string;
    statusCode: number | null;
  };
}

export const serverList = [
  "https://dev.squeeg.ee",
  "https://staging.squeeg.ee",
  "https://api01.sqgee.com/",
  "https://api02.sqgee.com/",
  "https://api03.sqgee.com/",
  "https://api04.sqgee.com/",
  "https://api05.sqgee.com/",
  "https://api06.sqgee.com/",
  "https://api07.sqgee.com/",
  "https://api08.sqgee.com/",
  "https://api09.sqgee.com/",
];

const Home = () => {
  const initialStatus: ServerStatus = serverList.reduce(
    (acc, serverURL) => ({
      ...acc,
      [serverURL]: { state: "offline", statusCode: null },
    }),
    {}
  );

  const [status, setStatus] = useState<ServerStatus>(initialStatus);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const pingServer = async (serverURL: string) => {
    try {
      const response = await fetch(serverURL);
      console.log(
        `${serverURL} responded with ${response.status} ${response.statusText}`
      );
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
    console.log(serverList);
    const intervalIds: NodeJS.Timeout[] = [];

    const pingPromises = serverList.map((serverURL) => {
      return new Promise<void>((resolve, reject) => {
        const intervalId = setInterval(async () => {
          try {
            await pingServer(serverURL);
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
  }, []);

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
          <Status status={status} />
          {isLoaded && <ECAM status={status} />}
        </div>
      </div>
    </>
  );
};

export default Home;
