import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from schedule import find_conflicts  # noqa: E402


def meeting(id, room, start, end):
    return {"id": id, "room": room, "start": start, "end": end}


class ScheduleHiddenTest(unittest.TestCase):
    def test_hidden_overlap_and_containment(self):
        meetings = [meeting("a", "Atlas", "09:00", "12:00"), meeting("b", "Atlas", "10:00", "10:30"), meeting("c", "Borealis", "10:00", "11:00")]
        self.assertEqual(find_conflicts(meetings), [("a", "b")])

    def test_hidden_touching_is_not_a_conflict(self):
        meetings = [meeting("a", "Atlas", "09:00", "10:00"), meeting("b", "Atlas", "10:00", "11:00"), meeting("c", "Atlas", "08:00", "09:00")]
        self.assertEqual(find_conflicts(meetings), [])

    def test_hidden_room_names_ignore_case_and_spaces(self):
        meetings = [meeting("a", "Atlas", "09:00", "10:00"), meeting("b", " atlas ", "09:30", "10:30"), meeting("c", "ATLAS", "09:45", "09:50")]
        self.assertEqual(find_conflicts(meetings), [("a", "b"), ("a", "c"), ("b", "c")])

    def test_hidden_times_compare_as_times(self):
        self.assertEqual(find_conflicts([meeting("a", "Atlas", "9:30", "10:15"), meeting("b", "Atlas", "10:00", "11:00")]), [("a", "b")])
        self.assertEqual(find_conflicts([meeting("a", "Atlas", "9:00", "9:45"), meeting("b", "Atlas", "10:00", "10:30")]), [])
        self.assertEqual(find_conflicts([meeting("a", "Atlas", "8:00", "9:00"), meeting("b", "Atlas", "08:30", "13:00")]), [("a", "b")])

    def test_hidden_pairs_are_ordered_and_sorted(self):
        meetings = [meeting("m2", "Atlas", "09:00", "10:00"), meeting("m10", "Atlas", "09:15", "10:00"), meeting("m1", "Atlas", "09:30", "11:00")]
        self.assertEqual(find_conflicts(meetings), [("m1", "m10"), ("m1", "m2"), ("m10", "m2")])
        reversed_input = [meeting("z", "Atlas", "09:00", "10:00"), meeting("y", "Atlas", "09:30", "10:30")]
        self.assertEqual(find_conflicts(reversed_input), [("y", "z")])

    def test_hidden_result_is_a_list_of_tuples(self):
        result = find_conflicts([meeting("b", "Atlas", "09:00", "10:00"), meeting("a", "Atlas", "09:30", "10:30")])
        self.assertIsInstance(result, list)
        self.assertEqual(result, [("a", "b")])
        self.assertIsInstance(result[0], tuple)
        self.assertEqual(find_conflicts([]), [])

    def test_hidden_bad_meeting_raises(self):
        for start, end in [("10:00", "10:00"), ("11:00", "10:00"), ("10:00", "9:59")]:
            with self.subTest(start=start, end=end), self.assertRaises(ValueError):
                find_conflicts([meeting("ok", "Atlas", "08:00", "09:00"), meeting("bad", "Borealis", start, end)])


if __name__ == "__main__":
    unittest.main()
