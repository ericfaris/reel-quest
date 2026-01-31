# Lake Haven Scene Setup Guide

## Prerequisites
- Unity 2023 LTS (Built-in Render Pipeline, 3D template)

## 1. Create the Scene
1. Open Unity, create scene `Assets/Scenes/LakeHaven.unity`

## 2. Lake / Water Plane
1. GameObject → 3D Object → Plane. Name it **Lake**
2. Scale to (10, 1, 10). Position at (0, 0, 0)
3. Create material `Assets/Materials/Water/LakeWater.mat` — set color to blue-ish translucent

## 3. Wind System
1. Create empty GameObject named **WindSystem**
2. Add `WindSystem.cs` component

## 4. Player + Rod + Lure
1. Create empty **Player** at (0, 1, -15)
2. Child: Create Capsule named **PlayerBody** (visual only)
3. Child: Create empty **FishingRod**
   - Child: Create Cylinder scaled to (0.03, 1.5, 0.03), name it **RodMesh**
   - Rotate rod ~45° on X for casting angle
   - Child: Create empty **RodTip** at the tip of the rod
   - Add a Rigidbody to **RodTip** (set `isKinematic = true`)
4. Create Sphere scaled to (0.15, 0.15, 0.15), name it **Lure**
   - Add `Rigidbody` (mass 0.1)
   - Add `LurePhysics.cs`
   - Add `SphereCollider`
5. Add `PlayerFishingController.cs` to **Player**
   - Assign `Rod Tip` = RodTip transform
   - Assign `Lure` = Lure's LurePhysics
6. Add `TensionSystem.cs` to **Player**, assign in PlayerFishingController
7. Add `CastingArc.cs` to **Player**
   - Add a LineRenderer to the same object for trajectory preview
   - Assign `Rod Tip` and the LineRenderer

## 5. Fishing Line
1. Create empty **FishingLineObj**
2. Add `LineRenderer` component (width 0.02, material: default sprite or unlit)
3. Add `FishingLine.cs` — assign Rod Tip and Lure transforms
4. Add `LineStrainVFX.cs` — assign TensionSystem

## 6. Fish Prefab
1. Create Capsule, scale (0.3, 0.15, 0.5), name **Fish**
2. Add `BasicFishAI.cs`
3. Save as prefab `Assets/Prefabs/Fish.prefab`
4. Delete from scene

## 7. Fish Spawner
1. Create empty **FishSpawner** at (0, 0, 0)
2. Add `FishSpawner.cs`
   - Assign Fish prefab
   - Assign PlayerFishingController
   - Assign Lure transform
3. Create ScriptableObjects via Assets → Create → Fishing → Fish Data:
   - **LargemouthBass**: weight 2–8, stamina 80, pullStrength 4, biteChance 0.4
   - **MythicalShadowBass**: weight 15–50, stamina 200, pullStrength 8, biteChance 0.1, jumpChance 0.7
4. Assign fish data array in FishSpawner

## 8. Camera
1. Select Main Camera, position at (0, 8, -20), rotation (20, 0, 0)
2. Add `CameraShake.cs`
3. Optionally parent camera to Player or add a simple follow script

## 9. UI Canvas (FishingHUD)
1. Create UI → Canvas (Screen Space - Overlay)
2. Add **PowerMeterSlider**: UI → Slider. Anchor bottom-center
   - Add `PowerMeterUI.cs`, assign slider + fill image
3. Add **TensionMeterSlider**: UI → Slider. Anchor top-center
   - Add `TensionMeterUI.cs`, assign slider + fill image + TensionSystem
4. Add 4 UI Images for direction arrows (Up/Down/Left/Right), anchor center
   - Add `FightDirectionUI.cs`, assign arrow images + TensionSystem
5. Save canvas as prefab `Assets/Prefabs/UI/FishingHUD.prefab`

## 10. Splash VFX
1. Create empty **SplashVFX**, add Particle System
   - Shape: Hemisphere, Start Speed 3–5, Start Lifetime 0.5, Gravity 1
   - Emission: Burst mode
2. Add `SplashEffect.cs`, assign LurePhysics + ParticleSystem
3. Disable "Play On Awake" on particle system

## 11. Play Test
1. Enter Play Mode
2. **Hold Mouse1** to charge cast power (bar fills at bottom)
3. **Release Mouse1** to cast lure — trajectory preview disappears, lure flies
4. Wait for fish to bite (watch for patrol fish approaching)
5. Fight: **WASD** to counter fish pull direction, tension meter shows strain
6. Reel with **Mouse1** during fight when tension is in green zone
7. Land the fish when close enough and in Landable phase

## Troubleshooting
- **Lure doesn't fly**: Check RodTip is assigned, Rigidbody on Lure is not kinematic at start (LurePhysics handles this)
- **No fish spawn**: Ensure FishSpawner has fish prefab and FishData assets assigned
- **Line not visible**: Check LineRenderer material is assigned (use Sprites-Default)
- **UI not showing**: Ensure Canvas is Screen Space - Overlay and scripts have references assigned
