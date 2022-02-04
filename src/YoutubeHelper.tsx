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

  const onPlayerStateChange = React.useCallback(function onPlayerStateChange(event: {
    data: YouTubeIframeLoader.YTPlayerStates;
  }) {
    // console.log("onPlayerStateChange", event.data);
    if (event.data === YTPlayerStates.PLAYING) {
      if (!stop || ! start) return;
      const duration = stop - start;
      clearTimeout(tid);
      tid = setTimeout(restartVideoSection, wait2(duration, playbackRate) * 1000);
      return
    }

    if (event.data === YTPlayerStates.PAUSED) {
      console.log("time:", player?.getCurrentTime());
      return
    }

    if (event.data === YTPlayerStates.CUED) {
      if (start) {
        player?.seekTo(start);
      }
    }
  }, [player, start, stop, playbackRate, restartVideoSection]);

  const onPlaybackRateChange = React.useCallback(function onPlaybackRateChange(event: { data: number }) {
    const playbackRate = event.data;
    setPlaybackRate(playbackRate)

    if (!stop || ! start) return;
    const duration = stop - start;
    clearTimeout(tid);
    restartVideoSection();
    tid = setTimeout(restartVideoSection, wait2(duration, playbackRate) * 1000);
  }, [start, stop, restartVideoSection]);

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
    <div id="youtube-iframe-container"></div>
  );
}
