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
          w-32 h-32        /* mobile */
          sm:w-36 sm:h-36  /* large mobile */
          md:w-44 md:h-44  /* tablet */
          lg:w-48 lg:h-48 /* laptop */
          xl:w-52 xl:h-52  /* large screens */

          object-contain
        `}
      />
    </div>
  );
}