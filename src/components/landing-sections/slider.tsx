import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const LandingSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <>
      <div className="mt-16 flex flex-col items-center justify-center">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          About Color Palette Manager App
        </h2>
        <p className="mx-auto max-w-2xl text-center text-xl text-gray-600 dark:text-gray-300">
          Color Palette Manager App is a web application that allows users to
          create and manage color palettes with ease.
        </p>
      </div>
      <div className="slider-container mx-auto w-full max-w-6xl py-16">
        <Slider {...settings}>
          <div className="slide-item rounded-xl border border-gray-200 bg-white transition-all hover:border-vivid-sky-blue hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-vivid-sky-blue">
            <img
              src="/ColorPalette-1.png"
              alt="Color Palette 1"
              className="mx-auto w-auto rounded-md object-contain md:h-[600px]"
            />
          </div>
          <div className="slide-item rounded-xl border border-gray-200 bg-white transition-all hover:border-vivid-sky-blue hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-vivid-sky-blue">
            <img
              src="/ColorPalette-2.png"
              alt="Color Palette 2"
              className="mx-auto w-auto rounded-md object-contain md:h-[600px]"
            />
          </div>
          <div className="slide-item rounded-xl border border-gray-200 bg-white transition-all hover:border-vivid-sky-blue hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-vivid-sky-blue">
            <img
              src="/ColorPalette-3.png"
              alt="Color Palette 3"
              className="mx-auto w-auto rounded-md object-contain md:h-[600px]"
            />
          </div>
          <div className="slide-item rounded-xl border border-gray-200 bg-white transition-all hover:border-vivid-sky-blue hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-vivid-sky-blue">
            <img
              src="/ColorPalette-4.png"
              alt="Color Palette 4"
              className="mx-auto w-auto rounded-md object-contain md:h-[600px]"
            />
          </div>
          <div className="slide-item rounded-xl border border-gray-200 bg-white transition-all hover:border-vivid-sky-blue hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-vivid-sky-blue">
            <img
              src="/ColorPalette-5.png"
              alt="Color Palette 5"
              className="mx-auto w-auto rounded-md object-contain md:h-[600px]"
            />
          </div>
        </Slider>
      </div>
    </>
  );
};
