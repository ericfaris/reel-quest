using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class LurePhysics : MonoBehaviour
{
    Rigidbody rb;
    SpringJoint spring;

    [Header("Settings")]
    public float waterLevel = 0f;
    public float waterDrag = 4f;
    public float airDrag = 0.2f;

    public bool HasLanded { get; private set; }
    public bool InWater => transform.position.y <= waterLevel;

    public event System.Action OnWaterImpact;

    void Awake()
    {
        rb = GetComponent<Rigidbody>();
        rb.isKinematic = true;
    }

    public void Cast(Vector3 direction, float force)
    {
        HasLanded = false;
        rb.isKinematic = false;
        rb.linearVelocity = Vector3.zero;
        rb.angularVelocity = Vector3.zero;
        rb.AddForce(direction.normalized * force + Vector3.up * force * 0.4f, ForceMode.Impulse);
    }

    public void ResetToRod(Transform rodTip)
    {
        HasLanded = false;
        rb.isKinematic = true;
        rb.linearVelocity = Vector3.zero;
        rb.angularVelocity = Vector3.zero;
        transform.position = rodTip.position;

        if (spring != null) Destroy(spring);
    }

    public void AttachSpring(Rigidbody rodTipBody, float springForce = 50f, float damper = 5f)
    {
        if (spring != null) Destroy(spring);
        spring = gameObject.AddComponent<SpringJoint>();
        spring.connectedBody = rodTipBody;
        spring.spring = springForce;
        spring.damper = damper;
        spring.minDistance = 0f;
        spring.maxDistance = 0.5f;
    }

    void FixedUpdate()
    {
        if (rb.isKinematic) return;

        // Wind
        if (WindSystem.Instance != null && !InWater)
            rb.AddForce(WindSystem.Instance.CurrentWind * 0.1f, ForceMode.Force);

        // Water entry
        if (InWater && !HasLanded)
        {
            HasLanded = true;
            rb.linearDamping = waterDrag;
            rb.linearVelocity *= 0.2f;
            OnWaterImpact?.Invoke();
        }

        rb.linearDamping = InWater ? waterDrag : airDrag;

        // Keep at water surface when landed
        if (HasLanded && transform.position.y < waterLevel)
        {
            Vector3 pos = transform.position;
            pos.y = waterLevel;
            transform.position = pos;
            Vector3 v = rb.linearVelocity;
            if (v.y < 0) v.y = 0;
            rb.linearVelocity = v;
        }
    }
}
