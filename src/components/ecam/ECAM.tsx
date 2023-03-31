import React from "react";
import "./ecam.css";

type ECAMProps = {
  status: {
    [key: string]: {
      state: string;
      statusCode: number | null;
    };
  };
};

const getECAMMessage = (
  failedServers: {
    serverURL: string;
    serverName: string;
  }[],
  status: {
    [key: string]: {
      state: string;
      statusCode: number | null;
    };
  }
) => {
  const displayMessage = (
    error: string,
    info: string,
    message: JSX.Element
  ) => (
    <>
      {/* eslint-disable-next-line no-constant-condition */}
      {error && <div className={`text alert ${"red"} small`}>{error}</div>}
      {info && <div className="text info small">{info}</div>}
      {message}
    </>
  );

  let error, info, message;
  if (failedServers.length > 0) {
    const statusCode = status[failedServers[0].serverURL].statusCode;
    const serverName = failedServers[0].serverName;

    switch (statusCode) {
      case 400:
        error = "SRV ERR 400";
        info = `${serverName} - BAD REQUEST`;
        message = (
          <>
            <div className="text action small">-VERIFY API DOC</div>
            <div className="text action small">-INPUTS...........CHECK</div>
          </>
        );
        break;
      case 401:
        error = "SRV ERR 401";
        info = `${serverName} - UNAUTHORIZED`;
        message = (
          <>
            <div className="text action small">-CREDENTIALS...VERIFY</div>
            <div className="text action small">-AUTH METHOD....CHECK</div>
          </>
        );
        break;
      case 403:
        error = "SRV ERR 403";
        info = `${serverName} - FORBIDDEN`;
        message = (
          <>
            <div className="text action small">-PERMISSIONS...VERIFY</div>
            <div className="text action small">-USER ROLES.....CHECK</div>
          </>
        );
        break;
      case 404:
        error = "SRV ERR 404";
        info = `${serverName} - NOT FOUND`;
        message = (
          <>
            <div className="text action small">-URL/ENDPOINT...CHECK</div>
            <div className="text action small">-RESOURCES.....VERIFY</div>
          </>
        );
        break;
      case 500:
        error = "SRV ERR 500";
        info = `${serverName} - SERVER ERROR`;
        message = (
          <>
            <div className="text action small">-LOGS............CHECK</div>
            <div className="text action small">-DEBUG & FIX...PERFORM</div>
          </>
        );
        break;
      case 502:
        error = "SRV ERR 502";
        info = `${serverName} - BAD GATEWAY`;
        message = (
          <>
            <div className="text action small">-UPSTREAM SRV...VERIFY</div>
            <div className="text action small">-NETWORK.........CHECK</div>
          </>
        );
        break;
      case 503:
        error = "SRV ERR 503";
        info = `${serverName} - SRV UNAVAILABLE`;
        message = (
          <>
            <div className="text action small">-CAPACITY........CHECK</div>
            <div className="text action small">-SCALING........ADJUST</div>
          </>
        );
        break;
      case 504:
        error = "SRV ERR 504";
        info = `${serverName} - GATEWAY TIMEOUT`;
        message = (
          <>
            <div className="text action small">-UPSTRM SRV......VERIFY</div>
            <div className="text action small">-NETWORK..........CHECK</div>
          </>
        );
        break;
      case null:
        error = "SRV ERR 504";
        info = `${serverName} - GATEWAY TIMEOUT`;
        message = (
          <>
            <div className="text action small">-UPSTRM SRV......VERIFY</div>
            <div className="text action small">-NETWORK..........CHECK</div>
          </>
        );
        break;
      default:
        error = "SRV FAIL";
        info = `${serverName} - UNHANDLED ERROR`;
        message = (
          <>
            <div className="text action small">
              -STATUS CODE........{statusCode}
            </div>
            <div className="text action small">.IF NO RESTART</div>
            <div className="text action small">-CHECK GH DPLY ACTN..OK</div>
          </>
        );
    }

    return displayMessage(error, info, message);
  } else {
    message = (
      <>
        <div className="text green small">STATUS OK</div>
      </>
    );
    return displayMessage(null, null, message);
  }
};

const ECAM: React.FC<ECAMProps> = ({ status }) => {
  const serverList = [
    { serverURL: "https://dev.squeeg.ee", serverName: "DEV" },
    { serverURL: "https://staging.squeeg.ee", serverName: "STAG" },
    { serverURL: "https://app.squeeg.ee", serverName: "PROD" },
  ];

  const failedServers = serverList.filter(
    (s) =>
      status[s.serverURL].state === "offline" ||
      status[s.serverURL].state === "error"
  );

  return <div className="ecam">{getECAMMessage(failedServers, status)}</div>;
};

export default ECAM;
