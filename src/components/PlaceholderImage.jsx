import { useEffect, useState } from "react";

const hasNetworkConnection = () =>
  typeof navigator === "undefined" || navigator.onLine;

const PlaceholderImage = ({ alt, className = "", loading = "lazy", src }) => {
  const [image, setImage] = useState(() => ({
    src,
    status: hasNetworkConnection() ? "loading" : "offline",
    attempt: 0,
  }));
  const isCurrentImage = image.src === src;
  const imageState = isCurrentImage ? image.status : "loading";
  const attempt = isCurrentImage ? image.attempt : 0;
  const isOnline = hasNetworkConnection();

  useEffect(() => {
    const handleOffline = () => {
      setImage((currentImage) => {
        if (currentImage.src !== src || currentImage.status === "loaded") {
          return currentImage;
        }

        return { ...currentImage, status: "offline" };
      });
    };

    const handleOnline = () => {
      setImage((currentImage) => {
        if (currentImage.src !== src || currentImage.status === "loaded") {
          return currentImage;
        }

        return {
          ...currentImage,
          status: "loading",
          attempt: currentImage.attempt + 1,
        };
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [src]);

  return (
    <span
      className={`image-placeholder${className ? ` ${className}` : ""}`}
      aria-busy={isOnline && imageState === "loading"}
    >
      {isOnline && imageState !== "offline" && (
        <img
          key={`${src}-${attempt}`}
          className={`image-placeholder-image is-${imageState}`}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setImage({ src, status: "loaded", attempt })}
          onError={() => {
            setImage({ src, status: "failed", attempt });
          }}
        />
      )}
    </span>
  );
};

export default PlaceholderImage;
