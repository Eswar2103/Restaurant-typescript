import type { ReactElement } from "react";

function Error(): ReactElement {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-3">
      <div className="font-bold">Arrived at the wrong destination</div>
      <div className="flex gap-x-2 items-center">
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Click here
        </button>
        <p>To go to Home page</p>
      </div>
    </div>
  );
}

export default Error;
