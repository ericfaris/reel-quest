using UnityEngine;
using UnityEngine.UI;

public class TensionMeterUI : MonoBehaviour
{
    public Slider tensionSlider;
    public Image fillImage;
    public TensionSystem tensionSystem;

    [Header("Colors")]
    public Color lowColor = Color.blue;
    public Color greenColor = Color.green;
    public Color highColor = Color.red;

    float smoothVel;
    float displayTension;

    void Update()
    {
        bool show = FishingStateManager.CurrentState == FishingState.Fighting;
        tensionSlider.gameObject.SetActive(show);
        if (!show) return;

        if (tensionSystem == null) return;

        displayTension = Mathf.SmoothDamp(displayTension, tensionSystem.Tension, ref smoothVel, 0.1f);
        tensionSlider.value = displayTension;

        if (fillImage != null)
        {
            if (displayTension < tensionSystem.greenZoneMin)
                fillImage.color = Color.Lerp(lowColor, greenColor, displayTension / tensionSystem.greenZoneMin);
            else if (displayTension > tensionSystem.greenZoneMax)
                fillImage.color = Color.Lerp(greenColor, highColor, (displayTension - tensionSystem.greenZoneMax) / (1f - tensionSystem.greenZoneMax));
            else
                fillImage.color = greenColor;
        }
    }
}
