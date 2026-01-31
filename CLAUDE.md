# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Monster Bass: Legends of Lake Haven** — A Unity fishing mechanic prototype (C#, Unity 2023 LTS, Built-in RP).

## Architecture

- **State Machine**: `FishingStateManager` (static class) with enum states: Idle → Casting → InAir → WaitingForBite → Fighting → Landing → Idle. Transitions fire C# events.
- **Fight System**: `BasicFishAI` has phases: InitialRun → Jump → HeadShake → Tired → Landable. Player counters fish pulls with WASD. Tension model (0–1) with green zone 0.3–0.7.
- **Physics**: Rigidbody lure with SpringJoint line. Wind via `WindSystem` singleton.
- **No external dependencies**: No DOTween, no Cinemachine. Uses `Mathf.SmoothDamp`, `AnimationCurve`, Perlin noise.

## Key Files

- `Assets/Scripts/Core/` — FishingStateManager (enum + events), WindSystem (singleton)
- `Assets/Scripts/Player/` — PlayerFishingController (input + state transitions), CastingArc (power meter + trajectory)
- `Assets/Scripts/Fishing/` — LurePhysics, FishingLine (LineRenderer), TensionSystem
- `Assets/Scripts/Fish/` — BasicFishAI (patrol + fight FSM), FishData (ScriptableObject), FishSpawner
- `Assets/Scripts/UI/` — PowerMeterUI, TensionMeterUI, FightDirectionUI
- `Assets/Scripts/Feedback/` — CameraShake (Perlin), LineStrainVFX, SplashEffect

## Commands

- Open in Unity 2023 LTS (Built-in Render Pipeline)
- See `Assets/SETUP_INSTRUCTIONS.md` for scene setup
