import Image from "next/image";

const Loader = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
    <Image
      alt="loader"
      className="object-contain"
      height={200}
      src="/assets/loader.svg"
      width={200}
    />
    <p className="mt-4 text-lg font-bold text-primary-grey-300 tracking-widest">
      Loading...
    </p>
  </div>
);

export default Loader;
