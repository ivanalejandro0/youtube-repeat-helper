// NOTE: only listed types I'm using
// check out docs on:
// https://developers.google.com/youtube/iframe_api_reference

declare module "youtube-iframe" {
  type YTPlayer = {
    setPlaybackRate: (suggestedRate: number) => void;
    playVideo: () => void;
    seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
    getCurrentTime: () => number;
    addEventListener: (event: string, listener: (event:any) => void) => void;
    removeEventListener: (event: string, listener: (event:any) => void) => void;
  };

  type YTPlayerConfig = {
    height: string;
    width: string;
    videoId: string;
    events: {
      onReady?: (event: any) => void;
      onStateChange?: (event: { data: YTPlayerStates }) => void;
      onPlaybackRateChange?: (event: { data: number }) => void;
    };
  };

  enum YTPlayerStates {
    // UNSTARTED = -1,  // not a part of the api
    ENDED = 1,
    PLAYING = 2,
    PAUSED = 3,
    BUFFERING = 4,
    CUED = 5
  }

  export type YouTube = {
    Player: new (_: string, config: YTPlayerConfig) => YTPlayer;
    PlayerState: typeof YTPlayerStates;
  };

  export function load(callback: (YT: YouTube) => void): void;
}

// existing types for this module as of 2021-July-11, from:
// https://github.com/Prinzhorn/youtube-iframe/blob/master/index.d.ts
// export function load(callback: (YT: any) => void): void;
