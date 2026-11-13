import { CanvasTexture, Group, Mesh, MeshBasicMaterial, SRGBColorSpace, type Material } from "three";

// Adapt the supplied separate relief parts without mutating cached GLB geometry.
export function adaptMascot(model: Group) {
  const arm = new Group();
  const wrist = new Group();
  const sleeve = model.getObjectByName("Left_sleeve");
  const hand = model.getObjectByName("Left_hand");
  if (sleeve && hand) {
    arm.position.set(-0.59, 1.85, 0.08);
    model.add(arm);
    arm.attach(sleeve);
    arm.add(wrist);
    wrist.position.set(-0.03, -0.18, 0.35);
    model.updateMatrixWorld(true);
    wrist.attach(hand);
  }

  const helmet = model.getObjectByName("Helmet");
  let texture: CanvasTexture | undefined;
  let canvas: HTMLCanvasElement | undefined;
  let source: CanvasImageSource | undefined;
  const materials: Material[] = [];
  const originals: { object: Mesh; material: Material | Material[] }[] = [];
  helmet?.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    originals.push({ object, material: object.material });
    const original = Array.isArray(object.material) ? object.material : [object.material];
    const adaptedMaterials = original.map((material: Material) => {
      const cloned = material.clone();
      materials.push(cloned);
      if (cloned instanceof MeshBasicMaterial && cloned.map) {
        if (!canvas) {
          const image = cloned.map.image;
          if (!(image instanceof ImageBitmap) && !(image instanceof HTMLImageElement) && !(image instanceof HTMLCanvasElement)) return cloned;
          canvas = document.createElement("canvas");
          canvas.width = 768; canvas.height = 799;
          source = image;
          texture = new CanvasTexture(canvas);
          texture.colorSpace = SRGBColorSpace;
          texture.flipY = cloned.map.flipY;
        }
        if (texture) cloned.map = texture;
      }
      return cloned;
    });
    object.material = Array.isArray(object.material) ? adaptedMaterials : adaptedMaterials[0] ?? object.material;
  });

  // Colors come from semantic CSS roles; all changes stay in the existing visor UVs.
  const tokens = getComputedStyle(document.documentElement);
  const cyan = tokens.getPropertyValue("--mascot-expression").trim();
  const ink = tokens.getPropertyValue("--mascot-visor").trim();
  const drawFace = (blink: number, mouth: number) => {
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas || !source || !texture) return;
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    if (blink > 0.05) {
      for (const [x, y, rotation] of [[321, 193, 0.08], [478, 213, 0.14]] as const) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rotation);
        const patch = ctx.createRadialGradient(0, 0, 20, 0, 0, 53);
        patch.addColorStop(0, ink); patch.addColorStop(0.78, ink); patch.addColorStop(1, "transparent");
        ctx.fillStyle = patch; ctx.fillRect(-55, -50, 110, 100);
        ctx.strokeStyle = cyan; ctx.lineWidth = 12; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-30, 8); ctx.quadraticCurveTo(0, 8 - 43 * (1 - blink), 30, 8); ctx.stroke();
        ctx.restore();
      }
    }
    if (mouth > 0.05) {
      ctx.save(); ctx.translate(397, 244); ctx.rotate(0.09);
      const patch = ctx.createRadialGradient(0, 0, 18, 0, 0, 44);
      patch.addColorStop(0, ink); patch.addColorStop(0.78, ink); patch.addColorStop(1, "transparent");
      ctx.fillStyle = patch; ctx.fillRect(-48, -44, 96, 88);
      ctx.fillStyle = cyan; ctx.beginPath(); ctx.ellipse(0, 0, 28, 8 + mouth * 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    texture.needsUpdate = true;
  };
  drawFace(0, 0);
  return { model, arm, wrist, drawFace, dispose: () => {
    if (sleeve) model.attach(sleeve);
    if (hand) model.attach(hand);
    model.remove(arm);
    originals.forEach(({ object, material }) => { object.material = material; });
    texture?.dispose(); materials.forEach((m) => m.dispose());
  } };
}