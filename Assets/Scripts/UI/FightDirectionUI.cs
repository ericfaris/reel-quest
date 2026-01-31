using UnityEngine;
using UnityEngine.UI;

public class FightDirectionUI : MonoBehaviour
{
    [Header("Arrow Images")]
    public Image upArrow;
    public Image downArrow;
    public Image leftArrow;
    public Image rightArrow;

    [Header("Colors")]
    public Color inactiveColor = new Color(1f, 1f, 1f, 0.3f);
    public Color activeColor = Color.yellow;
    public Color correctColor = Color.green;

    public TensionSystem tensionSystem;

    void Update()
    {
        bool show = FishingStateManager.CurrentState == FishingState.Fighting;
        SetVisible(show);
        if (!show) return;

        // Reset colors
        SetArrowColor(upArrow, inactiveColor);
        SetArrowColor(downArrow, inactiveColor);
        SetArrowColor(leftArrow, inactiveColor);
        SetArrowColor(rightArrow, inactiveColor);

        // Highlight the counter direction (opposite of fish pull)
        if (tensionSystem != null)
        {
            // Show which direction to press
            // Fish pull dir is in the tension system via the fish
            // We highlight based on WASD input
            if (Input.GetKey(KeyCode.W)) SetArrowColor(upArrow, activeColor);
            if (Input.GetKey(KeyCode.S)) SetArrowColor(downArrow, activeColor);
            if (Input.GetKey(KeyCode.A)) SetArrowColor(leftArrow, activeColor);
            if (Input.GetKey(KeyCode.D)) SetArrowColor(rightArrow, activeColor);

            // Green if in green zone
            if (tensionSystem.InGreenZone)
            {
                if (Input.GetKey(KeyCode.W)) SetArrowColor(upArrow, correctColor);
                if (Input.GetKey(KeyCode.S)) SetArrowColor(downArrow, correctColor);
                if (Input.GetKey(KeyCode.A)) SetArrowColor(leftArrow, correctColor);
                if (Input.GetKey(KeyCode.D)) SetArrowColor(rightArrow, correctColor);
            }
        }
    }

    void SetArrowColor(Image arrow, Color color)
    {
        if (arrow != null) arrow.color = color;
    }

    void SetVisible(bool visible)
    {
        if (upArrow != null) upArrow.gameObject.SetActive(visible);
        if (downArrow != null) downArrow.gameObject.SetActive(visible);
        if (leftArrow != null) leftArrow.gameObject.SetActive(visible);
        if (rightArrow != null) rightArrow.gameObject.SetActive(visible);
    }
}
