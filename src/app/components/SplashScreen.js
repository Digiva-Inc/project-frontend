import Image from "next/image";

export default function SplashScreen({ fadeOut }) {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center bg-white
        ${fadeOut ? "animate-fade-out" : ""}
      `}
    >
      <Image
        src="/digiva.png"
        alt="Logo"
        priority
        width={300}
        height={300}
        className={`animate-logo-zoom

          */ Responsive base size */
          w-24 h-24        /* mobile */
          sm:w-28 sm:h-28  /* large mobile */
          md:w-32 md:h-32  /* tablet */
          lg:w-36 lg:h-36  /* laptop */
          xl:w-40 xl:h-40  /* large screens */

          object-contain
        `}
      />
    </div>
  );
}