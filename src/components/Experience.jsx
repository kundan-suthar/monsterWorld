import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  Text,
  useCursor,
  useTexture,
  useProgress,
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
  const [hovered, setHovered] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false); // New state for reveal
  useCursor(hovered)
  const controlRef = useRef();
  const scene = useThree((state) => state.scene)
  const { active: loading, loaded, total } = useProgress(); // Track loading progress
  useEffect(() => {
    if (!controlRef.current) return;
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
  // Handler for the Surprise button click
  const handleSurpriseClick = () => {
    setIsRevealed(true);
  };
  // If not revealed, show black screen with button
  if (!isRevealed) {
    return (
      <>
        <color attach="background" args={["#000000"]} /> {/* Black background */}
        <Text
          fontSize={0.5}
          position={[0, 0, 0]}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Surprise!!!
          <meshBasicMaterial toneMapped={false} />
        </Text>
        <mesh
          position={[0, -0.6, 0]}
          onClick={handleSurpriseClick}
        >
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial color="#ff5555" />
          <Text
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Click Me!
            <meshBasicMaterial toneMapped={false} />
          </Text>
        </mesh>
      </>
    );
  }
  // Loading screen while assets are loading
  if (loading || loaded < total) {
    return (
      <>
        <color attach="background" args={["#000000"]} />
        <Text
          fontSize={0.5}
          position={[0, 0, 0]}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Loading...
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </>
    );
  }
  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <CameraControls ref={controlRef} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} />
      <MonsterStage
        texture={
          "textures/anime_art_style_a_water_based_pokemon_like_environ.jpg"
        }
        name="Fish King"
        color={"#006b96"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Fish scale={0.6} position-y={-1} hovered={hovered === "Fish King"} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/anime_art_style_cactus_forest.jpg"}
        name="Cactoro"
        color={"#577a28"}
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}

      >
        <Cactoro scale={0.45} position-y={-1} hovered={hovered === "Cactoro"} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/anime_art_style_lava_world.jpg"}
        name="Dragon"
        color={"#df8d52"}
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Dragon_Evolved scale={0.5} position-y={-1} hovered={hovered === "Dragon"} />
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
  hovered,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();
  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });
  let handleDoubleClick = () => {
    setActive(active === name ? null : name)
    console.log(active);

  }
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
        onDoubleClick={handleDoubleClick}

        onPointerEnter={() => {
          setHovered(name);
          console.log("Hovered:", name);
        }}
        onPointerLeave={() => setHovered(null)}
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
