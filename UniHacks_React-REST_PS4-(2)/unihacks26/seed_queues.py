from rnr.models import Institution, Queue

def seed_queues():
    institutions = Institution.objects.all()
    created_count = 0
    for inst in institutions:
        if not inst.queues.exists():
            Queue.objects.create(
                institution=inst,
                name="General Service",
                size=100,
                service_time_minutes=5,
                allow_swaps=True
            )
            created_count += 1
            print(f"Created 'General Service' queue for {inst.name}")
    print(f"Seeding complete. Created {created_count} queues.")

if __name__ == "__main__":
    seed_queues()
