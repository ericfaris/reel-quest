using UnityEngine;

[CreateAssetMenu(fileName = "NewFish", menuName = "Fishing/Fish Data")]
public class FishData : ScriptableObject
{
    public string fishName = "Bass";
    public float minWeight = 1f;
    public float maxWeight = 10f;
    public float stamina = 100f;
    public float pullStrength = 5f;
    public float biteChance = 0.3f;

    [Header("Fight Behavior")]
    public float initialRunDuration = 3f;
    public float jumpChance = 0.4f;
    public float headShakeSpeed = 8f;

    [Header("Visual")]
    public Color fishColor = Color.green;
    public float sizeMultiplier = 1f;
}
