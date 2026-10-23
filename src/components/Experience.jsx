import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import fragmentShader from "../shaders/fragment.glsl";
import vertexShader from "../shaders/vertex.glsl";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
const IMAGE_URL = [
  "https://images.unsplash.com/photo-1774606570918-aa9d70b2932b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1774523195578-121a2d1da490?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1773772255047-74744067601e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1749303544314-cb8ec06223d5?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1775119221769-6b0af28704ed?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1775563655673-c28ac3802166?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const CARD_H = 1.1;
const CARD_W = 2;
const RADIUS = 3;
const TOTAL_CARD = IMAGE_URL.length;
const LERP_RATIO = 0.05;
const ROTATION_SMOOTHING = 3;
const FOOTER_GAP = 48;
const WORLD_UP = new THREE.Vector3(0, 1, 0);

const createPlaceholderTexture = () => {
  const texture = new THREE.DataTexture(
    new Uint8Array([222, 222, 219, 255]),
    1,
    1,
    THREE.RGBAFormat,
    THREE.UnsignedByteType,
  );

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return texture;
};

const configureImageTexture = (texture) => {
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const Card = ({
  index,
  texture,
  scrollSpeedRef,
  radius,
  cardWidth,
  cardHeight,
}) => {
  const angle = (index / TOTAL_CARD) * 2 * Math.PI;

  // Added [angle] dependency array here
  const position = useMemo(() => {
    const x = radius * Math.sin(angle);
    const z = radius * Math.cos(angle);

    return [x, 0, z];
  }, [angle, radius]);


  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uScrollSpeed: { value: 0 },
    }),
    [texture],
  );

  const materialRef = useRef(null);

  useFrame(() => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uScrollSpeed.value = scrollSpeedRef.current;
  });

  const navigate = useNavigate();

  const handleClick = (index) => {
    navigate(`/project/${index}`);
  };

  return (
    <mesh
      onPointerEnter={() => (document.body.style.cursor = "pointer")}
      onPointerLeave={() => (document.body.style.cursor = "default")}
      onClick={() => handleClick(index)}
      position={position}
      rotation={[0, angle, 0]}
      scale={[cardWidth / CARD_W, cardHeight / CARD_H, 1]}
    >
      {/* Keep geometry stable during resizes; scale the mesh instead. */}
      <planeGeometry args={[CARD_W, CARD_H, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        glslVersion={THREE.GLSL3}
        side={THREE.DoubleSide}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

const Experience = () => {
  const placeholderTextures = useMemo(
    () => IMAGE_URL.map(createPlaceholderTexture),
    [],
  );
  const [textures, setTextures] = useState(placeholderTextures);
  const { camera, size } = useThree();
  const aspect = size.width / Math.max(size.height, 1);
  const mobileScale = THREE.MathUtils.lerp(
    0.85,
    1.17,
    THREE.MathUtils.clamp((aspect - 0.8) / 0.5, 0, 1),
  );
  const viewHeight =
    2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  // Leave a larger side margin on tall phone screens to keep the full carousel visible.
  const ringWidthFactor = aspect < 0.5 ? 0.66 : aspect < 0.8 ? 0.76 : 0.9;
  const availableWidth = viewHeight * aspect * ringWidthFactor;
  const cardWidthByAspect = THREE.MathUtils.lerp(
    1.35,
    CARD_W,
    THREE.MathUtils.clamp((aspect - 0.45) / 0.65, 0, 1),
  );
  // Keep each card narrower than its neighboring center spacing and the view.
  const maxCardWidthForViewport =
    availableWidth /
    (2 * mobileScale * (Math.sin(Math.PI / 3) + 0.25));
  const responsiveCardWidth = Math.max(
    0.65,
    Math.min(cardWidthByAspect, maxCardWidthForViewport),
  );
  const responsiveCardHeight = CARD_H * (responsiveCardWidth / CARD_W);
  const responsiveRadius = THREE.MathUtils.clamp(
    (availableWidth / (2 * mobileScale) - responsiveCardWidth / 4) /
      Math.sin(Math.PI / 3),
    responsiveCardWidth,
    RADIUS,
  );

  const groupRef = useRef(null);
  const footerRef = useRef(null);
  const canvasRef = useRef(null);
  const boundsRef = useRef(new THREE.Box3());
  const boxCornersRef = useMemo(
    () => Array.from({ length: 8 }, () => new THREE.Vector3()),
    [],
  );
  const projectedCornerRef = useRef(new THREE.Vector3());
  const bottomCornerRef = useRef(new THREE.Vector3());
  const raisedCornerRef = useRef(new THREE.Vector3());

  const currentRotationRef = useRef(0);
  // Fixed Misspelled word variable
  const targetRotationRef = useRef(0);
  const currentFooterLiftRef = useRef(0);
  const footerAdjustmentActiveRef = useRef(false);
  const currentRevealRef = useRef(0);
  const targetRevealRef = useRef(0);

  const scrollSpeedRef = useRef(0);
  const targetScrollSpeedRef = useRef(0);

  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let disposed = false;
    let requestVersion = 0;
    const loader = new THREE.TextureLoader();

    const loadImages = () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        return;
      }

      const currentVersion = ++requestVersion;

      IMAGE_URL.forEach((url, index) => {
        let requestedTexture;

        requestedTexture = loader.load(
          url,
          (texture) => {
            if (disposed || currentVersion !== requestVersion) {
              texture.dispose();
              return;
            }

            configureImageTexture(texture);
            setTextures((currentTextures) =>
              currentTextures.map((currentTexture, textureIndex) =>
                textureIndex === index ? texture : currentTexture,
              ),
            );
          },
          undefined,
          () => {
            if (disposed || currentVersion !== requestVersion) {
              requestedTexture?.dispose();
              return;
            }

            // Leave this card's neutral texture in place if its image cannot load.
            requestedTexture?.dispose();
          },
        );
      });
    };

    const handleOffline = () => {
      // Ignore any image callbacks still in flight after the connection drops.
      requestVersion += 1;
    };

    loadImages();
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", loadImages);

    return () => {
      disposed = true;
      requestVersion += 1;
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", loadImages);
    };
  }, []);

  useEffect(() => {
    footerRef.current = document.querySelector(".footer");
    canvasRef.current = document.querySelector(".three-canvas");
    return () => {
      footerRef.current = null;
      canvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - previousScrollY;
      previousScrollY = nextScrollY;

      targetRevealRef.current = THREE.MathUtils.clamp(
        nextScrollY / (window.innerHeight * 1.05),
        0,
        1,
      );
      // Preserve scroll direction so the carousel reverses when scrolling up.
      if (!footerAdjustmentActiveRef.current || scrollDelta < 0) {
        targetRotationRef.current += scrollDelta * 0.0025;
      }
      targetScrollSpeedRef.current += scrollDelta * 0.003;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetMouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const rotationAlpha =
      1 - Math.exp(-ROTATION_SMOOTHING * Math.min(delta, 1 / 30));
    currentRotationRef.current +=
      (targetRotationRef.current - currentRotationRef.current) * rotationAlpha;

    scrollSpeedRef.current +=
      (targetScrollSpeedRef.current - scrollSpeedRef.current) * LERP_RATIO;

    currentRevealRef.current +=
      (targetRevealRef.current - currentRevealRef.current) * LERP_RATIO;

    const reveal = currentRevealRef.current;
    const baseY = THREE.MathUtils.lerp(-5.2, -1.05, reveal);
    groupRef.current.position.y = baseY;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(0.18, mobileScale, reveal),
    );
    groupRef.current.rotation.y = currentRotationRef.current;

    groupRef.current.rotation.x +=
      (-targetMouseRef.current.x * 0.3 - groupRef.current.rotation.x) * 0.5;

    groupRef.current.rotation.z +=
      (targetMouseRef.current.y * 0.3 - groupRef.current.rotation.z) * 0.3;

    const footer = footerRef.current;
    const footerTop = footer?.getBoundingClientRect().top ?? window.innerHeight;
    const canvasTop = canvasRef.current?.getBoundingClientRect().top ?? 0;
    let footerLift = 0;

    if (footerTop <= size.height + FOOTER_GAP) {
      groupRef.current.updateMatrixWorld(true);
      let corners = boxCornersRef.current;
      // Rebuild the scratch vectors if hot reload or a stale ref leaves the
      // array incomplete; this prevents a render-loop crash at the footer.
      if (
        !Array.isArray(corners) ||
        corners.length !== 8 ||
        corners.some((corner) => !corner)
      ) {
        corners = Array.from({ length: 8 }, () => new THREE.Vector3());
        boxCornersRef.current = corners;
      }
      let imageBottom = Number.NEGATIVE_INFINITY;

      groupRef.current.children.forEach((card) => {
        const { min, max } = boundsRef.current.setFromObject(card);
        corners[0].set(min.x, min.y, min.z);
        corners[1].set(min.x, min.y, max.z);
        corners[2].set(min.x, max.y, min.z);
        corners[3].set(min.x, max.y, max.z);
        corners[4].set(max.x, min.y, min.z);
        corners[5].set(max.x, min.y, max.z);
        corners[6].set(max.x, max.y, min.z);
        corners[7].set(max.x, max.y, max.z);

        corners.forEach((corner) => {
          const projectedY = projectedCornerRef.current.copy(corner).project(camera).y;
          const screenY = ((1 - projectedY) * size.height) / 2;

          if (screenY > imageBottom) {
            imageBottom = screenY;
            bottomCornerRef.current.copy(corner);
          }
        });
      });

      const targetBottom = footerTop - FOOTER_GAP;
      const imageBottomInViewport = canvasTop + imageBottom;
      const raisedBottom = raisedCornerRef.current
        .copy(bottomCornerRef.current)
        .add(WORLD_UP)
        .project(camera);
      const raisedBottomY = ((1 - raisedBottom.y) * size.height) / 2;
      const pixelsPerWorldUnit = imageBottom - raisedBottomY;

      if (pixelsPerWorldUnit > 0 && imageBottomInViewport > targetBottom) {
        footerLift =
          (imageBottomInViewport - targetBottom) / pixelsPerWorldUnit;
      }

    }

    if (footerLift >= currentFooterLiftRef.current) {
      currentFooterLiftRef.current = footerLift;
    } else {
      const release = 1 - Math.exp(-14 * delta);
      currentFooterLiftRef.current +=
        (footerLift - currentFooterLiftRef.current) * release;
    }

    const footerAdjustmentActive = currentFooterLiftRef.current > 0.001;
    if (footerAdjustmentActive && !footerAdjustmentActiveRef.current) {
      targetRotationRef.current = currentRotationRef.current;
      targetScrollSpeedRef.current = 0;
    }
    footerAdjustmentActiveRef.current = footerAdjustmentActive;

    groupRef.current.position.y = baseY + currentFooterLiftRef.current;

    targetScrollSpeedRef.current *= 0.8;
  });

  return (
    <>
      <group ref={groupRef} position={[0, -5.2, 0]} scale={0.18}>
        {textures.map((texture, idx) => {
          return (
            <Card
              key={IMAGE_URL[idx]}
              scrollSpeedRef={scrollSpeedRef}
              index={idx}
              texture={texture}
              radius={responsiveRadius}
              cardWidth={responsiveCardWidth}
              cardHeight={responsiveCardHeight}
            />
          );
        })}
      </group>
    </>
  );
};

export default Experience;
