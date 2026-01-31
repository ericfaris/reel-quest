using UnityEngine;

[RequireComponent(typeof(LineRenderer))]
public class FishingLine : MonoBehaviour
{
    [Header("References")]
    public Transform rodTip;
    public Transform lureTransform;

    [Header("Line Settings")]
    public int segmentCount = 20;
    public float sagAmount = 1f;
    public float sagResponse = 4f;

    LineRenderer line;
    float currentSag;

    void Awake()
    {
        line = GetComponent<LineRenderer>();
        line.positionCount = segmentCount;
    }

    void LateUpdate()
    {
        if (rodTip == null || lureTransform == null) return;

        if (FishingStateManager.CurrentState == FishingState.Idle ||
            FishingStateManager.CurrentState == FishingState.Casting)
        {
            line.positionCount = 0;
            return;
        }

        line.positionCount = segmentCount;
        Vector3 start = rodTip.position;
        Vector3 end = lureTransform.position;
        float dist = Vector3.Distance(start, end);
        float targetSag = sagAmount * (dist * 0.1f);
        currentSag = Mathf.Lerp(currentSag, targetSag, Time.deltaTime * sagResponse);

        for (int i = 0; i < segmentCount; i++)
        {
            float t = i / (float)(segmentCount - 1);
            Vector3 point = Vector3.Lerp(start, end, t);
            // Quadratic bezier sag
            float sagOffset = currentSag * 4f * t * (1f - t);
            point.y -= sagOffset;
            line.SetPosition(i, point);
        }
    }
}
