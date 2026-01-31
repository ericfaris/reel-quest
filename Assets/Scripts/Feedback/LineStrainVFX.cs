using UnityEngine;

[RequireComponent(typeof(LineRenderer))]
public class LineStrainVFX : MonoBehaviour
{
    public TensionSystem tensionSystem;

    [Header("Strain Visuals")]
    public Color relaxedColor = Color.white;
    public Color strainedColor = Color.red;
    public float relaxedWidth = 0.02f;
    public float strainedWidth = 0.05f;

    LineRenderer line;

    void Awake()
    {
        line = GetComponent<LineRenderer>();
    }

    void Update()
    {
        if (tensionSystem == null) return;

        float t = tensionSystem.Tension;
        Color c = Color.Lerp(relaxedColor, strainedColor, t);
        line.startColor = c;
        line.endColor = c;

        float w = Mathf.Lerp(relaxedWidth, strainedWidth, t);
        line.startWidth = w;
        line.endWidth = w;
    }
}
