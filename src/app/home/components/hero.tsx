import type { ReactNode } from "react";

interface HeroProps {
  title: string;
  titleDetail: string;
  children: ReactNode;
}

function Hero({ title, titleDetail, children }: HeroProps) {
  return (
    <section className="flex flex-1 flex-col bg-slate-100">
      <div className="bg-indigo-600 px-6 pb-28 pt-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-4 items-center justify-center">
            <h1 className="text-2xl font-bold text-white md:text-3xl text-center">
              {title} - Convert  {titleDetail}
            </h1>
          </div>
        </div>
      </div>
      <div className="-mt-20 px-6 pb-12">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </div>
    </section>
  );
}

export default Hero;
