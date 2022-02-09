import { useSearchParams } from "react-router-dom";
import {ThemeSwitcher} from "./theme-switcher";
import { UserForm, Configuration } from './UserForm';
import { YoutubeHelper } from './YoutubeHelper';

function getBaseUrl(): string {
  return (
    window.location.protocol + '//' +
    window.location.host +
    window.location.pathname
  );
}

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSubmit({ yid, start, stop }: Configuration) {
    setSearchParams({
      v: yid || "",
      start: start || "",
      stop: stop || "",
    });
  }

  function handlePlaybackRateChange(rate: number) {
    setSearchParams({
      v: searchParams.get("v") || "",
      start: searchParams.get("start") || "",
      stop: searchParams.get("stop") || "",
      rate: rate.toString(),
    })
  }

  const yid = searchParams.get("v");
  const start = searchParams.get("start");
  const stop = searchParams.get("stop");
  const playbackRate = searchParams.get("rate");

  console.log("[render] App", { yid, start, stop });

  return (
    <main className="container">
      <ThemeSwitcher />
      <p>
        This is a simple web that helps you watch part of a Youtube video on repeat. For example:&nbsp;
        <a href={`${getBaseUrl()}/?v=TDJsjhufD9c&start=5.1&stop=6.8&rate=0.5`}>a tennis serve</a>
        &nbsp;or&nbsp;
        <a href={`${getBaseUrl()}/?v=I9fraQLy5uA&start=25.6&stop=27.6`}>a guitar solo</a>.
        <br />
        Use Youtube controls to adjust speed.
      </p>
      <h2>Your video</h2>
      <section>
        { yid
          ? (
            <YoutubeHelper
              key={yid}
              {...{
                yid,
                start: Number(start),
                stop: Number(stop),
                rate: Number(playbackRate),
                onRateChange: handlePlaybackRateChange,
              }}
            />)
            : <div>No video loaded</div>
        }
      </section>

      <h2>Load your video</h2>
      <p>
        Where do you get the video id?<br />
        Example youtube url (video id highlighted):<br />
        https://www.youtube.com/watch?v=<mark>TDJsjhufD9cl</mark>
      </p>

      <UserForm
        {...{ yid, start, stop }}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
