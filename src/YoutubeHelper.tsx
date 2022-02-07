import React, { useEffect, useState } from 'react';

import YouTube, { Options as YoutubeOptions } from 'react-youtube';
import { getWaitTimeForRate } from "./rate-delay-adjust";

type YoutubePlayer = ReturnType<YouTube['getInternalPlayer']>;

let tid: ReturnType<typeof setTimeout>;

interface YoutubeHelperProps {
  yid: string;
  start: number | null;
  stop: number | null;
  rate: number | null;
  onRateChange?: (rate: number) => void;
}

export function YoutubeHelper({ yid, start, stop, rate, onRateChange }: YoutubeHelperProps) {
  const [player, setPlayer] = useState<YoutubePlayer | undefined>();
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [paused, setPaused] = useState<string | undefined>()

  function onReady(event: any) {
    setPlayer(event.target)
  }

  const restartVideoSection = React.useCallback(function restartVideoSection() {
    if (!start) return;
    if (!player) return;
    player?.seekTo(start);
  }, [player, start])

  function scheduleRestart() {
    if (!player || !stop || ! start) return;
    const end = Math.max(start, player.getCurrentTime());
    const duration = stop - end;
    clearTimeout(tid);
    tid = setTimeout(restartVideoSection, getWaitTimeForRate(duration, playbackRate) * 1000);
  }

  function handlePause(event: { target: YoutubePlayer; data: number }) {
    const player = event.target;
    clearTimeout(tid);
    const pausedTime = player.getCurrentTime().toFixed(3);
    setPaused(pausedTime);
  }

  function onPlaybackRateChange(event: { data: number }) {
    const playbackRate = event.data;
    onRateChange?.(playbackRate);
    setPlaybackRate(playbackRate);
    restartVideoSection();
    scheduleRestart();
  }

  useEffect(function handleStartStopChanges() {
    restartVideoSection();
  }, [start, stop, restartVideoSection])

  useEffect(function handleRateChange() {
    if (!player || !rate) return;
    player.setPlaybackRate(rate);
  }, [player, rate])

  const opts: YoutubeOptions = {
    width: '100%',
    playerVars: {
      autoplay: 0, // not working, for some reason
    },
  };

  console.log("[render] YoutubeHelper", { yid, start, stop, rate });
  return (
    <>
      <YouTube
        videoId={yid}
        opts={opts}
        onReady={onReady}
        onPlay={scheduleRestart}
        onPause={handlePause}
        onPlaybackRateChange={onPlaybackRateChange}
      />
      { paused && <div>Last paused at: {paused}</div> }
    </>
  );
}
