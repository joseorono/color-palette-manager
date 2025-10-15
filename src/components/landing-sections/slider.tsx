import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider-styles.css";

export const LandingSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-azure-web-50 via-white to-sky-50 py-20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Decorative background elements */}
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center justify-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-vivid-sky-blue/10 px-4 py-2 dark:bg-vivid-sky-blue/20">
            <span className="text-sm font-semibold text-vivid-sky-blue">
              See It In Action
            </span>
          </div>
          <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            About Color Palette Manager
          </h2>
          <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            A powerful web application that allows you to create, manage, and
            organize beautiful color palettes with ease
          </p>
        </div>

        {/* Slider */}
        <div className="slider-container mx-auto w-full max-w-6xl">
          <Slider {...settings}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="px-3" key={index}>
                <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-xl transition-all duration-500 hover:border-vivid-sky-blue hover:shadow-2xl hover:shadow-vivid-sky-blue/20 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-vivid-sky-blue">
                  <div className="absolute inset-0 bg-gradient-to-br from-vivid-sky-blue/0 to-vivid-sky-blue/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <img
                    src={`/ColorPalette-${index + 1}.png`}
                    alt={`Color Palette ${index + 1}`}
                    className="relative mx-auto w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};
