using UnityEngine;

public class TensionSystem : MonoBehaviour
{
    [Header("Tension Settings")]
    public float tensionRiseSpeed = 0.3f;
    public float tensionDropSpeed = 0.2f;
    public float reelTensionMultiplier = 1.5f;
    public float counterPullDrainRate = 15f;

    [Header("Green Zone")]
    public float greenZoneMin = 0.3f;
    public float greenZoneMax = 0.7f;

    public float Tension { get; private set; } = 0.5f;

    public bool InGreenZone => Tension >= greenZoneMin && Tension <= greenZoneMax;

    public void ResetTension()
    {
        Tension = 0.5f;
    }

    public void UpdateTension(BasicFishAI fish, Vector2 counterDir, bool reeling, float reelSpeed)
    {
        if (fish == null) return;

        Vector2 fishPull = fish.CurrentPullDirection;
        float dot = Vector2.Dot(counterDir.normalized, -fishPull.normalized);

        // Good counter-pull: tension moves toward green zone, fish stamina drains
        if (dot > 0.5f && counterDir.sqrMagnitude > 0.01f)
        {
            Tension -= tensionDropSpeed * dot * Time.deltaTime;
            fish.DrainStamina(counterPullDrainRate * dot * Time.deltaTime);
        }
        else
        {
            // Fish pulling with no or wrong counter
            Tension += tensionRiseSpeed * fish.Data.pullStrength * 0.1f * Time.deltaTime;
        }

        // Reeling increases tension when fish is pulling hard
        if (reeling)
        {
            float fishForce = fishPull.magnitude * fish.Data.pullStrength;
            Tension += fishForce * reelTensionMultiplier * 0.01f * Time.deltaTime;

            // But also reels fish in
            if (fish.IsLandable)
            {
                Vector3 toRod = (transform.position - fish.transform.position).normalized;
                fish.transform.position += toRod * reelSpeed * Time.deltaTime;
            }
        }

        // Slack when nothing happening
        if (counterDir.sqrMagnitude < 0.01f && fishPull.sqrMagnitude < 0.01f)
        {
            Tension -= tensionDropSpeed * 0.5f * Time.deltaTime;
        }

        Tension = Mathf.Clamp(Tension, -0.05f, 1.05f);
    }
}
