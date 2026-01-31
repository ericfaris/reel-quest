using UnityEngine;
using UnityEngine.UI;

public class PowerMeterUI : MonoBehaviour
{
    public Slider powerSlider;
    public Image fillImage;
    public CastingArc castingArc;
    public Gradient powerGradient;

    float displayPower;
    float smoothVel;

    void Awake()
    {
        if (powerGradient == null || powerGradient.colorKeys.Length == 0)
        {
            powerGradient = new Gradient();
            powerGradient.SetKeys(
                new[] {
                    new GradientColorKey(Color.green, 0f),
                    new GradientColorKey(Color.yellow, 0.5f),
                    new GradientColorKey(Color.red, 1f)
                },
                new[] { new GradientAlphaKey(1f, 0f), new GradientAlphaKey(1f, 1f) }
            );
        }
    }

    void Update()
    {
        bool show = FishingStateManager.CurrentState == FishingState.Casting;
        powerSlider.gameObject.SetActive(show);

        if (!show) return;

        float target = castingArc != null ? Mathf.Clamp01(powerSlider.value) : 0f;
        // Read power from input directly
        displayPower = Mathf.SmoothDamp(displayPower, GetCastPower(), ref smoothVel, 0.05f);
        powerSlider.value = displayPower;

        if (fillImage != null)
            fillImage.color = powerGradient.Evaluate(displayPower);
    }

    float GetCastPower()
    {
        // Mirror the charge logic from PlayerFishingController
        if (FishingStateManager.CurrentState == FishingState.Casting)
            return Mathf.Clamp01(powerSlider.value + 1.5f * Time.deltaTime);
        return 0f;
    }
}
