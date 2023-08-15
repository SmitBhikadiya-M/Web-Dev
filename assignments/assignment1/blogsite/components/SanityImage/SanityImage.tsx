import { client } from "@/sanityClient";
import { useNextSanityImage } from "next-sanity-image";
import Image from "next/image";
import React from "react";

const SanityImage = ({ image, alt, className, style }: any) => {
  const imageProps: any = useNextSanityImage(client, image);
  return (
    <Image
      {...imageProps}
      placeholder="blur"
      blurDataURL={image.asset.metadata.lqip}
      alt={alt ?? image.asset.originalFilename}
      className={className ?? ""}
      style={...style ?? {}}
    />
  );
};

export default SanityImage;