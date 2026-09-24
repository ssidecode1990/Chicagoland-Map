// School quality data for Chicagoland suburbs
// Sources: US News & World Report Best High Schools 2026-2027, Illinois Report Card (ISBE),
//          Indiana DOE A-F accountability grades (last issued 2018), Niche.com district grades
//
// Fields:
//   hs           — primary high school name (or array if town is split across schools)
//   district     — high school district name/number (IL entries)
//   feedsTo      — high school district when town has only K-8 feeder district
//   usNewsNational — US News national rank (null if unranked)
//   usNewsState  — US News state rank (null if unranked)
//   stateGrade   — IL: "Exemplary" | "Commendable" | "Underperforming" | "Lowest Performance"
//                  IN: "A" (last issued 2018) | null (grades suspended 2019–2025)
//   niche        — Niche.com district grade (letter grade string)
//   note         — 1–2 sentence narrative with at least one data point
//   splitDistrict— true if town boundary crosses two different HS districts
//
// Indiana DOE note: A-F grading was suspended after 2018 and reauthorized March 2026.
// stateGrade values for IN reflect the last-published 2018 grades only.


// Per-school US News rank lookup for the ~40 individual high schools that appear inside
// multi-school town entries above (hs: [...]) -- used to average the rank component of
// composite_score across a town high schools instead of relying on a single
// representative school rank. natl/state are null where that specific school has neither.
// Per-school US News rank lookup for every individual high school referenced anywhere in
// SCHOOL_DATA (hs: 'X' or hs: [...]) -- the single source of truth for US News national/state
// rank AND (where researched) government-sourced (ISBE) SAT/ACT, so a school's data only needs
// updating in one place regardless of how many towns reference it. natl/state reflect the U.S.
// News 2026-2027 Best High Schools edition (released Aug 18, 2026; 17,945 nationally ranked
// schools, up from ~17,901 the prior cycle) -- replaces the previous 2025-26 figures.
// natlBand/stateBand: some schools in the bottom tier aren't given a precise rank by U.S. News,
// only a shared range (e.g. '13,460-17,945') -- natl/state above store the range's midpoint so
// composite_score math still works, but natlBand/stateBand carry the true range for display so
// the UI doesn't claim false precision.
// rankIsProxy: set when a town's hs name (e.g. 'Rich Township High School', used generically by
// Matteson/Park Forest/Richton Park) doesn't correspond to a single ranked school in this edition
// -- the note names which actual ranked campus the number is borrowed from.
// Per-school US News rank lookup for every individual high school referenced anywhere in
// SCHOOL_DATA (hs: 'X' or hs: [...]) -- the single source of truth for US News national/state
// rank AND (where researched) government-sourced (ISBE) SAT/ACT, so a school's data only needs
// updating in one place regardless of how many towns reference it. natl/state reflect the U.S.
// News 2026-2027 Best High Schools edition (released Aug 18, 2026; 17,945 nationally ranked
// schools, up from ~17,901 the prior cycle) -- replaces the previous 2025-26 figures.
// natlBand/stateBand: some schools in the bottom tier aren't given a precise rank by U.S. News,
// only a shared range (e.g. '13,460-17,945') -- natl/state above store the range's midpoint so
// composite_score math still works, but natlBand/stateBand carry the true range for display so
// the UI doesn't claim false precision.
// rankIsProxy: set when a town's hs name (e.g. 'Rich Township High School', used generically by
// Matteson/Park Forest/Richton Park) doesn't correspond to a single ranked school in this edition
// -- the note names which actual ranked campus the number is borrowed from.
// sat/act: government/district-verified test scores ONLY -- act is null for every Illinois school
// because ISBE has confirmed (as of the 2025 Report Card) that it no longer calculates or publishes
// an ACT composite for any school, district-wide or state-wide (federal law doesn't require it) --
// this is a confirmed policy, not a research gap, so don't fill it in from subject-score averages.
// sat is null for Indiana schools because IDOE's mandatory-administration data publishes only
// benchmark-achievement percentages, not a points-based composite comparable to Illinois' figure --
// converting one to the other would fabricate precision that isn't in the source data.
// 140 of 164 schools (all Illinois) have verified 2024 ISBE SAT data as of 2026-08-22.
const MULTI_SCHOOL_RANKS = {
  "Addison Trail High School": {
    "natl": 4249,
    "state": 167,
    "sat": 912, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Adlai E. Stevenson High School": {
    "natl": 208,
    "state": 8,
    "sat": 1207, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Alan B. Shepard High School": {
    "natl": 3170,
    "state": 128,
    "sat": 918, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Amos Alonzo Stagg High School": {
    "natl": 2631,
    "state": 109,
    "sat": 975, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Antioch Community High School": {
    "natl": 3286,
    "state": 131,
    "sat": 988, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Argo Community High School": {
    "natl": 4676,
    "state": 183,
    "sat": 886, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Barrington High School": {
    "natl": 427,
    "state": 19,
    "sat": 1096, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Bartlett High School": {
    "natl": 2078,
    "state": 85,
    "sat": 944, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Batavia Senior High School": {
    "natl": 1983,
    "state": 83,
    "sat": 1074, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Beecher High School": {
    "natl": 10099,
    "state": 347,
    "sat": 912, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Bloom High School": {
    "natl": 7312,
    "state": 266,
    "sat": 820, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Bloom Trail High School": {
    "natl": 9092,
    "state": 314,
    "sat": 795, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Bolingbrook High School": {
    "natl": 2629,
    "state": 108,
    "sat": 922, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Bremen High School": {
    "natl": 11512,
    "state": 392,
    "sat": 852, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Buffalo Grove High School": {
    "natl": 1337,
    "state": 62,
    "sat": 1011, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Carl Sandburg High School": {
    "natl": 1735,
    "state": 75,
    "sat": 1006, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Cary-Grove Community High School": {
    "natl": 1532,
    "state": 70,
    "sat": 1038, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Central High School": {
    "natl": 2743,
    "state": 112,
    "sat": 989, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Chesterton Senior High School": {
    "natl": 2081,
    "state": 40
  },
  "Crete-Monee High School": {
    "natl": 5214,
    "state": 205,
    "sat": 834, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Crown Point High School": {
    "natl": 1849,
    "state": 37
  },
  "Crystal Lake Central High School": {
    "natl": 3407,
    "state": 136,
    "sat": 984, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Crystal Lake South High School": {
    "natl": 2894,
    "state": 119,
    "sat": 994, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Deerfield High School": {
    "natl": 387,
    "state": 17,
    "sat": 1183, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Downers Grove North High School": {
    "natl": 1245,
    "state": 60,
    "sat": 1096, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Downers Grove South High School": {
    "natl": 2938,
    "state": 121,
    "sat": 1011, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Dundee-Crown High School": {
    "natl": 5708,
    "state": 224,
    "sat": 872, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Dwight D. Eisenhower High School": {
    "natl": 5876,
    "state": 232,
    "sat": 847, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "East Chicago Central High School": {
    "natl": 11410,
    "state": 281
  },
  "East Leyden High School": {
    "natl": 3869,
    "state": 152,
    "sat": 932, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Elgin High School": {
    "natl": 5564,
    "state": 216,
    "sat": 845, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Elk Grove High School": {
    "natl": 2974,
    "state": 122,
    "sat": 945, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Elmwood Park High School": {
    "natl": 4923,
    "state": 193,
    "sat": 932, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Evanston Township High School": {
    "natl": 660,
    "state": 31,
    "sat": 1064, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Evergreen Park High School": {
    "natl": 4295,
    "state": 170,
    "sat": 955, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Fenton High School": {
    "natl": 4151,
    "state": 163,
    "sat": 895, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Geneva Community High School": {
    "natl": 1099,
    "state": 53,
    "sat": 1085, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Glenbard East High School": {
    "natl": 2446,
    "state": 100,
    "sat": 960, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Glenbard North High School": {
    "natl": 1818,
    "state": 78,
    "sat": 987, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Glenbard South High School": {
    "natl": 943,
    "state": 44,
    "sat": 1047, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Glenbard West High School": {
    "natl": 698,
    "state": 34,
    "sat": 1048, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Glenbrook North High School": {
    "natl": 378,
    "state": 15,
    "sat": 1178, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Glenbrook South High School": {
    "natl": 523,
    "state": 23,
    "sat": 1114, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Grant Community High School": {
    "natl": 3661,
    "state": 142,
    "sat": 923, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Grayslake Central High School": {
    "natl": 2456,
    "state": 101,
    "sat": 1005, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Grayslake North High School": {
    "natl": 2098,
    "state": 88,
    "sat": 1013, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Griffith Senior High School": {
    "natl": 6495,
    "state": 175
  },
  "Hammond Central High School": {
    "natl": 15702,
    "state": 362,
    "natlBand": "13,460–17,945",
    "stateBand": "321–404"
  },
  "Hampshire High School": {
    "natl": 2859,
    "state": 117,
    "sat": 975, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hanover Central High School": {
    "natl": 3270,
    "state": 75
  },
  "Harold L. Richards High School": {
    "natl": 3366,
    "state": 133,
    "sat": 912, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Harry D. Jacobs High School": {
    "natl": 2504,
    "state": 104,
    "sat": 967, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Harvard High School": {
    "natl": 15702,
    "state": 572,
    "natlBand": "13,460–17,945",
    "stateBand": "469–675",
    "sat": 840, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hebron High School": {
    "natl": 6202,
    "state": 166
  },
  "Highland High School": {
    "natl": 4314,
    "state": 107
  },
  "Highland Park High School": {
    "natl": 756,
    "state": 38,
    "sat": 1072, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hillcrest High School": {
    "natl": 15702,
    "state": 572,
    "natlBand": "13,460–17,945",
    "stateBand": "469–675",
    "sat": 798, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hinsdale Central High School": {
    "natl": 231,
    "state": 9,
    "sat": 1195, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hinsdale South High School": {
    "natl": 1450,
    "state": 66,
    "sat": 1054, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hobart High School": {
    "natl": 9839,
    "state": 246
  },
  "Hoffman Estates High School": {
    "natl": 1406,
    "state": 64,
    "sat": 996, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Homewood-Flossmoor High School": {
    "natl": 8039,
    "state": 288,
    "sat": 935, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Huntley High School": {
    "natl": 2082,
    "state": 86,
    "sat": 1026, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "J. Sterling Morton East High School": {
    "natl": 5624,
    "state": 222,
    "sat": 825, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "J. Sterling Morton West High School": {
    "natl": 5866,
    "state": 230,
    "sat": 854, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "John Hersey High School": {
    "natl": 498,
    "state": 22,
    "sat": 1113, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Johnsburg High School": {
    "natl": 4587,
    "state": 181,
    "sat": 946, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Joliet Central High School": {
    "natl": 9424,
    "state": 320,
    "sat": 832, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Joliet West High School": {
    "natl": 5586,
    "state": 219,
    "sat": 908, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Kaneland Senior High School": {
    "natl": 3803,
    "state": 146,
    "sat": 984, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Kouts Middle/High School": {
    "natl": 1847,
    "state": 36
  },
  "LaPorte High School": {
    "natl": 4214,
    "state": 105
  },
  "Lake Central High School": {
    "natl": 1592,
    "state": 31
  },
  "Lake Forest High School": {
    "natl": 277,
    "state": 11,
    "sat": 1165, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lake Park High School": {
    "natl": 1631,
    "state": 73,
    "sat": 1016, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lake Zurich High School": {
    "natl": 643,
    "state": 29,
    "sat": 1115, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lemont High School": {
    "natl": 872,
    "state": 40,
    "sat": 1080, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Libertyville High School": {
    "natl": 462,
    "state": 20,
    "sat": 1134, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lincoln-Way Central High School": {
    "natl": 1131,
    "state": 55,
    "sat": 1084, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lincoln-Way East High School": {
    "natl": 1037,
    "state": 50,
    "sat": 1109, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lincoln-Way West High School": {
    "natl": 2060,
    "state": 84,
    "sat": 1041, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lisle High School": {
    "natl": 1316,
    "state": 61,
    "sat": 1062, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lockport Township High School East": {
    "natl": 2928,
    "state": 120,
    "sat": 1004, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lowell Senior High School": {
    "natl": 2834,
    "state": 61
  },
  "Lyons Township High School": {
    "natl": 965,
    "state": 47,
    "sat": 1079, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Maine East High School": {
    "natl": 2477,
    "state": 103,
    "sat": 969, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Maine South High School": {
    "natl": 673,
    "state": 32,
    "sat": 1084, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Maine West High School": {
    "natl": 4652,
    "state": 182,
    "sat": 943, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Marengo High School": {
    "natl": 6357,
    "state": 240,
    "sat": 954, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "McHenry Community High School": {
    "natl": 4883,
    "state": 189,
    "sat": 924, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Merrillville High School": {
    "natl": 7535,
    "state": 202
  },
  "Michigan City High School": {
    "natl": 10207,
    "state": 253
  },
  "Minooka Community High School": {
    "natl": 6319,
    "state": 239,
    "sat": 966, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Mundelein Consolidated High School": {
    "natl": 2370,
    "state": 98,
    "sat": 980, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Munster High School": {
    "natl": 448,
    "state": 10
  },
  "Naperville Central High School": {
    "natl": 618,
    "state": 27,
    "sat": 1130, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Naperville North High School": {
    "natl": 730,
    "state": 35,
    "sat": 1127, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "New Trier Township High School": {
    "natl": 324,
    "state": 13,
    "sat": 1199, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Niles North High School": {
    "natl": 1242,
    "state": 59,
    "sat": 1042, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Niles West High School": {
    "natl": 1748,
    "state": 77,
    "sat": 1027, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "North Chicago Community High School": {
    "natl": 12868,
    "state": 443,
    "sat": 783, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Oak Forest High School": {
    "natl": 5161,
    "state": 202,
    "sat": 940, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Oak Lawn Community High School": {
    "natl": 3333,
    "state": 132,
    "sat": 925, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Oak Park and River Forest High School": {
    "natl": 540,
    "state": 24,
    "sat": 1132, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Oswego East High School": {
    "natl": 2091,
    "state": 87,
    "sat": 1002, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Oswego High School": {
    "natl": 5510,
    "state": 213,
    "sat": 934, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Palatine High School": {
    "natl": 1834,
    "state": 79,
    "sat": 954, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Peotone High School": {
    "natl": 8372,
    "state": 295,
    "sat": 937, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Plainfield East High School": {
    "natl": 2779,
    "state": 113,
    "sat": 997, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Plainfield High School": {
    "natl": 5474,
    "state": 211,
    "sat": 958, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Plainfield North High School": {
    "natl": 2252,
    "state": 93,
    "sat": 1045, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Plainfield South High School": {
    "natl": 3400,
    "state": 135,
    "sat": 966, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Plano High School": {
    "natl": 6618,
    "state": 249,
    "sat": 908, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Portage High School": {
    "natl": 9898,
    "state": 248
  },
  "Prairie Ridge High School": {
    "natl": 1870,
    "state": 82,
    "sat": 1036, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Prospect High School": {
    "natl": 646,
    "state": 30,
    "sat": 1099, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Proviso East High School": {
    "natl": 15702,
    "state": 572,
    "natlBand": "13,460–17,945",
    "stateBand": "469–675",
    "sat": 815, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Proviso West High School": {
    "natl": 15702,
    "state": 572,
    "natlBand": "13,460–17,945",
    "stateBand": "469–675",
    "sat": 799, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Reavis High School": {
    "natl": 4258,
    "state": 168,
    "sat": 913, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Reed-Custer High School": {
    "natl": 8816,
    "state": 305,
    "sat": 924, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Rich Township High School": {
    "natl": 12795,
    "state": 438,
    "rankIsProxy": "Rich Central Campus (only ranked HSD 227 campus in 2026-27 edition; Rich East/Rich South not separately ranked)",
    "sat": 793, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Ridgewood Community High School": {
    "natl": 5835,
    "state": 229,
    "sat": 940, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "River Forest Jr.-Sr. High School": {
    "natl": 11302,
    "state": 277
  },
  "Riverside Brookfield Township High School": {
    "natl": 1235,
    "state": 58,
    "sat": 1019, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Rolling Meadows High School": {
    "natl": 2173,
    "state": 91,
    "sat": 998, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Romeoville High School": {
    "natl": 2510,
    "state": 105,
    "sat": 935, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Round Lake Senior High School": {
    "natl": 8821,
    "state": 306,
    "sat": 855, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Schaumburg High School": {
    "natl": 938,
    "state": 43,
    "sat": 1068, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "South Elgin High School": {
    "natl": 3884,
    "state": 153,
    "sat": 930, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "St. Charles East High School": {
    "natl": 1557,
    "state": 71,
    "sat": 1048, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "St. Charles North High School": {
    "natl": 1055,
    "state": 51,
    "sat": 1097, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Streamwood High School": {
    "natl": 6593,
    "state": 247,
    "sat": 874, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Streator Township High School": {
    "natl": 10408,
    "state": 365,
    "sat": 866, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Thomas A. Edison Jr.-Sr. High School": {
    "natl": 15702,
    "state": 362,
    "natlBand": "13,460–17,945",
    "stateBand": "321–404"
  },
  "Thornridge High School": {
    "natl": 15702,
    "state": 572,
    "natlBand": "13,460–17,945",
    "stateBand": "469–675",
    "sat": 789, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Thornton Fractional North High School": {
    "natl": 8465,
    "state": 298,
    "sat": 842, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Thornton Fractional South High School": {
    "natl": 5910,
    "state": 233,
    "sat": 867, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Thornton Township High School": {
    "natl": 10164,
    "state": 352,
    "sat": 801, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Thornwood High School": {
    "natl": 12623,
    "state": 431,
    "sat": 822, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Tinley Park High School": {
    "natl": 6396,
    "state": 241,
    "sat": 922, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Tri-Township Jr.-Sr. High School": {
    "natl": 15702,
    "state": 362,
    "natlBand": "13,460–17,945",
    "stateBand": "321–404"
  },
  "Valparaiso High School": {
    "natl": 1058,
    "state": 19
  },
  "Vernon Hills High School": {
    "natl": 343,
    "state": 14,
    "sat": 1134, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Victor J. Andrew High School": {
    "natl": 2566,
    "state": 106,
    "sat": 1000, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Warren Township High School": {
    "natl": 3122,
    "state": 125,
    "sat": 965, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Wauconda High School": {
    "natl": 4005,
    "state": 157,
    "sat": 950, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Waukegan High School": {
    "natl": 13344,
    "state": 465,
    "sat": 788, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "West Aurora High School": {
    "natl": 5580,
    "state": 218,
    "sat": 894, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "West Chicago Community High School": {
    "natl": 5736,
    "state": 225,
    "sat": 915, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "West Leyden High School": {
    "natl": 6560,
    "state": 246,
    "sat": 891, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "West Side Leadership Academy": {
    "natl": 15702,
    "state": 362,
    "natlBand": "13,460–17,945",
    "stateBand": "321–404"
  },
  "Westmont High School": {
    "natl": 604,
    "state": 26,
    "sat": 1057, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Westville High School": {
    "natl": 2929,
    "state": 63
  },
  "Wheaton Warrenville South High School": {
    "natl": 1502,
    "state": 69,
    "sat": 1022, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Wheeling High School": {
    "natl": 3690,
    "state": 144,
    "sat": 939, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Whiting High School": {
    "natl": 5036,
    "state": 128
  },
  "William Fremd High School": {
    "natl": 406,
    "state": 18,
    "sat": 1133, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Willowbrook High School": {
    "natl": 2979,
    "state": 123,
    "sat": 967, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Wilmington High School": {
    "natl": 11137,
    "state": 383,
    "sat": 931, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Woodstock High School": {
    "natl": 1213,
    "state": 57,
    "sat": 993, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Woodstock North High School": {
    "natl": 2355,
    "state": 97,
    "sat": 944, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "York Community High School": {
    "natl": 827,
    "state": 39,
    "sat": 1077, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Yorkville High School": {
    "natl": 4915,
    "state": 192,
    "sat": 976, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Zion-Benton Township High School": {
    "natl": 10179,
    "state": 355,
    "sat": 838, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },

  // ── Pilot metros (Rockford / Peoria / South Bend), added 2026-08-31 ────────
  // Same methodology as the Chicagoland schools above: US News 2026-2027
  // edition (live-fetched profile pages, not cached search snippets), SAT
  // from each state's own official education-agency data. IMPORTANT: Illinois
  // stopped administering the SAT as its state assessment after spring 2024
  // (switched to the ACT starting 2025) -- ISBE's 2025 Report Card has no SAT
  // sheet at all anymore. So every IL school below (both these new ones and
  // the ~140 Chicagoland ones above) is pulling from the 2024 ISBE Report
  // Card, which is now the FINAL SAT figure Illinois will ever publish for
  // these schools -- there will be no fresher number to refresh to later; a
  // future test-score refresh for Illinois would have to switch to ACT
  // subject-score data instead, which is a bigger methodology change, not
  // something to do silently in a routine data refresh.
  // Indiana SAT is benchmark-percentage-only (no points-based average
  // published), same confirmed-null policy as the original ~24 Chicagoland/
  // NWI Indiana schools. Michigan (Niles) DOES publish a genuine points-based
  // average via the state's own mischooldata.org "College Readiness"
  // report -- a new source, not previously used in this dataset.
  "Adams High School": {
    "natl": 6194, "state": 165
  },
  "Riley High School": {
    "natl": 9964, "state": 249
  },
  "Washington High School": {
    "natl": 15702, "state": 362,
    "natlBand": "13,460–17,945", "stateBand": "321–404"
  },
  "Elkhart High School": {
    "natl": 10751, "state": 264
  },
  "Mishawaka High School": {
    "natl": 7786, "state": 210
  },
  "Goshen High School": {
    "natl": 9075, "state": 236
  },
  "Penn High School": {
    "natl": 1523, "state": 28
  },
  "Niles Senior High School": {
    "natl": 6114, "state": 218,
    "sat": 950, "act": null, "satYear": 2024,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2024-25 school year"
  },
  "Concord Community High School": {
    "natl": 7710, "state": 206
  },
  "Bremen Senior High School": {
    "natl": 4606, "state": 113
  },

  // ── JAMESTOWN METRO (NY), added 2026-09-14 ──────────────────────────────
  // US News 2026-2027 edition, same live-profile-page methodology as every
  // other school in this file. SAT/ACT: researched and confirmed NOT
  // available anywhere government-sourced for New York, the same finding
  // Illinois' ACT situation already established the precedent for -- NYSED's
  // own School Report Card has no SAT/ACT field at all (only Regents/ELA-
  // math-science assessment results), and the one dataset that looked like
  // a statewide SAT source turned out to redirect to NYC DOE's own
  // NYC-only data, inapplicable here. sat/act keys omitted entirely below,
  // same convention as this file's ~24 no-verified-SAT Indiana schools.
  "Jamestown High School": {
    "natl": 12495, "state": 631
  },
  "Dunkirk Senior High School": {
    "natl": 15664, "state": 1123,
    "natlBand": "13,427–17,901", "stateBand": "1,012–1,233"
  },
  "Fredonia High School": {
    "natl": 1893, "state": 182
  },
  "Westfield High School": {
    "natl": 4115, "state": 364
  },
  "Southwestern Senior High School": {
    "natl": 3305, "state": 307
  },
  "Silver Creek High School": {
    "natl": 10650, "state": 841
  },
  "Falconer Middle/High School": {
    "natl": 7197, "state": 622
  },
  "Frewsburg Junior-Senior High School": {
    "natl": 9348, "state": 762
  },
  "Cassadaga Valley High School": {
    "natl": 13178, "state": 993
  },
  "Brocton Middle High School": {
    "natl": 15664, "state": 1123,
    "natlBand": "13,427–17,901", "stateBand": "1,012–1,233"
  },
  "Sherman High School": {
    "natl": 6538, "state": 545
  },
  "Chautauqua Lake Secondary School": {
    "natl": 3249, "state": 302
  },
  "Forestville Central High School": {
    "natl": 15703, "state": 979,
    "natlBand": "13,460–17,945", "stateBand": "726–1,232"
  },

  // ── AUSTIN METRO (TX), added 2026-09-14 ─────────────────────────────────
  // US News 2026-2027 edition, live profile pages (search-snippet caches
  // found stale for at least Dripping Springs and Bastrop, confirmed
  // against the live page instead). SAT/ACT -- unlike Illinois, Indiana,
  // Michigan, and New York -- Texas's own state education agency (TEA)
  // DOES calculate and publish real campus-level SAT/ACT averages, sourced
  // directly from College Board/ACT raw data, downloaded and directly
  // inspected (not summarized secondhand): "Texas Education Agency, SAT/ACT
  // Participation and Performance by Campus, Class of 2024" --
  // tea.texas.gov/reports-and-data/school-performance/accountability-
  // research/satact/. Where act is omitted below, TEA's own file shows the
  // cell suppressed or near-zero test-takers (Texas is overwhelmingly an
  // SAT state) -- an honest null per FERPA suppression, not a missing field.
  "Austin High School": {
    "natl": null, "state": null,
    "sat": 1095, "act": 25.4, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Westlake High School": {
    "natl": 376, "state": 53,
    "sat": 1264, "act": 27.9, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Lake Travis High School": {
    "natl": 1172, "state": 151,
    "sat": 1144, "act": 25.2, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Vandegrift High School": {
    "natl": 798, "state": 107,
    "sat": 1190, "act": 26.4, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Westwood High School": {
    "natl": 419, "state": 59,
    "sat": 1254, "act": 29.0, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Georgetown High School": {
    "natl": 5410, "state": 531,
    "sat": 1021, "act": 23.5, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Hendrickson High School": {
    "natl": 1607, "state": 204,
    "sat": 1034, "act": 24.0, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Jack C. Hays High School": {
    "natl": 5118, "state": 507,
    "sat": 939, "act": 22.0, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Hutto High School": {
    "natl": 12524, "state": 1226,
    "sat": 1082, "act": 21.2, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Dripping Springs High School": {
    "natl": 2108, "state": 259,
    "sat": 1125, "act": 24.4, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "San Marcos High School": {
    "natl": 13338, "state": 1299,
    "sat": 907, "act": 22.4, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Wimberley High School": {
    "natl": 2387, "state": 284,
    "sat": 1159, "act": 23.2, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Liberty Hill High School": {
    "natl": 4638, "state": 464,
    "sat": 1041, "act": 25.0, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Taylor High School": {
    "natl": 15703, "state": 1452,
    "natlBand": "13,460–17,945", "stateBand": "1,311–1,592",
    "sat": 852, "act": 22.0, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Thrall High School": {
    "natl": 4653, "state": 410,
    "sat": 992, "act": 17.8, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Bastrop High School": {
    "natl": 9725, "state": 968,
    "sat": 893, "act": 20.4, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Elgin High School": {
    "natl": 15703, "state": 1452,
    "natlBand": "13,460–17,945", "stateBand": "1,311–1,592",
    "sat": 850, "act": 15.3, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Smithville High School": {
    "natl": 11826, "state": 1083,
    "sat": 944, "act": 17.0, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "McDade High School": {
    "natl": 15703, "state": 1452,
    "natlBand": "13,460–17,945", "stateBand": "1,311–1,592",
    "sat": 929, "satYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Lockhart High School": {
    "natl": 12206, "state": 1116,
    "sat": 867, "satYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Luling High School": {
    "natl": 15664, "state": 1403,
    "natlBand": "13,427–17,901", "stateBand": "1,227–1,578",
    "sat": 860, "act": 20.0, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Lago Vista High School": {
    "natl": 7441, "state": 643,
    "sat": 1014, "act": 22.6, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Manor High School": {
    "natl": 15664, "state": 1403,
    "natlBand": "13,427–17,901", "stateBand": "1,227–1,578",
    "sat": 850, "satYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Del Valle High School": {
    "natl": 15703, "state": 1452,
    "natlBand": "13,460–17,945", "stateBand": "1,311–1,592",
    "sat": 846, "act": 15.1, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Florence High School": {
    "natl": 12310, "state": 1206,
    "sat": 973, "act": 17.6, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Jarrell High School": {
    "natl": 11675, "state": 1066,
    "sat": 889, "act": 18.2, "satYear": 2024, "actYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024", "actSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Bartlett Schools": {
    "natl": 15664, "state": 1403,
    "natlBand": "13,427–17,901", "stateBand": "1,227–1,578",
    "sat": 834, "satYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Granger School": {
    "natl": null, "state": null,
    "sat": 1050, "satYear": 2024,
    "satSource": "TEA SAT/ACT by Campus, Class of 2024"
  },
  "Kankakee High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675"
  },
  "Bradley-Bourbonnais C High School": {
    "natl": 3437, "state": 138
  },
  "Manteno High School": {
    "natl": 4458, "state": 175
  },
  "Momence High School": {
    "natl": 10491, "state": 367
  },
  // === INDIANAPOLIS METRO MSR START ===
  "Alexandria-Monroe High School": {
    "natl": 6694, "state": 181
  },
  "Anderson High School": {
    "natl": 15702, "state": 362,
    "natlBand": "13,460–17,945", "stateBand": "321–404"
  },
  "Avon High School": {
    "natl": 1052, "state": 18
  },
  "Beech Grove Senior High School": {
    "natl": 12271, "state": 295
  },
  "Ben Davis High School": {
    "natl": 15702, "state": 362,
    "natlBand": "13,460–17,945", "stateBand": "321–404"
  },
  "Brown County High School": {
    "natl": 5845, "state": 155
  },
  "Brownsburg High School": {
    "natl": 722, "state": 11
  },
  "Carmel High School": {
    "natl": 316, "state": 7
  },
  "Cascade Senior High School": {
    "natl": 3040, "state": 68
  },
  "Center Grove High School": {
    "natl": 1876, "state": 38
  },
  "Danville Community High School": {
    "natl": 2368, "state": 49
  },
  "Eastern Hancock High School": {
    "natl": 12366, "state": 297
  },
  "Edinburgh Community High School": {
    "natl": 6553, "state": 178
  },
  "Elwood Community High School": {
    "natl": 11285, "state": 276
  },
  "Fishers High School": {
    "natl": 428, "state": 8
  },
  "Franklin Community High School": {
    "natl": 4702, "state": 115
  },
  "Frankton Jr-Sr High School": {
    "natl": 5281, "state": 139
  },
  "Greenfield-Central High School": {
    "natl": 6338, "state": 171
  },
  "Greenwood Community High School": {
    "natl": 3919, "state": 94
  },
  "Hamilton Heights High School": {
    "natl": 3281, "state": 76
  },
  "Hamilton Southeastern High School": {
    "natl": 736, "state": 12
  },
  "Indian Creek Senior High School": {
    "natl": 5488, "state": 149
  },
  "Knightstown High School": {
    "natl": 10290, "state": 254
  },
  "Lapel Senior High School": {
    "natl": 9711, "state": 245
  },
  "Lawrence Central High School": {
    "natl": 8728, "state": 229
  },
  "Lawrence North High School": {
    "natl": 7237, "state": 194
  },
  "Lebanon Senior High School": {
    "natl": 3656, "state": 89
  },
  "Madison-Grant High School": {
    "natl": 4906, "state": 121
  },
  "Martinsville High School": {
    "natl": 11198, "state": 273
  },
  "Monrovia High School": {
    "natl": 9038, "state": 234
  },
  "Mooresville High School": {
    "natl": 7242, "state": 195
  },
  "Morristown Jr-Sr High School": {
    "natl": 10686, "state": 262
  },
  "Mt Vernon High School": {
    "natl": 2277, "state": 47
  },
  "New Palestine High School": {
    "natl": 1837, "state": 35
  },
  "Noblesville High School": {
    "natl": 825, "state": 15
  },
  "North Central High School": {
    "natl": 3577, "state": 85
  },
  "Pendleton Heights High School": {
    "natl": 3326, "state": 77
  },
  "Pike High School": {
    "natl": 4170, "state": 102
  },
  "Plainfield High School (IN)": {
    "natl": 1531, "state": 30
  },
  "Shelbyville Senior High School": {
    "natl": 5849, "state": 156
  },
  "Sheridan High School": {
    "natl": 2666, "state": 55
  },
  "Southport High School": {
    "natl": 7132, "state": 190
  },
  "Speedway Senior High School": {
    "natl": 280, "state": 6
  },
  "Tipton High School": {
    "natl": 5171, "state": 135
  },
  "Tri Central Middle-High School": {
    "natl": 1966, "state": 39
  },
  "Tri-West Senior High School": {
    "natl": 1035, "state": 17
  },
  "Triton Central High School": {
    "natl": 10866, "state": 265
  },
  "Waldron Jr-Sr High School": {
    "natl": 10889, "state": 266
  },
  "Warren Central High School": {
    "natl": 10572, "state": 258
  },
  "Western Boone Jr-Sr High School": {
    "natl": 3920, "state": 95
  },
  "Westfield High School (IN)": {
    "natl": 434, "state": 9
  },
  "Whiteland Community High School": {
    "natl": 6492, "state": 174
  },
  "Zionsville Community High School": {
    "natl": 230, "state": 3
  },
  // === INDIANAPOLIS METRO MSR END ===
  // === DETROIT METRO MSR START ===
  "Academy of the Americas High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 697.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Adlai Stevenson High School": {
    "natl": 2486, "state": 90,
    "sat": 990.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Algonac High School": {
    "natl": 10431, "state": 382,
    "sat": 925.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Allen Park High School": {
    "natl": 5937, "state": 216,
    "sat": 962.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Almont High School": {
    "natl": 4226, "state": 155,
    "sat": 956.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Anchor Bay High School": {
    "natl": 5354, "state": 193,
    "sat": 966.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Annapolis High School": {
    "natl": 10668, "state": 390,
    "sat": 819.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Armada High School": {
    "natl": 2066, "state": 75,
    "sat": 1006.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Athens High School": {
    "natl": 1191, "state": 33,
    "sat": 1094.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Avondale High School": {
    "natl": 10082, "state": 369,
    "sat": 908.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Belleville High School": {
    "natl": 11545, "state": 427,
    "sat": 882.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Berkley High School": {
    "natl": 1360, "state": 46,
    "sat": 1041.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Bloomfield Hills High School": {
    "natl": 1021, "state": 31,
    "sat": 1070.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Brandon High School": {
    "natl": 3888, "state": 147,
    "sat": 937.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Brighton High School": {
    "natl": 1660, "state": 57,
    "sat": 1057.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Brown City High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 917.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Byron Area High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 962.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Canton High School": {
    "natl": 1220, "state": 37,
    "sat": 1083.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Capac High School": {
    "natl": 9592, "state": 357,
    "sat": 870.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Cass Technical High School": {
    "natl": 2325, "state": 84,
    "sat": 1028.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Center Line High School": {
    "natl": 10680, "state": 392,
    "sat": 860.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Central High School (MI)": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 786.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Chippewa Valley High School": {
    "natl": 7996, "state": 297,
    "sat": 933.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Churchill High School": {
    "natl": 4716, "state": 172,
    "sat": 1041.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Clarkston High School": {
    "natl": 2157, "state": 79,
    "sat": 1026.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Clawson High School": {
    "natl": 10741, "state": 396,
    "sat": 1002.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Clintondale High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 821.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Cody High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 720.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Communication and Media Arts High School": {
    "natl": 9506, "state": 351,
    "sat": 853.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Cousino Senior High School": {
    "natl": 10564, "state": 387,
    "sat": 895.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Crestwood High School": {
    "natl": 3777, "state": 142,
    "sat": 919.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Crockett Midtown High School Of Science And Medicine": {
    "natl": 10396, "state": 379,
    "sat": 900.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Croswell-Lexington High School": {
    "natl": 5913, "state": 215,
    "sat": 953.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Dakota High School": {
    "natl": 4603, "state": 167,
    "sat": 985.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Davis Aerospace Technical High School at Golightly": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 846.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Dearborn High School": {
    "natl": 3664, "state": 135,
    "sat": 964.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Denby High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 734.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Detroit International Academy for Young Women": {
    "natl": 7174, "state": 263,
    "sat": 958.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Detroit School of Arts": {
    "natl": 11128, "state": 412,
    "sat": 876.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Dryden High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 882.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "East English Village Preparatory Academy": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 774.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Eastpointe High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 777.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Ecorse Community High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 761.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Edsel Ford High School": {
    "natl": 8660, "state": 318,
    "sat": 880.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Eisenhower High School": {
    "natl": 2297, "state": 81,
    "sat": 1044.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Ernest W. Seaholm High School": {
    "natl": 829, "state": 28,
    "sat": 1127.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Farmington High School": {
    "natl": 3482, "state": 128,
    "sat": 1038.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Fenton Senior High School": {
    "natl": 3000, "state": 114,
    "sat": 1002.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Ferndale High School": {
    "natl": 10990, "state": 404,
    "sat": 912.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Flat Rock Community High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 985.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Fordson High School": {
    "natl": 5544, "state": 199,
    "sat": 891.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Fowlerville High School": {
    "natl": 12087, "state": 449,
    "sat": 944.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Franklin High School": {
    "natl": 5719, "state": 207,
    "sat": 944.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Fraser High School": {
    "natl": 6599, "state": 234,
    "sat": 934.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Garden City High School": {
    "natl": 5607, "state": 203,
    "sat": 910.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Goodrich High School": {
    "natl": 7072, "state": 258,
    "sat": 992.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Grosse Ile High School": {
    "natl": 2225, "state": 80,
    "sat": 1034.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Grosse Pointe North High School": {
    "natl": 1479, "state": 49,
    "sat": 1011.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Grosse Pointe South High School": {
    "natl": 414, "state": 10,
    "sat": 1121.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Hamtramck High School": {
    "natl": 10919, "state": 403,
    "sat": 801.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Harper Woods High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 798.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Hartland High School": {
    "natl": 3081, "state": 117,
    "sat": 1031.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Hazel Park High School": {
    "natl": 12946, "state": 478,
    "sat": 801.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Henry Ford High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 763.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Henry Ford II High School": {
    "natl": 1589, "state": 50,
    "sat": 989.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Holly High School": {
    "natl": 7896, "state": 290,
    "sat": 921.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Howell High School": {
    "natl": 4166, "state": 153,
    "sat": 986.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Huron High School": {
    "natl": 8093, "state": 302,
    "sat": 993.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Imlay City High School": {
    "natl": 6586, "state": 233,
    "sat": 937.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "John Glenn High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 849.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "L'Anse Creuse High School": {
    "natl": 5722, "state": 208,
    "sat": 929.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "L'Anse Creuse High School - North": {
    "natl": 4678, "state": 171,
    "sat": 998.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lake Orion Community High School": {
    "natl": 2885, "state": 111,
    "sat": 1021.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lake Shore High School": {
    "natl": 8795, "state": 323,
    "sat": 900.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lakeland High School": {
    "natl": 2434, "state": 87,
    "sat": 981.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lakeview High School": {
    "natl": 7581, "state": 280,
    "sat": 970.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lakeville High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 851.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lamphere High School": {
    "natl": 8686, "state": 319,
    "sat": 934.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lapeer East Senior High School": {
    "natl": 5350, "state": 191,
    "sat": 921.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lee M. Thurston High School": {
    "natl": 8440, "state": 312,
    "sat": 834.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lincoln Park High School": {
    "natl": 11617, "state": 431,
    "sat": 847.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Lincoln Senior High School": {
    "natl": 11777, "state": 441,
    "sat": 881.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Linden High School": {
    "natl": 4977, "state": 182,
    "sat": 970.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Madison High School": {
    "natl": 10509, "state": 384,
    "sat": 811.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Marine City High School": {
    "natl": 3057, "state": 115,
    "sat": 918.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Marlette Jr./Sr. High School": {
    "natl": 12864, "state": 473,
    "sat": 908.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Martin Luther King Junior Senior High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 832.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Marysville High School": {
    "natl": 3761, "state": 141,
    "sat": 986.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Mayville High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 844.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Melvindale High School": {
    "natl": 12702, "state": 469,
    "sat": 800.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Memphis Junior/Senior High School": {
    "natl": 12962, "state": 480,
    "sat": 925.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Milford High School": {
    "natl": 2606, "state": 100,
    "sat": 998.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Mount Clemens High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 755.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Mumford High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 758.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "New Haven High School": {
    "natl": 8034, "state": 299,
    "sat": 939.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "North Branch High School": {
    "natl": 6147, "state": 219,
    "sat": 919.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "North Farmington High School": {
    "natl": 2459, "state": 89,
    "sat": 978.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Northville High School": {
    "natl": 507, "state": 13,
    "sat": 1151.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Northwestern High School": {
    "natl": 12232, "state": 454,
    "sat": 744.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Novi High School": {
    "natl": 472, "state": 12,
    "sat": 1187.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Oak Park High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 784.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Oscar A. Carlson High School": {
    "natl": 10891, "state": 402,
    "sat": 958.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Oxford High School": {
    "natl": 5471, "state": 195,
    "sat": 994.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Pershing High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 736.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Pinckney Community High School": {
    "natl": 11136, "state": 413,
    "sat": 989.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Plymouth High School": {
    "natl": 1265, "state": 40,
    "sat": 1094.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Pontiac High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 747.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Port Huron High School": {
    "natl": 12477, "state": 461,
    "sat": 896.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Port Huron Northern High School": {
    "natl": 7197, "state": 264,
    "sat": 964.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Redford Union High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 820.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Renaissance High School": {
    "natl": 1379, "state": 47,
    "sat": 1051.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Richmond Community High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 982.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "River Rouge High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 747.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Riverview Community High School": {
    "natl": 2518, "state": 91,
    "sat": 989.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Robichaud Senior High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 822.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Rochester Adams High School": {
    "natl": 400, "state": 8,
    "sat": 1145.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Rochester High School": {
    "natl": 1219, "state": 36,
    "sat": 1096.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Romeo High School": {
    "natl": 4291, "state": 156,
    "sat": 999.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Romulus Senior High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 808.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Roosevelt High School": {
    "natl": 10247, "state": 373,
    "sat": 926.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Roseville High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 836.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Royal Oak High School": {
    "natl": 2131, "state": 78,
    "sat": 1031.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Salem High School": {
    "natl": 1208, "state": 34,
    "sat": 1083.1, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "South Lake High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 837.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "South Lyon East High School": {
    "natl": 2591, "state": 99,
    "sat": 1073.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "South Lyon High School": {
    "natl": 2696, "state": 104,
    "sat": 1024.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Southeastern High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 742.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Southfield High School for the Arts and Technology": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 817.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Southgate Anderson High School": {
    "natl": 12370, "state": 459,
    "sat": 898.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "St. Clair High School": {
    "natl": 5774, "state": 209,
    "sat": 966.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Sterling Heights Senior High School": {
    "natl": 5174, "state": 187,
    "sat": 913.5, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Stevenson High School": {
    "natl": 2685, "state": 103,
    "sat": 1038.8, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Stockbridge High School": {
    "natl": 8792, "state": 322,
    "sat": 954.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Stoney Creek High School": {
    "natl": 688, "state": 22,
    "sat": 1095.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Taylor High School (MI)": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 855.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "The School at Marygrove": {
    "natl": 4866, "state": 177,
    "sat": 918.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Trenton High School": {
    "natl": 5052, "state": 185,
    "sat": 973.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Troy High School": {
    "natl": 401, "state": 9,
    "sat": 1184.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Utica High School": {
    "natl": 2533, "state": 94,
    "sat": 1017.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Walled Lake Central High School": {
    "natl": 3136, "state": 119,
    "sat": 987.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Walled Lake Northern High School": {
    "natl": 1981, "state": 72,
    "sat": 1000.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Walled Lake Western High School": {
    "natl": 2535, "state": 95,
    "sat": 971.2, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Warren Mott High School": {
    "natl": 9158, "state": 340,
    "sat": 913.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Warren Woods Tower High School": {
    "natl": 6175, "state": 220,
    "sat": 906.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Waterford Kettering High School": {
    "natl": 6766, "state": 248,
    "sat": 944.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Waterford Mott High School": {
    "natl": 12578, "state": 464,
    "sat": 865.7, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Wayne Memorial High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 850.4, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "West Bloomfield High School": {
    "natl": 4871, "state": 178,
    "sat": 958.3, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Western International High School": {
    "natl": 15702, "state": 586,
    "natlBand": "13,460–17,945", "stateBand": "494–678",
    "sat": 764.0, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Woodhaven High School": {
    "natl": 3520, "state": 130,
    "sat": 974.9, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Wylie E. Groves High School": {
    "natl": 1027, "state": 32,
    "sat": 1068.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  "Yale Senior High School": {
    "natl": 4482, "state": 166,
    "sat": 965.6, "act": null, "satYear": 2026,
    "satSource": "Michigan School Data (mischooldata.org), College Readiness (Includes SAT Data) report, 2025-26 school year, Mean SAT Score, SAT Total Combined, all students"
  },
  // === DETROIT METRO MSR END ===
  // === ST. LOUIS METRO MSR START ===
  "Affton High School": {
    "natl": 8355, "state": 128,
    "act": 19.3, "actYear": 2025, "actN": 128, "actGrads": 164,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Alton High School": {
    "natl": 10295, "state": 362,
    "sat": 904, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Bayless Sr. High School": {
    "natl": 3634, "state": 47,
    "act": 17.9, "actYear": 2025, "actN": 118, "actGrads": 143,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Belleville High School-East": {
    "natl": 6263, "state": 238,
    "sat": 923, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Belleville High School-West": {
    "natl": 7909, "state": 284,
    "sat": 875, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Bond Cty Comm Unit 2 High School": {
    "natl": 5319, "state": 209,
    "sat": 990, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Brentwood High School": {
    "natl": 7218, "state": 109,
    "act": 22.4, "actYear": 2025, "actN": 45, "actGrads": 53,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Bunker Hill High School": {
    "natl": 9998, "state": 343,
    "sat": 948, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Cahokia High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 777, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Calhoun High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 917, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Carlinville High School": {
    "natl": 8867, "state": 308,
    "sat": 940, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Carlyle High School": {
    "natl": 7287, "state": 265,
    "sat": 942, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Central Comm High School": {
    "natl": 10129, "state": 350,
    "sat": 1030, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Central High School (MO)": {
    "natl": 1475, "state": 20,
    "act": 23.6, "actYear": 2025, "actN": 284, "actGrads": 322,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Civic Memorial High School": {
    "natl": 8120, "state": 289,
    "sat": 968, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Clayton High School": {
    "natl": 308, "state": 3,
    "act": 28.6, "actYear": 2025, "actN": 79, "actGrads": 213,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Collegiate School Of Medicine and Bioscience": {
    "natl": 90, "state": 2,
    "act": 23.2, "actYear": 2025, "actN": 71, "actGrads": 71,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Collinsville High School": {
    "natl": 7873, "state": 281,
    "sat": 885, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Columbia High School": {
    "natl": 3436, "state": 137,
    "sat": 1032, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Crystal City High School": {
    "natl": 10398, "state": 175,
    "act": 20.5, "actYear": 2025, "actN": 22, "actGrads": 31,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Desoto Sr. High School": {
    "natl": 5509, "state": 71,
    "act": 18.8, "actYear": 2025, "actN": 151, "actGrads": 214,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Dupo High School": {
    "natl": 13136, "state": 451,
    "sat": 884, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "East Alton-Wood River High School": {
    "natl": 10335, "state": 363,
    "sat": 877, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "East St Louis Senior High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 751, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Edwardsville High School": {
    "natl": 2817, "state": 115,
    "sat": 1026, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Elsberry High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 19.3, "actYear": 2025, "actN": 29, "actGrads": 59,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Emil E. Holt Sr. High School": {
    "natl": 4830, "state": 60,
    "act": 21.5, "actYear": 2025, "actN": 135, "actGrads": 262,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Eureka Sr. High School": {
    "natl": 1819, "state": 25,
    "act": 22.5, "actYear": 2025, "actN": 370, "actGrads": 412,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Festus Sr. High School": {
    "natl": 2190, "state": 28,
    "act": 20.5, "actYear": 2025, "actN": 200, "actGrads": 231,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Fox Sr. High School": {
    "natl": 8940, "state": 138,
    "act": 19.5, "actYear": 2025, "actN": 311, "actGrads": 429,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Francis Howell Central High School": {
    "natl": 1140, "state": 13,
    "act": 20.9, "actYear": 2025, "actN": 362, "actGrads": 431,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Francis Howell High School": {
    "natl": 1117, "state": 10,
    "act": 22.4, "actYear": 2025, "actN": 409, "actGrads": 455,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Francis Howell North High School": {
    "natl": 2865, "state": 35,
    "act": 20.0, "actYear": 2025, "actN": 342, "actGrads": 403,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Freeburg Community High School": {
    "natl": 4365, "state": 171,
    "sat": 1022, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Ft. Zumwalt East High School": {
    "natl": 3495, "state": 44,
    "act": 21.5, "actYear": 2025, "actN": 189, "actGrads": 285,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Ft. Zumwalt North High School": {
    "natl": 2652, "state": 34,
    "act": 22.0, "actYear": 2025, "actN": 230, "actGrads": 363,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Ft. Zumwalt South High School": {
    "natl": 1135, "state": 12,
    "act": 24.0, "actYear": 2025, "actN": 182, "actGrads": 279,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Ft. Zumwalt West High School": {
    "natl": 1154, "state": 15,
    "act": 23.4, "actYear": 2025, "actN": 250, "actGrads": 372,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Gateway Science Academy High School": {
    "natl": 2620, "state": 33,
    "act": 21.0, "actYear": 2025, "actN": 105, "actGrads": 106,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Gillespie High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 913, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Grand Center Arts Academy High School": {
    "natl": 9168, "state": 142,
    "act": 18.2, "actYear": 2025, "actN": 60, "actGrads": 94,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Granite City High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 838, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hancock Sr. High School": {
    "natl": 6940, "state": 105,
    "act": 19.2, "actYear": 2025, "actN": 19, "actGrads": 84,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Hazelwood Central High School": {
    "natl": 11988, "state": 220,
    "act": 16.0, "actYear": 2025, "actN": 191, "actGrads": 437,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Hazelwood East High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 16.5, "actYear": 2025, "actN": 115, "actGrads": 328,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Hazelwood West High School": {
    "natl": 8775, "state": 136,
    "act": 17.5, "actYear": 2025, "actN": 233, "actGrads": 465,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Herculaneum High School": {
    "natl": 10157, "state": 168,
    "act": 19.1, "actYear": 2025, "actN": 69, "actGrads": 105,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Highland High School (IL)": {
    "natl": 3804, "state": 147,
    "sat": 993, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hillsboro High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 20.0, "actYear": 2025, "actN": 149, "actGrads": 272,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Jennings High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 15.0, "actYear": 2025, "actN": 58, "actGrads": 164,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Jersey Comm High School": {
    "natl": 7648, "state": 276,
    "sat": 947, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "KIPP St. Louis High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 15.5, "actYear": 2025, "actN": 81, "actGrads": 82,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Kirkwood Sr. High School": {
    "natl": 1774, "state": 24,
    "act": 23.4, "actYear": 2025, "actN": 353, "actGrads": 391,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Ladue Horton Watkins High School": {
    "natl": 1156, "state": 16,
    "act": 26.0, "actYear": 2025, "actN": 246, "actGrads": 340,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Lafayette Sr. High School": {
    "natl": 677, "state": 7,
    "act": 24.6, "actYear": 2025, "actN": 385, "actGrads": 416,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Lebanon High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 910, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Liberty High School": {
    "natl": 1537, "state": 21,
    "act": 22.2, "actYear": 2025, "actN": 208, "actGrads": 371,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Lindbergh Sr. High School": {
    "natl": 1385, "state": 18,
    "act": 23.5, "actYear": 2025, "actN": 346, "actGrads": 594,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Lovejoy Technology Academy": {
    "natl": null, "state": null
  },
  "Madison Senior High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 765, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Maplewood-Richmond Hgts. High School": {
    "natl": 2467, "state": 31,
    "act": 20.6, "actYear": 2025, "actN": 90, "actGrads": 98,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Marissa Junior and Senior High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 910, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Marquette Sr. High School": {
    "natl": 1634, "state": 23,
    "act": 24.4, "actYear": 2025, "actN": 453, "actGrads": 505,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Mascoutah High School": {
    "natl": 3376, "state": 134,
    "sat": 1030, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "McCluer High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 14.4, "actYear": 2025, "actN": 153, "actGrads": 310,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "McCluer North High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 15.6, "actYear": 2025, "actN": 150, "actGrads": 289,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "McKinley Classical Leadership Academy": {
    "natl": 1462, "state": 19,
    "act": 19.9, "actYear": 2025, "actN": 55, "actGrads": 56,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Mehlville High School": {
    "natl": 12033, "state": 223,
    "act": 19.5, "actYear": 2025, "actN": 250, "actGrads": 391,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Metro Academic and Classical High School": {
    "natl": 22, "state": 1,
    "act": 27.0, "actYear": 2025, "actN": 72, "actGrads": 72,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Miller Career Academy": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 13.7, "actYear": 2025, "actN": 128, "actGrads": 130,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Mt Olive High School": {
    "natl": 8968, "state": 310,
    "sat": 994, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Mulberry Grove Senior High School": {
    "natl": 13146, "state": 453,
    "sat": 901, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "New Athens High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 918, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "New Haven High School (MO)": {
    "natl": 7220, "state": 110,
    "act": 22.4, "actYear": 2025, "actN": 28, "actGrads": 39,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Normandy High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 14.8, "actYear": 2025, "actN": 90, "actGrads": 160,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "North High School": {
    "natl": 4949, "state": 62,
    "act": 20.5, "actYear": 2025, "actN": 219, "actGrads": 266,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "North Mac High School": {
    "natl": 9851, "state": 340,
    "sat": 929, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "North Point High School": {
    "natl": 3558, "state": 45,
    "act": 21.5, "actYear": 2025, "actN": 205, "actGrads": 370,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Northwest High School": {
    "natl": 10100, "state": 167,
    "act": 20.5, "actYear": 2025, "actN": 262, "actGrads": 415,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Northwestern High School (IL)": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 891, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "O'Fallon Township High School": {
    "natl": 4232, "state": 165,
    "sat": 1008, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Oakville Sr. High School": {
    "natl": 5902, "state": 79,
    "act": 20.2, "actYear": 2025, "actN": 349, "actGrads": 451,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Orchard Farm Sr. High School": {
    "natl": 7637, "state": 116,
    "act": 18.5, "actYear": 2025, "actN": 123, "actGrads": 147,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Owensville High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 21.6, "actYear": 2025, "actN": 66, "actGrads": 124,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Pacific High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 20.1, "actYear": 2025, "actN": 84, "actGrads": 238,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Parkway South High School": {
    "natl": 2294, "state": 30,
    "act": 22.4, "actYear": 2025, "actN": 332, "actGrads": 378,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Parkway West High School": {
    "natl": 438, "state": 4,
    "act": 23.7, "actYear": 2025, "actN": 298, "actGrads": 342,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Pattonville Sr. High School": {
    "natl": 4585, "state": 56,
    "act": 19.5, "actYear": 2025, "actN": 326, "actGrads": 441,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Ritenour Sr. High School": {
    "natl": 12997, "state": 248,
    "act": 18.4, "actYear": 2025, "actN": 102, "actGrads": 453,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Riverview Gardens Sr. High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 14.6, "actYear": 2025, "actN": 109, "actGrads": 256,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Rockwood Summit Sr. High School": {
    "natl": 2989, "state": 38,
    "act": 22.0, "actYear": 2025, "actN": 282, "actGrads": 308,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Roosevelt High School (MO)": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 13.2, "actYear": 2025, "actN": 103, "actGrads": 122,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Roxana Senior High School": {
    "natl": 10101, "state": 348,
    "sat": 932, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Seckman Sr. High School": {
    "natl": 6840, "state": 101,
    "act": 20.5, "actYear": 2025, "actN": 300, "actGrads": 407,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Southwestern High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 927, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "St. Charles High School": {
    "natl": 7487, "state": 113,
    "act": 22.6, "actYear": 2025, "actN": 67, "actGrads": 184,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "St. Charles West High School": {
    "natl": 4957, "state": 63,
    "act": 22.5, "actYear": 2025, "actN": 62, "actGrads": 161,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "St. Clair High School (MO)": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 18.0, "actYear": 2025, "actN": 105, "actGrads": 166,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Staunton High School": {
    "natl": 12438, "state": 426,
    "sat": 922, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Sullivan Sr. High School": {
    "natl": 11528, "state": 206,
    "act": 18.8, "actYear": 2025, "actN": 151, "actGrads": 167,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Sumner High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 13.3, "actYear": 2025, "actN": 53, "actGrads": 59,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Timberland High School": {
    "natl": 2895, "state": 36,
    "act": 22.8, "actYear": 2025, "actN": 216, "actGrads": 387,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Triad High School": {
    "natl": 3187, "state": 129,
    "sat": 1019, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Troy Buchanan High School": {
    "natl": 8043, "state": 122,
    "act": 20.9, "actYear": 2025, "actN": 202, "actGrads": 496,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Union High School": {
    "natl": 10938, "state": 196,
    "act": 19.0, "actYear": 2025, "actN": 143, "actGrads": 236,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "University City Sr. High School": {
    "natl": 8521, "state": 132,
    "act": 15.9, "actYear": 2025, "actN": 119, "actGrads": 223,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Valley Park Sr. High School": {
    "natl": 3677, "state": 48,
    "act": 19.7, "actYear": 2025, "actN": 49, "actGrads": 57,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Valmeyer High School": {
    "natl": 11389, "state": 389,
    "sat": 986, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Vashon High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 12.7, "actYear": 2025, "actN": 118, "actGrads": 131,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Warrenton High School": {
    "natl": 11978, "state": 218,
    "act": 21.3, "actYear": 2025, "actN": 75, "actGrads": 260,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Washington High School (MO)": {
    "natl": 6887, "state": 102,
    "act": 22.0, "actYear": 2025, "actN": 137, "actGrads": 300,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Waterloo High School": {
    "natl": 5682, "state": 223,
    "sat": 1001, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Webster Groves High School": {
    "natl": 2222, "state": 29,
    "act": 23.6, "actYear": 2025, "actN": 301, "actGrads": 323,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Wesclin Senior High School": {
    "natl": 9582, "state": 330,
    "sat": 946, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Windsor High School": {
    "natl": 12306, "state": 232,
    "act": 18.4, "actYear": 2025, "actN": 180, "actGrads": 204,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Winfield High School": {
    "natl": 15702, "state": 306,
    "natlBand": "13,460–17,945", "stateBand": "256–356",
    "act": 19.3, "actYear": 2025, "actN": 47, "actGrads": 119,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  "Wright City High School": {
    "natl": 8620, "state": 134,
    "act": 18.5, "actYear": 2025, "actN": 66, "actGrads": 162,
    "actSource": "Missouri DESE, MCDS 'Building ACT Results' (apps.dese.mo.gov/MCDS), graduating class of 2025: ACT composite of the graduates who took the ACT (actN = ACT tests administered, actGrads = graduates; the ACT is not a universal test in Missouri)"
  },
  // === ST. LOUIS METRO MSR END ===
  // === ROCKFORD METRO MSR START ===
  "Auburn High School": {
    "natl": 4485, "state": 176,
    "sat": 890, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Belvidere High School": {
    "natl": 9765, "state": 334,
    "sat": 852, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Belvidere North High School": {
    "natl": 6427, "state": 243,
    "sat": 894, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Durand High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 858, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Guilford High School": {
    "natl": 6253, "state": 237,
    "sat": 864, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Harlem High School": {
    "natl": 4245, "state": 166,
    "sat": 898, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hononegah High School": {
    "natl": 1185, "state": 56,
    "sat": 1063, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Jefferson High School": {
    "natl": 12492, "state": 427,
    "sat": 776, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "North Boone High School": {
    "natl": 11863, "state": 402,
    "sat": 916, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Pecatonica High School": {
    "natl": 4509, "state": 178,
    "sat": 998, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Rockford East High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 812, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "South Beloit Senior High School": {
    "natl": 6243, "state": 236,
    "sat": 946, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Winnebago High School": {
    "natl": 10234, "state": 358,
    "sat": 971, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  // === ROCKFORD METRO MSR END ===
  // === PEORIA METRO MSR START ===
  "Brimfield High School": {
    "natl": 9769, "state": 336,
    "sat": 1029, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Dee-Mack High School": {
    "natl": 4988, "state": 195,
    "sat": 973, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Delavan High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 916, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Dunlap High School": {
    "natl": 985, "state": 48,
    "sat": 1096, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "East Peoria High School": {
    "natl": 9571, "state": 328,
    "sat": 882, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "El Paso-Gridley High School": {
    "natl": 2726, "state": 111,
    "sat": 1015, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Elmwood High School": {
    "natl": 13111, "state": 450,
    "sat": 954, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Eureka High School": {
    "natl": 6724, "state": 252,
    "sat": 1067, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Farmington Central High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 893, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Fieldcrest High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 881, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Henry-Senachwine High School": {
    "natl": 12816, "state": 439,
    "sat": 860, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Il Valley Central High School": {
    "natl": 5120, "state": 200,
    "sat": 945, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Illini Bluffs High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 970, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Limestone Community High School": {
    "natl": 9274, "state": 317,
    "sat": 902, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lowpoint-Washburn Junior Senior High School": {
    "natl": 11526, "state": 393,
    "sat": 942, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Manual High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 727, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Metamora High School": {
    "natl": 2432, "state": 99,
    "sat": 1018, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Midland High School": {
    "natl": 11486, "state": 390,
    "sat": 903, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Midwest Central High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 892, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Morton High School": {
    "natl": 1743, "state": 76,
    "sat": 1054, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Olympia High School": {
    "natl": 8184, "state": 291,
    "sat": 935, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Pekin Community High School": {
    "natl": 5604, "state": 220,
    "sat": 903, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Peoria Heights High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 859, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Peoria High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 752, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Princeville High School": {
    "natl": 8632, "state": 302,
    "sat": 1009, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Richwoods High School": {
    "natl": 4382, "state": 173,
    "sat": 914, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Roanoke-Benson High School": {
    "natl": 12765, "state": 434,
    "sat": 978, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Stark County High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 932, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Tremont High School": {
    "natl": 5287, "state": 208,
    "sat": 1023, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Washington Comm High School": {
    "natl": 1838, "state": 80,
    "sat": 1046, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  // === PEORIA METRO MSR END ===
  // === CHAMPAIGN METRO MSR START ===
  "Arthur-Lovington High School": {
    "natl": 12070, "state": 409,
    "sat": 938, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Bement High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 910, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Blue Ridge High School": {
    "natl": 12051, "state": 407,
    "sat": 901, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Centennial High School": {
    "natl": 3857, "state": 149,
    "sat": 915, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Central High School (Champaign)": {
    "natl": 2861, "state": 118,
    "sat": 962, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Cerro Gordo High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 898, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Fisher Jr/Sr High School": {
    "natl": 7402, "state": 269,
    "sat": 988, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "GCMS High School": {
    "natl": 3143, "state": 126,
    "sat": 1007, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Heritage High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 869, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Mahomet-Seymour High School": {
    "natl": 1343, "state": 63,
    "sat": 1079, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Monticello High School": {
    "natl": 3440, "state": 139,
    "sat": 970, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Paxton-Buckley-Loda High School": {
    "natl": 4131, "state": 161,
    "sat": 992, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Rantoul Twp High School": {
    "natl": 8682, "state": 303,
    "sat": 796, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "St Joseph-Ogden High School": {
    "natl": 4937, "state": 194,
    "sat": 1011, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Tri-Point High School": {
    "natl": 2831, "state": 116,
    "sat": 926, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Unity High School": {
    "natl": 4074, "state": 159,
    "sat": 980, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Urbana High School": {
    "natl": 4682, "state": 184,
    "sat": 877, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  // === CHAMPAIGN METRO MSR END ===
  // === SPRINGFIELD METRO MSR START ===
  "Athens Senior High School": {
    "natl": 7814, "state": 280,
    "sat": 947, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Auburn High School (Auburn)": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 876, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Glenwood High School": {
    "natl": 2122, "state": 89,
    "sat": 1016, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Greenview Jr/Sr High School": {
    "natl": null, "state": null,
    "sat": 869, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lanphier High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 807, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "New Berlin High School": {
    "natl": 12158, "state": 411,
    "sat": 966, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Pawnee Jr/Sr High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 956, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Pleasant Plains High School": {
    "natl": 4149, "state": 162,
    "sat": 993, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Porta High School": {
    "natl": 5516, "state": 214,
    "sat": 920, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Riverton High School": {
    "natl": 10093, "state": 346,
    "sat": 886, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Rochester High School (IL)": {
    "natl": 3670, "state": 143,
    "sat": 971, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Sangamon Valley High School": {
    "natl": 10859, "state": 375,
    "sat": 922, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Springfield High School": {
    "natl": 3867, "state": 150,
    "sat": 960, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Springfield Southeast High School": {
    "natl": 10894, "state": 377,
    "sat": 841, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Tri-City High School": {
    "natl": 11628, "state": 396,
    "sat": 930, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Williamsville High School": {
    "natl": 3826, "state": 148,
    "sat": 995, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  // === SPRINGFIELD METRO MSR END ===
  // === BLOOMINGTON METRO MSR START ===
  "Bloomington High School": {
    "natl": 5622, "state": 221,
    "sat": 887, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Heyworth Jr-Sr High School": {
    "natl": 8007, "state": 287,
    "sat": 955, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Leroy High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 944, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Lexington High School": {
    "natl": 4395, "state": 174,
    "sat": 950, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Normal Community High School": {
    "natl": 2312, "state": 95,
    "sat": 994, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Normal Community West High School": {
    "natl": 5438, "state": 210,
    "sat": 934, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Prairie Central High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 937, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Ridgeview High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460-17,945", "stateBand": "469-675",
    "sat": 945, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Tri-Valley High School": {
    "natl": 1108, "state": 54,
    "sat": 1042, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  // === BLOOMINGTON METRO MSR END ===
  // === KANKAKEE METRO MSR START ===
  "Grant Park High School": {
    "natl": 8321, "state": 294,
    "sat": 977, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Herscher High School": {
    "natl": 5507, "state": 212,
    "sat": 964, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  },
  "St Anne Comm High School": {
    "natl": 12784, "state": 437,
    "sat": 829, "act": null, "satYear": 2024,
    "satSource": "ISBE 2024 Illinois Report Card"
  }
  // === KANKAKEE METRO MSR END ===
};

const SCHOOL_DATA = {

  // ── ADDISON ──────────────────────────────────────────────────────────────
  'Addison': {
    hs: 'Addison Trail High School',
    district: 'DuPage HSD 88',
    usNewsNational: 5126,
    usNewsState: 185,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 25, avgSAT: 1120,
    note: 'DuPage HSD 88 serves Addison and Villa Park; Addison Trail has a 41% AP participation rate and 89% graduation rate.'
  },

  // ── ALGONQUIN ─────────────────────────────────────────────────────────────
  'Algonquin': {
    hs: 'Harry D. Jacobs High School',
    district: 'CUSD 300',
    usNewsNational: 2104,
    usNewsState: 78,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 26, avgSAT: 1170,
    note: 'CUSD 300 is a large district spanning Algonquin, Carpentersville, and Dundee; Jacobs ranks 78th in Illinois with 44% AP participation rate.'
  },

  // ── ANTIOCH ───────────────────────────────────────────────────────────────
  'Antioch': {
    hs: 'Antioch Community High School',
    district: 'Community HSD 117',
    usNewsNational: null,
    usNewsState: 158,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1190,
    note: 'Antioch Community High School serves the northern Lake County area with a 50% AP participation rate and ranks 158th in Illinois.'
  },

  // ── ARLINGTON HEIGHTS ────────────────────────────────────────────────────
  'Arlington Heights': {
    hs: 'John Hersey High School',
    district: 'Township HSD 214',
    usNewsNational: 404,
    usNewsState: 15,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1290,
    note: 'Township HSD 214 serves multiple northwest suburbs; Hersey was named a 2024 National Blue Ribbon School and ranks 15th in Illinois.'
  },

  // ── BARRINGTON ───────────────────────────────────────────────────────────
  'Barrington': {
    hs: 'Barrington High School',
    district: 'Barrington CUSD 220',
    usNewsNational: 548,
    usNewsState: 23,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 30, avgSAT: 1300,
    note: 'Barrington CUSD 220 was named the best unit school district in Illinois in Niche 2025 rankings; Barrington HS has a 65% AP participation rate.'
  },

  // ── BARTLETT ─────────────────────────────────────────────────────────────
  'Bartlett': {
    hs: 'Bartlett High School',
    district: 'School District U-46',
    usNewsNational: null,
    usNewsState: 96,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 28, avgSAT: 1210,
    note: 'U-46 is the second-largest district in Illinois; Bartlett ranks 96th statewide and has 94% graduation rate across the district.'
  },

  // ── BATAVIA ──────────────────────────────────────────────────────────────
  'Batavia': {
    hs: 'Batavia Senior High School',
    district: 'Batavia Unit School District 101',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28, avgSAT: 1240,
    note: 'Batavia Senior High School ranks #76 Best Public High Schools in Illinois by Niche (2025-26) with an A grade; 47% math and 53% reading proficiency. USD 101 is a well-regarded single-high-school Kane County district.'
  },

  // ── BEACH PARK ───────────────────────────────────────────────────────────
  'Beach Park': {
    hs: 'Warren Township High School',
    district: 'Warren TWP HSD 121',
    usNewsNational: 2863,
    usNewsState: 106,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 28, avgSAT: 1210,
    feedsTo: 'Warren TWP HSD 121',
    note: 'Warren Township HSD 121 serves Gurnee, Gages Lake, Beach Park, and surrounding communities; Warren ranks 106th in Illinois with 42% AP participation.'
  },

  // ── BENSENVILLE ──────────────────────────────────────────────────────────
  'Bensenville': {
    hs: 'Fenton High School',
    district: 'Fenton CHSD 100',
    usNewsNational: 5304,
    usNewsState: 190,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: null,
    note: 'Fenton CHSD 100 earned a Commendable designation on the 2024 Illinois Report Card; school has 33% AP participation and 1,422 students.'
  },

  // ── BEVERLY SHORES (IN) ───────────────────────────────────────────────────
  'Beverly Shores': {
    hs: 'Michigan City High School',
    feedsTo: 'Michigan City Area Schools',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: null,
    niche: 'C+', avgACT: 24, avgSAT: 1090,
    note: 'Beverly Shores is served by Michigan City Area Schools; Michigan City HS ranks 238th in Indiana with 28% math proficiency vs. 39% state average.'
  },

  // ── BLOOMINGDALE ─────────────────────────────────────────────────────────
  'Bloomingdale': {
    hs: 'Lake Park High School',
    district: 'Lake Park CHSD 108',
    usNewsNational: 1864,
    usNewsState: 73,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 27, avgSAT: 1210,
    note: 'Lake Park CHSD 108 serves Roselle, Bloomingdale, Itasca, and Medinah; Lake Park ranks 73rd in Illinois with 68% ACT ELA proficiency.'
  },

  // ── BUFFALO GROVE ────────────────────────────────────────────────────────
  'Buffalo Grove': {
    hs: 'Buffalo Grove High School',
    district: 'Township HSD 214',
    usNewsNational: null,
    usNewsState: 55,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28, avgSAT: 1260,
    note: 'Township HSD 214 serves multiple northwest suburbs; Buffalo Grove ranks 55th in Illinois with 53% district-wide math proficiency.'
  },

  // ── BURNS HARBOR (IN) ────────────────────────────────────────────────────
  'Burns Harbor': {
    hs: 'Chesterton Senior High School',
    feedsTo: 'Duneland School Corporation',
    usNewsNational: 3029,
    usNewsState: 56,
    stateGrade: null,
    niche: 'A', avgACT: 28, avgSAT: 1210,
    note: 'Burns Harbor feeds into Duneland School Corporation; Chesterton HS is ranked 56th in Indiana with an AP participation rate of 51%.'
  },

  // ── BURR RIDGE ───────────────────────────────────────────────────────────
  'Burr Ridge': {
    hs: 'Lyons Township High School',
    district: 'Lyons TWP HSD 204',
    usNewsNational: 884,
    usNewsState: 39,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1260,
    feedsTo: 'Lyons TWP HSD 204',
    note: 'Lyons Township HSD 204 serves La Grange, Western Springs, Burr Ridge, and surrounding communities; LTHS has a 54% AP participation rate.'
  },

  // ── CAMPTON HILLS ────────────────────────────────────────────────────────
  'Campton Hills': {
    hs: 'Central High School',
    district: 'Central CUSD 301',
    usNewsNational: 1868,
    usNewsState: 75,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 27, avgSAT: 1210,
    feedsTo: 'Central CUSD 301',
    note: 'Central CUSD 301 serves Campton Hills, Burlington, and parts of St. Charles and Elgin; Central High ranks 75th in Illinois with 48% AP participation.'
  },

  // ── CAROL STREAM ─────────────────────────────────────────────────────────
  'Carol Stream': {
    hs: 'Glenbard North High School',
    district: 'Glenbard TWP HSD 87',
    usNewsNational: null,
    usNewsState: 100,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28, avgSAT: 1190,
    note: 'Glenbard TWP HSD 87 serves Carol Stream, Glen Ellyn, Lombard, and Wheaton; Glenbard North ranks 100th in Illinois within the top 22% statewide.'
  },

  // ── CARPENTERSVILLE ──────────────────────────────────────────────────────
  'Carpentersville': {
    hs: 'Dundee-Crown High School',
    district: 'CUSD 300',
    usNewsNational: 6897,
    usNewsState: 232,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 25, avgSAT: 1120,
    note: 'CUSD 300 spans multiple northwest suburbs; Dundee-Crown serves Carpentersville and Dundee communities with approximately 2,000 students.'
  },

  // ── CARY ─────────────────────────────────────────────────────────────────
  'Cary': {
    hs: 'Cary-Grove Community High School',
    district: 'Community HSD 155',
    usNewsNational: null,
    usNewsState: 68,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 28, avgSAT: 1210,
    note: 'Community HSD 155 serves Crystal Lake, Cary, and Fox River Grove; Cary-Grove ranks in the top 8% nationally and 68th in Illinois.'
  },

  // ── CEDAR LAKE (IN) ──────────────────────────────────────────────────────
  'Cedar Lake': {
    hs: 'Hanover Central High School',
    usNewsNational: 2750,
    usNewsState: 50,
    stateGrade: null,
    niche: 'B+', avgACT: 26, avgSAT: 1140,
    note: 'Hanover Central ranks 50th in Indiana with 54% math proficiency and 52% reading proficiency, both well above state averages.'
  },

  // ── CHESTERTON (IN) ──────────────────────────────────────────────────────
  'Chesterton': {
    hs: 'Chesterton Senior High School',
    usNewsNational: 3029,
    usNewsState: 56,
    stateGrade: null,
    niche: 'A', avgACT: 28, avgSAT: 1210,
    note: 'Chesterton Senior HS ranks 56th in Indiana within Duneland School Corporation, with strong AP participation at 51% and a Niche district grade of A.'
  },

  // ── CLARENDON HILLS ──────────────────────────────────────────────────────
  'Clarendon Hills': {
    hs: 'Hinsdale Central High School',
    district: 'Hinsdale TWP HSD 86',
    usNewsNational: null,
    usNewsState: 9,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: 27.7, avgSAT: 1360,
    feedsTo: 'Hinsdale TWP HSD 86',
    note: 'Hinsdale Central ranks 9th in Illinois with 64% AP participation rate and received Exemplary designation on the 2024 Illinois Report Card.'
  },

  // ── CROWN POINT (IN) ─────────────────────────────────────────────────────
  'Crown Point': {
    hs: 'Crown Point High School',
    usNewsNational: 2054,
    usNewsState: 32,
    stateGrade: 'A',
    niche: 'A', avgACT: 26, avgSAT: 1200,
    note: 'Crown Point HS ranks 32nd in Indiana with 55% math and 52% reading proficiency; district earned an A in the last Indiana DOE A-F accountability ratings (2018).'
  },

  // ── CRYSTAL LAKE ─────────────────────────────────────────────────────────
  'Crystal Lake': {
    hs: ['Crystal Lake Central High School', 'Crystal Lake South High School', 'Prairie Ridge High School'],
    district: ['Community HSD 155', 'Community HSD 155', 'Community HSD 155'],
    usNewsNational: null,
    usNewsState: 102,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 28, avgSAT: 1207,
    splitDistrict: false,
    note: 'Community HSD 155 has four high schools all ranking in the top 14% nationally; Crystal Lake Central ranks 102nd, South 108th, and Prairie Ridge 87th in Illinois.'
  },

  // ── DARIEN ───────────────────────────────────────────────────────────────
  'Darien': {
    hs: 'Hinsdale South High School',
    district: 'Hinsdale TWP HSD 86',
    usNewsNational: null,
    usNewsState: 76,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28.8, avgSAT: 1250,
    feedsTo: 'Hinsdale TWP HSD 86',
    note: 'Hinsdale TWP HSD 86 serves Hinsdale and Darien; Hinsdale South ranks 76th in Illinois with 43% AP participation rate.'
  },

  // ── DEERFIELD ────────────────────────────────────────────────────────────
  'Deerfield': {
    hs: 'Deerfield High School',
    district: 'Township HSD 113',
    usNewsNational: 437,
    usNewsState: 18,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 30, avgSAT: 1340,
    note: 'Township HSD 113 is ranked 5th in the nation by Niche 2026; Deerfield ranks 18th in Illinois with 75% math and reading proficiency district-wide.'
  },

  // ── DES PLAINES ──────────────────────────────────────────────────────────
  'Des Plaines': {
    hs: 'Maine West High School',
    district: 'Maine TWP HSD 207',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 27, avgSAT: 1180,
    note: 'Maine TWP HSD 207 serves Park Ridge and Des Plaines; Maine South ranks 24th in Illinois with 72% AP participation, Maine West and East serve Des Plaines.'
  },

  // ── DOWNERS GROVE ────────────────────────────────────────────────────────
  'Downers Grove': {
    hs: ['Downers Grove North High School', 'Downers Grove South High School'],
    district: ['Community HSD 99', 'Community HSD 99'],
    usNewsNational: null,
    usNewsState: 50,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28.5, avgSAT: 1230,
    splitDistrict: false,
    note: 'Community HSD 99 ranks 22nd in Illinois per Niche 2024; DG North ranks ~50th and DG South 103rd in Illinois, both designated Commendable.'
  },

  // ── DUNE ACRES (IN) ──────────────────────────────────────────────────────
  'Dune Acres': {
    hs: 'Chesterton Senior High School',
    feedsTo: 'Duneland School Corporation',
    usNewsNational: 3029,
    usNewsState: 56,
    stateGrade: null,
    niche: 'A', avgACT: 28, avgSAT: 1210,
    note: 'Dune Acres is within the Duneland School Corporation boundaries; students attend Chesterton Senior HS, ranked 56th in Indiana.'
  },

  // ── DYER (IN) ────────────────────────────────────────────────────────────
  'Dyer': {
    hs: 'Lake Central High School',
    feedsTo: 'Lake Central School Corporation',
    usNewsNational: 1705,
    usNewsState: 27,
    stateGrade: 'A',
    niche: 'A', avgACT: 28, avgSAT: 1190,
    note: 'Most of Dyer feeds to Lake Central HS (St. John), ranked 27th in Indiana with 2,992 students; district received A in last Indiana DOE accountability ratings.'
  },

  // ── EAST CHICAGO (IN) ────────────────────────────────────────────────────
  'East Chicago': {
    hs: 'East Chicago Central High School',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: null,
    niche: 'D+', avgACT: 20, avgSAT: 1020,
    note: 'East Chicago Central HS has only 7% math proficiency vs. 39% state average and 22% reading proficiency vs. 41% statewide.'
  },

  // ── ELBURN ───────────────────────────────────────────────────────────────
  'Elburn': {
    hs: 'Kaneland Senior High School',
    district: 'Kaneland CUSD 302',
    usNewsNational: 4603,
    usNewsState: 172,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: null,
    note: 'Kaneland CUSD 302 serves Elburn, Sugar Grove, and surrounding Kane County communities; Kaneland HS has a 95%+ graduation rate with 172nd state ranking.'
  },

  // ── ELGIN ────────────────────────────────────────────────────────────────
  'Elgin': {
    hs: 'Elgin High School',
    district: 'School District U-46',
    usNewsNational: null,
    usNewsState: 197,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1090,
    note: 'U-46 is the second-largest district in Illinois serving 34,000+ students; Elgin High ranks 197th in Illinois within the highly diverse district.'
  },

  // ── ELK GROVE VILLAGE ────────────────────────────────────────────────────
  'Elk Grove Village': {
    hs: 'Elk Grove High School',
    district: 'Township HSD 214',
    usNewsNational: null,
    usNewsState: 115,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1160,
    note: 'Township HSD 214 serves six northwest suburbs; Elk Grove ranks 115th in Illinois with 53% district math proficiency and 65% reading proficiency.'
  },

  // ── ELMHURST ─────────────────────────────────────────────────────────────
  'Elmhurst': {
    hs: 'York Community High School',
    district: 'Elmhurst SD 205',
    usNewsNational: 854,
    usNewsState: 37,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: null,
    note: 'York Community High School ranks 37th in Illinois and offers 30+ AP classes with 58% AP participation rate and 2,590 students.'
  },

  // ── FOREST PARK ──────────────────────────────────────────────────────────
  'Forest Park': {
    hs: 'Proviso East High School',
    district: 'Proviso TWP HSD 209',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 23, avgSAT: 960,
    note: 'Proviso East achieved Commendable designation in 2024 for the first time since ISBE began rating schools in 2018, with a 14% increase in science proficiency.'
  },

  // ── FOX LAKE ─────────────────────────────────────────────────────────────
  'Fox Lake': {
    hs: 'Grant Community High School',
    district: 'Grant CHSD 124',
    usNewsNational: 3774,
    usNewsState: 136,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: null,
    note: 'Grant CHSD 124 serves Fox Lake, Lake Villa, and surrounding communities; graduation rate improved to 92.7% in 2024 with 136th state ranking.'
  },

  // ── FOX RIVER GROVE ──────────────────────────────────────────────────────
  'Fox River Grove': {
    hs: 'Cary-Grove Community High School',
    district: 'Community HSD 155',
    usNewsNational: null,
    usNewsState: 68,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 28, avgSAT: 1210,
    feedsTo: 'Community HSD 155',
    note: 'Fox River Grove feeder elementary district sends students to Community HSD 155; Cary-Grove ranks in the top 8% of high schools nationally.'
  },

  // ── GAGES LAKE ───────────────────────────────────────────────────────────
  'Gages Lake': {
    hs: 'Warren Township High School',
    district: 'Warren TWP HSD 121',
    usNewsNational: 2863,
    usNewsState: 106,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 28, avgSAT: 1210,
    feedsTo: 'Warren TWP HSD 121',
    note: 'Warren Township HSD 121 is split across two campuses in Gurnee and Gages Lake; 3,537 students with 42% AP participation rate.'
  },

  // ── GARY (IN) ────────────────────────────────────────────────────────────
  'Gary': {
    hs: 'West Side Leadership Academy',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: null,
    niche: 'D+', avgACT: null, avgSAT: null,
    note: 'Gary Community School Corp has 7% math proficiency and 12% reading proficiency; Roosevelt HS closed 2019 and is on the National Endangered Places list.'
  },

  // ── GENEVA ───────────────────────────────────────────────────────────────
  'Geneva': {
    hs: 'Geneva Community High School',
    district: 'Geneva CUSD 304',
    usNewsNational: 1338,
    usNewsState: 54,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: null,
    note: 'Geneva Community High School ranks 54th in Illinois with 49% AP participation rate in a district of 5,077 students grades PK-12.'
  },

  // ── GILBERTS ─────────────────────────────────────────────────────────────
  'Gilberts': {
    hs: 'Harry D. Jacobs High School',
    district: 'CUSD 300',
    usNewsNational: 2104,
    usNewsState: 78,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 26, avgSAT: 1170,
    feedsTo: 'CUSD 300',
    note: 'Gilberts is within CUSD 300 boundaries; Jacobs High School in Algonquin serves surrounding communities and ranks 78th in Illinois.'
  },

  // ── GLEN ELLYN ───────────────────────────────────────────────────────────
  'Glen Ellyn': {
    hs: ['Glenbard West High School', 'Glenbard South High School'],
    district: ['Glenbard TWP HSD 87', 'Glenbard TWP HSD 87'],
    usNewsNational: null,
    usNewsState: 24,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1054,
    splitDistrict: false,
    note: 'Glenbard West ranks 24th in Illinois and earned A+ on Niche; both Glen Ellyn high schools received Commendable on the 2024 Illinois Report Card.'
  },

  // ── GLENCOE ──────────────────────────────────────────────────────────────
  'Glencoe': {
    hs: 'New Trier Township High School',
    district: 'New Trier TWP HSD 203',
    usNewsNational: 371,
    usNewsState: 13,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: 27.5, avgSAT: 1350,
    feedsTo: 'New Trier TWP HSD 203',
    note: 'New Trier received Exemplary designation on the 2025 Illinois Report Card; ranks 13th in Illinois with 58% AP participation and 97% graduation rate.'
  },

  // ── GLENDALE HEIGHTS ─────────────────────────────────────────────────────
  'Glendale Heights': {
    hs: 'Glenbard East High School',
    district: 'Glenbard TWP HSD 87',
    usNewsNational: null,
    usNewsState: 147,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1190,
    feedsTo: 'Glenbard TWP HSD 87',
    note: 'Glenbard TWP HSD 87 serves four DuPage communities; Glenbard East ranks 147th in Illinois while the district overall received Commendable designation.'
  },

  // ── GLENVIEW ─────────────────────────────────────────────────────────────
  'Glenview': {
    hs: 'Glenbrook South High School',
    district: 'Glenbrook HSD 225',
    usNewsNational: 466,
    usNewsState: 19,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1320,
    note: 'Glenbrook HSD 225 was ranked No. 2 school district in the US by Niche; Glenbrook South ranks 19th in Illinois with 80% math and 84% reading proficiency.'
  },

  // ── GRANDWOOD PARK ───────────────────────────────────────────────────────
  'Grandwood Park': {
    hs: 'Warren Township High School',
    district: 'Warren TWP HSD 121',
    usNewsNational: 2863,
    usNewsState: 106,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 28, avgSAT: 1210,
    feedsTo: 'Warren TWP HSD 121',
    note: 'Warren Township HSD 121 serves Gurnee, Grandwood Park, and Gages Lake; Warren ranks 106th in Illinois with a split two-campus model.'
  },

  // ── GRAYSLAKE ────────────────────────────────────────────────────────────
  'Grayslake': {
    hs: ['Grayslake Central High School', 'Grayslake North High School'],
    district: ['Grayslake CHSD 127', 'Grayslake CHSD 127'],
    usNewsNational: null,
    usNewsState: 91,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: null, avgSAT: 1210,
    splitDistrict: false,
    note: 'Grayslake CHSD 127 has 2,581 students; Grayslake Central ranks 91st and Grayslake North 109th in Illinois, both with comparable AP participation.'
  },

  // ── GREEN OAKS ───────────────────────────────────────────────────────────
  'Green Oaks': {
    hs: 'Libertyville High School',
    district: 'Community HSD 128',
    usNewsNational: null,
    usNewsState: 21,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1310,
    feedsTo: 'Community HSD 128',
    note: 'Community HSD 128 serves Libertyville and Vernon Hills; Oak Grove SD 68 in Green Oaks feeds into Libertyville High School, ranked 21st in Illinois.'
  },

  // ── GRIFFITH (IN) ────────────────────────────────────────────────────────
  'Griffith': {
    hs: 'Griffith Senior High School',
    usNewsNational: 6736,
    usNewsState: 149,
    stateGrade: null,
    niche: 'B', avgACT: 23, avgSAT: 1100,
    note: 'Griffith Senior HS ranks 149th in Indiana with 667 students and an AP participation rate of approximately 30% per district data.'
  },

  // ── GURNEE ───────────────────────────────────────────────────────────────
  'Gurnee': {
    hs: 'Warren Township High School',
    district: 'Warren TWP HSD 121',
    usNewsNational: 2863,
    usNewsState: 106,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 28, avgSAT: 1210,
    note: 'Warren Township HSD 121 is headquartered in Gurnee; 3,537 students with 66% minority enrollment and 42% AP participation rate.'
  },

  // ── HAMMOND (IN) ─────────────────────────────────────────────────────────
  'Hammond': {
    hs: 'Hammond Central High School',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: null,
    niche: 'D+', avgACT: 25, avgSAT: 1000,
    note: 'Hammond Central HS ranks in the bottom tier in Indiana with only 5% math proficiency and 26% reading proficiency; Hammond Academy of Science & Tech (charter) grades higher at B.'
  },

  // ── HAMPSHIRE ────────────────────────────────────────────────────────────
  'Hampshire': {
    hs: 'Hampshire High School',
    district: 'CUSD 300',
    usNewsNational: 2575,
    usNewsState: 93,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: null, avgSAT: 1160,
    note: 'Hampshire High School ranks 93rd in Illinois with a 96.5% four-year graduation rate and 44% AP participation within CUSD 300.'
  },

  // ── HANOVER PARK ─────────────────────────────────────────────────────────
  'Hanover Park': {
    hs: 'Streamwood High School',
    district: 'School District U-46',
    usNewsNational: null,
    usNewsState: 235,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1040,
    feedsTo: 'School District U-46',
    note: 'Hanover Park is primarily within U-46 boundaries; Streamwood High School ranks 235th in Illinois serving a highly diverse community.'
  },

  // ── HARWOOD HEIGHTS ──────────────────────────────────────────────────────
  'Harwood Heights': {
    hs: ['Maine East High School', 'Ridgewood Community High School'],
    district: ['Maine TWP HSD 207', 'Ridgewood CHSD 234'],
    usNewsNational: null,
    usNewsState: 117,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1175,
    splitDistrict: true,
    note: 'Harwood Heights is split between Maine TWP HSD 207 (Maine East, ranked 117th) and Ridgewood CHSD 234 (ranked 162nd) based on residential address.'
  },

  // ── HARVARD ──────────────────────────────────────────────────────────────
  'Harvard': {
    hs: 'Harvard High School',
    district: 'Harvard CUSD 50',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: null,
    niche: 'B-', avgACT: null, avgSAT: 1110,
    note: 'Harvard High School is not individually ranked by US News (falls in the lower tier of Illinois schools); 12% math and 12% reading proficiency on state assessments, 77% graduation rate. Harvard is a small rural McHenry County community.'
  },

  // ── HAWTHORN WOODS ───────────────────────────────────────────────────────
  'Hawthorn Woods': {
    hs: 'Lake Zurich High School',
    district: 'Lake Zurich CUSD 95',
    usNewsNational: 829,
    usNewsState: 36,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: null, avgSAT: 1115,
    feedsTo: 'Lake Zurich CUSD 95',
    note: 'Lake Zurich High School received Exemplary on the 2024 Illinois Report Card and was named a 2024 US Dept of Education National Blue Ribbon School.'
  },

  // ── HEBRON (IN) ──────────────────────────────────────────────────────────
  'Hebron': {
    hs: 'Hebron High School',
    usNewsNational: 9678,
    usNewsState: 235,
    stateGrade: null,
    niche: 'B', avgACT: 26, avgSAT: 1160,
    note: 'Hebron HS ranks 235th in Indiana with a 95% graduation rate but only 19% math proficiency vs. 39% state average.'
  },

  // ── HIGHLAND (IN) ────────────────────────────────────────────────────────
  'Highland': {
    hs: 'Highland High School',
    usNewsNational: 5674,
    usNewsState: 117,
    stateGrade: null,
    niche: 'B+', avgACT: null, avgSAT: null,
    note: 'Highland HS ranks 117th in Indiana with a 41% AP participation rate; the district operates a rebuilt facility under the same name following a 2024 building replacement.'
  },

  // ── HIGHLAND PARK ────────────────────────────────────────────────────────
  'Highland Park': {
    hs: 'Highland Park High School',
    district: 'Township HSD 113',
    usNewsNational: 743,
    usNewsState: 31,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 27.5, avgSAT: 1270,
    note: 'Township HSD 113 ranks 5th in the US per Niche 2026 with A+ grades; Highland Park ranks 31st in Illinois with 75% math and reading proficiency district-wide.'
  },

  // ── HIGHWOOD ─────────────────────────────────────────────────────────────
  'Highwood': {
    hs: 'Highland Park High School',
    district: 'Township HSD 113',
    usNewsNational: 743,
    usNewsState: 31,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 27.5, avgSAT: 1270,
    feedsTo: 'Township HSD 113',
    note: 'Highwood is a small lakefront city that feeds into Township HSD 113; Highland Park High School ranks 31st in Illinois with A+ Niche district grade.'
  },

  // ── HINSDALE ─────────────────────────────────────────────────────────────
  'Hinsdale': {
    hs: 'Hinsdale Central High School',
    district: 'Hinsdale TWP HSD 86',
    usNewsNational: null,
    usNewsState: 9,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: 27.7, avgSAT: 1249,
    note: 'Hinsdale Central ranks 9th in Illinois and received Exemplary on the 2024 Illinois Report Card with 64% AP participation and a 13:1 student-teacher ratio.'
  },

  // ── HOBART (IN) ──────────────────────────────────────────────────────────
  'Hobart': {
    hs: 'Hobart High School',
    usNewsNational: 7137,
    usNewsState: 163,
    stateGrade: null,
    niche: 'B', avgACT: 26, avgSAT: 1110,
    note: 'Hobart HS ranks 163rd in Indiana with a B Niche grade; the district (School City of Hobart) earns a B+ overall and ranks 5th among Lake County districts.'
  },

  // ── HOFFMAN ESTATES ──────────────────────────────────────────────────────
  'Hoffman Estates': {
    hs: 'Hoffman Estates High School',
    district: 'Township HSD 211',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 998,
    note: 'Township HSD 211 serves Palatine and Schaumburg area; Hoffman Estates High School is one of five schools in the district with Fremd ranked 14th in Illinois.'
  },

  // ── HUNTLEY ──────────────────────────────────────────────────────────────
  'Huntley': {
    hs: 'Huntley High School',
    district: 'Huntley CUSD 158',
    usNewsNational: null,
    usNewsState: 80,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1210,
    note: 'Huntley High School ranks 80th in Illinois with a 96% graduation rate and 34% AP participation rate in an 8,500-student unit district.'
  },

  // ── INVERNESS ────────────────────────────────────────────────────────────
  'Inverness': {
    hs: 'William Fremd High School',
    district: 'Township HSD 211',
    usNewsNational: 397,
    usNewsState: 14,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 30, avgSAT: 1340,
    feedsTo: 'Township HSD 211',
    note: 'William Fremd ranks 14th in Illinois and #397 nationally; Township HSD 211 serves Palatine, Schaumburg, Inverness, and South Barrington.'
  },

  // ── ISLAND LAKE ──────────────────────────────────────────────────────────
  'Island Lake': {
    hs: 'Wauconda High School',
    district: 'Wauconda CUSD 118',
    usNewsNational: 3807,
    usNewsState: 140,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: null, avgSAT: 1180,
    feedsTo: 'Wauconda CUSD 118',
    note: 'Wauconda CUSD 118 serves Island Lake, Volo, and surrounding communities; Wauconda High School ranks 140th in Illinois with 43% math proficiency.'
  },

  // ── ITASCA ───────────────────────────────────────────────────────────────
  'Itasca': {
    hs: 'Lake Park High School',
    district: 'Lake Park CHSD 108',
    usNewsNational: 1864,
    usNewsState: 73,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 27, avgSAT: 1210,
    feedsTo: 'Lake Park CHSD 108',
    note: 'Lake Park CHSD 108 serves Itasca, Roselle, Bloomingdale, and Medinah; Lake Park ranks 73rd in Illinois with 60.4% ACT science proficiency.'
  },

  // ── JOHNSBURG ────────────────────────────────────────────────────────────
  'Johnsburg': {
    hs: 'Johnsburg High School',
    district: 'Johnsburg CUSD 12',
    usNewsNational: 5604,
    usNewsState: 202,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1170,
    note: 'Johnsburg CUSD 12 serves Johnsburg and Spring Grove with 1,696 students; Johnsburg High School ranks 202nd in Illinois with a 13:1 student-teacher ratio.'
  },

  // ── KILDEER ──────────────────────────────────────────────────────────────
  'Kildeer': {
    hs: 'Lake Zurich High School',
    district: 'Lake Zurich CUSD 95',
    usNewsNational: 829,
    usNewsState: 36,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: null, avgSAT: 1115,
    feedsTo: 'Lake Zurich CUSD 95',
    note: 'Kildeer Countryside CCSD 96 feeds students to Lake Zurich CUSD 95; Lake Zurich High School earned Exemplary on the 2024 Illinois Report Card.'
  },

  // ── KINGSBURY (IN) ───────────────────────────────────────────────────────
  'Kingsbury': {
    hs: 'LaPorte High School',
    feedsTo: 'La Porte Community School Corporation',
    usNewsNational: 4517,
    usNewsState: 95,
    stateGrade: null,
    niche: 'B', avgACT: 25, avgSAT: 1140,
    note: 'Kingsbury is served by La Porte Community School Corporation; LaPorte HS ranks 95th in Indiana with an 84% graduation rate.'
  },

  // ── KINGSFORD HEIGHTS (IN) ───────────────────────────────────────────────
  'Kingsford Heights': {
    hs: 'LaPorte High School',
    feedsTo: 'La Porte Community School Corporation',
    usNewsNational: 4517,
    usNewsState: 95,
    stateGrade: null,
    niche: 'B', avgACT: 25, avgSAT: 1140,
    note: 'Kingsford Heights is within the La Porte Community School Corporation; LaPorte HS ranks 95th in Indiana with 44% math proficiency vs. 39% state average.'
  },

  // ── KOUTS (IN) ───────────────────────────────────────────────────────────
  'Kouts': {
    hs: 'Kouts Middle/High School',
    usNewsNational: 4314,
    usNewsState: 92,
    stateGrade: null,
    niche: 'B+', avgACT: 24, avgSAT: 1150,
    note: 'Kouts Middle/High School ranks 92nd in Indiana within East Porter County School Corporation; district earns a B+ from Niche with 48% math and 56% reading proficiency.'
  },

  // ── LA CROSSE (IN) ───────────────────────────────────────────────────────
  'La Crosse': {
    hs: 'Tri-Township Jr.-Sr. High School',
    feedsTo: 'Tri-Township Consolidated School Corporation',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: null,
    niche: 'C+', avgACT: null, avgSAT: null,
    note: 'LaCrosse High School closed in 2022; students now attend Tri-Township Jr.-Sr. HS in Wanatah, ranked in the bottom tier in Indiana.'
  },

  // ── LA GRANGE ────────────────────────────────────────────────────────────
  'La Grange': {
    hs: 'Lyons Township High School',
    district: 'Lyons TWP HSD 204',
    usNewsNational: 884,
    usNewsState: 39,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1260,
    note: 'Lyons Township HSD 204 is headquartered in La Grange; LTHS ranks 39th in Illinois with a 54% AP participation rate and average ACT of 22.9.'
  },

  // ── LA GRANGE PARK ───────────────────────────────────────────────────────
  'La Grange Park': {
    hs: 'Lyons Township High School',
    district: 'Lyons TWP HSD 204',
    usNewsNational: 884,
    usNewsState: 39,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1260,
    feedsTo: 'Lyons TWP HSD 204',
    note: 'La Grange Park feeds into Lyons TWP HSD 204; LTHS ranks 39th in Illinois and achieved Commendable designation on the 2024-25 Illinois Report Card.'
  },

  // ── LA PORTE (IN) ────────────────────────────────────────────────────────
  'La Porte': {
    hs: 'LaPorte High School',
    usNewsNational: 4517,
    usNewsState: 95,
    stateGrade: null,
    niche: 'B', avgACT: 25, avgSAT: 1140,
    note: 'LaPorte HS ranks 95th in Indiana with 44% math proficiency and a graduation rate of 84%, below the 88% state average.'
  },

  // ── LAKE BARRINGTON ──────────────────────────────────────────────────────
  'Lake Barrington': {
    hs: 'Barrington High School',
    district: 'Barrington CUSD 220',
    usNewsNational: 548,
    usNewsState: 23,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 30, avgSAT: 1300,
    feedsTo: 'Barrington CUSD 220',
    note: 'Lake Barrington is within Barrington CUSD 220 boundaries; Barrington High School ranks 23rd in Illinois with 65% AP participation rate.'
  },

  // ── LAKE BLUFF ───────────────────────────────────────────────────────────
  'Lake Bluff': {
    hs: 'Lake Forest High School',
    district: 'Lake Forest CHSD 115',
    usNewsNational: 410,
    usNewsState: 16,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1320,
    feedsTo: 'Lake Forest CHSD 115',
    note: 'Lake Forest CHSD 115 serves Lake Forest and Lake Bluff; Lake Forest High School ranks 16th in Illinois with 99.4% four-year graduation rate.'
  },

  // ── LAKE FOREST ──────────────────────────────────────────────────────────
  'Lake Forest': {
    hs: 'Lake Forest High School',
    district: 'Lake Forest CHSD 115',
    usNewsNational: 410,
    usNewsState: 16,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1320,
    note: 'Lake Forest High School ranks 16th in Illinois with 65.6% SAT math proficiency and 68.3% SAT ELA proficiency; 11:1 student-teacher ratio.'
  },

  // ── LAKE IN THE HILLS ────────────────────────────────────────────────────
  'Lake In The Hills': {
    hs: 'Crystal Lake South High School',
    district: 'Community HSD 155',
    usNewsNational: null,
    usNewsState: 108,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 28, avgSAT: 1190,
    feedsTo: 'Community HSD 155',
    note: 'Lake in the Hills feeds into Community HSD 155; Crystal Lake South ranks 108th in Illinois and is among the top 14% of high schools nationally.'
  },

  // ── LAKE STATION (IN) ────────────────────────────────────────────────────
  'Lake Station': {
    hs: 'Thomas A. Edison Jr.-Sr. High School',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: null,
    niche: 'C+', avgACT: 20, avgSAT: 1030,
    note: 'Edison Jr.-Sr. HS (Lake Station Community Schools) ranks in the bottom tier in Indiana with 15% math proficiency and 75% of students economically disadvantaged.'
  },

  // ── LAKE VILLA ───────────────────────────────────────────────────────────
  'Lake Villa': {
    hs: 'Grant Community High School',
    district: 'Grant CHSD 124',
    usNewsNational: 3774,
    usNewsState: 136,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: null,
    feedsTo: 'Grant CHSD 124',
    note: 'Grant CHSD 124 serves Fox Lake, Lake Villa, and surrounding northern Lake County; Grant High School ranks 136th in Illinois with a 92.7% graduation rate.'
  },

  // ── LAKE ZURICH ──────────────────────────────────────────────────────────
  'Lake Zurich': {
    hs: 'Lake Zurich High School',
    district: 'Lake Zurich CUSD 95',
    usNewsNational: 829,
    usNewsState: 36,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: null, avgSAT: 1115,
    note: 'Lake Zurich High School earned Exemplary on the 2024 Illinois Report Card and was named a 2024 National Blue Ribbon School; ranks 36th in Illinois.'
  },

  // ── LAKEMOOR ─────────────────────────────────────────────────────────────
  'Lakemoor': {
    hs: 'McHenry Community High School',
    district: 'McHenry CHSD 156',
    usNewsNational: 6013,
    usNewsState: 210,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1150,
    feedsTo: 'McHenry CHSD 156',
    note: 'McHenry CHSD 156 received Commendable on the 2024 Illinois Report Card; McHenry ranks 210th in Illinois with engineering and culinary arts CTE programs.'
  },

  // ── LAKEWOOD ─────────────────────────────────────────────────────────────
  'Lakewood': {
    hs: 'Crystal Lake Central High School',
    district: 'Community HSD 155',
    usNewsNational: null,
    usNewsState: 102,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 28, avgSAT: 1210,
    feedsTo: 'Community HSD 155',
    note: 'Lakewood is primarily within Crystal Lake CCSD 47 and feeds into Community HSD 155; Crystal Lake Central ranks 102nd in Illinois.'
  },

  // ── LEMONT ───────────────────────────────────────────────────────────────
  'Lemont': {
    hs: 'Lemont High School',
    district: 'Lemont TWP HSD 210',
    usNewsNational: 1235,
    usNewsState: 50,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1240,
    note: 'Lemont High School ranks 50th in Illinois with a 53% AP participation rate; school is rated A+ on Niche and 10/10 on GreatSchools.'
  },

  // ── LIBERTYVILLE ─────────────────────────────────────────────────────────
  'Libertyville': {
    hs: 'Libertyville High School',
    district: 'Community HSD 128',
    usNewsNational: null,
    usNewsState: 21,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1310,
    note: 'Libertyville High School ranks 21st in Illinois; Community HSD 128 has 3,285 students with 61% math and 63% reading proficiency district-wide.'
  },

  // ── LINCOLNSHIRE ─────────────────────────────────────────────────────────
  'Lincolnshire': {
    hs: 'Adlai E. Stevenson High School',
    district: 'Adlai E. Stevenson HSD 125',
    usNewsNational: 203,
    usNewsState: 8,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1360,
    note: 'Stevenson was ranked No. 1 school district in the US by Niche; ranks 8th in Illinois with 73% math proficiency and serves 16+ communities including Lincolnshire and Buffalo Grove.'
  },

  // ── LINCOLNWOOD ──────────────────────────────────────────────────────────
  'Lincolnwood': {
    hs: 'Niles West High School',
    district: 'Niles TWP HSD 219',
    usNewsNational: null,
    usNewsState: 71,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1230,
    feedsTo: 'Niles TWP HSD 219',
    note: 'Niles TWP HSD 219 serves Lincolnwood, Skokie, and parts of Morton Grove and Niles; Niles West ranks 71st and Niles North 61st in Illinois.'
  },

  // ── LINDENHURST ──────────────────────────────────────────────────────────
  'Lindenhurst': {
    hs: 'Grant Community High School',
    district: 'Grant CHSD 124',
    usNewsNational: 3774,
    usNewsState: 136,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: null,
    feedsTo: 'Grant CHSD 124',
    note: 'Grant CHSD 124 serves Lake Villa SD 41 area communities including Lindenhurst; Grant High School ranks 136th in Illinois.'
  },

  // ── LISLE ────────────────────────────────────────────────────────────────
  'Lisle': {
    hs: 'Lisle High School',
    district: 'Lisle CUSD 202',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Exemplary',
    niche: 'A', avgACT: null, avgSAT: 1080,
    note: 'Lisle High School earned Exemplary designation from ISBE and ranked in the top 8% of Illinois high schools per US News; 94.1% graduation rate.'
  },

  // ── LOMBARD ──────────────────────────────────────────────────────────────
  'Lombard': {
    hs: 'Glenbard East High School',
    district: 'Glenbard TWP HSD 87',
    usNewsNational: null,
    usNewsState: 147,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1190,
    note: 'Glenbard East is the Lombard campus of Glenbard TWP HSD 87; ranks 147th in Illinois within a four-school district serving western DuPage suburbs.'
  },

  // ── LONG BEACH (IN) ──────────────────────────────────────────────────────
  'Long Beach': {
    hs: 'Michigan City High School',
    feedsTo: 'Michigan City Area Schools',
    usNewsNational: null,
    usNewsState: 238,
    stateGrade: null,
    niche: 'C+', avgACT: 24, avgSAT: 1090,
    note: 'Long Beach is served by Michigan City Area Schools; Michigan City HS ranks 238th in Indiana and houses one of the largest high school gymnasiums in the US (7,304 seats).'
  },

  // ── LONG GROVE ───────────────────────────────────────────────────────────
  'Long Grove': {
    hs: 'Adlai E. Stevenson High School',
    district: 'Adlai E. Stevenson HSD 125',
    usNewsNational: 203,
    usNewsState: 8,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1360,
    feedsTo: 'Adlai E. Stevenson HSD 125',
    note: 'Long Grove (Kildeer Countryside CCSD 96) feeds into Stevenson HSD 125; Stevenson ranks 8th in Illinois and was #1 US district per Niche.'
  },

  // ── LOWELL (IN) ──────────────────────────────────────────────────────────
  'Lowell': {
    hs: 'Lowell Senior High School',
    usNewsNational: 3600,
    usNewsState: 73,
    stateGrade: 'A',
    niche: 'B+', avgACT: null, avgSAT: 1120,
    note: 'Lowell Senior HS ranks 73rd in Indiana with a 99.1% graduation rate in 2023-24 and 43% AP participation rate; Tri-Creek School Corp earned an A in 2018 DOE grades.'
  },

  // ── LYONS ────────────────────────────────────────────────────────────────
  'Lyons': {
    hs: 'Lyons Township High School',
    district: 'Lyons TWP HSD 204',
    usNewsNational: 884,
    usNewsState: 39,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1260,
    feedsTo: 'Lyons TWP HSD 204',
    note: 'Lyons Township High School serves Lyons and other south Cook communities; LTHS ranks 39th in Illinois with 54% AP participation rate.'
  },

  // ── MANHATTAN ────────────────────────────────────────────────────────────
  'Manhattan': {
    hs: 'Lincoln-Way West High School',
    district: 'Lincoln-Way Community HSD 210',
    usNewsNational: 1730,
    usNewsState: 65,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28, avgSAT: 1200,
    feedsTo: 'Lincoln-Way Community HSD 210',
    note: 'Manhattan SD 114 is a K-8 district; students attend Lincoln-Way West in New Lenox, which ranks 65th in Illinois with 49% AP participation.'
  },

  // ── MARENGO ──────────────────────────────────────────────────────────────
  'Marengo': {
    hs: 'Marengo High School',
    district: 'Marengo CHSD 154',
    usNewsNational: 4663,
    usNewsState: 175,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1190,
    note: 'Marengo High School ranks 175th in Illinois with 30% AP participation rate; 689 students with a 14:1 student-teacher ratio.'
  },

  // ── MCHENRY ──────────────────────────────────────────────────────────────
  'McHenry': {
    hs: 'McHenry Community High School',
    district: 'McHenry CHSD 156',
    usNewsNational: 6013,
    usNewsState: 210,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1150,
    note: 'McHenry CHSD 156 received Commendable on the 2024 Illinois Report Card; serves McHenry and Wonder Lake area with diverse CTE program offerings.'
  },

  // ── MERRILLVILLE (IN) ────────────────────────────────────────────────────
  'Merrillville': {
    hs: 'Merrillville High School',
    usNewsNational: 7637,
    usNewsState: 179,
    stateGrade: null,
    niche: 'B-', avgACT: null, avgSAT: 1060,
    note: 'Merrillville HS ranks 179th in Indiana with a 93% graduation rate but only 20% AP participation rate and below-average test proficiency scores.'
  },

  // ── MICHIANA SHORES (IN) ─────────────────────────────────────────────────
  'Michiana Shores': {
    hs: 'Michigan City High School',
    feedsTo: 'Michigan City Area Schools',
    usNewsNational: null,
    usNewsState: 238,
    stateGrade: null,
    niche: 'C+', avgACT: 24, avgSAT: 1090,
    note: 'Michiana Shores is within the Michigan City Area Schools district; Michigan City HS ranks 238th in Indiana with 28% math and reading proficiency.'
  },

  // ── MICHIGAN CITY (IN) ───────────────────────────────────────────────────
  'Michigan City': {
    hs: 'Michigan City High School',
    usNewsNational: null,
    usNewsState: 238,
    stateGrade: null,
    niche: 'C+', avgACT: 24, avgSAT: 1090,
    note: 'Michigan City HS ranks 238th in Indiana with 28% math proficiency; formed by 1995 merger of Rogers and Elston high schools, now enrolling ~1,531 students.'
  },

  // ── MONTGOMERY ───────────────────────────────────────────────────────────
  'Montgomery': {
    hs: ['West Aurora High School', 'Oswego East High School'],
    district: ['Aurora West USD 129', 'CUSD 308'],
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 27, avgSAT: 1170,
    splitDistrict: true,
    note: 'Montgomery is split across multiple districts including West Aurora SD 129 and Oswego CUSD 308; Oswego East ranks 88th in Illinois.'
  },

  // ── MORTON GROVE ─────────────────────────────────────────────────────────
  'Morton Grove': {
    hs: 'Niles West High School',
    district: 'Niles TWP HSD 219',
    usNewsNational: null,
    usNewsState: 71,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1230,
    feedsTo: 'Niles TWP HSD 219',
    note: 'Parts of Morton Grove feed into Niles TWP HSD 219; Niles West ranks 71st in Illinois, district ranked 6th in Illinois and 33rd in the US per Niche.'
  },

  // ── MOUNT PROSPECT ───────────────────────────────────────────────────────
  'Mount Prospect': {
    hs: 'Prospect High School',
    district: 'Township HSD 214',
    usNewsNational: null,
    usNewsState: 25,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1270,
    note: 'Prospect High School in Mount Prospect ranks 25th in Illinois within Township HSD 214, one of the top multi-school districts in the northwest suburbs.'
  },

  // ── MUNDELEIN ────────────────────────────────────────────────────────────
  'Mundelein': {
    hs: 'Mundelein Consolidated High School',
    district: 'Mundelein Cons HSD 120',
    usNewsNational: 3290,
    usNewsState: 119,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1160,
    note: 'Mundelein Cons High School ranked in Niche Top 100 high schools for three consecutive years; ranks 119th in Illinois with 89% graduation rate.'
  },

  // ── MUNSTER (IN) ─────────────────────────────────────────────────────────
  'Munster': {
    hs: 'Munster High School',
    usNewsNational: 596,
    usNewsState: 9,
    stateGrade: 'A',
    niche: 'A+', avgACT: null, avgSAT: 1240,
    note: 'Munster HS ranks 9th in Indiana and #596 nationally (2025-26 US News); School Town of Munster is ranked #4 Best School District in Indiana by Niche.'
  },

  // ── NAPERVILLE ───────────────────────────────────────────────────────────
  'Naperville': {
    hs: ['Naperville North High School', 'Naperville Central High School'],
    district: ['Naperville CUSD 203', 'Naperville CUSD 203'],
    usNewsNational: null,
    usNewsState: 18,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: null, avgSAT: 1310,
    splitDistrict: false,
    note: 'Naperville CUSD 203 is ranked A+ by Niche and top 10 in Illinois; Naperville North earned Exemplary on 2024 Illinois Report Card, all D203 high schools rank in Illinois top 25.'
  },

  // ── NEW CHICAGO (IN) ─────────────────────────────────────────────────────
  'New Chicago': {
    hs: 'River Forest Jr.-Sr. High School',
    feedsTo: 'River Forest Community School Corporation',
    usNewsNational: 11832,
    usNewsState: 275,
    stateGrade: null,
    niche: 'C', avgACT: null, avgSAT: 1030,
    note: 'New Chicago feeds to River Forest Community School Corp; River Forest Jr.-Sr. HS ranks 275th in Indiana with 71% minority enrollment.'
  },

  // ── NILES ────────────────────────────────────────────────────────────────
  'Niles': {
    hs: 'Niles North High School',
    district: 'Niles TWP HSD 219',
    usNewsNational: null,
    usNewsState: 61,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1220,
    note: 'Niles North ranks 61st in Illinois; Niles TWP HSD 219 serves Skokie, Lincolnwood, and parts of Morton Grove and Niles with 12:1 student-teacher ratio.'
  },

  // ── NORRIDGE ─────────────────────────────────────────────────────────────
  'Norridge': {
    hs: ['Maine East High School', 'Ridgewood Community High School'],
    district: ['Maine TWP HSD 207', 'Ridgewood CHSD 234'],
    usNewsNational: null,
    usNewsState: 117,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1175,
    splitDistrict: true,
    note: 'Norridge is split between Maine TWP HSD 207 (Maine East, ranked 117th) and Ridgewood CHSD 234 (ranked 162nd) depending on residential boundary.'
  },

  // ── NORTH AURORA ─────────────────────────────────────────────────────────
  'North Aurora': {
    hs: 'West Aurora High School',
    district: 'Aurora West USD 129',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1130,
    feedsTo: 'Aurora West USD 129',
    note: 'North Aurora is within Aurora West USD 129 boundaries; West Aurora High School serves Aurora, North Aurora, and Montgomery with approximately 11,000 district students.'
  },

  // ── NORTHBROOK ───────────────────────────────────────────────────────────
  'Northbrook': {
    hs: 'Glenbrook North High School',
    district: 'Glenbrook HSD 225',
    usNewsNational: 475,
    usNewsState: 20,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 30, avgSAT: 1330,
    note: 'Glenbrook HSD 225 was ranked No. 2 school district in the US by Niche; Glenbrook North ranks 20th in Illinois with 80% math and 84% reading proficiency.'
  },

  // ── NORTHFIELD ───────────────────────────────────────────────────────────
  'Northfield': {
    hs: 'New Trier Township High School',
    district: 'New Trier TWP HSD 203',
    usNewsNational: 371,
    usNewsState: 13,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: 27.5, avgSAT: 1204,
    feedsTo: 'New Trier TWP HSD 203',
    note: 'New Trier HSD 203 freshman campus is located in Northfield; New Trier received Exemplary designation and ranks 13th in Illinois with 97% graduation rate.'
  },

  // ── NORTHLAKE ────────────────────────────────────────────────────────────
  'Northlake': {
    hs: ['Proviso West High School', 'West Leyden High School'],
    district: ['Proviso TWP HSD 209', 'Leyden CHSD 212'],
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 22.5, avgSAT: 1050,
    splitDistrict: true,
    note: 'Northlake straddles the Proviso 209 and Leyden 212 boundary; Proviso West and West Leyden both serve portions of Northlake depending on residential address.'
  },

  // ── OAK BROOK ────────────────────────────────────────────────────────────
  'Oak Brook': {
    hs: 'Hinsdale Central High School',
    district: 'Hinsdale TWP HSD 86',
    usNewsNational: null,
    usNewsState: 9,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: 27.7, avgSAT: 1249,
    feedsTo: 'Hinsdale TWP HSD 86',
    note: 'Oak Brook feeds into Hinsdale TWP HSD 86; Hinsdale Central ranks 9th in Illinois with Exemplary designation on the 2024 Illinois Report Card.'
  },

  // ── OAK PARK ─────────────────────────────────────────────────────────────
  'Oak Park': {
    hs: 'Oak Park and River Forest High School',
    district: 'Oak Park - River Forest SD 200',
    usNewsNational: 793,
    usNewsState: 34,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 29, avgSAT: 1270,
    note: 'OPRF received Commendable on the 2024 Illinois Report Card with a 95.4% graduation rate; ranks 34th in Illinois with 60% AP participation.'
  },

  // ── OGDEN DUNES (IN) ─────────────────────────────────────────────────────
  'Ogden Dunes': {
    hs: 'Portage High School',
    feedsTo: 'Portage Township Schools',
    usNewsNational: 11126,
    usNewsState: 264,
    stateGrade: null,
    niche: 'B-', avgACT: 25, avgSAT: 1100,
    note: 'Ogden Dunes is within Portage Township Schools boundaries; Portage HS ranks 264th in Indiana with 21% AP participation rate.'
  },

  // ── OSWEGO ───────────────────────────────────────────────────────────────
  'Oswego': {
    hs: ['Oswego High School', 'Oswego East High School'],
    district: ['CUSD 308', 'CUSD 308'],
    usNewsNational: null,
    usNewsState: 179,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 27, avgSAT: 1210,
    splitDistrict: false,
    note: 'Oswego CUSD 308 has 16,851 students across two high schools; Oswego East ranks 88th and Oswego High 179th in Illinois per US News 2024.'
  },

  // ── PALATINE ─────────────────────────────────────────────────────────────
  'Palatine': {
    hs: ['Palatine High School', 'William Fremd High School'],
    district: ['Township HSD 211', 'Township HSD 211'],
    usNewsNational: null,
    usNewsState: 101,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28.5, avgSAT: 1265,
    splitDistrict: false,
    note: 'Township HSD 211 serves Palatine, Schaumburg, and Inverness; Fremd ranks 14th in Illinois at #397 nationally while Palatine ranks 101st.'
  },

  // ── PALOS HEIGHTS ────────────────────────────────────────────────────────
  'Palos Heights': {
    hs: 'Carl Sandburg High School',
    district: 'Cons HSD 230',
    usNewsNational: null,
    usNewsState: 64,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28, avgSAT: 1200,
    feedsTo: 'Cons HSD 230',
    note: 'Consolidated HSD 230 serves Palos Heights, Palos Hills, Palos Park, and Orland Park; Carl Sandburg ranks 64th in Illinois and all three D230 schools earned Commendable.'
  },

  // ── PALOS HILLS ──────────────────────────────────────────────────────────
  'Palos Hills': {
    hs: 'Amos Alonzo Stagg High School',
    district: 'Cons HSD 230',
    usNewsNational: null,
    usNewsState: 99,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 27, avgSAT: 1180,
    note: 'Consolidated HSD 230 serves the south suburban Palos area; Stagg ranks 99th in Illinois and all three D230 schools earned Commendable on 2024-25 Illinois Report Card.'
  },

  // ── PALOS PARK ───────────────────────────────────────────────────────────
  'Palos Park': {
    hs: 'Carl Sandburg High School',
    district: 'Cons HSD 230',
    usNewsNational: null,
    usNewsState: 64,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28, avgSAT: 1200,
    feedsTo: 'Cons HSD 230',
    note: 'Consolidated HSD 230 serves Palos Park among other south Cook communities; Sandburg ranks 64th in Illinois and narrowly missed Exemplary threshold in 2024.'
  },

  // ── PARK RIDGE ───────────────────────────────────────────────────────────
  'Park Ridge': {
    hs: 'Maine South High School',
    district: 'Maine TWP HSD 207',
    usNewsNational: 579,
    usNewsState: 24,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1260,
    note: 'Maine South ranks 24th in Illinois with 72% AP participation rate; Maine TWP HSD 207 is headquartered in Park Ridge with 6,272 students.'
  },

  // ── PEOTONE ──────────────────────────────────────────────────────────────
  'Peotone': {
    hs: 'Peotone High School',
    district: 'Peotone CUSD 207U',
    usNewsNational: 10605,
    usNewsState: 333,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 27, avgSAT: 1110,
    note: 'Peotone CUSD 207U is a small rural district with 443 high school students; 25% AP participation rate and 12:1 student-teacher ratio.'
  },

  // ── PINGREE GROVE ────────────────────────────────────────────────────────
  'Pingree Grove': {
    hs: 'Harry D. Jacobs High School',
    district: 'CUSD 300',
    usNewsNational: 2104,
    usNewsState: 78,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 26, avgSAT: 1170,
    feedsTo: 'CUSD 300',
    note: 'Pingree Grove is primarily within CUSD 300; Jacobs High School ranks 78th in Illinois serving Algonquin and surrounding Kane County communities.'
  },

  // ── PLAINFIELD ───────────────────────────────────────────────────────────
  'Plainfield': {
    hs: ['Plainfield North High School', 'Plainfield East High School', 'Plainfield South High School', 'Plainfield High School'],
    district: ['Plainfield SD 202', 'Plainfield SD 202', 'Plainfield SD 202', 'Plainfield SD 202'],
    usNewsNational: null,
    usNewsState: 114,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 26, avgSAT: 1193,
    splitDistrict: false,
    note: 'Plainfield SD 202 is one of the largest districts in Illinois with 24,556 students and four high schools; Plainfield North ranks 114th in Illinois.'
  },

  // ── PLANO ────────────────────────────────────────────────────────────────
  'Plano': {
    hs: 'Plano High School',
    district: 'Plano CUSD 88',
    usNewsNational: 11630,
    usNewsState: 366,
    stateGrade: 'Commendable',
    niche: 'B-', avgACT: null, avgSAT: null,
    note: 'Plano CUSD 88 is a small Kendall County district; Plano High School ranks 366th in Illinois with 32% AP participation and 68% minority enrollment.'
  },

  // ── PORTAGE (IN) ─────────────────────────────────────────────────────────
  'Portage': {
    hs: 'Portage High School',
    usNewsNational: 11126,
    usNewsState: 264,
    stateGrade: null,
    niche: 'B-', avgACT: 25, avgSAT: 1100,
    note: 'Portage HS ranks 264th in Indiana with 50% minority enrollment and 21% AP participation rate within Portage Township Schools.'
  },

  // ── PORTER (IN) ──────────────────────────────────────────────────────────
  'Porter': {
    hs: 'Chesterton Senior High School',
    feedsTo: 'Duneland School Corporation',
    usNewsNational: 3029,
    usNewsState: 56,
    stateGrade: null,
    niche: 'A', avgACT: 28, avgSAT: 1210,
    note: 'Porter is part of the Duneland School Corporation; students attend Chesterton Senior HS, ranked 56th in Indiana with an A district grade from Niche.'
  },

  // ── POTTAWATTAMIE PARK (IN) ──────────────────────────────────────────────
  'Pottawattamie Park': {
    hs: 'Michigan City High School',
    feedsTo: 'Michigan City Area Schools',
    usNewsNational: null,
    usNewsState: 238,
    stateGrade: null,
    niche: 'C+', avgACT: 24, avgSAT: 1090,
    note: 'Pottawattamie Park is within Michigan City Area Schools; students attend Michigan City HS, ranked 238th in Indiana.'
  },

  // ── PROSPECT HEIGHTS ─────────────────────────────────────────────────────
  'Prospect Heights': {
    hs: ['John Hersey High School', 'Wheeling High School'],
    district: ['Township HSD 214', 'Township HSD 214'],
    usNewsNational: 404,
    usNewsState: 15,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1225,
    splitDistrict: true,
    note: 'Prospect Heights is split between Hersey (ranked 15th in Illinois, 2024 National Blue Ribbon School) and Wheeling attendance zones within Township HSD 214.'
  },

  // ── RIVER FOREST ─────────────────────────────────────────────────────────
  'River Forest': {
    hs: 'Oak Park and River Forest High School',
    district: 'Oak Park - River Forest SD 200',
    usNewsNational: 793,
    usNewsState: 34,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 29, avgSAT: 1270,
    note: 'River Forest shares OPRF High School with Oak Park; OPRF ranks 34th in Illinois with 95.4% graduation rate and Commendable designation on 2024 Report Card.'
  },

  // ── RIVER GROVE ──────────────────────────────────────────────────────────
  'River Grove': {
    hs: 'East Leyden High School',
    district: 'Leyden CHSD 212',
    usNewsNational: null,
    usNewsState: 173,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1120,
    note: 'Leyden CHSD 212 serves River Grove, Franklin Park, Rosemont, and Schiller Park; East Leyden ranks 173rd in Illinois with 3,527 district students.'
  },

  // ── RIVERSIDE ────────────────────────────────────────────────────────────
  'Riverside': {
    hs: 'Riverside Brookfield Township High School',
    district: 'Riverside-Brookfield TWP SD 208',
    usNewsNational: 983,
    usNewsState: 42,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: null, avgSAT: 1210,
    note: 'RBHS earned Exemplary on the Illinois Report Card for the 2nd consecutive year in 2024; ranks 42nd in Illinois with 71% AP participation rate.'
  },

  // ── RIVERWOODS ───────────────────────────────────────────────────────────
  'Riverwoods': {
    hs: 'Deerfield High School',
    district: 'Township HSD 113',
    usNewsNational: 437,
    usNewsState: 18,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 30, avgSAT: 1340,
    feedsTo: 'Township HSD 113',
    note: 'Riverwoods is a small Lake County community that feeds into Township HSD 113; Deerfield High School ranks 18th in Illinois with A+ district Niche grade.'
  },

  // ── ROLLING MEADOWS ──────────────────────────────────────────────────────
  'Rolling Meadows': {
    hs: 'Rolling Meadows High School',
    district: 'Township HSD 214',
    usNewsNational: null,
    usNewsState: 81,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: null,
    note: 'Rolling Meadows High School ranks 81st in Illinois within Township HSD 214; the district serves six northwest suburbs with 53% math proficiency.'
  },

  // ── ROSELLE ──────────────────────────────────────────────────────────────
  'Roselle': {
    hs: 'Lake Park High School',
    district: 'Lake Park CHSD 108',
    usNewsNational: 1864,
    usNewsState: 73,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 27, avgSAT: 1210,
    note: 'Lake Park High School is headquartered in Roselle and ranks 73rd in Illinois; 2,522 students with 58.4% ACT math proficiency in 2024-25.'
  },

  // ── ROUND LAKE ───────────────────────────────────────────────────────────
  'Round Lake': {
    hs: 'Round Lake Senior High School',
    district: 'Round Lake CUSD 116',
    usNewsNational: 9898,
    usNewsState: 315,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: null, avgSAT: null,
    note: 'Round Lake CUSD 116 serves a highly diverse community with 91% minority enrollment at the high school; 21% AP participation rate.'
  },

  // ── ROUND LAKE BEACH ─────────────────────────────────────────────────────
  'Round Lake Beach': {
    hs: 'Round Lake Senior High School',
    district: 'Round Lake CUSD 116',
    usNewsNational: 9898,
    usNewsState: 315,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: null, avgSAT: null,
    feedsTo: 'Round Lake CUSD 116',
    note: 'Round Lake Beach is within Round Lake CUSD 116; Round Lake Senior High School ranks 315th in Illinois with 7% math and 9% reading proficiency district-wide.'
  },

  // ── ROUND LAKE PARK ──────────────────────────────────────────────────────
  'Round Lake Park': {
    hs: 'Round Lake Senior High School',
    district: 'Round Lake CUSD 116',
    usNewsNational: 9898,
    usNewsState: 315,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: null, avgSAT: null,
    feedsTo: 'Round Lake CUSD 116',
    note: 'Round Lake Park is within Round Lake CUSD 116; the district serves approximately 6,190 students with a 12:1 student-teacher ratio.'
  },

  // ── SCHAUMBURG ───────────────────────────────────────────────────────────
  'Schaumburg': {
    hs: 'Schaumburg High School',
    district: 'Township HSD 211',
    usNewsNational: 1157,
    usNewsState: 47,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1250,
    note: 'Township HSD 211 serves Schaumburg, Palatine, and Inverness area; Schaumburg High ranks 47th in Illinois with William Fremd the top-ranked at 14th statewide.'
  },

  // ── SCHERERVILLE (IN) ────────────────────────────────────────────────────
  'Schererville': {
    hs: 'Lake Central High School',
    feedsTo: 'Lake Central School Corporation',
    usNewsNational: 1705,
    usNewsState: 27,
    stateGrade: 'A',
    niche: 'A', avgACT: 28, avgSAT: 1190,
    note: 'Almost all of Schererville is served by Lake Central School Corporation; Lake Central HS ranks 27th in Indiana with 2,992 students and a $160M rebuilt campus (2011-2016).'
  },

  // ── SCHNEIDER (IN) ───────────────────────────────────────────────────────
  'Schneider': {
    hs: 'Lowell Senior High School',
    feedsTo: 'Tri-Creek School Corporation',
    usNewsNational: 3600,
    usNewsState: 73,
    stateGrade: 'A',
    niche: 'B+', avgACT: null, avgSAT: 1120,
    note: 'Schneider is within the Tri-Creek School Corporation; students attend Lowell Senior HS, ranked 73rd in Indiana with a 99.1% graduation rate.'
  },

  // ── SOUTH BARRINGTON ─────────────────────────────────────────────────────
  'South Barrington': {
    hs: 'William Fremd High School',
    district: 'Township HSD 211',
    usNewsNational: 397,
    usNewsState: 14,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 30, avgSAT: 1340,
    feedsTo: 'Township HSD 211',
    note: 'South Barrington feeds into Township HSD 211; William Fremd ranks 14th in Illinois and #397 nationally, highest-ranked school in the district.'
  },

  // ── SOUTH ELGIN ──────────────────────────────────────────────────────────
  'South Elgin': {
    hs: 'South Elgin High School',
    district: 'School District U-46',
    usNewsNational: null,
    usNewsState: 149,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: null,
    note: 'South Elgin High School ranks 149th in Illinois within U-46, the second-largest district in the state; school opened to serve the growing South Elgin community.'
  },

  // ── SPRING GROVE ─────────────────────────────────────────────────────────
  'Spring Grove': {
    hs: 'Johnsburg High School',
    district: 'Johnsburg CUSD 12',
    usNewsNational: 5604,
    usNewsState: 202,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1170,
    feedsTo: 'Johnsburg CUSD 12',
    note: 'Spring Grove elementary students feed into Johnsburg CUSD 12; Johnsburg High School ranks 202nd in Illinois with a 1,696-student district.'
  },

  // ── ST. CHARLES ──────────────────────────────────────────────────────────
  'St. Charles': {
    hs: ['St. Charles North High School', 'St. Charles East High School'],
    district: ['St. Charles CUSD 303', 'St. Charles CUSD 303'],
    usNewsNational: 1315,
    usNewsState: 52,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1245,
    splitDistrict: false,
    note: 'St. Charles CUSD 303 has 11,731 students with 66% math and 77% reading proficiency; St. Charles North ranks 52nd and East 60th in Illinois.'
  },

  // ── ST. JOHN (IN) ────────────────────────────────────────────────────────
  'St. John': {
    hs: 'Lake Central High School',
    usNewsNational: 1705,
    usNewsState: 27,
    stateGrade: 'A',
    niche: 'A', avgACT: 28, avgSAT: 1190,
    note: 'Lake Central HS (in St. John) ranks 27th in Indiana and #1,705 nationally; the 2,992-student campus received a $160M renovation completed in 2016.'
  },

  // ── STREAMWOOD ───────────────────────────────────────────────────────────
  'Streamwood': {
    hs: 'Streamwood High School',
    district: 'School District U-46',
    usNewsNational: null,
    usNewsState: 235,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1040,
    note: 'Streamwood High School is one of five U-46 high schools; ranks 235th in Illinois within the second-largest school district in the state.'
  },

  // ── SUGAR GROVE ──────────────────────────────────────────────────────────
  'Sugar Grove': {
    hs: 'Kaneland Senior High School',
    district: 'Kaneland CUSD 302',
    usNewsNational: 4603,
    usNewsState: 172,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: null,
    feedsTo: 'Kaneland CUSD 302',
    note: 'Sugar Grove is within Kaneland CUSD 302; Kaneland Senior High School ranks 172nd in Illinois with a 95.9% graduation rate.'
  },

  // ── TRAIL CREEK (IN) ─────────────────────────────────────────────────────
  'Trail Creek': {
    hs: 'Michigan City High School',
    feedsTo: 'Michigan City Area Schools',
    usNewsNational: null,
    usNewsState: 238,
    stateGrade: null,
    niche: 'C+', avgACT: 24, avgSAT: 1090,
    note: 'Trail Creek is covered by Michigan City Area Schools; students attend Michigan City HS, ranked 238th in Indiana with 28% math proficiency.'
  },

  // ── VALPARAISO (IN) ──────────────────────────────────────────────────────
  'Valparaiso': {
    hs: 'Valparaiso High School',
    usNewsNational: 1148,
    usNewsState: 17,
    stateGrade: 'A',
    niche: 'A', avgACT: 28, avgSAT: 1210,
    note: 'Valparaiso HS ranks 17th in Indiana with a 99% graduation rate, average SAT score of 1210, and 59% math proficiency vs. 39% state average.'
  },

  // ── VERNON HILLS ─────────────────────────────────────────────────────────
  'Vernon Hills': {
    hs: 'Vernon Hills High School',
    district: 'Community HSD 128',
    usNewsNational: null,
    usNewsState: 11,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: null,
    note: 'Vernon Hills High School ranks 11th in Illinois; Community HSD 128 has 3,285 students with 61% math and 63% reading proficiency district-wide.'
  },

  // ── VILLA PARK ───────────────────────────────────────────────────────────
  'Villa Park': {
    hs: 'Willowbrook High School',
    district: 'DuPage HSD 88',
    usNewsNational: 3107,
    usNewsState: 110,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 26, avgSAT: 1180,
    note: 'Willowbrook High School ranks 110th in Illinois with a 92% graduation rate; DuPage HSD 88 serves Villa Park and Addison with 1,952 students.'
  },

  // ── VOLO ─────────────────────────────────────────────────────────────────
  'Volo': {
    hs: 'Wauconda High School',
    district: 'Wauconda CUSD 118',
    usNewsNational: 3807,
    usNewsState: 140,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: null, avgSAT: 1180,
    feedsTo: 'Wauconda CUSD 118',
    note: 'Volo is within Wauconda CUSD 118 boundaries; Wauconda High School ranks 140th in Illinois and serves the growing Lake County community.'
  },

  // ── WANATAH (IN) ─────────────────────────────────────────────────────────
  'Wanatah': {
    hs: 'Tri-Township Jr.-Sr. High School',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: null,
    niche: 'C+', avgACT: null, avgSAT: null,
    note: 'Wanatah is served by Tri-Township Consolidated School Corporation; Tri-Township Jr.-Sr. HS ranks in the bottom tier (309-395th in Indiana) with 305 total district students.'
  },

  // ── WARRENVILLE ──────────────────────────────────────────────────────────
  'Warrenville': {
    hs: 'Wheaton Warrenville South High School',
    district: 'CUSD 200',
    usNewsNational: null,
    usNewsState: 69,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 28, avgSAT: 1250,
    feedsTo: 'CUSD 200',
    note: 'CUSD 200 serves Wheaton and Warrenville with 11,639 students; Wheaton Warrenville South ranks 69th in Illinois with 60% math and 75% reading proficiency.'
  },

  // ── WAUCONDA ─────────────────────────────────────────────────────────────
  'Wauconda': {
    hs: 'Wauconda High School',
    district: 'Wauconda CUSD 118',
    usNewsNational: 3807,
    usNewsState: 140,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: null, avgSAT: 1180,
    note: 'Wauconda High School ranks 140th in Illinois; Wauconda CUSD 118 has 4,186 students with 43% math and 56% reading proficiency per 2024-25 data.'
  },

  // ── WEST CHICAGO ─────────────────────────────────────────────────────────
  'West Chicago': {
    hs: 'West Chicago Community High School',
    district: 'Community HSD 94',
    usNewsNational: 6395,
    usNewsState: 220,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 27, avgSAT: 1140,
    note: 'West Chicago Community High School ranks 220th in Illinois with 28% AP participation; Community HSD 94 serves 2,074 students with 18% math proficiency.'
  },

  // ── WEST DUNDEE ──────────────────────────────────────────────────────────
  'West Dundee': {
    hs: 'Dundee-Crown High School',
    district: 'CUSD 300',
    usNewsNational: 6897,
    usNewsState: 232,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 25, avgSAT: 1120,
    feedsTo: 'CUSD 300',
    note: 'West Dundee is within CUSD 300 boundaries and feeds into Dundee-Crown High School; the large district spans multiple northwest suburban communities.'
  },

  // ── WESTCHESTER ──────────────────────────────────────────────────────────
  'Westchester': {
    hs: 'Proviso West High School',
    district: 'Proviso TWP HSD 209',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 22, avgSAT: 980,
    feedsTo: 'Proviso TWP HSD 209',
    note: 'Westchester is served by Proviso TWP HSD 209; Proviso Math & Science Academy within the district ranks 84th in Illinois.'
  },

  // ── WESTERN SPRINGS ──────────────────────────────────────────────────────
  'Western Springs': {
    hs: 'Lyons Township High School',
    district: 'Lyons TWP HSD 204',
    usNewsNational: 884,
    usNewsState: 39,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1260,
    feedsTo: 'Lyons TWP HSD 204',
    note: 'Western Springs is among the communities served by Lyons TWP HSD 204; LTHS ranks 39th in Illinois with 54% AP participation rate.'
  },

  // ── WESTMONT ─────────────────────────────────────────────────────────────
  'Westmont': {
    hs: 'Westmont High School',
    district: 'Community USD 201',
    usNewsNational: 815,
    usNewsState: 35,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 990,
    note: 'Westmont High School ranks 35th in Illinois with 72% math and 79% reading proficiency; rated #1 in Illinois on the 2024 5Essentials Survey with 67% AP participation.'
  },

  // ── WESTVILLE (IN) ───────────────────────────────────────────────────────
  'Westville': {
    hs: 'Westville High School',
    usNewsNational: 5180,
    usNewsState: 110,
    stateGrade: null,
    niche: 'B-', avgACT: null, avgSAT: 1140,
    note: 'Westville HS ranks 110th in Indiana per US News (42nd per SchoolDigger 2024-25), showing strong recent improvement from 252nd in 2020-21.'
  },

  // ── WHEATON ──────────────────────────────────────────────────────────────
  'Wheaton': {
    hs: 'Wheaton Warrenville South High School',
    district: 'CUSD 200',
    usNewsNational: null,
    usNewsState: 69,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 28, avgSAT: 1250,
    note: 'CUSD 200 is the largest unit district in DuPage County with 11,639 students; Wheaton Warrenville South ranks 69th in Illinois with 90% of staff holding master\'s degrees.'
  },

  // ── WHEELING ─────────────────────────────────────────────────────────────
  'Wheeling': {
    hs: 'Wheeling High School',
    district: 'Township HSD 214',
    usNewsNational: 4678,
    usNewsState: 176,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: null, avgSAT: 1160,
    note: 'Wheeling High School ranks 176th in Illinois within Township HSD 214; the six-school district serves all of northwest suburban Cook County.'
  },

  // ── WHITING (IN) ─────────────────────────────────────────────────────────
  'Whiting': {
    hs: 'Whiting High School',
    usNewsNational: 6902,
    usNewsState: 156,
    stateGrade: null,
    niche: 'B-', avgACT: null, avgSAT: null,
    note: 'Whiting HS ranks 156th in Indiana with 422 students; 28% math proficiency and 39% reading proficiency per state test scores.'
  },

  // ── WILLOWBROOK ──────────────────────────────────────────────────────────
  'Willowbrook': {
    hs: ['Hinsdale Central High School', 'Hinsdale South High School'],
    district: ['Hinsdale TWP HSD 86', 'Hinsdale TWP HSD 86'],
    usNewsNational: null,
    usNewsState: 9,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: 28.3, avgSAT: 1305,
    splitDistrict: true,
    note: 'Willowbrook (DuPage village) is split within Hinsdale TWP HSD 86; Hinsdale Central ranks 9th in Illinois with Exemplary designation on the 2024 Report Card.'
  },

  // ── WILMETTE ─────────────────────────────────────────────────────────────
  'Wilmette': {
    hs: 'New Trier Township High School',
    district: 'New Trier TWP HSD 203',
    usNewsNational: 371,
    usNewsState: 13,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: 27.5, avgSAT: 1204,
    feedsTo: 'New Trier TWP HSD 203',
    note: 'Wilmette is one of the primary feeder communities for New Trier TWP HSD 203; New Trier received Exemplary designation and ranks 13th in Illinois.'
  },

  // ── WINFIELD (disambiguation) ─────────────────────────────────────────────
  // Key 'Winfield' = the IL suburb (DuPage County)
  // Key 'Winfield (IN)' = the IN suburb (Porter County, Crown Point schools)
  'Winfield': {
    hs: 'Wheaton Warrenville South High School',
    district: 'CUSD 200',
    usNewsNational: null,
    usNewsState: 69,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: 28, avgSAT: 1250,
    feedsTo: 'CUSD 200',
    note: 'Winfield (IL) is within CUSD 200 boundaries; Wheaton Warrenville South ranks 69th in Illinois in a district where 60% of students are proficient in math.'
  },
  'Winfield (IN)': {
    hs: 'Crown Point High School',
    feedsTo: 'Crown Point Community School Corporation',
    usNewsNational: 2054,
    usNewsState: 32,
    stateGrade: 'A',
    niche: 'A', avgACT: 26, avgSAT: 1200,
    note: 'Winfield feeds to Crown Point Community School Corporation; Crown Point HS ranks 32nd in Indiana and earned an A in the 2018 Indiana DOE accountability grades.'
  },

  // ── WINNETKA ─────────────────────────────────────────────────────────────
  'Winnetka': {
    hs: 'New Trier Township High School',
    district: 'New Trier TWP HSD 203',
    usNewsNational: 371,
    usNewsState: 13,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: 27.5, avgSAT: 1204,
    note: 'Winnetka is the home campus of New Trier TWP HSD 203; received Exemplary on 2024-25 Illinois Report Card with Grammy Award-winning music program and 30 AP classes.'
  },

  // ── WINTHROP HARBOR ──────────────────────────────────────────────────────
  'Winthrop Harbor': {
    hs: 'Waukegan High School',
    district: 'Waukegan CUSD 60',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: null, avgSAT: null,
    feedsTo: 'Waukegan CUSD 60',
    note: 'Winthrop Harbor is in northern Lake County and feeds into Waukegan CUSD 60; Waukegan High received Commendable in 2024-25 with four straight years of graduation rate gains.'
  },

  // ── WONDER LAKE ──────────────────────────────────────────────────────────
  'Wonder Lake': {
    hs: ['McHenry Community High School', 'Woodstock High School'],
    district: ['McHenry CHSD 156', 'Woodstock CUSD 200'],
    usNewsNational: null,
    usNewsState: 210,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: 1150,
    splitDistrict: true,
    note: 'Wonder Lake is split: the east side feeds McHenry CHSD 156 (210th in Illinois) and the west side feeds Woodstock CUSD 200 (Woodstock High, 57th in Illinois).'
  },

  // ── WOOD DALE ────────────────────────────────────────────────────────────
  'Wood Dale': {
    hs: 'Fenton High School',
    district: 'Fenton CHSD 100',
    usNewsNational: 5304,
    usNewsState: 190,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: null, avgSAT: null,
    feedsTo: 'Fenton CHSD 100',
    note: 'Wood Dale feeds into Fenton CHSD 100; Fenton High School earned Commendable on the 2024 Illinois Report Card with 33% AP participation rate.'
  },

  // ── WOODRIDGE ────────────────────────────────────────────────────────────
  'Woodridge': {
    hs: 'Downers Grove South High School',
    district: 'Community HSD 99',
    usNewsNational: null,
    usNewsState: 103,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 28, avgSAT: 1210,
    feedsTo: 'Community HSD 99',
    note: 'Parts of Woodridge feed into Community HSD 99; DG South ranks 103rd in Illinois while DG North ranks ~50th, both designated Commendable in 2024.'
  },

  // ── WOODSTOCK ────────────────────────────────────────────────────────────
  'Woodstock': {
    hs: ['Woodstock High School', 'Woodstock North High School'],
    district: ['Woodstock CUSD 200', 'Woodstock CUSD 200'],
    usNewsNational: null,
    usNewsState: 57,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 26, avgSAT: 1160,
    splitDistrict: false,
    note: 'Woodstock CUSD 200 has two high schools; Woodstock High ranks 57th and Woodstock North ranks 98th in Illinois, both in top 14% nationally per US News.'
  },

  // ── YORKVILLE ────────────────────────────────────────────────────────────
  'Yorkville': {
    hs: 'Yorkville High School',
    district: 'Yorkville CUSD 115',
    usNewsNational: 4884,
    usNewsState: 181,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 26, avgSAT: 1160,
    note: 'Yorkville High School ranks 181st in Illinois with a 95.9% graduation rate; Yorkville CUSD 115 has 7,119 students with 34% math and 40% reading proficiency.'
  },

  // ── ALSIP ────────────────────────────────────────────────────────────────
  'Alsip': {
    hs: 'Alan B. Shepard High School',
    district: 'Community HSD 218',
    usNewsNational: 3428,
    usNewsState: 122,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 25, avgSAT: 1110,
    note: 'Shepard serves Alsip, Palos Heights, Crestwood, Worth, Calumet Park, and Robbins; 85% graduation rate and 41% AP participation rate.'
  },

  // ── AURORA ───────────────────────────────────────────────────────────────
  'Aurora': {
    hs: 'West Aurora High School',
    district: 'Aurora West USD 129',
    usNewsNational: 9170,
    usNewsState: 290,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: null, avgSAT: 1130,
    note: 'West Aurora serves the south and west portions of Aurora with 3,655 students; 16% math proficiency on state assessments.'
  },

  // ── BEECHER ──────────────────────────────────────────────────────────────
  'Beecher': {
    hs: 'Beecher High School',
    district: 'Beecher Community Unified SD 200U',
    usNewsNational: 8572,
    usNewsState: 278,
    stateGrade: 'Commendable',
    niche: 'B-', avgACT: 26, avgSAT: 1140,
    note: 'Small rural school of 347 students with 22% AP participation rate; ranked 278th in Illinois.'
  },

  // ── BELLWOOD ─────────────────────────────────────────────────────────────
  'Bellwood': {
    hs: 'Proviso East High School',
    district: 'Proviso TWP HSD 209',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 23, avgSAT: 960,
    note: 'Proviso East earned its first-ever Commendable designation in 2024, improving from the bottom 5% to the 47th percentile statewide.'
  },

  // ── BERKELEY ─────────────────────────────────────────────────────────────
  'Berkeley': {
    hs: 'Proviso West High School',
    district: 'Proviso TWP HSD 209',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 22, avgSAT: 980,
    note: 'Proviso West serves Berkeley, Bellwood, Hillside, Stone Park, and other communities; 3% math proficiency on state tests.'
  },

  // ── BERWYN ───────────────────────────────────────────────────────────────
  'Berwyn': {
    hs: 'J. Sterling Morton West High School',
    district: 'J.S. Morton HSD 201',
    usNewsNational: 9196,
    usNewsState: 292,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 22, avgSAT: 1070,
    note: 'Morton West serves Berwyn with 3,497 students; 41% AP participation rate and 78% graduation rate.'
  },

  // ── BLUE ISLAND ──────────────────────────────────────────────────────────
  'Blue Island': {
    hs: 'Dwight D. Eisenhower High School',
    district: 'Community HSD 218',
    usNewsNational: 7346,
    usNewsState: 246,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 22, avgSAT: 1050,
    note: 'Eisenhower serves Blue Island, Posen, and Calumet Park; 32% AP participation rate and 77% graduation rate.'
  },

  // ── BOLINGBROOK ──────────────────────────────────────────────────────────
  'Bolingbrook': {
    hs: 'Bolingbrook High School',
    district: 'Valley View Community USD 365U',
    usNewsNational: 2526,
    usNewsState: 92,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 25, avgSAT: 1150,
    note: 'Bolingbrook High ranks 92nd in Illinois with 51% AP participation rate and 3,371 students in a diverse school community.'
  },

  // ── BOULDER HILL ─────────────────────────────────────────────────────────
  'Boulder Hill': {
    hs: ['Oswego High School', 'Oswego East High School'],
    district: ['Oswego CUSD 308', 'Oswego CUSD 308'],
    usNewsNational: 4835,
    usNewsState: 179,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 27, avgSAT: 1210,
    splitDistrict: true,
    note: 'Boulder Hill is in Oswego CUSD 308; Oswego High ranks 179th in Illinois with a 93-95% graduation rate over five years.'
  },

  // ── BRAIDWOOD ────────────────────────────────────────────────────────────
  'Braidwood': {
    hs: 'Reed-Custer High School',
    district: 'Reed-Custer CUSD 255U',
    usNewsNational: 6012,
    usNewsState: 209,
    stateGrade: 'Commendable',
    niche: 'B-', avgACT: 24, avgSAT: 1120,
    note: 'Reed-Custer ranks 209th in Illinois with 40% math proficiency, well above average for rural districts in the region.'
  },

  // ── BRIDGEVIEW ───────────────────────────────────────────────────────────
  'Bridgeview': {
    hs: 'Argo Community High School',
    district: 'Argo Community HSD 217',
    usNewsNational: 5184,
    usNewsState: 186,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 22, avgSAT: 1130,
    note: 'Argo Community serves Bridgeview, Summit, Justice, Willow Springs, and parts of Hickory Hills; A- on Niche and 186th in Illinois.'
  },

  // ── BROADVIEW ────────────────────────────────────────────────────────────
  'Broadview': {
    hs: ['Proviso East High School', 'Proviso West High School'],
    district: ['Proviso TWP HSD 209', 'Proviso TWP HSD 209'],
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 22.5, avgSAT: 970,
    splitDistrict: true,
    note: 'Broadview is split between Proviso East and Proviso West attendance boundaries within Proviso Township HSD 209.'
  },

  // ── BROOKFIELD ───────────────────────────────────────────────────────────
  'Brookfield': {
    hs: 'Lyons Township High School',
    district: 'Lyons TWP HSD 204',
    usNewsNational: 884,
    usNewsState: 39,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1260,
    note: 'Lyons Township High ranks 39th in Illinois with a 54% AP participation rate and 96% graduation rate; A on Niche.'
  },

  // ── BURBANK ──────────────────────────────────────────────────────────────
  'Burbank': {
    hs: 'Reavis High School',
    district: 'Reavis TWP HSD 220',
    usNewsNational: 5316,
    usNewsState: 191,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 23, avgSAT: 1120,
    note: 'Reavis High School serves Burbank with 1,930 students; 28% math proficiency on state tests and 87% graduation rate.'
  },

  // ── CALUMET CITY ─────────────────────────────────────────────────────────
  'Calumet City': {
    hs: 'Thornton Fractional North High School',
    district: 'Thornton Fractional TWP HSD 215',
    usNewsNational: 9940,
    usNewsState: 317,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 21, avgSAT: 1010,
    note: 'TF North serves Calumet City with 1,425 students; 16% math and 31% reading proficiency, 87% graduation rate.'
  },

  // ── CALUMET PARK ─────────────────────────────────────────────────────────
  'Calumet Park': {
    hs: 'Alan B. Shepard High School',
    district: 'Community HSD 218',
    usNewsNational: 3428,
    usNewsState: 122,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 25, avgSAT: 1110,
    note: 'Calumet Park students attend Shepard, which serves six southwest Cook communities with 85% graduation rate and 41% AP participation.'
  },

  // ── CHANNAHON ────────────────────────────────────────────────────────────
  'Channahon': {
    hs: 'Minooka Community High School',
    district: 'Minooka CHSD 111',
    feedsTo: 'Minooka CHSD 111',
    usNewsNational: 7114,
    usNewsState: 239,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 26, avgSAT: 1170,
    note: 'Minooka CHSD 111 encompasses Channahon and Minooka across 90+ square miles; district index score improved to 88.90 in 2025.'
  },

  // ── CHICAGO HEIGHTS ──────────────────────────────────────────────────────
  'Chicago Heights': {
    hs: 'Bloom High School',
    district: 'Bloom TWP HSD 206',
    usNewsNational: 10019,
    usNewsState: 318,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 21, avgSAT: 1020,
    note: 'Bloom High School serves Chicago Heights with 1,832 students; 89% graduation rate despite only 8% math proficiency.'
  },

  // ── CHICAGO RIDGE ────────────────────────────────────────────────────────
  'Chicago Ridge': {
    hs: 'Harold L. Richards High School',
    district: 'Community HSD 218',
    usNewsNational: 4087,
    usNewsState: 148,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 24, avgSAT: 1100,
    note: 'Richards serves Chicago Ridge, Oak Lawn, Worth, and Robbins; ranked 148th in Illinois with 39% AP participation and 87% graduation rate.'
  },

  // ── CICERO ───────────────────────────────────────────────────────────────
  'Cicero': {
    hs: 'J. Sterling Morton East High School',
    district: 'J.S. Morton HSD 201',
    usNewsNational: 7350,
    usNewsState: 248,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: 21, avgSAT: 1050,
    note: 'Morton East serves Cicero with 3,362 students; 39% AP participation and 80% graduation rate in a 97% minority-enrollment school.'
  },

  // ── COUNTRY CLUB HILLS ───────────────────────────────────────────────────
  'Country Club Hills': {
    hs: 'Hillcrest High School',
    district: 'Bremen Community HSD 228',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 21, avgSAT: 1000,
    note: 'Hillcrest serves Country Club Hills and nearby communities; lowest-performing of the four Bremen District 228 schools with 5% math proficiency.'
  },

  // ── COUNTRYSIDE ──────────────────────────────────────────────────────────
  'Countryside': {
    hs: 'Lyons Township High School',
    district: 'Lyons TWP HSD 204',
    usNewsNational: 884,
    usNewsState: 39,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 29, avgSAT: 1260,
    feedsTo: 'Lyons TWP HSD 204',
    note: 'Countryside students attend Lyons Township High, ranked 39th in Illinois with a 54% AP participation rate and 96% graduation rate.'
  },

  // ── CREST HILL ───────────────────────────────────────────────────────────
  'Crest Hill': {
    hs: 'Joliet West High School',
    district: 'Joliet TWP HSD 204',
    feedsTo: 'Joliet TWP HSD 204',
    usNewsNational: 6589,
    usNewsState: 228,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 25, avgSAT: 1100,
    note: 'Joliet West earned 2024 U.S. News Best High School status, placing in the top 40% of public high schools nationwide.'
  },

  // ── CRESTWOOD ────────────────────────────────────────────────────────────
  'Crestwood': {
    hs: 'Alan B. Shepard High School',
    district: 'Community HSD 218',
    usNewsNational: 3428,
    usNewsState: 122,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 25, avgSAT: 1110,
    note: 'Crestwood students attend Shepard, which serves six southwest Cook communities with 85% graduation rate and 41% AP participation.'
  },

  // ── CRETE ────────────────────────────────────────────────────────────────
  'Crete': {
    hs: 'Crete-Monee High School',
    district: 'Crete-Monee CUSD 201U',
    usNewsNational: 3921,
    usNewsState: 143,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 22, avgSAT: 1050,
    note: 'Crete-Monee High serves Crete, Monee, University Park, and Park Forest; 143rd in Illinois with 92% graduation rate.'
  },

  // ── DOLTON ───────────────────────────────────────────────────────────────
  'Dolton': {
    hs: 'Thornridge High School',
    district: 'Thornton TWP HSD 205',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'D', avgACT: null, avgSAT: 980,
    note: 'Thornridge received Commendable designation despite only 2% math and 6% reading proficiency; 80%+ graduation rate sustains the rating.'
  },

  // ── ELMWOOD PARK ─────────────────────────────────────────────────────────
  'Elmwood Park': {
    hs: 'Elmwood Park High School',
    district: 'Elmwood Park CUSD 401',
    usNewsNational: 6849,
    usNewsState: 230,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 25, avgSAT: 1140,
    note: 'Elmwood Park High School serves only Elmwood Park residents; 51% AP participation rate and ranked 230th in Illinois.'
  },

  // ── EVANSTON ─────────────────────────────────────────────────────────────
  'Evanston': {
    hs: 'Evanston Township High School',
    district: 'Evanston TWP HSD 202',
    usNewsNational: 933,
    usNewsState: 39,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1064,
    note: 'ETHS ranked 39th in Illinois and 933rd nationally with 93% graduation rate, 47% math proficiency, and average ACT of 29.'
  },

  // ── EVERGREEN PARK ───────────────────────────────────────────────────────
  'Evergreen Park': {
    hs: 'Evergreen Park High School',
    district: 'Evergreen Park CHSD 231',
    usNewsNational: 7304,
    usNewsState: 244,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 25, avgSAT: 1130,
    note: 'Evergreen Park High ranks 244th in Illinois with 37% AP participation; A- on Niche and ranked #100 Best Public High Schools in Illinois.'
  },

  // ── FLOSSMOOR ────────────────────────────────────────────────────────────
  'Flossmoor': {
    hs: 'Homewood-Flossmoor High School',
    district: 'Homewood-Flossmoor CHSD 233',
    usNewsNational: 10673,
    usNewsState: 335,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 25, avgSAT: 1130,
    note: 'H-F High received Commendable designation in 2024 with index score of 78.61; 2,805 students and strong community reputation.'
  },

  // ── FRANKFORT ────────────────────────────────────────────────────────────
  'Frankfort': {
    hs: 'Lincoln-Way East High School',
    district: 'Lincoln-Way CHSD 210',
    usNewsNational: 1177,
    usNewsState: 43,
    stateGrade: 'Exemplary',
    niche: 'A', avgACT: 28, avgSAT: 1230,
    note: 'Lincoln-Way East earned Exemplary designation on the Illinois Report Card; 60% math proficiency and 58% reading proficiency on state assessments.'
  },

  // ── FRANKFORT SQUARE ─────────────────────────────────────────────────────
  'Frankfort Square': {
    hs: 'Lincoln-Way East High School',
    district: 'Lincoln-Way CHSD 210',
    feedsTo: 'Lincoln-Way CHSD 210',
    usNewsNational: 1177,
    usNewsState: 43,
    stateGrade: 'Exemplary',
    niche: 'A', avgACT: 28, avgSAT: 1230,
    note: 'Frankfort Square feeds to Lincoln-Way East, which holds Exemplary status and ranks top-15% in Illinois with a strong AP program.'
  },

  // ── FRANKLIN PARK ────────────────────────────────────────────────────────
  'Franklin Park': {
    hs: 'East Leyden High School',
    district: 'Leyden CHSD 212',
    usNewsNational: 4626,
    usNewsState: 173,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: null, avgSAT: 1120,
    note: 'East Leyden serves Franklin Park with 1,836 students and 51% AP participation rate; ranked 127th Best Public High Schools on Niche.'
  },

  // ── GLENWOOD ─────────────────────────────────────────────────────────────
  'Glenwood': {
    hs: 'Bloom Trail High School',
    district: 'Bloom TWP HSD 206',
    feedsTo: 'Bloom TWP HSD 206',
    usNewsNational: 8841,
    usNewsState: 283,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: 21, avgSAT: 1010,
    note: 'Bloom Trail serves Glenwood, Steger, and surrounding areas; ranked 283rd in Illinois with 38% AP participation rate.'
  },

  // ── HARVEY ───────────────────────────────────────────────────────────────
  'Harvey': {
    hs: 'Thornton Township High School',
    district: 'Thornton TWP HSD 205',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 21, avgSAT: 1000,
    note: 'Thornton High serves Harvey with a history dating to 1898; 8% math proficiency but 80%+ graduation rate sustains Commendable status.'
  },

  // ── HAZEL CREST ──────────────────────────────────────────────────────────
  'Hazel Crest': {
    hs: 'Hillcrest High School',
    district: 'Bremen Community HSD 228',
    feedsTo: 'Bremen Community HSD 228',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 21, avgSAT: 1000,
    note: 'Hazel Crest students attend Hillcrest in Country Club Hills; lowest AP participation (11%) and highest absenteeism in the four-school CHSD 228 district.'
  },

  // ── HICKORY HILLS ────────────────────────────────────────────────────────
  'Hickory Hills': {
    hs: 'Reavis High School',
    district: 'Reavis TWP HSD 220',
    feedsTo: 'Reavis TWP HSD 220',
    usNewsNational: 5316,
    usNewsState: 191,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 23, avgSAT: 1120,
    note: 'Hickory Hills students attend Reavis in Burbank; 28% math proficiency and 87% graduation rate, ranked 191st in Illinois.'
  },

  // ── HILLSIDE ─────────────────────────────────────────────────────────────
  'Hillside': {
    hs: 'Proviso West High School',
    district: 'Proviso TWP HSD 209',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 22, avgSAT: 980,
    note: 'Proviso West is located in Hillside and serves Berkeley, Bellwood, Stone Park, Westchester, and other communities; 3% math proficiency on state tests.'
  },

  // ── HOMER GLEN ───────────────────────────────────────────────────────────
  'Homer Glen': {
    hs: 'Lockport Township High School East',
    district: 'Lockport TWP HSD 205',
    feedsTo: 'Lockport TWP HSD 205',
    usNewsNational: 3804,
    usNewsState: 139,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 27, avgSAT: 1190,
    note: 'Lockport Township East serves Homer Glen; earned Commendable designation consistently and ranks 139th in Illinois, top 15% statewide.'
  },

  // ── HOMETOWN ─────────────────────────────────────────────────────────────
  'Hometown': {
    hs: 'Oak Lawn Community High School',
    district: 'Oak Lawn CHSD 229',
    feedsTo: 'Oak Lawn CHSD 229',
    usNewsNational: 5111,
    usNewsState: 184,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 25, avgSAT: 1130,
    note: 'Oak Lawn CHSD 229 serves all of Hometown; earned Commendable designation in 2024 with improving 9th-grade on-track rate.'
  },

  // ── HOMEWOOD ─────────────────────────────────────────────────────────────
  'Homewood': {
    hs: 'Homewood-Flossmoor High School',
    district: 'Homewood-Flossmoor CHSD 233',
    usNewsNational: 10673,
    usNewsState: 335,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 25, avgSAT: 1130,
    note: 'H-F High earned Commendable in 2024 with index score of 78.61; 2,805 students from Homewood, Flossmoor, and Olympia Fields.'
  },

  // ── JOLIET ───────────────────────────────────────────────────────────────
  'Joliet': {
    hs: ['Joliet West High School', 'Joliet Central High School'],
    district: 'Joliet Township HSD 204',
    splitDistrict: true,
    usNewsNational: 6696,
    usNewsState: 226,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 24, avgSAT: 1080,
    note: 'Joliet feeds to Joliet Township HSD 204, which operates two high schools: Joliet West (ranked #226 in Illinois, #6,696 nationally by US News 2025-26) and Joliet Central. Joliet West has been recognized in consecutive years by US News; the district overall earns a Niche B.'
  },

  // ── JUSTICE ──────────────────────────────────────────────────────────────
  'Justice': {
    hs: 'Argo Community High School',
    district: 'Argo Community HSD 217',
    feedsTo: 'Argo Community HSD 217',
    usNewsNational: 5184,
    usNewsState: 186,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 22, avgSAT: 1130,
    note: 'Argo Community serves Justice along with Summit, Bridgeview, and Willow Springs; A- on Niche and ranked 132nd Best Public High Schools.'
  },

  // ── LAKE HOLIDAY ─────────────────────────────────────────────────────────
  'Lake Holiday': {
    hs: 'Streator Township High School',
    district: 'Streator TWP HSD 40',
    feedsTo: 'Streator TWP HSD 40',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'B-', avgACT: 24, avgSAT: 1130,
    note: 'Lake Holiday (LaSalle County) feeds to Streator Township High School serving the Ottawa-Streator area.'
  },

  // ── LANSING ──────────────────────────────────────────────────────────────
  'Lansing': {
    hs: 'Thornton Fractional South High School',
    district: 'Thornton Fractional TWP HSD 215',
    usNewsNational: 7438,
    usNewsState: 249,
    stateGrade: 'Commendable',
    niche: 'B-', avgACT: 21, avgSAT: 1050,
    note: 'TF South serves Lansing with 1,803 students; 249th in Illinois with 92% graduation rate and 25% AP participation rate.'
  },

  // ── LOCKPORT ─────────────────────────────────────────────────────────────
  'Lockport': {
    hs: 'Lockport Township High School East',
    district: 'Lockport TWP HSD 205',
    usNewsNational: 3804,
    usNewsState: 139,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 27, avgSAT: 1190,
    note: 'Lockport Township High consistently earns Commendable and ranks 139th in Illinois; 96% 9th-grade on-track rate and growing enrollment.'
  },

  // ── LYNWOOD ──────────────────────────────────────────────────────────────
  'Lynwood': {
    hs: 'Bloom Trail High School',
    district: 'Bloom TWP HSD 206',
    feedsTo: 'Bloom TWP HSD 206',
    usNewsNational: 8841,
    usNewsState: 283,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: 21, avgSAT: 1010,
    note: 'Lynwood students feed to Bloom Trail in the Chicago Heights area; ranked 283rd in Illinois with 38% AP participation.'
  },

  // ── MARKHAM ──────────────────────────────────────────────────────────────
  'Markham': {
    hs: 'Bremen High School',
    district: 'Bremen Community HSD 228',
    feedsTo: 'Bremen Community HSD 228',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'B-', avgACT: 21, avgSAT: 1050,
    note: 'Markham feeds to Bremen High in Midlothian, one of four schools in CHSD 228 with 24% district-wide math proficiency.'
  },

  // ── MATTESON ─────────────────────────────────────────────────────────────
  'Matteson': {
    hs: 'Rich Township High School',
    district: 'Rich TWP HSD 227',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: null, avgSAT: null,
    note: 'Rich Township serves Matteson, Park Forest, Richton Park, and Olympia Fields; 4% math and 10% reading proficiency on state assessments.'
  },

  // ── MAYWOOD ──────────────────────────────────────────────────────────────
  'Maywood': {
    hs: 'Proviso East High School',
    district: 'Proviso TWP HSD 209',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 23, avgSAT: 960,
    note: 'Proviso East is located in Maywood and earned its first Commendable designation in 2024, moving from the bottom 5% to the 47th percentile statewide.'
  },

  // ── MELROSE PARK ─────────────────────────────────────────────────────────
  'Melrose Park': {
    hs: ['Proviso East High School', 'Proviso West High School'],
    district: ['Proviso TWP HSD 209', 'Proviso TWP HSD 209'],
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 22.5, avgSAT: 970,
    splitDistrict: true,
    note: 'Melrose Park is split between Proviso East and Proviso West attendance boundaries; both schools are in Proviso Township HSD 209.'
  },

  // ── MIDLOTHIAN ───────────────────────────────────────────────────────────
  'Midlothian': {
    hs: 'Bremen High School',
    district: 'Bremen Community HSD 228',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'B-', avgACT: 21, avgSAT: 1050,
    note: 'Bremen High in Midlothian is the district headquarters school; CHSD 228 district-wide math proficiency of 24% exceeds nearby districts.'
  },

  // ── MINOOKA ──────────────────────────────────────────────────────────────
  'Minooka': {
    hs: 'Minooka Community High School',
    district: 'Minooka CHSD 111',
    usNewsNational: 7114,
    usNewsState: 239,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 26, avgSAT: 1170,
    note: 'Minooka Community High ranked #1 in Grundy County and #76 Best Public High Schools in Illinois on Niche; 96% 9th-grade on-track rate in 2025.'
  },

  // ── MOKENA ───────────────────────────────────────────────────────────────
  'Mokena': {
    hs: 'Lincoln-Way Central High School',
    district: 'Lincoln-Way CHSD 210',
    feedsTo: 'Lincoln-Way CHSD 210',
    usNewsNational: 1466,
    usNewsState: 58,
    stateGrade: 'Exemplary',
    niche: 'A', avgACT: 28, avgSAT: 1240,
    note: 'Lincoln-Way Central earned Exemplary designation on the Illinois Report Card; 49% math proficiency on state assessments, ranked 58th in Illinois.'
  },

  // ── MONEE ────────────────────────────────────────────────────────────────
  'Monee': {
    hs: 'Crete-Monee High School',
    district: 'Crete-Monee CUSD 201U',
    feedsTo: 'Crete-Monee CUSD 201U',
    usNewsNational: 3921,
    usNewsState: 143,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 22, avgSAT: 1050,
    note: 'Monee is one of four communities served by Crete-Monee High School; 143rd in Illinois with 92% graduation rate.'
  },

  // ── NEW LENOX ────────────────────────────────────────────────────────────
  'New Lenox': {
    hs: ['Lincoln-Way Central High School', 'Lincoln-Way West High School'],
    district: ['Lincoln-Way CHSD 210', 'Lincoln-Way CHSD 210'],
    usNewsNational: 1466,
    usNewsState: 58,
    stateGrade: 'Exemplary',
    niche: 'A', avgACT: 28, avgSAT: 1220,
    splitDistrict: true,
    note: 'New Lenox is split between Lincoln-Way Central and Lincoln-Way West; both schools hold the Exemplary designation from the Illinois Report Card.'
  },

  // ── NORTH CHICAGO ────────────────────────────────────────────────────────
  'North Chicago': {
    hs: 'North Chicago Community High School',
    district: 'North Chicago SD 187',
    usNewsNational: 13110,
    usNewsState: 409,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 19, avgSAT: 960,
    note: 'North Chicago Community High has 870 students with 26% AP participation; 5% math and 7% reading proficiency on state assessments.'
  },

  // ── NORTH RIVERSIDE ──────────────────────────────────────────────────────
  'North Riverside': {
    hs: 'Riverside Brookfield Township High School',
    district: 'Riverside-Brookfield TWP SD 208',
    feedsTo: 'Riverside-Brookfield TWP SD 208',
    usNewsNational: 983,
    usNewsState: 42,
    stateGrade: 'Exemplary',
    niche: 'A+', avgACT: null, avgSAT: 1210,
    note: 'Riverside Brookfield High earned Exemplary for 2nd consecutive year in 2024 with score of 91.98; ranked 42nd in Illinois and A+ on Niche.'
  },

  // ── OAK FOREST ───────────────────────────────────────────────────────────
  'Oak Forest': {
    hs: 'Oak Forest High School',
    district: 'Bremen Community HSD 228',
    usNewsNational: 6211,
    usNewsState: 217,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 26, avgSAT: 1140,
    note: 'Oak Forest High is the top-ranked school in CHSD 228 and the first in the district to earn U.S. News Best High Schools recognition; 36% AP participation.'
  },

  // ── OAK LAWN ─────────────────────────────────────────────────────────────
  'Oak Lawn': {
    hs: 'Oak Lawn Community High School',
    district: 'Oak Lawn CHSD 229',
    usNewsNational: 5111,
    usNewsState: 184,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 25, avgSAT: 1130,
    note: 'Oak Lawn Community High earned Commendable in 2024; ranked 184th in Illinois with 9th-grade on-track rate improving 3.6% year-over-year.'
  },

  // ── OLYMPIA FIELDS ───────────────────────────────────────────────────────
  'Olympia Fields': {
    hs: 'Homewood-Flossmoor High School',
    district: 'Homewood-Flossmoor CHSD 233',
    feedsTo: 'Homewood-Flossmoor CHSD 233',
    usNewsNational: 10673,
    usNewsState: 335,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 25, avgSAT: 1130,
    note: 'Olympia Fields students attend H-F High, which received Commendable in 2024 with index score 78.61 and 2,805-student enrollment.'
  },

  // ── ORLAND HILLS ─────────────────────────────────────────────────────────
  'Orland Hills': {
    hs: 'Tinley Park High School',
    district: 'Bremen Community HSD 228',
    feedsTo: 'Bremen Community HSD 228',
    usNewsNational: 8486,
    usNewsState: 276,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 24, avgSAT: 1110,
    note: 'Orland Hills students attend Tinley Park High in CHSD 228; ranked 276th in Illinois with 28% AP participation rate.'
  },

  // ── ORLAND PARK ──────────────────────────────────────────────────────────
  // Note: western Orland Park → CHSD 230 (Carl Sandburg/Stagg, covered above)
  //       eastern Orland Park → Bremen CHSD 228 (Tinley Park HS)
  'Orland Park': {
    hs: ['Carl Sandburg High School', 'Tinley Park High School'],
    district: ['Cons HSD 230', 'Bremen Community HSD 228'],
    usNewsNational: null,
    usNewsState: 64,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 26, avgSAT: 1155,
    splitDistrict: true,
    note: 'Orland Park is split: western residents attend Carl Sandburg (CHSD 230, ranked 64th in IL) and eastern residents attend Tinley Park High (CHSD 228).'
  },

  // ── PARK CITY ────────────────────────────────────────────────────────────
  'Park City': {
    hs: 'Warren Township High School',
    district: 'Warren TWP HSD 121',
    feedsTo: 'Warren TWP HSD 121',
    usNewsNational: 2863,
    usNewsState: 106,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 28, avgSAT: 1210,
    note: 'Park City feeds to Warren Township High in Gurnee; ranked 106th in Illinois with 95% graduation rate and 42% AP participation rate.'
  },

  // ── PARK FOREST ──────────────────────────────────────────────────────────
  'Park Forest': {
    hs: 'Rich Township High School',
    district: 'Rich TWP HSD 227',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: null, avgSAT: null,
    note: 'Cook County portion of Park Forest feeds to Rich Township High; 4% math proficiency on state assessments despite Commendable designation.'
  },

  // ── POSEN ────────────────────────────────────────────────────────────────
  'Posen': {
    hs: 'Dwight D. Eisenhower High School',
    district: 'Community HSD 218',
    feedsTo: 'Community HSD 218',
    usNewsNational: 7346,
    usNewsState: 246,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 22, avgSAT: 1050,
    note: 'Posen students attend Eisenhower in Blue Island; 32% AP participation and 77% graduation rate in a school with 94% minority enrollment.'
  },

  // ── RICHTON PARK ─────────────────────────────────────────────────────────
  'Richton Park': {
    hs: 'Rich Township High School',
    district: 'Rich TWP HSD 227',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: null, avgSAT: null,
    note: 'Rich Township High serves Richton Park along with Matteson, Park Forest, and Olympia Fields; 4% math proficiency on state assessments.'
  },

  // ── RIVERDALE ────────────────────────────────────────────────────────────
  'Riverdale': {
    hs: 'Thornton Township High School',
    district: 'Thornton TWP HSD 205',
    feedsTo: 'Thornton TWP HSD 205',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 21, avgSAT: 1000,
    note: 'Riverdale students feed to Thornton High in Harvey; district of 6,000+ students across three schools, all with Commendable designations.'
  },

  // ── ROBBINS ──────────────────────────────────────────────────────────────
  'Robbins': {
    hs: 'Alan B. Shepard High School',
    district: 'Community HSD 218',
    feedsTo: 'Community HSD 218',
    usNewsNational: 3428,
    usNewsState: 122,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 25, avgSAT: 1110,
    note: 'Robbins students attend Shepard High, which serves six southwest Cook County communities; 85% graduation rate and 41% AP participation.'
  },

  // ── ROMEOVILLE ───────────────────────────────────────────────────────────
  'Romeoville': {
    hs: 'Romeoville High School',
    district: 'Valley View Community USD 365U',
    usNewsNational: 3463,
    usNewsState: 127,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 24, avgSAT: 1140,
    note: 'Romeoville High ranked 127th in Illinois and top 17% statewide; 45% AP participation rate and 23% math proficiency on state tests.'
  },

  // ── SAUK VILLAGE ─────────────────────────────────────────────────────────
  'Sauk Village': {
    hs: 'Bloom Trail High School',
    district: 'Bloom TWP HSD 206',
    feedsTo: 'Bloom TWP HSD 206',
    usNewsNational: 8841,
    usNewsState: 283,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: 21, avgSAT: 1010,
    note: 'Sauk Village students feed to Bloom Trail High in the Chicago Heights area; 38% AP participation, ranked 283rd in Illinois.'
  },

  // ── SCHILLER PARK ────────────────────────────────────────────────────────
  'Schiller Park': {
    hs: 'East Leyden High School',
    district: 'Leyden CHSD 212',
    feedsTo: 'Leyden CHSD 212',
    usNewsNational: 4626,
    usNewsState: 173,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: null, avgSAT: 1120,
    note: 'Schiller Park students attend East Leyden in Franklin Park; 51% AP participation and ranked 127th Best Public High Schools on Niche.'
  },

  // ── SHOREWOOD ────────────────────────────────────────────────────────────
  'Shorewood': {
    hs: 'Joliet West High School',
    district: 'Joliet TWP HSD 204',
    feedsTo: 'Joliet TWP HSD 204',
    usNewsNational: 6589,
    usNewsState: 228,
    stateGrade: 'Commendable',
    niche: 'B', avgACT: 25, avgSAT: 1100,
    note: 'Shorewood residents feed to Joliet West High, which earned 2024 U.S. News Best High School status in the top 40% nationally.'
  },

  // ── SKOKIE ───────────────────────────────────────────────────────────────
  'Skokie': {
    hs: 'Niles North High School',
    district: 'Niles TWP HSD 219',
    usNewsNational: 1851,
    usNewsState: 61,
    stateGrade: 'Commendable',
    niche: 'A+', avgACT: null, avgSAT: 1220,
    note: 'Niles North serves Skokie and earned Gold status on the College Board 2025 AP Honor Roll; ranked 61st in Illinois and A+ district on Niche.'
  },

  // ── SOUTH HOLLAND ────────────────────────────────────────────────────────
  'South Holland': {
    hs: 'Thornwood High School',
    district: 'Thornton TWP HSD 205',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: 21, avgSAT: 1020,
    note: 'Thornwood High in South Holland earned Commendable in 2024 with 85% four-year graduation rate; serves the eastern part of Thornton Township.'
  },

  // ── STEGER ───────────────────────────────────────────────────────────────
  'Steger': {
    hs: 'Bloom Trail High School',
    district: 'Bloom TWP HSD 206',
    feedsTo: 'Bloom TWP HSD 206',
    usNewsNational: 8841,
    usNewsState: 283,
    stateGrade: 'Commendable',
    niche: 'C', avgACT: 21, avgSAT: 1010,
    note: 'Bloom Trail High is located in the Chicago Heights/Steger area; ranked 283rd in Illinois with 38% AP participation rate.'
  },

  // ── STICKNEY ─────────────────────────────────────────────────────────────
  'Stickney': {
    hs: 'Reavis High School',
    district: 'Reavis TWP HSD 220',
    feedsTo: 'Reavis TWP HSD 220',
    usNewsNational: 5316,
    usNewsState: 191,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 23, avgSAT: 1120,
    note: 'Stickney students attend Reavis High in Burbank; 28% math proficiency and 87% graduation rate, ranked 191st in Illinois.'
  },

  // ── STONE PARK ───────────────────────────────────────────────────────────
  'Stone Park': {
    hs: 'Proviso West High School',
    district: 'Proviso TWP HSD 209',
    feedsTo: 'Proviso TWP HSD 209',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: 22, avgSAT: 980,
    note: 'Stone Park students attend Proviso West in Hillside; one of ten communities served by Proviso Township HSD 209.'
  },

  // ── SUMMIT ───────────────────────────────────────────────────────────────
  'Summit': {
    hs: 'Argo Community High School',
    district: 'Argo Community HSD 217',
    usNewsNational: 5184,
    usNewsState: 186,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 22, avgSAT: 1130,
    note: 'Argo Community High is located in Summit; serves six communities with 1,923 students and 51.8% Hispanic enrollment.'
  },

  // ── TINLEY PARK ──────────────────────────────────────────────────────────
  'Tinley Park': {
    hs: ['Victor J. Andrew High School', 'Tinley Park High School'],
    district: ['Cons HSD 230', 'Bremen Community HSD 228'],
    usNewsNational: 3802,
    usNewsState: 138,
    stateGrade: 'Commendable',
    niche: 'A', avgACT: 25.5, avgSAT: 1135,
    splitDistrict: true,
    note: 'Tinley Park is split: residents west of Harlem Ave attend Victor J. Andrew (CHSD 230, ranked 138th in IL, Niche A) while the eastern portion feeds Tinley Park High (CHSD 228, ranked 276th in IL, Niche A-).'
  },

  // ── UNIVERSITY PARK ──────────────────────────────────────────────────────
  'University Park': {
    hs: 'Crete-Monee High School',
    district: 'Crete-Monee CUSD 201U',
    feedsTo: 'Crete-Monee CUSD 201U',
    usNewsNational: 3921,
    usNewsState: 143,
    stateGrade: 'Commendable',
    niche: 'C+', avgACT: 22, avgSAT: 1050,
    note: 'University Park students attend Crete-Monee High, which serves four south-suburban communities across 80 square miles of Will County.'
  },

  // ── WAUKEGAN ─────────────────────────────────────────────────────────────
  'Waukegan': {
    hs: 'Waukegan High School',
    district: 'Waukegan Community USD 60',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'C-', avgACT: null, avgSAT: null,
    note: 'Waukegan High improved to Commendable designation in 2025; 4,325 students with four consecutive years of graduation rate improvement.'
  },

  // ── WILLOW SPRINGS ───────────────────────────────────────────────────────
  'Willow Springs': {
    hs: 'Argo Community High School',
    district: 'Argo Community HSD 217',
    feedsTo: 'Argo Community HSD 217',
    usNewsNational: 5184,
    usNewsState: 186,
    stateGrade: 'Commendable',
    niche: 'A-', avgACT: 22, avgSAT: 1130,
    note: 'Willow Springs students attend Argo Community High, which also serves Summit, Bridgeview, and Justice; A- on Niche.'
  },

  // ── WILMINGTON ───────────────────────────────────────────────────────────
  'Wilmington': {
    hs: 'Wilmington High School',
    district: 'Wilmington CUSD 209U',
    usNewsNational: 8626,
    usNewsState: 279,
    stateGrade: 'Commendable',
    niche: 'B-', avgACT: null, avgSAT: null,
    note: 'Wilmington High serves a small community of 432 students with 36% math proficiency, well above state average for the district.'
  },

  // ── WORTH ────────────────────────────────────────────────────────────────
  'Worth': {
    hs: 'Harold L. Richards High School',
    district: 'Community HSD 218',
    usNewsNational: 4087,
    usNewsState: 148,
    stateGrade: 'Commendable',
    niche: 'B+', avgACT: 24, avgSAT: 1100,
    note: 'Worth students attend Richards High, serving Worth, Chicago Ridge, Oak Lawn, and Robbins; ranked 148th in Illinois with 87% graduation rate.'
  },

  // ── ZION ─────────────────────────────────────────────────────────────────
  'Zion': {
    hs: 'Zion-Benton Township High School',
    district: 'Zion-Benton TWP HSD 126',
    usNewsNational: null,
    usNewsState: null,
    stateGrade: 'Commendable',
    niche: 'B-', avgACT: 24, avgSAT: 1080,
    note: 'Zion-Benton Township High serves Zion and Benton Township with 2,533 students; 8% math and 16% reading proficiency on state assessments.'
  },

  // ═══ PILOT METROS (Rockford / Peoria / South Bend), added 2026-08-31 ═════
  // stateGrade/niche/avgACT/avgSAT intentionally null throughout -- no
  // verified IL Report Card summative designation or Niche district grade was
  // gathered for these towns (unlike the original Chicagoland set), and
  // avgACT/avgSAT are Niche-sourced fallback fields this project's policy
  // doesn't fabricate. usNewsNational/usNewsState mirror the primary school's
  // MULTI_SCHOOL_RANKS numbers so this vestigial fallback field starts in
  // sync rather than introducing new staleness (see school_quality_data
  // memory re: the index.html:5287 staleness bug this avoids repeating).

  // ── PEORIA METRO (IL) ────────────────────────────────────────────────────

  // ── SOUTH BEND METRO (IN + 1 MI town) ────────────────────────────────────
  'South Bend': {
    hs: ['Adams High School', 'Riley High School', 'Washington High School'],
    district: 'South Bend Community School Corp',
    usNewsNational: 6194, usNewsState: 165,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'South Bend Community School Corp splits by address across Adams (165th in IN), Riley (249th), and Washington (unranked bottom band); a 4th school, Clay High, closed after the 2023-24 year and its zone was absorbed into these three. Indiana publishes no points-based SAT average for any school.'
  },
  'Elkhart': {
    hs: 'Elkhart High School',
    district: 'Elkhart Community Schools',
    usNewsNational: 10751, usNewsState: 264,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Elkhart High School (264th in IN) formed from the 2021 merger of the former Central and Memorial high schools; also serves neighboring Simonton Lake.'
  },
  'Mishawaka': {
    hs: 'Mishawaka High School',
    district: 'School City of Mishawaka',
    usNewsNational: 7786, usNewsState: 210,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Mishawaka High School ranks 210th in Indiana; Penn High School is physically sited in Mishawaka but belongs to the separate Penn-Harris-Madison district and does not serve Mishawaka’s own students.'
  },
  'Goshen': {
    hs: 'Goshen High School',
    district: 'Goshen Community Schools',
    usNewsNational: 9075, usNewsState: 236,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Goshen High School ranks 236th in Indiana.'
  },
  'Granger': {
    hs: 'Penn High School',
    district: 'Penn-Harris-Madison School Corp',
    usNewsNational: 1523, usNewsState: 28,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Penn High School ranks 28th in Indiana, the strongest school in the South Bend metro -- the sole comprehensive high school for all of Penn-Harris-Madison’s territory, including Granger.'
  },
  // Key disambiguated as 'Niles (MI)' -- collides by bare name with the
  // pre-existing Chicagoland 'Niles' (Cook County, IL). index.html's
  // composite_score block and buildRows() both special-case this the same
  // way the existing 'Winfield (IN)' collision is handled (search this repo
  // for "Niles' && d.state === 'MI'" if this key is ever renamed).
  'Niles (MI)': {
    hs: 'Niles Senior High School',
    district: 'Niles Community Schools',
    usNewsNational: 6114, usNewsState: 218,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Niles Senior High School ranks 218th in Michigan; unlike Indiana, Michigan publishes a genuine points-based average SAT score per school (949.5, 2024-25) via mischooldata.org.'
  },
  'Notre Dame': {
    hs: ['Adams High School', 'Riley High School', 'Washington High School'],
    district: 'South Bend Community School Corp',
    usNewsNational: 6194, usNewsState: 165,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Notre Dame (unincorporated, adjacent to the University) was formerly zoned to Clay High School, which closed after 2023-24; now splits like South Bend proper across Adams, Riley, and Washington by address.'
  },
  'Dunlap': {
    hs: 'Concord Community High School',
    district: 'Concord Community Schools',
    usNewsNational: 7710, usNewsState: 206,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Concord Community Schools, headquartered in Dunlap, ranks 206th in Indiana.'
  },
  'Bremen': {
    hs: 'Bremen Senior High School',
    district: 'Bremen Public Schools',
    usNewsNational: 4606, usNewsState: 113,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Bremen Senior High School ranks 113th in Indiana.'
  },
  'Simonton Lake': {
    hs: 'Elkhart High School',
    district: 'Elkhart Community Schools',
    usNewsNational: 10751, usNewsState: 264,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Simonton Lake shares Elkhart High School (264th in IN) with the city of Elkhart.'
  },

  // ── JAMESTOWN METRO (NY), added 2026-09-14 ──────────────────────────────
  // School district boundaries verified, not assumed -- Southwestern CSD's
  // own district description explicitly names Lakewood, Celoron, and the
  // "suburban area of West Ellicott" as the villages/areas it serves;
  // Ripley's own high school building closed and its 7-12 students have
  // attended Chautauqua Lake CSD (Mayville) on a tuition contract since
  // 2013-14, confirmed via a NY State Comptroller audit of that district.
  'Jamestown': {
    hs: 'Jamestown High School',
    district: 'Jamestown Public Schools',
    usNewsNational: 12495, usNewsState: 631,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Jamestown High School, ranked 631st in New York.'
  },
  'Dunkirk': {
    hs: 'Dunkirk Senior High School',
    district: 'Dunkirk City School District',
    usNewsNational: 15664, usNewsState: 1123,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Dunkirk Senior High School falls in a US News band rank (13,427-17,901 national, 1,012-1,233 state) rather than a precise single rank.'
  },
  'Fredonia': {
    hs: 'Fredonia High School',
    district: 'Fredonia Central School District',
    usNewsNational: 1893, usNewsState: 182,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Fredonia High School, ranked 182nd in New York -- the strongest school in the Jamestown metro, in a village that is also home to SUNY Fredonia.'
  },
  'Westfield': {
    hs: 'Westfield High School',
    district: 'Westfield Academy and Central School',
    usNewsNational: 4115, usNewsState: 364,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Westfield High School, ranked 364th in New York.'
  },
  'Lakewood': {
    hs: 'Southwestern Senior High School',
    district: 'Southwestern Central School District',
    usNewsNational: 3305, usNewsState: 307,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Southwestern CSD, ranked 307th in New York, explicitly serves the villages of Lakewood and Celoron plus the Town of Busti and the West Ellicott suburban area -- shared with those places below.'
  },
  'Celoron': {
    hs: 'Southwestern Senior High School',
    district: 'Southwestern Central School District',
    usNewsNational: 3305, usNewsState: 307,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Celoron shares Southwestern Senior High School (307th in NY) with Lakewood and West Ellicott.'
  },
  'Jamestown West': {
    hs: 'Southwestern Senior High School',
    district: 'Southwestern Central School District',
    usNewsNational: 3305, usNewsState: 307,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Jamestown West (West Ellicott) shares Southwestern Senior High School (307th in NY) with Lakewood and Celoron.'
  },
  'Silver Creek': {
    hs: 'Silver Creek High School',
    district: 'Silver Creek Central School District',
    usNewsNational: 10650, usNewsState: 841,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Silver Creek High School, ranked 841st in New York.'
  },
  'Falconer': {
    hs: 'Falconer Middle/High School',
    district: 'Falconer Central School District',
    usNewsNational: 7197, usNewsState: 622,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Falconer Middle/High School, ranked 622nd in New York.'
  },
  'Frewsburg': {
    hs: 'Frewsburg Junior-Senior High School',
    district: 'Frewsburg Central School District',
    usNewsNational: 9348, usNewsState: 762,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Frewsburg Junior-Senior High School, ranked 762nd in New York.'
  },
  'Cassadaga': {
    hs: 'Cassadaga Valley High School',
    district: 'Cassadaga Valley Central School District',
    usNewsNational: 13178, usNewsState: 993,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Cassadaga Valley High School (993rd in NY) also serves Sinclairville.'
  },
  'Sinclairville': {
    hs: 'Cassadaga Valley High School',
    district: 'Cassadaga Valley Central School District',
    usNewsNational: 13178, usNewsState: 993,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Sinclairville shares Cassadaga Valley High School (993rd in NY) with Cassadaga.'
  },
  'Brocton': {
    hs: 'Brocton Middle High School',
    district: 'Brocton Central School District',
    usNewsNational: 15664, usNewsState: 1123,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Brocton Middle High School falls in a US News band rank (13,427-17,901 national, 1,012-1,233 state) rather than a precise single rank.'
  },
  'Sherman': {
    hs: 'Sherman High School',
    district: 'Sherman Central School District',
    usNewsNational: 6538, usNewsState: 545,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Sherman High School, ranked 545th in New York.'
  },
  'Ripley': {
    hs: 'Chautauqua Lake Secondary School',
    district: 'Chautauqua Lake Central School District',
    usNewsNational: 3249, usNewsState: 302,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ripley's own high school building closed; its 7-12 students attend Chautauqua Lake Secondary School (302nd in NY, in Mayville) on a tuition contract since 2013-14."
  },
  'Mayville': {
    hs: 'Chautauqua Lake Secondary School',
    district: 'Chautauqua Lake Central School District',
    usNewsNational: 3249, usNewsState: 302,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Chautauqua Lake Secondary School, ranked 302nd in New York -- the second-strongest school in the Jamestown metro. Also serves Ripley.'
  },
  'Forestville': {
    hs: 'Forestville Central High School',
    district: 'Forestville Central School District',
    usNewsNational: 15703, usNewsState: 979,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Forestville Central High School falls in a US News band rank (13,460-17,945 national, 726-1,232 state) rather than a precise single rank.'
  },

  // ── AUSTIN METRO (TX), added 2026-09-14 ─────────────────────────────────
  // District/school assignment individually verified per town (district's
  // own attendance-zone materials or a NY-State-Comptroller-style official
  // source), not assumed from name similarity. Austin ISD alone runs ~23
  // comprehensive high schools; Austin HS below is ONE representative
  // example (a real zoned comprehensive school with real TEA SAT/ACT data),
  // not a claim that every Austin ISD student attends it -- a full per-
  // neighborhood AISD breakdown is planned as its own later phase (the
  // tract-level detail phase), not attempted here at the town-record level.
  'Austin': {
    hs: 'Austin High School',
    district: 'Austin ISD',
    usNewsNational: null, usNewsState: null,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Austin ISD runs about 23 comprehensive high schools; Austin High School is shown as one representative zoned campus with real TEA-verified SAT/ACT data, not a single citywide rank -- a fuller per-neighborhood breakdown is a separate, later phase of this project.'
  },
  'Manchaca': {
    hs: 'Austin High School',
    district: 'Austin ISD',
    usNewsNational: null, usNewsState: null,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Part of Austin ISD (~23 comprehensive high schools); Austin High School shown as a representative example, not this specific area’s confirmed zoned school.'
  },
  'San Leanna': {
    hs: 'Austin High School',
    district: 'Austin ISD',
    usNewsNational: null, usNewsState: null,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Part of Austin ISD (~23 comprehensive high schools); Austin High School shown as a representative example, not this specific area’s confirmed zoned school.'
  },
  'Shady Hollow': {
    hs: 'Austin High School',
    district: 'Austin ISD',
    usNewsNational: null, usNewsState: null,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Part of Austin ISD (~23 comprehensive high schools); Austin High School shown as a representative example, not this specific area’s confirmed zoned school.'
  },
  'Sunset Valley': {
    hs: 'Austin High School',
    district: 'Austin ISD',
    usNewsNational: null, usNewsState: null,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Part of Austin ISD (~23 comprehensive high schools); Austin High School shown as a representative example, not this specific area’s confirmed zoned school.'
  },
  'Barton Creek': {
    hs: 'Austin High School',
    district: 'Austin ISD',
    usNewsNational: null, usNewsState: null,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Most of Barton Creek falls in Austin ISD; Austin High School shown as a representative example, not a confirmed zoned school for this specific area.'
  },
  'West Lake Hills': {
    hs: 'Westlake High School',
    district: 'Eanes ISD',
    usNewsNational: 376, usNewsState: 53,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Westlake High School (Eanes ISD), ranked 53rd in Texas -- the strongest school in the Austin metro portion of this dataset.'
  },
  'Rollingwood': {
    hs: 'Westlake High School',
    district: 'Eanes ISD',
    usNewsNational: 376, usNewsState: 53,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Rollingwood shares Westlake High School (53rd in Texas) with West Lake Hills and Lost Creek.'
  },
  'Lost Creek': {
    hs: 'Westlake High School',
    district: 'Eanes ISD',
    usNewsNational: 376, usNewsState: 53,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Lost Creek shares Westlake High School (53rd in Texas) with West Lake Hills and Rollingwood.'
  },
  'Bee Cave': {
    hs: 'Lake Travis High School',
    district: 'Lake Travis ISD',
    usNewsNational: 1172, usNewsState: 151,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Bee Cave splits across Lake Travis ISD, Eanes ISD, and Hays CISD depending on the specific parcel; Lake Travis HS (151st in Texas) shown as the primary district.'
  },
  'Briarcliff': {
    hs: 'Lake Travis High School',
    district: 'Lake Travis ISD',
    usNewsNational: 1172, usNewsState: 151,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Lake Travis High School, ranked 151st in Texas, also serves Hudson Bend, The Hills, and Lakeway.'
  },
  'Hudson Bend': {
    hs: 'Lake Travis High School',
    district: 'Lake Travis ISD',
    usNewsNational: 1172, usNewsState: 151,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Lake Travis High School, ranked 151st in Texas, also serves Briarcliff, The Hills, and Lakeway.'
  },
  'The Hills': {
    hs: 'Lake Travis High School',
    district: 'Lake Travis ISD',
    usNewsNational: 1172, usNewsState: 151,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Lake Travis High School, ranked 151st in Texas, also serves Briarcliff, Hudson Bend, and Lakeway.'
  },
  'Lakeway': {
    hs: 'Lake Travis High School',
    district: 'Lake Travis ISD',
    usNewsNational: 1172, usNewsState: 151,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Lake Travis High School, ranked 151st in Texas, also serves Briarcliff, Hudson Bend, and The Hills.'
  },
  'Creedmoor': {
    hs: 'Del Valle High School',
    district: 'Del Valle ISD',
    usNewsNational: 15703, usNewsState: 1452,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Del Valle High School falls in a US News band rank (13,460-17,945 national, 1,311-1,592 state). Also serves Garfield, Hornsby Bend, and Mustang Ridge.'
  },
  'Garfield': {
    hs: 'Del Valle High School',
    district: 'Del Valle ISD',
    usNewsNational: 15703, usNewsState: 1452,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Del Valle High School falls in a US News band rank (13,460-17,945 national, 1,311-1,592 state). Also serves Creedmoor, Hornsby Bend, and Mustang Ridge.'
  },
  'Hornsby Bend': {
    hs: 'Del Valle High School',
    district: 'Del Valle ISD',
    usNewsNational: 15703, usNewsState: 1452,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Del Valle High School falls in a US News band rank (13,460-17,945 national, 1,311-1,592 state). Also serves Creedmoor, Garfield, and Mustang Ridge.'
  },
  'Mustang Ridge': {
    hs: 'Del Valle High School',
    district: 'Del Valle ISD',
    usNewsNational: 15703, usNewsState: 1452,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Del Valle High School falls in a US News band rank (13,460-17,945 national, 1,311-1,592 state). Also serves Creedmoor, Garfield, and Hornsby Bend.'
  },
  'Jonestown': {
    hs: 'Lago Vista High School',
    district: 'Lago Vista ISD',
    usNewsNational: 7441, usNewsState: 643,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Jonestown splits between Leander ISD and Lago Vista ISD (Lago Vista ISD’s own materials note it takes "portions of nearby Jonestown"); Lago Vista HS (643rd in Texas) shown as one real zoned option, not confirmed for every address in town.'
  },
  'Lago Vista': {
    hs: 'Lago Vista High School',
    district: 'Lago Vista ISD',
    usNewsNational: 7441, usNewsState: 643,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Lago Vista High School, ranked 643rd in Texas, also serves Point Venture.'
  },
  'Point Venture': {
    hs: 'Lago Vista High School',
    district: 'Lago Vista ISD',
    usNewsNational: 7441, usNewsState: 643,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Point Venture shares Lago Vista High School (643rd in Texas) with the village of Lago Vista.'
  },
  'Steiner Ranch': {
    hs: 'Vandegrift High School',
    district: 'Leander ISD',
    usNewsNational: 798, usNewsState: 107,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Vandegrift High School (Leander ISD), ranked 107th in Texas, zones most of Steiner Ranch. Also serves Cedar Park, Leander, and Volente.'
  },
  'Volente': {
    hs: 'Vandegrift High School',
    district: 'Leander ISD',
    usNewsNational: 798, usNewsState: 107,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Vandegrift High School (Leander ISD), ranked 107th in Texas. Also serves Cedar Park, Leander, and Steiner Ranch.'
  },
  'Manor': {
    hs: 'Manor High School',
    district: 'Manor ISD',
    usNewsNational: 15664, usNewsState: 1403,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Manor High School falls in a US News band rank (13,427-17,901 national, 1,227-1,578 state). Manor ISD also runs Manor New Technology High School.'
  },
  'Pflugerville': {
    hs: 'Hendrickson High School',
    district: 'Pflugerville ISD',
    usNewsNational: 1607, usNewsState: 204,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Hendrickson High School, ranked 204th in Texas -- one of Pflugerville ISD’s comprehensive high schools.'
  },
  'Wells Branch': {
    hs: 'Westwood High School',
    district: 'Round Rock ISD',
    usNewsNational: 419, usNewsState: 59,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Unresolved with full confidence: sources conflict on whether Wells Branch falls in Round Rock ISD or Pflugerville ISD. Westwood High School (Round Rock ISD, 59th in Texas) shown as the more commonly cited option, not a verified certainty.'
  },
  'Bartlett': {
    hs: 'Bartlett Schools',
    district: 'Bartlett ISD',
    usNewsNational: 15664, usNewsState: 1403,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Bartlett Schools (a single K-12 campus) falls in a US News band rank (13,427-17,901 national, 1,227-1,578 state).'
  },
  'Brushy Creek': {
    hs: 'Westwood High School',
    district: 'Round Rock ISD',
    usNewsNational: 419, usNewsState: 59,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Westwood High School, ranked 59th in Texas -- the highest-ranked of Round Rock ISD’s 7 high schools. Also serves the city of Round Rock.'
  },
  'Round Rock': {
    hs: 'Westwood High School',
    district: 'Round Rock ISD',
    usNewsNational: 419, usNewsState: 59,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Round Rock ISD runs 5 comprehensive high schools (Westwood, Round Rock HS, McNeil, Cedar Ridge, Stony Point -- the district lists 10 total campuses, but the rest are alternative/choice/disciplinary programs, not comprehensive); Westwood HS (59th in Texas, the district’s highest-ranked) shown as one representative campus, not a single citywide rank.'
  },
  'Cedar Park': {
    hs: 'Vandegrift High School',
    district: 'Leander ISD',
    usNewsNational: 798, usNewsState: 107,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Leander ISD runs 6 comprehensive high schools (Vandegrift, Cedar Park, Vista Ridge, Rouse, Leander, Glenn -- New Hope HS and Leander Extended Opportunity are alternative campuses, not comprehensive); Vandegrift HS (107th in Texas, the district’s highest-ranked) shown as one representative campus serving part of Cedar Park.'
  },
  'Leander': {
    hs: 'Vandegrift High School',
    district: 'Leander ISD',
    usNewsNational: 798, usNewsState: 107,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Leander ISD runs 6 comprehensive high schools (Vandegrift, Cedar Park, Vista Ridge, Rouse, Leander, Glenn -- New Hope HS and Leander Extended Opportunity are alternative campuses, not comprehensive); Vandegrift HS (107th in Texas, the district’s highest-ranked) shown as one representative campus serving part of Leander.'
  },
  'Florence': {
    hs: 'Florence High School',
    district: 'Florence ISD',
    usNewsNational: 12310, usNewsState: 1206,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Florence High School, ranked 1,206th in Texas.'
  },
  'Georgetown': {
    hs: 'Georgetown High School',
    district: 'Georgetown ISD',
    usNewsNational: 5410, usNewsState: 531,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Georgetown High School, ranked 531st in Texas -- higher-ranked than East View HS, Georgetown ISD’s other comprehensive high school.'
  },
  'Serenada': {
    hs: 'Georgetown High School',
    district: 'Georgetown ISD',
    usNewsNational: 5410, usNewsState: 531,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Georgetown High School, ranked 531st in Texas.'
  },
  'Granger': {
    hs: 'Granger School',
    district: 'Granger ISD',
    usNewsNational: null, usNewsState: null,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Granger ISD opened a new combined junior-high/high-school campus in 2026; no current US News rank exists yet for the new campus.'
  },
  'Hutto': {
    hs: 'Hutto High School',
    district: 'Hutto ISD',
    usNewsNational: 12524, usNewsState: 1226,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Hutto High School, ranked 1,226th in Texas.'
  },
  'Jarrell': {
    hs: 'Jarrell High School',
    district: 'Jarrell ISD',
    usNewsNational: 11675, usNewsState: 1066,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Jarrell High School, ranked 1,066th in Texas. Also serves Sonterra.'
  },
  'Sonterra': {
    hs: 'Jarrell High School',
    district: 'Jarrell ISD',
    usNewsNational: 11675, usNewsState: 1066,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Sonterra shares Jarrell High School (1,066th in Texas) with the town of Jarrell.'
  },
  'Liberty Hill': {
    hs: 'Liberty Hill High School',
    district: 'Liberty Hill ISD',
    usNewsNational: 4638, usNewsState: 464,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Liberty Hill High School, ranked 464th in Texas.'
  },
  'Santa Rita Ranch': {
    hs: 'Liberty Hill High School',
    district: 'Liberty Hill ISD',
    usNewsNational: 4638, usNewsState: 464,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Santa Rita Ranch splits between Liberty Hill ISD (zoned to the brand-new Legacy Ranch HS, opened 2026, too new for a US News rank) and Georgetown ISD; Liberty Hill HS shown as the nearest ranked option, not a confirmed zoned school.'
  },
  'Taylor': {
    hs: 'Taylor High School',
    district: 'Taylor ISD',
    usNewsNational: 15703, usNewsState: 1452,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Taylor High School falls in a US News band rank (13,460-17,945 national, 1,311-1,592 state).'
  },
  'Thrall': {
    hs: 'Thrall High School',
    district: 'Thrall ISD',
    usNewsNational: 4653, usNewsState: 410,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Thrall High School, ranked 410th in Texas.'
  },
  'Bear Creek': {
    hs: 'Jack C. Hays High School',
    district: 'Hays CISD',
    usNewsNational: 5118, usNewsState: 507,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Jack C. Hays High School, ranked 507th in Texas -- the highest-ranked of Hays CISD’s 3 comprehensive high schools (Hays, Johnson, Lehman; a 4th was under construction, not yet open, as of this data).'
  },
  'Buda': {
    hs: 'Jack C. Hays High School',
    district: 'Hays CISD',
    usNewsNational: 5118, usNewsState: 507,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Jack C. Hays High School, ranked 507th in Texas -- the highest-ranked of Hays CISD’s 3 comprehensive high schools (Hays, Johnson, Lehman; a 4th was under construction, not yet open, as of this data).'
  },
  'Kyle': {
    hs: 'Jack C. Hays High School',
    district: 'Hays CISD',
    usNewsNational: 5118, usNewsState: 507,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Jack C. Hays High School, ranked 507th in Texas -- the highest-ranked of Hays CISD’s 3 comprehensive high schools (Hays, Johnson, Lehman; a 4th was under construction, not yet open, as of this data).'
  },
  'Mountain City': {
    hs: 'Jack C. Hays High School',
    district: 'Hays CISD',
    usNewsNational: 5118, usNewsState: 507,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Jack C. Hays High School, ranked 507th in Texas -- the highest-ranked of Hays CISD’s 3 comprehensive high schools (Hays, Johnson, Lehman; a 4th was under construction, not yet open, as of this data).'
  },
  'Uhland': {
    hs: 'Jack C. Hays High School',
    district: 'Hays CISD',
    usNewsNational: 5118, usNewsState: 507,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Jack C. Hays High School, ranked 507th in Texas -- the highest-ranked of Hays CISD’s 3 comprehensive high schools (Hays, Johnson, Lehman; a 4th was under construction, not yet open, as of this data).'
  },
  'Niederwald': {
    hs: 'Jack C. Hays High School',
    district: 'Hays CISD',
    usNewsNational: 5118, usNewsState: 507,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Mostly Hays CISD (a small slice may fall in Lockhart ISD instead); Jack C. Hays High School, ranked 507th in Texas, shown as the primary option.'
  },
  'Belterra': {
    hs: 'Dripping Springs High School',
    district: 'Dripping Springs ISD',
    usNewsNational: 2108, usNewsState: 259,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Dripping Springs High School, ranked 259th in Texas.'
  },
  'Dripping Springs': {
    hs: 'Dripping Springs High School',
    district: 'Dripping Springs ISD',
    usNewsNational: 2108, usNewsState: 259,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Dripping Springs High School, ranked 259th in Texas.'
  },
  'San Marcos': {
    hs: 'San Marcos High School',
    district: 'San Marcos CISD',
    usNewsNational: 13338, usNewsState: 1299,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'San Marcos High School, ranked 1,299th in Texas, in a city built around Texas State University -- also serves the village of Martindale.'
  },
  'Wimberley': {
    hs: 'Wimberley High School',
    district: 'Wimberley ISD',
    usNewsNational: 2387, usNewsState: 284,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Wimberley High School, ranked 284th in Texas.'
  },
  'Woodcreek': {
    hs: 'Wimberley High School',
    district: 'Wimberley ISD',
    usNewsNational: 2387, usNewsState: 284,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Woodcreek shares Wimberley High School (284th in Texas) with the village of Wimberley.'
  },
  'Bastrop': {
    hs: 'Bastrop High School',
    district: 'Bastrop ISD',
    usNewsNational: 9725, usNewsState: 968,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Bastrop High School, ranked 968th in Texas -- higher-ranked than Cedar Creek HS, Bastrop ISD’s other comprehensive high school.'
  },
  "Camp Swift": {
    hs: 'Bastrop High School',
    district: 'Bastrop ISD',
    usNewsNational: 9725, usNewsState: 968,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Bastrop High School, ranked 968th in Texas.'
  },
  'Cedar Creek': {
    hs: 'Bastrop High School',
    district: 'Bastrop ISD',
    usNewsNational: 9725, usNewsState: 968,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Bastrop High School, ranked 968th in Texas -- Bastrop ISD also runs Cedar Creek High School, ranked lower.'
  },
  'Circle D-Kc Estates': {
    hs: 'Bastrop High School',
    district: 'Bastrop ISD',
    usNewsNational: 9725, usNewsState: 968,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Bastrop High School, ranked 968th in Texas.'
  },
  'Wyldwood': {
    hs: 'Bastrop High School',
    district: 'Bastrop ISD',
    usNewsNational: 9725, usNewsState: 968,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Bastrop High School, ranked 968th in Texas.'
  },
  'Elgin': {
    hs: 'Elgin High School',
    district: 'Elgin ISD',
    usNewsNational: 15703, usNewsState: 1452,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Elgin High School falls in a US News band rank (13,460-17,945 national, 1,311-1,592 state).'
  },
  'Mcdade': {
    hs: 'McDade High School',
    district: 'McDade ISD',
    usNewsNational: 15703, usNewsState: 1452,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'McDade High School falls in a US News band rank (13,460-17,945 national, 1,311-1,592 state).'
  },
  'Rosanky': {
    hs: 'Smithville High School',
    district: 'Smithville ISD',
    usNewsNational: 11826, usNewsState: 1083,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Smithville High School, ranked 1,083rd in Texas.'
  },
  'Smithville': {
    hs: 'Smithville High School',
    district: 'Smithville ISD',
    usNewsNational: 11826, usNewsState: 1083,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Smithville High School, ranked 1,083rd in Texas.'
  },
  'Lockhart': {
    hs: 'Lockhart High School',
    district: 'Lockhart ISD',
    usNewsNational: 12206, usNewsState: 1116,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Lockhart High School, ranked 1,116th in Texas.'
  },
  'Luling': {
    hs: 'Luling High School',
    district: 'Luling ISD',
    usNewsNational: 15664, usNewsState: 1403,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Luling High School falls in a US News band rank (13,427-17,901 national, 1,227-1,578 state).'
  },
  'Martindale': {
    hs: 'San Marcos High School',
    district: 'San Marcos CISD',
    usNewsNational: 13338, usNewsState: 1299,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Martindale shares San Marcos High School (1,299th in Texas) with the city of San Marcos.'
  },

  // ── KANKAKEE COUNTY (added 2026-09-18, implementation_brief.md #11 "no
  // decision needed" item -- these 5 towns had complete demographic
  // histories but zero school_data_lookup.js entries at all. US News
  // national/state ranks verified live against usnews.com's 2026-2027
  // Best High Schools edition; stateGrade/niche/avgACT/avgSAT left null,
  // same as every other town in this file where that research wasn't
  // independently done, rather than guessed. ──────────────────────────
  'Kankakee': {
    hs: 'Kankakee High School',
    district: 'Kankakee SD 111',
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Kankakee High School falls in a US News band rank (13,460-17,945 national, 469-675 Illinois) rather than a precise number.'
  },
  'Bourbonnais': {
    hs: 'Bradley-Bourbonnais C High School',
    district: 'Bradley-Bourbonnais Community HSD 307',
    usNewsNational: 3437, usNewsState: 138,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Bourbonnais shares Bradley-Bourbonnais Community High School, ranked 138th in Illinois, with the town of Bradley.'
  },
  'Bradley': {
    hs: 'Bradley-Bourbonnais C High School',
    district: 'Bradley-Bourbonnais Community HSD 307',
    usNewsNational: 3437, usNewsState: 138,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Bradley shares Bradley-Bourbonnais Community High School, ranked 138th in Illinois, with the town of Bourbonnais.'
  },
  'Manteno': {
    hs: 'Manteno High School',
    district: 'Manteno CUSD 5',
    usNewsNational: 4458, usNewsState: 175,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Manteno High School ranks 175th in Illinois with a 92% graduation rate.'
  },
  'Momence': {
    hs: 'Momence High School',
    district: 'Momence CUSD 1',
    usNewsNational: 10491, usNewsState: 367,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Momence High School ranks 367th in Illinois.'
  },

  // === INDIANAPOLIS METRO SCHOOL_DATA START ===
  "Alexandria (IN)": {
    hs: "Alexandria-Monroe High School",
    district: "Alexandria Community School Corporation",
    usNewsNational: 6694, usNewsState: 181,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Alexandria Community School Corporation operates the town's high school. Alexandria-Monroe High School (#181 in Indiana) enrolls 433 students in grades 9-12 with a 88% graduation rate and a 32% AP-exam participation rate."
  },
  "Anderson (IN)": {
    hs: "Anderson High School",
    district: "Anderson Community School Corporation",
    usNewsNational: 15702, usNewsState: 362,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Anderson Community School Corporation covers about 99.9% of residents. Anderson High School (in the unranked-bottom band, 321–404 in Indiana) enrolls 1,768 students in grades 9-12 with a 80% graduation rate and a 5% AP-exam participation rate."
  },
  "Arcadia (IN)": {
    hs: "Hamilton Heights High School",
    district: "Hamilton Heights School Corporation",
    usNewsNational: 3281, usNewsState: 76,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Hamilton Heights School Corporation covers the whole town. Hamilton Heights High School (#76 in Indiana) enrolls 709 students in grades 9-12 with a 95% graduation rate and a 32% AP-exam participation rate."
  },
  "Atlanta (IN)": {
    hs: "Hamilton Heights High School",
    district: "Hamilton Heights School Corporation",
    feedsTo: "Hamilton Heights High School",
    usNewsNational: 3281, usNewsState: 76,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Atlanta is served by the Hamilton Heights School Corporation; its high school is in neighboring Arcadia. Hamilton Heights High School (#76 in Indiana) enrolls 709 students in grades 9-12 with a 95% graduation rate and a 32% AP-exam participation rate."
  },
  "Avon (IN)": {
    hs: "Avon High School",
    district: "Avon Community School Corporation",
    usNewsNational: 1052, usNewsState: 18,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Avon Community School Corporation covers virtually all of the town. Avon High School (#18 in Indiana) enrolls 3,518 students in grades 9-12 with a 97% graduation rate and a 51% AP-exam participation rate."
  },
  "Bargersville (IN)": {
    hs: "Center Grove High School",
    district: "Center Grove Community School Corporation",
    feedsTo: "Center Grove High School",
    usNewsNational: 1876, usNewsState: 38,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "About 92% of residents are in Center Grove Community School Corporation; the remainder are in Franklin Community Schools. Center Grove High School (#38 in Indiana) enrolls 2,956 students in grades 9-12 with a 94% graduation rate and a 45% AP-exam participation rate."
  },
  "Beech Grove (IN)": {
    hs: "Beech Grove Senior High School",
    district: "Beech Grove City Schools",
    usNewsNational: 12271, usNewsState: 295,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Beech Grove City Schools is a stand-alone city district that covers about 97% of residents. Beech Grove Senior High School (#295 in Indiana) enrolls 914 students in grades 9-12 with a 86% graduation rate and a 33% AP-exam participation rate."
  },
  "Belleville (IN)": {
    hs: "Cascade Senior High School",
    district: "Mill Creek Community School Corporation",
    feedsTo: "Cascade Senior High School",
    usNewsNational: 3040, usNewsState: 68,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Belleville lies inside Mill Creek Community School Corporation per Census school-district boundaries; its only high school is in Clayton. Cascade Senior High School (#68 in Indiana) enrolls 537 students in grades 9-12 with a 95% graduation rate and a 27% AP-exam participation rate."
  },
  "Boggstown (IN)": {
    hs: "Triton Central High School",
    district: "Northwestern Consolidated School Corporation (Triton Central Schools)",
    feedsTo: "Triton Central High School",
    usNewsNational: 10866, usNewsState: 265,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Boggstown is in Northwestern Consolidated School Corporation per Census boundaries; its high school is Triton Central. Triton Central High School (#265 in Indiana) enrolls 471 students in grades 9-12 with a 87% graduation rate."
  },
  "Brooklyn (IN)": {
    hs: ["Martinsville High School", "Mooresville High School"],
    district: ["MSD of Martinsville Schools", "Mooresville Consolidated School Corp"],
    feedsTo: "Martinsville High School / Mooresville High School",
    usNewsNational: 7242, usNewsState: 195,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Brooklyn is split between the MSD of Martinsville (which runs Brooklyn Elementary) and Mooresville Consolidated schools. Martinsville High School (#273 in Indiana) enrolls 1,281 students in grades 9-12 with a 84% graduation rate and a 28% AP-exam participation rate. Also: Mooresville High School (#195 in Indiana) enrolls 1,372 students in grades 9-12 with a 99% graduation rate and a 39% AP-exam participation rate."
  },
  "Browns Crossing (IN)": {
    hs: "Martinsville High School",
    district: "MSD of Martinsville Schools",
    feedsTo: "Martinsville High School",
    usNewsNational: 11198, usNewsState: 273,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Browns Crossing is inside the MSD of Martinsville Schools per Census boundaries; the high school is in Martinsville. Martinsville High School (#273 in Indiana) enrolls 1,281 students in grades 9-12 with a 84% graduation rate and a 28% AP-exam participation rate."
  },
  "Brownsburg (IN)": {
    hs: "Brownsburg High School",
    district: "Brownsburg Community School Corporation",
    usNewsNational: 722, usNewsState: 11,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Brownsburg Community School Corporation covers about 98% of residents. Brownsburg High School (#11 in Indiana) enrolls 3,331 students in grades 9-12 with a 99% graduation rate and a 53% AP-exam participation rate."
  },
  "Carmel (IN)": {
    hs: "Carmel High School",
    district: "Carmel Clay Schools",
    usNewsNational: 316, usNewsState: 7,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Carmel Clay Schools has a single comprehensive high school. Carmel High School (#7 in Indiana) enrolls 5,239 students in grades 9-12 with a 97% graduation rate and a 64% AP-exam participation rate."
  },
  "Chesterfield (IN)": {
    hs: "Anderson High School",
    district: "Anderson Community School Corporation",
    feedsTo: "Anderson High School",
    usNewsNational: 15702, usNewsState: 362,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "About 99.7% of Chesterfield residents are in Anderson Community School Corporation (a sliver in Delaware County is Daleville). Anderson High School (in the unranked-bottom band, 321–404 in Indiana) enrolls 1,768 students in grades 9-12 with a 80% graduation rate and a 5% AP-exam participation rate."
  },
  "Cicero (IN)": {
    hs: "Hamilton Heights High School",
    district: "Hamilton Heights School Corporation",
    feedsTo: "Hamilton Heights High School",
    usNewsNational: 3281, usNewsState: 76,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Cicero is served by the Hamilton Heights School Corporation, whose high school is in neighboring Arcadia. Hamilton Heights High School (#76 in Indiana) enrolls 709 students in grades 9-12 with a 95% graduation rate and a 32% AP-exam participation rate."
  },
  "Clayton (IN)": {
    hs: "Cascade Senior High School",
    district: "Mill Creek Community School Corporation",
    usNewsNational: 3040, usNewsState: 68,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Mill Creek Community School Corporation has one high school, in Clayton. Cascade Senior High School (#68 in Indiana) enrolls 537 students in grades 9-12 with a 95% graduation rate and a 27% AP-exam participation rate."
  },
  "Clermont (IN)": {
    hs: ["Ben Davis High School", "Pike High School"],
    district: ["M S D Wayne Township", "M S D Pike Township"],
    feedsTo: "Ben Davis High School / Pike High School",
    usNewsNational: 4170, usNewsState: 102,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Clermont is split between MSD of Wayne Township (Ben Davis High School) and MSD of Pike Township (Pike High School). Ben Davis High School (in the unranked-bottom band, 321–404 in Indiana) enrolls 3,315 students in grades 9-12 with a 78% graduation rate and a 25% AP-exam participation rate. Also: Pike High School (#102 in Indiana) enrolls 3,188 students in grades 9-12 with a 95% graduation rate and a 30% AP-exam participation rate."
  },
  "Coatesville (IN)": {
    hs: "Cascade Senior High School",
    district: "Mill Creek Community School Corporation",
    feedsTo: "Cascade Senior High School",
    usNewsNational: 3040, usNewsState: 68,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Coatesville is in Mill Creek Community School Corporation, whose only high school is in Clayton. Cascade Senior High School (#68 in Indiana) enrolls 537 students in grades 9-12 with a 95% graduation rate and a 27% AP-exam participation rate."
  },
  "Cordry Sweetwater Lakes (IN)": {
    hs: "Brown County High School",
    district: "Brown County School Corporation",
    feedsTo: "Brown County High School",
    usNewsNational: 5845, usNewsState: 155,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Brown County School Corporation is the only school corporation in the county. Brown County High School (#155 in Indiana) enrolls 454 students in grades 9-12 with a 89% graduation rate and a 47% AP-exam participation rate."
  },
  "Cumberland (IN)": {
    hs: ["Mt Vernon High School", "Warren Central High School", "New Palestine High School"],
    district: ["Mt Vernon Community School Corp", "MSD of Warren Township", "Southern Hancock County Community School Corp"],
    feedsTo: "Mt Vernon High School / Warren Central High School / New Palestine High School",
    usNewsNational: 1837, usNewsState: 35,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Cumberland straddles the Marion/Hancock county line and three school corporations (2020 census-block population shares), so students attend Mt. Vernon, Warren Central or New Palestine depending on address. Mt Vernon High School (#47 in Indiana) enrolls 1,470 students in grades 9-12 with a 94% graduation rate and a 44% AP-exam participation rate. Also: Warren Central High School (#258 in Indiana) enrolls 3,364 students in grades 9-12 with a 88% graduation rate and a 16% AP-exam participation rate."
  },
  "Danville (IN)": {
    hs: "Danville Community High School",
    district: "Danville Community School Corporation",
    usNewsNational: 2368, usNewsState: 49,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Danville Community School Corporation covers about 94% of residents; the rest are in Avon Community Schools. Danville Community High School (#49 in Indiana) enrolls 848 students in grades 9-12 with a 93% graduation rate and a 46% AP-exam participation rate."
  },
  "Edgewood (IN)": {
    hs: "Anderson High School",
    district: "Anderson Community School Corporation",
    feedsTo: "Anderson High School",
    usNewsNational: 15702, usNewsState: 362,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Edgewood is in Anderson Community School Corporation, whose comprehensive high school is Anderson High School. Anderson High School (in the unranked-bottom band, 321–404 in Indiana) enrolls 1,768 students in grades 9-12 with a 80% graduation rate and a 5% AP-exam participation rate."
  },
  "Edinburgh (IN)": {
    hs: "Edinburgh Community High School",
    district: "Edinburgh Community School Corporation",
    usNewsNational: 6553, usNewsState: 178,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "About 87% of residents are in Edinburgh Community School Corporation; small annexed fringes lie in Bartholomew County and Southwestern Shelby County school corporations. Edinburgh Community High School (#178 in Indiana) enrolls 230 students in grades 9-12 with a 82% graduation rate and a 40% AP-exam participation rate."
  },
  "Elwood (IN)": {
    hs: "Elwood Community High School",
    district: "Elwood Community School Corporation",
    usNewsNational: 11285, usNewsState: 276,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Elwood Community School Corporation operates the town's high school. Elwood Community High School (#276 in Indiana) enrolls 441 students in grades 9-12 with a 92% graduation rate and a 17% AP-exam participation rate."
  },
  "Fairland (IN)": {
    hs: "Triton Central High School",
    district: "Northwestern Consolidated School Corporation (Triton Central Schools)",
    feedsTo: "Triton Central High School",
    usNewsNational: 10866, usNewsState: 265,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Triton Central High School is about two miles north of Fairland, in the Northwestern Consolidated district that serves the town. Triton Central High School (#265 in Indiana) enrolls 471 students in grades 9-12 with a 87% graduation rate."
  },
  "Fishers (IN)": {
    hs: ["Fishers High School", "Hamilton Southeastern High School"],
    district: ["Hamilton Southeastern Schools", "Hamilton Southeastern Schools"],
    usNewsNational: 428, usNewsState: 8,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Fishers spans Delaware and Fall Creek townships; Hamilton Southeastern Schools splits high-school attendance between Fishers High (most of Delaware Twp.) and Hamilton Southeastern High (most of Fall Creek Twp.). Fishers High School (#8 in Indiana) enrolls 3,590 students in grades 9-12 with a 99% graduation rate and a 63% AP-exam participation rate. Also: Hamilton Southeastern High School (#12 in Indiana) enrolls 3,504 students in grades 9-12 with a 96% graduation rate and a 56% AP-exam participation rate."
  },
  "Fortville (IN)": {
    hs: "Mt Vernon High School",
    district: "Mt Vernon Community School Corp",
    usNewsNational: 2277, usNewsState: 47,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Mt. Vernon Community School Corp is headquartered in Fortville and its high school is in the town. Mt Vernon High School (#47 in Indiana) enrolls 1,470 students in grades 9-12 with a 94% graduation rate and a 44% AP-exam participation rate."
  },
  "Foxcliff Estates (IN)": {
    hs: "Martinsville High School",
    district: "MSD of Martinsville Schools",
    feedsTo: "Martinsville High School",
    usNewsNational: 11198, usNewsState: 273,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Foxcliff Estates is inside the MSD of Martinsville Schools per Census boundaries; the high school is in Martinsville. Martinsville High School (#273 in Indiana) enrolls 1,281 students in grades 9-12 with a 84% graduation rate and a 28% AP-exam participation rate."
  },
  "Franklin (IN)": {
    hs: "Franklin Community High School",
    district: "Franklin Community School Corp",
    usNewsNational: 4702, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Franklin Community School Corp covers about 95% of residents. Franklin Community High School (#115 in Indiana) enrolls 1,531 students in grades 9-12 with a 76% graduation rate and a 36% AP-exam participation rate."
  },
  "Frankton (IN)": {
    hs: "Frankton Jr-Sr High School",
    district: "Frankton-Lapel Community Schools",
    usNewsNational: 5281, usNewsState: 139,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Frankton-Lapel Community Schools operates Frankton Jr-Sr High School in the town. Frankton Jr-Sr High School (#139 in Indiana) enrolls 511 students in grades 9-12 with a 87% graduation rate and a 26% AP-exam participation rate."
  },
  "Greenfield (IN)": {
    hs: "Greenfield-Central High School",
    district: "Greenfield-Central Community Schools",
    usNewsNational: 6338, usNewsState: 171,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Greenfield-Central Community Schools covers essentially all of the city. Greenfield-Central High School (#171 in Indiana) enrolls 1,413 students in grades 9-12 with a 81% graduation rate and a 34% AP-exam participation rate."
  },
  "Greenwood (IN)": {
    hs: ["Whiteland Community High School", "Greenwood Community High School", "Center Grove High School"],
    district: ["Clark-Pleasant Community School Corporation", "Greenwood Community Sch Corp", "Center Grove Community School Corporation"],
    usNewsNational: 1876, usNewsState: 38,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Greenwood is split three ways by school corporation (2020 census-block population shares), so residents attend Whiteland, Greenwood or Center Grove high schools depending on address. Whiteland Community High School (#174 in Indiana) enrolls 2,135 students in grades 9-12 with a 87% graduation rate and a 43% AP-exam participation rate. Also: Greenwood Community High School (#94 in Indiana) enrolls 1,223 students in grades 9-12 with a 96% graduation rate and a 20% AP-exam participation rate."
  },
  "Homecroft (IN)": {
    hs: "Southport High School",
    district: "MSD of Perry Township",
    feedsTo: "Southport High School",
    usNewsNational: 7132, usNewsState: 190,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Homecroft is in MSD of Perry Township and its zoned high school is Southport High School. Southport High School (#190 in Indiana) enrolls 2,419 students in grades 9-12 with a 90% graduation rate and a 29% AP-exam participation rate."
  },
  "Ingalls (IN)": {
    hs: "Pendleton Heights High School",
    district: "South Madison Community School Corporation",
    feedsTo: "Pendleton Heights High School",
    usNewsNational: 3326, usNewsState: 77,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "South Madison Community School Corporation's high school is Pendleton Heights, in Pendleton. Pendleton Heights High School (#77 in Indiana) enrolls 1,502 students in grades 9-12 with a 91% graduation rate and a 44% AP-exam participation rate."
  },
  "Jamestown (IN)": {
    hs: "Western Boone Jr-Sr High School",
    district: "Western Boone County Community School Corporation",
    feedsTo: "Western Boone Jr-Sr High School",
    usNewsNational: 3920, usNewsState: 95,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Nearly all residents (about 97%) are in the Western Boone County Community School Corporation, whose junior-senior high school is in neighboring Thorntown; a sliver of the town in Hendricks County is in North West Hendricks (Tri-West). Western Boone Jr-Sr High School (#95 in Indiana) enrolls 519 students in grades 9-12 with a 99% graduation rate and a 30% AP-exam participation rate."
  },
  "Lapel (IN)": {
    hs: "Lapel Senior High School",
    district: "Frankton-Lapel Community Schools (about 93%) and South Madison Community School Corporation (about 7%)",
    usNewsNational: 9711, usNewsState: 245,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "About 93% of residents are in Frankton-Lapel (Lapel Senior High); a small southern portion (about 7%) is in South Madison Community Schools. Lapel Senior High School (#245 in Indiana) enrolls 462 students in grades 9-12 with a 93% graduation rate."
  },
  "Lawrence (IN)": {
    hs: ["Lawrence Central High School", "Lawrence North High School"],
    district: ["M S D Lawrence Township", "M S D Lawrence Township"],
    feedsTo: "Lawrence Central High School / Lawrence North High School",
    usNewsNational: 7237, usNewsState: 194,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "MSD of Lawrence Township operates two comprehensive high schools (Lawrence Central and Lawrence North); which one a student attends depends on address. Lawrence Central High School (#229 in Indiana) enrolls 2,512 students in grades 9-12 with a 93% graduation rate and a 34% AP-exam participation rate. Also: Lawrence North High School (#194 in Indiana) enrolls 2,791 students in grades 9-12 with a 92% graduation rate and a 37% AP-exam participation rate."
  },
  "Lebanon (IN)": {
    hs: "Lebanon Senior High School",
    district: "Lebanon Community School Corp",
    usNewsNational: 3656, usNewsState: 89,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lebanon Community School Corp covers 99.7% of residents. Lebanon Senior High School (#89 in Indiana) enrolls 1,067 students in grades 9-12 with a 94% graduation rate and a 34% AP-exam participation rate."
  },
  "Lizton (IN)": {
    hs: "Tri-West Senior High School",
    district: "North West Hendricks Schools",
    usNewsNational: 1035, usNewsState: 17,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tri-West is North West Hendricks Schools' high school and sits in Lizton. Tri-West Senior High School (#17 in Indiana) enrolls 610 students in grades 9-12 with a 91% graduation rate and a 61% AP-exam participation rate."
  },
  "Markleville (IN)": {
    hs: "Pendleton Heights High School",
    district: "South Madison Community School Corporation",
    feedsTo: "Pendleton Heights High School",
    usNewsNational: 3326, usNewsState: 77,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "South Madison Community School Corporation's high school is Pendleton Heights, in Pendleton. Pendleton Heights High School (#77 in Indiana) enrolls 1,502 students in grades 9-12 with a 91% graduation rate and a 44% AP-exam participation rate."
  },
  "Martinsville (IN)": {
    hs: "Martinsville High School",
    district: "MSD of Martinsville Schools",
    usNewsNational: 11198, usNewsState: 273,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "MSD of Martinsville administers the town's public schools. Martinsville High School (#273 in Indiana) enrolls 1,281 students in grades 9-12 with a 84% graduation rate and a 28% AP-exam participation rate."
  },
  "McCordsville (IN)": {
    hs: "Mt Vernon High School",
    district: "Mt Vernon Community School Corp",
    feedsTo: "Mt Vernon High School",
    usNewsNational: 2277, usNewsState: 47,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "McCordsville is in Mt. Vernon Community School Corp; the high school is in neighboring Fortville. Mt Vernon High School (#47 in Indiana) enrolls 1,470 students in grades 9-12 with a 94% graduation rate and a 44% AP-exam participation rate."
  },
  "Meridian Hills (IN)": {
    hs: "North Central High School",
    district: "MSD of Washington Township",
    feedsTo: "North Central High School",
    usNewsNational: 3577, usNewsState: 85,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "About 99.7% of Meridian Hills is in MSD of Washington Township, whose sole comprehensive high school is North Central (one block is in Indianapolis Public Schools). North Central High School (#85 in Indiana) enrolls 3,682 students in grades 9-12 with a 89% graduation rate and a 40% AP-exam participation rate."
  },
  "Monrovia (IN)": {
    hs: "Monrovia High School",
    district: "Monroe-Gregg School District",
    usNewsNational: 9038, usNewsState: 234,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Monroe-Gregg School District's junior-senior high school is in the town. Monrovia High School (#234 in Indiana) enrolls 489 students in grades 9-12 with a 88% graduation rate and a 35% AP-exam participation rate."
  },
  "Mooresville (IN)": {
    hs: "Mooresville High School",
    district: "Mooresville Consolidated School Corp",
    usNewsNational: 7242, usNewsState: 195,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Mooresville Consolidated School Corp has one high school, in the town. Mooresville High School (#195 in Indiana) enrolls 1,372 students in grades 9-12 with a 99% graduation rate and a 39% AP-exam participation rate."
  },
  "Morgantown (IN)": {
    hs: "Indian Creek Senior High School",
    district: "Nineveh-Hensley-Jackson United School Corporation",
    feedsTo: "Indian Creek Senior High School",
    usNewsNational: 5488, usNewsState: 149,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Although in Morgan County, Morgantown lies within the Nineveh-Hensley-Jackson United School Corporation per Census school-district boundaries; its high school is Indian Creek in Trafalgar. Indian Creek Senior High School (#149 in Indiana) enrolls 652 students in grades 9-12 with a 99% graduation rate and a 49% AP-exam participation rate."
  },
  "Morristown (IN)": {
    hs: "Morristown Jr-Sr High School",
    district: "Shelby Eastern Schools",
    usNewsNational: 10686, usNewsState: 262,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shelby Eastern Schools operates the town's junior-senior high school. Morristown Jr-Sr High School (#262 in Indiana) enrolls 168 students in grades 9-12 with a 100% graduation rate."
  },
  "Nashville (IN)": {
    hs: "Brown County High School",
    district: "Brown County School Corporation",
    usNewsNational: 5845, usNewsState: 155,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Brown County School Corporation is the only school corporation in the county. Brown County High School (#155 in Indiana) enrolls 454 students in grades 9-12 with a 89% graduation rate and a 47% AP-exam participation rate."
  },
  "New Palestine (IN)": {
    hs: "New Palestine High School",
    district: "Southern Hancock County Community School Corp",
    usNewsNational: 1837, usNewsState: 35,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Southern Hancock County Community School Corp's high school is in the town. New Palestine High School (#35 in Indiana) enrolls 1,246 students in grades 9-12 with a 93% graduation rate and a 49% AP-exam participation rate."
  },
  "New Whiteland (IN)": {
    hs: "Whiteland Community High School",
    district: "Clark-Pleasant Community School Corporation",
    feedsTo: "Whiteland Community High School",
    usNewsNational: 6492, usNewsState: 174,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "New Whiteland is served by Clark-Pleasant Community School Corporation; its high school is in neighboring Whiteland. Whiteland Community High School (#174 in Indiana) enrolls 2,135 students in grades 9-12 with a 87% graduation rate and a 43% AP-exam participation rate."
  },
  "Nineveh (IN)": {
    hs: "Indian Creek Senior High School",
    district: "Nineveh-Hensley-Jackson United School Corporation",
    feedsTo: "Indian Creek Senior High School",
    usNewsNational: 5488, usNewsState: 149,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Nineveh is in Nineveh-Hensley-Jackson United School Corporation; its high school is in neighboring Trafalgar. Indian Creek Senior High School (#149 in Indiana) enrolls 652 students in grades 9-12 with a 99% graduation rate and a 49% AP-exam participation rate."
  },
  "Noblesville (IN)": {
    hs: ["Noblesville High School", "Hamilton Southeastern High School"],
    district: ["Noblesville Schools", "Hamilton Southeastern Schools"],
    usNewsNational: 736, usNewsState: 12,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Roughly 85% of Noblesville residents (2020 census blocks) are in Noblesville Schools and about 15% in Hamilton Southeastern Schools; the HSE portion is Fall Creek Township, where Hamilton Southeastern High is the majority school (the address-level zone was not published in text). Noblesville High School (#15 in Indiana) enrolls 3,264 students in grades 9-12 with a 97% graduation rate and a 60% AP-exam participation rate. Also: Hamilton Southeastern High School (#12 in Indiana) enrolls 3,504 students in grades 9-12 with a 96% graduation rate and a 56% AP-exam participation rate."
  },
  "North Salem (IN)": {
    hs: "Tri-West Senior High School",
    district: "North West Hendricks Schools",
    feedsTo: "Tri-West Senior High School",
    usNewsNational: 1035, usNewsState: 17,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "North Salem is in North West Hendricks Schools, whose high school (Tri-West) is in Lizton. Tri-West Senior High School (#17 in Indiana) enrolls 610 students in grades 9-12 with a 91% graduation rate and a 61% AP-exam participation rate."
  },
  "Painted Hills (IN)": {
    hs: "Indian Creek Senior High School",
    district: "Nineveh-Hensley-Jackson United School Corporation",
    feedsTo: "Indian Creek Senior High School",
    usNewsNational: 5488, usNewsState: 149,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "About 96% of Painted Hills residents are in Nineveh-Hensley-Jackson United (remainder in MSD of Martinsville), so Indian Creek in Trafalgar is the school. Indian Creek Senior High School (#149 in Indiana) enrolls 652 students in grades 9-12 with a 99% graduation rate and a 49% AP-exam participation rate."
  },
  "Paragon (IN)": {
    hs: "Martinsville High School",
    district: "MSD of Martinsville Schools",
    feedsTo: "Martinsville High School",
    usNewsNational: 11198, usNewsState: 273,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Paragon is inside the MSD of Martinsville Schools (Census boundary; Paragon Elementary is a district school); the high school is in Martinsville. Martinsville High School (#273 in Indiana) enrolls 1,281 students in grades 9-12 with a 84% graduation rate and a 28% AP-exam participation rate."
  },
  "Pendleton (IN)": {
    hs: "Pendleton Heights High School",
    district: "South Madison Community School Corporation",
    usNewsNational: 3326, usNewsState: 77,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "South Madison Community School Corporation's high school is Pendleton Heights, in Pendleton. Pendleton Heights High School (#77 in Indiana) enrolls 1,502 students in grades 9-12 with a 91% graduation rate and a 44% AP-exam participation rate."
  },
  "Pittsboro (IN)": {
    hs: "Tri-West Senior High School",
    district: "North West Hendricks Schools",
    feedsTo: "Tri-West Senior High School",
    usNewsNational: 1035, usNewsState: 17,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pittsboro is in North West Hendricks Schools, whose high school (Tri-West) is in neighboring Lizton. Tri-West Senior High School (#17 in Indiana) enrolls 610 students in grades 9-12 with a 91% graduation rate and a 61% AP-exam participation rate."
  },
  "Plainfield (IN)": {
    hs: ["Plainfield High School (IN)", "Avon High School"],
    district: ["Plainfield Community School Corp", "Avon Community School Corporation"],
    usNewsNational: 1052, usNewsState: 18,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "The east side of Plainfield is in Avon Community Schools, so the town is split between Plainfield High and Avon High. Plainfield High School (#30 in Indiana) enrolls 1,836 students in grades 9-12 with a 93% graduation rate and a 43% AP-exam participation rate. Also: Avon High School (#18 in Indiana) enrolls 3,518 students in grades 9-12 with a 97% graduation rate and a 51% AP-exam participation rate."
  },
  "Pleasant View (IN)": {
    hs: "Triton Central High School",
    district: "Northwestern Consolidated School Corporation (Triton Central Schools)",
    feedsTo: "Triton Central High School",
    usNewsNational: 10866, usNewsState: 265,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pleasant View is in Northwestern Consolidated School Corporation per Census boundaries; its high school is Triton Central. Triton Central High School (#265 in Indiana) enrolls 471 students in grades 9-12 with a 87% graduation rate."
  },
  "Prince's Lakes (IN)": {
    hs: "Indian Creek Senior High School",
    district: "Nineveh-Hensley-Jackson United School Corporation",
    feedsTo: "Indian Creek Senior High School",
    usNewsNational: 5488, usNewsState: 149,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Prince's Lakes residents are served by Nineveh-Hensley-Jackson United, including Indian Creek Senior High in Trafalgar. Indian Creek Senior High School (#149 in Indiana) enrolls 652 students in grades 9-12 with a 99% graduation rate and a 49% AP-exam participation rate."
  },
  "Rocky Ripple (IN)": {
    hs: "North Central High School",
    district: "MSD of Washington Township",
    feedsTo: "North Central High School",
    usNewsNational: 3577, usNewsState: 85,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Rocky Ripple is in MSD of Washington Township, whose sole comprehensive high school is North Central. North Central High School (#85 in Indiana) enrolls 3,682 students in grades 9-12 with a 89% graduation rate and a 40% AP-exam participation rate."
  },
  "Sharpsville (IN)": {
    hs: "Tri Central Middle-High School",
    district: "Tri-Central Community Schools",
    usNewsNational: 1966, usNewsState: 39,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tri-Central Community Schools covers the whole town and its middle-high school is in Sharpsville. Tri Central Middle-High School (#39 in Indiana) enrolls 218 students in grades 9-12 with a 96% graduation rate and a 65% AP-exam participation rate."
  },
  "Shelbyville (IN)": {
    hs: "Shelbyville Senior High School",
    district: "Shelbyville Central Schools",
    usNewsNational: 5849, usNewsState: 156,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shelbyville Central Schools covers about 99.8% of residents. Shelbyville Senior High School (#156 in Indiana) enrolls 1,068 students in grades 9-12 with a 95% graduation rate and a 37% AP-exam participation rate."
  },
  "Sheridan (IN)": {
    hs: "Sheridan High School",
    district: "Sheridan Community Schools",
    usNewsNational: 2666, usNewsState: 55,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Sheridan Community Schools operates the town's own high school. Sheridan High School (#55 in Indiana) enrolls 343 students in grades 9-12 with a 96% graduation rate and a 53% AP-exam participation rate."
  },
  "Shirley (IN)": {
    hs: ["Eastern Hancock High School", "Knightstown High School"],
    district: ["Eastern Hancock County Com Sch Corp", "C A Beard Memorial School Corp"],
    feedsTo: "Eastern Hancock High School / Knightstown High School",
    usNewsNational: 10290, usNewsState: 254,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shirley straddles the Hancock/Henry line; about 75% of residents are in Eastern Hancock schools and about 25% in Knightstown's C. A. Beard Memorial corporation. Eastern Hancock High School (#297 in Indiana) enrolls 370 students in grades 9-12 with a 77% graduation rate and a 16% AP-exam participation rate. Also: Knightstown High School (#254 in Indiana) enrolls 318 students in grades 9-12 with a 90% graduation rate and a 35% AP-exam participation rate."
  },
  "Southport (IN)": {
    hs: "Southport High School",
    district: "MSD of Perry Township",
    feedsTo: "Southport High School",
    usNewsNational: 7132, usNewsState: 190,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Southport is in MSD of Perry Township; zoned schools include Southport High School. Southport High School (#190 in Indiana) enrolls 2,419 students in grades 9-12 with a 90% graduation rate and a 29% AP-exam participation rate."
  },
  "Speedway (IN)": {
    hs: "Speedway Senior High School",
    district: "School Town of Speedway",
    usNewsNational: 280, usNewsState: 6,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "School Town of Speedway is a stand-alone district with one high school in the town. Speedway Senior High School (#6 in Indiana) enrolls 600 students in grades 9-12 with a 98% graduation rate and a 100% AP-exam participation rate."
  },
  "Summitville (IN)": {
    hs: "Madison-Grant High School",
    district: "Madison-Grant United School Corporation",
    feedsTo: "Madison-Grant High School",
    usNewsNational: 4906, usNewsState: 121,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Summitville students move on to Madison-Grant High School near Fairmount. Madison-Grant High School (#121 in Indiana) enrolls 288 students in grades 9-12 with a 97% graduation rate and a 19% AP-exam participation rate."
  },
  "Thorntown (IN)": {
    hs: "Western Boone Jr-Sr High School",
    district: "Western Boone County Community School Corporation",
    usNewsNational: 3920, usNewsState: 95,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Western Boone County Community School Corporation covers the whole town and its junior-senior high school is in Thorntown. Western Boone Jr-Sr High School (#95 in Indiana) enrolls 519 students in grades 9-12 with a 99% graduation rate and a 30% AP-exam participation rate."
  },
  "Tipton (IN)": {
    hs: "Tipton High School",
    district: "Tipton Community School Corporation",
    usNewsNational: 5171, usNewsState: 135,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tipton Community School Corporation covers the whole town. Tipton High School (#135 in Indiana) enrolls 437 students in grades 9-12 with a 96% graduation rate and a 44% AP-exam participation rate."
  },
  "Trafalgar (IN)": {
    hs: "Indian Creek Senior High School",
    district: "Nineveh-Hensley-Jackson United School Corporation",
    usNewsNational: 5488, usNewsState: 149,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Nineveh-Hensley-Jackson United School Corporation's high school is in Trafalgar. Indian Creek Senior High School (#149 in Indiana) enrolls 652 students in grades 9-12 with a 99% graduation rate and a 49% AP-exam participation rate."
  },
  "Waldron (IN)": {
    hs: "Waldron Jr-Sr High School",
    district: "Shelby Eastern Schools",
    usNewsNational: 10889, usNewsState: 266,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shelby Eastern Schools operates the town's junior-senior high school. Waldron Jr-Sr High School (#266 in Indiana) enrolls 176 students in grades 9-12 with a 91% graduation rate and a 23% AP-exam participation rate."
  },
  "Warren Park (IN)": {
    hs: "Warren Central High School",
    district: "MSD of Warren Township",
    feedsTo: "Warren Central High School",
    usNewsNational: 10572, usNewsState: 258,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Warren Park is in MSD of Warren Township, whose comprehensive high school is Warren Central. Warren Central High School (#258 in Indiana) enrolls 3,364 students in grades 9-12 with a 88% graduation rate and a 16% AP-exam participation rate."
  },
  "Waverly (IN)": {
    hs: "Mooresville High School",
    district: "Mooresville Consolidated School Corp",
    feedsTo: "Mooresville High School",
    usNewsNational: 7242, usNewsState: 195,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Waverly lies inside Mooresville Consolidated School Corp per Census boundaries; the high school is in Mooresville. Mooresville High School (#195 in Indiana) enrolls 1,372 students in grades 9-12 with a 99% graduation rate and a 39% AP-exam participation rate."
  },
  "Westfield (IN)": {
    hs: "Westfield High School (IN)",
    district: "Westfield-Washington Schools",
    usNewsNational: 434, usNewsState: 9,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Westfield-Washington Schools has a single comprehensive high school. Westfield High School (#9 in Indiana) enrolls 2,937 students in grades 9-12 with a 92% graduation rate and a 71% AP-exam participation rate."
  },
  "Whiteland (IN)": {
    hs: "Whiteland Community High School",
    district: "Clark-Pleasant Community School Corporation",
    usNewsNational: 6492, usNewsState: 174,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Clark-Pleasant Community School Corporation covers the whole town and its high school is in Whiteland. Whiteland Community High School (#174 in Indiana) enrolls 2,135 students in grades 9-12 with a 87% graduation rate and a 43% AP-exam participation rate."
  },
  "Whitestown (IN)": {
    hs: ["Zionsville Community High School", "Lebanon Senior High School"],
    district: ["Zionsville Community Schools", "Lebanon Community School Corp"],
    feedsTo: "Zionsville Community High School / Lebanon Senior High School",
    usNewsNational: 230, usNewsState: 3,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Whitestown is split by township: Eagle Township residents (about 52% of the population) attend Zionsville schools and Worth/Perry Township residents (about 48%) attend Lebanon schools. Zionsville Community High School (#3 in Indiana) enrolls 2,329 students in grades 9-12 with a 95% graduation rate and a 78% AP-exam participation rate. Also: Lebanon Senior High School (#89 in Indiana) enrolls 1,067 students in grades 9-12 with a 94% graduation rate and a 34% AP-exam participation rate."
  },
  "Windfall City (IN)": {
    hs: "Tri Central Middle-High School",
    district: "Tri-Central Community Schools",
    feedsTo: "Tri Central Middle-High School",
    usNewsNational: 1966, usNewsState: 39,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Windfall City lies inside Tri-Central Community Schools per Census boundaries; the middle-high school is in Sharpsville. Tri Central Middle-High School (#39 in Indiana) enrolls 218 students in grades 9-12 with a 96% graduation rate and a 65% AP-exam participation rate."
  },
  "Zionsville (IN)": {
    hs: "Zionsville Community High School",
    district: "Zionsville Community Schools",
    usNewsNational: 230, usNewsState: 3,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Zionsville Community Schools covers about 97% of residents; a few percent are in Lebanon Community School Corp. Zionsville Community High School (#3 in Indiana) enrolls 2,329 students in grades 9-12 with a 95% graduation rate and a 78% AP-exam participation rate."
  },
  // === INDIANAPOLIS METRO SCHOOL_DATA END ===

  // === DETROIT METRO SCHOOL_DATA START ===
  "Addison Township (MI)": {
    hs: ["Oxford High School", "Romeo High School"],
    district: ["Oxford Community Schools", "Romeo Community Schools"],
    feedsTo: "Oxford High School / Romeo High School",
    usNewsNational: 4291, usNewsState: 156,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Addison Township is split between school districts (2020 census-block shares): Oxford Community Schools about 63%, Romeo Community Schools about 27%; students attend Oxford High School or Romeo High School depending on address. Smaller shares are in Lake Orion Community Schools (9%). Addison Township has no high school inside its boundary; the high schools are in Oxford, Washington. Oxford High School (#195 in Michigan) enrolls 1,568 students in grades 9-12 with a 97% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 994 in 2025-26 (MI School Data). Also: Romeo High School (#156 in Michigan) enrolls 1,817 students in grades 9-12 with a 95% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data)."
  },
  "Algonac (MI)": {
    hs: "Algonac High School",
    district: "Algonac Community School District",
    feedsTo: "Algonac High School",
    usNewsNational: 10431, usNewsState: 382,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Algonac Community School District covers essentially all Algonac's residents (2020 census blocks). Algonac has no high school inside its boundary; the high school is in Clay. Algonac High School (#382 in Michigan) enrolls 430 students in grades 9-12 with a 96% graduation rate and a 14% AP/IB-exam participation rate; its average SAT total was 925 in 2025-26 (MI School Data)."
  },
  "Allen Park (MI)": {
    hs: ["Allen Park High School", "Melvindale High School"],
    district: ["Allen Park Public Schools", "Melvindale-North Allen Park Schools"],
    usNewsNational: 5937, usNewsState: 216,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Allen Park is split between school districts (2020 census-block shares): Allen Park Public Schools about 72%, Melvindale-North Allen Park Schools about 23%; students attend Allen Park High School or Melvindale High School depending on address. Smaller shares are in Southgate Community Schools (5%). Allen Park High School (#216 in Michigan) enrolls 1,133 students in grades 9-12 with an 89% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 963 in 2025-26 (MI School Data). Also: Melvindale High School (#469 in Michigan) enrolls 982 students in grades 9-12 with an 86% graduation rate and a 19% AP/IB-exam participation rate; its average SAT total was 801 in 2025-26 (MI School Data)."
  },
  "Almont (MI)": {
    hs: "Almont High School",
    district: "Almont Community Schools",
    usNewsNational: 4226, usNewsState: 155,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Almont Community Schools covers essentially all Almont's residents (2020 census blocks). Almont High School (#155 in Michigan) enrolls 431 students in grades 9-12 with a 98% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 957 in 2025-26 (MI School Data)."
  },
  "Almont Township (MI)": {
    hs: "Almont High School",
    district: "Almont Community Schools",
    usNewsNational: 4226, usNewsState: 155,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Almont. Almont Community Schools covers about 94% of Almont Township's residents (2020 census blocks). The rest are mostly in Imlay City Community Schools (5%). Almont High School (#155 in Michigan) enrolls 431 students in grades 9-12 with a 98% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 957 in 2025-26 (MI School Data)."
  },
  "Arcadia Township (MI)": {
    hs: ["Imlay City High School", "North Branch High School", "Lapeer East Senior High School"],
    district: ["Imlay City Community Schools", "North Branch Area Schools", "Lapeer Community Schools"],
    feedsTo: "Imlay City High School / North Branch High School / Lapeer East Senior High School",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Arcadia Township is split between school districts (2020 census-block shares): Imlay City Community Schools about 42%, North Branch Area Schools about 35%, Lapeer Community Schools about 23%; students attend Imlay City High School, North Branch High School or Lapeer East Senior High School depending on address. Arcadia Township has no high school inside its boundary; the high schools are in Imlay City, Lapeer, North Branch. Imlay City High School (#233 in Michigan) enrolls 554 students in grades 9-12 with a 96% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 937 in 2025-26 (MI School Data). Also: North Branch High School (#219 in Michigan) enrolls 695 students in grades 9-12 with a 97% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 919 in 2025-26 (MI School Data)."
  },
  "Armada (MI)": {
    hs: "Armada High School",
    district: "Armada Area Schools",
    usNewsNational: 2066, usNewsState: 75,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Armada Area Schools covers essentially all Armada's residents (2020 census blocks). Armada High School (#75 in Michigan) enrolls 533 students in grades 9-12 with a 100% graduation rate and a 61% AP/IB-exam participation rate; its average SAT total was 1007 in 2025-26 (MI School Data)."
  },
  "Armada Township (MI)": {
    hs: "Armada High School",
    district: "Armada Area Schools",
    usNewsNational: 2066, usNewsState: 75,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Armada. Armada Area Schools covers about 89% of Armada Township's residents (2020 census blocks). The rest are mostly in Romeo Community Schools (11%). Armada High School (#75 in Michigan) enrolls 533 students in grades 9-12 with a 100% graduation rate and a 61% AP/IB-exam participation rate; its average SAT total was 1007 in 2025-26 (MI School Data)."
  },
  "Attica (MI)": {
    hs: "Lapeer East Senior High School",
    district: "Lapeer Community Schools",
    feedsTo: "Lapeer East Senior High School",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lapeer Community Schools covers about 85% of Attica's residents (2020 census blocks). The rest are mostly in Imlay City Community Schools (15%). Attica has no high school inside its boundary; the high school is in Lapeer. Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Attica Township (MI)": {
    hs: ["Imlay City High School", "Lapeer East Senior High School"],
    district: ["Imlay City Community Schools", "Lapeer Community Schools"],
    feedsTo: "Imlay City High School / Lapeer East Senior High School",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shares are for residents outside the separately listed Attica. Attica Township is split between school districts (2020 census-block shares): Imlay City Community Schools about 59%, Lapeer Community Schools about 37%; students attend Imlay City High School or Lapeer East Senior High School depending on address. Smaller shares are in Dryden Community Schools (3%). Attica Township has no high school inside its boundary; the high schools are in Imlay City, Lapeer. Imlay City High School (#233 in Michigan) enrolls 554 students in grades 9-12 with a 96% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 937 in 2025-26 (MI School Data). Also: Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Auburn Hills (MI)": {
    hs: ["Pontiac High School", "Avondale High School"],
    district: ["Pontiac City Schools", "Avondale School District"],
    usNewsNational: 10082, usNewsState: 369,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Auburn Hills is split between school districts (2020 census-block shares): Pontiac City Schools about 58%, Avondale School District about 40%; students attend Pontiac High School or Avondale High School depending on address. Pontiac High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 992 students in grades 9-12 with a 75% graduation rate and a 16% AP/IB-exam participation rate; its average SAT total was 747 in 2025-26 (MI School Data). Also: Avondale High School (#369 in Michigan) enrolls 911 students in grades 9-12 with a 92% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 909 in 2025-26 (MI School Data)."
  },
  "Barnes Lake (MI)": {
    hs: "North Branch High School",
    district: "North Branch Area Schools",
    feedsTo: "North Branch High School",
    usNewsNational: 6147, usNewsState: 219,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "North Branch Area Schools covers about 94% of Barnes Lake's residents (2020 census blocks). The rest are mostly in Lapeer Community Schools (4%). Barnes Lake has no high school inside its boundary; the high school is in North Branch. North Branch High School (#219 in Michigan) enrolls 695 students in grades 9-12 with a 97% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 919 in 2025-26 (MI School Data)."
  },
  "Belleville (MI)": {
    hs: "Belleville High School",
    district: "Van Buren Public Schools",
    usNewsNational: 11545, usNewsState: 427,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Van Buren Public Schools covers essentially all Belleville's residents (2020 census blocks). Belleville High School (#427 in Michigan) enrolls 1,666 students in grades 9-12 with an 82% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 882 in 2025-26 (MI School Data)."
  },
  "Berkley (MI)": {
    hs: "Berkley High School",
    district: "Berkley School District",
    usNewsNational: 1360, usNewsState: 46,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Berkley School District covers about 98% of Berkley's residents (2020 census blocks). Berkley High School (#46 in Michigan) enrolls 1,196 students in grades 9-12 with a 95% graduation rate and a 61% AP/IB-exam participation rate; its average SAT total was 1042 in 2025-26 (MI School Data)."
  },
  "Berlin Township (MI)": {
    hs: ["Capac High School", "Almont High School", "Armada High School"],
    district: ["Capac Community Schools", "Almont Community Schools", "Armada Area Schools"],
    feedsTo: "Capac High School / Almont High School / Armada High School",
    usNewsNational: 2066, usNewsState: 75,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Berlin Township is split between school districts (2020 census-block shares): Capac Community Schools about 37%, Almont Community Schools about 36%, Armada Area Schools about 27%; students attend Capac High School, Almont High School or Armada High School depending on address. Berlin Township has no high school inside its boundary; the high schools are in Almont, Armada, Capac. Capac High School (#357 in Michigan) enrolls 202 students in grades 9-12 with a 98% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 870 in 2025-26 (MI School Data). Also: Almont High School (#155 in Michigan) enrolls 431 students in grades 9-12 with a 98% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 957 in 2025-26 (MI School Data)."
  },
  "Beverly Hills (MI)": {
    hs: ["Ernest W. Seaholm High School", "Wylie E. Groves High School"],
    district: ["Birmingham Public Schools", "Birmingham Public Schools"],
    usNewsNational: 829, usNewsState: 28,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Birmingham Public Schools covers essentially all Beverly Hills's residents (2020 census blocks). Birmingham Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Ernest W. Seaholm High School (#28 in Michigan) enrolls 1,057 students in grades 9-12 with a 98% graduation rate and a 65% AP/IB-exam participation rate; its average SAT total was 1127 in 2025-26 (MI School Data). Also: Wylie E. Groves High School (#32 in Michigan) enrolls 1,107 students in grades 9-12 with a 96% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1069 in 2025-26 (MI School Data)."
  },
  "Bingham Farms (MI)": {
    hs: ["Ernest W. Seaholm High School", "Wylie E. Groves High School"],
    district: ["Birmingham Public Schools", "Birmingham Public Schools"],
    feedsTo: "Ernest W. Seaholm High School / Wylie E. Groves High School",
    usNewsNational: 829, usNewsState: 28,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Birmingham Public Schools covers about 98% of Bingham Farms's residents (2020 census blocks). Birmingham Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Bingham Farms has no high school inside its boundary; the high schools are in Beverly Hills, Birmingham. Ernest W. Seaholm High School (#28 in Michigan) enrolls 1,057 students in grades 9-12 with a 98% graduation rate and a 65% AP/IB-exam participation rate; its average SAT total was 1127 in 2025-26 (MI School Data). Also: Wylie E. Groves High School (#32 in Michigan) enrolls 1,107 students in grades 9-12 with a 96% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1069 in 2025-26 (MI School Data)."
  },
  "Birmingham (MI)": {
    hs: ["Ernest W. Seaholm High School", "Wylie E. Groves High School"],
    district: ["Birmingham Public Schools", "Birmingham Public Schools"],
    usNewsNational: 829, usNewsState: 28,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Birmingham Public Schools covers essentially all Birmingham's residents (2020 census blocks). Birmingham Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Ernest W. Seaholm High School (#28 in Michigan) enrolls 1,057 students in grades 9-12 with a 98% graduation rate and a 65% AP/IB-exam participation rate; its average SAT total was 1127 in 2025-26 (MI School Data). Also: Wylie E. Groves High School (#32 in Michigan) enrolls 1,107 students in grades 9-12 with a 96% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1069 in 2025-26 (MI School Data)."
  },
  "Bloomfield Hills (MI)": {
    hs: "Bloomfield Hills High School",
    district: "Bloomfield Hills Schools",
    usNewsNational: 1021, usNewsState: 31,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Bloomfield Hills Schools covers about 87% of Bloomfield Hills's residents (2020 census blocks). The rest are mostly in Birmingham Public Schools (13%). US News also lists International Academy (#1 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Bloomfield Hills High School (#31 in Michigan) enrolls 1,481 students in grades 9-12 with a 96% graduation rate and a 71% AP/IB-exam participation rate; its average SAT total was 1070 in 2025-26 (MI School Data)."
  },
  "Bloomfield Township (MI)": {
    hs: ["Bloomfield Hills High School", "Ernest W. Seaholm High School", "Wylie E. Groves High School"],
    district: ["Bloomfield Hills Schools", "Birmingham Public Schools", "Birmingham Public Schools"],
    usNewsNational: 829, usNewsState: 28,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Bloomfield Township is split between school districts (2020 census-block shares): Bloomfield Hills Schools about 64%, Birmingham Public Schools about 28%; students attend Bloomfield Hills High School, Ernest W. Seaholm High School or Wylie E. Groves High School depending on address. Smaller shares are in Pontiac City Schools (5%) and Avondale School District (4%). US News also lists International Academy (#1 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Bloomfield Hills High School (#31 in Michigan) enrolls 1,481 students in grades 9-12 with a 96% graduation rate and a 71% AP/IB-exam participation rate; its average SAT total was 1070 in 2025-26 (MI School Data). Also: Ernest W. Seaholm High School (#28 in Michigan) enrolls 1,057 students in grades 9-12 with a 98% graduation rate and a 65% AP/IB-exam participation rate; its average SAT total was 1127 in 2025-26 (MI School Data)."
  },
  "Brandon Township (MI)": {
    hs: ["Brandon High School", "Oxford High School"],
    district: ["Brandon School District", "Oxford Community Schools"],
    usNewsNational: 3888, usNewsState: 147,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shares are for residents outside the separately listed Ortonville. Brandon Township is split between school districts (2020 census-block shares): Brandon School District about 83%, Oxford Community Schools about 17%; students attend Brandon High School or Oxford High School depending on address. Brandon High School (#147 in Michigan) enrolls 648 students in grades 9-12 with a 94% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 937 in 2025-26 (MI School Data). Also: Oxford High School (#195 in Michigan) enrolls 1,568 students in grades 9-12 with a 97% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 994 in 2025-26 (MI School Data)."
  },
  "Brighton (MI)": {
    hs: "Brighton High School",
    district: "Brighton Area Schools",
    usNewsNational: 1660, usNewsState: 57,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Brighton Area Schools covers essentially all Brighton's residents (2020 census blocks). Brighton High School (#57 in Michigan) enrolls 1,887 students in grades 9-12 with a 98% graduation rate and a 55% AP/IB-exam participation rate; its average SAT total was 1057 in 2025-26 (MI School Data)."
  },
  "Brighton Township (MI)": {
    hs: ["Brighton High School", "Hartland High School"],
    district: ["Brighton Area Schools", "Hartland Consolidated Schools"],
    feedsTo: "Brighton High School / Hartland High School",
    usNewsNational: 1660, usNewsState: 57,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Brighton Township is split between school districts (2020 census-block shares): Brighton Area Schools about 61%, Hartland Consolidated Schools about 29%; students attend Brighton High School or Hartland High School depending on address. Smaller shares are in Howell Public Schools (11%). Brighton Township has no high school inside its boundary; the high schools are in Brighton, Hartland. Brighton High School (#57 in Michigan) enrolls 1,887 students in grades 9-12 with a 98% graduation rate and a 55% AP/IB-exam participation rate; its average SAT total was 1057 in 2025-26 (MI School Data). Also: Hartland High School (#117 in Michigan) enrolls 1,610 students in grades 9-12 with a 98% graduation rate and a 45% AP/IB-exam participation rate; its average SAT total was 1032 in 2025-26 (MI School Data)."
  },
  "Brockway Township (MI)": {
    hs: "Yale Senior High School",
    district: "Yale Public Schools",
    usNewsNational: 4482, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Yale Public Schools covers about 99% of Brockway Township's residents (2020 census blocks). Yale Senior High School (#166 in Michigan) enrolls 509 students in grades 9-12 with a 98% graduation rate and a 32% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Brownstown Township (MI)": {
    hs: ["Woodhaven High School", "Oscar A. Carlson High School"],
    district: ["Woodhaven-Brownstown School District", "Gibraltar School District"],
    usNewsNational: 3520, usNewsState: 130,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Brownstown Township is split between school districts (2020 census-block shares): Woodhaven-Brownstown School District about 67%, Gibraltar School District about 30%; students attend Woodhaven High School or Oscar A. Carlson High School depending on address. Smaller shares are in Taylor School District (3%). Woodhaven High School (#130 in Michigan) enrolls 1,629 students in grades 9-12 with a 92% graduation rate and a 36% AP/IB-exam participation rate; its average SAT total was 975 in 2025-26 (MI School Data). Also: Oscar A. Carlson High School (#402 in Michigan) enrolls 1,104 students in grades 9-12 with a 99% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 958 in 2025-26 (MI School Data)."
  },
  "Bruce Township (MI)": {
    hs: "Romeo High School",
    district: "Romeo Community Schools",
    feedsTo: "Romeo High School",
    usNewsNational: 4291, usNewsState: 156,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Romeo. Romeo Community Schools covers about 89% of Bruce Township's residents (2020 census blocks). The rest are mostly in Almont Community Schools (10%). Bruce Township has no high school inside its boundary; the high school is in Washington. Romeo High School (#156 in Michigan) enrolls 1,817 students in grades 9-12 with a 95% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data)."
  },
  "Burlington Township (MI)": {
    hs: ["North Branch High School", "Marlette Jr./Sr. High School"],
    district: ["North Branch Area Schools", "Marlette Community Schools"],
    feedsTo: "North Branch High School / Marlette Jr./Sr. High School",
    usNewsNational: 6147, usNewsState: 219,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Burlington Township is split between school districts (2020 census-block shares): North Branch Area Schools about 58%, Marlette Community Schools about 40%; students attend North Branch High School or Marlette Jr./Sr. High School depending on address. Burlington Township has no high school inside its boundary; the high schools are in Marlette, North Branch. North Branch High School (#219 in Michigan) enrolls 695 students in grades 9-12 with a 97% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 919 in 2025-26 (MI School Data). Also: Marlette Jr./Sr. High School (#473 in Michigan) enrolls 219 students in grades 9-12 with a 94% graduation rate; its average SAT total was 908 in 2025-26 (MI School Data)."
  },
  "Burnside Township (MI)": {
    hs: ["Brown City High School", "Marlette Jr./Sr. High School"],
    district: ["Brown City Community Schools", "Marlette Community Schools"],
    feedsTo: "Brown City High School / Marlette Jr./Sr. High School",
    usNewsNational: 12864, usNewsState: 473,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Burnside Township is split between school districts (2020 census-block shares): Brown City Community Schools about 71%, Marlette Community Schools about 22%; students attend Brown City High School or Marlette Jr./Sr. High School depending on address. Smaller shares are in North Branch Area Schools (7%). Burnside Township has no high school inside its boundary; the high schools are in Brown City, Marlette. Brown City High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 237 students in grades 9-12 with a 94% graduation rate; its average SAT total was 917 in 2025-26 (MI School Data). Also: Marlette Jr./Sr. High School (#473 in Michigan) enrolls 219 students in grades 9-12 with a 94% graduation rate; its average SAT total was 908 in 2025-26 (MI School Data)."
  },
  "Burtchville Township (MI)": {
    hs: ["Port Huron Northern High School", "Port Huron High School", "Croswell-Lexington High School"],
    district: ["Port Huron Area School District", "Port Huron Area School District", "Croswell-Lexington Community Schools"],
    feedsTo: "Port Huron Northern High School / Port Huron High School / Croswell-Lexington High School",
    usNewsNational: 5913, usNewsState: 215,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shares are for residents outside the separately listed Lakeport. Burtchville Township is split between school districts (2020 census-block shares): Port Huron Area School District about 77%, Croswell-Lexington Community Schools about 23%; students attend Port Huron Northern High School, Port Huron High School or Croswell-Lexington High School depending on address. Burtchville Township has no high school inside its boundary; the high schools are in Croswell, Port Huron. Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data). Also: Port Huron High School (#461 in Michigan) enrolls 988 students in grades 9-12 with an 83% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 897 in 2025-26 (MI School Data)."
  },
  "Canton Township (MI)": {
    hs: ["Salem High School", "Canton High School", "Plymouth High School"],
    district: ["Plymouth-Canton Community Schools", "Plymouth-Canton Community Schools", "Plymouth-Canton Community Schools"],
    usNewsNational: 1208, usNewsState: 34,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Plymouth-Canton Community Schools covers about 87% of Canton Township's residents (2020 census blocks). The rest are mostly in Van Buren Public Schools (7%) and Wayne-Westland Community Schools (6%). Plymouth-Canton Community Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Salem High School (#34 in Michigan) enrolls 1,862 students in grades 9-12 with a 96% graduation rate and a 52% AP/IB-exam participation rate; its average SAT total was 1083 in 2025-26 (MI School Data). Also: Canton High School (#37 in Michigan) enrolls 1,888 students in grades 9-12 with a 97% graduation rate and a 55% AP/IB-exam participation rate; its average SAT total was 1083 in 2025-26 (MI School Data)."
  },
  "Capac (MI)": {
    hs: "Capac High School",
    district: "Capac Community Schools",
    usNewsNational: 9592, usNewsState: 357,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Capac Community Schools covers essentially all Capac's residents (2020 census blocks). Capac High School (#357 in Michigan) enrolls 202 students in grades 9-12 with a 98% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 870 in 2025-26 (MI School Data)."
  },
  "Casco Township (MI)": {
    hs: ["Marine City High School", "St. Clair High School", "Richmond Community High School", "Anchor Bay High School"],
    district: ["East China School District", "East China School District", "Richmond Community Schools", "Anchor Bay School District"],
    feedsTo: "Marine City High School / St. Clair High School / Richmond Community High School / Anchor Bay High School",
    usNewsNational: 3057, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Casco Township is split between school districts (2020 census-block shares): East China School District about 36%, Richmond Community Schools about 34%, Anchor Bay School District about 30%; students attend Marine City High School, St. Clair High School, Richmond Community High School or Anchor Bay High School depending on address. Casco Township has no high school inside its boundary; the high schools are in Ira, Marine City, Richmond, Saint Clair. Marine City High School (#115 in Michigan) enrolls 437 students in grades 9-12 with a 98% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 918 in 2025-26 (MI School Data). Also: St. Clair High School (#209 in Michigan) enrolls 715 students in grades 9-12 with a 95% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Center Line (MI)": {
    hs: "Center Line High School",
    district: "Center Line Public Schools",
    usNewsNational: 10680, usNewsState: 392,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Center Line Public Schools covers about 86% of Center Line's residents (2020 census blocks). The rest are mostly in Van Dyke Public Schools (14%). Center Line High School (#392 in Michigan) enrolls 646 students in grades 9-12 with an 86% graduation rate and a 16% AP/IB-exam participation rate; its average SAT total was 860 in 2025-26 (MI School Data)."
  },
  "Chesterfield Township (MI)": {
    hs: ["L'Anse Creuse High School", "L'Anse Creuse High School - North", "Anchor Bay High School"],
    district: ["L'Anse Creuse Public Schools", "L'Anse Creuse Public Schools", "Anchor Bay School District"],
    usNewsNational: 4678, usNewsState: 171,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Chesterfield Township is split between school districts (2020 census-block shares): L'Anse Creuse Public Schools about 55%, Anchor Bay School District about 42%; students attend L'Anse Creuse High School, L'Anse Creuse High School - North or Anchor Bay High School depending on address. L'Anse Creuse High School (#208 in Michigan) enrolls 1,172 students in grades 9-12 with a 93% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 929 in 2025-26 (MI School Data). Also: L'Anse Creuse High School - North (#171 in Michigan) enrolls 1,545 students in grades 9-12 with a 94% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 998 in 2025-26 (MI School Data)."
  },
  "China Township (MI)": {
    hs: ["Marine City High School", "St. Clair High School"],
    district: ["East China School District", "East China School District"],
    feedsTo: "Marine City High School / St. Clair High School",
    usNewsNational: 3057, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "East China School District covers essentially all China Township's residents (2020 census blocks). East China School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). China Township has no high school inside its boundary; the high schools are in Marine City, Saint Clair. Marine City High School (#115 in Michigan) enrolls 437 students in grades 9-12 with a 98% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 918 in 2025-26 (MI School Data). Also: St. Clair High School (#209 in Michigan) enrolls 715 students in grades 9-12 with a 95% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Clarkston (MI)": {
    hs: "Clarkston High School",
    district: "Clarkston Community School District",
    usNewsNational: 2157, usNewsState: 79,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Clarkston Community School District covers essentially all Clarkston's residents (2020 census blocks). Clarkston High School (#79 in Michigan) enrolls 1,552 students in grades 9-12 with a 97% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 1026 in 2025-26 (MI School Data)."
  },
  "Clawson (MI)": {
    hs: "Clawson High School",
    district: "Clawson Public Schools",
    usNewsNational: 10741, usNewsState: 396,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Clawson Public Schools covers essentially all Clawson's residents (2020 census blocks). Clawson High School (#396 in Michigan) enrolls 369 students in grades 9-12 with an 81% graduation rate; its average SAT total was 1002 in 2025-26 (MI School Data)."
  },
  "Clay Township (MI)": {
    hs: "Algonac High School",
    district: "Algonac Community School District",
    usNewsNational: 10431, usNewsState: 382,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Pearl Beach. Algonac Community School District covers essentially all Clay Township's residents (2020 census blocks). Algonac High School (#382 in Michigan) enrolls 430 students in grades 9-12 with a 96% graduation rate and a 14% AP/IB-exam participation rate; its average SAT total was 925 in 2025-26 (MI School Data)."
  },
  "Clinton Township (MI)": {
    hs: ["Dakota High School", "Chippewa Valley High School", "Clintondale High School"],
    district: ["Chippewa Valley Schools", "Chippewa Valley Schools", "Clintondale Community Schools"],
    usNewsNational: 4603, usNewsState: 167,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Clinton Township is split between school districts (2020 census-block shares): Chippewa Valley Schools about 53%, Clintondale Community Schools about 15%; students attend Dakota High School, Chippewa Valley High School or Clintondale High School depending on address. Smaller shares are in L'Anse Creuse Public Schools (14%), Fraser Public Schools (10%) and Mount Clemens Community Schools (7%). US News also lists International Academy of Macomb (#2 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Dakota High School (#167 in Michigan) enrolls 2,476 students in grades 9-12 with a 95% graduation rate and a 45% AP/IB-exam participation rate; its average SAT total was 985 in 2025-26 (MI School Data). Also: Chippewa Valley High School (#297 in Michigan) enrolls 2,162 students in grades 9-12 with a 95% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 934 in 2025-26 (MI School Data)."
  },
  "Clyde Township (MI)": {
    hs: ["Port Huron Northern High School", "Port Huron High School"],
    district: ["Port Huron Area School District", "Port Huron Area School District"],
    feedsTo: "Port Huron Northern High School / Port Huron High School",
    usNewsNational: 7197, usNewsState: 264,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shares are for residents outside the separately listed Ruby. Port Huron Area School District covers about 97% of Clyde Township's residents (2020 census blocks). The rest are mostly in Yale Public Schools (3%). Port Huron Area School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Clyde Township has no high school inside its boundary; the high schools are in Port Huron. Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data). Also: Port Huron High School (#461 in Michigan) enrolls 988 students in grades 9-12 with an 83% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 897 in 2025-26 (MI School Data)."
  },
  "Cohoctah Township (MI)": {
    hs: ["Howell High School", "Fowlerville High School", "Byron Area High School"],
    district: ["Howell Public Schools", "Fowlerville Community Schools", "Byron Area Schools"],
    feedsTo: "Howell High School / Fowlerville High School / Byron Area High School",
    usNewsNational: 4166, usNewsState: 153,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Cohoctah Township is split between school districts (2020 census-block shares): Howell Public Schools about 48%, Fowlerville Community Schools about 30%, Byron Area Schools about 22%; students attend Howell High School, Fowlerville High School or Byron Area High School depending on address. Cohoctah Township has no high school inside its boundary; the high schools are in Byron, Fowlerville, Howell. Howell High School (#153 in Michigan) enrolls 1,964 students in grades 9-12 with a 97% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 986 in 2025-26 (MI School Data). Also: Fowlerville High School (#449 in Michigan) enrolls 774 students in grades 9-12 with a 92% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 944 in 2025-26 (MI School Data)."
  },
  "Columbiaville (MI)": {
    hs: "Lakeville High School",
    district: "Lakeville Community Schools",
    feedsTo: "Lakeville High School",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lakeville Community Schools covers essentially all Columbiaville's residents (2020 census blocks). Columbiaville has no high school inside its boundary; the high school is in Otisville. Lakeville High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 354 students in grades 9-12 with an 82% graduation rate; its average SAT total was 852 in 2025-26 (MI School Data)."
  },
  "Columbus Township (MI)": {
    hs: ["Richmond Community High School", "Marine City High School", "St. Clair High School"],
    district: ["Richmond Community Schools", "East China School District", "East China School District"],
    feedsTo: "Richmond Community High School / Marine City High School / St. Clair High School",
    usNewsNational: 3057, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Columbus Township is split between school districts (2020 census-block shares): Richmond Community Schools about 52%, East China School District about 42%; students attend Richmond Community High School, Marine City High School or St. Clair High School depending on address. Smaller shares are in Marysville Public Schools (3%) and Memphis Community Schools (3%). Columbus Township has no high school inside its boundary; the high schools are in Marine City, Richmond, Saint Clair. Richmond Community High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 490 students in grades 9-12 with an 89% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 983 in 2025-26 (MI School Data). Also: Marine City High School (#115 in Michigan) enrolls 437 students in grades 9-12 with a 98% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 918 in 2025-26 (MI School Data)."
  },
  "Commerce Township (MI)": {
    hs: ["Walled Lake Northern High School", "Walled Lake Western High School", "Walled Lake Central High School", "Milford High School", "Lakeland High School"],
    district: ["Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools", "Huron Valley Schools", "Huron Valley Schools"],
    usNewsNational: 1981, usNewsState: 72,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shares are for residents outside the separately listed Wolverine Lake. Commerce Township is split between school districts (2020 census-block shares): Walled Lake Consolidated Schools about 77%, Huron Valley Schools about 23%; students attend Walled Lake Northern High School, Walled Lake Western High School, Walled Lake Central High School, Milford High School or Lakeland High School depending on address. Walled Lake Northern High School (#72 in Michigan) enrolls 1,383 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data). Also: Walled Lake Western High School (#95 in Michigan) enrolls 1,000 students in grades 9-12 with a 92% graduation rate and a 49% AP/IB-exam participation rate; its average SAT total was 971 in 2025-26 (MI School Data)."
  },
  "Conway Township (MI)": {
    hs: "Fowlerville High School",
    district: "Fowlerville Community Schools",
    feedsTo: "Fowlerville High School",
    usNewsNational: 12087, usNewsState: 449,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Fowlerville Community Schools covers about 94% of Conway Township's residents (2020 census blocks). The rest are mostly in Webberville Community Schools (4%). Conway Township has no high school inside its boundary; the high school is in Fowlerville. Fowlerville High School (#449 in Michigan) enrolls 774 students in grades 9-12 with a 92% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 944 in 2025-26 (MI School Data)."
  },
  "Cottrellville Township (MI)": {
    hs: ["Marine City High School", "St. Clair High School"],
    district: ["East China School District", "East China School District"],
    usNewsNational: 3057, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "East China School District covers essentially all Cottrellville Township's residents (2020 census blocks). East China School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Marine City High School (#115 in Michigan) enrolls 437 students in grades 9-12 with a 98% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 918 in 2025-26 (MI School Data). Also: St. Clair High School (#209 in Michigan) enrolls 715 students in grades 9-12 with a 95% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Dearborn (MI)": {
    hs: ["Dearborn High School", "Fordson High School", "Edsel Ford High School"],
    district: ["Dearborn Public Schools", "Dearborn Public Schools", "Dearborn Public Schools"],
    usNewsNational: 3664, usNewsState: 135,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Dearborn Public Schools covers essentially all Dearborn's residents (2020 census blocks). Dearborn Public Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). US News also lists Henry Ford Early College (#138 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. US News also lists Henry Ford Early Collegeadvanced Manufacturing (#223 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Dearborn High School (#135 in Michigan) enrolls 1,775 students in grades 9-12 with a 98% graduation rate and a 41% AP/IB-exam participation rate; its average SAT total was 965 in 2025-26 (MI School Data). Also: Fordson High School (#199 in Michigan) enrolls 1,966 students in grades 9-12 with a 97% graduation rate and a 40% AP/IB-exam participation rate; its average SAT total was 892 in 2025-26 (MI School Data)."
  },
  "Dearborn Heights (MI)": {
    hs: ["Crestwood High School", "Annapolis High School"],
    district: ["Crestwood School District", "Dearborn Heights School District #7"],
    usNewsNational: 3777, usNewsState: 142,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Dearborn Heights is split between school districts (2020 census-block shares): Crestwood School District about 50%, Dearborn Heights School District #7 about 21%; students attend Crestwood High School or Annapolis High School depending on address. Smaller shares are in Dearborn Public Schools (15%) and Westwood Community Schools (13%). Crestwood High School (#142 in Michigan) enrolls 1,272 students in grades 9-12 with a 97% graduation rate and a 48% AP/IB-exam participation rate; its average SAT total was 920 in 2025-26 (MI School Data). Also: Annapolis High School (#390 in Michigan) enrolls 682 students in grades 9-12 with an 88% graduation rate and a 23% AP/IB-exam participation rate; its average SAT total was 820 in 2025-26 (MI School Data)."
  },
  "Deerfield Township (Lapeer) (MI)": {
    hs: "North Branch High School",
    district: "North Branch Area Schools",
    feedsTo: "North Branch High School",
    usNewsNational: 6147, usNewsState: 219,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Barnes Lake. North Branch Area Schools covers about 79% of Deerfield Township (Lapeer)'s residents (2020 census blocks). The rest are mostly in Lakeville Community Schools (10%) and Lapeer Community Schools (10%). Deerfield Township (Lapeer) has no high school inside its boundary; the high school is in North Branch. North Branch High School (#219 in Michigan) enrolls 695 students in grades 9-12 with a 97% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 919 in 2025-26 (MI School Data)."
  },
  "Deerfield Township (Livingston) (MI)": {
    hs: ["Hartland High School", "Linden High School", "Howell High School"],
    district: ["Hartland Consolidated Schools", "Linden Community Schools", "Howell Public Schools"],
    feedsTo: "Hartland High School / Linden High School / Howell High School",
    usNewsNational: 3081, usNewsState: 117,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Deerfield Township (Livingston) is split between school districts (2020 census-block shares): Hartland Consolidated Schools about 50%, Linden Community Schools about 25%, Howell Public Schools about 24%; students attend Hartland High School, Linden High School or Howell High School depending on address. Deerfield Township (Livingston) has no high school inside its boundary; the high schools are in Hartland, Howell, Linden. Hartland High School (#117 in Michigan) enrolls 1,610 students in grades 9-12 with a 98% graduation rate and a 45% AP/IB-exam participation rate; its average SAT total was 1032 in 2025-26 (MI School Data). Also: Linden High School (#182 in Michigan) enrolls 775 students in grades 9-12 with an 89% graduation rate and a 28% AP/IB-exam participation rate; its average SAT total was 971 in 2025-26 (MI School Data)."
  },
  "Dryden (MI)": {
    hs: "Dryden High School",
    district: "Dryden Community Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Dryden Community Schools covers essentially all Dryden's residents (2020 census blocks). Dryden High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 160 students in grades 9-12 with a 92% graduation rate; its average SAT total was 882 in 2025-26 (MI School Data)."
  },
  "Dryden Township (MI)": {
    hs: "Dryden High School",
    district: "Dryden Community Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Dryden. Dryden Community Schools covers about 80% of Dryden Township's residents (2020 census blocks). The rest are mostly in Oxford Community Schools (10%) and Almont Community Schools (8%). Dryden High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 160 students in grades 9-12 with a 92% graduation rate; its average SAT total was 882 in 2025-26 (MI School Data)."
  },
  "East China Township (MI)": {
    hs: ["Marine City High School", "St. Clair High School"],
    district: ["East China School District", "East China School District"],
    feedsTo: "Marine City High School / St. Clair High School",
    usNewsNational: 3057, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "East China School District covers essentially all East China Township's residents (2020 census blocks). East China School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). East China Township has no high school inside its boundary; the high schools are in Marine City, Saint Clair. Marine City High School (#115 in Michigan) enrolls 437 students in grades 9-12 with a 98% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 918 in 2025-26 (MI School Data). Also: St. Clair High School (#209 in Michigan) enrolls 715 students in grades 9-12 with a 95% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Eastpointe (MI)": {
    hs: "Eastpointe High School",
    district: "Eastpointe Community Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Eastpointe Community Schools covers about 92% of Eastpointe's residents (2020 census blocks). The rest are mostly in South Lake Schools (8%). Eastpointe High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 477 students in grades 9-12 with a 66% graduation rate; its average SAT total was 778 in 2025-26 (MI School Data)."
  },
  "Ecorse (MI)": {
    hs: "Ecorse Community High School",
    district: "Ecorse Public Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ecorse Public Schools covers about 93% of Ecorse's residents (2020 census blocks). The rest are mostly in River Rouge School District (7%). Ecorse Community High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 340 students in grades 9-12 with an 84% graduation rate; its average SAT total was 761 in 2025-26 (MI School Data)."
  },
  "Elba Township (MI)": {
    hs: "Lapeer East Senior High School",
    district: "Lapeer Community Schools",
    feedsTo: "Lapeer East Senior High School",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lapeer Community Schools covers about 93% of Elba Township's residents (2020 census blocks). The rest are mostly in Davison Community Schools (7%). Elba Township has no high school inside its boundary; the high school is in Lapeer. Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Emmett Township (MI)": {
    hs: ["Capac High School", "Yale Senior High School"],
    district: ["Capac Community Schools", "Yale Public Schools"],
    feedsTo: "Capac High School / Yale Senior High School",
    usNewsNational: 4482, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Emmett Township is split between school districts (2020 census-block shares): Capac Community Schools about 54%, Yale Public Schools about 46%; students attend Capac High School or Yale Senior High School depending on address. Emmett Township has no high school inside its boundary; the high schools are in Capac, Yale. Capac High School (#357 in Michigan) enrolls 202 students in grades 9-12 with a 98% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 870 in 2025-26 (MI School Data). Also: Yale Senior High School (#166 in Michigan) enrolls 509 students in grades 9-12 with a 98% graduation rate and a 32% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Farmington (MI)": {
    hs: ["Farmington High School", "North Farmington High School"],
    district: ["Farmington Public Schools", "Farmington Public Schools"],
    usNewsNational: 2459, usNewsState: 89,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Farmington Public Schools covers essentially all Farmington's residents (2020 census blocks). Farmington Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Farmington High School (#128 in Michigan) enrolls 1,470 students in grades 9-12 with a 95% graduation rate and a 33% AP/IB-exam participation rate; its average SAT total was 1039 in 2025-26 (MI School Data). Also: North Farmington High School (#89 in Michigan) enrolls 1,157 students in grades 9-12 with a 95% graduation rate and a 44% AP/IB-exam participation rate; its average SAT total was 978 in 2025-26 (MI School Data)."
  },
  "Farmington Hills (MI)": {
    hs: ["Farmington High School", "North Farmington High School"],
    district: ["Farmington Public Schools", "Farmington Public Schools"],
    usNewsNational: 2459, usNewsState: 89,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Farmington Public Schools covers about 90% of Farmington Hills's residents (2020 census blocks). The rest are mostly in Walled Lake Consolidated Schools (6%) and Clarenceville School District (4%). Farmington Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Farmington High School (#128 in Michigan) enrolls 1,470 students in grades 9-12 with a 95% graduation rate and a 33% AP/IB-exam participation rate; its average SAT total was 1039 in 2025-26 (MI School Data). Also: North Farmington High School (#89 in Michigan) enrolls 1,157 students in grades 9-12 with a 95% graduation rate and a 44% AP/IB-exam participation rate; its average SAT total was 978 in 2025-26 (MI School Data)."
  },
  "Ferndale (MI)": {
    hs: ["Ferndale High School", "Hazel Park High School"],
    district: ["Ferndale Public Schools", "Hazel Park Schools"],
    usNewsNational: 10990, usNewsState: 404,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Ferndale is split between school districts (2020 census-block shares): Ferndale Public Schools about 78%, Hazel Park Schools about 22%; students attend Ferndale High School or Hazel Park High School depending on address. US News also lists University High School (in the unranked-bottom band, 494–678 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Ferndale High School (#404 in Michigan) enrolls 732 students in grades 9-12 with a 94% graduation rate and a 21% AP/IB-exam participation rate; its average SAT total was 912 in 2025-26 (MI School Data). Also: Hazel Park High School (#478 in Michigan) enrolls 567 students in grades 9-12 with a 90% graduation rate and a 24% AP/IB-exam participation rate; its average SAT total was 802 in 2025-26 (MI School Data)."
  },
  "Flat Rock (MI)": {
    hs: "Flat Rock Community High School",
    district: "Flat Rock Community Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Flat Rock Community Schools covers about 84% of Flat Rock's residents (2020 census blocks). The rest are mostly in Woodhaven-Brownstown School District (13%) and Gibraltar School District (3%). Flat Rock Community High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 501 students in grades 9-12 with a 96% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 986 in 2025-26 (MI School Data)."
  },
  "Fort Gratiot Township (MI)": {
    hs: ["Port Huron Northern High School", "Port Huron High School"],
    district: ["Port Huron Area School District", "Port Huron Area School District"],
    usNewsNational: 7197, usNewsState: 264,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Port Huron Area School District covers essentially all Fort Gratiot Township's residents (2020 census blocks). Port Huron Area School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data). Also: Port Huron High School (#461 in Michigan) enrolls 988 students in grades 9-12 with an 83% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 897 in 2025-26 (MI School Data)."
  },
  "Fowlerville (MI)": {
    hs: "Fowlerville High School",
    district: "Fowlerville Community Schools",
    usNewsNational: 12087, usNewsState: 449,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Fowlerville Community Schools covers essentially all Fowlerville's residents (2020 census blocks). Fowlerville High School (#449 in Michigan) enrolls 774 students in grades 9-12 with a 92% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 944 in 2025-26 (MI School Data)."
  },
  "Franklin (MI)": {
    hs: ["Ernest W. Seaholm High School", "Wylie E. Groves High School"],
    district: ["Birmingham Public Schools", "Birmingham Public Schools"],
    feedsTo: "Ernest W. Seaholm High School / Wylie E. Groves High School",
    usNewsNational: 829, usNewsState: 28,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Birmingham Public Schools covers essentially all Franklin's residents (2020 census blocks). Birmingham Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Franklin has no high school inside its boundary; the high schools are in Beverly Hills, Birmingham. Ernest W. Seaholm High School (#28 in Michigan) enrolls 1,057 students in grades 9-12 with a 98% graduation rate and a 65% AP/IB-exam participation rate; its average SAT total was 1127 in 2025-26 (MI School Data). Also: Wylie E. Groves High School (#32 in Michigan) enrolls 1,107 students in grades 9-12 with a 96% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1069 in 2025-26 (MI School Data)."
  },
  "Fraser (MI)": {
    hs: "Fraser High School",
    district: "Fraser Public Schools",
    usNewsNational: 6599, usNewsState: 234,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Fraser Public Schools covers essentially all Fraser's residents (2020 census blocks). Fraser High School (#234 in Michigan) enrolls 1,431 students in grades 9-12 with a 97% graduation rate and a 21% AP/IB-exam participation rate; its average SAT total was 935 in 2025-26 (MI School Data)."
  },
  "Garden City (MI)": {
    hs: "Garden City High School",
    district: "Garden City Public Schools",
    usNewsNational: 5607, usNewsState: 203,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Garden City Public Schools covers essentially all Garden City's residents (2020 census blocks). Garden City High School (#203 in Michigan) enrolls 896 students in grades 9-12 with a 92% graduation rate and a 47% AP/IB-exam participation rate; its average SAT total was 911 in 2025-26 (MI School Data)."
  },
  "Genoa Township (MI)": {
    hs: ["Howell High School", "Brighton High School"],
    district: ["Howell Public Schools", "Brighton Area Schools"],
    usNewsNational: 1660, usNewsState: 57,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Genoa Township is split between school districts (2020 census-block shares): Howell Public Schools about 60%, Brighton Area Schools about 34%; students attend Howell High School or Brighton High School depending on address. Smaller shares are in Hartland Consolidated Schools (5%). Howell High School (#153 in Michigan) enrolls 1,964 students in grades 9-12 with a 97% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 986 in 2025-26 (MI School Data). Also: Brighton High School (#57 in Michigan) enrolls 1,887 students in grades 9-12 with a 98% graduation rate and a 55% AP/IB-exam participation rate; its average SAT total was 1057 in 2025-26 (MI School Data)."
  },
  "Gibraltar (MI)": {
    hs: "Oscar A. Carlson High School",
    district: "Gibraltar School District",
    usNewsNational: 10891, usNewsState: 402,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Gibraltar School District covers essentially all Gibraltar's residents (2020 census blocks). Oscar A. Carlson High School (#402 in Michigan) enrolls 1,104 students in grades 9-12 with a 99% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 958 in 2025-26 (MI School Data)."
  },
  "Goodland Township (MI)": {
    hs: "Imlay City High School",
    district: "Imlay City Community Schools",
    feedsTo: "Imlay City High School",
    usNewsNational: 6586, usNewsState: 233,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Imlay City Community Schools covers about 87% of Goodland Township's residents (2020 census blocks). The rest are mostly in Brown City Community Schools (8%) and North Branch Area Schools (5%). Goodland Township has no high school inside its boundary; the high school is in Imlay City. Imlay City High School (#233 in Michigan) enrolls 554 students in grades 9-12 with a 96% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 937 in 2025-26 (MI School Data)."
  },
  "Grant Township (MI)": {
    hs: ["Port Huron Northern High School", "Port Huron High School", "Croswell-Lexington High School", "Yale Senior High School"],
    district: ["Port Huron Area School District", "Port Huron Area School District", "Croswell-Lexington Community Schools", "Yale Public Schools"],
    feedsTo: "Port Huron Northern High School / Port Huron High School / Croswell-Lexington High School / Yale Senior High School",
    usNewsNational: 4482, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Grant Township is split between school districts (2020 census-block shares): Port Huron Area School District about 44%, Croswell-Lexington Community Schools about 35%, Yale Public Schools about 22%; students attend Port Huron Northern High School, Port Huron High School, Croswell-Lexington High School or Yale Senior High School depending on address. Grant Township has no high school inside its boundary; the high schools are in Croswell, Port Huron, Yale. Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data). Also: Port Huron High School (#461 in Michigan) enrolls 988 students in grades 9-12 with an 83% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 897 in 2025-26 (MI School Data)."
  },
  "Green Oak Township (MI)": {
    hs: ["Brighton High School", "South Lyon East High School", "South Lyon High School"],
    district: ["Brighton Area Schools", "South Lyon Community Schools", "South Lyon Community Schools"],
    feedsTo: "Brighton High School / South Lyon East High School / South Lyon High School",
    usNewsNational: 1660, usNewsState: 57,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Green Oak Township is split between school districts (2020 census-block shares): Brighton Area Schools about 45%, South Lyon Community Schools about 44%; students attend Brighton High School, South Lyon East High School or South Lyon High School depending on address. Smaller shares are in Whitmore Lake Public Schools (11%). Green Oak Township has no high school inside its boundary; the high schools are in Brighton, South Lyon. Brighton High School (#57 in Michigan) enrolls 1,887 students in grades 9-12 with a 98% graduation rate and a 55% AP/IB-exam participation rate; its average SAT total was 1057 in 2025-26 (MI School Data). Also: South Lyon East High School (#99 in Michigan) enrolls 1,174 students in grades 9-12 with a 92% graduation rate and a 47% AP/IB-exam participation rate; its average SAT total was 1074 in 2025-26 (MI School Data)."
  },
  "Greenwood Township (MI)": {
    hs: "Yale Senior High School",
    district: "Yale Public Schools",
    feedsTo: "Yale Senior High School",
    usNewsNational: 4482, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Yale Public Schools covers about 95% of Greenwood Township's residents (2020 census blocks). The rest are mostly in Croswell-Lexington Community Schools (5%). Greenwood Township has no high school inside its boundary; the high school is in Yale. Yale Senior High School (#166 in Michigan) enrolls 509 students in grades 9-12 with a 98% graduation rate and a 32% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Grosse Ile Township (MI)": {
    hs: "Grosse Ile High School",
    district: "Grosse Ile Township Schools",
    usNewsNational: 2225, usNewsState: 80,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Grosse Ile Township Schools covers essentially all Grosse Ile Township's residents (2020 census blocks). Grosse Ile High School (#80 in Michigan) enrolls 510 students in grades 9-12 with a 100% graduation rate and a 55% AP/IB-exam participation rate; its average SAT total was 1035 in 2025-26 (MI School Data)."
  },
  "Grosse Pointe (MI)": {
    hs: ["Grosse Pointe South High School", "Grosse Pointe North High School"],
    district: ["Grosse Pointe Public Schools", "Grosse Pointe Public Schools"],
    usNewsNational: 414, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Grosse Pointe Public Schools covers essentially all Grosse Pointe's residents (2020 census blocks). Grosse Pointe Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Grosse Pointe South High School (#10 in Michigan) enrolls 1,113 students in grades 9-12 with a 97% graduation rate and a 73% AP/IB-exam participation rate; its average SAT total was 1122 in 2025-26 (MI School Data). Also: Grosse Pointe North High School (#49 in Michigan) enrolls 918 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1012 in 2025-26 (MI School Data)."
  },
  "Grosse Pointe Farms (MI)": {
    hs: ["Grosse Pointe South High School", "Grosse Pointe North High School"],
    district: ["Grosse Pointe Public Schools", "Grosse Pointe Public Schools"],
    usNewsNational: 414, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Grosse Pointe Public Schools covers essentially all Grosse Pointe Farms's residents (2020 census blocks). Grosse Pointe Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Grosse Pointe South High School (#10 in Michigan) enrolls 1,113 students in grades 9-12 with a 97% graduation rate and a 73% AP/IB-exam participation rate; its average SAT total was 1122 in 2025-26 (MI School Data). Also: Grosse Pointe North High School (#49 in Michigan) enrolls 918 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1012 in 2025-26 (MI School Data)."
  },
  "Grosse Pointe Park (MI)": {
    hs: ["Grosse Pointe South High School", "Grosse Pointe North High School"],
    district: ["Grosse Pointe Public Schools", "Grosse Pointe Public Schools"],
    feedsTo: "Grosse Pointe South High School / Grosse Pointe North High School",
    usNewsNational: 414, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Grosse Pointe Public Schools covers essentially all Grosse Pointe Park's residents (2020 census blocks). Grosse Pointe Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Grosse Pointe Park has no high school inside its boundary; the high schools are in Grosse Pointe Farms, Grosse Pointe Woods. Grosse Pointe South High School (#10 in Michigan) enrolls 1,113 students in grades 9-12 with a 97% graduation rate and a 73% AP/IB-exam participation rate; its average SAT total was 1122 in 2025-26 (MI School Data). Also: Grosse Pointe North High School (#49 in Michigan) enrolls 918 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1012 in 2025-26 (MI School Data)."
  },
  "Grosse Pointe Shores (MI)": {
    hs: ["Grosse Pointe South High School", "Grosse Pointe North High School"],
    district: ["Grosse Pointe Public Schools", "Grosse Pointe Public Schools"],
    feedsTo: "Grosse Pointe South High School / Grosse Pointe North High School",
    usNewsNational: 414, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Grosse Pointe Public Schools covers about 97% of Grosse Pointe Shores's residents (2020 census blocks). Grosse Pointe Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Grosse Pointe Shores has no high school inside its boundary; the high schools are in Grosse Pointe Farms, Grosse Pointe Woods. Grosse Pointe South High School (#10 in Michigan) enrolls 1,113 students in grades 9-12 with a 97% graduation rate and a 73% AP/IB-exam participation rate; its average SAT total was 1122 in 2025-26 (MI School Data). Also: Grosse Pointe North High School (#49 in Michigan) enrolls 918 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1012 in 2025-26 (MI School Data)."
  },
  "Grosse Pointe Woods (MI)": {
    hs: ["Grosse Pointe South High School", "Grosse Pointe North High School"],
    district: ["Grosse Pointe Public Schools", "Grosse Pointe Public Schools"],
    usNewsNational: 414, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Grosse Pointe Public Schools covers essentially all Grosse Pointe Woods's residents (2020 census blocks). Grosse Pointe Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Grosse Pointe South High School (#10 in Michigan) enrolls 1,113 students in grades 9-12 with a 97% graduation rate and a 73% AP/IB-exam participation rate; its average SAT total was 1122 in 2025-26 (MI School Data). Also: Grosse Pointe North High School (#49 in Michigan) enrolls 918 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1012 in 2025-26 (MI School Data)."
  },
  "Groveland Township (MI)": {
    hs: ["Brandon High School", "Holly High School"],
    district: ["Brandon School District", "Holly Area Schools"],
    feedsTo: "Brandon High School / Holly High School",
    usNewsNational: 3888, usNewsState: 147,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Groveland Township is split between school districts (2020 census-block shares): Brandon School District about 56%, Holly Area Schools about 42%; students attend Brandon High School or Holly High School depending on address. Groveland Township has no high school inside its boundary; the high schools are in Holly, Ortonville. Brandon High School (#147 in Michigan) enrolls 648 students in grades 9-12 with a 94% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 937 in 2025-26 (MI School Data). Also: Holly High School (#290 in Michigan) enrolls 992 students in grades 9-12 with an 85% graduation rate and a 26% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Hadley Township (MI)": {
    hs: ["Lapeer East Senior High School", "Goodrich High School"],
    district: ["Lapeer Community Schools", "Goodrich Area Schools"],
    feedsTo: "Lapeer East Senior High School / Goodrich High School",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Hadley Township is split between school districts (2020 census-block shares): Lapeer Community Schools about 64%, Goodrich Area Schools about 26%; students attend Lapeer East Senior High School or Goodrich High School depending on address. Smaller shares are in Brandon School District (9%). Hadley Township has no high school inside its boundary; the high schools are in Goodrich, Lapeer. Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data). Also: Goodrich High School (#258 in Michigan) enrolls 653 students in grades 9-12 with a 94% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 993 in 2025-26 (MI School Data)."
  },
  "Hamburg Township (MI)": {
    hs: "Pinckney Community High School",
    district: "Pinckney Community Schools",
    feedsTo: "Pinckney Community High School",
    usNewsNational: 11136, usNewsState: 413,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pinckney Community Schools covers about 80% of Hamburg Township's residents (2020 census blocks). The rest are mostly in Brighton Area Schools (15%) and Dexter Community Schools (5%). Hamburg Township has no high school inside its boundary; the high school is in Pinckney. Pinckney Community High School (#413 in Michigan) enrolls 619 students in grades 9-12 with a 90% graduation rate and a 37% AP/IB-exam participation rate; its average SAT total was 990 in 2025-26 (MI School Data)."
  },
  "Hamtramck (MI)": {
    hs: "Hamtramck High School",
    district: "Hamtramck Public Schools",
    usNewsNational: 10919, usNewsState: 403,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Hamtramck Public Schools covers essentially all Hamtramck's residents (2020 census blocks). Hamtramck High School (#403 in Michigan) enrolls 926 students in grades 9-12 with an 87% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 802 in 2025-26 (MI School Data)."
  },
  "Handy Township (MI)": {
    hs: "Fowlerville High School",
    district: "Fowlerville Community Schools",
    usNewsNational: 12087, usNewsState: 449,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Fowlerville. Fowlerville Community Schools covers about 99% of Handy Township's residents (2020 census blocks). Fowlerville High School (#449 in Michigan) enrolls 774 students in grades 9-12 with a 92% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 944 in 2025-26 (MI School Data)."
  },
  "Harper Woods (MI)": {
    hs: ["Harper Woods High School", "Grosse Pointe South High School", "Grosse Pointe North High School"],
    district: ["Harper Woods Schools", "Grosse Pointe Public Schools", "Grosse Pointe Public Schools"],
    usNewsNational: 414, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Harper Woods is split between school districts (2020 census-block shares): Harper Woods Schools about 61%, Grosse Pointe Public Schools about 39%; students attend Harper Woods High School, Grosse Pointe South High School or Grosse Pointe North High School depending on address. Harper Woods High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 877 students in grades 9-12 with a 97% graduation rate and a 17% AP/IB-exam participation rate; its average SAT total was 799 in 2025-26 (MI School Data). Also: Grosse Pointe South High School (#10 in Michigan) enrolls 1,113 students in grades 9-12 with a 97% graduation rate and a 73% AP/IB-exam participation rate; its average SAT total was 1122 in 2025-26 (MI School Data)."
  },
  "Harrison Township (MI)": {
    hs: ["L'Anse Creuse High School", "L'Anse Creuse High School - North"],
    district: ["L'Anse Creuse Public Schools", "L'Anse Creuse Public Schools"],
    usNewsNational: 4678, usNewsState: 171,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "L'Anse Creuse Public Schools covers essentially all Harrison Township's residents (2020 census blocks). L'Anse Creuse Public Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). L'Anse Creuse High School (#208 in Michigan) enrolls 1,172 students in grades 9-12 with a 93% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 929 in 2025-26 (MI School Data). Also: L'Anse Creuse High School - North (#171 in Michigan) enrolls 1,545 students in grades 9-12 with a 94% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 998 in 2025-26 (MI School Data)."
  },
  "Hartland (MI)": {
    hs: "Hartland High School",
    district: "Hartland Consolidated Schools",
    usNewsNational: 3081, usNewsState: 117,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Hartland Consolidated Schools covers essentially all Hartland's residents (2020 census blocks). Hartland High School (#117 in Michigan) enrolls 1,610 students in grades 9-12 with a 98% graduation rate and a 45% AP/IB-exam participation rate; its average SAT total was 1032 in 2025-26 (MI School Data)."
  },
  "Hartland Township (MI)": {
    hs: "Hartland High School",
    district: "Hartland Consolidated Schools",
    usNewsNational: 3081, usNewsState: 117,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Hartland. Hartland Consolidated Schools covers essentially all Hartland Township's residents (2020 census blocks). Hartland High School (#117 in Michigan) enrolls 1,610 students in grades 9-12 with a 98% graduation rate and a 45% AP/IB-exam participation rate; its average SAT total was 1032 in 2025-26 (MI School Data)."
  },
  "Hazel Park (MI)": {
    hs: "Hazel Park High School",
    district: "Hazel Park Schools",
    usNewsNational: 12946, usNewsState: 478,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Hazel Park Schools covers essentially all Hazel Park's residents (2020 census blocks). Hazel Park High School (#478 in Michigan) enrolls 567 students in grades 9-12 with a 90% graduation rate and a 24% AP/IB-exam participation rate; its average SAT total was 802 in 2025-26 (MI School Data)."
  },
  "Highland Park (MI)": {
    hs: "Northwestern High School",
    district: "Highland Park City Schools (high-school students served by DPSCD)",
    feedsTo: "Northwestern High School",
    usNewsNational: 12232, usNewsState: 454,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Highland Park has no district-run high school; per Wikipedia (Highland Park Schools), since 2017 the district has a cooperative agreement with Detroit Public Schools Community District under which Northwestern High School is the neighborhood high school (not verified against district records). Northwestern High School (#454 in Michigan) enrolls 305 students in grades 9-12 with a 57% graduation rate and an 82% AP/IB-exam participation rate; its average SAT total was 744 in 2025-26 (MI School Data)."
  },
  "Highland Township (MI)": {
    hs: ["Milford High School", "Lakeland High School"],
    district: ["Huron Valley Schools", "Huron Valley Schools"],
    usNewsNational: 2434, usNewsState: 87,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Huron Valley Schools covers essentially all Highland Township's residents (2020 census blocks). Huron Valley Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Milford High School (#100 in Michigan) enrolls 1,173 students in grades 9-12 with a 91% graduation rate and a 39% AP/IB-exam participation rate; its average SAT total was 998 in 2025-26 (MI School Data). Also: Lakeland High School (#87 in Michigan) enrolls 1,012 students in grades 9-12 with a 99% graduation rate and a 47% AP/IB-exam participation rate; its average SAT total was 982 in 2025-26 (MI School Data)."
  },
  "Holly (MI)": {
    hs: "Holly High School",
    district: "Holly Area Schools",
    usNewsNational: 7896, usNewsState: 290,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Holly Area Schools covers essentially all Holly's residents (2020 census blocks). Holly High School (#290 in Michigan) enrolls 992 students in grades 9-12 with an 85% graduation rate and a 26% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Holly Township (MI)": {
    hs: "Holly High School",
    district: "Holly Area Schools",
    usNewsNational: 7896, usNewsState: 290,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Holly. Holly Area Schools covers about 99% of Holly Township's residents (2020 census blocks). Holly High School (#290 in Michigan) enrolls 992 students in grades 9-12 with an 85% graduation rate and a 26% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Howell (MI)": {
    hs: "Howell High School",
    district: "Howell Public Schools",
    usNewsNational: 4166, usNewsState: 153,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Howell Public Schools covers essentially all Howell's residents (2020 census blocks). Howell High School (#153 in Michigan) enrolls 1,964 students in grades 9-12 with a 97% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 986 in 2025-26 (MI School Data)."
  },
  "Howell Township (MI)": {
    hs: "Howell High School",
    district: "Howell Public Schools",
    feedsTo: "Howell High School",
    usNewsNational: 4166, usNewsState: 153,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Howell Public Schools covers about 96% of Howell Township's residents (2020 census blocks). The rest are mostly in Fowlerville Community Schools (4%). Howell Township has no high school inside its boundary; the high school is in Howell. Howell High School (#153 in Michigan) enrolls 1,964 students in grades 9-12 with a 97% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 986 in 2025-26 (MI School Data)."
  },
  "Huntington Woods (MI)": {
    hs: "Berkley High School",
    district: "Berkley School District",
    feedsTo: "Berkley High School",
    usNewsNational: 1360, usNewsState: 46,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Berkley School District covers essentially all Huntington Woods's residents (2020 census blocks). Huntington Woods has no high school inside its boundary; the high school is in Berkley. Berkley High School (#46 in Michigan) enrolls 1,196 students in grades 9-12 with a 95% graduation rate and a 61% AP/IB-exam participation rate; its average SAT total was 1042 in 2025-26 (MI School Data)."
  },
  "Huron Township (MI)": {
    hs: "Huron High School",
    district: "Huron School District",
    usNewsNational: 8093, usNewsState: 302,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Huron School District covers about 81% of Huron Township's residents (2020 census blocks). The rest are mostly in Flat Rock Community Schools (10%) and Woodhaven-Brownstown School District (9%). Huron High School (#302 in Michigan) enrolls 820 students in grades 9-12 with an 88% graduation rate and a 47% AP/IB-exam participation rate; its average SAT total was 994 in 2025-26 (MI School Data)."
  },
  "Imlay City (MI)": {
    hs: "Imlay City High School",
    district: "Imlay City Community Schools",
    usNewsNational: 6586, usNewsState: 233,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Imlay City Community Schools covers essentially all Imlay City's residents (2020 census blocks). Imlay City High School (#233 in Michigan) enrolls 554 students in grades 9-12 with a 96% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 937 in 2025-26 (MI School Data)."
  },
  "Imlay Township (MI)": {
    hs: "Imlay City High School",
    district: "Imlay City Community Schools",
    usNewsNational: 6586, usNewsState: 233,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Imlay City Community Schools covers about 96% of Imlay Township's residents (2020 census blocks). The rest are mostly in Capac Community Schools (4%). Imlay City High School (#233 in Michigan) enrolls 554 students in grades 9-12 with a 96% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 937 in 2025-26 (MI School Data)."
  },
  "Independence Township (MI)": {
    hs: "Clarkston High School",
    district: "Clarkston Community School District",
    usNewsNational: 2157, usNewsState: 79,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Clarkston Community School District covers about 92% of Independence Township's residents (2020 census blocks). The rest are mostly in Waterford School District (4%) and Lake Orion Community Schools (4%). Clarkston High School (#79 in Michigan) enrolls 1,552 students in grades 9-12 with a 97% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 1026 in 2025-26 (MI School Data)."
  },
  "Inkster (MI)": {
    hs: ["Robichaud Senior High School", "John Glenn High School", "Wayne Memorial High School"],
    district: ["Westwood Community Schools", "Wayne-Westland Community Schools", "Wayne-Westland Community Schools"],
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Inkster is split between school districts (2020 census-block shares): Westwood Community Schools about 43%, Wayne-Westland Community Schools about 36%; students attend Robichaud Senior High School, John Glenn High School or Wayne Memorial High School depending on address. Smaller shares are in Taylor School District (13%) and Romulus Community Schools (8%). Robichaud Senior High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 328 students in grades 9-12 with an 89% graduation rate; its average SAT total was 823 in 2025-26 (MI School Data). Also: John Glenn High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 1,363 students in grades 9-12 with a 92% graduation rate and a 16% AP/IB-exam participation rate; its average SAT total was 849 in 2025-26 (MI School Data)."
  },
  "Iosco Township (MI)": {
    hs: ["Fowlerville High School", "Howell High School"],
    district: ["Fowlerville Community Schools", "Howell Public Schools"],
    feedsTo: "Fowlerville High School / Howell High School",
    usNewsNational: 4166, usNewsState: 153,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Iosco Township is split between school districts (2020 census-block shares): Fowlerville Community Schools about 76%, Howell Public Schools about 20%; students attend Fowlerville High School or Howell High School depending on address. Smaller shares are in Stockbridge Community Schools (4%). Iosco Township has no high school inside its boundary; the high schools are in Fowlerville, Howell. Fowlerville High School (#449 in Michigan) enrolls 774 students in grades 9-12 with a 92% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 944 in 2025-26 (MI School Data). Also: Howell High School (#153 in Michigan) enrolls 1,964 students in grades 9-12 with a 97% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 986 in 2025-26 (MI School Data)."
  },
  "Ira Township (MI)": {
    hs: ["Anchor Bay High School", "Algonac High School"],
    district: ["Anchor Bay School District", "Algonac Community School District"],
    usNewsNational: 5354, usNewsState: 193,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Ira Township is split between school districts (2020 census-block shares): Anchor Bay School District about 53%, Algonac Community School District about 37%; students attend Anchor Bay High School or Algonac High School depending on address. Smaller shares are in East China School District (10%). Anchor Bay High School (#193 in Michigan) enrolls 1,740 students in grades 9-12 with a 96% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data). Also: Algonac High School (#382 in Michigan) enrolls 430 students in grades 9-12 with a 96% graduation rate and a 14% AP/IB-exam participation rate; its average SAT total was 925 in 2025-26 (MI School Data)."
  },
  "Keego Harbor (MI)": {
    hs: "West Bloomfield High School",
    district: "West Bloomfield School District",
    feedsTo: "West Bloomfield High School",
    usNewsNational: 4871, usNewsState: 178,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "West Bloomfield School District covers essentially all Keego Harbor's residents (2020 census blocks). US News also lists Oakland Early College (#127 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Keego Harbor has no high school inside its boundary; the high school is in West Bloomfield. West Bloomfield High School (#178 in Michigan) enrolls 1,434 students in grades 9-12 with a 98% graduation rate and a 37% AP/IB-exam participation rate; its average SAT total was 958 in 2025-26 (MI School Data)."
  },
  "Kenockee Township (MI)": {
    hs: "Yale Senior High School",
    district: "Yale Public Schools",
    feedsTo: "Yale Senior High School",
    usNewsNational: 4482, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Yale Public Schools covers about 99% of Kenockee Township's residents (2020 census blocks). Kenockee Township has no high school inside its boundary; the high school is in Yale. Yale Senior High School (#166 in Michigan) enrolls 509 students in grades 9-12 with a 98% graduation rate and a 32% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Kimball Township (MI)": {
    hs: ["Port Huron Northern High School", "Port Huron High School", "Marysville High School"],
    district: ["Port Huron Area School District", "Port Huron Area School District", "Marysville Public Schools"],
    feedsTo: "Port Huron Northern High School / Port Huron High School / Marysville High School",
    usNewsNational: 3761, usNewsState: 141,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Kimball Township is split between school districts (2020 census-block shares): Port Huron Area School District about 79%, Marysville Public Schools about 21%; students attend Port Huron Northern High School, Port Huron High School or Marysville High School depending on address. Kimball Township has no high school inside its boundary; the high schools are in Marysville, Port Huron. Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data). Also: Port Huron High School (#461 in Michigan) enrolls 988 students in grades 9-12 with an 83% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 897 in 2025-26 (MI School Data)."
  },
  "Lake Orion (MI)": {
    hs: "Lake Orion Community High School",
    district: "Lake Orion Community Schools",
    usNewsNational: 2885, usNewsState: 111,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lake Orion Community Schools covers essentially all Lake Orion's residents (2020 census blocks). Lake Orion Community High School (#111 in Michigan) enrolls 2,035 students in grades 9-12 with a 97% graduation rate and a 41% AP/IB-exam participation rate; its average SAT total was 1022 in 2025-26 (MI School Data)."
  },
  "Lakeport (MI)": {
    hs: ["Port Huron Northern High School", "Port Huron High School"],
    district: ["Port Huron Area School District", "Port Huron Area School District"],
    feedsTo: "Port Huron Northern High School / Port Huron High School",
    usNewsNational: 7197, usNewsState: 264,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Port Huron Area School District covers essentially all Lakeport's residents (2020 census blocks). Port Huron Area School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Lakeport has no high school inside its boundary; the high schools are in Port Huron. Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data). Also: Port Huron High School (#461 in Michigan) enrolls 988 students in grades 9-12 with an 83% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 897 in 2025-26 (MI School Data)."
  },
  "Lapeer (MI)": {
    hs: "Lapeer East Senior High School",
    district: "Lapeer Community Schools",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lapeer Community Schools covers essentially all Lapeer's residents (2020 census blocks). Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Lapeer Township (MI)": {
    hs: "Lapeer East Senior High School",
    district: "Lapeer Community Schools",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lapeer Community Schools covers essentially all Lapeer Township's residents (2020 census blocks). Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Lathrup Village (MI)": {
    hs: "Southfield High School for the Arts and Technology",
    district: "Southfield Public Schools",
    feedsTo: "Southfield High School for the Arts and Technology",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Southfield Public Schools covers essentially all Lathrup Village's residents (2020 census blocks). US News also lists University High School Academy (#14 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Lathrup Village has no high school inside its boundary; the high school is in Southfield. Southfield High School for the Arts and Technology (in the unranked-bottom band, 494–678 in Michigan) enrolls 1,049 students in grades 9-12 with an 85% graduation rate and a 7% AP/IB-exam participation rate; its average SAT total was 818 in 2025-26 (MI School Data)."
  },
  "Lenox Township (MI)": {
    hs: ["New Haven High School", "Richmond Community High School", "Anchor Bay High School"],
    district: ["New Haven Community Schools", "Richmond Community Schools", "Anchor Bay School District"],
    usNewsNational: 5354, usNewsState: 193,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shares are for residents outside the separately listed New Haven. Lenox Township is split between school districts (2020 census-block shares): New Haven Community Schools about 56%, Richmond Community Schools about 24%, Anchor Bay School District about 16%; students attend New Haven High School, Richmond Community High School or Anchor Bay High School depending on address. Smaller shares are in Armada Area Schools (4%). New Haven High School (#299 in Michigan) enrolls 314 students in grades 9-12 with a 93% graduation rate and a 31% AP/IB-exam participation rate; its average SAT total was 939 in 2025-26 (MI School Data). Also: Richmond Community High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 490 students in grades 9-12 with an 89% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 983 in 2025-26 (MI School Data)."
  },
  "Lincoln Park (MI)": {
    hs: "Lincoln Park High School",
    district: "Lincoln Park Public Schools",
    usNewsNational: 11617, usNewsState: 431,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lincoln Park Public Schools covers essentially all Lincoln Park's residents (2020 census blocks). Lincoln Park High School (#431 in Michigan) enrolls 1,384 students in grades 9-12 with an 87% graduation rate and a 16% AP/IB-exam participation rate; its average SAT total was 848 in 2025-26 (MI School Data)."
  },
  "Livonia (MI)": {
    hs: ["Stevenson High School", "Churchill High School", "Franklin High School"],
    district: ["Livonia Public Schools", "Livonia Public Schools", "Livonia Public Schools"],
    usNewsNational: 2685, usNewsState: 103,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Livonia Public Schools covers about 92% of Livonia's residents (2020 census blocks). The rest are mostly in Clarenceville School District (8%). Livonia Public Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Stevenson High School (#103 in Michigan) enrolls 1,523 students in grades 9-12 with a 94% graduation rate and a 41% AP/IB-exam participation rate; its average SAT total was 1039 in 2025-26 (MI School Data). Also: Churchill High School (#172 in Michigan) enrolls 1,227 students in grades 9-12 with an 88% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 1041 in 2025-26 (MI School Data)."
  },
  "Lynn Township (MI)": {
    hs: ["Capac High School", "Yale Senior High School"],
    district: ["Capac Community Schools", "Yale Public Schools"],
    feedsTo: "Capac High School / Yale Senior High School",
    usNewsNational: 4482, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Lynn Township is split between school districts (2020 census-block shares): Capac Community Schools about 46%, Yale Public Schools about 41%; students attend Capac High School or Yale Senior High School depending on address. Smaller shares are in Brown City Community Schools (13%). Lynn Township has no high school inside its boundary; the high schools are in Capac, Yale. Capac High School (#357 in Michigan) enrolls 202 students in grades 9-12 with a 98% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 870 in 2025-26 (MI School Data). Also: Yale Senior High School (#166 in Michigan) enrolls 509 students in grades 9-12 with a 98% graduation rate and a 32% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Lyon Township (MI)": {
    hs: ["South Lyon East High School", "South Lyon High School"],
    district: ["South Lyon Community Schools", "South Lyon Community Schools"],
    usNewsNational: 2591, usNewsState: 99,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "South Lyon Community Schools covers about 97% of Lyon Township's residents (2020 census blocks). The rest are mostly in Northville Public Schools (3%). South Lyon Community Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). South Lyon East High School (#99 in Michigan) enrolls 1,174 students in grades 9-12 with a 92% graduation rate and a 47% AP/IB-exam participation rate; its average SAT total was 1074 in 2025-26 (MI School Data). Also: South Lyon High School (#104 in Michigan) enrolls 1,224 students in grades 9-12 with an 89% graduation rate and a 48% AP/IB-exam participation rate; its average SAT total was 1025 in 2025-26 (MI School Data)."
  },
  "Macomb Township (MI)": {
    hs: ["Dakota High School", "Chippewa Valley High School", "Henry Ford II High School", "Eisenhower High School", "Adlai Stevenson High School", "Utica High School"],
    district: ["Chippewa Valley Schools", "Chippewa Valley Schools", "Utica Community Schools", "Utica Community Schools", "Utica Community Schools", "Utica Community Schools"],
    usNewsNational: 1589, usNewsState: 50,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Macomb Township is split between school districts (2020 census-block shares): Chippewa Valley Schools about 57%, Utica Community Schools about 25%; students attend Dakota High School, Chippewa Valley High School, Henry Ford II High School, Eisenhower High School, Adlai Stevenson High School or Utica High School depending on address. Smaller shares are in New Haven Community Schools (9%) and L'Anse Creuse Public Schools (8%). US News also lists International Academy of Macomb (#2 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Dakota High School (#167 in Michigan) enrolls 2,476 students in grades 9-12 with a 95% graduation rate and a 45% AP/IB-exam participation rate; its average SAT total was 985 in 2025-26 (MI School Data). Also: Chippewa Valley High School (#297 in Michigan) enrolls 2,162 students in grades 9-12 with a 95% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 934 in 2025-26 (MI School Data)."
  },
  "Madison Heights (MI)": {
    hs: ["Lamphere High School", "Madison High School"],
    district: ["Lamphere Public Schools", "Madison District Public Schools"],
    usNewsNational: 8686, usNewsState: 319,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Madison Heights is split between school districts (2020 census-block shares): Lamphere Public Schools about 58%, Madison District Public Schools about 42%; students attend Lamphere High School or Madison High School depending on address. Lamphere High School (#319 in Michigan) enrolls 753 students in grades 9-12 with an 89% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 935 in 2025-26 (MI School Data). Also: Madison High School (#384 in Michigan) enrolls 255 students in grades 9-12 with a 78% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 811 in 2025-26 (MI School Data)."
  },
  "Marathon Township (MI)": {
    hs: "Lakeville High School",
    district: "Lakeville Community Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Columbiaville. Lakeville Community Schools covers about 98% of Marathon Township's residents (2020 census blocks). Lakeville High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 354 students in grades 9-12 with an 82% graduation rate; its average SAT total was 852 in 2025-26 (MI School Data)."
  },
  "Marine City (MI)": {
    hs: ["Marine City High School", "St. Clair High School"],
    district: ["East China School District", "East China School District"],
    usNewsNational: 3057, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "East China School District covers essentially all Marine City's residents (2020 census blocks). East China School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Marine City High School (#115 in Michigan) enrolls 437 students in grades 9-12 with a 98% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 918 in 2025-26 (MI School Data). Also: St. Clair High School (#209 in Michigan) enrolls 715 students in grades 9-12 with a 95% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Marion Township (MI)": {
    hs: "Howell High School",
    district: "Howell Public Schools",
    feedsTo: "Howell High School",
    usNewsNational: 4166, usNewsState: 153,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Howell Public Schools covers about 99% of Marion Township's residents (2020 census blocks). Marion Township has no high school inside its boundary; the high school is in Howell. Howell High School (#153 in Michigan) enrolls 1,964 students in grades 9-12 with a 97% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 986 in 2025-26 (MI School Data)."
  },
  "Marysville (MI)": {
    hs: "Marysville High School",
    district: "Marysville Public Schools",
    usNewsNational: 3761, usNewsState: 141,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Marysville Public Schools covers essentially all Marysville's residents (2020 census blocks). Marysville High School (#141 in Michigan) enrolls 806 students in grades 9-12 with a 94% graduation rate and a 45% AP/IB-exam participation rate; its average SAT total was 987 in 2025-26 (MI School Data)."
  },
  "Mayfield Township (MI)": {
    hs: "Lapeer East Senior High School",
    district: "Lapeer Community Schools",
    feedsTo: "Lapeer East Senior High School",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lapeer Community Schools covers essentially all Mayfield Township's residents (2020 census blocks). Mayfield Township has no high school inside its boundary; the high school is in Lapeer. Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Melvindale (MI)": {
    hs: "Melvindale High School",
    district: "Melvindale-North Allen Park Schools",
    usNewsNational: 12702, usNewsState: 469,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Melvindale-North Allen Park Schools covers essentially all Melvindale's residents (2020 census blocks). Melvindale High School (#469 in Michigan) enrolls 982 students in grades 9-12 with an 86% graduation rate and a 19% AP/IB-exam participation rate; its average SAT total was 801 in 2025-26 (MI School Data)."
  },
  "Memphis (MI)": {
    hs: "Memphis Junior/Senior High School",
    district: "Memphis Community Schools",
    usNewsNational: 12962, usNewsState: 480,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Memphis Community Schools covers essentially all Memphis's residents (2020 census blocks). Memphis Junior/Senior High School (#480 in Michigan) enrolls 229 students in grades 9-12 with a 92% graduation rate and a 39% AP/IB-exam participation rate; its average SAT total was 926 in 2025-26 (MI School Data)."
  },
  "Metamora (MI)": {
    hs: "Lapeer East Senior High School",
    district: "Lapeer Community Schools",
    feedsTo: "Lapeer East Senior High School",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lapeer Community Schools covers essentially all Metamora's residents (2020 census blocks). Metamora has no high school inside its boundary; the high school is in Lapeer. Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Metamora Township (MI)": {
    hs: "Lapeer East Senior High School",
    district: "Lapeer Community Schools",
    feedsTo: "Lapeer East Senior High School",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Metamora. Lapeer Community Schools covers about 77% of Metamora Township's residents (2020 census blocks). The rest are mostly in Oxford Community Schools (15%) and Dryden Community Schools (8%). Metamora Township has no high school inside its boundary; the high school is in Lapeer. Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Milford (MI)": {
    hs: ["Milford High School", "Lakeland High School"],
    district: ["Huron Valley Schools", "Huron Valley Schools"],
    feedsTo: "Milford High School / Lakeland High School",
    usNewsNational: 2434, usNewsState: 87,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Huron Valley Schools covers essentially all Milford's residents (2020 census blocks). Huron Valley Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Milford has no high school inside its boundary; the high schools are in Highland, White Lake. Milford High School (#100 in Michigan) enrolls 1,173 students in grades 9-12 with a 91% graduation rate and a 39% AP/IB-exam participation rate; its average SAT total was 998 in 2025-26 (MI School Data). Also: Lakeland High School (#87 in Michigan) enrolls 1,012 students in grades 9-12 with a 99% graduation rate and a 47% AP/IB-exam participation rate; its average SAT total was 982 in 2025-26 (MI School Data)."
  },
  "Milford Township (MI)": {
    hs: ["Milford High School", "Lakeland High School"],
    district: ["Huron Valley Schools", "Huron Valley Schools"],
    feedsTo: "Milford High School / Lakeland High School",
    usNewsNational: 2434, usNewsState: 87,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shares are for residents outside the separately listed Milford. Huron Valley Schools covers about 99% of Milford Township's residents (2020 census blocks). Huron Valley Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Milford Township has no high school inside its boundary; the high schools are in Highland, White Lake. Milford High School (#100 in Michigan) enrolls 1,173 students in grades 9-12 with a 91% graduation rate and a 39% AP/IB-exam participation rate; its average SAT total was 998 in 2025-26 (MI School Data). Also: Lakeland High School (#87 in Michigan) enrolls 1,012 students in grades 9-12 with a 99% graduation rate and a 47% AP/IB-exam participation rate; its average SAT total was 982 in 2025-26 (MI School Data)."
  },
  "Mount Clemens (MI)": {
    hs: "Mount Clemens High School",
    district: "Mount Clemens Community Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Mount Clemens Community Schools covers about 95% of Mount Clemens's residents (2020 census blocks). The rest are mostly in L'Anse Creuse Public Schools (5%). Mount Clemens High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 239 students in grades 9-12 with a 74% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 755 in 2025-26 (MI School Data)."
  },
  "Mussey Township (MI)": {
    hs: "Capac High School",
    district: "Capac Community Schools",
    usNewsNational: 9592, usNewsState: 357,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Capac. Capac Community Schools covers essentially all Mussey Township's residents (2020 census blocks). Capac High School (#357 in Michigan) enrolls 202 students in grades 9-12 with a 98% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 870 in 2025-26 (MI School Data)."
  },
  "New Baltimore (MI)": {
    hs: "Anchor Bay High School",
    district: "Anchor Bay School District",
    feedsTo: "Anchor Bay High School",
    usNewsNational: 5354, usNewsState: 193,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Anchor Bay School District covers essentially all New Baltimore's residents (2020 census blocks). New Baltimore has no high school inside its boundary; the high school is in Ira. Anchor Bay High School (#193 in Michigan) enrolls 1,740 students in grades 9-12 with a 96% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "New Haven (MI)": {
    hs: "New Haven High School",
    district: "New Haven Community Schools",
    usNewsNational: 8034, usNewsState: 299,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "New Haven Community Schools covers essentially all New Haven's residents (2020 census blocks). New Haven High School (#299 in Michigan) enrolls 314 students in grades 9-12 with a 93% graduation rate and a 31% AP/IB-exam participation rate; its average SAT total was 939 in 2025-26 (MI School Data)."
  },
  "North Branch (MI)": {
    hs: "North Branch High School",
    district: "North Branch Area Schools",
    usNewsNational: 6147, usNewsState: 219,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "North Branch Area Schools covers essentially all North Branch's residents (2020 census blocks). North Branch High School (#219 in Michigan) enrolls 695 students in grades 9-12 with a 97% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 919 in 2025-26 (MI School Data)."
  },
  "North Branch Township (MI)": {
    hs: "North Branch High School",
    district: "North Branch Area Schools",
    usNewsNational: 6147, usNewsState: 219,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed North Branch. North Branch Area Schools covers essentially all North Branch Township's residents (2020 census blocks). North Branch High School (#219 in Michigan) enrolls 695 students in grades 9-12 with a 97% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 919 in 2025-26 (MI School Data)."
  },
  "Northville (MI)": {
    hs: "Northville High School",
    district: "Northville Public Schools",
    usNewsNational: 507, usNewsState: 13,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Northville Public Schools covers essentially all Northville's residents (2020 census blocks). Northville High School (#13 in Michigan) enrolls 2,441 students in grades 9-12 with a 98% graduation rate and a 63% AP/IB-exam participation rate; its average SAT total was 1151 in 2025-26 (MI School Data)."
  },
  "Northville Township (MI)": {
    hs: ["Northville High School", "Salem High School", "Canton High School", "Plymouth High School"],
    district: ["Northville Public Schools", "Plymouth-Canton Community Schools", "Plymouth-Canton Community Schools", "Plymouth-Canton Community Schools"],
    usNewsNational: 507, usNewsState: 13,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Northville Township is split between school districts (2020 census-block shares): Northville Public Schools about 83%, Plymouth-Canton Community Schools about 17%; students attend Northville High School, Salem High School, Canton High School or Plymouth High School depending on address. Northville High School (#13 in Michigan) enrolls 2,441 students in grades 9-12 with a 98% graduation rate and a 63% AP/IB-exam participation rate; its average SAT total was 1151 in 2025-26 (MI School Data). Also: Salem High School (#34 in Michigan) enrolls 1,862 students in grades 9-12 with a 96% graduation rate and a 52% AP/IB-exam participation rate; its average SAT total was 1083 in 2025-26 (MI School Data)."
  },
  "Novi (MI)": {
    hs: ["Novi High School", "Walled Lake Northern High School", "Walled Lake Western High School", "Walled Lake Central High School"],
    district: ["Novi Community School District", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools"],
    usNewsNational: 472, usNewsState: 12,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Novi is split between school districts (2020 census-block shares): Novi Community School District about 57%, Walled Lake Consolidated Schools about 25%; students attend Novi High School, Walled Lake Northern High School, Walled Lake Western High School or Walled Lake Central High School depending on address. Smaller shares are in Northville Public Schools (13%) and South Lyon Community Schools (5%). Novi High School (#12 in Michigan) enrolls 2,137 students in grades 9-12 with a 97% graduation rate and a 68% AP/IB-exam participation rate; its average SAT total was 1187 in 2025-26 (MI School Data). Also: Walled Lake Northern High School (#72 in Michigan) enrolls 1,383 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data)."
  },
  "Oak Park (MI)": {
    hs: ["Oak Park High School", "Berkley High School", "Ferndale High School"],
    district: ["Oak Park Schools", "Berkley School District", "Ferndale Public Schools"],
    usNewsNational: 1360, usNewsState: 46,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Oak Park is split between school districts (2020 census-block shares): Oak Park Schools about 63%, Berkley School District about 20%, Ferndale Public Schools about 17%; students attend Oak Park High School, Berkley High School or Ferndale High School depending on address. US News also lists University High School (in the unranked-bottom band, 494–678 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Oak Park High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 798 students in grades 9-12 with an 87% graduation rate and a 23% AP/IB-exam participation rate; its average SAT total was 785 in 2025-26 (MI School Data). Also: Berkley High School (#46 in Michigan) enrolls 1,196 students in grades 9-12 with a 95% graduation rate and a 61% AP/IB-exam participation rate; its average SAT total was 1042 in 2025-26 (MI School Data)."
  },
  "Oakland Township (MI)": {
    hs: ["Rochester Adams High School", "Stoney Creek High School", "Rochester High School"],
    district: ["Rochester Community Schools", "Rochester Community Schools", "Rochester Community Schools"],
    feedsTo: "Rochester Adams High School / Stoney Creek High School / Rochester High School",
    usNewsNational: 400, usNewsState: 8,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rochester Community Schools covers about 85% of Oakland Township's residents (2020 census blocks). The rest are mostly in Lake Orion Community Schools (11%) and Romeo Community Schools (4%). Rochester Community Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Oakland Township has no high school inside its boundary; the high schools are in Rochester Hills. Rochester Adams High School (#8 in Michigan) enrolls 1,521 students in grades 9-12 with a 99% graduation rate and an 81% AP/IB-exam participation rate; its average SAT total was 1146 in 2025-26 (MI School Data). Also: Stoney Creek High School (#22 in Michigan) enrolls 1,478 students in grades 9-12 with a 98% graduation rate and a 78% AP/IB-exam participation rate; its average SAT total was 1095 in 2025-26 (MI School Data)."
  },
  "Oceola Township (MI)": {
    hs: ["Howell High School", "Hartland High School"],
    district: ["Howell Public Schools", "Hartland Consolidated Schools"],
    feedsTo: "Howell High School / Hartland High School",
    usNewsNational: 3081, usNewsState: 117,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Oceola Township is split between school districts (2020 census-block shares): Howell Public Schools about 84%, Hartland Consolidated Schools about 16%; students attend Howell High School or Hartland High School depending on address. Oceola Township has no high school inside its boundary; the high schools are in Hartland, Howell. Howell High School (#153 in Michigan) enrolls 1,964 students in grades 9-12 with a 97% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 986 in 2025-26 (MI School Data). Also: Hartland High School (#117 in Michigan) enrolls 1,610 students in grades 9-12 with a 98% graduation rate and a 45% AP/IB-exam participation rate; its average SAT total was 1032 in 2025-26 (MI School Data)."
  },
  "Orchard Lake Village (MI)": {
    hs: "West Bloomfield High School",
    district: "West Bloomfield School District",
    feedsTo: "West Bloomfield High School",
    usNewsNational: 4871, usNewsState: 178,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "West Bloomfield School District covers about 88% of Orchard Lake Village's residents (2020 census blocks). The rest are mostly in Walled Lake Consolidated Schools (8%) and Bloomfield Hills Schools (4%). US News also lists Oakland Early College (#127 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Orchard Lake Village has no high school inside its boundary; the high school is in West Bloomfield. West Bloomfield High School (#178 in Michigan) enrolls 1,434 students in grades 9-12 with a 98% graduation rate and a 37% AP/IB-exam participation rate; its average SAT total was 958 in 2025-26 (MI School Data)."
  },
  "Oregon Township (MI)": {
    hs: "Lapeer East Senior High School",
    district: "Lapeer Community Schools",
    feedsTo: "Lapeer East Senior High School",
    usNewsNational: 5350, usNewsState: 191,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lapeer Community Schools covers about 87% of Oregon Township's residents (2020 census blocks). The rest are mostly in Lakeville Community Schools (13%). Oregon Township has no high school inside its boundary; the high school is in Lapeer. Lapeer East Senior High School (#191 in Michigan) enrolls 1,006 students in grades 9-12 with a 94% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "Orion Township (MI)": {
    hs: "Lake Orion Community High School",
    district: "Lake Orion Community Schools",
    usNewsNational: 2885, usNewsState: 111,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Lake Orion. Lake Orion Community Schools covers about 95% of Orion Township's residents (2020 census blocks). Lake Orion Community High School (#111 in Michigan) enrolls 2,035 students in grades 9-12 with a 97% graduation rate and a 41% AP/IB-exam participation rate; its average SAT total was 1022 in 2025-26 (MI School Data)."
  },
  "Ortonville (MI)": {
    hs: "Brandon High School",
    district: "Brandon School District",
    usNewsNational: 3888, usNewsState: 147,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Brandon School District covers essentially all Ortonville's residents (2020 census blocks). Brandon High School (#147 in Michigan) enrolls 648 students in grades 9-12 with a 94% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 937 in 2025-26 (MI School Data)."
  },
  "Oxford (MI)": {
    hs: "Oxford High School",
    district: "Oxford Community Schools",
    usNewsNational: 5471, usNewsState: 195,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Oxford Community Schools covers essentially all Oxford's residents (2020 census blocks). Oxford High School (#195 in Michigan) enrolls 1,568 students in grades 9-12 with a 97% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 994 in 2025-26 (MI School Data)."
  },
  "Oxford Township (MI)": {
    hs: ["Oxford High School", "Lake Orion Community High School"],
    district: ["Oxford Community Schools", "Lake Orion Community Schools"],
    usNewsNational: 2885, usNewsState: 111,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shares are for residents outside the separately listed Oxford. Oxford Township is split between school districts (2020 census-block shares): Oxford Community Schools about 82%, Lake Orion Community Schools about 18%; students attend Oxford High School or Lake Orion Community High School depending on address. Oxford High School (#195 in Michigan) enrolls 1,568 students in grades 9-12 with a 97% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 994 in 2025-26 (MI School Data). Also: Lake Orion Community High School (#111 in Michigan) enrolls 2,035 students in grades 9-12 with a 97% graduation rate and a 41% AP/IB-exam participation rate; its average SAT total was 1022 in 2025-26 (MI School Data)."
  },
  "Pearl Beach (MI)": {
    hs: "Algonac High School",
    district: "Algonac Community School District",
    usNewsNational: 10431, usNewsState: 382,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Algonac Community School District covers essentially all Pearl Beach's residents (2020 census blocks). Algonac High School (#382 in Michigan) enrolls 430 students in grades 9-12 with a 96% graduation rate and a 14% AP/IB-exam participation rate; its average SAT total was 925 in 2025-26 (MI School Data)."
  },
  "Pinckney (MI)": {
    hs: "Pinckney Community High School",
    district: "Pinckney Community Schools",
    usNewsNational: 11136, usNewsState: 413,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pinckney Community Schools covers essentially all Pinckney's residents (2020 census blocks). Pinckney Community High School (#413 in Michigan) enrolls 619 students in grades 9-12 with a 90% graduation rate and a 37% AP/IB-exam participation rate; its average SAT total was 990 in 2025-26 (MI School Data)."
  },
  "Pleasant Ridge (MI)": {
    hs: "Ferndale High School",
    district: "Ferndale Public Schools",
    feedsTo: "Ferndale High School",
    usNewsNational: 10990, usNewsState: 404,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ferndale Public Schools covers essentially all Pleasant Ridge's residents (2020 census blocks). US News also lists University High School (in the unranked-bottom band, 494–678 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Pleasant Ridge has no high school inside its boundary; the high school is in Ferndale. Ferndale High School (#404 in Michigan) enrolls 732 students in grades 9-12 with a 94% graduation rate and a 21% AP/IB-exam participation rate; its average SAT total was 912 in 2025-26 (MI School Data)."
  },
  "Plymouth (MI)": {
    hs: ["Salem High School", "Canton High School", "Plymouth High School"],
    district: ["Plymouth-Canton Community Schools", "Plymouth-Canton Community Schools", "Plymouth-Canton Community Schools"],
    feedsTo: "Salem High School / Canton High School / Plymouth High School",
    usNewsNational: 1208, usNewsState: 34,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Plymouth-Canton Community Schools covers essentially all Plymouth's residents (2020 census blocks). Plymouth-Canton Community Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Plymouth has no high school inside its boundary; the high schools are in Canton. Salem High School (#34 in Michigan) enrolls 1,862 students in grades 9-12 with a 96% graduation rate and a 52% AP/IB-exam participation rate; its average SAT total was 1083 in 2025-26 (MI School Data). Also: Canton High School (#37 in Michigan) enrolls 1,888 students in grades 9-12 with a 97% graduation rate and a 55% AP/IB-exam participation rate; its average SAT total was 1083 in 2025-26 (MI School Data)."
  },
  "Plymouth Township (MI)": {
    hs: ["Salem High School", "Canton High School", "Plymouth High School"],
    district: ["Plymouth-Canton Community Schools", "Plymouth-Canton Community Schools", "Plymouth-Canton Community Schools"],
    usNewsNational: 1208, usNewsState: 34,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Plymouth-Canton Community Schools covers essentially all Plymouth Township's residents (2020 census blocks). Plymouth-Canton Community Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Salem High School (#34 in Michigan) enrolls 1,862 students in grades 9-12 with a 96% graduation rate and a 52% AP/IB-exam participation rate; its average SAT total was 1083 in 2025-26 (MI School Data). Also: Canton High School (#37 in Michigan) enrolls 1,888 students in grades 9-12 with a 97% graduation rate and a 55% AP/IB-exam participation rate; its average SAT total was 1083 in 2025-26 (MI School Data)."
  },
  "Pontiac (MI)": {
    hs: "Pontiac High School",
    district: "Pontiac City Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pontiac City Schools covers essentially all Pontiac's residents (2020 census blocks). Pontiac High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 992 students in grades 9-12 with a 75% graduation rate and a 16% AP/IB-exam participation rate; its average SAT total was 747 in 2025-26 (MI School Data)."
  },
  "Port Huron (MI)": {
    hs: ["Port Huron Northern High School", "Port Huron High School"],
    district: ["Port Huron Area School District", "Port Huron Area School District"],
    usNewsNational: 7197, usNewsState: 264,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Port Huron Area School District covers essentially all Port Huron's residents (2020 census blocks). Port Huron Area School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data). Also: Port Huron High School (#461 in Michigan) enrolls 988 students in grades 9-12 with an 83% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 897 in 2025-26 (MI School Data)."
  },
  "Port Huron Township (MI)": {
    hs: ["Port Huron Northern High School", "Port Huron High School"],
    district: ["Port Huron Area School District", "Port Huron Area School District"],
    usNewsNational: 7197, usNewsState: 264,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Port Huron Area School District covers essentially all Port Huron Township's residents (2020 census blocks). Port Huron Area School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data). Also: Port Huron High School (#461 in Michigan) enrolls 988 students in grades 9-12 with an 83% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 897 in 2025-26 (MI School Data)."
  },
  "Putnam Township (MI)": {
    hs: "Pinckney Community High School",
    district: "Pinckney Community Schools",
    usNewsNational: 11136, usNewsState: 413,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Shares are for residents outside the separately listed Pinckney. Pinckney Community Schools covers about 95% of Putnam Township's residents (2020 census blocks). The rest are mostly in Howell Public Schools (5%). Pinckney Community High School (#413 in Michigan) enrolls 619 students in grades 9-12 with a 90% graduation rate and a 37% AP/IB-exam participation rate; its average SAT total was 990 in 2025-26 (MI School Data)."
  },
  "Ray Township (MI)": {
    hs: ["Romeo High School", "Armada High School", "New Haven High School"],
    district: ["Romeo Community Schools", "Armada Area Schools", "New Haven Community Schools"],
    feedsTo: "Romeo High School / Armada High School / New Haven High School",
    usNewsNational: 2066, usNewsState: 75,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Ray Township is split between school districts (2020 census-block shares): Romeo Community Schools about 39%, Armada Area Schools about 32%, New Haven Community Schools about 27%; students attend Romeo High School, Armada High School or New Haven High School depending on address. Ray Township has no high school inside its boundary; the high schools are in Armada, New Haven, Washington. Romeo High School (#156 in Michigan) enrolls 1,817 students in grades 9-12 with a 95% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data). Also: Armada High School (#75 in Michigan) enrolls 533 students in grades 9-12 with a 100% graduation rate and a 61% AP/IB-exam participation rate; its average SAT total was 1007 in 2025-26 (MI School Data)."
  },
  "Redford Township (MI)": {
    hs: ["Redford Union High School", "Lee M. Thurston High School"],
    district: ["Redford Union Schools", "South Redford School District"],
    usNewsNational: 8440, usNewsState: 312,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Redford Township is split between school districts (2020 census-block shares): Redford Union Schools about 50%, South Redford School District about 48%; students attend Redford Union High School or Lee M. Thurston High School depending on address. Redford Union High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 510 students in grades 9-12 with a 70% graduation rate and a 10% AP/IB-exam participation rate; its average SAT total was 821 in 2025-26 (MI School Data). Also: Lee M. Thurston High School (#312 in Michigan) enrolls 806 students in grades 9-12 with a 93% graduation rate and a 33% AP/IB-exam participation rate; its average SAT total was 834 in 2025-26 (MI School Data)."
  },
  "Rich Township (MI)": {
    hs: ["North Branch High School", "Mayville High School"],
    district: ["North Branch Area Schools", "Mayville Community Schools"],
    feedsTo: "North Branch High School / Mayville High School",
    usNewsNational: 6147, usNewsState: 219,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rich Township is split between school districts (2020 census-block shares): North Branch Area Schools about 59%, Mayville Community Schools about 41%; students attend North Branch High School or Mayville High School depending on address. Rich Township has no high school inside its boundary; the high schools are in Mayville, North Branch. North Branch High School (#219 in Michigan) enrolls 695 students in grades 9-12 with a 97% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 919 in 2025-26 (MI School Data). Also: Mayville High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 175 students in grades 9-12 with an 82% graduation rate; its average SAT total was 844 in 2025-26 (MI School Data)."
  },
  "Richmond (MI)": {
    hs: "Richmond Community High School",
    district: "Richmond Community Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Richmond Community Schools covers essentially all Richmond's residents (2020 census blocks). Richmond Community High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 490 students in grades 9-12 with an 89% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 983 in 2025-26 (MI School Data)."
  },
  "Richmond Township (MI)": {
    hs: ["Richmond Community High School", "Armada High School", "Memphis Junior/Senior High School"],
    district: ["Richmond Community Schools", "Armada Area Schools", "Memphis Community Schools"],
    usNewsNational: 2066, usNewsState: 75,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Richmond Township is split between school districts (2020 census-block shares): Richmond Community Schools about 45%, Armada Area Schools about 36%, Memphis Community Schools about 19%; students attend Richmond Community High School, Armada High School or Memphis Junior/Senior High School depending on address. Richmond Community High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 490 students in grades 9-12 with an 89% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 983 in 2025-26 (MI School Data). Also: Armada High School (#75 in Michigan) enrolls 533 students in grades 9-12 with a 100% graduation rate and a 61% AP/IB-exam participation rate; its average SAT total was 1007 in 2025-26 (MI School Data)."
  },
  "Riley Township (MI)": {
    hs: ["Memphis Junior/Senior High School", "Capac High School", "Armada High School"],
    district: ["Memphis Community Schools", "Capac Community Schools", "Armada Area Schools"],
    usNewsNational: 2066, usNewsState: 75,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Riley Township is split between school districts (2020 census-block shares): Memphis Community Schools about 48%, Capac Community Schools about 36%, Armada Area Schools about 15%; students attend Memphis Junior/Senior High School, Capac High School or Armada High School depending on address. Memphis Junior/Senior High School (#480 in Michigan) enrolls 229 students in grades 9-12 with a 92% graduation rate and a 39% AP/IB-exam participation rate; its average SAT total was 926 in 2025-26 (MI School Data). Also: Capac High School (#357 in Michigan) enrolls 202 students in grades 9-12 with a 98% graduation rate and a 27% AP/IB-exam participation rate; its average SAT total was 870 in 2025-26 (MI School Data)."
  },
  "River Rouge (MI)": {
    hs: "River Rouge High School",
    district: "River Rouge School District",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "River Rouge School District covers essentially all River Rouge's residents (2020 census blocks). River Rouge High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 987 students in grades 9-12 with a 92% graduation rate; its average SAT total was 747 in 2025-26 (MI School Data)."
  },
  "Riverview (MI)": {
    hs: "Riverview Community High School",
    district: "Riverview Community School District",
    usNewsNational: 2518, usNewsState: 91,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Riverview Community School District covers essentially all Riverview's residents (2020 census blocks). Riverview Community High School (#91 in Michigan) enrolls 854 students in grades 9-12 with a 99% graduation rate and a 26% AP/IB-exam participation rate; its average SAT total was 989 in 2025-26 (MI School Data)."
  },
  "Rochester (MI)": {
    hs: ["Rochester Adams High School", "Stoney Creek High School", "Rochester High School"],
    district: ["Rochester Community Schools", "Rochester Community Schools", "Rochester Community Schools"],
    usNewsNational: 400, usNewsState: 8,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rochester Community Schools covers essentially all Rochester's residents (2020 census blocks). Rochester Community Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Rochester Adams High School (#8 in Michigan) enrolls 1,521 students in grades 9-12 with a 99% graduation rate and an 81% AP/IB-exam participation rate; its average SAT total was 1146 in 2025-26 (MI School Data). Also: Stoney Creek High School (#22 in Michigan) enrolls 1,478 students in grades 9-12 with a 98% graduation rate and a 78% AP/IB-exam participation rate; its average SAT total was 1095 in 2025-26 (MI School Data)."
  },
  "Rochester Hills (MI)": {
    hs: ["Rochester Adams High School", "Stoney Creek High School", "Rochester High School", "Avondale High School"],
    district: ["Rochester Community Schools", "Rochester Community Schools", "Rochester Community Schools", "Avondale School District"],
    usNewsNational: 400, usNewsState: 8,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rochester Hills is split between school districts (2020 census-block shares): Rochester Community Schools about 85%, Avondale School District about 15%; students attend Rochester Adams High School, Stoney Creek High School, Rochester High School or Avondale High School depending on address. Rochester Adams High School (#8 in Michigan) enrolls 1,521 students in grades 9-12 with a 99% graduation rate and an 81% AP/IB-exam participation rate; its average SAT total was 1146 in 2025-26 (MI School Data). Also: Stoney Creek High School (#22 in Michigan) enrolls 1,478 students in grades 9-12 with a 98% graduation rate and a 78% AP/IB-exam participation rate; its average SAT total was 1095 in 2025-26 (MI School Data)."
  },
  "Rockwood (MI)": {
    hs: "Oscar A. Carlson High School",
    district: "Gibraltar School District",
    usNewsNational: 10891, usNewsState: 402,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Gibraltar School District covers essentially all Rockwood's residents (2020 census blocks). Oscar A. Carlson High School (#402 in Michigan) enrolls 1,104 students in grades 9-12 with a 99% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 958 in 2025-26 (MI School Data)."
  },
  "Romeo (MI)": {
    hs: "Romeo High School",
    district: "Romeo Community Schools",
    feedsTo: "Romeo High School",
    usNewsNational: 4291, usNewsState: 156,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Romeo Community Schools covers essentially all Romeo's residents (2020 census blocks). Romeo has no high school inside its boundary; the high school is in Washington. Romeo High School (#156 in Michigan) enrolls 1,817 students in grades 9-12 with a 95% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data)."
  },
  "Romulus (MI)": {
    hs: "Romulus Senior High School",
    district: "Romulus Community Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Romulus Community Schools covers about 89% of Romulus's residents (2020 census blocks). The rest are mostly in Wayne-Westland Community Schools (7%) and Woodhaven-Brownstown School District (3%). Romulus Senior High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 518 students in grades 9-12 with an 84% graduation rate and a 21% AP/IB-exam participation rate; its average SAT total was 809 in 2025-26 (MI School Data)."
  },
  "Rose Township (MI)": {
    hs: ["Holly High School", "Fenton Senior High School"],
    district: ["Holly Area Schools", "Fenton Area Public Schools"],
    feedsTo: "Holly High School / Fenton Senior High School",
    usNewsNational: 3000, usNewsState: 114,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rose Township is split between school districts (2020 census-block shares): Holly Area Schools about 73%, Fenton Area Public Schools about 27%; students attend Holly High School or Fenton Senior High School depending on address. Rose Township has no high school inside its boundary; the high schools are in Fenton, Holly. Holly High School (#290 in Michigan) enrolls 992 students in grades 9-12 with an 85% graduation rate and a 26% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data). Also: Fenton Senior High School (#114 in Michigan) enrolls 982 students in grades 9-12 with a 97% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 1003 in 2025-26 (MI School Data)."
  },
  "Roseville (MI)": {
    hs: "Roseville High School",
    district: "Roseville Community Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Roseville Community Schools covers about 91% of Roseville's residents (2020 census blocks). The rest are mostly in Fraser Public Schools (9%). Roseville High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 1,211 students in grades 9-12 with an 84% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 837 in 2025-26 (MI School Data)."
  },
  "Royal Oak (MI)": {
    hs: "Royal Oak High School",
    district: "Royal Oak Schools",
    usNewsNational: 2131, usNewsState: 78,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Royal Oak Schools covers about 99% of Royal Oak's residents (2020 census blocks). Royal Oak High School (#78 in Michigan) enrolls 1,293 students in grades 9-12 with a 97% graduation rate and a 49% AP/IB-exam participation rate; its average SAT total was 1032 in 2025-26 (MI School Data)."
  },
  "Royal Oak Township (MI)": {
    hs: ["Ferndale High School", "Oak Park High School"],
    district: ["Ferndale Public Schools", "Oak Park Schools"],
    usNewsNational: 10990, usNewsState: 404,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Royal Oak Township is split between school districts (2020 census-block shares): Ferndale Public Schools about 55%, Oak Park Schools about 45%; students attend Ferndale High School or Oak Park High School depending on address. US News also lists University High School (in the unranked-bottom band, 494–678 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Ferndale High School (#404 in Michigan) enrolls 732 students in grades 9-12 with a 94% graduation rate and a 21% AP/IB-exam participation rate; its average SAT total was 912 in 2025-26 (MI School Data). Also: Oak Park High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 798 students in grades 9-12 with an 87% graduation rate and a 23% AP/IB-exam participation rate; its average SAT total was 785 in 2025-26 (MI School Data)."
  },
  "Ruby (MI)": {
    hs: ["Yale Senior High School", "Port Huron Northern High School", "Port Huron High School"],
    district: ["Yale Public Schools", "Port Huron Area School District", "Port Huron Area School District"],
    feedsTo: "Yale Senior High School / Port Huron Northern High School / Port Huron High School",
    usNewsNational: 4482, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Ruby is split between school districts (2020 census-block shares): Yale Public Schools about 78%, Port Huron Area School District about 22%; students attend Yale Senior High School, Port Huron Northern High School or Port Huron High School depending on address. Ruby has no high school inside its boundary; the high schools are in Port Huron, Yale. Yale Senior High School (#166 in Michigan) enrolls 509 students in grades 9-12 with a 98% graduation rate and a 32% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data). Also: Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data)."
  },
  "Shelby Township (MI)": {
    hs: ["Henry Ford II High School", "Eisenhower High School", "Adlai Stevenson High School", "Utica High School"],
    district: ["Utica Community Schools", "Utica Community Schools", "Utica Community Schools", "Utica Community Schools"],
    usNewsNational: 1589, usNewsState: 50,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Utica Community Schools covers about 98% of Shelby Township's residents (2020 census blocks). Utica Community Schools runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Henry Ford II High School (#50 in Michigan) enrolls 1,663 students in grades 9-12 with a 99% graduation rate and a 59% AP/IB-exam participation rate; its average SAT total was 989 in 2025-26 (MI School Data). Also: Eisenhower High School (#81 in Michigan) enrolls 1,625 students in grades 9-12 with a 97% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1044 in 2025-26 (MI School Data)."
  },
  "South Lyon (MI)": {
    hs: ["South Lyon East High School", "South Lyon High School"],
    district: ["South Lyon Community Schools", "South Lyon Community Schools"],
    usNewsNational: 2591, usNewsState: 99,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "South Lyon Community Schools covers essentially all South Lyon's residents (2020 census blocks). South Lyon Community Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). South Lyon East High School (#99 in Michigan) enrolls 1,174 students in grades 9-12 with a 92% graduation rate and a 47% AP/IB-exam participation rate; its average SAT total was 1074 in 2025-26 (MI School Data). Also: South Lyon High School (#104 in Michigan) enrolls 1,224 students in grades 9-12 with an 89% graduation rate and a 48% AP/IB-exam participation rate; its average SAT total was 1025 in 2025-26 (MI School Data)."
  },
  "Southfield (MI)": {
    hs: "Southfield High School for the Arts and Technology",
    district: "Southfield Public Schools",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Southfield Public Schools covers about 91% of Southfield's residents (2020 census blocks). The rest are mostly in Birmingham Public Schools (5%) and Oak Park Schools (4%). US News also lists University High School Academy (#14 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. Southfield High School for the Arts and Technology (in the unranked-bottom band, 494–678 in Michigan) enrolls 1,049 students in grades 9-12 with an 85% graduation rate and a 7% AP/IB-exam participation rate; its average SAT total was 818 in 2025-26 (MI School Data)."
  },
  "Southgate (MI)": {
    hs: "Southgate Anderson High School",
    district: "Southgate Community Schools",
    usNewsNational: 12370, usNewsState: 459,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Southgate Community Schools covers essentially all Southgate's residents (2020 census blocks). Southgate Anderson High School (#459 in Michigan) enrolls 1,052 students in grades 9-12 with a 92% graduation rate and an 18% AP/IB-exam participation rate; its average SAT total was 898 in 2025-26 (MI School Data)."
  },
  "Springfield Township (MI)": {
    hs: ["Clarkston High School", "Holly High School"],
    district: ["Clarkston Community School District", "Holly Area Schools"],
    feedsTo: "Clarkston High School / Holly High School",
    usNewsNational: 2157, usNewsState: 79,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Springfield Township is split between school districts (2020 census-block shares): Clarkston Community School District about 60%, Holly Area Schools about 39%; students attend Clarkston High School or Holly High School depending on address. Springfield Township has no high school inside its boundary; the high schools are in Clarkston, Holly. Clarkston High School (#79 in Michigan) enrolls 1,552 students in grades 9-12 with a 97% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 1026 in 2025-26 (MI School Data). Also: Holly High School (#290 in Michigan) enrolls 992 students in grades 9-12 with an 85% graduation rate and a 26% AP/IB-exam participation rate; its average SAT total was 922 in 2025-26 (MI School Data)."
  },
  "St. Clair (MI)": {
    hs: ["Marine City High School", "St. Clair High School"],
    district: ["East China School District", "East China School District"],
    usNewsNational: 3057, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "East China School District covers essentially all St. Clair's residents (2020 census blocks). East China School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Marine City High School (#115 in Michigan) enrolls 437 students in grades 9-12 with a 98% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 918 in 2025-26 (MI School Data). Also: St. Clair High School (#209 in Michigan) enrolls 715 students in grades 9-12 with a 95% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "St. Clair Shores (MI)": {
    hs: ["Lake Shore High School", "Lakeview High School", "South Lake High School"],
    district: ["Lake Shore Public Schools", "Lakeview Public Schools", "South Lake Schools"],
    usNewsNational: 7581, usNewsState: 280,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "St. Clair Shores is split between school districts (2020 census-block shares): Lake Shore Public Schools about 38%, Lakeview Public Schools about 33%, South Lake Schools about 29%; students attend Lake Shore High School, Lakeview High School or South Lake High School depending on address. Lake Shore High School (#323 in Michigan) enrolls 914 students in grades 9-12 with a 91% graduation rate and a 28% AP/IB-exam participation rate; its average SAT total was 901 in 2025-26 (MI School Data). Also: Lakeview High School (#280 in Michigan) enrolls 1,319 students in grades 9-12 with a 95% graduation rate and a 21% AP/IB-exam participation rate; its average SAT total was 970 in 2025-26 (MI School Data)."
  },
  "St. Clair Township (MI)": {
    hs: ["Marine City High School", "St. Clair High School", "Marysville High School"],
    district: ["East China School District", "East China School District", "Marysville Public Schools"],
    usNewsNational: 3057, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "St. Clair Township is split between school districts (2020 census-block shares): East China School District about 76%, Marysville Public Schools about 24%; students attend Marine City High School, St. Clair High School or Marysville High School depending on address. Marine City High School (#115 in Michigan) enrolls 437 students in grades 9-12 with a 98% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 918 in 2025-26 (MI School Data). Also: St. Clair High School (#209 in Michigan) enrolls 715 students in grades 9-12 with a 95% graduation rate and a 42% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  "Sterling Heights (MI)": {
    hs: ["Henry Ford II High School", "Eisenhower High School", "Adlai Stevenson High School", "Utica High School", "Sterling Heights Senior High School", "Warren Mott High School", "Cousino Senior High School"],
    district: ["Utica Community Schools", "Utica Community Schools", "Utica Community Schools", "Utica Community Schools", "Warren Consolidated Schools", "Warren Consolidated Schools", "Warren Consolidated Schools"],
    usNewsNational: 1589, usNewsState: 50,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Sterling Heights is split between school districts (2020 census-block shares): Utica Community Schools about 61%, Warren Consolidated Schools about 39%; students attend Henry Ford II High School, Eisenhower High School, Adlai Stevenson High School, Utica High School, Sterling Heights Senior High School, Warren Mott High School or Cousino Senior High School depending on address. Henry Ford II High School (#50 in Michigan) enrolls 1,663 students in grades 9-12 with a 99% graduation rate and a 59% AP/IB-exam participation rate; its average SAT total was 989 in 2025-26 (MI School Data). Also: Eisenhower High School (#81 in Michigan) enrolls 1,625 students in grades 9-12 with a 97% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1044 in 2025-26 (MI School Data)."
  },
  "Sumpter Township (MI)": {
    hs: ["Belleville High School", "Lincoln Senior High School"],
    district: ["Van Buren Public Schools", "Lincoln Consolidated Schools"],
    feedsTo: "Belleville High School / Lincoln Senior High School",
    usNewsNational: 11545, usNewsState: 427,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Sumpter Township is split between school districts (2020 census-block shares): Van Buren Public Schools about 50%, Lincoln Consolidated Schools about 35%; students attend Belleville High School or Lincoln Senior High School depending on address. Smaller shares are in Huron School District (9%) and Airport Community Schools (6%). Sumpter Township has no high school inside its boundary; the high schools are in Belleville, Ypsilanti. Belleville High School (#427 in Michigan) enrolls 1,666 students in grades 9-12 with an 82% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 882 in 2025-26 (MI School Data). Also: Lincoln Senior High School (#441 in Michigan) enrolls 810 students in grades 9-12 with a 74% graduation rate and a 33% AP/IB-exam participation rate; its average SAT total was 881 in 2025-26 (MI School Data)."
  },
  "Sylvan Lake (MI)": {
    hs: "Pontiac High School",
    district: "Pontiac City Schools",
    feedsTo: "Pontiac High School",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pontiac City Schools covers about 87% of Sylvan Lake's residents (2020 census blocks). The rest are mostly in West Bloomfield School District (13%). Sylvan Lake has no high school inside its boundary; the high school is in Pontiac. Pontiac High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 992 students in grades 9-12 with a 75% graduation rate and a 16% AP/IB-exam participation rate; its average SAT total was 747 in 2025-26 (MI School Data)."
  },
  "Taylor (MI)": {
    hs: "Taylor High School (MI)",
    district: "Taylor School District",
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Taylor School District covers essentially all Taylor's residents (2020 census blocks). Taylor High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 1,362 students in grades 9-12 with a 71% graduation rate and a 15% AP/IB-exam participation rate; its average SAT total was 855 in 2025-26 (MI School Data)."
  },
  "Trenton (MI)": {
    hs: "Trenton High School",
    district: "Trenton Public Schools",
    usNewsNational: 5052, usNewsState: 185,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Trenton Public Schools covers about 97% of Trenton's residents (2020 census blocks). Trenton High School (#185 in Michigan) enrolls 846 students in grades 9-12 with a 97% graduation rate and a 41% AP/IB-exam participation rate; its average SAT total was 973 in 2025-26 (MI School Data)."
  },
  "Troy (MI)": {
    hs: ["Troy High School", "Athens High School"],
    district: ["Troy School District", "Troy School District"],
    usNewsNational: 401, usNewsState: 9,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Troy School District covers about 81% of Troy's residents (2020 census blocks). The rest are mostly in Warren Consolidated Schools (8%), Avondale School District (5%) and Birmingham Public Schools (4%). Troy School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Troy High School (#9 in Michigan) enrolls 2,032 students in grades 9-12 with a 99% graduation rate and a 75% AP/IB-exam participation rate; its average SAT total was 1185 in 2025-26 (MI School Data). Also: Athens High School (#33 in Michigan) enrolls 1,468 students in grades 9-12 with a 97% graduation rate and a 64% AP/IB-exam participation rate; its average SAT total was 1094 in 2025-26 (MI School Data)."
  },
  "Tyrone Township (MI)": {
    hs: ["Fenton Senior High School", "Hartland High School", "Linden High School"],
    district: ["Fenton Area Public Schools", "Hartland Consolidated Schools", "Linden Community Schools"],
    usNewsNational: 3000, usNewsState: 114,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Tyrone Township is split between school districts (2020 census-block shares): Fenton Area Public Schools about 47%, Hartland Consolidated Schools about 29%, Linden Community Schools about 24%; students attend Fenton Senior High School, Hartland High School or Linden High School depending on address. Fenton Senior High School (#114 in Michigan) enrolls 982 students in grades 9-12 with a 97% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 1003 in 2025-26 (MI School Data). Also: Hartland High School (#117 in Michigan) enrolls 1,610 students in grades 9-12 with a 98% graduation rate and a 45% AP/IB-exam participation rate; its average SAT total was 1032 in 2025-26 (MI School Data)."
  },
  "Unadilla Township (MI)": {
    hs: "Stockbridge High School",
    district: "Stockbridge Community Schools",
    feedsTo: "Stockbridge High School",
    usNewsNational: 8792, usNewsState: 322,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Stockbridge Community Schools covers about 84% of Unadilla Township's residents (2020 census blocks). The rest are mostly in Pinckney Community Schools (8%) and Fowlerville Community Schools (7%). Unadilla Township has no high school inside its boundary; the high school is in Stockbridge. Stockbridge High School (#322 in Michigan) enrolls 327 students in grades 9-12 with a 95% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 954 in 2025-26 (MI School Data)."
  },
  "Utica (MI)": {
    hs: ["Henry Ford II High School", "Eisenhower High School", "Adlai Stevenson High School", "Utica High School"],
    district: ["Utica Community Schools", "Utica Community Schools", "Utica Community Schools", "Utica Community Schools"],
    usNewsNational: 1589, usNewsState: 50,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Utica Community Schools covers essentially all Utica's residents (2020 census blocks). Utica Community Schools runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Henry Ford II High School (#50 in Michigan) enrolls 1,663 students in grades 9-12 with a 99% graduation rate and a 59% AP/IB-exam participation rate; its average SAT total was 989 in 2025-26 (MI School Data). Also: Eisenhower High School (#81 in Michigan) enrolls 1,625 students in grades 9-12 with a 97% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1044 in 2025-26 (MI School Data)."
  },
  "Van Buren Township (MI)": {
    hs: "Belleville High School",
    district: "Van Buren Public Schools",
    usNewsNational: 11545, usNewsState: 427,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Van Buren Public Schools covers about 95% of Van Buren Township's residents (2020 census blocks). The rest are mostly in Lincoln Consolidated Schools (5%). Belleville High School (#427 in Michigan) enrolls 1,666 students in grades 9-12 with an 82% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 882 in 2025-26 (MI School Data)."
  },
  "Wales Township (MI)": {
    hs: ["Memphis Junior/Senior High School", "Port Huron Northern High School", "Port Huron High School"],
    district: ["Memphis Community Schools", "Port Huron Area School District", "Port Huron Area School District"],
    feedsTo: "Memphis Junior/Senior High School / Port Huron Northern High School / Port Huron High School",
    usNewsNational: 7197, usNewsState: 264,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Wales Township is split between school districts (2020 census-block shares): Memphis Community Schools about 67%, Port Huron Area School District about 18%; students attend Memphis Junior/Senior High School, Port Huron Northern High School or Port Huron High School depending on address. Smaller shares are in Yale Public Schools (13%). Wales Township has no high school inside its boundary; the high schools are in Memphis, Port Huron. Memphis Junior/Senior High School (#480 in Michigan) enrolls 229 students in grades 9-12 with a 92% graduation rate and a 39% AP/IB-exam participation rate; its average SAT total was 926 in 2025-26 (MI School Data). Also: Port Huron Northern High School (#264 in Michigan) enrolls 1,089 students in grades 9-12 with a 90% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 964 in 2025-26 (MI School Data)."
  },
  "Walled Lake (MI)": {
    hs: ["Walled Lake Northern High School", "Walled Lake Western High School", "Walled Lake Central High School"],
    district: ["Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools"],
    feedsTo: "Walled Lake Northern High School / Walled Lake Western High School / Walled Lake Central High School",
    usNewsNational: 1981, usNewsState: 72,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Walled Lake Consolidated Schools covers essentially all Walled Lake's residents (2020 census blocks). Walled Lake Consolidated Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Walled Lake has no high school inside its boundary; the high schools are in Commerce Township. Walled Lake Northern High School (#72 in Michigan) enrolls 1,383 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data). Also: Walled Lake Western High School (#95 in Michigan) enrolls 1,000 students in grades 9-12 with a 92% graduation rate and a 49% AP/IB-exam participation rate; its average SAT total was 971 in 2025-26 (MI School Data)."
  },
  "Warren (MI)": {
    hs: ["Sterling Heights Senior High School", "Warren Mott High School", "Cousino Senior High School", "Warren Woods Tower High School"],
    district: ["Warren Consolidated Schools", "Warren Consolidated Schools", "Warren Consolidated Schools", "Warren Woods Public Schools"],
    usNewsNational: 5174, usNewsState: 187,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Warren is split between school districts (2020 census-block shares): Warren Consolidated Schools about 42%, Warren Woods Public Schools about 16%; students attend Sterling Heights Senior High School, Warren Mott High School, Cousino Senior High School or Warren Woods Tower High School depending on address. Smaller shares are in Van Dyke Public Schools (14%), Fitzgerald Public Schools (13%), Center Line Public Schools (9%) and Eastpointe Community Schools (6%). Sterling Heights Senior High School (#187 in Michigan) enrolls 1,262 students in grades 9-12 with an 89% graduation rate and a 36% AP/IB-exam participation rate; its average SAT total was 914 in 2025-26 (MI School Data). Also: Warren Mott High School (#340 in Michigan) enrolls 1,335 students in grades 9-12 with an 86% graduation rate and a 19% AP/IB-exam participation rate; its average SAT total was 913 in 2025-26 (MI School Data)."
  },
  "Washington Township (MI)": {
    hs: "Romeo High School",
    district: "Romeo Community Schools",
    usNewsNational: 4291, usNewsState: 156,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Romeo Community Schools covers about 83% of Washington Township's residents (2020 census blocks). The rest are mostly in Utica Community Schools (12%) and Rochester Community Schools (5%). Romeo High School (#156 in Michigan) enrolls 1,817 students in grades 9-12 with a 95% graduation rate and a 34% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data)."
  },
  "Waterford Township (MI)": {
    hs: ["Waterford Kettering High School", "Waterford Mott High School"],
    district: ["Waterford School District", "Waterford School District"],
    usNewsNational: 6766, usNewsState: 248,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Waterford School District covers about 97% of Waterford Township's residents (2020 census blocks). Waterford School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Waterford Kettering High School (#248 in Michigan) enrolls 909 students in grades 9-12 with a 95% graduation rate and a 35% AP/IB-exam participation rate; its average SAT total was 945 in 2025-26 (MI School Data). Also: Waterford Mott High School (#464 in Michigan) enrolls 963 students in grades 9-12 with an 86% graduation rate and a 19% AP/IB-exam participation rate; its average SAT total was 866 in 2025-26 (MI School Data)."
  },
  "Wayne (MI)": {
    hs: ["John Glenn High School", "Wayne Memorial High School"],
    district: ["Wayne-Westland Community Schools", "Wayne-Westland Community Schools"],
    usNewsNational: 15702, usNewsState: 586,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Wayne-Westland Community Schools covers essentially all Wayne's residents (2020 census blocks). Wayne-Westland Community Schools runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). John Glenn High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 1,363 students in grades 9-12 with a 92% graduation rate and a 16% AP/IB-exam participation rate; its average SAT total was 849 in 2025-26 (MI School Data). Also: Wayne Memorial High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 1,250 students in grades 9-12 with an 82% graduation rate and a 13% AP/IB-exam participation rate; its average SAT total was 850 in 2025-26 (MI School Data)."
  },
  "West Bloomfield Township (MI)": {
    hs: ["West Bloomfield High School", "Walled Lake Northern High School", "Walled Lake Western High School", "Walled Lake Central High School"],
    district: ["West Bloomfield School District", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools"],
    usNewsNational: 1981, usNewsState: 72,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "West Bloomfield Township is split between school districts (2020 census-block shares): West Bloomfield School District about 42%, Walled Lake Consolidated Schools about 34%; students attend West Bloomfield High School, Walled Lake Northern High School, Walled Lake Western High School or Walled Lake Central High School depending on address. Smaller shares are in Bloomfield Hills Schools (11%), Birmingham Public Schools (5%), Waterford School District (3%) and Farmington Public Schools (3%). US News also lists Oakland Early College (#127 in Michigan) under the district; it is a magnet/early-college choice school, not an attendance-zone high school. West Bloomfield High School (#178 in Michigan) enrolls 1,434 students in grades 9-12 with a 98% graduation rate and a 37% AP/IB-exam participation rate; its average SAT total was 958 in 2025-26 (MI School Data). Also: Walled Lake Northern High School (#72 in Michigan) enrolls 1,383 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data)."
  },
  "Westland (MI)": {
    hs: ["John Glenn High School", "Wayne Memorial High School", "Stevenson High School", "Churchill High School", "Franklin High School"],
    district: ["Wayne-Westland Community Schools", "Wayne-Westland Community Schools", "Livonia Public Schools", "Livonia Public Schools", "Livonia Public Schools"],
    usNewsNational: 2685, usNewsState: 103,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Westland is split between school districts (2020 census-block shares): Wayne-Westland Community Schools about 66%, Livonia Public Schools about 31%; students attend John Glenn High School, Wayne Memorial High School, Stevenson High School, Churchill High School or Franklin High School depending on address. John Glenn High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 1,363 students in grades 9-12 with a 92% graduation rate and a 16% AP/IB-exam participation rate; its average SAT total was 849 in 2025-26 (MI School Data). Also: Wayne Memorial High School (in the unranked-bottom band, 494–678 in Michigan) enrolls 1,250 students in grades 9-12 with an 82% graduation rate and a 13% AP/IB-exam participation rate; its average SAT total was 850 in 2025-26 (MI School Data)."
  },
  "White Lake Township (MI)": {
    hs: ["Milford High School", "Lakeland High School", "Walled Lake Northern High School", "Walled Lake Western High School", "Walled Lake Central High School"],
    district: ["Huron Valley Schools", "Huron Valley Schools", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools"],
    usNewsNational: 1981, usNewsState: 72,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "White Lake Township is split between school districts (2020 census-block shares): Huron Valley Schools about 46%, Walled Lake Consolidated Schools about 27%; students attend Milford High School, Lakeland High School, Walled Lake Northern High School, Walled Lake Western High School or Walled Lake Central High School depending on address. Smaller shares are in Waterford School District (14%) and Holly Area Schools (13%). Milford High School (#100 in Michigan) enrolls 1,173 students in grades 9-12 with a 91% graduation rate and a 39% AP/IB-exam participation rate; its average SAT total was 998 in 2025-26 (MI School Data). Also: Lakeland High School (#87 in Michigan) enrolls 1,012 students in grades 9-12 with a 99% graduation rate and a 47% AP/IB-exam participation rate; its average SAT total was 982 in 2025-26 (MI School Data)."
  },
  "Wixom (MI)": {
    hs: ["Walled Lake Northern High School", "Walled Lake Western High School", "Walled Lake Central High School"],
    district: ["Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools"],
    usNewsNational: 1981, usNewsState: 72,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Walled Lake Consolidated Schools covers about 94% of Wixom's residents (2020 census blocks). The rest are mostly in South Lyon Community Schools (6%). Walled Lake Consolidated Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Walled Lake Northern High School (#72 in Michigan) enrolls 1,383 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data). Also: Walled Lake Western High School (#95 in Michigan) enrolls 1,000 students in grades 9-12 with a 92% graduation rate and a 49% AP/IB-exam participation rate; its average SAT total was 971 in 2025-26 (MI School Data)."
  },
  "Wolverine Lake (MI)": {
    hs: ["Walled Lake Northern High School", "Walled Lake Western High School", "Walled Lake Central High School"],
    district: ["Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools", "Walled Lake Consolidated Schools"],
    usNewsNational: 1981, usNewsState: 72,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Walled Lake Consolidated Schools covers essentially all Wolverine Lake's residents (2020 census blocks). Walled Lake Consolidated Schools runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Walled Lake Northern High School (#72 in Michigan) enrolls 1,383 students in grades 9-12 with a 95% graduation rate and a 56% AP/IB-exam participation rate; its average SAT total was 1000 in 2025-26 (MI School Data). Also: Walled Lake Western High School (#95 in Michigan) enrolls 1,000 students in grades 9-12 with a 92% graduation rate and a 49% AP/IB-exam participation rate; its average SAT total was 971 in 2025-26 (MI School Data)."
  },
  "Woodhaven (MI)": {
    hs: ["Woodhaven High School", "Oscar A. Carlson High School"],
    district: ["Woodhaven-Brownstown School District", "Gibraltar School District"],
    feedsTo: "Woodhaven High School / Oscar A. Carlson High School",
    usNewsNational: 3520, usNewsState: 130,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Woodhaven is split between school districts (2020 census-block shares): Woodhaven-Brownstown School District about 73%, Gibraltar School District about 27%; students attend Woodhaven High School or Oscar A. Carlson High School depending on address. Woodhaven has no high school inside its boundary; the high schools are in Flat Rock, Rockwood. Woodhaven High School (#130 in Michigan) enrolls 1,629 students in grades 9-12 with a 92% graduation rate and a 36% AP/IB-exam participation rate; its average SAT total was 975 in 2025-26 (MI School Data). Also: Oscar A. Carlson High School (#402 in Michigan) enrolls 1,104 students in grades 9-12 with a 99% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 958 in 2025-26 (MI School Data)."
  },
  "Wyandotte (MI)": {
    hs: "Roosevelt High School",
    district: "Wyandotte Public Schools",
    usNewsNational: 10247, usNewsState: 373,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Wyandotte Public Schools covers essentially all Wyandotte's residents (2020 census blocks). Roosevelt High School (#373 in Michigan) enrolls 1,216 students in grades 9-12 with a 92% graduation rate and a 19% AP/IB-exam participation rate; its average SAT total was 927 in 2025-26 (MI School Data)."
  },
  "Yale (MI)": {
    hs: "Yale Senior High School",
    district: "Yale Public Schools",
    usNewsNational: 4482, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Yale Public Schools covers essentially all Yale's residents (2020 census blocks). Yale Senior High School (#166 in Michigan) enrolls 509 students in grades 9-12 with a 98% graduation rate and a 32% AP/IB-exam participation rate; its average SAT total was 966 in 2025-26 (MI School Data)."
  },
  // === DETROIT METRO SCHOOL_DATA END ===

  // === ST. LOUIS METRO SCHOOL_DATA START ===
  "Albers": {
    hs: "Central Comm High School",
    district: "Central Community High School District 71",
    feedsTo: "Central Comm High School",
    usNewsNational: 10129, usNewsState: 350,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Central Community High School District 71 covers essentially all Albers's residents (2020 census blocks). Albers has no high school inside its boundary; the high school is in Breese. Central Comm High School (#350 in Illinois) enrolls 629 students in grades 9-12 with a 91% graduation rate; its average SAT total was 1030 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Alhambra": {
    hs: "Highland High School (IL)",
    district: "Highland Community Unit School District 5",
    feedsTo: "Highland High School",
    usNewsNational: 3804, usNewsState: 147,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Highland Community Unit School District 5 covers essentially all Alhambra's residents (2020 census blocks). Alhambra has no high school inside its boundary; the high school is in Highland. Highland High School (#147 in Illinois) enrolls 844 students in grades 9-12 with a 96% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 993 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Alton": {
    hs: "Alton High School",
    district: "Alton Community Unit School District 11",
    usNewsNational: 10295, usNewsState: 362,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Alton Community Unit School District 11 covers about 98% of Alton's residents (2020 census blocks). Alton High School (#362 in Illinois) enrolls 1,823 students in grades 9-12 with a 73% graduation rate and a 12% AP/IB-exam participation rate; its average SAT total was 904 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Aviston": {
    hs: "Central Comm High School",
    district: "Central Community High School District 71",
    feedsTo: "Central Comm High School",
    usNewsNational: 10129, usNewsState: 350,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Central Community High School District 71 covers essentially all Aviston's residents (2020 census blocks). Aviston has no high school inside its boundary; the high school is in Breese. Central Comm High School (#350 in Illinois) enrolls 629 students in grades 9-12 with a 91% graduation rate; its average SAT total was 1030 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Bartelso": {
    hs: "Central Comm High School",
    district: "Central Community High School District 71",
    feedsTo: "Central Comm High School",
    usNewsNational: 10129, usNewsState: 350,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Central Community High School District 71 covers essentially all Bartelso's residents (2020 census blocks). Bartelso has no high school inside its boundary; the high school is in Breese. Central Comm High School (#350 in Illinois) enrolls 629 students in grades 9-12 with a 91% graduation rate; its average SAT total was 1030 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Beckemeyer": {
    hs: "Central Comm High School",
    district: "Central Community High School District 71",
    feedsTo: "Central Comm High School",
    usNewsNational: 10129, usNewsState: 350,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Central Community High School District 71 covers essentially all Beckemeyer's residents (2020 census blocks). Beckemeyer has no high school inside its boundary; the high school is in Breese. Central Comm High School (#350 in Illinois) enrolls 629 students in grades 9-12 with a 91% graduation rate; its average SAT total was 1030 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Belleville": {
    hs: ["Belleville High School-East", "Belleville High School-West"],
    district: ["Belleville Township High School District 201", "Belleville Township High School District 201"],
    usNewsNational: 6263, usNewsState: 238,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Belleville Township High School District 201 covers about 93% of Belleville's residents (2020 census blocks). The rest are mostly in Mascoutah Community Unit School District 19 (5%). Belleville Township High School District 201 runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Belleville High School-East (#238 in Illinois) enrolls 2,600 students in grades 9-12 with a 92% graduation rate and a 15% AP/IB-exam participation rate; its average SAT total was 923 in 2024 (ISBE, Illinois's last state SAT). Also: Belleville High School-West (#284 in Illinois) enrolls 2,118 students in grades 9-12 with a 92% graduation rate and a 23% AP/IB-exam participation rate; its average SAT total was 875 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Benld": {
    hs: "Gillespie High School",
    district: "Gillespie Community Unit School District 7",
    feedsTo: "Gillespie High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Gillespie Community Unit School District 7 covers essentially all Benld's residents (2020 census blocks). Benld has no high school inside its boundary; the high school is in Gillespie. Gillespie High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 328 students in grades 9-12 with an 82% graduation rate; its average SAT total was 913 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Bethalto": {
    hs: "Civic Memorial High School",
    district: "Bethalto Community Unit School District 8",
    usNewsNational: 8120, usNewsState: 289,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Bethalto Community Unit School District 8 covers about 98% of Bethalto's residents (2020 census blocks). Civic Memorial High School (#289 in Illinois) enrolls 760 students in grades 9-12 with a 96% graduation rate; its average SAT total was 968 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Breese": {
    hs: "Central Comm High School",
    district: "Central Community High School District 71",
    usNewsNational: 10129, usNewsState: 350,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Central Community High School District 71 covers essentially all Breese's residents (2020 census blocks). Central Comm High School (#350 in Illinois) enrolls 629 students in grades 9-12 with a 91% graduation rate; its average SAT total was 1030 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Brighton": {
    hs: "Southwestern High School",
    district: "Southwestern Community Unit School District 9",
    feedsTo: "Southwestern High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Southwestern Community Unit School District 9 covers essentially all Brighton's residents (2020 census blocks). Brighton has no high school inside its boundary; the high school is in Piasa. Southwestern High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 370 students in grades 9-12 with an 83% graduation rate; its average SAT total was 927 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Brooklyn": {
    hs: "Lovejoy Technology Academy",
    district: "Brooklyn Community Unit School District 188",
    usNewsNational: null, usNewsState: null,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Brooklyn Community Unit School District 188 covers essentially all Brooklyn's residents (2020 census blocks). Lovejoy Technology Academy (unranked by U.S. News) enrolls 27 students in grades 9-12."
  },
  "Bunker Hill": {
    hs: "Bunker Hill High School",
    district: "Bunker Hill Community Unit School District 8",
    usNewsNational: 9998, usNewsState: 343,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Bunker Hill Community Unit School District 8 covers essentially all Bunker Hill's residents (2020 census blocks). Bunker Hill High School (#343 in Illinois) enrolls 166 students in grades 9-12 with an 89% graduation rate; its average SAT total was 948 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Cahokia Heights": {
    hs: ["Cahokia High School", "East St Louis Senior High School"],
    district: ["Cahokia Community Unit School District 187", "East St. Louis School District 189"],
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Cahokia Heights is split between school districts (2020 census-block shares): Cahokia Community Unit School District 187 about 80%, East St. Louis School District 189 about 20%; students attend Cahokia High School or East St Louis Senior High School depending on address. Cahokia High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 850 students in grades 9-12 with a 55% graduation rate and a 23% AP/IB-exam participation rate; its average SAT total was 777 in 2024 (ISBE, Illinois's last state SAT). Also: East St Louis Senior High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 1,287 students in grades 9-12 with a 74% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 751 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Carlinville": {
    hs: "Carlinville High School",
    district: "Carlinville Community Unit School District 1",
    usNewsNational: 8867, usNewsState: 308,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Carlinville Community Unit School District 1 covers essentially all Carlinville's residents (2020 census blocks). Carlinville High School (#308 in Illinois) enrolls 353 students in grades 9-12 with an 81% graduation rate and an 18% AP/IB-exam participation rate; its average SAT total was 940 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Carlyle": {
    hs: "Carlyle High School",
    district: "Carlyle Community Unit School District 1",
    usNewsNational: 7287, usNewsState: 265,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Carlyle Community Unit School District 1 covers essentially all Carlyle's residents (2020 census blocks). Carlyle High School (#265 in Illinois) enrolls 281 students in grades 9-12 with an 88% graduation rate and a 22% AP/IB-exam participation rate; its average SAT total was 942 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Caseyville": {
    hs: ["Collinsville High School", "East St Louis Senior High School"],
    district: ["Collinsville Community Unit School District 10", "East St. Louis School District 189"],
    usNewsNational: 7873, usNewsState: 281,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Caseyville is split between school districts (2020 census-block shares): Collinsville Community Unit School District 10 about 77%, East St. Louis School District 189 about 18%; students attend Collinsville High School or East St Louis Senior High School depending on address. Smaller shares are in Belleville Township High School District 201 (5%). Collinsville High School (#281 in Illinois) enrolls 1,956 students in grades 9-12 with an 86% graduation rate and an 11% AP/IB-exam participation rate; its average SAT total was 885 in 2024 (ISBE, Illinois's last state SAT). Also: East St Louis Senior High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 1,287 students in grades 9-12 with a 74% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 751 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Collinsville": {
    hs: "Collinsville High School",
    district: "Collinsville Community Unit School District 10",
    usNewsNational: 7873, usNewsState: 281,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Collinsville Community Unit School District 10 covers essentially all Collinsville's residents (2020 census blocks). Collinsville High School (#281 in Illinois) enrolls 1,956 students in grades 9-12 with an 86% graduation rate and an 11% AP/IB-exam participation rate; its average SAT total was 885 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Columbia": {
    hs: "Columbia High School",
    district: "Columbia Community Unit School District 4",
    usNewsNational: 3436, usNewsState: 137,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Columbia Community Unit School District 4 covers essentially all Columbia's residents (2020 census blocks). Columbia High School (#137 in Illinois) enrolls 606 students in grades 9-12 with a 96% graduation rate and a 33% AP/IB-exam participation rate; its average SAT total was 1032 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Damiansville": {
    hs: "Central Comm High School",
    district: "Central Community High School District 71",
    feedsTo: "Central Comm High School",
    usNewsNational: 10129, usNewsState: 350,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Central Community High School District 71 covers essentially all Damiansville's residents (2020 census blocks). Damiansville has no high school inside its boundary; the high school is in Breese. Central Comm High School (#350 in Illinois) enrolls 629 students in grades 9-12 with a 91% graduation rate; its average SAT total was 1030 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Dupo": {
    hs: "Dupo High School",
    district: "Dupo Community Unit School District 196",
    usNewsNational: 13136, usNewsState: 451,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Dupo Community Unit School District 196 covers essentially all Dupo's residents (2020 census blocks). Dupo High School (#451 in Illinois) enrolls 259 students in grades 9-12 with an 86% graduation rate; its average SAT total was 884 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "East Alton": {
    hs: "East Alton-Wood River High School",
    district: "East Alton-Wood River Community High School District 14",
    usNewsNational: 10335, usNewsState: 363,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "East Alton-Wood River Community High School District 14 covers about 91% of East Alton's residents (2020 census blocks). The rest are mostly in Roxana Community Unit School District 1 (6%) and Bethalto Community Unit School District 8 (3%). East Alton-Wood River High School (#363 in Illinois) enrolls 539 students in grades 9-12 with a 91% graduation rate; its average SAT total was 877 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "East St. Louis": {
    hs: "East St Louis Senior High School",
    district: "East St. Louis School District 189",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "East St. Louis School District 189 covers essentially all East St. Louis's residents (2020 census blocks). East St Louis Senior High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 1,287 students in grades 9-12 with a 74% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 751 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Edwardsville": {
    hs: "Edwardsville High School",
    district: "Edwardsville Community Unit School District 7",
    usNewsNational: 2817, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Edwardsville Community Unit School District 7 covers essentially all Edwardsville's residents (2020 census blocks). Edwardsville High School (#115 in Illinois) enrolls 2,342 students in grades 9-12 with a 91% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 1026 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Elsah": {
    hs: "Jersey Comm High School",
    district: "Jersey Community Unit School District 100",
    feedsTo: "Jersey Comm High School",
    usNewsNational: 7648, usNewsState: 276,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Jersey Community Unit School District 100 covers essentially all Elsah's residents (2020 census blocks). Elsah has no high school inside its boundary; the high school is in Jerseyville. Jersey Comm High School (#276 in Illinois) enrolls 807 students in grades 9-12 with a 91% graduation rate and a 6% AP/IB-exam participation rate; its average SAT total was 947 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Fairmont City": {
    hs: "Collinsville High School",
    district: "Collinsville Community Unit School District 10",
    feedsTo: "Collinsville High School",
    usNewsNational: 7873, usNewsState: 281,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Collinsville Community Unit School District 10 covers essentially all Fairmont City's residents (2020 census blocks). Fairmont City has no high school inside its boundary; the high school is in Collinsville. Collinsville High School (#281 in Illinois) enrolls 1,956 students in grades 9-12 with an 86% graduation rate and an 11% AP/IB-exam participation rate; its average SAT total was 885 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Fairview Heights": {
    hs: ["Belleville High School-East", "Belleville High School-West"],
    district: ["Belleville Township High School District 201", "Belleville Township High School District 201"],
    feedsTo: "Belleville High School-East / Belleville High School-West",
    usNewsNational: 6263, usNewsState: 238,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Belleville Township High School District 201 covers about 85% of Fairview Heights's residents (2020 census blocks). The rest are mostly in O'Fallon Township High School District 203 (11%) and East St. Louis School District 189 (4%). Belleville Township High School District 201 runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Fairview Heights has no high school inside its boundary; the high schools are in Belleville. Belleville High School-East (#238 in Illinois) enrolls 2,600 students in grades 9-12 with a 92% graduation rate and a 15% AP/IB-exam participation rate; its average SAT total was 923 in 2024 (ISBE, Illinois's last state SAT). Also: Belleville High School-West (#284 in Illinois) enrolls 2,118 students in grades 9-12 with a 92% graduation rate and a 23% AP/IB-exam participation rate; its average SAT total was 875 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Freeburg": {
    hs: "Freeburg Community High School",
    district: "Freeburg Community High School District 77",
    usNewsNational: 4365, usNewsState: 171,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Freeburg Community High School District 77 covers essentially all Freeburg's residents (2020 census blocks). Freeburg Community High School (#171 in Illinois) enrolls 689 students in grades 9-12 with a 92% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 1022 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Germantown": {
    hs: "Central Comm High School",
    district: "Central Community High School District 71",
    feedsTo: "Central Comm High School",
    usNewsNational: 10129, usNewsState: 350,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Central Community High School District 71 covers essentially all Germantown's residents (2020 census blocks). Germantown has no high school inside its boundary; the high school is in Breese. Central Comm High School (#350 in Illinois) enrolls 629 students in grades 9-12 with a 91% graduation rate; its average SAT total was 1030 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Gillespie": {
    hs: "Gillespie High School",
    district: "Gillespie Community Unit School District 7",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Gillespie Community Unit School District 7 covers essentially all Gillespie's residents (2020 census blocks). Gillespie High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 328 students in grades 9-12 with an 82% graduation rate; its average SAT total was 913 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Girard": {
    hs: "North Mac High School",
    district: "North Mac Community Unit School District 34",
    feedsTo: "North Mac High School",
    usNewsNational: 9851, usNewsState: 340,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "North Mac Community Unit School District 34 covers essentially all Girard's residents (2020 census blocks). Girard has no high school inside its boundary; the high school is in Virden. North Mac High School (#340 in Illinois) enrolls 361 students in grades 9-12 with an 87% graduation rate and a 32% AP/IB-exam participation rate; its average SAT total was 929 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Glen Carbon": {
    hs: "Edwardsville High School",
    district: "Edwardsville Community Unit School District 7",
    feedsTo: "Edwardsville High School",
    usNewsNational: 2817, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Edwardsville Community Unit School District 7 covers about 99% of Glen Carbon's residents (2020 census blocks). Glen Carbon has no high school inside its boundary; the high school is in Edwardsville. Edwardsville High School (#115 in Illinois) enrolls 2,342 students in grades 9-12 with a 91% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 1026 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Godfrey": {
    hs: "Alton High School",
    district: "Alton Community Unit School District 11",
    usNewsNational: 10295, usNewsState: 362,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Alton Community Unit School District 11 covers essentially all Godfrey's residents (2020 census blocks). Alton High School (#362 in Illinois) enrolls 1,823 students in grades 9-12 with a 73% graduation rate and a 12% AP/IB-exam participation rate; its average SAT total was 904 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Grafton": {
    hs: "Jersey Comm High School",
    district: "Jersey Community Unit School District 100",
    feedsTo: "Jersey Comm High School",
    usNewsNational: 7648, usNewsState: 276,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Jersey Community Unit School District 100 covers essentially all Grafton's residents (2020 census blocks). Grafton has no high school inside its boundary; the high school is in Jerseyville. Jersey Comm High School (#276 in Illinois) enrolls 807 students in grades 9-12 with a 91% graduation rate and a 6% AP/IB-exam participation rate; its average SAT total was 947 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Granite City": {
    hs: "Granite City High School",
    district: "Granite City Community Unit School District 9",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Granite City Community Unit School District 9 covers essentially all Granite City's residents (2020 census blocks). Granite City High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 1,755 students in grades 9-12 with a 74% graduation rate; its average SAT total was 838 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Greenville": {
    hs: "Bond Cty Comm Unit 2 High School",
    district: "Bond County Community Unit School District 2",
    usNewsNational: 5319, usNewsState: 209,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Bond County Community Unit School District 2 covers essentially all Greenville's residents (2020 census blocks). Bond Cty Comm Unit 2 High School (#209 in Illinois) enrolls 484 students in grades 9-12 with an 88% graduation rate and a 14% AP/IB-exam participation rate; its average SAT total was 990 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Hamel": {
    hs: "Edwardsville High School",
    district: "Edwardsville Community Unit School District 7",
    feedsTo: "Edwardsville High School",
    usNewsNational: 2817, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Edwardsville Community Unit School District 7 covers essentially all Hamel's residents (2020 census blocks). Hamel has no high school inside its boundary; the high school is in Edwardsville. Edwardsville High School (#115 in Illinois) enrolls 2,342 students in grades 9-12 with a 91% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 1026 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Hardin": {
    hs: "Calhoun High School",
    district: "Calhoun Community Unit School District 40",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Calhoun Community Unit School District 40 covers essentially all Hardin's residents (2020 census blocks). Calhoun High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 171 students in grades 9-12 with a 74% graduation rate; its average SAT total was 917 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Hartford": {
    hs: "East Alton-Wood River High School",
    district: "East Alton-Wood River Community High School District 14",
    feedsTo: "East Alton-Wood River High School",
    usNewsNational: 10335, usNewsState: 363,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "East Alton-Wood River Community High School District 14 covers essentially all Hartford's residents (2020 census blocks). Hartford has no high school inside its boundary; the high school is in Wood River. East Alton-Wood River High School (#363 in Illinois) enrolls 539 students in grades 9-12 with a 91% graduation rate; its average SAT total was 877 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Highland (IL)": {
    hs: "Highland High School (IL)",
    district: "Highland Community Unit School District 5",
    usNewsNational: 3804, usNewsState: 147,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Highland Community Unit School District 5 covers essentially all Highland's residents (2020 census blocks). Highland High School (#147 in Illinois) enrolls 844 students in grades 9-12 with a 96% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 993 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Holiday Shores": {
    hs: "Edwardsville High School",
    district: "Edwardsville Community Unit School District 7",
    feedsTo: "Edwardsville High School",
    usNewsNational: 2817, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Edwardsville Community Unit School District 7 covers essentially all Holiday Shores's residents (2020 census blocks). Holiday Shores has no high school inside its boundary; the high school is in Edwardsville. Edwardsville High School (#115 in Illinois) enrolls 2,342 students in grades 9-12 with a 91% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 1026 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Jerseyville": {
    hs: "Jersey Comm High School",
    district: "Jersey Community Unit School District 100",
    usNewsNational: 7648, usNewsState: 276,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Jersey Community Unit School District 100 covers essentially all Jerseyville's residents (2020 census blocks). Jersey Comm High School (#276 in Illinois) enrolls 807 students in grades 9-12 with a 91% graduation rate and a 6% AP/IB-exam participation rate; its average SAT total was 947 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Lebanon": {
    hs: "Lebanon High School",
    district: "Lebanon Community Unit School District 9",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lebanon Community Unit School District 9 covers essentially all Lebanon's residents (2020 census blocks). Lebanon High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 126 students in grades 9-12 with a 66% graduation rate; its average SAT total was 910 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Livingston": {
    hs: "Staunton High School",
    district: "Staunton Community Unit School District 6",
    feedsTo: "Staunton High School",
    usNewsNational: 12438, usNewsState: 426,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Staunton Community Unit School District 6 covers essentially all Livingston's residents (2020 census blocks). Livingston has no high school inside its boundary; the high school is in Staunton. Staunton High School (#426 in Illinois) enrolls 384 students in grades 9-12 with an 89% graduation rate; its average SAT total was 922 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Madison": {
    hs: "Madison Senior High School",
    district: "Madison Community Unit School District 12",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Madison Community Unit School District 12 covers about 86% of Madison's residents (2020 census blocks). The rest are mostly in Granite City Community Unit School District 9 (12%). Madison Senior High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 152 students in grades 9-12 with a 63% graduation rate; its average SAT total was 765 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Marine": {
    hs: "Triad High School",
    district: "Triad Community Unit School District 2",
    feedsTo: "Triad High School",
    usNewsNational: 3187, usNewsState: 129,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Triad Community Unit School District 2 covers essentially all Marine's residents (2020 census blocks). Marine has no high school inside its boundary; the high school is in Troy. Triad High School (#129 in Illinois) enrolls 1,218 students in grades 9-12 with a 94% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 1019 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Marissa": {
    hs: "Marissa Junior and Senior High School",
    district: "Marissa Community Unit School District 40",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Marissa Community Unit School District 40 covers essentially all Marissa's residents (2020 census blocks). Marissa Junior and Senior High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 167 students in grades 9-12 with a 96% graduation rate; its average SAT total was 910 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Maryville": {
    hs: "Collinsville High School",
    district: "Collinsville Community Unit School District 10",
    feedsTo: "Collinsville High School",
    usNewsNational: 7873, usNewsState: 281,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Collinsville Community Unit School District 10 covers about 99% of Maryville's residents (2020 census blocks). Maryville has no high school inside its boundary; the high school is in Collinsville. Collinsville High School (#281 in Illinois) enrolls 1,956 students in grades 9-12 with an 86% graduation rate and an 11% AP/IB-exam participation rate; its average SAT total was 885 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Mascoutah": {
    hs: "Mascoutah High School",
    district: "Mascoutah Community Unit School District 19",
    usNewsNational: 3376, usNewsState: 134,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Mascoutah Community Unit School District 19 covers essentially all Mascoutah's residents (2020 census blocks). Mascoutah High School (#134 in Illinois) enrolls 1,243 students in grades 9-12 with a 96% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 1030 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Millstadt": {
    hs: ["Belleville High School-East", "Belleville High School-West"],
    district: ["Belleville Township High School District 201", "Belleville Township High School District 201"],
    feedsTo: "Belleville High School-East / Belleville High School-West",
    usNewsNational: 6263, usNewsState: 238,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Belleville Township High School District 201 covers essentially all Millstadt's residents (2020 census blocks). Belleville Township High School District 201 runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Millstadt has no high school inside its boundary; the high schools are in Belleville. Belleville High School-East (#238 in Illinois) enrolls 2,600 students in grades 9-12 with a 92% graduation rate and a 15% AP/IB-exam participation rate; its average SAT total was 923 in 2024 (ISBE, Illinois's last state SAT). Also: Belleville High School-West (#284 in Illinois) enrolls 2,118 students in grades 9-12 with a 92% graduation rate and a 23% AP/IB-exam participation rate; its average SAT total was 875 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Mitchell": {
    hs: "Granite City High School",
    district: "Granite City Community Unit School District 9",
    feedsTo: "Granite City High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Granite City Community Unit School District 9 covers essentially all Mitchell's residents (2020 census blocks). Mitchell has no high school inside its boundary; the high school is in Granite City. Granite City High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 1,755 students in grades 9-12 with a 74% graduation rate; its average SAT total was 838 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Mount Olive": {
    hs: "Mt Olive High School",
    district: "Mount Olive Community Unit School District 5",
    usNewsNational: 8968, usNewsState: 310,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Mount Olive Community Unit School District 5 covers essentially all Mount Olive's residents (2020 census blocks). Mt Olive High School (#310 in Illinois) enrolls 150 students in grades 9-12 with an 82% graduation rate; its average SAT total was 994 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Mulberry Grove": {
    hs: "Mulberry Grove Senior High School",
    district: "Mulberry Grove Community Unit School District 1",
    usNewsNational: 13146, usNewsState: 453,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Mulberry Grove Community Unit School District 1 covers essentially all Mulberry Grove's residents (2020 census blocks). Mulberry Grove Senior High School (#453 in Illinois) enrolls 108 students in grades 9-12 with a 94% graduation rate; its average SAT total was 901 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "New Athens": {
    hs: "New Athens High School",
    district: "New Athens Community Unit School District 60",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "New Athens Community Unit School District 60 covers essentially all New Athens's residents (2020 census blocks). New Athens High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 164 students in grades 9-12 with an 84% graduation rate; its average SAT total was 918 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "New Baden": {
    hs: "Wesclin Senior High School",
    district: "Wesclin Community Unit School District 3",
    feedsTo: "Wesclin Senior High School",
    usNewsNational: 9582, usNewsState: 330,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Wesclin Community Unit School District 3 covers about 94% of New Baden's residents (2020 census blocks). The rest are mostly in Mascoutah Community Unit School District 19 (6%). New Baden has no high school inside its boundary; the high school is in Trenton. Wesclin Senior High School (#330 in Illinois) enrolls 343 students in grades 9-12 with a 95% graduation rate; its average SAT total was 946 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "O'Fallon": {
    hs: "O'Fallon Township High School",
    district: "O'Fallon Township High School District 203",
    usNewsNational: 4232, usNewsState: 165,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "O'Fallon Township High School District 203 covers essentially all O'Fallon's residents (2020 census blocks). O'Fallon Township High School (#165 in Illinois) enrolls 2,540 students in grades 9-12 with a 91% graduation rate and a 20% AP/IB-exam participation rate; its average SAT total was 1008 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Palmyra": {
    hs: "Northwestern High School (IL)",
    district: "Northwestern Community Unit School District 2",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Northwestern Community Unit School District 2 covers essentially all Palmyra's residents (2020 census blocks). Northwestern High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 94 students in grades 9-12 with an 81% graduation rate; its average SAT total was 891 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Pocahontas": {
    hs: "Bond Cty Comm Unit 2 High School",
    district: "Bond County Community Unit School District 2",
    feedsTo: "Bond Cty Comm Unit 2 High School",
    usNewsNational: 5319, usNewsState: 209,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Bond County Community Unit School District 2 covers essentially all Pocahontas's residents (2020 census blocks). Pocahontas has no high school inside its boundary; the high school is in Greenville. Bond Cty Comm Unit 2 High School (#209 in Illinois) enrolls 484 students in grades 9-12 with an 88% graduation rate and a 14% AP/IB-exam participation rate; its average SAT total was 990 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Pontoon Beach": {
    hs: "Granite City High School",
    district: "Granite City Community Unit School District 9",
    feedsTo: "Granite City High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Granite City Community Unit School District 9 covers about 97% of Pontoon Beach's residents (2020 census blocks). Pontoon Beach has no high school inside its boundary; the high school is in Granite City. Granite City High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 1,755 students in grades 9-12 with a 74% graduation rate; its average SAT total was 838 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Rosewood Heights": {
    hs: ["Roxana Senior High School", "Civic Memorial High School"],
    district: ["Roxana Community Unit School District 1", "Bethalto Community Unit School District 8"],
    feedsTo: "Roxana Senior High School / Civic Memorial High School",
    usNewsNational: 8120, usNewsState: 289,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rosewood Heights is split between school districts (2020 census-block shares): Roxana Community Unit School District 1 about 79%, Bethalto Community Unit School District 8 about 21%; students attend Roxana Senior High School or Civic Memorial High School depending on address. Rosewood Heights has no high school inside its boundary; the high schools are in Bethalto, Roxana. Roxana Senior High School (#348 in Illinois) enrolls 500 students in grades 9-12 with an 84% graduation rate; its average SAT total was 932 in 2024 (ISBE, Illinois's last state SAT). Also: Civic Memorial High School (#289 in Illinois) enrolls 760 students in grades 9-12 with a 96% graduation rate; its average SAT total was 968 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Roxana": {
    hs: "Roxana Senior High School",
    district: "Roxana Community Unit School District 1",
    usNewsNational: 10101, usNewsState: 348,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Roxana Community Unit School District 1 covers about 99% of Roxana's residents (2020 census blocks). Roxana Senior High School (#348 in Illinois) enrolls 500 students in grades 9-12 with an 84% graduation rate; its average SAT total was 932 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Shiloh": {
    hs: ["Belleville High School-East", "Belleville High School-West", "O'Fallon Township High School"],
    district: ["Belleville Township High School District 201", "Belleville Township High School District 201", "O'Fallon Township High School District 203"],
    feedsTo: "Belleville High School-East / Belleville High School-West / O'Fallon Township High School",
    usNewsNational: 4232, usNewsState: 165,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shiloh is split between school districts (2020 census-block shares): Belleville Township High School District 201 about 50%, O'Fallon Township High School District 203 about 41%; students attend Belleville High School-East, Belleville High School-West or O'Fallon Township High School depending on address. Smaller shares are in Mascoutah Community Unit School District 19 (8%). Shiloh has no high school inside its boundary; the high schools are in Belleville, O Fallon. Belleville High School-East (#238 in Illinois) enrolls 2,600 students in grades 9-12 with a 92% graduation rate and a 15% AP/IB-exam participation rate; its average SAT total was 923 in 2024 (ISBE, Illinois's last state SAT). Also: Belleville High School-West (#284 in Illinois) enrolls 2,118 students in grades 9-12 with a 92% graduation rate and a 23% AP/IB-exam participation rate; its average SAT total was 875 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Shipman": {
    hs: "Southwestern High School",
    district: "Southwestern Community Unit School District 9",
    feedsTo: "Southwestern High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Southwestern Community Unit School District 9 covers essentially all Shipman's residents (2020 census blocks). Shipman has no high school inside its boundary; the high school is in Piasa. Southwestern High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 370 students in grades 9-12 with an 83% graduation rate; its average SAT total was 927 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Smithton": {
    hs: "Freeburg Community High School",
    district: "Freeburg Community High School District 77",
    feedsTo: "Freeburg Community High School",
    usNewsNational: 4365, usNewsState: 171,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Freeburg Community High School District 77 covers about 99% of Smithton's residents (2020 census blocks). Smithton has no high school inside its boundary; the high school is in Freeburg. Freeburg Community High School (#171 in Illinois) enrolls 689 students in grades 9-12 with a 92% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 1022 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "South Roxana": {
    hs: "Roxana Senior High School",
    district: "Roxana Community Unit School District 1",
    feedsTo: "Roxana Senior High School",
    usNewsNational: 10101, usNewsState: 348,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Roxana Community Unit School District 1 covers about 99% of South Roxana's residents (2020 census blocks). South Roxana has no high school inside its boundary; the high school is in Roxana. Roxana Senior High School (#348 in Illinois) enrolls 500 students in grades 9-12 with an 84% graduation rate; its average SAT total was 932 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "St. Jacob": {
    hs: "Triad High School",
    district: "Triad Community Unit School District 2",
    feedsTo: "Triad High School",
    usNewsNational: 3187, usNewsState: 129,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Triad Community Unit School District 2 covers essentially all St. Jacob's residents (2020 census blocks). St. Jacob has no high school inside its boundary; the high school is in Troy. Triad High School (#129 in Illinois) enrolls 1,218 students in grades 9-12 with a 94% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 1019 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "St. Libory": {
    hs: "Freeburg Community High School",
    district: "Freeburg Community High School District 77",
    feedsTo: "Freeburg Community High School",
    usNewsNational: 4365, usNewsState: 171,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Freeburg Community High School District 77 covers essentially all St. Libory's residents (2020 census blocks). St. Libory has no high school inside its boundary; the high school is in Freeburg. Freeburg Community High School (#171 in Illinois) enrolls 689 students in grades 9-12 with a 92% graduation rate and a 38% AP/IB-exam participation rate; its average SAT total was 1022 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Staunton": {
    hs: "Staunton High School",
    district: "Staunton Community Unit School District 6",
    usNewsNational: 12438, usNewsState: 426,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Staunton Community Unit School District 6 covers essentially all Staunton's residents (2020 census blocks). Staunton High School (#426 in Illinois) enrolls 384 students in grades 9-12 with an 89% graduation rate; its average SAT total was 922 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Swansea": {
    hs: ["Belleville High School-East", "Belleville High School-West"],
    district: ["Belleville Township High School District 201", "Belleville Township High School District 201"],
    feedsTo: "Belleville High School-East / Belleville High School-West",
    usNewsNational: 6263, usNewsState: 238,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Belleville Township High School District 201 covers about 95% of Swansea's residents (2020 census blocks). The rest are mostly in O'Fallon Township High School District 203 (5%). Belleville Township High School District 201 runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Swansea has no high school inside its boundary; the high schools are in Belleville. Belleville High School-East (#238 in Illinois) enrolls 2,600 students in grades 9-12 with a 92% graduation rate and a 15% AP/IB-exam participation rate; its average SAT total was 923 in 2024 (ISBE, Illinois's last state SAT). Also: Belleville High School-West (#284 in Illinois) enrolls 2,118 students in grades 9-12 with a 92% graduation rate and a 23% AP/IB-exam participation rate; its average SAT total was 875 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Trenton": {
    hs: "Wesclin Senior High School",
    district: "Wesclin Community Unit School District 3",
    usNewsNational: 9582, usNewsState: 330,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Wesclin Community Unit School District 3 covers essentially all Trenton's residents (2020 census blocks). Wesclin Senior High School (#330 in Illinois) enrolls 343 students in grades 9-12 with a 95% graduation rate; its average SAT total was 946 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Troy": {
    hs: "Triad High School",
    district: "Triad Community Unit School District 2",
    usNewsNational: 3187, usNewsState: 129,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Triad Community Unit School District 2 covers essentially all Troy's residents (2020 census blocks). Triad High School (#129 in Illinois) enrolls 1,218 students in grades 9-12 with a 94% graduation rate and a 25% AP/IB-exam participation rate; its average SAT total was 1019 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Valmeyer": {
    hs: "Valmeyer High School",
    district: "Valmeyer Community Unit School District 3",
    usNewsNational: 11389, usNewsState: 389,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Valmeyer Community Unit School District 3 covers essentially all Valmeyer's residents (2020 census blocks). Valmeyer High School (#389 in Illinois) enrolls 106 students in grades 9-12 with a 91% graduation rate; its average SAT total was 986 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Venice": {
    hs: "Madison Senior High School",
    district: "Madison Community Unit School District 12 (about 68%) and Venice Community Unit School District 3 (about 32%)",
    feedsTo: "Madison Senior High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Venice is split between school districts (2020 census-block shares): Madison Community Unit School District 12 about 68%, Venice Community Unit School District 3 about 32%; students attend Madison Senior High School depending on address. Venice Community Unit School District 3 (32% of Venice) has only an elementary/middle school (Venice Elementary, PK-8); which high school its 9-12 students attend was not established, so that share is not assigned to a high school. Venice has no high school inside its boundary; the high school is in Madison. Madison Senior High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 152 students in grades 9-12 with a 63% graduation rate; its average SAT total was 765 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Virden": {
    hs: "North Mac High School",
    district: "North Mac Community Unit School District 34",
    usNewsNational: 9851, usNewsState: 340,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "North Mac Community Unit School District 34 covers essentially all Virden's residents (2020 census blocks). North Mac High School (#340 in Illinois) enrolls 361 students in grades 9-12 with an 87% graduation rate and a 32% AP/IB-exam participation rate; its average SAT total was 929 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Washington Park": {
    hs: "East St Louis Senior High School",
    district: "East St. Louis School District 189",
    feedsTo: "East St Louis Senior High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "East St. Louis School District 189 covers essentially all Washington Park's residents (2020 census blocks). Washington Park has no high school inside its boundary; the high school is in East Saint Louis. East St Louis Senior High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 1,287 students in grades 9-12 with a 74% graduation rate and a 30% AP/IB-exam participation rate; its average SAT total was 751 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Waterloo": {
    hs: "Waterloo High School",
    district: "Waterloo Community Unit School District 5",
    usNewsNational: 5682, usNewsState: 223,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Waterloo Community Unit School District 5 covers essentially all Waterloo's residents (2020 census blocks). Waterloo High School (#223 in Illinois) enrolls 876 students in grades 9-12 with a 95% graduation rate and a 14% AP/IB-exam participation rate; its average SAT total was 1001 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Wilsonville": {
    hs: "Gillespie High School",
    district: "Gillespie Community Unit School District 7",
    feedsTo: "Gillespie High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Gillespie Community Unit School District 7 covers essentially all Wilsonville's residents (2020 census blocks). Wilsonville has no high school inside its boundary; the high school is in Gillespie. Gillespie High School (in the unranked-bottom band, 469–675 in Illinois) enrolls 328 students in grades 9-12 with an 82% graduation rate; its average SAT total was 913 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Wood River": {
    hs: ["East Alton-Wood River High School", "Roxana Senior High School"],
    district: ["East Alton-Wood River Community High School District 14", "Roxana Community Unit School District 1"],
    usNewsNational: 10101, usNewsState: 348,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Wood River is split between school districts (2020 census-block shares): East Alton-Wood River Community High School District 14 about 63%, Roxana Community Unit School District 1 about 35%; students attend East Alton-Wood River High School or Roxana Senior High School depending on address. East Alton-Wood River High School (#363 in Illinois) enrolls 539 students in grades 9-12 with a 91% graduation rate; its average SAT total was 877 in 2024 (ISBE, Illinois's last state SAT). Also: Roxana Senior High School (#348 in Illinois) enrolls 500 students in grades 9-12 with an 84% graduation rate; its average SAT total was 932 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Worden": {
    hs: "Edwardsville High School",
    district: "Edwardsville Community Unit School District 7",
    feedsTo: "Edwardsville High School",
    usNewsNational: 2817, usNewsState: 115,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Edwardsville Community Unit School District 7 covers essentially all Worden's residents (2020 census blocks). Worden has no high school inside its boundary; the high school is in Edwardsville. Edwardsville High School (#115 in Illinois) enrolls 2,342 students in grades 9-12 with a 91% graduation rate and a 29% AP/IB-exam participation rate; its average SAT total was 1026 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Affton (MO)": {
    hs: "Affton High School",
    district: "Affton 101 School District",
    usNewsNational: 8355, usNewsState: 128,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Affton 101 School District covers about 72% of Affton's residents (2020 census blocks). The rest are mostly in Mehlville R-IX School District (14%) and Bayless School District (13%). Affton High School (#128 in Missouri) enrolls 761 students in grades 9-12 with a 90% graduation rate and a 30% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.3 in 2025 (128 of 164 graduates tested; Missouri DESE)."
  },
  "Arnold (MO)": {
    hs: ["Seckman Sr. High School", "Fox Sr. High School"],
    district: ["Fox C-6 School District", "Fox C-6 School District"],
    usNewsNational: 6840, usNewsState: 101,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Fox C-6 School District covers essentially all Arnold's residents (2020 census blocks). Fox C-6 School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Seckman Sr. High School (#101 in Missouri) enrolls 1,737 students in grades 9-12 with a 96% graduation rate and a 36% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.5 in 2025 (300 of 407 graduates tested; Missouri DESE). Also: Fox Sr. High School (#138 in Missouri) enrolls 1,660 students in grades 9-12 with a 90% graduation rate and a 19% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.5 in 2025 (311 of 429 graduates tested; Missouri DESE)."
  },
  "Ballwin (MO)": {
    hs: ["Lafayette Sr. High School", "Marquette Sr. High School", "Eureka Sr. High School", "Rockwood Summit Sr. High School", "Parkway West High School", "Central High School (MO)", "Parkway South High School", "North High School"],
    district: ["Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District"],
    usNewsNational: 438, usNewsState: 4,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Ballwin is split between school districts (2020 census-block shares): Rockwood R-VI School District about 65%, Parkway C-2 School District about 35%; students attend Lafayette Sr. High School, Marquette Sr. High School, Eureka Sr. High School, Rockwood Summit Sr. High School, Parkway West High School, Central High School, Parkway South High School or North High School depending on address. Lafayette Sr. High School (#7 in Missouri) enrolls 1,669 students in grades 9-12 with a 97% graduation rate and a 60% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.6 in 2025 (385 of 416 graduates tested; Missouri DESE). Also: Marquette Sr. High School (#23 in Missouri) enrolls 2,095 students in grades 9-12 with a 95% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.4 in 2025 (453 of 505 graduates tested; Missouri DESE)."
  },
  "Barnhart (MO)": {
    hs: "Windsor High School",
    district: "Windsor C-1 School District",
    feedsTo: "Windsor High School",
    usNewsNational: 12306, usNewsState: 232,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Windsor C-1 School District covers about 96% of Barnhart's residents (2020 census blocks). The rest are mostly in Fox C-6 School District (4%). Barnhart has no high school inside its boundary; the high school is in Imperial. Windsor High School (#232 in Missouri) enrolls 887 students in grades 9-12 with a 95% graduation rate and a 12% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (180 of 204 graduates tested; Missouri DESE)."
  },
  "Bel-Nor (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Bel-Nor's residents (2020 census blocks). Bel-Nor has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Bel-Ridge (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Bel-Ridge's residents (2020 census blocks). Bel-Ridge has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Bella Villa (MO)": {
    hs: "Bayless Sr. High School",
    district: "Bayless School District",
    feedsTo: "Bayless Sr. High School",
    usNewsNational: 3634, usNewsState: 47,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Bayless School District covers about 86% of Bella Villa's residents (2020 census blocks). The rest are mostly in Hancock Place School District (14%). Bella Villa has no high school inside its boundary; the high school is in St Louis. Bayless Sr. High School (#47 in Missouri) enrolls 562 students in grades 9-12 with a 92% graduation rate and a 36% AP/IB-exam participation rate; its graduates who took the ACT averaged 17.9 in 2025 (118 of 143 graduates tested; Missouri DESE)."
  },
  "Bellefontaine Neighbors (MO)": {
    hs: "Riverview Gardens Sr. High School",
    district: "Riverview Gardens School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Riverview Gardens School District covers about 96% of Bellefontaine Neighbors's residents (2020 census blocks). The rest are mostly in Hazelwood School District (4%). Riverview Gardens Sr. High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,246 students in grades 9-12 with a 69% graduation rate; its graduates who took the ACT averaged 14.6 in 2025 (109 of 256 graduates tested; Missouri DESE)."
  },
  "Berkeley (MO)": {
    hs: ["McCluer North High School", "McCluer High School"],
    district: ["Ferguson-Florissant R-II School District", "Ferguson-Florissant R-II School District"],
    feedsTo: "McCluer North High School / McCluer High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Ferguson-Florissant R-II School District covers essentially all Berkeley's residents (2020 census blocks). Ferguson-Florissant R-II School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). U.S. News also lists STEAM Academy at McCluer South-Berkeley High (#8 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. U.S. News also lists The Innovation School at Cv (in the unranked-bottom band, 256–356 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. Berkeley has no high school inside its boundary; the high schools are in Florissant. McCluer North High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,059 students in grades 9-12 with a 90% graduation rate and a 4% AP/IB-exam participation rate; its graduates who took the ACT averaged 15.6 in 2025 (150 of 289 graduates tested; Missouri DESE). Also: McCluer High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,075 students in grades 9-12 with a 90% graduation rate and a 16% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.4 in 2025 (153 of 310 graduates tested; Missouri DESE)."
  },
  "Black Jack (MO)": {
    hs: ["Hazelwood West High School", "Hazelwood Central High School", "Hazelwood East High School"],
    district: ["Hazelwood School District", "Hazelwood School District", "Hazelwood School District"],
    feedsTo: "Hazelwood West High School / Hazelwood Central High School / Hazelwood East High School",
    usNewsNational: 8775, usNewsState: 136,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Hazelwood School District covers essentially all Black Jack's residents (2020 census blocks). Hazelwood School District runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Black Jack has no high school inside its boundary; the high schools are in Florissant, Hazelwood, St Louis. Hazelwood West High School (#136 in Missouri) enrolls 1,994 students in grades 9-12 with an 82% graduation rate and a 24% AP/IB-exam participation rate; its graduates who took the ACT averaged 17.5 in 2025 (233 of 465 graduates tested; Missouri DESE). Also: Hazelwood Central High School (#220 in Missouri) enrolls 1,718 students in grades 9-12 with an 80% graduation rate and an 18% AP/IB-exam participation rate; its graduates who took the ACT averaged 16 in 2025 (191 of 437 graduates tested; Missouri DESE)."
  },
  "Breckenridge Hills (MO)": {
    hs: "Ritenour Sr. High School",
    district: "Ritenour School District",
    usNewsNational: 12997, usNewsState: 248,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ritenour School District covers essentially all Breckenridge Hills's residents (2020 census blocks). Ritenour Sr. High School (#248 in Missouri) enrolls 2,041 students in grades 9-12 with a 76% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (102 of 453 graduates tested; Missouri DESE)."
  },
  "Brentwood (MO)": {
    hs: "Brentwood High School",
    district: "Brentwood School District",
    usNewsNational: 7218, usNewsState: 109,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Brentwood School District covers about 99% of Brentwood's residents (2020 census blocks). Brentwood High School (#109 in Missouri) enrolls 195 students in grades 9-12 with a 100% graduation rate; its graduates who took the ACT averaged 22.4 in 2025 (45 of 53 graduates tested; Missouri DESE)."
  },
  "Bridgeton (MO)": {
    hs: "Pattonville Sr. High School",
    district: "Pattonville R-III School District",
    feedsTo: "Pattonville Sr. High School",
    usNewsNational: 4585, usNewsState: 56,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pattonville R-III School District covers essentially all Bridgeton's residents (2020 census blocks). Bridgeton has no high school inside its boundary; the high school is in Maryland Heights. Pattonville Sr. High School (#56 in Missouri) enrolls 1,945 students in grades 9-12 with an 89% graduation rate and an 18% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.5 in 2025 (326 of 441 graduates tested; Missouri DESE)."
  },
  "Byrnes Mill (MO)": {
    hs: "Northwest High School",
    district: "Northwest R-I School District",
    feedsTo: "Northwest High School",
    usNewsNational: 10100, usNewsState: 167,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Northwest R-I School District covers essentially all Byrnes Mill's residents (2020 census blocks). Byrnes Mill has no high school inside its boundary; the high school is in Cedar Hill. Northwest High School (#167 in Missouri) enrolls 1,788 students in grades 9-12 with a 91% graduation rate and a 12% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.5 in 2025 (262 of 415 graduates tested; Missouri DESE)."
  },
  "Calverton Park (MO)": {
    hs: ["McCluer North High School", "McCluer High School"],
    district: ["Ferguson-Florissant R-II School District", "Ferguson-Florissant R-II School District"],
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Ferguson-Florissant R-II School District covers essentially all Calverton Park's residents (2020 census blocks). Ferguson-Florissant R-II School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). U.S. News also lists STEAM Academy at McCluer South-Berkeley High (#8 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. U.S. News also lists The Innovation School at Cv (in the unranked-bottom band, 256–356 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. McCluer North High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,059 students in grades 9-12 with a 90% graduation rate and a 4% AP/IB-exam participation rate; its graduates who took the ACT averaged 15.6 in 2025 (150 of 289 graduates tested; Missouri DESE). Also: McCluer High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,075 students in grades 9-12 with a 90% graduation rate and a 16% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.4 in 2025 (153 of 310 graduates tested; Missouri DESE)."
  },
  "Castle Point (MO)": {
    hs: "Riverview Gardens Sr. High School",
    district: "Riverview Gardens School District",
    feedsTo: "Riverview Gardens Sr. High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Riverview Gardens School District covers essentially all Castle Point's residents (2020 census blocks). Castle Point has no high school inside its boundary; the high school is in St Louis. Riverview Gardens Sr. High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,246 students in grades 9-12 with a 69% graduation rate; its graduates who took the ACT averaged 14.6 in 2025 (109 of 256 graduates tested; Missouri DESE)."
  },
  "Cedar Hill (MO)": {
    hs: "Northwest High School",
    district: "Northwest R-I School District",
    usNewsNational: 10100, usNewsState: 167,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Northwest R-I School District covers essentially all Cedar Hill's residents (2020 census blocks). Northwest High School (#167 in Missouri) enrolls 1,788 students in grades 9-12 with a 91% graduation rate and a 12% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.5 in 2025 (262 of 415 graduates tested; Missouri DESE)."
  },
  "Charlack (MO)": {
    hs: ["Ritenour Sr. High School", "Normandy High School"],
    district: ["Ritenour School District", "Normandy Schools Collaborative"],
    feedsTo: "Ritenour Sr. High School / Normandy High School",
    usNewsNational: 12997, usNewsState: 248,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Charlack is split between school districts (2020 census-block shares): Ritenour School District about 83%, Normandy Schools Collaborative about 17%; students attend Ritenour Sr. High School or Normandy High School depending on address. Charlack has no high school inside its boundary; the high schools are in St Louis. Ritenour Sr. High School (#248 in Missouri) enrolls 2,041 students in grades 9-12 with a 76% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (102 of 453 graduates tested; Missouri DESE). Also: Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Chesterfield (MO)": {
    hs: ["Parkway West High School", "Central High School (MO)", "Parkway South High School", "North High School", "Lafayette Sr. High School", "Marquette Sr. High School", "Eureka Sr. High School", "Rockwood Summit Sr. High School"],
    district: ["Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District"],
    usNewsNational: 438, usNewsState: 4,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Chesterfield is split between school districts (2020 census-block shares): Parkway C-2 School District about 71%, Rockwood R-VI School District about 29%; students attend Parkway West High School, Central High School, Parkway South High School, North High School, Lafayette Sr. High School, Marquette Sr. High School, Eureka Sr. High School or Rockwood Summit Sr. High School depending on address. Parkway West High School (#4 in Missouri) enrolls 1,417 students in grades 9-12 with a 98% graduation rate and a 57% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.7 in 2025 (298 of 342 graduates tested; Missouri DESE). Also: Central High School (#20 in Missouri) enrolls 1,281 students in grades 9-12 with a 97% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.6 in 2025 (284 of 322 graduates tested; Missouri DESE)."
  },
  "Clarkson Valley (MO)": {
    hs: ["Lafayette Sr. High School", "Marquette Sr. High School", "Eureka Sr. High School", "Rockwood Summit Sr. High School"],
    district: ["Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District"],
    usNewsNational: 677, usNewsState: 7,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rockwood R-VI School District covers essentially all Clarkson Valley's residents (2020 census blocks). Rockwood R-VI School District runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Lafayette Sr. High School (#7 in Missouri) enrolls 1,669 students in grades 9-12 with a 97% graduation rate and a 60% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.6 in 2025 (385 of 416 graduates tested; Missouri DESE). Also: Marquette Sr. High School (#23 in Missouri) enrolls 2,095 students in grades 9-12 with a 95% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.4 in 2025 (453 of 505 graduates tested; Missouri DESE)."
  },
  "Clayton (MO)": {
    hs: "Clayton High School",
    district: "Clayton School District",
    usNewsNational: 308, usNewsState: 3,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Clayton School District covers essentially all Clayton's residents (2020 census blocks). Clayton High School (#3 in Missouri) enrolls 788 students in grades 9-12 with a 97% graduation rate and a 73% AP/IB-exam participation rate; its graduates who took the ACT averaged 28.6 in 2025 (79 of 213 graduates tested; Missouri DESE)."
  },
  "Concord (MO)": {
    hs: ["Lindbergh Sr. High School", "Oakville Sr. High School", "Mehlville High School"],
    district: ["Lindbergh School District", "Mehlville R-IX School District", "Mehlville R-IX School District"],
    feedsTo: "Lindbergh Sr. High School / Oakville Sr. High School / Mehlville High School",
    usNewsNational: 1385, usNewsState: 18,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Concord is split between school districts (2020 census-block shares): Lindbergh School District about 70%, Mehlville R-IX School District about 30%; students attend Lindbergh Sr. High School, Oakville Sr. High School or Mehlville High School depending on address. Concord has no high school inside its boundary; the high schools are in St Louis, St. Louis. Lindbergh Sr. High School (#18 in Missouri) enrolls 2,304 students in grades 9-12 with a 96% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.5 in 2025 (346 of 594 graduates tested; Missouri DESE). Also: Oakville Sr. High School (#79 in Missouri) enrolls 1,847 students in grades 9-12 with a 98% graduation rate and a 19% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.2 in 2025 (349 of 451 graduates tested; Missouri DESE)."
  },
  "Cool Valley (MO)": {
    hs: ["McCluer North High School", "McCluer High School"],
    district: ["Ferguson-Florissant R-II School District", "Ferguson-Florissant R-II School District"],
    feedsTo: "McCluer North High School / McCluer High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Ferguson-Florissant R-II School District covers essentially all Cool Valley's residents (2020 census blocks). Ferguson-Florissant R-II School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). U.S. News also lists STEAM Academy at McCluer South-Berkeley High (#8 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. U.S. News also lists The Innovation School at Cv (in the unranked-bottom band, 256–356 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. Cool Valley has no high school inside its boundary; the high schools are in Florissant. McCluer North High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,059 students in grades 9-12 with a 90% graduation rate and a 4% AP/IB-exam participation rate; its graduates who took the ACT averaged 15.6 in 2025 (150 of 289 graduates tested; Missouri DESE). Also: McCluer High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,075 students in grades 9-12 with a 90% graduation rate and a 16% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.4 in 2025 (153 of 310 graduates tested; Missouri DESE)."
  },
  "Cottleville (MO)": {
    hs: ["Francis Howell High School", "Francis Howell Central High School", "Francis Howell North High School"],
    district: ["Francis Howell R-III School District", "Francis Howell R-III School District", "Francis Howell R-III School District"],
    usNewsNational: 1117, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Francis Howell R-III School District covers about 88% of Cottleville's residents (2020 census blocks). The rest are mostly in Fort Zumwalt R-II School District (12%). Francis Howell R-III School District runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Francis Howell High School (#10 in Missouri) enrolls 1,843 students in grades 9-12 with a 96% graduation rate and a 41% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.4 in 2025 (409 of 455 graduates tested; Missouri DESE). Also: Francis Howell Central High School (#13 in Missouri) enrolls 1,750 students in grades 9-12 with a 96% graduation rate and a 34% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.9 in 2025 (362 of 431 graduates tested; Missouri DESE)."
  },
  "Country Club Hills (MO)": {
    hs: "Jennings High School",
    district: "Jennings School District",
    feedsTo: "Jennings High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Jennings School District covers essentially all Country Club Hills's residents (2020 census blocks). Country Club Hills has no high school inside its boundary; the high school is in Jennings. Jennings High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 666 students in grades 9-12 with an 88% graduation rate; its graduates who took the ACT averaged 15 in 2025 (58 of 164 graduates tested; Missouri DESE)."
  },
  "Crestwood (MO)": {
    hs: "Lindbergh Sr. High School",
    district: "Lindbergh School District",
    feedsTo: "Lindbergh Sr. High School",
    usNewsNational: 1385, usNewsState: 18,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lindbergh School District covers about 96% of Crestwood's residents (2020 census blocks). The rest are mostly in Affton 101 School District (4%). Crestwood has no high school inside its boundary; the high school is in St. Louis. Lindbergh Sr. High School (#18 in Missouri) enrolls 2,304 students in grades 9-12 with a 96% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.5 in 2025 (346 of 594 graduates tested; Missouri DESE)."
  },
  "Creve Coeur (MO)": {
    hs: ["Parkway West High School", "Central High School (MO)", "Parkway South High School", "North High School", "Ladue Horton Watkins High School"],
    district: ["Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Ladue School District"],
    feedsTo: "Parkway West High School / Central High School / Parkway South High School / North High School / Ladue Horton Watkins High School",
    usNewsNational: 438, usNewsState: 4,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Creve Coeur is split between school districts (2020 census-block shares): Parkway C-2 School District about 71%, Ladue School District about 29%; students attend Parkway West High School, Central High School, Parkway South High School, North High School or Ladue Horton Watkins High School depending on address. Creve Coeur has no high school inside its boundary; the high schools are in Ballwin, Chesterfield, Manchester, St Louis. Parkway West High School (#4 in Missouri) enrolls 1,417 students in grades 9-12 with a 98% graduation rate and a 57% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.7 in 2025 (298 of 342 graduates tested; Missouri DESE). Also: Central High School (#20 in Missouri) enrolls 1,281 students in grades 9-12 with a 97% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.6 in 2025 (284 of 322 graduates tested; Missouri DESE)."
  },
  "Crystal City (MO)": {
    hs: "Crystal City High School",
    district: "Crystal City 47 School District",
    usNewsNational: 10398, usNewsState: 175,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Crystal City 47 School District covers about 82% of Crystal City's residents (2020 census blocks). The rest are mostly in Festus R-VI School District (13%) and Jefferson County R-VII School District (5%). Crystal City High School (#175 in Missouri) enrolls 156 students in grades 9-12 with a 94% graduation rate; its graduates who took the ACT averaged 20.5 in 2025 (22 of 31 graduates tested; Missouri DESE)."
  },
  "Crystal Lake Park (MO)": {
    hs: "Ladue Horton Watkins High School",
    district: "Ladue School District",
    feedsTo: "Ladue Horton Watkins High School",
    usNewsNational: 1156, usNewsState: 16,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ladue School District covers essentially all Crystal Lake Park's residents (2020 census blocks). Crystal Lake Park has no high school inside its boundary; the high school is in St Louis. Ladue Horton Watkins High School (#16 in Missouri) enrolls 1,395 students in grades 9-12 with a 98% graduation rate and a 66% AP/IB-exam participation rate; its graduates who took the ACT averaged 26 in 2025 (246 of 340 graduates tested; Missouri DESE)."
  },
  "Dardenne Prairie (MO)": {
    hs: ["Ft. Zumwalt South High School", "Ft. Zumwalt West High School", "Ft. Zumwalt North High School", "Ft. Zumwalt East High School", "Liberty High School", "Timberland High School", "North Point High School", "Emil E. Holt Sr. High School", "Francis Howell High School", "Francis Howell Central High School", "Francis Howell North High School"],
    district: ["Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Francis Howell R-III School District", "Francis Howell R-III School District", "Francis Howell R-III School District"],
    feedsTo: "Ft. Zumwalt South High School / Ft. Zumwalt West High School / Ft. Zumwalt North High School / Ft. Zumwalt East High School / Liberty High School / Timberland High School / North Point High School / Emil E. Holt Sr. High School / Francis Howell High School / Francis Howell Central High School / Francis Howell North High School",
    usNewsNational: 1117, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Dardenne Prairie is split between school districts (2020 census-block shares): Fort Zumwalt R-II School District about 51%, Wentzville R-IV School District about 33%, Francis Howell R-III School District about 16%; students attend Ft. Zumwalt South High School, Ft. Zumwalt West High School, Ft. Zumwalt North High School, Ft. Zumwalt East High School, Liberty High School, Timberland High School, North Point High School, Emil E. Holt Sr. High School, Francis Howell High School, Francis Howell Central High School or Francis Howell North High School depending on address. Dardenne Prairie has no high school inside its boundary; the high schools are in Lake St. Louis, O'fallon, St Charles, St Peters, Wentzville. Ft. Zumwalt South High School (#12 in Missouri) enrolls 1,212 students in grades 9-12 with a 92% graduation rate and a 45% AP/IB-exam participation rate; its graduates who took the ACT averaged 24 in 2025 (182 of 279 graduates tested; Missouri DESE). Also: Ft. Zumwalt West High School (#15 in Missouri) enrolls 1,643 students in grades 9-12 with a 94% graduation rate and a 38% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (250 of 372 graduates tested; Missouri DESE)."
  },
  "De Soto (MO)": {
    hs: "Desoto Sr. High School",
    district: "De Soto 73 School District",
    usNewsNational: 5509, usNewsState: 71,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "De Soto 73 School District covers about 97% of De Soto's residents (2020 census blocks). Desoto Sr. High School (#71 in Missouri) enrolls 862 students in grades 9-12 with a 93% graduation rate; its graduates who took the ACT averaged 18.8 in 2025 (151 of 214 graduates tested; Missouri DESE)."
  },
  "Dellwood (MO)": {
    hs: ["Riverview Gardens Sr. High School", "McCluer North High School", "McCluer High School"],
    district: ["Riverview Gardens School District", "Ferguson-Florissant R-II School District", "Ferguson-Florissant R-II School District"],
    feedsTo: "Riverview Gardens Sr. High School / McCluer North High School / McCluer High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Dellwood is split between school districts (2020 census-block shares): Riverview Gardens School District about 71%, Ferguson-Florissant R-II School District about 17%; students attend Riverview Gardens Sr. High School, McCluer North High School or McCluer High School depending on address. Smaller shares are in Hazelwood School District (13%). U.S. News also lists STEAM Academy at McCluer South-Berkeley High (#8 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. U.S. News also lists The Innovation School at Cv (in the unranked-bottom band, 256–356 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. Dellwood has no high school inside its boundary; the high schools are in Florissant, St Louis. Riverview Gardens Sr. High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,246 students in grades 9-12 with a 69% graduation rate; its graduates who took the ACT averaged 14.6 in 2025 (109 of 256 graduates tested; Missouri DESE). Also: McCluer North High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,059 students in grades 9-12 with a 90% graduation rate and a 4% AP/IB-exam participation rate; its graduates who took the ACT averaged 15.6 in 2025 (150 of 289 graduates tested; Missouri DESE)."
  },
  "Des Peres (MO)": {
    hs: ["Kirkwood Sr. High School", "Parkway West High School", "Central High School (MO)", "Parkway South High School", "North High School"],
    district: ["Kirkwood R-VII School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District"],
    feedsTo: "Kirkwood Sr. High School / Parkway West High School / Central High School / Parkway South High School / North High School",
    usNewsNational: 438, usNewsState: 4,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Des Peres is split between school districts (2020 census-block shares): Kirkwood R-VII School District about 60%, Parkway C-2 School District about 40%; students attend Kirkwood Sr. High School, Parkway West High School, Central High School, Parkway South High School or North High School depending on address. Des Peres has no high school inside its boundary; the high schools are in Ballwin, Chesterfield, Kirkwood, Manchester, St Louis. Kirkwood Sr. High School (#24 in Missouri) enrolls 1,693 students in grades 9-12 with a 97% graduation rate and a 51% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (353 of 391 graduates tested; Missouri DESE). Also: Parkway West High School (#4 in Missouri) enrolls 1,417 students in grades 9-12 with a 98% graduation rate and a 57% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.7 in 2025 (298 of 342 graduates tested; Missouri DESE)."
  },
  "Edmundson (MO)": {
    hs: "Ritenour Sr. High School",
    district: "Ritenour School District",
    feedsTo: "Ritenour Sr. High School",
    usNewsNational: 12997, usNewsState: 248,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ritenour School District covers essentially all Edmundson's residents (2020 census blocks). Edmundson has no high school inside its boundary; the high school is in St Louis. Ritenour Sr. High School (#248 in Missouri) enrolls 2,041 students in grades 9-12 with a 76% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (102 of 453 graduates tested; Missouri DESE)."
  },
  "Ellisville (MO)": {
    hs: ["Lafayette Sr. High School", "Marquette Sr. High School", "Eureka Sr. High School", "Rockwood Summit Sr. High School"],
    district: ["Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District"],
    feedsTo: "Lafayette Sr. High School / Marquette Sr. High School / Eureka Sr. High School / Rockwood Summit Sr. High School",
    usNewsNational: 677, usNewsState: 7,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rockwood R-VI School District covers essentially all Ellisville's residents (2020 census blocks). Rockwood R-VI School District runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Ellisville has no high school inside its boundary; the high schools are in Chesterfield, Eureka, Fenton, Wildwood. Lafayette Sr. High School (#7 in Missouri) enrolls 1,669 students in grades 9-12 with a 97% graduation rate and a 60% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.6 in 2025 (385 of 416 graduates tested; Missouri DESE). Also: Marquette Sr. High School (#23 in Missouri) enrolls 2,095 students in grades 9-12 with a 95% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.4 in 2025 (453 of 505 graduates tested; Missouri DESE)."
  },
  "Elsberry (MO)": {
    hs: "Elsberry High School",
    district: "Elsberry R-II School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Elsberry R-II School District covers essentially all Elsberry's residents (2020 census blocks). Elsberry High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 264 students in grades 9-12 with a 98% graduation rate; its graduates who took the ACT averaged 19.3 in 2025 (29 of 59 graduates tested; Missouri DESE)."
  },
  "Eureka (MO)": {
    hs: ["Lafayette Sr. High School", "Marquette Sr. High School", "Eureka Sr. High School", "Rockwood Summit Sr. High School"],
    district: ["Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District"],
    usNewsNational: 677, usNewsState: 7,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rockwood R-VI School District covers essentially all Eureka's residents (2020 census blocks). Rockwood R-VI School District runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Lafayette Sr. High School (#7 in Missouri) enrolls 1,669 students in grades 9-12 with a 97% graduation rate and a 60% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.6 in 2025 (385 of 416 graduates tested; Missouri DESE). Also: Marquette Sr. High School (#23 in Missouri) enrolls 2,095 students in grades 9-12 with a 95% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.4 in 2025 (453 of 505 graduates tested; Missouri DESE)."
  },
  "Fenton (MO)": {
    hs: ["Lindbergh Sr. High School", "Lafayette Sr. High School", "Marquette Sr. High School", "Eureka Sr. High School", "Rockwood Summit Sr. High School"],
    district: ["Lindbergh School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District"],
    usNewsNational: 677, usNewsState: 7,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Fenton is split between school districts (2020 census-block shares): Lindbergh School District about 54%, Rockwood R-VI School District about 46%; students attend Lindbergh Sr. High School, Lafayette Sr. High School, Marquette Sr. High School, Eureka Sr. High School or Rockwood Summit Sr. High School depending on address. Lindbergh Sr. High School (#18 in Missouri) enrolls 2,304 students in grades 9-12 with a 96% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.5 in 2025 (346 of 594 graduates tested; Missouri DESE). Also: Lafayette Sr. High School (#7 in Missouri) enrolls 1,669 students in grades 9-12 with a 97% graduation rate and a 60% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.6 in 2025 (385 of 416 graduates tested; Missouri DESE)."
  },
  "Ferguson (MO)": {
    hs: ["McCluer North High School", "McCluer High School"],
    district: ["Ferguson-Florissant R-II School District", "Ferguson-Florissant R-II School District"],
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Ferguson-Florissant R-II School District covers about 86% of Ferguson's residents (2020 census blocks). The rest are mostly in Riverview Gardens School District (11%) and Hazelwood School District (3%). Ferguson-Florissant R-II School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). U.S. News also lists STEAM Academy at McCluer South-Berkeley High (#8 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. U.S. News also lists The Innovation School at Cv (in the unranked-bottom band, 256–356 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. McCluer North High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,059 students in grades 9-12 with a 90% graduation rate and a 4% AP/IB-exam participation rate; its graduates who took the ACT averaged 15.6 in 2025 (150 of 289 graduates tested; Missouri DESE). Also: McCluer High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,075 students in grades 9-12 with a 90% graduation rate and a 16% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.4 in 2025 (153 of 310 graduates tested; Missouri DESE)."
  },
  "Festus (MO)": {
    hs: "Festus Sr. High School",
    district: "Festus R-VI School District",
    usNewsNational: 2190, usNewsState: 28,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Festus R-VI School District covers about 99% of Festus's residents (2020 census blocks). Festus Sr. High School (#28 in Missouri) enrolls 1,019 students in grades 9-12 with a 98% graduation rate and a 41% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.5 in 2025 (200 of 231 graduates tested; Missouri DESE)."
  },
  "Flint Hill (MO)": {
    hs: ["Ft. Zumwalt South High School", "Ft. Zumwalt West High School", "Ft. Zumwalt North High School", "Ft. Zumwalt East High School", "Liberty High School", "Timberland High School", "North Point High School", "Emil E. Holt Sr. High School"],
    district: ["Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District"],
    feedsTo: "Ft. Zumwalt South High School / Ft. Zumwalt West High School / Ft. Zumwalt North High School / Ft. Zumwalt East High School / Liberty High School / Timberland High School / North Point High School / Emil E. Holt Sr. High School",
    usNewsNational: 1135, usNewsState: 12,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Flint Hill is split between school districts (2020 census-block shares): Fort Zumwalt R-II School District about 80%, Wentzville R-IV School District about 20%; students attend Ft. Zumwalt South High School, Ft. Zumwalt West High School, Ft. Zumwalt North High School, Ft. Zumwalt East High School, Liberty High School, Timberland High School, North Point High School or Emil E. Holt Sr. High School depending on address. Flint Hill has no high school inside its boundary; the high schools are in Lake St. Louis, O'fallon, St Peters, Wentzville. Ft. Zumwalt South High School (#12 in Missouri) enrolls 1,212 students in grades 9-12 with a 92% graduation rate and a 45% AP/IB-exam participation rate; its graduates who took the ACT averaged 24 in 2025 (182 of 279 graduates tested; Missouri DESE). Also: Ft. Zumwalt West High School (#15 in Missouri) enrolls 1,643 students in grades 9-12 with a 94% graduation rate and a 38% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (250 of 372 graduates tested; Missouri DESE)."
  },
  "Flordell Hills (MO)": {
    hs: "Jennings High School",
    district: "Jennings School District",
    feedsTo: "Jennings High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Jennings School District covers essentially all Flordell Hills's residents (2020 census blocks). Flordell Hills has no high school inside its boundary; the high school is in Jennings. Jennings High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 666 students in grades 9-12 with an 88% graduation rate; its graduates who took the ACT averaged 15 in 2025 (58 of 164 graduates tested; Missouri DESE)."
  },
  "Florissant (MO)": {
    hs: ["McCluer North High School", "McCluer High School", "Hazelwood West High School", "Hazelwood Central High School", "Hazelwood East High School"],
    district: ["Ferguson-Florissant R-II School District", "Ferguson-Florissant R-II School District", "Hazelwood School District", "Hazelwood School District", "Hazelwood School District"],
    usNewsNational: 8775, usNewsState: 136,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Florissant is split between school districts (2020 census-block shares): Ferguson-Florissant R-II School District about 55%, Hazelwood School District about 45%; students attend McCluer North High School, McCluer High School, Hazelwood West High School, Hazelwood Central High School or Hazelwood East High School depending on address. U.S. News also lists STEAM Academy at McCluer South-Berkeley High (#8 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. U.S. News also lists The Innovation School at Cv (in the unranked-bottom band, 256–356 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. McCluer North High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,059 students in grades 9-12 with a 90% graduation rate and a 4% AP/IB-exam participation rate; its graduates who took the ACT averaged 15.6 in 2025 (150 of 289 graduates tested; Missouri DESE). Also: McCluer High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,075 students in grades 9-12 with a 90% graduation rate and a 16% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.4 in 2025 (153 of 310 graduates tested; Missouri DESE)."
  },
  "Foristell (MO)": {
    hs: ["Liberty High School", "Timberland High School", "North Point High School", "Emil E. Holt Sr. High School", "Wright City High School"],
    district: ["Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wright City R-II of Warren County"],
    feedsTo: "Liberty High School / Timberland High School / North Point High School / Emil E. Holt Sr. High School / Wright City High School",
    usNewsNational: 1537, usNewsState: 21,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Foristell is split between school districts (2020 census-block shares): Wentzville R-IV School District about 51%, Wright City R-II of Warren County about 49%; students attend Liberty High School, Timberland High School, North Point High School, Emil E. Holt Sr. High School or Wright City High School depending on address. Foristell has no high school inside its boundary; the high schools are in Lake St. Louis, Wentzville, Wright City. Liberty High School (#21 in Missouri) enrolls 1,647 students in grades 9-12 with a 98% graduation rate and a 39% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.2 in 2025 (208 of 371 graduates tested; Missouri DESE). Also: Timberland High School (#36 in Missouri) enrolls 1,525 students in grades 9-12 with a 95% graduation rate and a 25% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.8 in 2025 (216 of 387 graduates tested; Missouri DESE)."
  },
  "Frontenac (MO)": {
    hs: "Ladue Horton Watkins High School",
    district: "Ladue School District",
    feedsTo: "Ladue Horton Watkins High School",
    usNewsNational: 1156, usNewsState: 16,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ladue School District covers about 85% of Frontenac's residents (2020 census blocks). The rest are mostly in Kirkwood R-VII School District (15%). Frontenac has no high school inside its boundary; the high school is in St Louis. Ladue Horton Watkins High School (#16 in Missouri) enrolls 1,395 students in grades 9-12 with a 98% graduation rate and a 66% AP/IB-exam participation rate; its graduates who took the ACT averaged 26 in 2025 (246 of 340 graduates tested; Missouri DESE)."
  },
  "Gerald (MO)": {
    hs: "Owensville High School",
    district: "Gasconade County R-II School District",
    feedsTo: "Owensville High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Gasconade County R-II School District covers essentially all Gerald's residents (2020 census blocks). Gerald has no high school inside its boundary; the high school is in Owensville. Owensville High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 541 students in grades 9-12 with a 94% graduation rate; its graduates who took the ACT averaged 21.6 in 2025 (66 of 124 graduates tested; Missouri DESE)."
  },
  "Glasgow Village (MO)": {
    hs: "Riverview Gardens Sr. High School",
    district: "Riverview Gardens School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Riverview Gardens School District covers essentially all Glasgow Village's residents (2020 census blocks). Riverview Gardens Sr. High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,246 students in grades 9-12 with a 69% graduation rate; its graduates who took the ACT averaged 14.6 in 2025 (109 of 256 graduates tested; Missouri DESE)."
  },
  "Glendale (MO)": {
    hs: "Kirkwood Sr. High School",
    district: "Kirkwood R-VII School District",
    feedsTo: "Kirkwood Sr. High School",
    usNewsNational: 1774, usNewsState: 24,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Kirkwood R-VII School District covers about 87% of Glendale's residents (2020 census blocks). The rest are mostly in Webster Groves School District (13%). Glendale has no high school inside its boundary; the high school is in Kirkwood. Kirkwood Sr. High School (#24 in Missouri) enrolls 1,693 students in grades 9-12 with a 97% graduation rate and a 51% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (353 of 391 graduates tested; Missouri DESE)."
  },
  "Grantwood Village (MO)": {
    hs: "Lindbergh Sr. High School",
    district: "Lindbergh School District",
    feedsTo: "Lindbergh Sr. High School",
    usNewsNational: 1385, usNewsState: 18,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lindbergh School District covers essentially all Grantwood Village's residents (2020 census blocks). Grantwood Village has no high school inside its boundary; the high school is in St. Louis. Lindbergh Sr. High School (#18 in Missouri) enrolls 2,304 students in grades 9-12 with a 96% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.5 in 2025 (346 of 594 graduates tested; Missouri DESE)."
  },
  "Gray Summit (MO)": {
    hs: "Pacific High School",
    district: "Meramec Valley R-III School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Meramec Valley R-III School District covers essentially all Gray Summit's residents (2020 census blocks). Pacific High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 973 students in grades 9-12 with a 93% graduation rate and a 5% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.1 in 2025 (84 of 238 graduates tested; Missouri DESE)."
  },
  "Green Park (MO)": {
    hs: ["Oakville Sr. High School", "Mehlville High School", "Lindbergh Sr. High School"],
    district: ["Mehlville R-IX School District", "Mehlville R-IX School District", "Lindbergh School District"],
    feedsTo: "Oakville Sr. High School / Mehlville High School / Lindbergh Sr. High School",
    usNewsNational: 1385, usNewsState: 18,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Green Park is split between school districts (2020 census-block shares): Mehlville R-IX School District about 55%, Lindbergh School District about 45%; students attend Oakville Sr. High School, Mehlville High School or Lindbergh Sr. High School depending on address. Green Park has no high school inside its boundary; the high schools are in St Louis, St. Louis. Oakville Sr. High School (#79 in Missouri) enrolls 1,847 students in grades 9-12 with a 98% graduation rate and a 19% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.2 in 2025 (349 of 451 graduates tested; Missouri DESE). Also: Mehlville High School (#223 in Missouri) enrolls 1,388 students in grades 9-12 with an 89% graduation rate and a 9% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.5 in 2025 (250 of 391 graduates tested; Missouri DESE)."
  },
  "Greendale (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Greendale's residents (2020 census blocks). Greendale has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Hanley Hills (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Hanley Hills's residents (2020 census blocks). Hanley Hills has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Hawk Point (MO)": {
    hs: "Troy Buchanan High School",
    district: "Troy R-III School District",
    feedsTo: "Troy Buchanan High School",
    usNewsNational: 8043, usNewsState: 122,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Troy R-III School District covers essentially all Hawk Point's residents (2020 census blocks). Hawk Point has no high school inside its boundary; the high school is in Troy. Troy Buchanan High School (#122 in Missouri) enrolls 2,148 students in grades 9-12 with a 96% graduation rate and a 23% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.9 in 2025 (202 of 496 graduates tested; Missouri DESE)."
  },
  "Hazelwood (MO)": {
    hs: ["Hazelwood West High School", "Hazelwood Central High School", "Hazelwood East High School"],
    district: ["Hazelwood School District", "Hazelwood School District", "Hazelwood School District"],
    usNewsNational: 8775, usNewsState: 136,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Hazelwood School District covers about 87% of Hazelwood's residents (2020 census blocks). The rest are mostly in Ferguson-Florissant R-II School District (13%). Hazelwood School District runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Hazelwood West High School (#136 in Missouri) enrolls 1,994 students in grades 9-12 with an 82% graduation rate and a 24% AP/IB-exam participation rate; its graduates who took the ACT averaged 17.5 in 2025 (233 of 465 graduates tested; Missouri DESE). Also: Hazelwood Central High School (#220 in Missouri) enrolls 1,718 students in grades 9-12 with an 80% graduation rate and an 18% AP/IB-exam participation rate; its graduates who took the ACT averaged 16 in 2025 (191 of 437 graduates tested; Missouri DESE)."
  },
  "Herculaneum (MO)": {
    hs: ["Herculaneum High School", "Festus Sr. High School"],
    district: ["Dunklin R-V School District", "Festus R-VI School District"],
    usNewsNational: 2190, usNewsState: 28,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Herculaneum is split between school districts (2020 census-block shares): Dunklin R-V School District about 56%, Festus R-VI School District about 43%; students attend Herculaneum High School or Festus Sr. High School depending on address. Herculaneum High School (#168 in Missouri) enrolls 466 students in grades 9-12 with a 96% graduation rate; its graduates who took the ACT averaged 19.1 in 2025 (69 of 105 graduates tested; Missouri DESE). Also: Festus Sr. High School (#28 in Missouri) enrolls 1,019 students in grades 9-12 with a 98% graduation rate and a 41% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.5 in 2025 (200 of 231 graduates tested; Missouri DESE)."
  },
  "High Ridge (MO)": {
    hs: "Northwest High School",
    district: "Northwest R-I School District",
    feedsTo: "Northwest High School",
    usNewsNational: 10100, usNewsState: 167,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Northwest R-I School District covers essentially all High Ridge's residents (2020 census blocks). High Ridge has no high school inside its boundary; the high school is in Cedar Hill. Northwest High School (#167 in Missouri) enrolls 1,788 students in grades 9-12 with a 91% graduation rate and a 12% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.5 in 2025 (262 of 415 graduates tested; Missouri DESE)."
  },
  "Hillsboro (MO)": {
    hs: "Hillsboro High School",
    district: "Hillsboro R-III School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Hillsboro R-III School District covers essentially all Hillsboro's residents (2020 census blocks). Hillsboro High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,050 students in grades 9-12 with a 91% graduation rate; its graduates who took the ACT averaged 20 in 2025 (149 of 272 graduates tested; Missouri DESE)."
  },
  "Hillsdale (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Hillsdale's residents (2020 census blocks). Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Horine (MO)": {
    hs: "Herculaneum High School",
    district: "Dunklin R-V School District",
    feedsTo: "Herculaneum High School",
    usNewsNational: 10157, usNewsState: 168,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Dunklin R-V School District covers essentially all Horine's residents (2020 census blocks). Horine has no high school inside its boundary; the high school is in Herculaneum. Herculaneum High School (#168 in Missouri) enrolls 466 students in grades 9-12 with a 96% graduation rate; its graduates who took the ACT averaged 19.1 in 2025 (69 of 105 graduates tested; Missouri DESE)."
  },
  "Imperial (MO)": {
    hs: "Windsor High School",
    district: "Windsor C-1 School District",
    usNewsNational: 12306, usNewsState: 232,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Windsor C-1 School District covers about 99% of Imperial's residents (2020 census blocks). Windsor High School (#232 in Missouri) enrolls 887 students in grades 9-12 with a 95% graduation rate and a 12% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (180 of 204 graduates tested; Missouri DESE)."
  },
  "Innsbrook (MO)": {
    hs: "Wright City High School",
    district: "Wright City R-II of Warren County",
    feedsTo: "Wright City High School",
    usNewsNational: 8620, usNewsState: 134,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Wright City R-II of Warren County covers about 87% of Innsbrook's residents (2020 census blocks). The rest are mostly in Warren County R-III School District (13%). Innsbrook has no high school inside its boundary; the high school is in Wright City. Wright City High School (#134 in Missouri) enrolls 566 students in grades 9-12 with a 98% graduation rate and a 27% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.5 in 2025 (66 of 162 graduates tested; Missouri DESE)."
  },
  "Jennings (MO)": {
    hs: "Jennings High School",
    district: "Jennings School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Jennings School District covers about 99% of Jennings's residents (2020 census blocks). Jennings High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 666 students in grades 9-12 with an 88% graduation rate; its graduates who took the ACT averaged 15 in 2025 (58 of 164 graduates tested; Missouri DESE)."
  },
  "Josephville (MO)": {
    hs: ["Ft. Zumwalt South High School", "Ft. Zumwalt West High School", "Ft. Zumwalt North High School", "Ft. Zumwalt East High School", "Liberty High School", "Timberland High School", "North Point High School", "Emil E. Holt Sr. High School"],
    district: ["Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District"],
    feedsTo: "Ft. Zumwalt South High School / Ft. Zumwalt West High School / Ft. Zumwalt North High School / Ft. Zumwalt East High School / Liberty High School / Timberland High School / North Point High School / Emil E. Holt Sr. High School",
    usNewsNational: 1135, usNewsState: 12,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Josephville is split between school districts (2020 census-block shares): Fort Zumwalt R-II School District about 82%, Wentzville R-IV School District about 18%; students attend Ft. Zumwalt South High School, Ft. Zumwalt West High School, Ft. Zumwalt North High School, Ft. Zumwalt East High School, Liberty High School, Timberland High School, North Point High School or Emil E. Holt Sr. High School depending on address. Josephville has no high school inside its boundary; the high schools are in Lake St. Louis, O'fallon, St Peters, Wentzville. Ft. Zumwalt South High School (#12 in Missouri) enrolls 1,212 students in grades 9-12 with a 92% graduation rate and a 45% AP/IB-exam participation rate; its graduates who took the ACT averaged 24 in 2025 (182 of 279 graduates tested; Missouri DESE). Also: Ft. Zumwalt West High School (#15 in Missouri) enrolls 1,643 students in grades 9-12 with a 94% graduation rate and a 38% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (250 of 372 graduates tested; Missouri DESE)."
  },
  "Kirkwood (MO)": {
    hs: "Kirkwood Sr. High School",
    district: "Kirkwood R-VII School District",
    usNewsNational: 1774, usNewsState: 24,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Kirkwood R-VII School District covers essentially all Kirkwood's residents (2020 census blocks). Kirkwood Sr. High School (#24 in Missouri) enrolls 1,693 students in grades 9-12 with a 97% graduation rate and a 51% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (353 of 391 graduates tested; Missouri DESE)."
  },
  "LaBarque Creek (MO)": {
    hs: ["Lafayette Sr. High School", "Marquette Sr. High School", "Eureka Sr. High School", "Rockwood Summit Sr. High School", "Northwest High School"],
    district: ["Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Northwest R-I School District"],
    feedsTo: "Lafayette Sr. High School / Marquette Sr. High School / Eureka Sr. High School / Rockwood Summit Sr. High School / Northwest High School",
    usNewsNational: 677, usNewsState: 7,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "LaBarque Creek is split between school districts (2020 census-block shares): Rockwood R-VI School District about 71%, Northwest R-I School District about 29%; students attend Lafayette Sr. High School, Marquette Sr. High School, Eureka Sr. High School, Rockwood Summit Sr. High School or Northwest High School depending on address. LaBarque Creek has no high school inside its boundary; the high schools are in Cedar Hill, Chesterfield, Eureka, Fenton, Wildwood. Lafayette Sr. High School (#7 in Missouri) enrolls 1,669 students in grades 9-12 with a 97% graduation rate and a 60% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.6 in 2025 (385 of 416 graduates tested; Missouri DESE). Also: Marquette Sr. High School (#23 in Missouri) enrolls 2,095 students in grades 9-12 with a 95% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.4 in 2025 (453 of 505 graduates tested; Missouri DESE)."
  },
  "Ladue (MO)": {
    hs: "Ladue Horton Watkins High School",
    district: "Ladue School District",
    usNewsNational: 1156, usNewsState: 16,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ladue School District covers essentially all Ladue's residents (2020 census blocks). Ladue Horton Watkins High School (#16 in Missouri) enrolls 1,395 students in grades 9-12 with a 98% graduation rate and a 66% AP/IB-exam participation rate; its graduates who took the ACT averaged 26 in 2025 (246 of 340 graduates tested; Missouri DESE)."
  },
  "Lake St. Clair (MO)": {
    hs: "St. Clair High School (MO)",
    district: "St. Clair R-XIII School District",
    feedsTo: "St. Clair High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "St. Clair R-XIII School District covers essentially all Lake St. Clair's residents (2020 census blocks). Lake St. Clair has no high school inside its boundary; the high school is in St Clair. St. Clair High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 627 students in grades 9-12 with an 84% graduation rate; its graduates who took the ACT averaged 18 in 2025 (105 of 166 graduates tested; Missouri DESE)."
  },
  "Lake St. Louis (MO)": {
    hs: ["Liberty High School", "Timberland High School", "North Point High School", "Emil E. Holt Sr. High School"],
    district: ["Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District"],
    usNewsNational: 1537, usNewsState: 21,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Wentzville R-IV School District covers essentially all Lake St. Louis's residents (2020 census blocks). Wentzville R-IV School District runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Liberty High School (#21 in Missouri) enrolls 1,647 students in grades 9-12 with a 98% graduation rate and a 39% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.2 in 2025 (208 of 371 graduates tested; Missouri DESE). Also: Timberland High School (#36 in Missouri) enrolls 1,525 students in grades 9-12 with a 95% graduation rate and a 25% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.8 in 2025 (216 of 387 graduates tested; Missouri DESE)."
  },
  "Lakeshire (MO)": {
    hs: ["Lindbergh Sr. High School", "Affton High School"],
    district: ["Lindbergh School District", "Affton 101 School District"],
    feedsTo: "Lindbergh Sr. High School / Affton High School",
    usNewsNational: 1385, usNewsState: 18,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Lakeshire is split between school districts (2020 census-block shares): Lindbergh School District about 70%, Affton 101 School District about 30%; students attend Lindbergh Sr. High School or Affton High School depending on address. Lakeshire has no high school inside its boundary; the high schools are in St Louis, St. Louis. Lindbergh Sr. High School (#18 in Missouri) enrolls 2,304 students in grades 9-12 with a 96% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.5 in 2025 (346 of 594 graduates tested; Missouri DESE). Also: Affton High School (#128 in Missouri) enrolls 761 students in grades 9-12 with a 90% graduation rate and a 30% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.3 in 2025 (128 of 164 graduates tested; Missouri DESE)."
  },
  "Lemay (MO)": {
    hs: ["Hancock Sr. High School", "Oakville Sr. High School", "Mehlville High School", "Bayless Sr. High School"],
    district: ["Hancock Place School District", "Mehlville R-IX School District", "Mehlville R-IX School District", "Bayless School District"],
    usNewsNational: 3634, usNewsState: 47,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Lemay is split between school districts (2020 census-block shares): Hancock Place School District about 50%, Mehlville R-IX School District about 34%, Bayless School District about 17%; students attend Hancock Sr. High School, Oakville Sr. High School, Mehlville High School or Bayless Sr. High School depending on address. Hancock Sr. High School (#105 in Missouri) enrolls 369 students in grades 9-12 with a 100% graduation rate and a 19% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.2 in 2025 (19 of 84 graduates tested; Missouri DESE). Also: Oakville Sr. High School (#79 in Missouri) enrolls 1,847 students in grades 9-12 with a 98% graduation rate and a 19% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.2 in 2025 (349 of 451 graduates tested; Missouri DESE)."
  },
  "Manchester (MO)": {
    hs: ["Parkway West High School", "Central High School (MO)", "Parkway South High School", "North High School"],
    district: ["Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District"],
    usNewsNational: 438, usNewsState: 4,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Parkway C-2 School District covers about 91% of Manchester's residents (2020 census blocks). The rest are mostly in Valley Park School District (9%). Parkway C-2 School District runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Parkway West High School (#4 in Missouri) enrolls 1,417 students in grades 9-12 with a 98% graduation rate and a 57% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.7 in 2025 (298 of 342 graduates tested; Missouri DESE). Also: Central High School (#20 in Missouri) enrolls 1,281 students in grades 9-12 with a 97% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.6 in 2025 (284 of 322 graduates tested; Missouri DESE)."
  },
  "Maplewood (MO)": {
    hs: "Maplewood-Richmond Hgts. High School",
    district: "Maplewood-Richmond Heights School District",
    usNewsNational: 2467, usNewsState: 31,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Maplewood-Richmond Heights School District covers essentially all Maplewood's residents (2020 census blocks). Maplewood-Richmond Hgts. High School (#31 in Missouri) enrolls 439 students in grades 9-12 with a 97% graduation rate and a 30% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.6 in 2025 (90 of 98 graduates tested; Missouri DESE)."
  },
  "Marlborough (MO)": {
    hs: "Affton High School",
    district: "Affton 101 School District",
    feedsTo: "Affton High School",
    usNewsNational: 8355, usNewsState: 128,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Affton 101 School District covers essentially all Marlborough's residents (2020 census blocks). Marlborough has no high school inside its boundary; the high school is in St Louis. Affton High School (#128 in Missouri) enrolls 761 students in grades 9-12 with a 90% graduation rate and a 30% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.3 in 2025 (128 of 164 graduates tested; Missouri DESE)."
  },
  "Marthasville (MO)": {
    hs: "Washington High School (MO)",
    district: "Washington School District",
    feedsTo: "Washington High School",
    usNewsNational: 6887, usNewsState: 102,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Washington School District covers essentially all Marthasville's residents (2020 census blocks). Marthasville has no high school inside its boundary; the high school is in Washington. Washington High School (#102 in Missouri) enrolls 1,263 students in grades 9-12 with a 93% graduation rate and a 33% AP/IB-exam participation rate; its graduates who took the ACT averaged 22 in 2025 (137 of 300 graduates tested; Missouri DESE)."
  },
  "Maryland Heights (MO)": {
    hs: ["Pattonville Sr. High School", "Parkway West High School", "Central High School (MO)", "Parkway South High School", "North High School"],
    district: ["Pattonville R-III School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District"],
    usNewsNational: 438, usNewsState: 4,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Maryland Heights is split between school districts (2020 census-block shares): Pattonville R-III School District about 51%, Parkway C-2 School District about 49%; students attend Pattonville Sr. High School, Parkway West High School, Central High School, Parkway South High School or North High School depending on address. Pattonville Sr. High School (#56 in Missouri) enrolls 1,945 students in grades 9-12 with an 89% graduation rate and an 18% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.5 in 2025 (326 of 441 graduates tested; Missouri DESE). Also: Parkway West High School (#4 in Missouri) enrolls 1,417 students in grades 9-12 with a 98% graduation rate and a 57% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.7 in 2025 (298 of 342 graduates tested; Missouri DESE)."
  },
  "Mehlville (MO)": {
    hs: ["Oakville Sr. High School", "Mehlville High School"],
    district: ["Mehlville R-IX School District", "Mehlville R-IX School District"],
    usNewsNational: 5902, usNewsState: 79,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Mehlville R-IX School District covers essentially all Mehlville's residents (2020 census blocks). Mehlville R-IX School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Oakville Sr. High School (#79 in Missouri) enrolls 1,847 students in grades 9-12 with a 98% graduation rate and a 19% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.2 in 2025 (349 of 451 graduates tested; Missouri DESE). Also: Mehlville High School (#223 in Missouri) enrolls 1,388 students in grades 9-12 with an 89% graduation rate and a 9% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.5 in 2025 (250 of 391 graduates tested; Missouri DESE)."
  },
  "Moline Acres (MO)": {
    hs: "Riverview Gardens Sr. High School",
    district: "Riverview Gardens School District",
    feedsTo: "Riverview Gardens Sr. High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Riverview Gardens School District covers essentially all Moline Acres's residents (2020 census blocks). Moline Acres has no high school inside its boundary; the high school is in St Louis. Riverview Gardens Sr. High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,246 students in grades 9-12 with a 69% graduation rate; its graduates who took the ACT averaged 14.6 in 2025 (109 of 256 graduates tested; Missouri DESE)."
  },
  "Moscow Mills (MO)": {
    hs: "Troy Buchanan High School",
    district: "Troy R-III School District",
    feedsTo: "Troy Buchanan High School",
    usNewsNational: 8043, usNewsState: 122,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Troy R-III School District covers essentially all Moscow Mills's residents (2020 census blocks). Moscow Mills has no high school inside its boundary; the high school is in Troy. Troy Buchanan High School (#122 in Missouri) enrolls 2,148 students in grades 9-12 with a 96% graduation rate and a 23% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.9 in 2025 (202 of 496 graduates tested; Missouri DESE)."
  },
  "Murphy (MO)": {
    hs: "Northwest High School",
    district: "Northwest R-I School District",
    feedsTo: "Northwest High School",
    usNewsNational: 10100, usNewsState: 167,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Northwest R-I School District covers about 96% of Murphy's residents (2020 census blocks). The rest are mostly in Fox C-6 School District (4%). Murphy has no high school inside its boundary; the high school is in Cedar Hill. Northwest High School (#167 in Missouri) enrolls 1,788 students in grades 9-12 with a 91% graduation rate and a 12% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.5 in 2025 (262 of 415 graduates tested; Missouri DESE)."
  },
  "New Haven (MO)": {
    hs: "New Haven High School (MO)",
    district: "New Haven School District",
    usNewsNational: 7220, usNewsState: 110,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "New Haven School District covers essentially all New Haven's residents (2020 census blocks). New Haven High School (#110 in Missouri) enrolls 130 students in grades 9-12 with a 97% graduation rate; its graduates who took the ACT averaged 22.4 in 2025 (28 of 39 graduates tested; Missouri DESE)."
  },
  "New Melle (MO)": {
    hs: ["Francis Howell High School", "Francis Howell Central High School", "Francis Howell North High School"],
    district: ["Francis Howell R-III School District", "Francis Howell R-III School District", "Francis Howell R-III School District"],
    feedsTo: "Francis Howell High School / Francis Howell Central High School / Francis Howell North High School",
    usNewsNational: 1117, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Francis Howell R-III School District covers essentially all New Melle's residents (2020 census blocks). Francis Howell R-III School District runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). New Melle has no high school inside its boundary; the high schools are in St Charles. Francis Howell High School (#10 in Missouri) enrolls 1,843 students in grades 9-12 with a 96% graduation rate and a 41% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.4 in 2025 (409 of 455 graduates tested; Missouri DESE). Also: Francis Howell Central High School (#13 in Missouri) enrolls 1,750 students in grades 9-12 with a 96% graduation rate and a 34% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.9 in 2025 (362 of 431 graduates tested; Missouri DESE)."
  },
  "Normandy (MO)": {
    hs: ["Normandy High School", "McCluer North High School", "McCluer High School"],
    district: ["Normandy Schools Collaborative", "Ferguson-Florissant R-II School District", "Ferguson-Florissant R-II School District"],
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Normandy is split between school districts (2020 census-block shares): Normandy Schools Collaborative about 71%, Ferguson-Florissant R-II School District about 29%; students attend Normandy High School, McCluer North High School or McCluer High School depending on address. U.S. News also lists STEAM Academy at McCluer South-Berkeley High (#8 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. U.S. News also lists The Innovation School at Cv (in the unranked-bottom band, 256–356 in Missouri) under the district; it is a selective/choice program, not an attendance-zone high school. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE). Also: McCluer North High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,059 students in grades 9-12 with a 90% graduation rate and a 4% AP/IB-exam participation rate; its graduates who took the ACT averaged 15.6 in 2025 (150 of 289 graduates tested; Missouri DESE)."
  },
  "Northwoods (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Northwoods's residents (2020 census blocks). Northwoods has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Norwood Court (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Norwood Court's residents (2020 census blocks). Norwood Court has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "O'Fallon (MO)": {
    hs: ["Ft. Zumwalt South High School", "Ft. Zumwalt West High School", "Ft. Zumwalt North High School", "Ft. Zumwalt East High School", "Liberty High School", "Timberland High School", "North Point High School", "Emil E. Holt Sr. High School"],
    district: ["Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District"],
    usNewsNational: 1135, usNewsState: 12,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "O'Fallon is split between school districts (2020 census-block shares): Fort Zumwalt R-II School District about 68%, Wentzville R-IV School District about 24%; students attend Ft. Zumwalt South High School, Ft. Zumwalt West High School, Ft. Zumwalt North High School, Ft. Zumwalt East High School, Liberty High School, Timberland High School, North Point High School or Emil E. Holt Sr. High School depending on address. Smaller shares are in Francis Howell R-III School District (8%). Ft. Zumwalt South High School (#12 in Missouri) enrolls 1,212 students in grades 9-12 with a 92% graduation rate and a 45% AP/IB-exam participation rate; its graduates who took the ACT averaged 24 in 2025 (182 of 279 graduates tested; Missouri DESE). Also: Ft. Zumwalt West High School (#15 in Missouri) enrolls 1,643 students in grades 9-12 with a 94% graduation rate and a 38% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (250 of 372 graduates tested; Missouri DESE)."
  },
  "Oakland (MO)": {
    hs: "Kirkwood Sr. High School",
    district: "Kirkwood R-VII School District",
    feedsTo: "Kirkwood Sr. High School",
    usNewsNational: 1774, usNewsState: 24,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Kirkwood R-VII School District covers essentially all Oakland's residents (2020 census blocks). Oakland has no high school inside its boundary; the high school is in Kirkwood. Kirkwood Sr. High School (#24 in Missouri) enrolls 1,693 students in grades 9-12 with a 97% graduation rate and a 51% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (353 of 391 graduates tested; Missouri DESE)."
  },
  "Oakville (MO)": {
    hs: ["Oakville Sr. High School", "Mehlville High School"],
    district: ["Mehlville R-IX School District", "Mehlville R-IX School District"],
    usNewsNational: 5902, usNewsState: 79,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Mehlville R-IX School District covers essentially all Oakville's residents (2020 census blocks). Mehlville R-IX School District runs 2 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Oakville Sr. High School (#79 in Missouri) enrolls 1,847 students in grades 9-12 with a 98% graduation rate and a 19% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.2 in 2025 (349 of 451 graduates tested; Missouri DESE). Also: Mehlville High School (#223 in Missouri) enrolls 1,388 students in grades 9-12 with an 89% graduation rate and a 9% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.5 in 2025 (250 of 391 graduates tested; Missouri DESE)."
  },
  "Old Jamestown (MO)": {
    hs: ["Hazelwood West High School", "Hazelwood Central High School", "Hazelwood East High School"],
    district: ["Hazelwood School District", "Hazelwood School District", "Hazelwood School District"],
    usNewsNational: 8775, usNewsState: 136,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Hazelwood School District covers about 93% of Old Jamestown's residents (2020 census blocks). The rest are mostly in Ferguson-Florissant R-II School District (7%). Hazelwood School District runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Hazelwood West High School (#136 in Missouri) enrolls 1,994 students in grades 9-12 with an 82% graduation rate and a 24% AP/IB-exam participation rate; its graduates who took the ACT averaged 17.5 in 2025 (233 of 465 graduates tested; Missouri DESE). Also: Hazelwood Central High School (#220 in Missouri) enrolls 1,718 students in grades 9-12 with an 80% graduation rate and an 18% AP/IB-exam participation rate; its graduates who took the ACT averaged 16 in 2025 (191 of 437 graduates tested; Missouri DESE)."
  },
  "Olivette (MO)": {
    hs: "Ladue Horton Watkins High School",
    district: "Ladue School District",
    feedsTo: "Ladue Horton Watkins High School",
    usNewsNational: 1156, usNewsState: 16,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ladue School District covers essentially all Olivette's residents (2020 census blocks). Olivette has no high school inside its boundary; the high school is in St Louis. Ladue Horton Watkins High School (#16 in Missouri) enrolls 1,395 students in grades 9-12 with a 98% graduation rate and a 66% AP/IB-exam participation rate; its graduates who took the ACT averaged 26 in 2025 (246 of 340 graduates tested; Missouri DESE)."
  },
  "Olympian Village (MO)": {
    hs: "Desoto Sr. High School",
    district: "De Soto 73 School District",
    feedsTo: "Desoto Sr. High School",
    usNewsNational: 5509, usNewsState: 71,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "De Soto 73 School District covers essentially all Olympian Village's residents (2020 census blocks). Olympian Village has no high school inside its boundary; the high school is in Desoto. Desoto Sr. High School (#71 in Missouri) enrolls 862 students in grades 9-12 with a 93% graduation rate; its graduates who took the ACT averaged 18.8 in 2025 (151 of 214 graduates tested; Missouri DESE)."
  },
  "Overland (MO)": {
    hs: "Ritenour Sr. High School",
    district: "Ritenour School District",
    usNewsNational: 12997, usNewsState: 248,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ritenour School District covers essentially all Overland's residents (2020 census blocks). Ritenour Sr. High School (#248 in Missouri) enrolls 2,041 students in grades 9-12 with a 76% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (102 of 453 graduates tested; Missouri DESE)."
  },
  "Pacific (MO)": {
    hs: "Pacific High School",
    district: "Meramec Valley R-III School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Meramec Valley R-III School District covers essentially all Pacific's residents (2020 census blocks). Pacific High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 973 students in grades 9-12 with a 93% graduation rate and a 5% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.1 in 2025 (84 of 238 graduates tested; Missouri DESE)."
  },
  "Pagedale (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers about 98% of Pagedale's residents (2020 census blocks). Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Parkway (MO)": {
    hs: "St. Clair High School (MO)",
    district: "St. Clair R-XIII School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "St. Clair R-XIII School District covers essentially all Parkway's residents (2020 census blocks). St. Clair High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 627 students in grades 9-12 with an 84% graduation rate; its graduates who took the ACT averaged 18 in 2025 (105 of 166 graduates tested; Missouri DESE)."
  },
  "Pasadena Hills (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Pasadena Hills's residents (2020 census blocks). Pasadena Hills has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Pevely (MO)": {
    hs: "Herculaneum High School",
    district: "Dunklin R-V School District",
    feedsTo: "Herculaneum High School",
    usNewsNational: 10157, usNewsState: 168,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Dunklin R-V School District covers about 98% of Pevely's residents (2020 census blocks). Pevely has no high school inside its boundary; the high school is in Herculaneum. Herculaneum High School (#168 in Missouri) enrolls 466 students in grades 9-12 with a 96% graduation rate; its graduates who took the ACT averaged 19.1 in 2025 (69 of 105 graduates tested; Missouri DESE)."
  },
  "Pine Lawn (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Pine Lawn's residents (2020 census blocks). Pine Lawn has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Raintree Plantation (MO)": {
    hs: "Hillsboro High School",
    district: "Hillsboro R-III School District",
    feedsTo: "Hillsboro High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Hillsboro R-III School District covers essentially all Raintree Plantation's residents (2020 census blocks). Raintree Plantation has no high school inside its boundary; the high school is in Hillsboro. Hillsboro High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,050 students in grades 9-12 with a 91% graduation rate; its graduates who took the ACT averaged 20 in 2025 (149 of 272 graduates tested; Missouri DESE)."
  },
  "Richmond Heights (MO)": {
    hs: ["Maplewood-Richmond Hgts. High School", "Clayton High School"],
    district: ["Maplewood-Richmond Heights School District", "Clayton School District"],
    feedsTo: "Maplewood-Richmond Hgts. High School / Clayton High School",
    usNewsNational: 308, usNewsState: 3,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Richmond Heights is split between school districts (2020 census-block shares): Maplewood-Richmond Heights School District about 64%, Clayton School District about 19%; students attend Maplewood-Richmond Hgts. High School or Clayton High School depending on address. Smaller shares are in Ladue School District (9%) and Brentwood School District (8%). Richmond Heights has no high school inside its boundary; the high schools are in Clayton, Maplewood. Maplewood-Richmond Hgts. High School (#31 in Missouri) enrolls 439 students in grades 9-12 with a 97% graduation rate and a 30% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.6 in 2025 (90 of 98 graduates tested; Missouri DESE). Also: Clayton High School (#3 in Missouri) enrolls 788 students in grades 9-12 with a 97% graduation rate and a 73% AP/IB-exam participation rate; its graduates who took the ACT averaged 28.6 in 2025 (79 of 213 graduates tested; Missouri DESE)."
  },
  "Riverview (MO)": {
    hs: "Riverview Gardens Sr. High School",
    district: "Riverview Gardens School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Riverview Gardens School District covers essentially all Riverview's residents (2020 census blocks). Riverview Gardens Sr. High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 1,246 students in grades 9-12 with a 69% graduation rate; its graduates who took the ACT averaged 14.6 in 2025 (109 of 256 graduates tested; Missouri DESE)."
  },
  "Rock Hill (MO)": {
    hs: "Webster Groves High School",
    district: "Webster Groves School District",
    feedsTo: "Webster Groves High School",
    usNewsNational: 2222, usNewsState: 29,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Webster Groves School District covers essentially all Rock Hill's residents (2020 census blocks). Rock Hill has no high school inside its boundary; the high school is in St Louis. Webster Groves High School (#29 in Missouri) enrolls 1,253 students in grades 9-12 with a 95% graduation rate and a 31% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.6 in 2025 (301 of 323 graduates tested; Missouri DESE)."
  },
  "Sappington (MO)": {
    hs: "Lindbergh Sr. High School",
    district: "Lindbergh School District",
    usNewsNational: 1385, usNewsState: 18,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lindbergh School District covers essentially all Sappington's residents (2020 census blocks). Lindbergh Sr. High School (#18 in Missouri) enrolls 2,304 students in grades 9-12 with a 96% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.5 in 2025 (346 of 594 graduates tested; Missouri DESE)."
  },
  "Shrewsbury (MO)": {
    hs: ["Affton High School", "Webster Groves High School"],
    district: ["Affton 101 School District", "Webster Groves School District"],
    feedsTo: "Affton High School / Webster Groves High School",
    usNewsNational: 2222, usNewsState: 29,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Shrewsbury is split between school districts (2020 census-block shares): Affton 101 School District about 66%, Webster Groves School District about 34%; students attend Affton High School or Webster Groves High School depending on address. Shrewsbury has no high school inside its boundary; the high schools are in St Louis. Affton High School (#128 in Missouri) enrolls 761 students in grades 9-12 with a 90% graduation rate and a 30% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.3 in 2025 (128 of 164 graduates tested; Missouri DESE). Also: Webster Groves High School (#29 in Missouri) enrolls 1,253 students in grades 9-12 with a 95% graduation rate and a 31% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.6 in 2025 (301 of 323 graduates tested; Missouri DESE)."
  },
  "Spanish Lake (MO)": {
    hs: ["Hazelwood West High School", "Hazelwood Central High School", "Hazelwood East High School"],
    district: ["Hazelwood School District", "Hazelwood School District", "Hazelwood School District"],
    usNewsNational: 8775, usNewsState: 136,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Hazelwood School District covers essentially all Spanish Lake's residents (2020 census blocks). Hazelwood School District runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Hazelwood West High School (#136 in Missouri) enrolls 1,994 students in grades 9-12 with an 82% graduation rate and a 24% AP/IB-exam participation rate; its graduates who took the ACT averaged 17.5 in 2025 (233 of 465 graduates tested; Missouri DESE). Also: Hazelwood Central High School (#220 in Missouri) enrolls 1,718 students in grades 9-12 with an 80% graduation rate and an 18% AP/IB-exam participation rate; its graduates who took the ACT averaged 16 in 2025 (191 of 437 graduates tested; Missouri DESE)."
  },
  "St. Ann (MO)": {
    hs: ["Ritenour Sr. High School", "Pattonville Sr. High School"],
    district: ["Ritenour School District", "Pattonville R-III School District"],
    feedsTo: "Ritenour Sr. High School / Pattonville Sr. High School",
    usNewsNational: 4585, usNewsState: 56,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "St. Ann is split between school districts (2020 census-block shares): Ritenour School District about 58%, Pattonville R-III School District about 42%; students attend Ritenour Sr. High School or Pattonville Sr. High School depending on address. St. Ann has no high school inside its boundary; the high schools are in Maryland Heights, St Louis. Ritenour Sr. High School (#248 in Missouri) enrolls 2,041 students in grades 9-12 with a 76% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (102 of 453 graduates tested; Missouri DESE). Also: Pattonville Sr. High School (#56 in Missouri) enrolls 1,945 students in grades 9-12 with an 89% graduation rate and an 18% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.5 in 2025 (326 of 441 graduates tested; Missouri DESE)."
  },
  "St. Charles (MO)": {
    hs: ["St. Charles West High School", "St. Charles High School", "Francis Howell High School", "Francis Howell Central High School", "Francis Howell North High School", "Orchard Farm Sr. High School"],
    district: ["St. Charles R-VI School District", "St. Charles R-VI School District", "Francis Howell R-III School District", "Francis Howell R-III School District", "Francis Howell R-III School District", "Orchard Farm R-V School District"],
    usNewsNational: 1117, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "St. Charles is split between school districts (2020 census-block shares): St. Charles R-VI School District about 63%, Francis Howell R-III School District about 21%, Orchard Farm R-V School District about 16%; students attend St. Charles West High School, St. Charles High School, Francis Howell High School, Francis Howell Central High School, Francis Howell North High School or Orchard Farm Sr. High School depending on address. St. Charles West High School (#63 in Missouri) enrolls 645 students in grades 9-12 with a 91% graduation rate and a 28% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.5 in 2025 (62 of 161 graduates tested; Missouri DESE). Also: St. Charles High School (#113 in Missouri) enrolls 782 students in grades 9-12 with an 89% graduation rate and a 32% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.6 in 2025 (67 of 184 graduates tested; Missouri DESE)."
  },
  "St. Clair (MO)": {
    hs: "St. Clair High School (MO)",
    district: "St. Clair R-XIII School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "St. Clair R-XIII School District covers essentially all St. Clair's residents (2020 census blocks). St. Clair High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 627 students in grades 9-12 with an 84% graduation rate; its graduates who took the ACT averaged 18 in 2025 (105 of 166 graduates tested; Missouri DESE)."
  },
  "St. George (MO)": {
    hs: ["Affton High School", "Oakville Sr. High School", "Mehlville High School"],
    district: ["Affton 101 School District", "Mehlville R-IX School District", "Mehlville R-IX School District"],
    feedsTo: "Affton High School / Oakville Sr. High School / Mehlville High School",
    usNewsNational: 5902, usNewsState: 79,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "St. George is split between school districts (2020 census-block shares): Affton 101 School District about 46%, Mehlville R-IX School District about 40%; students attend Affton High School, Oakville Sr. High School or Mehlville High School depending on address. Smaller shares are in Bayless School District (14%). St. George has no high school inside its boundary; the high schools are in St Louis. Affton High School (#128 in Missouri) enrolls 761 students in grades 9-12 with a 90% graduation rate and a 30% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.3 in 2025 (128 of 164 graduates tested; Missouri DESE). Also: Oakville Sr. High School (#79 in Missouri) enrolls 1,847 students in grades 9-12 with a 98% graduation rate and a 19% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.2 in 2025 (349 of 451 graduates tested; Missouri DESE)."
  },
  "St. John (MO)": {
    hs: "Ritenour Sr. High School",
    district: "Ritenour School District",
    usNewsNational: 12997, usNewsState: 248,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ritenour School District covers about 93% of St. John's residents (2020 census blocks). The rest are mostly in Normandy Schools Collaborative (7%). Ritenour Sr. High School (#248 in Missouri) enrolls 2,041 students in grades 9-12 with a 76% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (102 of 453 graduates tested; Missouri DESE)."
  },
  "St. Paul (MO)": {
    hs: ["Ft. Zumwalt South High School", "Ft. Zumwalt West High School", "Ft. Zumwalt North High School", "Ft. Zumwalt East High School"],
    district: ["Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District"],
    feedsTo: "Ft. Zumwalt South High School / Ft. Zumwalt West High School / Ft. Zumwalt North High School / Ft. Zumwalt East High School",
    usNewsNational: 1135, usNewsState: 12,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Fort Zumwalt R-II School District covers essentially all St. Paul's residents (2020 census blocks). Fort Zumwalt R-II School District runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). St. Paul has no high school inside its boundary; the high schools are in O'fallon, St Peters. Ft. Zumwalt South High School (#12 in Missouri) enrolls 1,212 students in grades 9-12 with a 92% graduation rate and a 45% AP/IB-exam participation rate; its graduates who took the ACT averaged 24 in 2025 (182 of 279 graduates tested; Missouri DESE). Also: Ft. Zumwalt West High School (#15 in Missouri) enrolls 1,643 students in grades 9-12 with a 94% graduation rate and a 38% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (250 of 372 graduates tested; Missouri DESE)."
  },
  "St. Peters (MO)": {
    hs: ["Ft. Zumwalt South High School", "Ft. Zumwalt West High School", "Ft. Zumwalt North High School", "Ft. Zumwalt East High School", "Francis Howell High School", "Francis Howell Central High School", "Francis Howell North High School"],
    district: ["Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Fort Zumwalt R-II School District", "Francis Howell R-III School District", "Francis Howell R-III School District", "Francis Howell R-III School District"],
    usNewsNational: 1117, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "St. Peters is split between school districts (2020 census-block shares): Fort Zumwalt R-II School District about 49%, Francis Howell R-III School District about 47%; students attend Ft. Zumwalt South High School, Ft. Zumwalt West High School, Ft. Zumwalt North High School, Ft. Zumwalt East High School, Francis Howell High School, Francis Howell Central High School or Francis Howell North High School depending on address. Smaller shares are in St. Charles R-VI School District (4%). Ft. Zumwalt South High School (#12 in Missouri) enrolls 1,212 students in grades 9-12 with a 92% graduation rate and a 45% AP/IB-exam participation rate; its graduates who took the ACT averaged 24 in 2025 (182 of 279 graduates tested; Missouri DESE). Also: Ft. Zumwalt West High School (#15 in Missouri) enrolls 1,643 students in grades 9-12 with a 94% graduation rate and a 38% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (250 of 372 graduates tested; Missouri DESE)."
  },
  "Sullivan (MO)": {
    hs: "Sullivan Sr. High School",
    district: "Sullivan C-2 School District",
    usNewsNational: 11528, usNewsState: 206,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Sullivan C-2 School District covers essentially all Sullivan's residents (2020 census blocks). Sullivan Sr. High School (#206 in Missouri) enrolls 668 students in grades 9-12 with a 91% graduation rate and a 17% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.8 in 2025 (151 of 167 graduates tested; Missouri DESE)."
  },
  "Sunset Hills (MO)": {
    hs: "Lindbergh Sr. High School",
    district: "Lindbergh School District",
    feedsTo: "Lindbergh Sr. High School",
    usNewsNational: 1385, usNewsState: 18,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lindbergh School District covers essentially all Sunset Hills's residents (2020 census blocks). Sunset Hills has no high school inside its boundary; the high school is in St. Louis. Lindbergh Sr. High School (#18 in Missouri) enrolls 2,304 students in grades 9-12 with a 96% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.5 in 2025 (346 of 594 graduates tested; Missouri DESE)."
  },
  "Sycamore Hills (MO)": {
    hs: "Ritenour Sr. High School",
    district: "Ritenour School District",
    feedsTo: "Ritenour Sr. High School",
    usNewsNational: 12997, usNewsState: 248,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ritenour School District covers essentially all Sycamore Hills's residents (2020 census blocks). Sycamore Hills has no high school inside its boundary; the high school is in St Louis. Ritenour Sr. High School (#248 in Missouri) enrolls 2,041 students in grades 9-12 with a 76% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (102 of 453 graduates tested; Missouri DESE)."
  },
  "Town and Country (MO)": {
    hs: ["Parkway West High School", "Central High School (MO)", "Parkway South High School", "North High School"],
    district: ["Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District"],
    usNewsNational: 438, usNewsState: 4,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Parkway C-2 School District covers about 98% of Town and Country's residents (2020 census blocks). Parkway C-2 School District runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Parkway West High School (#4 in Missouri) enrolls 1,417 students in grades 9-12 with a 98% graduation rate and a 57% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.7 in 2025 (298 of 342 graduates tested; Missouri DESE). Also: Central High School (#20 in Missouri) enrolls 1,281 students in grades 9-12 with a 97% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.6 in 2025 (284 of 322 graduates tested; Missouri DESE)."
  },
  "Troy (MO)": {
    hs: "Troy Buchanan High School",
    district: "Troy R-III School District",
    usNewsNational: 8043, usNewsState: 122,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Troy R-III School District covers essentially all Troy's residents (2020 census blocks). Troy Buchanan High School (#122 in Missouri) enrolls 2,148 students in grades 9-12 with a 96% graduation rate and a 23% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.9 in 2025 (202 of 496 graduates tested; Missouri DESE)."
  },
  "Truesdale (MO)": {
    hs: "Warrenton High School",
    district: "Warren County R-III School District",
    feedsTo: "Warrenton High School",
    usNewsNational: 11978, usNewsState: 218,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Warren County R-III School District covers essentially all Truesdale's residents (2020 census blocks). Truesdale has no high school inside its boundary; the high school is in Warrenton. Warrenton High School (#218 in Missouri) enrolls 974 students in grades 9-12 with a 91% graduation rate and a 13% AP/IB-exam participation rate; its graduates who took the ACT averaged 21.3 in 2025 (75 of 260 graduates tested; Missouri DESE)."
  },
  "Twin Oaks (MO)": {
    hs: "Valley Park Sr. High School",
    district: "Valley Park School District",
    feedsTo: "Valley Park Sr. High School",
    usNewsNational: 3677, usNewsState: 48,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Valley Park School District covers essentially all Twin Oaks's residents (2020 census blocks). Twin Oaks has no high school inside its boundary; the high school is in Valley Park. Valley Park Sr. High School (#48 in Missouri) enrolls 230 students in grades 9-12 with a 95% graduation rate and a 22% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.7 in 2025 (49 of 57 graduates tested; Missouri DESE)."
  },
  "Union (MO)": {
    hs: "Union High School",
    district: "Union R-XI School District",
    usNewsNational: 10938, usNewsState: 196,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Union R-XI School District covers essentially all Union's residents (2020 census blocks). Union High School (#196 in Missouri) enrolls 956 students in grades 9-12 with an 85% graduation rate and a 6% AP/IB-exam participation rate; its graduates who took the ACT averaged 19 in 2025 (143 of 236 graduates tested; Missouri DESE)."
  },
  "University City (MO)": {
    hs: "University City Sr. High School",
    district: "University City School District",
    usNewsNational: 8521, usNewsState: 132,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "University City School District covers essentially all University City's residents (2020 census blocks). University City Sr. High School (#132 in Missouri) enrolls 874 students in grades 9-12 with a 92% graduation rate and a 12% AP/IB-exam participation rate; its graduates who took the ACT averaged 15.9 in 2025 (119 of 223 graduates tested; Missouri DESE)."
  },
  "Valley Park (MO)": {
    hs: ["Valley Park Sr. High School", "Parkway West High School", "Central High School (MO)", "Parkway South High School", "North High School"],
    district: ["Valley Park School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District"],
    usNewsNational: 438, usNewsState: 4,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Valley Park is split between school districts (2020 census-block shares): Valley Park School District about 81%, Parkway C-2 School District about 18%; students attend Valley Park Sr. High School, Parkway West High School, Central High School, Parkway South High School or North High School depending on address. Valley Park Sr. High School (#48 in Missouri) enrolls 230 students in grades 9-12 with a 95% graduation rate and a 22% AP/IB-exam participation rate; its graduates who took the ACT averaged 19.7 in 2025 (49 of 57 graduates tested; Missouri DESE). Also: Parkway West High School (#4 in Missouri) enrolls 1,417 students in grades 9-12 with a 98% graduation rate and a 57% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.7 in 2025 (298 of 342 graduates tested; Missouri DESE)."
  },
  "Velda City (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Velda City's residents (2020 census blocks). Velda City has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Velda Village Hills (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    feedsTo: "Normandy High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Velda Village Hills's residents (2020 census blocks). Velda Village Hills has no high school inside its boundary; the high school is in St Louis. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Villa Ridge (MO)": {
    hs: "Pacific High School",
    district: "Meramec Valley R-III School District",
    feedsTo: "Pacific High School",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Meramec Valley R-III School District covers about 98% of Villa Ridge's residents (2020 census blocks). Villa Ridge has no high school inside its boundary; the high school is in Pacific. Pacific High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 973 students in grades 9-12 with a 93% graduation rate and a 5% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.1 in 2025 (84 of 238 graduates tested; Missouri DESE)."
  },
  "Vinita Park (MO)": {
    hs: ["Normandy High School", "University City Sr. High School"],
    district: ["Normandy Schools Collaborative", "University City School District"],
    feedsTo: "Normandy High School / University City Sr. High School",
    usNewsNational: 8521, usNewsState: 132,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Vinita Park is split between school districts (2020 census-block shares): Normandy Schools Collaborative about 68%, University City School District about 28%; students attend Normandy High School or University City Sr. High School depending on address. Smaller shares are in Ritenour School District (4%). Vinita Park has no high school inside its boundary; the high schools are in St Louis, University City. Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE). Also: University City Sr. High School (#132 in Missouri) enrolls 874 students in grades 9-12 with a 92% graduation rate and a 12% AP/IB-exam participation rate; its graduates who took the ACT averaged 15.9 in 2025 (119 of 223 graduates tested; Missouri DESE)."
  },
  "Warrenton (MO)": {
    hs: "Warrenton High School",
    district: "Warren County R-III School District",
    usNewsNational: 11978, usNewsState: 218,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Warren County R-III School District covers essentially all Warrenton's residents (2020 census blocks). Warrenton High School (#218 in Missouri) enrolls 974 students in grades 9-12 with a 91% graduation rate and a 13% AP/IB-exam participation rate; its graduates who took the ACT averaged 21.3 in 2025 (75 of 260 graduates tested; Missouri DESE)."
  },
  "Warson Woods (MO)": {
    hs: ["Webster Groves High School", "Kirkwood Sr. High School"],
    district: ["Webster Groves School District", "Kirkwood R-VII School District"],
    feedsTo: "Webster Groves High School / Kirkwood Sr. High School",
    usNewsNational: 1774, usNewsState: 24,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Warson Woods is split between school districts (2020 census-block shares): Webster Groves School District about 76%, Kirkwood R-VII School District about 24%; students attend Webster Groves High School or Kirkwood Sr. High School depending on address. Warson Woods has no high school inside its boundary; the high schools are in Kirkwood, St Louis. Webster Groves High School (#29 in Missouri) enrolls 1,253 students in grades 9-12 with a 95% graduation rate and a 31% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.6 in 2025 (301 of 323 graduates tested; Missouri DESE). Also: Kirkwood Sr. High School (#24 in Missouri) enrolls 1,693 students in grades 9-12 with a 97% graduation rate and a 51% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.4 in 2025 (353 of 391 graduates tested; Missouri DESE)."
  },
  "Washington (MO)": {
    hs: "Washington High School (MO)",
    district: "Washington School District",
    usNewsNational: 6887, usNewsState: 102,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Washington School District covers essentially all Washington's residents (2020 census blocks). Washington High School (#102 in Missouri) enrolls 1,263 students in grades 9-12 with a 93% graduation rate and a 33% AP/IB-exam participation rate; its graduates who took the ACT averaged 22 in 2025 (137 of 300 graduates tested; Missouri DESE)."
  },
  "Webster Groves (MO)": {
    hs: "Webster Groves High School",
    district: "Webster Groves School District",
    usNewsNational: 2222, usNewsState: 29,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Webster Groves School District covers essentially all Webster Groves's residents (2020 census blocks). Webster Groves High School (#29 in Missouri) enrolls 1,253 students in grades 9-12 with a 95% graduation rate and a 31% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.6 in 2025 (301 of 323 graduates tested; Missouri DESE)."
  },
  "Weldon Spring (MO)": {
    hs: ["Francis Howell High School", "Francis Howell Central High School", "Francis Howell North High School"],
    district: ["Francis Howell R-III School District", "Francis Howell R-III School District", "Francis Howell R-III School District"],
    feedsTo: "Francis Howell High School / Francis Howell Central High School / Francis Howell North High School",
    usNewsNational: 1117, usNewsState: 10,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Francis Howell R-III School District covers essentially all Weldon Spring's residents (2020 census blocks). Francis Howell R-III School District runs 3 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Weldon Spring has no high school inside its boundary; the high schools are in St Charles. Francis Howell High School (#10 in Missouri) enrolls 1,843 students in grades 9-12 with a 96% graduation rate and a 41% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.4 in 2025 (409 of 455 graduates tested; Missouri DESE). Also: Francis Howell Central High School (#13 in Missouri) enrolls 1,750 students in grades 9-12 with a 96% graduation rate and a 34% AP/IB-exam participation rate; its graduates who took the ACT averaged 20.9 in 2025 (362 of 431 graduates tested; Missouri DESE)."
  },
  "Wellston (MO)": {
    hs: "Normandy High School",
    district: "Normandy Schools Collaborative",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Normandy Schools Collaborative covers essentially all Wellston's residents (2020 census blocks). Normandy High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 688 students in grades 9-12 with a 63% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 14.8 in 2025 (90 of 160 graduates tested; Missouri DESE)."
  },
  "Wentzville (MO)": {
    hs: ["Liberty High School", "Timberland High School", "North Point High School", "Emil E. Holt Sr. High School"],
    district: ["Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District", "Wentzville R-IV School District"],
    usNewsNational: 1537, usNewsState: 21,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Wentzville R-IV School District covers about 96% of Wentzville's residents (2020 census blocks). The rest are mostly in Fort Zumwalt R-II School District (4%). Wentzville R-IV School District runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Liberty High School (#21 in Missouri) enrolls 1,647 students in grades 9-12 with a 98% graduation rate and a 39% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.2 in 2025 (208 of 371 graduates tested; Missouri DESE). Also: Timberland High School (#36 in Missouri) enrolls 1,525 students in grades 9-12 with a 95% graduation rate and a 25% AP/IB-exam participation rate; its graduates who took the ACT averaged 22.8 in 2025 (216 of 387 graduates tested; Missouri DESE)."
  },
  "Wildwood (MO)": {
    hs: ["Lafayette Sr. High School", "Marquette Sr. High School", "Eureka Sr. High School", "Rockwood Summit Sr. High School"],
    district: ["Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District"],
    usNewsNational: 677, usNewsState: 7,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rockwood R-VI School District covers essentially all Wildwood's residents (2020 census blocks). Rockwood R-VI School District runs 4 comprehensive high schools and which one a student attends depends on address (attendance zones not obtained). Lafayette Sr. High School (#7 in Missouri) enrolls 1,669 students in grades 9-12 with a 97% graduation rate and a 60% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.6 in 2025 (385 of 416 graduates tested; Missouri DESE). Also: Marquette Sr. High School (#23 in Missouri) enrolls 2,095 students in grades 9-12 with a 95% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 24.4 in 2025 (453 of 505 graduates tested; Missouri DESE)."
  },
  "Winchester (MO)": {
    hs: ["Parkway West High School", "Central High School (MO)", "Parkway South High School", "North High School", "Lafayette Sr. High School", "Marquette Sr. High School", "Eureka Sr. High School", "Rockwood Summit Sr. High School"],
    district: ["Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Parkway C-2 School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District", "Rockwood R-VI School District"],
    feedsTo: "Parkway West High School / Central High School / Parkway South High School / North High School / Lafayette Sr. High School / Marquette Sr. High School / Eureka Sr. High School / Rockwood Summit Sr. High School",
    usNewsNational: 438, usNewsState: 4,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Winchester is split between school districts (2020 census-block shares): Parkway C-2 School District about 78%, Rockwood R-VI School District about 22%; students attend Parkway West High School, Central High School, Parkway South High School, North High School, Lafayette Sr. High School, Marquette Sr. High School, Eureka Sr. High School or Rockwood Summit Sr. High School depending on address. Winchester has no high school inside its boundary; the high schools are in Ballwin, Chesterfield, Eureka, Fenton, Manchester, St Louis, Wildwood. Parkway West High School (#4 in Missouri) enrolls 1,417 students in grades 9-12 with a 98% graduation rate and a 57% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.7 in 2025 (298 of 342 graduates tested; Missouri DESE). Also: Central High School (#20 in Missouri) enrolls 1,281 students in grades 9-12 with a 97% graduation rate and a 47% AP/IB-exam participation rate; its graduates who took the ACT averaged 23.6 in 2025 (284 of 322 graduates tested; Missouri DESE)."
  },
  "Winfield (MO)": {
    hs: "Winfield High School",
    district: "Winfield R-IV School District",
    usNewsNational: 15702, usNewsState: 306,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Winfield R-IV School District covers essentially all Winfield's residents (2020 census blocks). Winfield High School (in the unranked-bottom band, 256–356 in Missouri) enrolls 517 students in grades 9-12 with a 91% graduation rate; its graduates who took the ACT averaged 19.3 in 2025 (47 of 119 graduates tested; Missouri DESE)."
  },
  "Woodson Terrace (MO)": {
    hs: "Ritenour Sr. High School",
    district: "Ritenour School District",
    feedsTo: "Ritenour Sr. High School",
    usNewsNational: 12997, usNewsState: 248,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ritenour School District covers essentially all Woodson Terrace's residents (2020 census blocks). Woodson Terrace has no high school inside its boundary; the high school is in St Louis. Ritenour Sr. High School (#248 in Missouri) enrolls 2,041 students in grades 9-12 with a 76% graduation rate and a 21% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.4 in 2025 (102 of 453 graduates tested; Missouri DESE)."
  },
  "Wright City (MO)": {
    hs: "Wright City High School",
    district: "Wright City R-II of Warren County",
    usNewsNational: 8620, usNewsState: 134,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Wright City R-II of Warren County covers essentially all Wright City's residents (2020 census blocks). Wright City High School (#134 in Missouri) enrolls 566 students in grades 9-12 with a 98% graduation rate and a 27% AP/IB-exam participation rate; its graduates who took the ACT averaged 18.5 in 2025 (66 of 162 graduates tested; Missouri DESE)."
  },
  // === ST. LOUIS METRO SCHOOL_DATA END ===

  // === ROCKFORD METRO SCHOOL_DATA START ===
  "Belvidere": {
    hs: ["Belvidere High School", "Belvidere North High School"],
    district: ["Belvidere Community Unit School District 100", "Belvidere Community Unit School District 100"],
    usNewsNational: 9765, usNewsState: 334,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Belvidere Community Unit School District 100 covers essentially all of Belvidere's residents (2020 census blocks). Belvidere Community Unit School District 100 splits students across 2 comprehensive high schools by address (attendance zones not obtained). Belvidere High School (#334 in Illinois) enrolls 1,167 students in grades 9-12 with a 80% graduation rate; its average SAT total was 852 in 2024 (ISBE, Illinois's last state SAT). Belvidere North High School (#243 in Illinois) enrolls 1,354 students in grades 9-12 with a 88% graduation rate; its average SAT total was 894 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Candlewick Lake": {
    hs: ["Belvidere High School", "Belvidere North High School", "North Boone High School"],
    district: ["Belvidere Community Unit School District 100", "Belvidere Community Unit School District 100", "North Boone Community Unit School District 200"],
    feedsTo: "Belvidere High School / Belvidere North High School / North Boone High School",
    usNewsNational: 9765, usNewsState: 334,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Belvidere Community Unit School District 100 covers about 70% of Candlewick Lake's residents (2020 census blocks), and North Boone Community Unit School District 200 (about 30%). Which high school a student attends depends on address (attendance zones not obtained) between Belvidere Community Unit School District 100 and North Boone Community Unit School District 200. Belvidere High School (#334 in Illinois) enrolls 1,167 students in grades 9-12 with a 80% graduation rate; its average SAT total was 852 in 2024 (ISBE, Illinois's last state SAT). Belvidere North High School (#243 in Illinois) enrolls 1,354 students in grades 9-12 with a 88% graduation rate; its average SAT total was 894 in 2024 (ISBE, Illinois's last state SAT). North Boone High School (#402 in Illinois) enrolls 496 students in grades 9-12 with a 83% graduation rate; its average SAT total was 916 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Capron": {
    hs: "North Boone High School",
    district: "North Boone Community Unit School District 200",
    feedsTo: "North Boone High School",
    usNewsNational: 11863, usNewsState: 402,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "North Boone Community Unit School District 200 covers essentially all of Capron's residents (2020 census blocks). North Boone High School (#402 in Illinois) enrolls 496 students in grades 9-12 with a 83% graduation rate; its average SAT total was 916 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Cherry Valley": {
    hs: ["Auburn High School", "Rockford East High School", "Guilford High School", "Jefferson High School"],
    district: ["Rockford School District 205", "Rockford School District 205", "Rockford School District 205", "Rockford School District 205"],
    feedsTo: "Auburn High School / Rockford East High School / Guilford High School / Jefferson High School",
    usNewsNational: 4485, usNewsState: 176,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rockford School District 205 covers about 88% of Cherry Valley's residents (2020 census blocks). The rest are mostly in Belvidere Community Unit School District 100 (12%). Rockford School District 205 splits students across 4 comprehensive high schools by address (attendance zones not obtained). Auburn High School (#176 in Illinois) enrolls 1,957 students in grades 9-12 with a 69% graduation rate; its average SAT total was 890 in 2024 (ISBE, Illinois's last state SAT). Rockford East High School (in the 469-675 band in Illinois) enrolls 1,719 students in grades 9-12; its average SAT total was 812 in 2024 (ISBE, Illinois's last state SAT). Guilford High School (#237 in Illinois) enrolls 2,216 students in grades 9-12 with a 76% graduation rate; its average SAT total was 864 in 2024 (ISBE, Illinois's last state SAT). Jefferson High School (#427 in Illinois) enrolls 2,173 students in grades 9-12; its average SAT total was 776 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Durand": {
    hs: "Durand High School",
    district: "Durand Community Unit School District 322",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Durand Community Unit School District 322 covers essentially all of Durand's residents (2020 census blocks). Durand High School (in the 469-675 band in Illinois) enrolls 170 students in grades 9-12 with a 86% graduation rate; its average SAT total was 858 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Lake Summerset": {
    hs: "Durand High School",
    district: "Durand Community Unit School District 322",
    feedsTo: "Durand High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Durand Community Unit School District 322 covers essentially all of Lake Summerset's residents (2020 census blocks). Durand High School (in the 469-675 band in Illinois) enrolls 170 students in grades 9-12 with a 86% graduation rate; its average SAT total was 858 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Loves Park": {
    hs: ["Harlem High School", "Auburn High School", "Rockford East High School", "Guilford High School", "Jefferson High School"],
    district: ["Harlem Unit School District 122", "Rockford School District 205", "Rockford School District 205", "Rockford School District 205", "Rockford School District 205"],
    feedsTo: "Harlem High School / Auburn High School / Rockford East High School / Guilford High School / Jefferson High School",
    usNewsNational: 4245, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Harlem Unit School District 122 covers about 75% of Loves Park's residents (2020 census blocks), and Rockford School District 205 (about 18%). The rest are mostly in Belvidere Community Unit School District 100 (7%). Which high school a student attends depends on address (attendance zones not obtained) between Harlem Unit School District 122 and Rockford School District 205. Harlem High School (#166 in Illinois) enrolls 1,884 students in grades 9-12 with a 85% graduation rate; its average SAT total was 898 in 2024 (ISBE, Illinois's last state SAT). Auburn High School (#176 in Illinois) enrolls 1,957 students in grades 9-12 with a 69% graduation rate; its average SAT total was 890 in 2024 (ISBE, Illinois's last state SAT). Rockford East High School (in the 469-675 band in Illinois) enrolls 1,719 students in grades 9-12; its average SAT total was 812 in 2024 (ISBE, Illinois's last state SAT). Guilford High School (#237 in Illinois) enrolls 2,216 students in grades 9-12 with a 76% graduation rate; its average SAT total was 864 in 2024 (ISBE, Illinois's last state SAT). Jefferson High School (#427 in Illinois) enrolls 2,173 students in grades 9-12; its average SAT total was 776 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Machesney Park": {
    hs: "Harlem High School",
    district: "Harlem Unit School District 122",
    usNewsNational: 4245, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Harlem Unit School District 122 covers about 88% of Machesney Park's residents (2020 census blocks). The rest are mostly in Rockford School District 205 (12%). Harlem High School (#166 in Illinois) enrolls 1,884 students in grades 9-12 with a 85% graduation rate; its average SAT total was 898 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "New Milford": {
    hs: ["Auburn High School", "Rockford East High School", "Guilford High School", "Jefferson High School"],
    district: ["Rockford School District 205", "Rockford School District 205", "Rockford School District 205", "Rockford School District 205"],
    feedsTo: "Auburn High School / Rockford East High School / Guilford High School / Jefferson High School",
    usNewsNational: 4485, usNewsState: 176,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rockford School District 205 covers essentially all of New Milford's residents (2020 census blocks). Rockford School District 205 splits students across 4 comprehensive high schools by address (attendance zones not obtained). Auburn High School (#176 in Illinois) enrolls 1,957 students in grades 9-12 with a 69% graduation rate; its average SAT total was 890 in 2024 (ISBE, Illinois's last state SAT). Rockford East High School (in the 469-675 band in Illinois) enrolls 1,719 students in grades 9-12; its average SAT total was 812 in 2024 (ISBE, Illinois's last state SAT). Guilford High School (#237 in Illinois) enrolls 2,216 students in grades 9-12 with a 76% graduation rate; its average SAT total was 864 in 2024 (ISBE, Illinois's last state SAT). Jefferson High School (#427 in Illinois) enrolls 2,173 students in grades 9-12; its average SAT total was 776 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Pecatonica": {
    hs: "Pecatonica High School",
    district: "Pecatonica Community Unit School District 321",
    usNewsNational: 4509, usNewsState: 178,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pecatonica Community Unit School District 321 covers essentially all of Pecatonica's residents (2020 census blocks). Pecatonica High School (#178 in Illinois) enrolls 313 students in grades 9-12 with a 85% graduation rate; its average SAT total was 998 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Poplar Grove": {
    hs: ["North Boone High School", "Belvidere High School", "Belvidere North High School"],
    district: ["North Boone Community Unit School District 200", "Belvidere Community Unit School District 100", "Belvidere Community Unit School District 100"],
    usNewsNational: 11863, usNewsState: 402,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "North Boone Community Unit School District 200 covers about 65% of Poplar Grove's residents (2020 census blocks), and Belvidere Community Unit School District 100 (about 35%). Which high school a student attends depends on address (attendance zones not obtained) between North Boone Community Unit School District 200 and Belvidere Community Unit School District 100. North Boone High School (#402 in Illinois) enrolls 496 students in grades 9-12 with a 83% graduation rate; its average SAT total was 916 in 2024 (ISBE, Illinois's last state SAT). Belvidere High School (#334 in Illinois) enrolls 1,167 students in grades 9-12 with a 80% graduation rate; its average SAT total was 852 in 2024 (ISBE, Illinois's last state SAT). Belvidere North High School (#243 in Illinois) enrolls 1,354 students in grades 9-12 with a 88% graduation rate; its average SAT total was 894 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Rockford": {
    hs: ["Auburn High School", "Rockford East High School", "Guilford High School", "Jefferson High School"],
    district: ["Rockford School District 205", "Rockford School District 205", "Rockford School District 205", "Rockford School District 205"],
    usNewsNational: 4485, usNewsState: 176,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Rockford School District 205 covers essentially all of Rockford's residents (2020 census blocks). Rockford School District 205 splits students across 4 comprehensive high schools by address (attendance zones not obtained). Auburn High School (#176 in Illinois) enrolls 1,957 students in grades 9-12 with a 69% graduation rate; its average SAT total was 890 in 2024 (ISBE, Illinois's last state SAT). Rockford East High School (in the 469-675 band in Illinois) enrolls 1,719 students in grades 9-12; its average SAT total was 812 in 2024 (ISBE, Illinois's last state SAT). Guilford High School (#237 in Illinois) enrolls 2,216 students in grades 9-12 with a 76% graduation rate; its average SAT total was 864 in 2024 (ISBE, Illinois's last state SAT). Jefferson High School (#427 in Illinois) enrolls 2,173 students in grades 9-12; its average SAT total was 776 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Rockton": {
    hs: "Hononegah High School",
    district: "Hononegah Community High School District 207",
    usNewsNational: 1185, usNewsState: 56,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Hononegah Community High School District 207 covers essentially all of Rockton's residents (2020 census blocks). Hononegah High School (#56 in Illinois) enrolls 1,814 students in grades 9-12 with a 93% graduation rate; its average SAT total was 1063 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Roscoe": {
    hs: ["Hononegah High School", "Harlem High School"],
    district: ["Hononegah Community High School District 207", "Harlem Unit School District 122"],
    feedsTo: "Hononegah High School / Harlem High School",
    usNewsNational: 1185, usNewsState: 56,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Hononegah Community High School District 207 covers about 71% of Roscoe's residents (2020 census blocks), and Harlem Unit School District 122 (about 27%). Which high school a student attends depends on address (attendance zones not obtained) between Hononegah Community High School District 207 and Harlem Unit School District 122. Hononegah High School (#56 in Illinois) enrolls 1,814 students in grades 9-12 with a 93% graduation rate; its average SAT total was 1063 in 2024 (ISBE, Illinois's last state SAT). Harlem High School (#166 in Illinois) enrolls 1,884 students in grades 9-12 with a 85% graduation rate; its average SAT total was 898 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "South Beloit": {
    hs: ["South Beloit Senior High School", "Hononegah High School"],
    district: ["County of Winnebago School District 320", "Hononegah Community High School District 207"],
    usNewsNational: 6243, usNewsState: 236,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "County of Winnebago School District 320 covers about 63% of South Beloit's residents (2020 census blocks), and Hononegah Community High School District 207 (about 37%). Which high school a student attends depends on address (attendance zones not obtained) between County of Winnebago School District 320 and Hononegah Community High School District 207. South Beloit Senior High School (#236 in Illinois) enrolls 254 students in grades 9-12 with a 94% graduation rate; its average SAT total was 946 in 2024 (ISBE, Illinois's last state SAT). Hononegah High School (#56 in Illinois) enrolls 1,814 students in grades 9-12 with a 93% graduation rate; its average SAT total was 1063 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Timberlane": {
    hs: ["Belvidere High School", "Belvidere North High School"],
    district: ["Belvidere Community Unit School District 100", "Belvidere Community Unit School District 100"],
    feedsTo: "Belvidere High School / Belvidere North High School",
    usNewsNational: 9765, usNewsState: 334,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Belvidere Community Unit School District 100 covers about 98% of Timberlane's residents (2020 census blocks). Belvidere Community Unit School District 100 splits students across 2 comprehensive high schools by address (attendance zones not obtained). Belvidere High School (#334 in Illinois) enrolls 1,167 students in grades 9-12 with a 80% graduation rate; its average SAT total was 852 in 2024 (ISBE, Illinois's last state SAT). Belvidere North High School (#243 in Illinois) enrolls 1,354 students in grades 9-12 with a 88% graduation rate; its average SAT total was 894 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Westlake Village": {
    hs: "Pecatonica High School",
    district: "Pecatonica Community Unit School District 321",
    feedsTo: "Pecatonica High School",
    usNewsNational: 4509, usNewsState: 178,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pecatonica Community Unit School District 321 covers essentially all of Westlake Village's residents (2020 census blocks). Pecatonica High School (#178 in Illinois) enrolls 313 students in grades 9-12 with a 85% graduation rate; its average SAT total was 998 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Winnebago": {
    hs: "Winnebago High School",
    district: "Winnebago Community Unit School District 323",
    usNewsNational: 10234, usNewsState: 358,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Winnebago Community Unit School District 323 covers essentially all of Winnebago's residents (2020 census blocks). Winnebago High School (#358 in Illinois) enrolls 422 students in grades 9-12 with a 85% graduation rate; its average SAT total was 971 in 2024 (ISBE, Illinois's last state SAT)."
  },
  // === ROCKFORD METRO SCHOOL_DATA END ===

  // === PEORIA METRO SCHOOL_DATA START ===
  "Bartonville": {
    hs: "Limestone Community High School",
    district: "Limestone Community High School District 310",
    feedsTo: "Limestone Community High School",
    usNewsNational: 9274, usNewsState: 317,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Limestone Community High School District 310 covers essentially all of Bartonville's residents (2020 census blocks). Limestone Community High School (#317 in Illinois) enrolls 898 students in grades 9-12; its average SAT total was 902 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Bellevue": {
    hs: "Limestone Community High School",
    district: "Limestone Community High School District 310",
    feedsTo: "Limestone Community High School",
    usNewsNational: 9274, usNewsState: 317,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Limestone Community High School District 310 covers essentially all of Bellevue's residents (2020 census blocks). Limestone Community High School (#317 in Illinois) enrolls 898 students in grades 9-12; its average SAT total was 902 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Bradford": {
    hs: "Stark County High School",
    district: "Stark County Community Unit School District 100 (by tuition choice; see note)",
    feedsTo: "Stark County High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    noSingleSchool: true,
    note: "Bradford Community Unit School District 1 deactivated its own high school (Bradford High School) on July 1, 2001, and has operated no high school since; families choose where to tuition their students, most commonly Stark County High School in Toulon (#469-675 in Illinois; this build's in-metro choice, used as this record's `hs`) or Bureau Valley High School in Manlius (Bureau County, outside the Peoria MSA -- not tracked in this build's school data). No TIGERweb attendance-zone layer exists to assign Bradford's population between the two by address, so this is disclosed as an open choice, not modeled as a percentage split. Stark County High School (#469-675 in Illinois) enrolls 230 students in grades 9-12 with a 94% graduation rate; its average SAT total was 932 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Brimfield": {
    hs: "Brimfield High School",
    district: "Brimfield Community Unit School District 309",
    usNewsNational: 9769, usNewsState: 336,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Brimfield Community Unit School District 309 covers essentially all of Brimfield's residents (2020 census blocks). Brimfield High School (#336 in Illinois) enrolls 189 students in grades 9-12 with a 97% graduation rate; its average SAT total was 1029 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Chillicothe": {
    hs: "Il Valley Central High School",
    district: "Illinois Valley Central Unit School District 321",
    usNewsNational: 5120, usNewsState: 200,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Illinois Valley Central Unit School District 321 covers essentially all of Chillicothe's residents (2020 census blocks). Il Valley Central High School (#200 in Illinois) enrolls 650 students in grades 9-12 with a 88% graduation rate; its average SAT total was 945 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Creve Coeur": {
    hs: "East Peoria High School",
    district: "East Peoria Community High School District 309",
    feedsTo: "East Peoria High School",
    usNewsNational: 9571, usNewsState: 328,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "East Peoria Community High School District 309 covers about 90% of Creve Coeur's residents (2020 census blocks). The rest are mostly in Pekin Community High School District 303 (10%). East Peoria High School (#328 in Illinois) enrolls 823 students in grades 9-12 with a 78% graduation rate; its average SAT total was 882 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Deer Creek": {
    hs: "Dee-Mack High School",
    district: "Deer Creek-Mackinaw Community Unit School District 701",
    feedsTo: "Dee-Mack High School",
    usNewsNational: 4988, usNewsState: 195,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Deer Creek-Mackinaw Community Unit School District 701 covers essentially all of Deer Creek's residents (2020 census blocks). Dee-Mack High School (#195 in Illinois) enrolls 293 students in grades 9-12 with a 94% graduation rate; its average SAT total was 973 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Delavan": {
    hs: "Delavan High School",
    district: "Delavan Community Unit School District 703",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Delavan Community Unit School District 703 covers essentially all of Delavan's residents (2020 census blocks). Delavan High School (in the 469-675 band in Illinois) enrolls 129 students in grades 9-12 with a 82% graduation rate; its average SAT total was 916 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Dunlap (IL)": {
    hs: "Dunlap High School",
    district: "Dunlap Community Unit School District 323",
    usNewsNational: 985, usNewsState: 48,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Dunlap Community Unit School District 323 covers essentially all of Dunlap's residents (2020 census blocks). Dunlap High School (#48 in Illinois) enrolls 1,420 students in grades 9-12 with a 93% graduation rate; its average SAT total was 1096 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "East Peoria": {
    hs: ["East Peoria High School", "Washington Comm High School"],
    district: ["East Peoria Community High School District 309", "Washington Community High School District 308"],
    usNewsNational: 9571, usNewsState: 328,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "East Peoria Community High School District 309 covers about 82% of East Peoria's residents (2020 census blocks), and Washington Community High School District 308 (about 17%). Which high school a student attends depends on address (attendance zones not obtained) between East Peoria Community High School District 309 and Washington Community High School District 308. East Peoria High School (#328 in Illinois) enrolls 823 students in grades 9-12 with a 78% graduation rate; its average SAT total was 882 in 2024 (ISBE, Illinois's last state SAT). Washington Comm High School (#80 in Illinois) enrolls 1,399 students in grades 9-12 with a 90% graduation rate; its average SAT total was 1046 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "El Paso": {
    hs: "El Paso-Gridley High School",
    district: "El Paso-Gridley Community Unit School District 11",
    usNewsNational: 2726, usNewsState: 111,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "El Paso-Gridley Community Unit School District 11 covers essentially all of El Paso's residents (2020 census blocks). El Paso-Gridley High School (#111 in Illinois) enrolls 364 students in grades 9-12 with a 88% graduation rate; its average SAT total was 1015 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Elmwood": {
    hs: "Elmwood High School",
    district: "Elmwood Community Unit School District 322",
    usNewsNational: 13111, usNewsState: 450,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Elmwood Community Unit School District 322 covers essentially all of Elmwood's residents (2020 census blocks). Elmwood High School (#450 in Illinois) enrolls 208 students in grades 9-12 with a 98% graduation rate; its average SAT total was 954 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Eureka": {
    hs: "Eureka High School",
    district: "Eureka Community Unit School District 140",
    usNewsNational: 6724, usNewsState: 252,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Eureka Community Unit School District 140 covers essentially all of Eureka's residents (2020 census blocks). Eureka High School (#252 in Illinois) enrolls 513 students in grades 9-12 with a 93% graduation rate; its average SAT total was 1067 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Germantown Hills": {
    hs: "Metamora High School",
    district: "Metamora Township High School District 122",
    feedsTo: "Metamora High School",
    usNewsNational: 2432, usNewsState: 99,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Metamora Township High School District 122 covers essentially all of Germantown Hills's residents (2020 census blocks). Metamora High School (#99 in Illinois) enrolls 896 students in grades 9-12 with a 95% graduation rate; its average SAT total was 1018 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Glasford": {
    hs: "Illini Bluffs High School",
    district: "Illini Bluffs Community Unit School District 327",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Illini Bluffs Community Unit School District 327 covers essentially all of Glasford's residents (2020 census blocks). Illini Bluffs High School (in the 469-675 band in Illinois) enrolls 249 students in grades 9-12 with a 84% graduation rate; its average SAT total was 970 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Goodfield": {
    hs: "Eureka High School",
    district: "Eureka Community Unit School District 140",
    feedsTo: "Eureka High School",
    usNewsNational: 6724, usNewsState: 252,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Eureka Community Unit School District 140 covers essentially all of Goodfield's residents (2020 census blocks). Eureka High School (#252 in Illinois) enrolls 513 students in grades 9-12 with a 93% graduation rate; its average SAT total was 1067 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Green Valley": {
    hs: "Midwest Central High School",
    district: "Midwest Central Community Unit School District 191",
    feedsTo: "Midwest Central High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Midwest Central Community Unit School District 191 covers essentially all of Green Valley's residents (2020 census blocks). Midwest Central High School (in the 469-675 band in Illinois) enrolls 235 students in grades 9-12 with a 79% graduation rate; its average SAT total was 892 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Hanna City": {
    hs: "Farmington Central High School",
    district: "Farmington Central Community Unit School District 265",
    feedsTo: "Farmington Central High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Farmington Central Community Unit School District 265 covers essentially all of Hanna City's residents (2020 census blocks). Farmington Central High School (in the 469-675 band in Illinois) enrolls 383 students in grades 9-12 with a 72% graduation rate; its average SAT total was 893 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Henry": {
    hs: "Henry-Senachwine High School",
    district: "Henry-Senachwine Community Unit School District 5",
    usNewsNational: 12816, usNewsState: 439,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Henry-Senachwine Community Unit School District 5 covers essentially all of Henry's residents (2020 census blocks). Henry-Senachwine High School (#439 in Illinois) enrolls 147 students in grades 9-12 with a 80% graduation rate; its average SAT total was 860 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Heritage Lake": {
    hs: "Dee-Mack High School",
    district: "Deer Creek-Mackinaw Community Unit School District 701",
    feedsTo: "Dee-Mack High School",
    usNewsNational: 4988, usNewsState: 195,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Deer Creek-Mackinaw Community Unit School District 701 covers essentially all of Heritage Lake's residents (2020 census blocks). Dee-Mack High School (#195 in Illinois) enrolls 293 students in grades 9-12 with a 94% graduation rate; its average SAT total was 973 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Hopedale": {
    hs: "Olympia High School",
    district: "Olympia Community Unit School District 16",
    feedsTo: "Olympia High School",
    usNewsNational: 8184, usNewsState: 291,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Olympia Community Unit School District 16 covers essentially all of Hopedale's residents (2020 census blocks). Olympia High School (#291 in Illinois) enrolls 495 students in grades 9-12 with a 92% graduation rate; its average SAT total was 935 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Lacon": {
    hs: "Midland High School",
    district: "Midland Community Unit School District 7",
    feedsTo: "Midland High School",
    usNewsNational: 11486, usNewsState: 390,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Midland Community Unit School District 7 covers essentially all of Lacon's residents (2020 census blocks). Midland High School (#390 in Illinois) enrolls 194 students in grades 9-12 with a 82% graduation rate; its average SAT total was 903 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Lake Camelot": {
    hs: "Illini Bluffs High School",
    district: "Illini Bluffs Community Unit School District 327",
    feedsTo: "Illini Bluffs High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Illini Bluffs Community Unit School District 327 covers essentially all of Lake Camelot's residents (2020 census blocks). Illini Bluffs High School (in the 469-675 band in Illinois) enrolls 249 students in grades 9-12 with a 84% graduation rate; its average SAT total was 970 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Mackinaw": {
    hs: "Dee-Mack High School",
    district: "Deer Creek-Mackinaw Community Unit School District 701",
    usNewsNational: 4988, usNewsState: 195,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Deer Creek-Mackinaw Community Unit School District 701 covers essentially all of Mackinaw's residents (2020 census blocks). Dee-Mack High School (#195 in Illinois) enrolls 293 students in grades 9-12 with a 94% graduation rate; its average SAT total was 973 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Marquette Heights": {
    hs: "Pekin Community High School",
    district: "Pekin Community High School District 303",
    feedsTo: "Pekin Community High School",
    usNewsNational: 5604, usNewsState: 220,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pekin Community High School District 303 covers essentially all of Marquette Heights's residents (2020 census blocks). Pekin Community High School (#220 in Illinois) enrolls 1,712 students in grades 9-12 with a 95% graduation rate; its average SAT total was 903 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Metamora": {
    hs: "Metamora High School",
    district: "Metamora Township High School District 122",
    usNewsNational: 2432, usNewsState: 99,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Metamora Township High School District 122 covers essentially all of Metamora's residents (2020 census blocks). Metamora High School (#99 in Illinois) enrolls 896 students in grades 9-12 with a 95% graduation rate; its average SAT total was 1018 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Minier": {
    hs: "Olympia High School",
    district: "Olympia Community Unit School District 16",
    feedsTo: "Olympia High School",
    usNewsNational: 8184, usNewsState: 291,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Olympia Community Unit School District 16 covers essentially all of Minier's residents (2020 census blocks). Olympia High School (#291 in Illinois) enrolls 495 students in grades 9-12 with a 92% graduation rate; its average SAT total was 935 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Minonk": {
    hs: "Fieldcrest High School",
    district: "Fieldcrest Community Unit School District 6",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Fieldcrest Community Unit School District 6 covers essentially all of Minonk's residents (2020 census blocks). Fieldcrest High School (in the 469-675 band in Illinois) enrolls 254 students in grades 9-12 with a 89% graduation rate; its average SAT total was 881 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Morton": {
    hs: "Morton High School",
    district: "Morton Community Unit School District 709",
    usNewsNational: 1743, usNewsState: 76,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Morton Community Unit School District 709 covers about 98% of Morton's residents (2020 census blocks). Morton High School (#76 in Illinois) enrolls 1,061 students in grades 9-12 with a 94% graduation rate; its average SAT total was 1054 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "North Pekin": {
    hs: "Pekin Community High School",
    district: "Pekin Community High School District 303",
    feedsTo: "Pekin Community High School",
    usNewsNational: 5604, usNewsState: 220,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pekin Community High School District 303 covers essentially all of North Pekin's residents (2020 census blocks). Pekin Community High School (#220 in Illinois) enrolls 1,712 students in grades 9-12 with a 95% graduation rate; its average SAT total was 903 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Pekin": {
    hs: "Pekin Community High School",
    district: "Pekin Community High School District 303",
    usNewsNational: 5604, usNewsState: 220,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pekin Community High School District 303 covers essentially all of Pekin's residents (2020 census blocks). Pekin Community High School (#220 in Illinois) enrolls 1,712 students in grades 9-12 with a 95% graduation rate; its average SAT total was 903 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Peoria": {
    hs: ["Peoria High School", "Manual High School", "Richwoods High School", "Dunlap High School"],
    district: ["Peoria Public School District 150", "Peoria Public School District 150", "Peoria Public School District 150", "Dunlap Community Unit School District 323"],
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Peoria Public School District 150 covers about 79% of Peoria's residents (2020 census blocks), and Dunlap Community Unit School District 323 (about 19%). Which high school a student attends depends on address (attendance zones not obtained) between Peoria Public School District 150 and Dunlap Community Unit School District 323. Peoria High School (in the 469-675 band in Illinois) enrolls 1,541 students in grades 9-12 with a 76% graduation rate; its average SAT total was 752 in 2024 (ISBE, Illinois's last state SAT). Manual High School (in the 469-675 band in Illinois) enrolls 731 students in grades 9-12 with a 72% graduation rate; its average SAT total was 727 in 2024 (ISBE, Illinois's last state SAT). Richwoods High School (#173 in Illinois) enrolls 1,685 students in grades 9-12 with a 88% graduation rate; its average SAT total was 914 in 2024 (ISBE, Illinois's last state SAT). Dunlap High School (#48 in Illinois) enrolls 1,420 students in grades 9-12 with a 93% graduation rate; its average SAT total was 1096 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Peoria Heights": {
    hs: "Peoria Heights High School",
    district: "Peoria Heights Community Unit School District 325",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Peoria Heights Community Unit School District 325 covers essentially all of Peoria Heights's residents (2020 census blocks). Peoria Heights High School (in the 469-675 band in Illinois) enrolls 215 students in grades 9-12 with a 82% graduation rate; its average SAT total was 859 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Princeville": {
    hs: "Princeville High School",
    district: "Princeville Community Unit School District 326",
    usNewsNational: 8632, usNewsState: 302,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Princeville Community Unit School District 326 covers essentially all of Princeville's residents (2020 census blocks). Princeville High School (#302 in Illinois) enrolls 192 students in grades 9-12 with a 98% graduation rate; its average SAT total was 1009 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Roanoke": {
    hs: "Roanoke-Benson High School",
    district: "Roanoke-Benson Community Unit School District 60",
    usNewsNational: 12765, usNewsState: 434,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Roanoke-Benson Community Unit School District 60 covers essentially all of Roanoke's residents (2020 census blocks). Roanoke-Benson High School (#434 in Illinois) enrolls 146 students in grades 9-12 with a 92% graduation rate; its average SAT total was 978 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Rome": {
    hs: "Il Valley Central High School",
    district: "Illinois Valley Central Unit School District 321",
    feedsTo: "Il Valley Central High School",
    usNewsNational: 5120, usNewsState: 200,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Illinois Valley Central Unit School District 321 covers essentially all of Rome's residents (2020 census blocks). Il Valley Central High School (#200 in Illinois) enrolls 650 students in grades 9-12 with a 88% graduation rate; its average SAT total was 945 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "South Pekin": {
    hs: "Pekin Community High School",
    district: "Pekin Community High School District 303",
    feedsTo: "Pekin Community High School",
    usNewsNational: 5604, usNewsState: 220,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pekin Community High School District 303 covers essentially all of South Pekin's residents (2020 census blocks). Pekin Community High School (#220 in Illinois) enrolls 1,712 students in grades 9-12 with a 95% graduation rate; its average SAT total was 903 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Toluca": {
    hs: "Fieldcrest High School",
    district: "Fieldcrest Community Unit School District 6",
    feedsTo: "Fieldcrest High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Fieldcrest Community Unit School District 6 covers essentially all of Toluca's residents (2020 census blocks). Fieldcrest High School (in the 469-675 band in Illinois) enrolls 254 students in grades 9-12 with a 89% graduation rate; its average SAT total was 881 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Toulon": {
    hs: "Stark County High School",
    district: "Stark County Community Unit School District 100",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Stark County Community Unit School District 100 covers essentially all of Toulon's residents (2020 census blocks). Stark County High School (in the 469-675 band in Illinois) enrolls 230 students in grades 9-12 with a 94% graduation rate; its average SAT total was 932 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Tremont": {
    hs: "Tremont High School",
    district: "Tremont Community Unit School District 702",
    usNewsNational: 5287, usNewsState: 208,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tremont Community Unit School District 702 covers essentially all of Tremont's residents (2020 census blocks). Tremont High School (#208 in Illinois) enrolls 288 students in grades 9-12 with a 93% graduation rate; its average SAT total was 1023 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Washburn": {
    hs: "Lowpoint-Washburn Junior Senior High School",
    district: "Lowpoint-Washburn Community Unit School District 21",
    usNewsNational: 11526, usNewsState: 393,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lowpoint-Washburn Community Unit School District 21 covers essentially all of Washburn's residents (2020 census blocks). Lowpoint-Washburn Junior Senior High School (#393 in Illinois) enrolls 73 students in grades 9-12 with a 83% graduation rate; its average SAT total was 942 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Washington": {
    hs: "Washington Comm High School",
    district: "Washington Community High School District 308",
    usNewsNational: 1838, usNewsState: 80,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Washington Community High School District 308 covers essentially all of Washington's residents (2020 census blocks). Washington Comm High School (#80 in Illinois) enrolls 1,399 students in grades 9-12 with a 90% graduation rate; its average SAT total was 1046 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Wenona": {
    hs: "Fieldcrest High School",
    district: "Fieldcrest Community Unit School District 6",
    feedsTo: "Fieldcrest High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Fieldcrest Community Unit School District 6 covers essentially all of Wenona's residents (2020 census blocks). Fieldcrest High School (in the 469-675 band in Illinois) enrolls 254 students in grades 9-12 with a 89% graduation rate; its average SAT total was 881 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "West Peoria": {
    hs: ["Peoria High School", "Manual High School", "Richwoods High School"],
    district: ["Peoria Public School District 150", "Peoria Public School District 150", "Peoria Public School District 150"],
    feedsTo: "Peoria High School / Manual High School / Richwoods High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Peoria Public School District 150 covers essentially all of West Peoria's residents (2020 census blocks). Peoria Public School District 150 splits students across 3 comprehensive high schools by address (attendance zones not obtained). Peoria High School (in the 469-675 band in Illinois) enrolls 1,541 students in grades 9-12 with a 76% graduation rate; its average SAT total was 752 in 2024 (ISBE, Illinois's last state SAT). Manual High School (in the 469-675 band in Illinois) enrolls 731 students in grades 9-12 with a 72% graduation rate; its average SAT total was 727 in 2024 (ISBE, Illinois's last state SAT). Richwoods High School (#173 in Illinois) enrolls 1,685 students in grades 9-12 with a 88% graduation rate; its average SAT total was 914 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Wyoming": {
    hs: "Stark County High School",
    district: "Stark County Community Unit School District 100",
    feedsTo: "Stark County High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Stark County Community Unit School District 100 covers essentially all of Wyoming's residents (2020 census blocks). Stark County High School (in the 469-675 band in Illinois) enrolls 230 students in grades 9-12 with a 94% graduation rate; its average SAT total was 932 in 2024 (ISBE, Illinois's last state SAT)."
  },
  // === PEORIA METRO SCHOOL_DATA END ===

  // === CHAMPAIGN METRO SCHOOL_DATA START ===
  "Atwood": {
    hs: "Arthur-Lovington High School",
    district: "Arthur Community Unit School District 305",
    feedsTo: "Arthur-Lovington High School",
    usNewsNational: 12070, usNewsState: 409,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Arthur Community Unit School District 305 covers essentially all of Atwood's residents (2020 census blocks). Arthur-Lovington High School (#409 in Illinois) enrolls 310 students in grades 9-12 with a 88% graduation rate; its average SAT total was 938 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Bement": {
    hs: "Bement High School",
    district: "Bement Community Unit School District 5",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Bement Community Unit School District 5 covers essentially all of Bement's residents (2020 census blocks). Bement High School (in the 469-675 band in Illinois) enrolls 85 students in grades 9-12 with a 92% graduation rate; its average SAT total was 910 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Cerro Gordo": {
    hs: "Cerro Gordo High School",
    district: "Cerro Gordo Community Unit School District 100",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Cerro Gordo Community Unit School District 100 covers essentially all of Cerro Gordo's residents (2020 census blocks). Cerro Gordo High School (in the 469-675 band in Illinois) enrolls 131 students in grades 9-12 with a 92% graduation rate; its average SAT total was 898 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Champaign": {
    hs: ["Central High School (Champaign)", "Centennial High School"],
    district: ["Champaign Community Unified School District 4", "Champaign Community Unified School District 4"],
    usNewsNational: 2861, usNewsState: 118,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Champaign Community Unit School District 4 covers about 97% of Champaign's residents (2020 census blocks). Champaign Community Unit School District 4 splits students across 2 comprehensive high schools by address (attendance zones not obtained). Central High School (Champaign) (#118 in Illinois) enrolls 1,666 students in grades 9-12; its average SAT total was 962 in 2024 (ISBE, Illinois's last state SAT). Centennial High School (#149 in Illinois) enrolls 1,476 students in grades 9-12 with a 85% graduation rate; its average SAT total was 915 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Fisher": {
    hs: "Fisher Jr/Sr High School",
    district: "Fisher Community Unit School District 1",
    usNewsNational: 7402, usNewsState: 269,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Fisher Community Unit School District 1 covers essentially all of Fisher's residents (2020 census blocks). Fisher Jr/Sr High School (#269 in Illinois) enrolls 197 students in grades 9-12 with a 98% graduation rate; its average SAT total was 988 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Gibson City": {
    hs: "GCMS High School",
    district: "Gibson City-Melvin-Sibley Community Unit School District 5",
    usNewsNational: 3143, usNewsState: 126,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Gibson City-Melvin-Sibley Community Unit School District 5 covers essentially all of Gibson City's residents (2020 census blocks). GCMS High School (#126 in Illinois) enrolls 275 students in grades 9-12 with a 94% graduation rate; its average SAT total was 1007 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Gifford": {
    hs: "Rantoul Twp High School",
    district: "Rantoul Township High School District 193",
    feedsTo: "Rantoul Twp High School",
    usNewsNational: 8682, usNewsState: 303,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Rantoul Township High School District 193 covers essentially all of Gifford's residents (2020 census blocks). Rantoul Twp High School (#303 in Illinois) enrolls 901 students in grades 9-12 with a 88% graduation rate; its average SAT total was 796 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Hammond (IL)": {
    hs: "Arthur-Lovington High School",
    district: "Arthur Community Unit School District 305",
    feedsTo: "Arthur-Lovington High School",
    usNewsNational: 12070, usNewsState: 409,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Arthur Community Unit School District 305 covers essentially all of Hammond's residents (2020 census blocks). Arthur-Lovington High School (#409 in Illinois) enrolls 310 students in grades 9-12 with a 88% graduation rate; its average SAT total was 938 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Homer": {
    hs: "Heritage High School",
    district: "Heritage Community Unit School District 8",
    feedsTo: "Heritage High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Heritage Community Unit School District 8 covers essentially all of Homer's residents (2020 census blocks). Heritage High School (in the 469-675 band in Illinois) enrolls 121 students in grades 9-12 with a 79% graduation rate; its average SAT total was 869 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Lake of the Woods": {
    hs: "Mahomet-Seymour High School",
    district: "Mahomet-Seymour Community Unit School District 3",
    feedsTo: "Mahomet-Seymour High School",
    usNewsNational: 1343, usNewsState: 63,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Mahomet-Seymour Community Unit School District 3 covers essentially all of Lake of the Woods's residents (2020 census blocks). Mahomet-Seymour High School (#63 in Illinois) enrolls 1,050 students in grades 9-12 with a 92% graduation rate; its average SAT total was 1079 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Mahomet": {
    hs: "Mahomet-Seymour High School",
    district: "Mahomet-Seymour Community Unit School District 3",
    usNewsNational: 1343, usNewsState: 63,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Mahomet-Seymour Community Unit School District 3 covers essentially all of Mahomet's residents (2020 census blocks). Mahomet-Seymour High School (#63 in Illinois) enrolls 1,050 students in grades 9-12 with a 92% graduation rate; its average SAT total was 1079 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Mansfield": {
    hs: "Blue Ridge High School",
    district: "Blue Ridge Community Unit School District 18",
    feedsTo: "Blue Ridge High School",
    usNewsNational: 12051, usNewsState: 407,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Blue Ridge Community Unit School District 18 covers essentially all of Mansfield's residents (2020 census blocks). Blue Ridge High School (#407 in Illinois) enrolls 155 students in grades 9-12 with a 88% graduation rate; its average SAT total was 901 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Monticello": {
    hs: "Monticello High School",
    district: "Monticello Community Unit School District 25",
    usNewsNational: 3440, usNewsState: 139,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Monticello Community Unit School District 25 covers essentially all of Monticello's residents (2020 census blocks). Monticello High School (#139 in Illinois) enrolls 489 students in grades 9-12 with a 98% graduation rate; its average SAT total was 970 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Ogden": {
    hs: "St Joseph-Ogden High School",
    district: "St. Joseph-Ogden Community High School District 305",
    feedsTo: "St Joseph-Ogden High School",
    usNewsNational: 4937, usNewsState: 194,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "St. Joseph-Ogden Community High School District 305 covers essentially all of Ogden's residents (2020 census blocks). St Joseph-Ogden High School (#194 in Illinois) enrolls 457 students in grades 9-12 with a 95% graduation rate; its average SAT total was 1011 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Paxton": {
    hs: "Paxton-Buckley-Loda High School",
    district: "Paxton-Buckley-Loda Community Unit School District 10",
    usNewsNational: 4131, usNewsState: 161,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Paxton-Buckley-Loda Community Unit School District 10 covers essentially all of Paxton's residents (2020 census blocks). Paxton-Buckley-Loda High School (#161 in Illinois) enrolls 378 students in grades 9-12 with a 85% graduation rate; its average SAT total was 992 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Pesotum": {
    hs: "Unity High School",
    district: "Tolono Community Unit School District 7",
    feedsTo: "Unity High School",
    usNewsNational: 4074, usNewsState: 159,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tolono Community Unit School District 7 covers essentially all of Pesotum's residents (2020 census blocks). Unity High School (#159 in Illinois) enrolls 480 students in grades 9-12 with a 86% graduation rate; its average SAT total was 980 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Philo": {
    hs: "Unity High School",
    district: "Tolono Community Unit School District 7",
    feedsTo: "Unity High School",
    usNewsNational: 4074, usNewsState: 159,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tolono Community Unit School District 7 covers essentially all of Philo's residents (2020 census blocks). Unity High School (#159 in Illinois) enrolls 480 students in grades 9-12 with a 86% graduation rate; its average SAT total was 980 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Piper City": {
    hs: "Tri-Point High School",
    district: "Tri-Point Community Unit School District 6-J",
    feedsTo: "Tri-Point High School",
    usNewsNational: 2831, usNewsState: 116,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tri-Point Community Unit School District 6-J covers essentially all of Piper City's residents (2020 census blocks). Tri-Point High School (#116 in Illinois) enrolls 98 students in grades 9-12 with a 89% graduation rate; its average SAT total was 926 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Rantoul": {
    hs: "Rantoul Twp High School",
    district: "Rantoul Township High School District 193",
    usNewsNational: 8682, usNewsState: 303,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Rantoul Township High School District 193 covers essentially all of Rantoul's residents (2020 census blocks). Rantoul Twp High School (#303 in Illinois) enrolls 901 students in grades 9-12 with a 88% graduation rate; its average SAT total was 796 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Savoy": {
    hs: ["Central High School (Champaign)", "Centennial High School"],
    district: ["Champaign Community Unified School District 4", "Champaign Community Unified School District 4"],
    feedsTo: "Central High School (Champaign) / Centennial High School",
    usNewsNational: 2861, usNewsState: 118,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Champaign Community Unit School District 4 covers essentially all of Savoy's residents (2020 census blocks). Champaign Community Unit School District 4 splits students across 2 comprehensive high schools by address (attendance zones not obtained). Central High School (Champaign) (#118 in Illinois) enrolls 1,666 students in grades 9-12; its average SAT total was 962 in 2024 (ISBE, Illinois's last state SAT). Centennial High School (#149 in Illinois) enrolls 1,476 students in grades 9-12 with a 85% graduation rate; its average SAT total was 915 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Sidney": {
    hs: "Unity High School",
    district: "Tolono Community Unit School District 7",
    feedsTo: "Unity High School",
    usNewsNational: 4074, usNewsState: 159,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tolono Community Unit School District 7 covers essentially all of Sidney's residents (2020 census blocks). Unity High School (#159 in Illinois) enrolls 480 students in grades 9-12 with a 86% graduation rate; its average SAT total was 980 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "St. Joseph": {
    hs: "St Joseph-Ogden High School",
    district: "St. Joseph-Ogden Community High School District 305",
    feedsTo: "St Joseph-Ogden High School",
    usNewsNational: 4937, usNewsState: 194,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "St. Joseph-Ogden Community High School District 305 covers essentially all of St. Joseph's residents (2020 census blocks). St Joseph-Ogden High School (#194 in Illinois) enrolls 457 students in grades 9-12 with a 95% graduation rate; its average SAT total was 1011 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Thomasboro": {
    hs: "Rantoul Twp High School",
    district: "Rantoul Township High School District 193",
    feedsTo: "Rantoul Twp High School",
    usNewsNational: 8682, usNewsState: 303,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Rantoul Township High School District 193 covers essentially all of Thomasboro's residents (2020 census blocks). Rantoul Twp High School (#303 in Illinois) enrolls 901 students in grades 9-12 with a 88% graduation rate; its average SAT total was 796 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Tolono": {
    hs: "Unity High School",
    district: "Tolono Community Unit School District 7",
    usNewsNational: 4074, usNewsState: 159,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tolono Community Unit School District 7 covers essentially all of Tolono's residents (2020 census blocks). Unity High School (#159 in Illinois) enrolls 480 students in grades 9-12 with a 86% graduation rate; its average SAT total was 980 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Urbana": {
    hs: "Urbana High School",
    district: "Urbana School District 116",
    usNewsNational: 4682, usNewsState: 184,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Urbana School District 116 covers essentially all of Urbana's residents (2020 census blocks). Urbana High School (#184 in Illinois) enrolls 1,176 students in grades 9-12 with a 83% graduation rate; its average SAT total was 877 in 2024 (ISBE, Illinois's last state SAT). The University of Illinois Laboratory High School (\"Uni High\") is also physically located in Urbana and is real and US News-ranked (#7 in Illinois, #162 nationally, 2026-27 edition) -- but it is a selective-admission public school that draws students from across Illinois by test, not by home address, so it is not modeled as Urbana's (or Champaign's) assigned high school here; no census block's population is attributed to it. See build_champaign_schools.py's own module docstring."
  },
  // === CHAMPAIGN METRO SCHOOL_DATA END ===

  // === SPRINGFIELD METRO SCHOOL_DATA START ===
  "Athens": {
    hs: "Athens Senior High School",
    district: "Athens Community Unit School District 213",
    usNewsNational: 7814, usNewsState: 280,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Athens Community Unit School District 213 covers essentially all of Athens's residents (2020 census blocks). Athens Senior High School (#280 in Illinois) enrolls 299 students in grades 9-12 with a 90% graduation rate; its average SAT total was 947 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Auburn": {
    hs: "Auburn High School (Auburn)",
    district: "Auburn Community Unit School District 10",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Auburn Community Unit School District 10 covers essentially all of Auburn's residents (2020 census blocks). Auburn High School (Auburn) (in the 469-675 band in Illinois) enrolls 327 students in grades 9-12 with a 87% graduation rate; its average SAT total was 876 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Chatham": {
    hs: "Glenwood High School",
    district: "Ball-Chatham Community Unit School District 5",
    usNewsNational: 2122, usNewsState: 89,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ball-Chatham Community Unit School District 5 covers essentially all of Chatham's residents (2020 census blocks). Glenwood High School (#89 in Illinois) enrolls 1,484 students in grades 9-12 with a 90% graduation rate; its average SAT total was 1016 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Dawson": {
    hs: "Tri-City High School",
    district: "Tri-City Community Unit School District 1",
    feedsTo: "Tri-City High School",
    usNewsNational: 11628, usNewsState: 396,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tri-City Community Unit School District 1 covers essentially all of Dawson's residents (2020 census blocks). Tri-City High School (#396 in Illinois) enrolls 154 students in grades 9-12 with a 81% graduation rate; its average SAT total was 930 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Divernon": {
    hs: "Auburn High School (Auburn)",
    district: "Auburn Community Unit School District 10",
    feedsTo: "Auburn High School (Auburn)",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Auburn Community Unit School District 10 covers essentially all of Divernon's residents (2020 census blocks). Auburn High School (Auburn) (in the 469-675 band in Illinois) enrolls 327 students in grades 9-12 with a 87% graduation rate; its average SAT total was 876 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Grandview": {
    hs: ["Springfield High School", "Lanphier High School", "Springfield Southeast High School"],
    district: ["Springfield School District 186", "Springfield School District 186", "Springfield School District 186"],
    feedsTo: "Springfield High School / Lanphier High School / Springfield Southeast High School",
    usNewsNational: 3867, usNewsState: 150,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Springfield School District 186 covers essentially all of Grandview's residents (2020 census blocks). Springfield School District 186 splits students across 3 comprehensive high schools by address (attendance zones not obtained). Springfield High School (#150 in Illinois) enrolls 1,308 students in grades 9-12 with a 83% graduation rate; its average SAT total was 960 in 2024 (ISBE, Illinois's last state SAT). Lanphier High School (in the 469-675 band in Illinois) enrolls 1,117 students in grades 9-12; its average SAT total was 807 in 2024 (ISBE, Illinois's last state SAT). Springfield Southeast High School (#377 in Illinois) enrolls 1,229 students in grades 9-12 with a 70% graduation rate; its average SAT total was 841 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Greenview": {
    hs: "Greenview Jr/Sr High School",
    district: "Greenview Community Unit School District 200",
    usNewsNational: null, usNewsState: null,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Greenview Community Unit School District 200 covers essentially all of Greenview's residents (2020 census blocks). Greenview Jr/Sr High School (not ranked by US News) enrolls 70 students in grades 9-12 with a 93% graduation rate; its average SAT total was 869 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Illiopolis": {
    hs: "Sangamon Valley High School",
    district: "Sangamon Valley Community Unit School District 9",
    feedsTo: "Sangamon Valley High School",
    usNewsNational: 10859, usNewsState: 375,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Sangamon Valley Community Unit School District 9 covers essentially all of Illiopolis's residents (2020 census blocks). Sangamon Valley High School (#375 in Illinois) enrolls 204 students in grades 9-12 with a 88% graduation rate; its average SAT total was 922 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Jerome": {
    hs: ["Springfield High School", "Lanphier High School", "Springfield Southeast High School"],
    district: ["Springfield School District 186", "Springfield School District 186", "Springfield School District 186"],
    feedsTo: "Springfield High School / Lanphier High School / Springfield Southeast High School",
    usNewsNational: 3867, usNewsState: 150,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Springfield School District 186 covers essentially all of Jerome's residents (2020 census blocks). Springfield School District 186 splits students across 3 comprehensive high schools by address (attendance zones not obtained). Springfield High School (#150 in Illinois) enrolls 1,308 students in grades 9-12 with a 83% graduation rate; its average SAT total was 960 in 2024 (ISBE, Illinois's last state SAT). Lanphier High School (in the 469-675 band in Illinois) enrolls 1,117 students in grades 9-12; its average SAT total was 807 in 2024 (ISBE, Illinois's last state SAT). Springfield Southeast High School (#377 in Illinois) enrolls 1,229 students in grades 9-12 with a 70% graduation rate; its average SAT total was 841 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Lake Petersburg": {
    hs: "Porta High School",
    district: "Porta Community Unit School District 202",
    feedsTo: "Porta High School",
    usNewsNational: 5516, usNewsState: 214,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Porta Community Unit School District 202 covers essentially all of Lake Petersburg's residents (2020 census blocks). Porta High School (#214 in Illinois) enrolls 279 students in grades 9-12 with a 92% graduation rate; its average SAT total was 920 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Leland Grove": {
    hs: ["Springfield High School", "Lanphier High School", "Springfield Southeast High School"],
    district: ["Springfield School District 186", "Springfield School District 186", "Springfield School District 186"],
    feedsTo: "Springfield High School / Lanphier High School / Springfield Southeast High School",
    usNewsNational: 3867, usNewsState: 150,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Springfield School District 186 covers essentially all of Leland Grove's residents (2020 census blocks). Springfield School District 186 splits students across 3 comprehensive high schools by address (attendance zones not obtained). Springfield High School (#150 in Illinois) enrolls 1,308 students in grades 9-12 with a 83% graduation rate; its average SAT total was 960 in 2024 (ISBE, Illinois's last state SAT). Lanphier High School (in the 469-675 band in Illinois) enrolls 1,117 students in grades 9-12; its average SAT total was 807 in 2024 (ISBE, Illinois's last state SAT). Springfield Southeast High School (#377 in Illinois) enrolls 1,229 students in grades 9-12 with a 70% graduation rate; its average SAT total was 841 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Loami": {
    hs: "New Berlin High School",
    district: "New Berlin CUSD 16",
    feedsTo: "New Berlin High School",
    usNewsNational: 12158, usNewsState: 411,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "New Berlin CUSD 16 covers essentially all of Loami's residents (2020 census blocks). New Berlin High School (#411 in Illinois) enrolls 256 students in grades 9-12 with a 98% graduation rate; its average SAT total was 966 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Mechanicsburg": {
    hs: "Tri-City High School",
    district: "Tri-City Community Unit School District 1",
    feedsTo: "Tri-City High School",
    usNewsNational: 11628, usNewsState: 396,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tri-City Community Unit School District 1 covers essentially all of Mechanicsburg's residents (2020 census blocks). Tri-City High School (#396 in Illinois) enrolls 154 students in grades 9-12 with a 81% graduation rate; its average SAT total was 930 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "New Berlin": {
    hs: "New Berlin High School",
    district: "New Berlin CUSD 16",
    usNewsNational: 12158, usNewsState: 411,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "New Berlin CUSD 16 covers essentially all of New Berlin's residents (2020 census blocks). New Berlin High School (#411 in Illinois) enrolls 256 students in grades 9-12 with a 98% graduation rate; its average SAT total was 966 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Pawnee": {
    hs: "Pawnee Jr/Sr High School",
    district: "Pawnee Community Unit School District 11",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pawnee Community Unit School District 11 covers essentially all of Pawnee's residents (2020 census blocks). Pawnee Jr/Sr High School (in the 469-675 band in Illinois) enrolls 167 students in grades 9-12 with a 88% graduation rate; its average SAT total was 956 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Petersburg": {
    hs: "Porta High School",
    district: "Porta Community Unit School District 202",
    usNewsNational: 5516, usNewsState: 214,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Porta Community Unit School District 202 covers essentially all of Petersburg's residents (2020 census blocks). Porta High School (#214 in Illinois) enrolls 279 students in grades 9-12 with a 92% graduation rate; its average SAT total was 920 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Pleasant Plains": {
    hs: "Pleasant Plains High School",
    district: "Pleasant Plains Community Unit School District 8",
    usNewsNational: 4149, usNewsState: 162,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Pleasant Plains Community Unit School District 8 covers essentially all of Pleasant Plains's residents (2020 census blocks). Pleasant Plains High School (#162 in Illinois) enrolls 416 students in grades 9-12 with a 92% graduation rate; its average SAT total was 993 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Riverton": {
    hs: "Riverton High School",
    district: "Riverton Community Unit School District 14",
    usNewsNational: 10093, usNewsState: 346,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Riverton Community Unit School District 14 covers essentially all of Riverton's residents (2020 census blocks). Riverton High School (#346 in Illinois) enrolls 356 students in grades 9-12 with a 85% graduation rate; its average SAT total was 886 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Rochester": {
    hs: "Rochester High School (IL)",
    district: "Rochester Community Unit School District 3A",
    usNewsNational: 3670, usNewsState: 143,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Rochester Community Unit School District 3A covers essentially all of Rochester's residents (2020 census blocks). Rochester High School (IL) (#143 in Illinois) enrolls 692 students in grades 9-12 with a 92% graduation rate; its average SAT total was 971 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Sherman (IL)": {
    hs: "Williamsville High School",
    district: "Williamsville Community Unit School District 15",
    feedsTo: "Williamsville High School",
    usNewsNational: 3826, usNewsState: 148,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Williamsville Community Unit School District 15 covers essentially all of Sherman's residents (2020 census blocks). Williamsville High School (#148 in Illinois) enrolls 462 students in grades 9-12 with a 96% graduation rate; its average SAT total was 995 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Southern View": {
    hs: ["Springfield High School", "Lanphier High School", "Springfield Southeast High School"],
    district: ["Springfield School District 186", "Springfield School District 186", "Springfield School District 186"],
    feedsTo: "Springfield High School / Lanphier High School / Springfield Southeast High School",
    usNewsNational: 3867, usNewsState: 150,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Springfield School District 186 covers essentially all of Southern View's residents (2020 census blocks). Springfield School District 186 splits students across 3 comprehensive high schools by address (attendance zones not obtained). Springfield High School (#150 in Illinois) enrolls 1,308 students in grades 9-12 with a 83% graduation rate; its average SAT total was 960 in 2024 (ISBE, Illinois's last state SAT). Lanphier High School (in the 469-675 band in Illinois) enrolls 1,117 students in grades 9-12; its average SAT total was 807 in 2024 (ISBE, Illinois's last state SAT). Springfield Southeast High School (#377 in Illinois) enrolls 1,229 students in grades 9-12 with a 70% graduation rate; its average SAT total was 841 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Spaulding": {
    hs: "Riverton High School",
    district: "Riverton Community Unit School District 14",
    feedsTo: "Riverton High School",
    usNewsNational: 10093, usNewsState: 346,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Riverton Community Unit School District 14 covers about 92% of Spaulding's residents (2020 census blocks). The rest are mostly in Tri-City Community Unit School District 1 (8%). Riverton High School (#346 in Illinois) enrolls 356 students in grades 9-12 with a 85% graduation rate; its average SAT total was 886 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Springfield": {
    hs: ["Springfield High School", "Lanphier High School", "Springfield Southeast High School"],
    district: ["Springfield School District 186", "Springfield School District 186", "Springfield School District 186"],
    usNewsNational: 3867, usNewsState: 150,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Springfield School District 186 covers about 82% of Springfield's residents (2020 census blocks). The rest are mostly in Ball-Chatham Community Unit School District 5 (10%). Springfield School District 186 splits students across 3 comprehensive high schools by address (attendance zones not obtained). Springfield High School (#150 in Illinois) enrolls 1,308 students in grades 9-12 with a 83% graduation rate; its average SAT total was 960 in 2024 (ISBE, Illinois's last state SAT). Lanphier High School (in the 469-675 band in Illinois) enrolls 1,117 students in grades 9-12; its average SAT total was 807 in 2024 (ISBE, Illinois's last state SAT). Springfield Southeast High School (#377 in Illinois) enrolls 1,229 students in grades 9-12 with a 70% graduation rate; its average SAT total was 841 in 2024 (ISBE, Illinois's last state SAT). Sacred Heart-Griffin High School, a private Roman Catholic high school, is also physically located in Springfield (enrollment 526) -- verified real, but it is not modeled as any place's assigned high school here for two reasons: it is not zoned by residential address (diocese-wide private admissions, not a home-address attendance zone), and unlike a public magnet school it has no US News academic rank at all (US News's 'Best High Schools' ranking system covers public schools only). See build_springfield_schools.py's own module docstring."
  },
  "Thayer": {
    hs: "North Mac High School",
    district: "North Mac Community Unit School District 34",
    feedsTo: "North Mac High School",
    usNewsNational: 9851, usNewsState: 340,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "North Mac Community Unit School District 34 covers essentially all of Thayer's residents (2020 census blocks). North Mac High School (#340 in Illinois) enrolls 361 students in grades 9-12 with a 87% graduation rate; its average SAT total was 929 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Williamsville": {
    hs: "Williamsville High School",
    district: "Williamsville Community Unit School District 15",
    usNewsNational: 3826, usNewsState: 148,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Williamsville Community Unit School District 15 covers essentially all of Williamsville's residents (2020 census blocks). Williamsville High School (#148 in Illinois) enrolls 462 students in grades 9-12 with a 96% graduation rate; its average SAT total was 995 in 2024 (ISBE, Illinois's last state SAT)."
  },
  // === SPRINGFIELD METRO SCHOOL_DATA END ===

  // === BLOOMINGTON METRO SCHOOL_DATA START ===
  "Bloomington": {
    hs: ["Bloomington High School", "Normal Community High School", "Normal Community West High School"],
    district: ["Bloomington School District 87", "Mclean County Unified School District 5", "Mclean County Unified School District 5"],
    usNewsNational: 5622, usNewsState: 221,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "Bloomington School District 87 covers about 54% of Bloomington's residents (2020 census blocks), and McLean County Unit School District 5 (about 46%). Which high school a student attends depends on address (attendance zones not obtained) between Bloomington School District 87 and McLean County Unit School District 5. Bloomington High School (#221 in Illinois) enrolls 1,369 students in grades 9-12 with a 77% graduation rate; its average SAT total was 887 in 2024 (ISBE, Illinois's last state SAT). Normal Community High School (#95 in Illinois) enrolls 2,079 students in grades 9-12 with a 92% graduation rate; its average SAT total was 994 in 2024 (ISBE, Illinois's last state SAT). Normal Community West High School (#210 in Illinois) enrolls 1,590 students in grades 9-12 with a 92% graduation rate; its average SAT total was 934 in 2024 (ISBE, Illinois's last state SAT). Central Catholic High School, a private Roman Catholic high school (Diocese of Peoria), is also physically located in Bloomington (enrollment 300) -- verified real, but it is not modeled as any place's assigned high school here for two reasons: it is not zoned by residential address (diocese-wide private admissions, rolling deadlines, not a home-address attendance zone), and it has no US News academic rank at all (US News's 'Best High Schools' ranking system covers public schools only). See build_bloomington_schools.py's own module docstring. McLean County Unit School District 5 splits students across 2 comprehensive high schools by address; the district does publish real attendance-zone boundaries, but this build's school-district-polygon model (the same one every metro in this project uses) does not ingest sub-district attendance zones, so which of the 2 a given address feeds is not modeled here -- the same modeling limit already applied to Springfield SD 186's 3-way split and Peoria SD 150's 3-way split, not a Bloomington-specific gap. Unit 5 also operates YBMC Charter School, a small (24-student) credit-recovery/workforce-transition charter program -- real, but not a comprehensive attendance-zone high school, so it is excluded here too."
  },
  "Carlock": {
    hs: ["Normal Community High School", "Normal Community West High School"],
    district: ["Mclean County Unified School District 5", "Mclean County Unified School District 5"],
    feedsTo: "Normal Community High School / Normal Community West High School",
    usNewsNational: 2312, usNewsState: 95,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "McLean County Unit School District 5 covers essentially all of Carlock's residents (2020 census blocks). McLean County Unit School District 5 splits students across 2 comprehensive high schools by address (attendance zones not obtained). Normal Community High School (#95 in Illinois) enrolls 2,079 students in grades 9-12 with a 92% graduation rate; its average SAT total was 994 in 2024 (ISBE, Illinois's last state SAT). Normal Community West High School (#210 in Illinois) enrolls 1,590 students in grades 9-12 with a 92% graduation rate; its average SAT total was 934 in 2024 (ISBE, Illinois's last state SAT). McLean County Unit School District 5 splits students across 2 comprehensive high schools by address; the district does publish real attendance-zone boundaries, but this build's school-district-polygon model (the same one every metro in this project uses) does not ingest sub-district attendance zones, so which of the 2 a given address feeds is not modeled here -- the same modeling limit already applied to Springfield SD 186's 3-way split and Peoria SD 150's 3-way split, not a Bloomington-specific gap. Unit 5 also operates YBMC Charter School, a small (24-student) credit-recovery/workforce-transition charter program -- real, but not a comprehensive attendance-zone high school, so it is excluded here too."
  },
  "Chenoa": {
    hs: "Prairie Central High School",
    district: "Prairie Central Community Unit School District 8",
    feedsTo: "Prairie Central High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Prairie Central Community Unit School District 8 covers essentially all of Chenoa's residents (2020 census blocks). Prairie Central High School (in the 469-675 band in Illinois) enrolls 487 students in grades 9-12 with a 90% graduation rate; its average SAT total was 937 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Colfax": {
    hs: "Ridgeview High School",
    district: "Ridgeview Community Unit School District 19",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ridgeview Community Unit School District 19 covers essentially all of Colfax's residents (2020 census blocks). Ridgeview High School (in the 469-675 band in Illinois) enrolls 166 students in grades 9-12 with a 90% graduation rate; its average SAT total was 945 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Danvers": {
    hs: "Olympia High School",
    district: "Olympia Community Unit School District 16",
    feedsTo: "Olympia High School",
    usNewsNational: 8184, usNewsState: 291,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Olympia Community Unit School District 16 covers essentially all of Danvers's residents (2020 census blocks). Olympia High School (#291 in Illinois) enrolls 495 students in grades 9-12 with a 92% graduation rate; its average SAT total was 935 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Downs": {
    hs: "Tri-Valley High School",
    district: "Tri-Valley Community Unit School District 3",
    usNewsNational: 1108, usNewsState: 54,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Tri-Valley Community Unit School District 3 covers essentially all of Downs's residents (2020 census blocks). Tri-Valley High School (#54 in Illinois) enrolls 329 students in grades 9-12 with a 98% graduation rate; its average SAT total was 1042 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Gridley": {
    hs: "El Paso-Gridley High School",
    district: "El Paso-Gridley Community Unit School District 11",
    feedsTo: "El Paso-Gridley High School",
    usNewsNational: 2726, usNewsState: 111,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "El Paso-Gridley Community Unit School District 11 covers essentially all of Gridley's residents (2020 census blocks). El Paso-Gridley High School (#111 in Illinois) enrolls 364 students in grades 9-12 with a 88% graduation rate; its average SAT total was 1015 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Heyworth": {
    hs: "Heyworth Jr-Sr High School",
    district: "Heyworth Community Unit School District 4",
    usNewsNational: 8007, usNewsState: 287,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Heyworth Community Unit School District 4 covers essentially all of Heyworth's residents (2020 census blocks). Heyworth Jr-Sr High School (#287 in Illinois) enrolls 272 students in grades 9-12 with a 100% graduation rate; its average SAT total was 955 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Hudson": {
    hs: ["Normal Community High School", "Normal Community West High School"],
    district: ["Mclean County Unified School District 5", "Mclean County Unified School District 5"],
    feedsTo: "Normal Community High School / Normal Community West High School",
    usNewsNational: 2312, usNewsState: 95,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "McLean County Unit School District 5 covers essentially all of Hudson's residents (2020 census blocks). McLean County Unit School District 5 splits students across 2 comprehensive high schools by address (attendance zones not obtained). Normal Community High School (#95 in Illinois) enrolls 2,079 students in grades 9-12 with a 92% graduation rate; its average SAT total was 994 in 2024 (ISBE, Illinois's last state SAT). Normal Community West High School (#210 in Illinois) enrolls 1,590 students in grades 9-12 with a 92% graduation rate; its average SAT total was 934 in 2024 (ISBE, Illinois's last state SAT). McLean County Unit School District 5 splits students across 2 comprehensive high schools by address; the district does publish real attendance-zone boundaries, but this build's school-district-polygon model (the same one every metro in this project uses) does not ingest sub-district attendance zones, so which of the 2 a given address feeds is not modeled here -- the same modeling limit already applied to Springfield SD 186's 3-way split and Peoria SD 150's 3-way split, not a Bloomington-specific gap. Unit 5 also operates YBMC Charter School, a small (24-student) credit-recovery/workforce-transition charter program -- real, but not a comprehensive attendance-zone high school, so it is excluded here too."
  },
  "Le Roy": {
    hs: "Leroy High School",
    district: "Le Roy Community Unit School District 2",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Le Roy Community Unit School District 2 covers essentially all of Le Roy's residents (2020 census blocks). Leroy High School (in the 469-675 band in Illinois) enrolls 232 students in grades 9-12 with a 96% graduation rate; its average SAT total was 944 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Lexington": {
    hs: "Lexington High School",
    district: "Lexington Community Unit School District 7",
    usNewsNational: 4395, usNewsState: 174,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Lexington Community Unit School District 7 covers essentially all of Lexington's residents (2020 census blocks). Lexington High School (#174 in Illinois) enrolls 163 students in grades 9-12 with a 97% graduation rate; its average SAT total was 950 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "McLean": {
    hs: "Olympia High School",
    district: "Olympia Community Unit School District 16",
    feedsTo: "Olympia High School",
    usNewsNational: 8184, usNewsState: 291,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Olympia Community Unit School District 16 covers essentially all of McLean's residents (2020 census blocks). Olympia High School (#291 in Illinois) enrolls 495 students in grades 9-12 with a 92% graduation rate; its average SAT total was 935 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Normal": {
    hs: ["Normal Community High School", "Normal Community West High School"],
    district: ["Mclean County Unified School District 5", "Mclean County Unified School District 5"],
    usNewsNational: 2312, usNewsState: 95,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "McLean County Unit School District 5 covers essentially all of Normal's residents (2020 census blocks). McLean County Unit School District 5 splits students across 2 comprehensive high schools by address (attendance zones not obtained). Normal Community High School (#95 in Illinois) enrolls 2,079 students in grades 9-12 with a 92% graduation rate; its average SAT total was 994 in 2024 (ISBE, Illinois's last state SAT). Normal Community West High School (#210 in Illinois) enrolls 1,590 students in grades 9-12 with a 92% graduation rate; its average SAT total was 934 in 2024 (ISBE, Illinois's last state SAT). University High School, a public Illinois State University Laboratory School (#21 in Illinois / #485 nationally, US News 2026-27), is also physically located in Normal -- verified real, but it is not modeled as any place's assigned high school here: unlike a residential-zone public school, it uses application-based admission with a state-mandated enrollment cap and is classified 'unboundaried' by the IHSA (no fixed attendance zone). See build_bloomington_schools.py's own module docstring. McLean County Unit School District 5 splits students across 2 comprehensive high schools by address; the district does publish real attendance-zone boundaries, but this build's school-district-polygon model (the same one every metro in this project uses) does not ingest sub-district attendance zones, so which of the 2 a given address feeds is not modeled here -- the same modeling limit already applied to Springfield SD 186's 3-way split and Peoria SD 150's 3-way split, not a Bloomington-specific gap. Unit 5 also operates YBMC Charter School, a small (24-student) credit-recovery/workforce-transition charter program -- real, but not a comprehensive attendance-zone high school, so it is excluded here too."
  },
  "Saybrook": {
    hs: "Ridgeview High School",
    district: "Ridgeview Community Unit School District 19",
    feedsTo: "Ridgeview High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Ridgeview Community Unit School District 19 covers essentially all of Saybrook's residents (2020 census blocks). Ridgeview High School (in the 469-675 band in Illinois) enrolls 166 students in grades 9-12 with a 90% graduation rate; its average SAT total was 945 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Stanford": {
    hs: "Olympia High School",
    district: "Olympia Community Unit School District 16",
    usNewsNational: 8184, usNewsState: 291,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Olympia Community Unit School District 16 covers essentially all of Stanford's residents (2020 census blocks). Olympia High School (#291 in Illinois) enrolls 495 students in grades 9-12 with a 92% graduation rate; its average SAT total was 935 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Twin Grove": {
    hs: ["Normal Community High School", "Normal Community West High School", "Olympia High School"],
    district: ["Mclean County Unified School District 5", "Mclean County Unified School District 5", "Olympia Community Unified School District 16"],
    feedsTo: "Normal Community High School / Normal Community West High School / Olympia High School",
    usNewsNational: 2312, usNewsState: 95,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: "McLean County Unit School District 5 covers about 72% of Twin Grove's residents (2020 census blocks), and Olympia Community Unit School District 16 (about 28%). Which high school a student attends depends on address (attendance zones not obtained) between McLean County Unit School District 5 and Olympia Community Unit School District 16. Normal Community High School (#95 in Illinois) enrolls 2,079 students in grades 9-12 with a 92% graduation rate; its average SAT total was 994 in 2024 (ISBE, Illinois's last state SAT). Normal Community West High School (#210 in Illinois) enrolls 1,590 students in grades 9-12 with a 92% graduation rate; its average SAT total was 934 in 2024 (ISBE, Illinois's last state SAT). Olympia High School (#291 in Illinois) enrolls 495 students in grades 9-12 with a 92% graduation rate; its average SAT total was 935 in 2024 (ISBE, Illinois's last state SAT). McLean County Unit School District 5 splits students across 2 comprehensive high schools by address; the district does publish real attendance-zone boundaries, but this build's school-district-polygon model (the same one every metro in this project uses) does not ingest sub-district attendance zones, so which of the 2 a given address feeds is not modeled here -- the same modeling limit already applied to Springfield SD 186's 3-way split and Peoria SD 150's 3-way split, not a Bloomington-specific gap. Unit 5 also operates YBMC Charter School, a small (24-student) credit-recovery/workforce-transition charter program -- real, but not a comprehensive attendance-zone high school, so it is excluded here too."
  },
  // === BLOOMINGTON METRO SCHOOL_DATA END ===

  // === KANKAKEE METRO SCHOOL_DATA START ===
  "Aroma Park": {
    hs: "Kankakee High School",
    district: "Kankakee School District 111",
    feedsTo: "Kankakee High School",
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Kankakee School District 111 covers essentially all of Aroma Park's residents (2020 census blocks). Kankakee High School (in the 469-675 band in Illinois) enrolls 1,360 students in grades 9-12; its average SAT total was 780 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Essex": {
    hs: "Reed-Custer High School",
    district: "Reed-Custer Community Unit School District 255U",
    feedsTo: "Reed-Custer High School",
    usNewsNational: 8816, usNewsState: 305,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Reed-Custer Community Unit School District 255U covers essentially all of Essex's residents (2020 census blocks). Reed-Custer High School (#305 in Illinois) enrolls 397 students in grades 9-12 with a 97% graduation rate; its average SAT total was 924 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Grant Park": {
    hs: "Grant Park High School",
    district: "Grant Park Community Unit School District 6",
    usNewsNational: 8321, usNewsState: 294,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Grant Park Community Unit School District 6 covers essentially all of Grant Park's residents (2020 census blocks). Grant Park High School (#294 in Illinois) enrolls 127 students in grades 9-12 with a 100% graduation rate; its average SAT total was 977 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Herscher": {
    hs: "Herscher High School",
    district: "Herscher Community Unit School District 2",
    usNewsNational: 5507, usNewsState: 212,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Herscher Community Unit School District 2 covers essentially all of Herscher's residents (2020 census blocks). Herscher High School (#212 in Illinois) enrolls 542 students in grades 9-12 with a 97% graduation rate; its average SAT total was 964 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "Hopkins Park": {
    hs: "St Anne Comm High School",
    district: "St. Anne Unit District 24",
    feedsTo: "St Anne Comm High School",
    usNewsNational: 12784, usNewsState: 437,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "St. Anne Unit District 24 covers essentially all of Hopkins Park's residents (2020 census blocks). St Anne Comm High School (#437 in Illinois) enrolls 206 students in grades 9-12; its average SAT total was 829 in 2024 (ISBE, Illinois's last state SAT). Hopkins Park is in Pembroke Township, whose own elementary district (Pembroke Consolidated Community School District 259, K-8 only) has no high school of its own; its students are served by St. Anne Unit District 24's own comprehensive high school -- confirmed via Census TIGERweb's school-district polygon layer and independently via i-kan.org's official Kankakee-County district list, not assumed from the polygon alone. See s4_usnews_browser.md."
  },
  "Limestone": {
    hs: "Herscher High School",
    district: "Herscher Community Unit School District 2",
    feedsTo: "Herscher High School",
    usNewsNational: 5507, usNewsState: 212,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "Herscher Community Unit School District 2 covers essentially all of Limestone's residents (2020 census blocks). Herscher High School (#212 in Illinois) enrolls 542 students in grades 9-12 with a 97% graduation rate; its average SAT total was 964 in 2024 (ISBE, Illinois's last state SAT)."
  },
  "St. Anne": {
    hs: "St Anne Comm High School",
    district: "St. Anne Unit District 24",
    usNewsNational: 12784, usNewsState: 437,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: "St. Anne Unit District 24 covers essentially all of St. Anne's residents (2020 census blocks). St Anne Comm High School (#437 in Illinois) enrolls 206 students in grades 9-12; its average SAT total was 829 in 2024 (ISBE, Illinois's last state SAT). US News's own metro rankings page displays this school's district as 'St Anne Community High School District 302', but Census TIGERweb, the Illinois State Board of Education's Illinois Report Card, and i-kan.org's own official district list all independently agree the real district is St. Anne Unit District 24 -- a US News data-quality quirk, not this project's error. See s4_usnews_browser.md."
  }
  // === KANKAKEE METRO SCHOOL_DATA END ===
};

// Every CPS (Chicago Public Schools, District 299) high school that carries a
// US News 2026-2027 national + state rank, plus its own "Enrollment 9-12"
// figure -- both pulled straight from US News' own district-scoped JSON API
// (usnews.com/education/best-high-schools/illinois/districts/
// chicago-public-schools-110570?format=json&page=N, 2026-09-16), the same
// first-party source already used for MULTI_SCHOOL_RANKS above. NOT the
// district page's default "District Rank" sort (a 1-169 local reordering
// with the same field names but different values) -- these are each
// school's TRUE statewide/national rank, fetched via the
// state-urlname=illinois search endpoint and filtered to
// school.district === "Chicago Public Schools".
//
// Used by index.html's composite_score bootstrap to give Chicago's 77
// community areas (CCAs) an enrollment-weighted average rankScore, since
// CPS is one citywide open-enrollment district with no zoned
// neighborhood high school per CCA -- see the is_neighborhood_rollup /
// CPS-district comment there for why every CCA shares one number instead
// of each getting its own researched figure.
//
// 135 of CPS's 169 high schools carry a rank (77 with a precise numeric
// rank, 58 sharing US News' bottom-tier shared band "13,460-17,945"
// national / "469-675" state -- band schools carry natlRankMid, the
// range's midpoint, so the weighted-average math has a number to work
// with; natlBand/stateBand are the true displayable range). The other 34
// are unranked (mostly tiny alternative/juvenile-justice programs) and are
// deliberately left out of this table -- together they're only ~1,720
// students, 1.7% of CPS's ~101K high-school enrollment, so excluding them
// barely moves the weighted average and including a fabricated rank for
// them would be worse than leaving them out.
const CPS_HIGH_SCHOOLS = [
  { name: "Northside College Preparatory High School", natlRank: 30, stateRank: 1, enrollment: 1061 },
  { name: "Payton College Preparatory High School", natlRank: 54, stateRank: 2, enrollment: 1260 },
  { name: "Lane Technical High School", natlRank: 80, stateRank: 3, enrollment: 4389 },
  { name: "Jones College Prep High School", natlRank: 99, stateRank: 5, enrollment: 1954 },
  { name: "Young Magnet High School", natlRank: 107, stateRank: 6, enrollment: 1941 },
  { name: "Hancock College Preparatory High School", natlRank: 269, stateRank: 10, enrollment: 1050 },
  { name: "Brooks College Prep Academy High School", natlRank: 379, stateRank: 16, enrollment: 888 },
  { name: "Lindblom Math and Science Academy", natlRank: 623, stateRank: 28, enrollment: 1077 },
  { name: "DeVry Advantage Academy High School", natlRank: 746, stateRank: 36, enrollment: 152 },
  { name: "Lincoln Park High School", natlRank: 752, stateRank: 37, enrollment: 2214 },
  { name: "Westinghouse High School", natlRank: 1008, stateRank: 49, enrollment: 1230 },
  { name: "Von Steuben Metro Science High School", natlRank: 1091, stateRank: 52, enrollment: 1698 },
  { name: "Noble St Chtr-Pritzker College Prep", natlRank: 1418, stateRank: 65, enrollment: 993 },
  { name: "Chicago Math and Science Elementary Charter", natlRank: 1490, stateRank: 68, enrollment: 438 },
  { name: "Phoenix Military Academy High School", natlRank: 1581, stateRank: 72, enrollment: 372 },
  { name: "Solorio Academy High School", natlRank: 1841, stateRank: 81, enrollment: 1287 },
  { name: "Noble St Chtr-Noble Campus", natlRank: 2167, stateRank: 90, enrollment: 696 },
  { name: "Kenwood Academy High School", natlRank: 2214, stateRank: 92, enrollment: 1964 },
  { name: "Chicago High School for the Arts", natlRank: 2334, stateRank: 96, enrollment: 578 },
  { name: "Noble St Charter - Mansueto", natlRank: 2466, stateRank: 102, enrollment: 1106 },
  { name: "Back of The Yards College Prepatory High School", natlRank: 2610, stateRank: 107, enrollment: 1039 },
  { name: "Intrinsic Charter High School", natlRank: 3199, stateRank: 130, enrollment: 684 },
  { name: "Senn High School", natlRank: 3622, stateRank: 141, enrollment: 1570 },
  { name: "Rickover Naval Academy High School", natlRank: 3868, stateRank: 151, enrollment: 527 },
  { name: "Amundsen High School", natlRank: 3949, stateRank: 155, enrollment: 1507 },
  { name: "Chicago Academy High School", natlRank: 4097, stateRank: 160, enrollment: 580 },
  { name: "Ogden Int High School", natlRank: 4380, stateRank: 172, enrollment: 519 },
  { name: "Noble St Chtr-Muchin College Prep", natlRank: 4487, stateRank: 177, enrollment: 909 },
  { name: "Noble St Chtr-Uic College Prep", natlRank: 4517, stateRank: 179, enrollment: 957 },
  { name: "Mather High School", natlRank: 4900, stateRank: 190, enrollment: 1777 },
  { name: "Disney II Magnet High School", natlRank: 4914, stateRank: 191, enrollment: 587 },
  { name: "Taft High School", natlRank: 5089, stateRank: 199, enrollment: 4314 },
  { name: "Chicago High School for Agricult Sciences", natlRank: 5178, stateRank: 203, enrollment: 827 },
  { name: "Horizon Science Academy - Southwest Charter", natlRank: 5226, stateRank: 206, enrollment: 225 },
  { name: "Noble St Chtr-Golder College Prep", natlRank: 5240, stateRank: 207, enrollment: 633 },
  { name: "CICS Northtown Academy", natlRank: 5784, stateRank: 227, enrollment: 878 },
  { name: "Noble St Chtr-Itw Speer Acad", natlRank: 6192, stateRank: 235, enrollment: 1135 },
  { name: "Prosser Career Academy High School", natlRank: 6494, stateRank: 244, enrollment: 1185 },
  { name: "South Shore International Col Prep High School", natlRank: 6534, stateRank: 245, enrollment: 625 },
  { name: "Lake View High School", natlRank: 6794, stateRank: 253, enrollment: 1431 },
  { name: "Catalyst Charter - Maria Elementary School", natlRank: 7039, stateRank: 259, enrollment: 574 },
  { name: "Noble St Chtr-Chicago Bulls Prep", natlRank: 7042, stateRank: 260, enrollment: 1060 },
  { name: "Alcott College Prep", natlRank: 7350, stateRank: 268, enrollment: 373 },
  { name: "Hubbard High School", natlRank: 7490, stateRank: 272, enrollment: 1710 },
  { name: "Noble St Chtr-The Noble Academy", natlRank: 7509, stateRank: 273, enrollment: 415 },
  { name: "Curie Metropolitan High School", natlRank: 8152, stateRank: 290, enrollment: 3099 },
  { name: "Noble St Chtr Rauner College Prep", natlRank: 8320, stateRank: 293, enrollment: 558 },
  { name: "Marine Leadership Academy - Ames", natlRank: 8373, stateRank: 296, enrollment: 442 },
  { name: "Aspira Charter - Early College Prep High School", natlRank: 8881, stateRank: 309, enrollment: 285 },
  { name: "Air Force Academy High School", natlRank: 9467, stateRank: 321, enrollment: 131 },
  { name: "World Language High School", natlRank: 9534, stateRank: 324, enrollment: 389 },
  { name: "Washington G High School", natlRank: 9609, stateRank: 331, enrollment: 1520 },
  { name: "Infinity Math Science and Tech High School", natlRank: 9768, stateRank: 335, enrollment: 427 },
  { name: "Noble St Chtr-Baker Campus", natlRank: 9927, stateRank: 341, enrollment: 285 },
  { name: "Kennedy High School", natlRank: 9940, stateRank: 342, enrollment: 1647 },
  { name: "King College Prep High School", natlRank: 10018, stateRank: 344, enrollment: 819 },
  { name: "Noble St Chtr-Butler College Prep - Crimson", natlRank: 10272, stateRank: 359, enrollment: 695 },
  { name: "Acero Charter School Network - Major Hector P Garcia MD Campus", natlRank: 10284, stateRank: 360, enrollment: 666 },
  { name: "Noble St Charter-Rowe-Clark Middle School Academy", natlRank: 10389, stateRank: 364, enrollment: 320 },
  { name: "Thomas Kelly College Preparatory", natlRank: 10519, stateRank: 368, enrollment: 1762 },
  { name: "Acero Charter School Network Victoria Soto Campus", natlRank: 11105, stateRank: 382, enrollment: 561 },
  { name: "Noble St Chtr-Comer College Prep", natlRank: 11154, stateRank: 385, enrollment: 752 },
  { name: "North-Grand High School", natlRank: 11974, stateRank: 406, enrollment: 1061 },
  { name: "Noble St Chtr-Hansberry College Prep - Silver", natlRank: 12076, stateRank: 410, enrollment: 534 },
  { name: "Noble St Chtr-Drw Trading College Prep", natlRank: 12181, stateRank: 414, enrollment: 323 },
  { name: "Perspectives Charter - IIT Campus", natlRank: 12252, stateRank: 417, enrollment: 378 },
  { name: "Univ of Chicago Chtr-Woodlawn", natlRank: 12418, stateRank: 425, enrollment: 362 },
  { name: "Schurz High School", natlRank: 12525, stateRank: 430, enrollment: 1244 },
  { name: "Simeon Career Academy High School", natlRank: 12776, stateRank: 436, enrollment: 1095 },
  { name: "Perspectives Charter - Joslin Campus", natlRank: 12847, stateRank: 441, enrollment: 270 },
  { name: "Carver Military Academy High School", natlRank: 12981, stateRank: 446, enrollment: 420 },
  { name: "Juarez Community Academy High School", natlRank: 13110, stateRank: 449, enrollment: 1585 },
  { name: "Aspira Charter - Business and Finance High School", natlRank: 13213, stateRank: 457, enrollment: 426 },
  { name: "Corliss High School", natlRank: 13227, stateRank: 459, enrollment: 430 },
  { name: "Epic Academy High School", natlRank: 13306, stateRank: 463, enrollment: 255 },
  { name: "Perspectives Charter - Leadership Acad", natlRank: 13317, stateRank: 464, enrollment: 707 },
  { name: "Crane Medical Prep High School", natlRank: 13345, stateRank: 466, enrollment: 295 },
  { name: "Acero Charter School Newtwork- Sor Juana Ines De La Cruz", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 120 },
  { name: "Art In Motion Charter School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 512 },
  { name: "Austin College and Career Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 190 },
  { name: "Bogan High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 716 },
  { name: "Bowen High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 278 },
  { name: "Chicago Collegiate Charter School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 180 },
  { name: "Chicago Excel Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 0 },
  { name: "Chicago Military Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 209 },
  { name: "Chicago Technology Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 315 },
  { name: "Chicago Vocational Career Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 673 },
  { name: "Cics - Longwood Campus", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 447 },
  { name: "Cics - Ralph Ellison Campus", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 247 },
  { name: "Clark Academy Prep Magnet High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 453 },
  { name: "Clemente Community Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 745 },
  { name: "Collins Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 228 },
  { name: "Dunbar Vocational Career Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 355 },
  { name: "Englewood Stem High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 778 },
  { name: "Farragut Career Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 490 },
  { name: "Fenger Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 312 },
  { name: "Foreman High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 650 },
  { name: "Gage Park High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 392 },
  { name: "Goode Stem Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 991 },
  { name: "Harlan Community Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 220 },
  { name: "Hirsch Metropolitan High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 183 },
  { name: "Hyde Park Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 838 },
  { name: "Ihsca Charter High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 567 },
  { name: "Ijla Charter High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 95 },
  { name: "Julian High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 440 },
  { name: "Kelvyn Park High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 470 },
  { name: "Legal Prep Academy Charter High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 210 },
  { name: "Manley Career Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 193 },
  { name: "Marshall Metropolitan High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 239 },
  { name: "Morgan Park High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 1250 },
  { name: "Multicultural Academy of Scholarship High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 283 },
  { name: "Noble St Chtr-Johnson College Prep", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 529 },
  { name: "North Lawndale Prep Charter - Christiana", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 258 },
  { name: "North Lawndale Prep Chtr-Collins", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 276 },
  { name: "Orr Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 361 },
  { name: "Perspectives Charter - High School of Technology", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 320 },
  { name: "Phillips Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 467 },
  { name: "Raby High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 128 },
  { name: "Richards Career Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 348 },
  { name: "Roosevelt High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 1144 },
  { name: "School of Social Justice High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 269 },
  { name: "Steinmetz College Prep High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 1230 },
  { name: "Sullivan High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 762 },
  { name: "Tilden Career Communty Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 288 },
  { name: "Uplift Community High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 224 },
  { name: "Urban Prep Charter Academy -- Bronzeville Campus", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 148 },
  { name: "Urban Prep Charter Academy Englewood High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 87 },
  { name: "Walter Henri Dyett High School for the Arts", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 538 },
  { name: "Wells Community Academy High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 398 },
  { name: "YCCS-Albizu Campos Puerto Rican High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 184 },
  { name: "YCCS-Aspira Pantoja Alt High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 200 },
  { name: "YCCS-Innovations of Arts Integr High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 392 },
  { name: "YCCS- Mckinley-Lakeside Leadership Academy", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 103 },
  { name: "YCCS-Olive Harvey Mid College High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 128 },
  { name: "YCCS-Truman Middle College High School", natlBand: "13,460–17,945", stateBand: "469–675", natlRankMid: 15702.5, enrollment: 192 },
];
