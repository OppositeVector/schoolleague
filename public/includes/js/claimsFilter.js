/**
 * Created by NatalieMenahem on 14/01/2016.
 */

var weights = [
    [ 100 ],
    [ 60, 40 ],
    [ 50, 30, 20 ],
    [ 45, 25, 20, 10 ],
    [ 40, 20, 17.5, 12.5, 10 ]
]

// Claims are offset by -1 because the first claim stands on index 0, but its name is claim1
var criteria = [
    {
        name: "Teachers Satisfaction",
        id: 0,
        claims: [ 0, 5, 13, 36, 48, 68 ]
    },
    {
        name: "Student Satisfaction",
        id: 1,
        claims: [ 44, 45, 58, 63 ]
    },
    {
        name: "Student Safty",
        id: 2,
        claims: [ 3, 11, 17, 24, 33, 34, 43, 46, 47, 52, 53, 60, 62, 70, 76 ]
    },
    {
        name: "Class Management",
        id: 3,
        claims: [ 18, 57, 78 ]
    },
    {
        name: "School Attitude on Violence",
        id: 4,
        claims: [ 1, 12, 71, 72, 77 ]
    },
    {
        name: "Teacher Personal Treatment",
        id: 5,
        claims: [ 8, 16, 22, 25, 26, 27, 31, 39, 49, 54, 66, 80 ]
    },
    {
        name: "Teacher Learning Treatment",
        id: 6,
        claims: [ 2, 9, 10, 15, 19, 32, 35, 37, 38, 41, 55, 56, 61, 65, 67, 74, 75 ]
    },
    {
        name: "Student Attitude Towards School",
        id: 7,
        claims: [ 29, 42, 79 ]
    },
    {
        name: "Social Attitude and Activities",
        id: 8,
        claims: [ 4, 14, 20, 28, 30, 40, 50, 51, 64, 69 ]
    },
    {
        name: "Differential Learning",
        id: 9,
        claims: [ 6, 7, 21, 23, 59, 73 ]
    }
]