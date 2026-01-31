using UnityEngine;

public class PlayerFishingController : MonoBehaviour
{
    [Header("References")]
    public Transform rodTip;
    public LurePhysics lure;
    public TensionSystem tensionSystem;
    public CastingArc castingArc;

    [Header("Cast Settings")]
    public float maxCastForce = 30f;
    public float chargeSpeed = 1.5f;

    [Header("Reel Settings")]
    public float reelSpeed = 5f;

    float castPower;
    BasicFishAI hookedFish;

    void OnEnable() => FishingStateManager.OnStateChanged += HandleStateChange;
    void OnDisable() => FishingStateManager.OnStateChanged -= HandleStateChange;

    void Update()
    {
        switch (FishingStateManager.CurrentState)
        {
            case FishingState.Idle:
                UpdateIdle();
                break;
            case FishingState.Casting:
                UpdateCasting();
                break;
            case FishingState.InAir:
                UpdateInAir();
                break;
            case FishingState.WaitingForBite:
                UpdateWaiting();
                break;
            case FishingState.Fighting:
                UpdateFighting();
                break;
            case FishingState.Landing:
                UpdateLanding();
                break;
        }
    }

    void UpdateIdle()
    {
        if (Input.GetMouseButtonDown(0))
        {
            castPower = 0f;
            FishingStateManager.SetState(FishingState.Casting);
        }
    }

    void UpdateCasting()
    {
        castPower = Mathf.Clamp01(castPower + chargeSpeed * Time.deltaTime);
        if (castingArc != null) castingArc.SetPower(castPower);

        if (Input.GetMouseButtonUp(0))
        {
            lure.Cast(rodTip.forward, castPower * maxCastForce);
            FishingStateManager.SetState(FishingState.InAir);
        }
    }

    void UpdateInAir()
    {
        if (lure.HasLanded)
            FishingStateManager.SetState(FishingState.WaitingForBite);
    }

    void UpdateWaiting()
    {
        if (Input.GetMouseButtonDown(1))
        {
            ResetLure();
            return;
        }
    }

    void UpdateFighting()
    {
        if (hookedFish == null)
        {
            FishingStateManager.SetState(FishingState.Idle);
            return;
        }

        Vector2 counterDir = Vector2.zero;
        if (Input.GetKey(KeyCode.W)) counterDir.y += 1f;
        if (Input.GetKey(KeyCode.S)) counterDir.y -= 1f;
        if (Input.GetKey(KeyCode.A)) counterDir.x -= 1f;
        if (Input.GetKey(KeyCode.D)) counterDir.x += 1f;

        bool reeling = Input.GetMouseButton(0);

        if (counterDir.sqrMagnitude > 0.01f)
            counterDir.Normalize();

        hookedFish.ApplyCounterPull(counterDir);
        tensionSystem.UpdateTension(hookedFish, counterDir, reeling, reelSpeed);

        if (tensionSystem.Tension >= 1f)
        {
            hookedFish.Escape();
            hookedFish = null;
            ResetLure();
            return;
        }

        if (tensionSystem.Tension <= 0f)
        {
            hookedFish.Escape();
            hookedFish = null;
            ResetLure();
            return;
        }

        if (hookedFish.IsLandable && reeling)
        {
            float dist = Vector3.Distance(lure.transform.position, rodTip.position);
            if (dist < 3f)
            {
                FishingStateManager.SetState(FishingState.Landing);
            }
        }
    }

    void UpdateLanding()
    {
        if (hookedFish != null)
        {
            Debug.Log($"Caught {hookedFish.Data.fishName} weighing {hookedFish.ActualWeight:F1} lbs!");
            Destroy(hookedFish.gameObject);
            hookedFish = null;
        }
        ResetLure();
    }

    public void OnFishHooked(BasicFishAI fish)
    {
        hookedFish = fish;
        tensionSystem.ResetTension();
        FishingStateManager.SetState(FishingState.Fighting);
    }

    void ResetLure()
    {
        lure.ResetToRod(rodTip);
        FishingStateManager.SetState(FishingState.Idle);
    }

    void HandleStateChange(FishingState from, FishingState to)
    {
        // Hook for additional per-transition logic
    }
}
