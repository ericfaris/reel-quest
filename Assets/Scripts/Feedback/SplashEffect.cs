using UnityEngine;

public class SplashEffect : MonoBehaviour
{
    public LurePhysics lure;
    public ParticleSystem splashParticles;

    [Header("Settings")]
    public float minEmission = 10;
    public float maxEmission = 50;

    void OnEnable()
    {
        if (lure != null)
            lure.OnWaterImpact += PlaySplash;
    }

    void OnDisable()
    {
        if (lure != null)
            lure.OnWaterImpact -= PlaySplash;
    }

    void PlaySplash()
    {
        if (splashParticles == null || lure == null) return;

        splashParticles.transform.position = lure.transform.position;

        var emission = splashParticles.emission;
        var burst = new ParticleSystem.Burst(0f, (short)minEmission, (short)maxEmission);
        emission.SetBurst(0, burst);

        splashParticles.Play();

        if (CameraShake.Instance != null)
            CameraShake.Instance.AddTrauma(0.3f);
    }
}
