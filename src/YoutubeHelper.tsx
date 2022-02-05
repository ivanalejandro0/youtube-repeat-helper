import React, { useEffect, useState } from 'react';

import YouTubeIframeLoader from "youtube-iframe";
import { YTPlayer } from "youtube-iframe";
import { setupYoutube } from "./youtube-player";
import { getWaitTimeForRate } from "./rate-delay-adjust";

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
  rate: number | null;
  onRateChange?: (rate: number) => void;
}

export function YoutubeHelper({ yid, start, stop, rate, onRateChange }: YoutubeHelperProps) {
  const [player, setPlayer] = useState<YTPlayer | undefined>();
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [paused, setPaused] = useState<string | undefined>()

  useEffect(function onMount() {
    async function setupYT() {
      const player = await setupYoutube();
      setPlayer(player)

      // load video
      player.cueVideoById({videoId: yid});
      if (rate) player.setPlaybackRate(rate);
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
    tid = setTimeout(restartVideoSection, getWaitTimeForRate(duration, playbackRate) * 1000);
  }, [player, start, stop, restartVideoSection, playbackRate])

  const onPlayerStateChange = React.useCallback(function onPlayerStateChange(event: {
    data: YouTubeIframeLoader.YTPlayerStates;
  }) {
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
      if (!player) return;
      restartVideoSection();
      if (rate) player.setPlaybackRate(rate);
    }
  }, [restartVideoSection, player, scheduleRestart, rate]);

  const onPlaybackRateChange = React.useCallback(function onPlaybackRateChange(event: { data: number }) {
    const playbackRate = event.data;
    onRateChange?.(playbackRate);
    setPlaybackRate(playbackRate);
    restartVideoSection();
    scheduleRestart();
  }, [restartVideoSection, scheduleRestart, onRateChange]);

  useEffect(function handleEvents() {
    if (!player) return;
    // player.addEventListener("onReady", onPlayerReady);
    player.addEventListener("onStateChange", onPlayerStateChange);
    player.addEventListener("onPlaybackRateChange", onPlaybackRateChange);

    return function removeListeners() {
      if (!player) return;
      // player.removeEventListener("onReady", onPlayerReady);
      player.removeEventListener("onStateChange", onPlayerStateChange);
      player.removeEventListener("onPlaybackRateChange", onPlaybackRateChange);
    }
  }, [player, onPlayerStateChange, onPlaybackRateChange]);

  useEffect(() => {
    restartVideoSection();
  }, [start, stop, restartVideoSection])

  // useEffect(function handleVideoChange() {
  //   if (!player || !yid) return;
  //   player.cueVideoById({videoId: yid});
  //   if (rate) player.setPlaybackRate(rate);
  // }, [player, yid, rate])

  useEffect(function handleRateChange() {
    if (!player || !rate) return;
    player.setPlaybackRate(rate);
  }, [player, rate])

  console.log("[render] YoutubeHelper", { yid, start, stop, rate });
  return (
    <>
      <div id="youtube-iframe-container"></div>
      { paused && <div>Last paused at: {paused}</div> }
    </>
  );
}
