export default function WatchLoading() {
  return (
    <div className="page-container watch-page stack-lg" aria-busy="true">
      <div className="skeleton" style={{ height: "5rem" }} />
      <div className="skeleton" style={{ aspectRatio: "16 / 9" }} />
      <div className="skeleton" style={{ height: "15rem" }} />
    </div>
  );
}
