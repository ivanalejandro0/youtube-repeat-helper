import React, { useEffect, useState } from 'react';

import YouTubeIframeLoader from "youtube-iframe";
import { YTPlayer } from "youtube-iframe";
import { setupYoutube } from "./Youtube";
import { wait2 } from "./rate-delay-adjust";

enum YTPlayerStates {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}


let tid: ReturnType<typeof setTimeout>;

interface YoutubeHelperProps {
  yid: string;
  start: number | null;
  stop: number | null;
}

export function YoutubeHelper({ yid, start, stop }: YoutubeHelperProps) {
  const [player, setPlayer] = useState<YTPlayer | undefined>();
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [paused, setPaused] = useState<string | undefined>()

  useEffect(function onMount() {
    async function setupYT() {
      const yt = await setupYoutube();
      setPlayer(yt)
    }
    setupYT();
  }, [])

  const restartVideoSection = React.useCallback(function restartVideoSection() {
    if (!start) return;
    player?.seekTo(start);
  }, [player, start])


  const scheduleRestart = React.useCallback(() => {
    if (!player || !stop || ! start) return;
    const end = Math.max(start, player.getCurrentTime());
    const duration = stop - end;
    clearTimeout(tid);
    tid = setTimeout(restartVideoSection, wait2(duration, playbackRate) * 1000);
  }, [player, start, stop, restartVideoSection, playbackRate])

  const onPlayerStateChange = React.useCallback(function onPlayerStateChange(event: {
    data: YouTubeIframeLoader.YTPlayerStates;
  }) {
    // console.log("onPlayerStateChange", event.data);
    if (event.data === YTPlayerStates.PLAYING) {
      scheduleRestart();
      return
    }

    if (event.data === YTPlayerStates.PAUSED) {
      if (!player) return;
      clearTimeout(tid);
      const pausedTime = player.getCurrentTime().toFixed(3);
      setPaused(pausedTime);
      return
    }

    if (event.data === YTPlayerStates.CUED) {
      restartVideoSection();
    }
  }, [restartVideoSection, player, scheduleRestart]);

  const onPlaybackRateChange = React.useCallback(function onPlaybackRateChange(event: { data: number }) {
    const playbackRate = event.data;
    setPlaybackRate(playbackRate)
    restartVideoSection();
    scheduleRestart();
  }, [restartVideoSection, scheduleRestart]);

  useEffect(function handleEvents() {
    const yt = player;
    if (!yt) return;
    // yt.addEventListener("onReady", onPlayerReady);
    yt.addEventListener("onStateChange", onPlayerStateChange);
    yt.addEventListener("onPlaybackRateChange", onPlaybackRateChange);

    return function removeListeners() {
      const yt = player;
      if (!yt) return;
      // yt.removeEventListener("onReady", onPlayerReady);
      yt.removeEventListener("onStateChange", onPlayerStateChange);
      yt.removeEventListener("onPlaybackRateChange", onPlaybackRateChange);
    }
  }, [player, onPlayerStateChange, onPlaybackRateChange]);

  useEffect(() => {
    restartVideoSection();
  }, [start, stop, restartVideoSection])

  useEffect(function handleVideoChange() {
    console.log("handleVideoChange");
    if (!player || !yid) return;
    player.cueVideoById({videoId: yid});
  }, [player, yid, start])

  console.log("[render] YoutubeHelper", { yid, start, stop });
  return (
    <>
      <div id="youtube-iframe-container"></div>
      { paused && <div>Last paused at: {paused}</div> }
    </>
  );
}
