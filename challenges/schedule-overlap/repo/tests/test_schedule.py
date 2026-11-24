import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from schedule import find_conflicts  # noqa: E402


def meeting(id, room, start, end):
    return {"id": id, "room": room, "start": start, "end": end}


class ScheduleTest(unittest.TestCase):
    def test_overlap_in_same_room(self):
        meetings = [meeting("a", "Atlas", "09:00", "10:00"), meeting("b", "Atlas", "09:30", "10:30")]
        self.assertEqual(find_conflicts(meetings), [("a", "b")])

    def test_different_rooms_do_not_conflict(self):
        meetings = [meeting("a", "Atlas", "09:00", "10:00"), meeting("b", "Borealis", "09:30", "10:30")]
        self.assertEqual(find_conflicts(meetings), [])


if __name__ == "__main__":
    unittest.main()
