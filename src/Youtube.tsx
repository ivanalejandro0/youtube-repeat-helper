import YouTubeIframeLoader, { YouTube, YTPlayer } from "youtube-iframe";

import { wait2 } from "./rate-delay-adjust";

function createPlayerPlaceholder() {
  // Create div element that the <iframe> (and video player)
  // will replace.
  // Append it to the end of the document body
  // a simple alternative to this is to just add a
  // <div id="player"></div> to the index.html
  const p = document.createElement("div");
  p.setAttribute("id", "player");
  document.body.appendChild(p);
}

// check out docs on:
// https://developers.google.com/youtube/iframe_api_reference
function onYouTubeIframeAPIReady(yt: YouTube): YTPlayer {
  let player: YTPlayer;
  let tid: ReturnType<typeof setTimeout>;
  let playbackRate = 1;

  const section = {
    start: 5.1,
    end: 6.8
  };

  function onPlayerReady(_event: any) {
    // player.seekTo(section.start);
    // player.setPlaybackRate(playbackRate);
    // player.playVideo();
  }

  const events = {
    "-1": "unstarted",
    [yt.PlayerState.ENDED]: "ended",
    [yt.PlayerState.PLAYING]: "playing",
    [yt.PlayerState.PAUSED]: "paused",
    [yt.PlayerState.BUFFERING]: "buffering",
    [yt.PlayerState.CUED]: "cued"
  };

  function restartVideoSection() {
    player.seekTo(section.start);
  }

  function onPlayerStateChange(event: {
    data: YouTubeIframeLoader.YTPlayerStates;
  }) {
    // console.log("event:", events[event.data]);
    // console.log("time:", player.getCurrentTime());

    // if (event.data === yt.PlayerState.PLAYING) {
    //   const duration = section.end - section.start;
    //   clearTimeout(tid);
    //   tid = setTimeout(restartVideoSection, wait2(duration, playbackRate) * 1000);
    // }
    //
    // if (event.data === yt.PlayerState.PAUSED) {
    //   console.log("time:", player.getCurrentTime());
    // }
  }

  function onPlaybackRateChange(event: { data: number }) {
    // playbackRate = event.data;
    // const duration = section.end - section.start;
    // clearTimeout(tid);
    // restartVideoSection();
    // tid = setTimeout(restartVideoSection, wait2(duration, playbackRate) * 1000);
    // console.log("[onPlaybackRateChange]", event);
  }

  player = new yt.Player("player", {
    height: "360",
    width: "640",
    videoId: "TDJsjhufD9c",
    events: {
      // onReady: onPlayerReady,
      // onStateChange: onPlayerStateChange,
      // onPlaybackRateChange,
    }
  });

  return player;
}

// YouTubeIframeLoader.load(function (YT) {
//   createPlayerPlaceholder();
//   onYouTubeIframeAPIReady(YT);
// });

export function setupYoutube(): Promise<YTPlayer> {
  let player: YTPlayer;

  return new Promise((resolve) => {
    YouTubeIframeLoader.load(function (YT) {
      createPlayerPlaceholder();
      player = onYouTubeIframeAPIReady(YT);
      resolve(player)
    });
  })
}
