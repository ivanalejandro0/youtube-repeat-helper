import React, { useEffect, useState } from 'react';

import YouTubeIframeLoader from "youtube-iframe";
import { YTPlayer } from "youtube-iframe";
import { setupYoutube } from "./Youtube";
import { wait2 } from "./rate-delay-adjust";

enum YTPlayerStates {
  // UNSTARTED = -1,  // not a part of the api
  ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 4
}

// const events = {
//   "-1": "unstarted",
//   [YTPlayerStates.ENDED]: "ended",
//   [YTPlayerStates.PLAYING]: "playing",
//   [YTPlayerStates.PAUSED]: "paused",
//   [YTPlayerStates.BUFFERING]: "buffering",
//   [YTPlayerStates.CUED]: "cued"
// };

let tid: ReturnType<typeof setTimeout>;

function App() {
  // const player = React.useRef<YTPlayer | undefined>();
  const [player, setPlayer] = useState<YTPlayer | undefined>();
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [boundaries, setBoundaries] = useState<{ start: number, end: number } | undefined>();

  useEffect(function onMount() {
    async function setupYT() {
      const yt = await setupYoutube();
      setPlayer(yt)
      // player.current = yt;
      // yt.addEventListener("onReady", onPlayerReady);
      // yt.addEventListener("onStateChange", onPlayerStateChange);
      // yt.addEventListener("onPlaybackRateChange", onPlaybackRateChange);
    }
    setupYT();
  }, [])


  const onPlayerReady = React.useCallback(function onPlayerReady(_event: any) {
    if (!boundaries) return;
    player?.seekTo(boundaries.start);
  }, [player, boundaries]);

  const restartVideoSection = React.useCallback(function restartVideoSection() {
    if (!boundaries) return;
    player?.seekTo(boundaries.start);
  }, [player, boundaries])

  const onPlayerStateChange = React.useCallback(function onPlayerStateChange(event: {
    data: YouTubeIframeLoader.YTPlayerStates;
  }) {
    // console.log("event:", event.data);
    // console.log("time:", player?.getCurrentTime());

    if (event.data === YTPlayerStates.PLAYING) {
      if (!boundaries) return;
      const duration = boundaries.end - boundaries.start;
      clearTimeout(tid);
      tid = setTimeout(restartVideoSection, wait2(duration, playbackRate) * 1000);
      return
    }

    if (event.data === YTPlayerStates.PAUSED) {
      console.log("time:", player?.getCurrentTime());
      return
    }
  }, [player, boundaries, playbackRate, restartVideoSection]);

  const onPlaybackRateChange = React.useCallback(function onPlaybackRateChange(event: { data: number }) {
    if (!boundaries) return;
    console.log("[onPlaybackRateChange]", event.data);
    const playbackRate = event.data;
    setPlaybackRate(playbackRate)

    const duration = boundaries.end - boundaries.start;
    clearTimeout(tid);
    restartVideoSection();
    tid = setTimeout(restartVideoSection, wait2(duration, playbackRate) * 1000);
  }, [boundaries, restartVideoSection]);

  useEffect(function handleEvents() {
    const yt = player;
    if (!yt) return;
    yt.addEventListener("onReady", onPlayerReady);
    yt.addEventListener("onStateChange", onPlayerStateChange);
    yt.addEventListener("onPlaybackRateChange", onPlaybackRateChange);

    return function removeListeners() {
      const yt = player;
      if (!yt) return;
      yt.removeEventListener("onReady", onPlayerReady);
      yt.removeEventListener("onStateChange", onPlayerStateChange);
      yt.removeEventListener("onPlaybackRateChange", onPlaybackRateChange);
    }
  }, [player, onPlayerReady, onPlayerStateChange, onPlaybackRateChange]);

  useEffect(() => {
    restartVideoSection();
  }, [boundaries, restartVideoSection])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
      yid: HTMLInputElement;
      start: HTMLInputElement;
      stop: HTMLInputElement;
    }
    setBoundaries({
      start: Number(formElements.start.value),
      end: Number(formElements.stop.value),
    })

    console.log({event, type: typeof event});



    // window.history.pushState?
    const urlData = {
      tid: formElements.yid.value,
      start: formElements.start.value,
      stop: formElements.stop.value,
    }
    const urlSearchParams = new URLSearchParams(urlData).toString();
    const newurl = window.location.origin + "/?" + urlSearchParams;
    // TODO: update url parameters, useful for sharing
    window.history.pushState(undefined, document.title, newurl)

    event.preventDefault();
  }

  console.log("[render]");
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Youtube video id:
          <input
            type="text"
            name="yid"
            defaultValue="TDJsjhufD9c"
          />
        </label>
        <br />
        <label>
          Video start time:
          <input
            type="number"
            name="start"
            step="any"
            defaultValue="5.1"
          />
        </label>
        <br />
        <label>
          Video stop time:
          <input
            type="number"
            name="stop"
            step="any"
            defaultValue="6.8"
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default App;
