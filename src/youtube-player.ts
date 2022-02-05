import YouTubeIframeLoader, { YouTube, YTPlayer } from "youtube-iframe";

function createPlayerPlaceholder() {
  // Create div element that the <iframe> (and video player)
  // will replace.
  // Append it to the end of the document body
  // a simple alternative to this is to just add a
  // <div id="player"></div> to the index.html
  const p = document.createElement("div");
  p.setAttribute("id", "player");

  const containerId = "youtube-iframe-container";
  const container = document.getElementById(containerId);
  container?.appendChild(p);
}

// check out docs on:
// https://developers.google.com/youtube/iframe_api_reference
function onYouTubeIframeAPIReady(yt: YouTube): YTPlayer {
  let player: YTPlayer;

  player = new yt.Player("player", {
    height: "360",
    width: "640",
    origin: "http://localhost:3000",
  });

  return player;
}

export function setupYoutube(): Promise<YTPlayer> {
  return new Promise((resolve) => {
    YouTubeIframeLoader.load(function (YT) {
      createPlayerPlaceholder();
      const player = onYouTubeIframeAPIReady(YT);
      function onPlayerReady() {
        resolve(player);
      }
      player.addEventListener('onReady', onPlayerReady)
    });
  })
}
