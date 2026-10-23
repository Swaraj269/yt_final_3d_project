import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";

const Three = () => (
  <div className="three-canvas">
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]}>
      <Experience />
    </Canvas>
  </div>
);

export default Three;
