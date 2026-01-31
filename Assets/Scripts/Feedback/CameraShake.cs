using UnityEngine;

public class CameraShake : MonoBehaviour
{
    public static CameraShake Instance { get; private set; }

    [Header("Shake Settings")]
    public float traumaDecay = 1.3f;
    public float maxAngle = 5f;
    public float maxOffset = 0.3f;
    public float frequency = 25f;

    float trauma;
    Vector3 originalPos;

    void Awake()
    {
        Instance = this;
        originalPos = transform.localPosition;
    }

    void OnEnable()
    {
        FishingStateManager.OnStateChanged += OnStateChanged;
    }

    void OnDisable()
    {
        FishingStateManager.OnStateChanged -= OnStateChanged;
    }

    void OnStateChanged(FishingState from, FishingState to)
    {
        if (to == FishingState.Fighting)
            AddTrauma(0.6f);
    }

    public void AddTrauma(float amount)
    {
        trauma = Mathf.Clamp01(trauma + amount);
    }

    void LateUpdate()
    {
        if (trauma <= 0f)
        {
            transform.localPosition = originalPos;
            return;
        }

        float shake = trauma * trauma; // Quadratic falloff
        float seed = Time.time * frequency;

        float offsetX = maxOffset * shake * (Mathf.PerlinNoise(seed, 0f) * 2f - 1f);
        float offsetY = maxOffset * shake * (Mathf.PerlinNoise(0f, seed) * 2f - 1f);
        float angle = maxAngle * shake * (Mathf.PerlinNoise(seed, seed) * 2f - 1f);

        transform.localPosition = originalPos + new Vector3(offsetX, offsetY, 0f);
        transform.localRotation = Quaternion.Euler(0f, 0f, angle);

        trauma = Mathf.Max(0f, trauma - traumaDecay * Time.deltaTime);
    }
}
