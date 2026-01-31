using UnityEngine;

public class FishSpawner : MonoBehaviour
{
    [Header("Spawn Settings")]
    public FishData[] fishTypes;
    public GameObject fishPrefab;
    public PlayerFishingController playerController;
    public Transform lureTransform;
    public int maxFish = 5;
    public float spawnRadius = 20f;
    public float spawnInterval = 5f;
    public float waterLevel = 0f;

    [Header("Hint VFX")]
    public GameObject bubblePrefab;
    public float bubbleChance = 0.3f;

    float spawnTimer;
    int currentFishCount;

    void Update()
    {
        spawnTimer -= Time.deltaTime;
        if (spawnTimer <= 0f && currentFishCount < maxFish)
        {
            SpawnFish();
            spawnTimer = spawnInterval;
        }
    }

    void SpawnFish()
    {
        if (fishTypes == null || fishTypes.Length == 0 || fishPrefab == null) return;

        Vector2 rnd = Random.insideUnitCircle * spawnRadius;
        Vector3 pos = transform.position + new Vector3(rnd.x, waterLevel, rnd.y);

        FishData data = fishTypes[Random.Range(0, fishTypes.Length)];
        GameObject fish = Instantiate(fishPrefab, pos, Quaternion.identity);
        BasicFishAI ai = fish.GetComponent<BasicFishAI>();
        if (ai != null)
            ai.Initialize(data, playerController, lureTransform);

        fish.transform.localScale *= data.sizeMultiplier;
        currentFishCount++;

        // Bubble hint
        if (bubblePrefab != null && Random.value < bubbleChance)
        {
            GameObject bubbles = Instantiate(bubblePrefab, pos + Vector3.up * 0.1f, Quaternion.identity);
            Destroy(bubbles, 3f);
        }
    }
}
