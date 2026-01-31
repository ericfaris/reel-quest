using UnityEngine;

public class BasicFishAI : MonoBehaviour
{
    public enum FightPhase { Patrol, InitialRun, Jump, HeadShake, Tired, Landable }

    [Header("Data")]
    public FishData Data;

    [Header("Patrol")]
    public float patrolRadius = 8f;
    public float patrolSpeed = 2f;
    public float biteRange = 2f;

    public FightPhase Phase { get; private set; } = FightPhase.Patrol;
    public Vector2 CurrentPullDirection { get; private set; }
    public bool IsLandable => Phase == FightPhase.Landable;
    public float ActualWeight { get; private set; }

    float stamina;
    float phaseTimer;
    Vector3 patrolTarget;
    Transform lureTarget;
    PlayerFishingController playerController;

    void Start()
    {
        if (Data != null)
        {
            stamina = Data.stamina;
            ActualWeight = Random.Range(Data.minWeight, Data.maxWeight);
        }
        PickPatrolTarget();
    }

    public void Initialize(FishData data, PlayerFishingController controller, Transform lure)
    {
        Data = data;
        playerController = controller;
        lureTarget = lure;
        stamina = data.stamina;
        ActualWeight = Random.Range(data.minWeight, data.maxWeight);
    }

    void Update()
    {
        switch (Phase)
        {
            case FightPhase.Patrol:
                UpdatePatrol();
                break;
            case FightPhase.InitialRun:
            case FightPhase.Jump:
            case FightPhase.HeadShake:
            case FightPhase.Tired:
            case FightPhase.Landable:
                UpdateFight();
                break;
        }
    }

    void UpdatePatrol()
    {
        if (lureTarget == null) return;

        // Move toward patrol point
        Vector3 dir = (patrolTarget - transform.position).normalized;
        transform.position += dir * patrolSpeed * Time.deltaTime;
        transform.forward = Vector3.Lerp(transform.forward, dir, Time.deltaTime * 3f);

        if (Vector3.Distance(transform.position, patrolTarget) < 1f)
            PickPatrolTarget();

        // Check for lure bite
        if (FishingStateManager.CurrentState == FishingState.WaitingForBite)
        {
            float distToLure = Vector3.Distance(transform.position, lureTarget.position);
            if (distToLure < biteRange && Random.value < Data.biteChance * Time.deltaTime)
            {
                Bite();
            }
        }
    }

    void Bite()
    {
        Phase = FightPhase.InitialRun;
        phaseTimer = Data.initialRunDuration;
        PickPullDirection();

        if (playerController != null)
            playerController.OnFishHooked(this);
    }

    void UpdateFight()
    {
        phaseTimer -= Time.deltaTime;

        // Apply pull movement
        Vector3 pullWorld = new Vector3(CurrentPullDirection.x, 0f, CurrentPullDirection.y);
        transform.position += pullWorld * Data.pullStrength * 0.5f * Time.deltaTime;

        if (phaseTimer <= 0f)
            AdvancePhase();
    }

    void AdvancePhase()
    {
        switch (Phase)
        {
            case FightPhase.InitialRun:
                Phase = Random.value < Data.jumpChance ? FightPhase.Jump : FightPhase.HeadShake;
                phaseTimer = Random.Range(1.5f, 3f);
                break;
            case FightPhase.Jump:
                Phase = FightPhase.HeadShake;
                phaseTimer = Random.Range(2f, 4f);
                break;
            case FightPhase.HeadShake:
                Phase = stamina > Data.stamina * 0.3f ? FightPhase.InitialRun : FightPhase.Tired;
                phaseTimer = Random.Range(2f, 4f);
                break;
            case FightPhase.Tired:
                Phase = FightPhase.Landable;
                phaseTimer = 999f;
                break;
        }
        PickPullDirection();
    }

    void PickPullDirection()
    {
        switch (Phase)
        {
            case FightPhase.InitialRun:
                CurrentPullDirection = Random.insideUnitCircle.normalized;
                break;
            case FightPhase.Jump:
                CurrentPullDirection = Vector2.up;
                break;
            case FightPhase.HeadShake:
                CurrentPullDirection = new Vector2(Mathf.Sin(Time.time * Data.headShakeSpeed), 0f);
                break;
            case FightPhase.Tired:
            case FightPhase.Landable:
                CurrentPullDirection = Random.insideUnitCircle * 0.2f;
                break;
        }
    }

    public void ApplyCounterPull(Vector2 counterDir)
    {
        if (Phase == FightPhase.HeadShake)
        {
            // Update head shake direction in real time
            CurrentPullDirection = new Vector2(Mathf.Sin(Time.time * Data.headShakeSpeed), 0f);
        }
    }

    public void DrainStamina(float amount)
    {
        stamina -= amount;
        if (stamina <= 0f && Phase != FightPhase.Landable)
        {
            Phase = FightPhase.Tired;
            phaseTimer = 1f;
            CurrentPullDirection = Vector2.zero;
        }
    }

    public void Escape()
    {
        Phase = FightPhase.Patrol;
        PickPatrolTarget();
    }

    void PickPatrolTarget()
    {
        Vector3 center = transform.position;
        Vector2 rnd = Random.insideUnitCircle * patrolRadius;
        patrolTarget = center + new Vector3(rnd.x, 0f, rnd.y);
        patrolTarget.y = 0f;
    }
}
