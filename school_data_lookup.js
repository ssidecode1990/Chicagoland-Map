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
  "Auburn High School": {
    "natl": 4485, "state": 176,
    "sat": 890, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Rockford East High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 812, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Guilford High School": {
    "natl": 6253, "state": 237,
    "sat": 864, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Jefferson High School": {
    "natl": 12492, "state": 427,
    "sat": 776, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Belvidere High School": {
    "natl": 9765, "state": 334,
    "sat": 852, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Belvidere North High School": {
    "natl": 6427, "state": 243,
    "sat": 894, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Harlem High School": {
    "natl": 4245, "state": 166,
    "sat": 898, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Hononegah High School": {
    "natl": 1185, "state": 56,
    "sat": 1063, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "South Beloit Senior High School": {
    "natl": 6243, "state": 236,
    "sat": 946, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "North Boone High School": {
    "natl": 11863, "state": 402,
    "sat": 916, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Peoria High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 752, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Manual High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 727, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Richwoods High School": {
    "natl": 4382, "state": 173,
    "sat": 914, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Pekin Community High School": {
    "natl": 5604, "state": 220,
    "sat": 903, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "East Peoria Community High School": {
    "natl": 9571, "state": 328,
    "sat": 882, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Morton High School": {
    "natl": 1743, "state": 76,
    "sat": 1055, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Washington Community High School": {
    "natl": 1838, "state": 80,
    "sat": 1046, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Illinois Valley Central High School": {
    "natl": 5120, "state": 200,
    "sat": 945, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Limestone Community High School": {
    "natl": 9274, "state": 317,
    "sat": 902, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Peoria Heights High School": {
    "natl": 15702, "state": 572,
    "natlBand": "13,460–17,945", "stateBand": "469–675",
    "sat": 859, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Eureka High School": {
    "natl": 6724, "state": 252,
    "sat": 1067, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
  "Metamora Township High School": {
    "natl": 2432, "state": 99,
    "sat": 1018, "act": null, "satYear": 2024, "satSource": "ISBE 2024 Illinois Report Card"
  },
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
  }
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

  // ── ROCKFORD METRO (IL) ──────────────────────────────────────────────────
  'Rockford': {
    hs: ['Auburn High School', 'Rockford East High School', 'Guilford High School', 'Jefferson High School'],
    district: 'Rockford Public Schools 205',
    usNewsNational: 4485, usNewsState: 176,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Rockford Public Schools 205 splits students across 4 comprehensive high schools by address (Auburn, East, Guilford, Jefferson); Auburn ranks highest in the district at 176th in Illinois.'
  },
  'Belvidere': {
    hs: ['Belvidere High School', 'Belvidere North High School'],
    district: 'Belvidere CUSD 100',
    usNewsNational: 9765, usNewsState: 334,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Belvidere CUSD 100 splits by address between Belvidere High (334th in IL) and the newer Belvidere North High (243rd in IL).'
  },
  'Loves Park': {
    hs: 'Harlem High School',
    district: 'Harlem UD 122',
    usNewsNational: 4245, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Most of Loves Park feeds Harlem High School (166th in Illinois); a portion of the town falls in neighboring Belvidere CUSD 100 instead.'
  },
  'Machesney Park': {
    hs: 'Harlem High School',
    district: 'Harlem UD 122',
    usNewsNational: 4245, usNewsState: 166,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Harlem High School (Harlem UD 122) serves most of Machesney Park, ranked 166th in Illinois.'
  },
  'Roscoe': {
    hs: 'Hononegah High School',
    district: 'Hononegah CHD 207',
    usNewsNational: 1185, usNewsState: 56,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Hononegah High School (in neighboring Rockton) is the shared high school for both Roscoe and Rockton, ranked 56th in Illinois -- the strongest school in the Rockford metro.'
  },
  'Rockton': {
    hs: 'Hononegah High School',
    district: 'Hononegah CHD 207',
    usNewsNational: 1185, usNewsState: 56,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Hononegah High School, ranked 56th in Illinois, serves both Rockton and Roscoe -- the strongest school in the Rockford metro.'
  },
  'South Beloit': {
    hs: 'South Beloit Senior High School',
    district: 'County of Winnebago SD 320',
    usNewsNational: 6243, usNewsState: 236,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'South Beloit Senior High School, ranked 236th in Illinois, sits on the Wisconsin state line.'
  },
  'Candlewick Lake': {
    hs: ['Belvidere North High School', 'North Boone High School'],
    district: ['Belvidere CUSD 100', 'North Boone CUSD 200'],
    usNewsNational: 6427, usNewsState: 243,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Candlewick Lake (unincorporated) splits by address between Belvidere North High (243rd in IL) and North Boone High in Poplar Grove (402nd in IL).'
  },

  // ── PEORIA METRO (IL) ────────────────────────────────────────────────────
  'Peoria': {
    hs: ['Peoria High School', 'Manual High School', 'Richwoods High School'],
    district: 'Peoria Public Schools 150',
    usNewsNational: 4382, usNewsState: 173,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'Peoria Public Schools 150 splits by address across 3 comprehensive high schools; Richwoods (173rd in IL) is the strongest, while Peoria High and Manual both fall in U.S. News’ unranked bottom band.'
  },
  'Pekin': {
    hs: 'Pekin Community High School',
    district: 'Pekin CHSD 303',
    usNewsNational: 5604, usNewsState: 220,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Pekin Community High School ranks 220th in Illinois.'
  },
  'East Peoria': {
    hs: 'East Peoria Community High School',
    district: 'East Peoria CHSD 309',
    usNewsNational: 9571, usNewsState: 328,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'East Peoria Community High School (328th in IL) also serves neighboring Creve Coeur.'
  },
  'Morton': {
    hs: 'Morton High School',
    district: 'Morton CUSD 709',
    usNewsNational: 1743, usNewsState: 76,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Morton High School ranks 76th in Illinois, the strongest school in the Peoria metro; a small section of Morton falls in East Peoria CHSD 309 instead.'
  },
  'Washington': {
    hs: 'Washington Community High School',
    district: 'Washington CHSD 308',
    usNewsNational: 1838, usNewsState: 80,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Washington Community High School ranks 80th in Illinois.'
  },
  'Chillicothe': {
    hs: 'Illinois Valley Central High School',
    district: 'IVC USD 321',
    usNewsNational: 5120, usNewsState: 200,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Illinois Valley Central High School ranks 200th in Illinois.'
  },
  'Bartonville': {
    hs: 'Limestone Community High School',
    district: 'Limestone CHSD 310',
    usNewsNational: 9274, usNewsState: 317,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Limestone Community High School (317th in IL) serves most of Bartonville; a small eastern edge falls in Peoria Public Schools 150 instead.'
  },
  'Peoria Heights': {
    hs: 'Peoria Heights High School',
    district: 'Peoria Heights CUSD 325',
    usNewsNational: 15702, usNewsState: 572,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Peoria Heights High School falls in U.S. News’ unranked bottom band (state 469–675th) for the 2026-27 edition.'
  },
  'Eureka': {
    hs: 'Eureka High School',
    district: 'Eureka CUD 140',
    usNewsNational: 6724, usNewsState: 252,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Eureka High School ranks 252nd in Illinois.'
  },
  'Creve Coeur': {
    hs: 'East Peoria Community High School',
    district: 'East Peoria CHSD 309',
    usNewsNational: 9571, usNewsState: 328,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Creve Coeur shares East Peoria Community High School (328th in IL) with neighboring East Peoria.'
  },
  'West Peoria': {
    hs: ['Limestone Community High School', 'Peoria High School'],
    district: ['Limestone CHSD 310', 'Peoria Public Schools 150'],
    usNewsNational: 9274, usNewsState: 317,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    splitDistrict: true,
    note: 'West Peoria splits by address between Limestone Community High (317th in IL) and Peoria High (unranked bottom band).'
  },
  'Metamora': {
    hs: 'Metamora Township High School',
    district: 'Woodford County THSD 21',
    usNewsNational: 2432, usNewsState: 99,
    stateGrade: null, niche: null, avgACT: null, avgSAT: null,
    note: 'Metamora Township High School ranks 99th in Illinois.'
  },

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

};
