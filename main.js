import * as THREE from 'three';

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0000, 0.03);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 14);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffaa88, 0.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffdd99, 1000);
spotLight.position.set(5, 15, 5);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.5;
spotLight.castShadow = true;
scene.add(spotLight);

const redLight = new THREE.PointLight(0xff0000, 50, 20);
redLight.position.set(-5, 5, 5);
scene.add(redLight);

// --- BUILDING THE CHEF ---
const chefGroup = new THREE.Group();
const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc99, roughness: 0.8 });
const shirtMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
const hatMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.8 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 });

const torso = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 3, 32), shirtMat);
torso.castShadow = true;
chefGroup.add(torso);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), skinMat);
head.position.y = 2.2;
head.castShadow = true;
chefGroup.add(head);

const hair = new THREE.Mesh(new THREE.SphereGeometry(0.92, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
hair.position.y = 2.2;
chefGroup.add(hair);

const mustache = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32, Math.PI), hairMat);
mustache.position.set(0, 1.9, 0.85);
mustache.rotation.x = Math.PI / 2;
mustache.rotation.z = Math.PI;
chefGroup.add(mustache);

const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeMat);
leftEye.position.set(-0.3, 2.3, 0.8);
const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), eyeMat);
rightEye.position.set(0.3, 2.3, 0.8);
chefGroup.add(leftEye, rightEye);

const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.5, 32), hatMat);
hatBase.position.y = 3.1;
const hatPuff = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 32), hatMat);
hatPuff.position.y = 3.7;
hatPuff.scale.set(1, 0.8, 1);
chefGroup.add(hatBase, hatPuff);

const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2), shirtMat);
leftArm.position.set(-1.4, 0.5, 0.5);
leftArm.rotation.z = Math.PI / 4;
leftArm.rotation.x = -Math.PI / 4;
chefGroup.add(leftArm);

// Tossing Arm & Wok
const rightArmGroup = new THREE.Group();
rightArmGroup.position.set(1.2, 1, 0);
const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2.2), shirtMat);
rightArm.position.set(0, -1.1, 0);
rightArm.rotation.z = Math.PI / 2;
rightArmGroup.add(rightArm);

const wok = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.8, 0.6, 32), new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 }));
wok.position.set(2.2, 0, 0);
wok.rotation.z = -Math.PI / 4;
rightArmGroup.add(wok);

const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9 }));
handle.position.set(3.5, 0.5, 0);
handle.rotation.z = Math.PI / 2;
rightArmGroup.add(handle);

chefGroup.add(rightArmGroup);
scene.add(chefGroup);

// --- FOOD & PHYSICS ---
const foodGroup = new THREE.Group();
scene.add(foodGroup);
const foodPieces = [];
const foodColors = [0xffaa00, 0xff5500, 0x00aa00, 0x884400];

for (let i = 0; i < 25; i++) {
    const size = 0.15 + Math.random() * 0.15;
    const piece = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshStandardMaterial({ color: foodColors[Math.floor(Math.random() * foodColors.length)], roughness: 0.6 }));
    piece.castShadow = true;
    piece.userData = { velocityY: 0, velocityX: 0, velocityZ: 0, isFlying: false };
    foodGroup.add(piece);
    foodPieces.push(piece);
}

// --- SCROLL INTERACTION ---
let scrollY = 0;
let targetCameraY = 2;
let targetCameraZ = 14;
let targetChefRotY = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollY / maxScroll; // 0 to 1

    // As user scrolls down, move camera to the right and zoom out
    targetCameraY = 2 - (scrollPercent * 3); 
    targetCameraZ = 14 + (scrollPercent * 4);
    targetChefRotY = scrollPercent * Math.PI * 0.5; // Rotate chef slightly
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Arm Toss Animation
    const tossSpeed = 2.5;
    rightArmGroup.rotation.z = Math.sin(time * tossSpeed) * 0.4 - 0.2; 
    wok.rotation.z = -Math.PI / 4 + Math.sin(time * tossSpeed) * 0.2;

    // Smooth Camera Scroll
    camera.position.y += (targetCameraY - camera.position.y) * 0.05;
    camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
    chefGroup.rotation.y += (targetChefRotY - chefGroup.rotation.y) * 0.05;
    
    // Keep looking at the chef, but slightly higher as we scroll
    const lookAtY = 1 - (scrollY / (document.body.scrollHeight - window.innerHeight)) * 2;
    camera.lookAt(0, lookAtY, 0);

    // Food Physics
    const wokWorldPos = new THREE.Vector3();
    wok.getWorldPosition(wokWorldPos);

    foodPieces.forEach((piece) => {
        if (!piece.userData.isFlying) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.8;
            piece.position.set(
                wokWorldPos.x + Math.cos(angle) * radius,
                wokWorldPos.y,
                wokWorldPos.z + Math.sin(angle) * radius
            );

            if (Math.sin(time * tossSpeed) > 0.5 && Math.random() > 0.9) {
                piece.userData.isFlying = true;
                piece.userData.velocityY = 5 + Math.random() * 3;
                piece.userData.velocityX = (Math.random() - 0.5) * 2;
                piece.userData.velocityZ = (Math.random() - 0.5) * 2;
            }
        } else {
            piece.userData.velocityY -= 9.8 * 0.016;
            piece.position.y += piece.userData.velocityY * 0.016;
            piece.position.x += piece.userData.velocityX * 0.016;
            piece.position.z += piece.userData.velocityZ * 0.016;
            piece.rotation.x += 0.1;
            piece.rotation.y += 0.1;

            if (piece.position.y < wokWorldPos.y - 1) piece.userData.isFlying = false;
        }
    });

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
