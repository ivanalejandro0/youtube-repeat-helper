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

function App() {
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
      <h2>Load your video, configure your section to repeat</h2>
      <p>
        Where do you get the video id?<br />
        Example youtube url (video id in red):<br />
        https://www.youtube.com/watch?v=<span style={{color: "red"}}>TDJsjhufD9cl</span>
      </p>
      <UserForm
        {...{ yid, start, stop }}
        onSubmit={handleSubmit}
      />
      <section>{ yid
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
          : <div>No video</div>
      }</section>

      <section>
        <h2>Examples</h2>
        <ul>
          <li>
            <a href={`${getBaseUrl()}/?v=TDJsjhufD9c&start=5.1&stop=6.8&rate=0.5`}>tennis serve</a>
          </li>
          <li>
            <a href={`${getBaseUrl()}/?v=I9fraQLy5uA&start=25.6&stop=27.6`}>guitar solo</a>
          </li>
        </ul>
      </section>
    </main>
  );
}

export default App;
