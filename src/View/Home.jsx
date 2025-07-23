import React, { useRef, useEffect } from "react";
// import Carousel3D from '../Components/Carousel'; // Adjust the import path as needed

// Import your images
// import image1 from '../assets/Images/kapson-logo.png';
// import image2 from '../assets/Images/kapson-logo.png';
// import image3 from '../assets/Images/tool3.webp';
import Homepage from "../Components/Home";
// import Recommend from '../Components/Recommend';
// import CustomerReviews from '../Components/CustomerReviews';
import QualityCertificates3D from "../Components/Quality";
import companyVideo from "../assets/Images/Companyvedio.mp4";
import BackgroundVideo from "../assets/Images/Background.mp4";

const Home = () => {
  const videoRef = useRef(null);

  // Add useEffect to autoplay video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.log("Video autoplay failed:", error);
          setTimeout(() => {
            videoRef.current.play();
          }, 1000);
        }
      };
      playVideo();
    }
  }, []);

  // Create an array of image objects with captions
  // const carouselImages = [
  //   { src: image1, alt: "Tools" },
  //   { src: image2, alt: "Second Image" },
  //   // { src: image3, alt: "Third Image" },
  // ];

  return (
    <>
      {/* Background Video with Overlay */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          src={BackgroundVideo}
        >
          Your browser does not support the video tag.
        </video>
        {/* Black Fade Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Main Content */}
      <div className="">
        <Homepage />
        {/* <Carousel3D images={carouselImages} /> */}
        {/* <div className="flex flex-col items-center justify-center py-10">
          <div className="relative">
            {/* Industrial *
            <div className="text-orange-300 font-bold transform rotate-x-20 rotate-y-[-10deg] pt-10  ranslate-z-[50px] animate-slideFromLeft">
              <span className="text-5xl md:text-8xl lg:text-[120px] xl:text-[200px]">INDUSTRIAL</span>
            </div>

            {/* Tools *
            <div className="absolute top-0 left-10 sm:left-20 md:left-32 lg:left-40 xl:left-48 transform rotate-x-20 rotate-y-[-10deg] translate-z-[-50px] animate-slideFromRight">
              <span className="text-6xl md:text-9xl lg:text-[140px] xl:text-[230px] font-bold">TOOLS</span>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col lg:flex-row justify-between py-12 px-4 md:px-6 lg:py-16 lg:px-12 xl:px-20 gap-8 lg:gap-12">
          {/* Video Container - Full width on mobile, constrained on larger screens */}
          <div className="w-full lg:w-1/2 h-64 sm:h-96 lg:h-auto mb-8 lg:mb-0">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <video
                className="w-full h-full object-cover rounded-lg"
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                src={companyVideo}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Text Content - Takes remaining space */}
          <div className="w-full lg:w-1/2 text-white">
            <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 text-blue-600">
              Our Speciality
            </h1>

            <div className="text-sm md:text-base lg:text-lg space-y-4">
              <p>
                At our core, we are committed to delivering high-performance
                industrial tools that stand out for their quality, durability,
                and precision. Our tools are designed to meet the demanding
                needs of industries, ensuring they provide maximum efficiency
                and long-lasting performance. We believe that honesty and
                dedication are the foundation of great workmanship. That's why
                every tool we create undergoes strict quality checks to ensure
                it meets industry standards and exceeds customer expectations.
              </p>

              <p>
                Our team combines technical expertise with innovative design to
                develop tools that simplify complex tasks and improve
                productivity. Whether you're working in manufacturing,
                construction, or any other industrial sector, our solutions are
                tailored to help you achieve better results with minimal effort.
              </p>

              <p>
                We take pride in our transparent approach, ensuring that our
                customers receive exactly what they are promised — tools that
                perform consistently and reliably. By focusing on precision
                engineering and user-friendly designs, we strive to make your
                job easier and more efficient.
              </p>

              <p>
                When you choose our tools, you're not just investing in a
                product — you're gaining a trusted partner dedicated to
                supporting your success. Experience the difference that quality
                craftsmanship, honest work, and innovative design can make in
                your industry.
              </p>
            </div>

            <div className="mt-6 text-sm md:text-base lg:text-lg">
              <div className="flex items-start mb-3">
                <span className="mr-2 text-green-500 flex-shrink-0">✅</span>
                <span>
                  Enhanced Precision: Ensures accurate alignment and seamless
                  bonding.
                </span>
              </div>
              <div className="flex items-start mb-3">
                <span className="mr-2 text-green-500 flex-shrink-0">✅</span>
                <span>
                  Time Efficiency: Speeds up the belding process, reducing
                  manual effort.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* <Recommend />
        <CustomerReviews />
        <QualityCertificates3D /> */}
      </div>
    </>
  );
};

export default Home;
