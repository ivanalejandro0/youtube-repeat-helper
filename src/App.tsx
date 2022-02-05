import { useSearchParams } from "react-router-dom";
import { UserForm, Configuration } from './UserForm';
// import { useSearchParams } from './use-search-params';
import { YoutubeHelper } from './YoutubeHelper';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSubmit({ yid, start, stop }: Configuration) {
    setSearchParams({
      yid: yid || "",
      start: start || "",
      stop: stop || "",
    });
  }

  const yid = searchParams.get("yid");
  const start = searchParams.get("start");
  const stop = searchParams.get("stop");

  console.log("[render] App", { yid, start, stop });

  return (
    <>
      <h2>Load your video, configure your section to repeat</h2>
      <UserForm
        {...{ yid, start, stop }}
        onSubmit={handleSubmit}
      />
      <br />
      { yid
        ? (
        <YoutubeHelper
          key={yid}
          {...{yid, start: Number(start), stop: Number(stop)}}
        />)
        : <div>No video</div>
      }

      <h2>Examples</h2>
      <a href={`${window.location.origin}/?yid=TDJsjhufD9c&start=5.1&stop=6.8`}>tennis serve</a>
      <br />
      <a href={`${window.location.origin}/?yid=I9fraQLy5uA&start=24&stop=28`}>guitar solo</a>
    </>
  );
}

export default App;
