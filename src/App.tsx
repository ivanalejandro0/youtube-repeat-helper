import { useSearchParams } from "react-router-dom";
import { UserForm, Configuration } from './UserForm';
// import { useSearchParams } from './use-search-params';
import { YoutubeHelper } from './YoutubeHelper';

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
    <>
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
      <br />
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
        : <div>No video</div>
      }

      <h2>Examples</h2>
      <a href={`${window.location.origin}/?v=TDJsjhufD9c&start=5.1&stop=6.8&rate=0.5`}>tennis serve</a>
      <br />
      <a href={`${window.location.origin}/?v=I9fraQLy5uA&start=25.6&stop=27.6`}>guitar solo</a>
      <br /> <br />
    </>
  );
}

export default App;
