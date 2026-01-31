using System;
using UnityEngine;

public enum FishingState
{
    Idle,
    Casting,
    InAir,
    WaitingForBite,
    Fighting,
    Landing
}

public static class FishingStateManager
{
    public static FishingState CurrentState { get; private set; } = FishingState.Idle;

    public static event Action<FishingState, FishingState> OnStateChanged;

    public static void SetState(FishingState newState)
    {
        if (newState == CurrentState) return;
        var old = CurrentState;
        CurrentState = newState;
        OnStateChanged?.Invoke(old, newState);
    }
}
