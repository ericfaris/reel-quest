using UnityEngine;

public class WindSystem : MonoBehaviour
{
    public static WindSystem Instance { get; private set; }

    [Header("Wind Settings")]
    public float baseStrength = 2f;
    public float gustStrength = 4f;
    public float gustFrequency = 0.3f;
    public Vector3 baseDirection = new Vector3(1f, 0f, 0.5f);

    public Vector3 CurrentWind { get; private set; }

    void Awake()
    {
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }
        Instance = this;
    }

    void Update()
    {
        float gust = Mathf.PerlinNoise(Time.time * gustFrequency, 0f) * gustStrength;
        float angle = Mathf.PerlinNoise(0f, Time.time * gustFrequency * 0.5f) * 30f - 15f;
        Vector3 dir = Quaternion.Euler(0f, angle, 0f) * baseDirection.normalized;
        CurrentWind = dir * (baseStrength + gust);
    }
}
