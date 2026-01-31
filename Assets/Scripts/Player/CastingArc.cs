using UnityEngine;

public class CastingArc : MonoBehaviour
{
    [Header("References")]
    public Transform rodTip;
    public LineRenderer trajectoryLine;

    [Header("Preview Settings")]
    public int previewPoints = 30;
    public float timeStep = 0.05f;
    public float maxCastForce = 30f;

    float currentPower;

    public void SetPower(float power01)
    {
        currentPower = power01;
        UpdateTrajectory();
    }

    void UpdateTrajectory()
    {
        if (trajectoryLine == null || rodTip == null) return;

        if (FishingStateManager.CurrentState != FishingState.Casting)
        {
            trajectoryLine.positionCount = 0;
            return;
        }

        trajectoryLine.positionCount = previewPoints;
        Vector3 startPos = rodTip.position;
        Vector3 velocity = rodTip.forward * (currentPower * maxCastForce);

        Vector3 wind = WindSystem.Instance != null ? WindSystem.Instance.CurrentWind : Vector3.zero;

        for (int i = 0; i < previewPoints; i++)
        {
            float t = i * timeStep;
            Vector3 pos = startPos + velocity * t + 0.5f * (Physics.gravity + wind) * t * t;
            trajectoryLine.SetPosition(i, pos);

            if (pos.y < 0f)
            {
                trajectoryLine.positionCount = i + 1;
                break;
            }
        }
    }

    void LateUpdate()
    {
        if (FishingStateManager.CurrentState != FishingState.Casting && trajectoryLine != null)
            trajectoryLine.positionCount = 0;
    }
}
