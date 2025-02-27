import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  Text,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { Fish } from "./Fish";
import { Dragon_Evolved } from "./Dragon_Evolved";
import { Cactoro } from "./Cactoro";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const controlRef = useRef();
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlRef.current.setLookAt(
        0,
        0,
        5,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true,
      )
    } else {
      controlRef.current.setLookAt(
        0,
        0,
        10,
        0,
        0,
        0,
        true,
      )
    }
  }, [active]);
  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <CameraControls ref={controlRef} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} />
      <MonsterStage
        texture={
          "textures/anime_art_style_a_water_based_pokemon_like_environ.jpg"
        }
        name="Fish"
        color={"#006b96"}
        active={active}
        setActive={setActive}
      >
        <Fish scale={0.6} position-y={-1} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/anime_art_style_cactus_forest.jpg"}
        name="Cactoro"
        color={"#577a28"}
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        active={active}
        setActive={setActive}
      >
        <Cactoro scale={0.45} position-y={-1} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/anime_art_style_lava_world.jpg"}
        name="Dragon"
        color={"#df8d52"}
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        active={active}
        setActive={setActive}
      >
        <Dragon_Evolved scale={0.5} position-y={-1} />
      </MonsterStage>
    </>
  );
};

const MonsterStage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();
  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });
  return (
    <group {...props}>
      <Text
        font="fonts/Caprasimo-Regular.ttf"
        fontSize={0.3}
        position={[0, -1.3, 0.051]}
      >
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onDoubleClick={() => setActive(active === name ? null : name)}
      >
        <MeshPortalMaterial side={THREE.DoubleSide} ref={portalMaterial}>
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
          {/* <Fish scale={0.6} position-y={-1} /> */}
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
