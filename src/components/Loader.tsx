function SkeletonCard() {
  return (
    <div className="rounded-xl h-100 w-full overflow-hidden bg-gray-200">
      <div className="h-48 w-full shimmer" />
      <div className="p-4 space-y-3 mt-2">
        <div className="h-6 rounded w-3/4 shimmer" />
        <div className="h-5 rounded w-1/2 shimmer" />
        <div className="h-5 rounded w-1/4 shimmer" />
      </div>
    </div>
  );
}

function AuthSkeletonCard() {
  return (
    <div className="flex flex-col justify-between items-center py-20 rounded-xl h-80 w-150 overflow-hidden bg-gray-200">
      <div className="h-12 w-120 shimmer rounded-xl" />
      <div className="h-12 w-120 shimmer rounded-xl" />
    </div>
  );
}

function RootLayoutSkeleton() {
  return (
    <div className="max-w-[1300px] w-full mx-auto px-4">
      <div className="h-10 w-full mx-auto mt-5 rounded shimmer" />
    </div>
  );
}

function AppLayoutSkeleton() {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 mt-5">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 rounded shimmer" />
        <div className="flex gap-4">
          <div className="h-8 w-24 rounded shimmer" />
          <div className="h-8 w-20 rounded shimmer" />
        </div>
      </div>
    </div>
  );
}

export {
  SkeletonCard,
  AuthSkeletonCard,
  RootLayoutSkeleton,
  AppLayoutSkeleton,
};
