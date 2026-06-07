import type { UseMutateFunction } from "@tanstack/react-query";

type GetConfirmation = {
  mutate: UseMutateFunction<void, Error, void, unknown>;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
};

function GetConfirmation({ mutate, setIsDelete, text }: GetConfirmation) {
  return (
    <div className="flex justify-center items-center">
      <div className="flex-col flex rounded-xl bg-stone-100 px-5 py-3 shadow-xl gap-2">
        <p className="font-bold">Do you want to delete the {text}?</p>
        <div className="flex gap-2">
          <button
            className="rounded-xl bg-green-500 px-2 py-1 text-white font-bold"
            onClick={() => mutate()}
          >
            Yes
          </button>
          <button
            className="rounded-xl bg-red-500 px-2 py-1 text-white font-bold"
            onClick={() => setIsDelete(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default GetConfirmation;
