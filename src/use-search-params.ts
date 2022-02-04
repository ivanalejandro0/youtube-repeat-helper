import { useState } from "react";

function getCurrentURLSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

export function useSearchParams(): [URLSearchParams, (arg0: {}) => void] {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(getCurrentURLSearchParams());

  function ssp(data: {}) {
    const urlSearchParams = new URLSearchParams(data);
    const newurl = window.location.origin + "/?" + urlSearchParams.toString();
    console.log("pushState");
    window.history.pushState(undefined, document.title, newurl)
    setSearchParams(urlSearchParams);
  }

  return [searchParams, ssp];
}
