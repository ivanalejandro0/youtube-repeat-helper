import { UserForm, Configuration } from './UserForm';
import { useSearchParams } from './use-search-params';
import { YoutubeHelper } from './YoutubeHelper';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSubmit({ yid, start, stop }: Configuration) {
    setSearchParams({
      yid,
      start,
      stop,
    });
  }

  const yid = searchParams.get("yid");
  const start = searchParams.get("start");
  const stop = searchParams.get("stop");

  console.log("[render] App", { yid, start, stop });

  return (
    <>
      <UserForm
        {...{ yid, start, stop }}
        onSubmit={handleSubmit}
      />
      { yid && start && stop
        ? (
        <YoutubeHelper
          key={yid}
          {...{yid, start: Number(start), stop: Number(stop)}}
        />)
        : <div>No video</div>
      }

      <br />
      <a href={`${window.location.origin}/?yid=TDJsjhufD9c&start=5.1&stop=6.8`}>tennis serve</a>

    </>
  );
}

export default App;
