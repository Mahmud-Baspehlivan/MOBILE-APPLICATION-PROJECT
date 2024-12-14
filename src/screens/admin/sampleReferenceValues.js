import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";

const sampleReferenceValues = {
  article1: {
    name: "kilavuz-turkjmedsci",
    values: {
      IgA: {
        "0-30 days": {
          min: 0.0667,
          max: 0.0875,
          geoMean: { value: 0.0677, sd: 0.0045 },
          mean: { value: 0.0679, sd: 0.0045 },
          confidenceInterval: [0.0662, 0.0695],
        },
        "1-3 months": {
          min: 0.0667,
          max: 0.246,
          geoMean: { value: 0.0958, sd: 0.0516 },
          mean: { value: 0.1053, sd: 0.0516 },
          confidenceInterval: [0.0857, 0.1249],
        },
        "4-6 months": {
          min: 0.0667,
          max: 0.53,
          geoMean: { value: 0.1723, sd: 0.0977 },
          mean: { value: 0.1986, sd: 0.0977 },
          confidenceInterval: [0.147, 0.2501],
        },
        "7-12 months": {
          min: 0.0668,
          max: 1.14,
          geoMean: { value: 0.2363, sd: 0.1237 },
          mean: { value: 0.2941, sd: 0.1237 },
          confidenceInterval: [0.2106, 0.3777],
        },
        "13-24 months": {
          min: 0.131,
          max: 1.03,
          geoMean: { value: 0.3409, sd: 0.171 },
          mean: { value: 0.3762, sd: 0.171 },
          confidenceInterval: [0.3134, 0.4785],
        },
        "25-36 months": {
          min: 0.0667,
          max: 1.35,
          geoMean: { value: 0.4887, sd: 0.2452 },
          mean: { value: 0.5977, sd: 0.2452 },
          confidenceInterval: [0.4605, 0.7138],
        },
        "3-5 years": {
          min: 0.357,
          max: 1.92,
          geoMean: { value: 0.6275, sd: 0.3405 },
          mean: { value: 0.6898, sd: 0.3405 },
          confidenceInterval: [0.5627, 0.817],
        },
        "6-8 years": {
          min: 0.448,
          max: 2.76,
          geoMean: { value: 0.9738, sd: 0.4966 },
          mean: { value: 1.069, sd: 0.4966 },
          confidenceInterval: [0.8836, 1.2545],
        },
        "9-11 years": {
          min: 0.326,
          max: 2.62,
          geoMean: { value: 1.0227, sd: 0.4705 },
          mean: { value: 1.1599, sd: 0.4705 },
          confidenceInterval: [0.9469, 1.3729],
        },
        "12-16 years": {
          min: 0.364,
          max: 3.05,
          geoMean: { value: 1.1216, sd: 0.4751 },
          mean: { value: 1.209, sd: 0.4751 },
          confidenceInterval: [0.9929, 1.7211],
        },
        "16-18 years": {
          min: 0.463,
          max: 3.85,
          geoMean: { value: 1.7921, sd: 0.8992 },
          mean: { value: 2.0184, sd: 0.8992 },
          confidenceInterval: [1.6826, 2.3541],
        },
      },
      IgM: {
        "0-30 days": {
          min: 0.051,
          max: 0.509,
          geoMean: { value: 0.1689, sd: 0.0887 },
          mean: { value: 0.2038, sd: 0.0887 },
          confidenceInterval: [0.1557, 0.2518],
        },
        "1-3 months": {
          min: 0.152,
          max: 0.685,
          geoMean: { value: 0.3421, sd: 0.1355 },
          mean: { value: 0.3666, sd: 0.1355 },
          confidenceInterval: [0.316, 0.4172],
        },
        "4-6 months": {
          min: 0.269,
          max: 1.3,
          geoMean: { value: 0.6905, sd: 0.2973 },
          mean: { value: 0.7544, sd: 0.2973 },
          confidenceInterval: [0.6434, 0.8654],
        },
        "7-12 months": {
          min: 0.242,
          max: 1.62,
          geoMean: { value: 0.7342, sd: 0.3576 },
          mean: { value: 0.8105, sd: 0.3576 },
          confidenceInterval: [0.677, 0.9441],
        },
        "13-24 months": {
          min: 0.386,
          max: 1.95,
          geoMean: { value: 1.1525, sd: 0.4163 },
          mean: { value: 1.2257, sd: 0.4163 },
          confidenceInterval: [1.0703, 1.3812],
        },
        "25-36 months": {
          min: 0.427,
          max: 2.36,
          geoMean: { value: 1.0466, sd: 0.4055 },
          mean: { value: 1.1131, sd: 0.4055 },
          confidenceInterval: [0.9617, 1.2646],
        },
        "3-5 years": {
          min: 0.587,
          max: 1.98,
          geoMean: { value: 1.156, sd: 0.3924 },
          mean: { value: 1.2179, sd: 0.3924 },
          confidenceInterval: [1.0713, 1.3644],
        },
        "6-8 years": {
          min: 0.503,
          max: 2.42,
          geoMean: { value: 1.0805, sd: 0.4127 },
          mean: { value: 1.1473, sd: 0.4127 },
          confidenceInterval: [0.9932, 1.3014],
        },
        "9-11 years": {
          min: 0.374,
          max: 2.13,
          geoMean: { value: 1.0495, sd: 0.4368 },
          mean: { value: 1.1318, sd: 0.4368 },
          confidenceInterval: [0.9687, 1.2949],
        },
        "12-16 years": {
          min: 0.424,
          max: 1.97,
          geoMean: { value: 1.1916, sd: 0.3931 },
          mean: { value: 1.2578, sd: 0.3931 },
          confidenceInterval: [1.111, 1.4046],
        },
        "16-18 years": {
          min: 0.607,
          max: 3.23,
          geoMean: { value: 1.306, sd: 0.6432 },
          mean: { value: 1.4254, sd: 0.6432 },
          confidenceInterval: [1.1853, 1.6655],
        },
      },
      IgG: {
        "0-30 days": {
          min: 3.99,
          max: 14.8,
          geoMean: { value: 9.1385, sd: 2.6219 },
          mean: { value: 9.53, sd: 2.6219 },
          confidenceInterval: [8.551, 10.509],
        },
        "1-3 months": {
          min: 2.17,
          max: 9.81,
          geoMean: { value: 4.0986, sd: 1.4559 },
          mean: { value: 4.295, sd: 1.4559 },
          confidenceInterval: [3.7514, 4.8386],
        },
        "4-6 months": {
          min: 2.7,
          max: 11.1,
          geoMean: { value: 4.4017, sd: 2.368 },
          mean: { value: 4.8243, sd: 2.368 },
          confidenceInterval: [3.9401, 5.7086],
        },
        "7-12 months": {
          min: 2.42,
          max: 9.77,
          geoMean: { value: 5.3679, sd: 1.8662 },
          mean: { value: 5.6897, sd: 1.8662 },
          confidenceInterval: [4.9928, 6.3865],
        },
        "13-24 months": {
          min: 3.89,
          max: 12.6,
          geoMean: { value: 7.2679, sd: 2.3861 },
          mean: { value: 7.617, sd: 2.3861 },
          confidenceInterval: [6.726, 8.508],
        },
        "25-36 months": {
          min: 4.86,
          max: 19.7,
          geoMean: { value: 7.8641, sd: 2.4914 },
          mean: { value: 8.115, sd: 2.4914 },
          confidenceInterval: [7.1847, 9.0453],
        },
        "3-5 years": {
          min: 4.57,
          max: 11.2,
          geoMean: { value: 8.2319, sd: 1.6419 },
          mean: { value: 8.3987, sd: 1.6419 },
          confidenceInterval: [7.7856, 9.0118],
        },
        "6-8 years": {
          min: 4.83,
          max: 15.8,
          geoMean: { value: 9.8286, sd: 2.5553 },
          mean: { value: 10.1493, sd: 2.5553 },
          confidenceInterval: [9.1952, 11.1035],
        },
        "9-11 years": {
          min: 6.42,
          max: 22.9,
          geoMean: { value: 10.1612, sd: 3.2227 },
          mean: { value: 10.5543, sd: 3.2227 },
          confidenceInterval: [9.3509, 11.7577],
        },
        "12-16 years": {
          min: 6.36,
          max: 16.1,
          geoMean: { value: 11.2356, sd: 2.0383 },
          mean: { value: 11.4207, sd: 2.0383 },
          confidenceInterval: [10.6596, 12.1818],
        },
        "16-18 years": {
          min: 6.88,
          max: 24.3,
          geoMean: { value: 12.772, sd: 3.6189 },
          mean: { value: 13.2277, sd: 3.6189 },
          confidenceInterval: [11.8763, 14.579],
        },
      },
      IgG1: {
        "25-36 months": {
          min: 3.09,
          max: 14.5,
          geoMean: { value: 5.1074, sd: 1.9204 },
          mean: { value: 5.317, sd: 1.9204 },
          confidenceInterval: [4.5998, 6.0341],
        },
        "3-5 years": {
          min: 2.73,
          max: 6.79,
          geoMean: { value: 5.0673, sd: 0.8228 },
          mean: { value: 5.1393, sd: 0.8228 },
          confidenceInterval: [4.832, 5.4465],
        },
        "6-8 years": {
          min: 2.92,
          max: 7.81,
          geoMean: { value: 5.6794, sd: 1.2164 },
          mean: { value: 5.81, sd: 1.2164 },
          confidenceInterval: [5.3587, 6.2672],
        },
        "9-11 years": {
          min: 4.1,
          max: 15.3,
          geoMean: { value: 6.3417, sd: 2.1639 },
          mean: { value: 6.6023, sd: 2.1639 },
          confidenceInterval: [5.7943, 7.4103],
        },
        "12-16 years": {
          min: 3.44,
          max: 9.58,
          geoMean: { value: 6.3552, sd: 1.3101 },
          mean: { value: 6.4853, sd: 1.3101 },
          confidenceInterval: [5.9961, 6.9745],
        },
        "16-18 years": {
          min: 4.03,
          max: 15.2,
          geoMean: { value: 6.4535, sd: 2.2962 },
          mean: { value: 6.745, sd: 2.2962 },
          confidenceInterval: [5.8875, 7.6024],
        },
      },
      IgG2: {
        "25-36 months": {
          min: 0.876,
          max: 2.89,
          geoMean: { value: 1.3788, sd: 0.3859 },
          mean: { value: 1.4198, sd: 0.3859 },
          confidenceInterval: [1.2757, 1.5639],
        },
        "3-5 years": {
          min: 0.733,
          max: 2.71,
          geoMean: { value: 1.4392, sd: 0.508 },
          mean: { value: 1.5195, sd: 0.508 },
          confidenceInterval: [1.3298, 1.7092],
        },
        "6-8 years": {
          min: 0.881,
          max: 4.08,
          geoMean: { value: 1.9657, sd: 0.8641 },
          mean: { value: 2.1367, sd: 0.8641 },
          confidenceInterval: [1.814, 2.4593],
        },
        "9-11 years": {
          min: 0.81,
          max: 4.42,
          geoMean: { value: 2.5067, sd: 0.8572 },
          mean: { value: 2.6556, sd: 0.8572 },
          confidenceInterval: [2.3355, 2.9757],
        },
        "12-16 years": {
          min: 1.59,
          max: 4.06,
          geoMean: { value: 2.6162, sd: 0.6914 },
          mean: { value: 2.7023, sd: 0.6914 },
          confidenceInterval: [2.4441, 2.9605],
        },
        "16-18 years": {
          min: 1.84,
          max: 6.96,
          geoMean: { value: 3.5976, sd: 1.1584 },
          mean: { value: 3.759, sd: 1.1584 },
          confidenceInterval: [3.326, 4.1915],
        },
      },
      IgG3: {
        "25-36 months": {
          min: 0.198,
          max: 0.75,
          geoMean: { value: 0.4878, sd: 0.169 },
          mean: { value: 0.5173, sd: 0.169 },
          confidenceInterval: [0.4541, 0.5804],
        },
        "3-5 years": {
          min: 0.208,
          max: 0.932,
          geoMean: { value: 0.4405, sd: 0.2155 },
          mean: { value: 0.4526, sd: 0.2155 },
          confidenceInterval: [0.3721, 0.533],
        },
        "6-8 years": {
          min: 0.189,
          max: 1.35,
          geoMean: { value: 0.5682, sd: 0.3055 },
          mean: { value: 0.6553, sd: 0.3055 },
          confidenceInterval: [0.5301, 0.7806],
        },
        "9-11 years": {
          min: 0.341,
          max: 2,
          geoMean: { value: 0.7759, sd: 0.3737 },
          mean: { value: 0.8419, sd: 0.3737 },
          confidenceInterval: [0.7024, 0.9815],
        },
        "12-16 years": {
          min: 0.352,
          max: 1.5,
          geoMean: { value: 0.753, sd: 0.3186 },
          mean: { value: 0.8139, sd: 0.3186 },
          confidenceInterval: [0.6949, 0.9328],
        },
        "16-18 years": {
          min: 0.293,
          max: 2,
          geoMean: { value: 0.8633, sd: 0.4329 },
          mean: { value: 0.9512, sd: 0.4329 },
          confidenceInterval: [0.7895, 1.1128],
        },
      },
      IgG4: {
        "25-36 months": {
          min: 0.0786,
          max: 0.575,
          geoMean: { value: 0.1553, sd: 0.0854 },
          mean: { value: 0.1837, sd: 0.0854 },
          confidenceInterval: [0.1367, 0.2307],
        },
        "3-5 years": {
          min: 0.0786,
          max: 1.22,
          geoMean: { value: 0.3081, sd: 0.1542 },
          mean: { value: 0.4075, sd: 0.1542 },
          confidenceInterval: [0.2884, 0.5265],
        },
        "6-8 years": {
          min: 0.0786,
          max: 1.57,
          geoMean: { value: 0.3933, sd: 0.2305 },
          mean: { value: 0.5094, sd: 0.2305 },
          confidenceInterval: [0.3711, 0.6477],
        },
        "9-11 years": {
          min: 0.0786,
          max: 0.938,
          geoMean: { value: 0.2536, sd: 0.1539 },
          mean: { value: 0.3551, sd: 0.1539 },
          confidenceInterval: [0.2495, 0.4607],
        },
        "12-16 years": {
          min: 0.0786,
          max: 1.19,
          geoMean: { value: 0.3103, sd: 0.1673 },
          mean: { value: 0.3931, sd: 0.1673 },
          confidenceInterval: [0.2953, 0.4949],
        },
        "16-18 years": {
          min: 0.0786,
          max: 1.57,
          geoMean: { value: 0.3889, sd: 0.2308 },
          mean: { value: 0.5016, sd: 0.2308 },
          confidenceInterval: [0.3632, 0.6401],
        },
      },
    },
  },
  article2: {
    name: "kilavuz-ap",
    values: {
      IgA: {
        "0-5 months": { confidenceInterval: [0.07, 0.37] },
        "5-9 months": { confidenceInterval: [0.16, 0.5] },
        "9-15 months": { confidenceInterval: [0.27, 0.66] },
        "15-24 months": { confidenceInterval: [0.36, 0.79] },
        "2-4 years": { confidenceInterval: [0.27, 2.46] },
        "4-7 years": { confidenceInterval: [0.29, 2.56] },
        "7-10 years": { confidenceInterval: [0.34, 2.74] },
        "10-13 years": { confidenceInterval: [0.42, 2.95] },
        "13-16 years": { confidenceInterval: [0.52, 3.19] },
        "16-18 years": { confidenceInterval: [0.6, 3.37] },
        "Older than 18 years": { confidenceInterval: [0.61, 3.56] },
      },
      IgM: {
        "0-5 months": { confidenceInterval: [0.26, 1.22] },
        "5-9 months": { confidenceInterval: [0.32, 1.32] },
        "9-15 months": { confidenceInterval: [0.4, 1.43] },
        "15-24 months": { confidenceInterval: [0.46, 1.52] },
        "2-4 years": { confidenceInterval: [0.37, 1.84] },
        "4-7 years": { confidenceInterval: [0.37, 2.24] },
        "7-10 years": { confidenceInterval: [0.38, 2.51] },
        "10-13 years": { confidenceInterval: [0.41, 2.55] },
        "13-16 years": { confidenceInterval: [0.45, 2.44] },
        "16-18 years": { confidenceInterval: [0.49, 2.01] },
        "Older than 18 years": { confidenceInterval: [0.37, 2.86] },
      },
      IgG: {
        "0-5 months": { confidenceInterval: [1.0, 1.34] },
        "5-9 months": { confidenceInterval: [1.64, 5.88] },
        "9-15 months": { confidenceInterval: [2.46, 9.04] },
        "15-24 months": { confidenceInterval: [3.13, 11.7] },
        "2-4 years": { confidenceInterval: [2.95, 11.56] },
        "4-7 years": { confidenceInterval: [3.86, 14.7] },
        "7-10 years": { confidenceInterval: [4.62, 16.82] },
        "10-13 years": { confidenceInterval: [5.03, 15.8] },
        "13-16 years": { confidenceInterval: [5.09, 15.8] },
        "16-18 years": { confidenceInterval: [4.87, 13.27] },
        "Older than 18 years": { confidenceInterval: [7.67, 15.9] },
      },
      IgG1: {
        "0-5 months": { confidenceInterval: [0.56, 2.15] },
        "5-9 months": { confidenceInterval: [1.02, 3.69] },
        "9-15 months": { confidenceInterval: [1.6, 5.62] },
        "15-24 months": { confidenceInterval: [2.09, 7.24] },
        "2-4 years": { confidenceInterval: [1.58, 7.21] },
        "4-7 years": { confidenceInterval: [2.09, 9.02] },
        "7-10 years": { confidenceInterval: [2.53, 10.19] },
        "10-13 years": { confidenceInterval: [2.8, 10.3] },
        "13-16 years": { confidenceInterval: [2.89, 9.34] },
        "16-18 years": { confidenceInterval: [2.83, 7.72] },
        "Older than 18 years": { confidenceInterval: [3.41, 8.94] },
      },
      IgG2: {
        "0-5 months": { confidenceInterval: [0, 0.82] },
        "5-9 months": { confidenceInterval: [0, 0.89] },
        "9-15 months": { confidenceInterval: [0.24, 0.98] },
        "15-24 months": { confidenceInterval: [0.35, 1.05] },
        "2-4 years": { confidenceInterval: [0.39, 1.76] },
        "4-7 years": { confidenceInterval: [0.44, 3.16] },
        "7-10 years": { confidenceInterval: [0.54, 4.35] },
        "10-13 years": { confidenceInterval: [0.66, 5.02] },
        "13-16 years": { confidenceInterval: [0.82, 5.16] },
        "16-18 years": { confidenceInterval: [0.98, 4.86] },
        "Older than 18 years": { confidenceInterval: [1.71, 6.32] },
      },
      IgG3: {
        "0-5 months": { confidenceInterval: [0.076, 8.23] },
        "5-9 months": { confidenceInterval: [0.119, 0.74] },
        "9-15 months": { confidenceInterval: [0.173, 0.637] },
        "15-24 months": { confidenceInterval: [0.219, 0.55] },
        "2-4 years": { confidenceInterval: [0.17, 0.847] },
        "4-7 years": { confidenceInterval: [0.108, 0.949] },
        "7-10 years": { confidenceInterval: [0.085, 10.26] },
        "10-13 years": { confidenceInterval: [0.115, 10.53] },
        "13-16 years": { confidenceInterval: [0.2, 10.32] },
        "16-18 years": { confidenceInterval: [0.313, 0.976] },
        "Older than 18 years": { confidenceInterval: [0.184, 10.6] },
      },
      IgG4: {
        "0-5 months": { confidenceInterval: [0, 0.198] },
        "5-9 months": { confidenceInterval: [0, 0.208] },
        "9-15 months": { confidenceInterval: [0, 0.22] },
        "15-24 months": { confidenceInterval: [0, 0.23] },
        "2-4 years": { confidenceInterval: [0.004, 0.491] },
        "4-7 years": { confidenceInterval: [0.008, 0.819] },
        "7-10 years": { confidenceInterval: [0.01, 1.087] },
        "10-13 years": { confidenceInterval: [0.01, 1.219] },
        "13-16 years": { confidenceInterval: [0.007, 1.217] },
        "16-18 years": { confidenceInterval: [0.003, 1.11] },
        "Older than 18 years": { confidenceInterval: [0.024, 1.21] },
      },
    },
  },
  article3: {
    name: "kilavuz-cilv",
    values: {
      IgA: {
        "0-1 months": { min: 0, max: 0.11 },
        "1-4 months": { min: 0.06, max: 0.5 },
        "4-7 months": { min: 0.08, max: 0.9 },
        "7-13 months": { min: 0.16, max: 1 },
        "1-3 years": { min: 0.2, max: 2.3 },
        "3-6 years": { min: 0.5, max: 1.5 },
        "Older than 6 years": { min: 0.7, max: 3.12 },
      },
      IgM: {
        "0-1 months": { min: 0.05, max: 0.3 },
        "1-4 months": { min: 0.15, max: 0.7 },
        "4-7 months": { min: 0.1, max: 0.9 },
        "7-13 months": { min: 0.25, max: 1.15 },
        "1-3 years": { min: 0.3, max: 1.2 },
        "3-6 years": { min: 0.22, max: 1 },
        "Older than 6 years": { min: 0.56, max: 3.52 },
      },
      IgG: {
        "0-1 months": { min: 7, max: 13 },
        "1-4 months": { min: 2.8, max: 7.5 },
        "4-7 months": { min: 2, max: 12 },
        "7-13 months": { min: 3, max: 15 },
        "1-3 years": { min: 4, max: 13 },
        "3-6 years": { min: 6, max: 15 },
        "Older than 6 years": { min: 6.39, max: 13.44 },
      },
      IgG1: {
        "0-3 months": { min: 2.18, max: 4.96 },
        "3-6 months": { min: 1.43, max: 3.94 },
        "6-9 months": { min: 1.9, max: 3.88 },
        "9 mo-2 yr": { min: 2.86, max: 6.8 },
        "2-4 years": { min: 3.81, max: 8.84 },
        "4-6 years": { min: 2.92, max: 8.16 },
        "6-8 years": { min: 4.22, max: 8.02 },
        "8-10 years": { min: 4.56, max: 9.38 },
        "10-12 years": { min: 4.56, max: 9.52 },
        "12-14 years": { min: 3.47, max: 9.93 },
        "Older than 14 years": { min: 4.22, max: 12.92 },
      },
      IgG2: {
        "0-3 months": { min: 0.4, max: 4.53 },
        "3-6 months": { min: 0.23, max: 1.47 },
        "6-9 months": { min: 0.37, max: 0.6 },
        "9 mo-2 yr": { min: 0.3, max: 3.27 },
        "2-4 years": { min: 0.7, max: 4.43 },
        "4-6 years": { min: 0.83, max: 5.13 },
        "6-8 years": { min: 1.13, max: 4.8 },
        "8-10 years": { min: 1.63, max: 5.13 },
        "10-12 years": { min: 1.47, max: 4.93 },
        "12-14 years": { min: 1.4, max: 4.4 },
        "Older than 14 years": { min: 1.17, max: 7.47 },
      },
      IgG3: {
        "0-3 months": { min: 4, max: 23 },
        "3-6 months": { min: 4, max: 100 },
        "6-9 months": { min: 12, max: 62 },
        "9 mo-2 yr": { min: 13, max: 82 },
        "2-4 years": { min: 17, max: 90 },
        "4-6 years": { min: 8, max: 111 },
        "6-8 years": { min: 15, max: 133 },
        "8-10 years": { min: 26, max: 113 },
        "10-12 years": { min: 12, max: 179 },
        "12-14 years": { min: 23, max: 117 },
        "Older than 14 years": { min: 41, max: 129 },
      },
      IgG4: {
        "0-3 months": { min: 0.01, max: 1.2 },
        "3-6 months": { min: 0.01, max: 1.2 },
        "6-9 months": { min: 0.01, max: 1.2 },
        "9 mo-2 yr": { min: 0.01, max: 1.2 },
        "2-4 years": { min: 0.01, max: 1.2 },
        "4-6 years": { min: 0.02, max: 1.12 },
        "6-8 years": { min: 0.01, max: 1.38 },
        "8-10 years": { min: 0.01, max: 0.95 },
        "10-12 years": { min: 0.01, max: 1.53 },
        "12-14 years": { min: 0.01, max: 1.43 },
        "Older than 14 years": { min: 0.1, max: 0.67 },
      },
    },
  },
  article4: {
    name: "kilavuz-os",
    values: {
      IgA: {
        "1-3 months": {
          min: 0.06,
          max: 0.47,
          geoMean: { value: 0.1595, sd: 0.1202 },
          confidenceInterval: [0, 0.3636],
        },
        "4-6 months": {
          min: 0.07,
          max: 0.63,
          geoMean: { value: 0.1995, sd: 0.127 },
          confidenceInterval: [0, 0.5339],
        },
        "7-12 months": {
          min: 0.12,
          max: 1.14,
          geoMean: { value: 0.3575, sd: 0.2329 },
          confidenceInterval: [0, 0.7226],
        },
        "13-24 months": {
          min: 0.15,
          max: 0.52,
          geoMean: { value: 0.3735, sd: 0.1095 },
          confidenceInterval: [0, 0.939],
        },
        "25-36 months": {
          min: 0.24,
          max: 0.84,
          geoMean: { value: 0.542, sd: 0.1604 },
          confidenceInterval: [0.0229, 1.1923],
        },
        "3-5 years": {
          // ONEMLI NOT: Normalde 4-5 yas ama referansta bosluk oldugu icin 3-5 yas olarak alindi.
          min: 0.55,
          max: 1.35,
          geoMean: { value: 0.9435, sd: 0.209 },
          confidenceInterval: [0.1324, 1.4916],
        },
        "5-8 years": {
          // ONEMLI NOT: Normalde 6-8 yas ama referansta bosluk oldugu icin 5-8 yas olarak alindi.
          min: 0.81,
          max: 2.64,
          geoMean: { value: 1.3025, sd: 0.4741 },
          confidenceInterval: [0.2973, 1.8463],
        },
        "8-11 years": {
          min: 0.78,
          max: 3.34,
          geoMean: { value: 1.6045, sd: 0.7056 },
          confidenceInterval: [0.5267, 2.2655],
        },
        "11-16 years": {
          min: 0.87,
          max: 2.34,
          geoMean: { value: 1.6364, sd: 0.4958 },
          confidenceInterval: [0.8299, 2.7584],
        },
      },
      IgM: {
        "1-3 months": {
          min: 0.18,
          max: 0.87,
          geoMean: { value: 0.347, sd: 0.1648 },
          confidenceInterval: [0.0278, 0.6358],
        },
        "4-6 months": {
          min: 0.18,
          max: 1.36,
          geoMean: { value: 0.5015, sd: 0.2571 },
          confidenceInterval: [0.1156, 0.8945],
        },
        "7-12 months": {
          min: 0.28,
          max: 1.15,
          geoMean: { value: 0.5795, sd: 0.2125 },
          confidenceInterval: [0.1959, 1.1457],
        },
        "13-24 months": {
          min: 0.32,
          max: 1.48,
          geoMean: { value: 0.854, sd: 0.3653 },
          confidenceInterval: [0.2648, 1.3856],
        },
        "25-36 months": {
          min: 0.47,
          max: 1.44,
          geoMean: { value: 1.0045, sd: 0.2558 },
          confidenceInterval: [0.3187, 1.6104],
        },
        "3-5 years": {
          min: 0.65,
          max: 2.05,
          geoMean: { value: 1.211, sd: 0.3733 },
          confidenceInterval: [0.3537, 1.8164],
        },
        "5-8 years": {
          min: 0.47,
          max: 1.98,
          geoMean: { value: 1.1815, sd: 0.3949 },
          confidenceInterval: [0.3661, 1.9998],
        },
        "8-11 years": {
          min: 0.38,
          max: 1.63,
          geoMean: { value: 1.022, sd: 0.3658 },
          confidenceInterval: [0.3521, 2.1567],
        },
        "11-16 years": {
          min: 0.47,
          max: 2.85,
          geoMean: { value: 1.436, sd: 0.5771 },
          confidenceInterval: [0.3079, 2.2835],
        },
      },
      IgG: {
        "1-3 months": {
          min: 2.27,
          max: 7.7,
          geoMean: { value: 4.3355, sd: 1.3711 },
          confidenceInterval: [0.4572, 6.7711],
        },
        "4-6 months": {
          min: 1.41,
          max: 8.85,
          geoMean: { value: 3.8215, sd: 1.7318 },
          confidenceInterval: [1.4142, 8.2552],
        },
        "7-12 months": {
          min: 3.5,
          max: 10.1,
          geoMean: { value: 6.1814, sd: 2.0078 },
          confidenceInterval: [2.3602, 9.7282],
        },
        "13-24 months": {
          min: 4.32,
          max: 9.9,
          geoMean: { value: 6.711, sd: 1.7786 },
          confidenceInterval: [3.2897, 11.1846],
        },
        "25-36 months": {
          min: 4.37,
          max: 13.2,
          geoMean: { value: 8.3475, sd: 1.9352 },
          confidenceInterval: [4.197, 12.6189],
        },
        "3-5 years": {
          min: 5.24,
          max: 14,
          geoMean: { value: 9.944, sd: 2.3668 },
          confidenceInterval: [5.0768, 14.0257],
        },
        "6-8 years": {
          min: 8.58,
          max: 16,
          geoMean: { value: 11.6275, sd: 2.2785 },
          confidenceInterval: [5.9234, 15.3992],
        },
        "8-11 years": {
          min: 6.45,
          max: 15.2,
          geoMean: { value: 11.771, sd: 2.4822 },
          confidenceInterval: [6.7313, 16.7342],
        },
        "11-16 years": {
          min: 8.77,
          max: 16.2,
          geoMean: { value: 12.1395, sd: 2.2963 },
          confidenceInterval: [7.4951, 18.0249],
        },
      },
    },
  },
  article5: {
    name: "kilavuz-tjp",
    values: {
      IgA: {
        "0-30 days": {
          min: 0.05,
          max: 0.058,
          geoMean: { value: 0.057, sd: 0.002 },
          confidenceInterval: [0.056, 0.059],
        },
        "1-5 months": {
          min: 0.058,
          max: 0.58,
          geoMean: { value: 0.202, sd: 0.197 },
          confidenceInterval: [0.158, 0.409],
        },
        "6-8 months": {
          min: 0.0588,
          max: 0.858,
          geoMean: { value: 0.232, sd: 0.252 },
          confidenceInterval: [0.205, 0.485],
        },
        "9-12 months": {
          min: 0.184,
          max: 1.54,
          geoMean: { value: 0.529, sd: 0.367 },
          confidenceInterval: [0.472, 0.769],
        },
        "13-24 months": {
          min: 0.115,
          max: 0.943,
          geoMean: { value: 0.441, sd: 0.183 },
          confidenceInterval: [0.429, 0.526],
        },
        "25-36 months": {
          min: 0.23,
          max: 1.3,
          geoMean: { value: 0.535, sd: 0.268 },
          confidenceInterval: [0.514, 0.663],
        },
        "37-48 months": {
          min: 0.407,
          max: 1.15,
          geoMean: { value: 0.688, sd: 0.222 },
          confidenceInterval: [0.648, 0.792],
        },
        "49-72 months": {
          min: 0.23,
          max: 2.051,
          geoMean: { value: 0.919, sd: 0.374 },
          confidenceInterval: [0.902, 1.083],
        },
        "7-8 years": {
          min: 0.361,
          max: 2.68,
          geoMean: { value: 1.084, sd: 0.423 },
          confidenceInterval: [1.059, 1.27],
        },
        "9-10 years": {
          min: 0.54,
          max: 2.68,
          geoMean: { value: 1.167, sd: 0.459 },
          confidenceInterval: [1.118, 1.37],
        },
        "11-12 years": {
          min: 0.27,
          max: 1.98,
          geoMean: { value: 1.158, sd: 0.43 },
          confidenceInterval: [1.097, 1.413],
        },
        "13-14 years": {
          min: 0.524,
          max: 2.25,
          geoMean: { value: 1.305, sd: 0.474 },
          confidenceInterval: [1.18, 1.59],
        },
        "15-16 years": {
          min: 0.48,
          max: 1.58,
          geoMean: { value: 1.098, sd: 0.294 },
          confidenceInterval: [0.978, 1.303],
        },
        "Older than 16 years": {
          min: 0.465,
          max: 2.21,
          geoMean: { value: 1.213, sd: 0.555 },
          confidenceInterval: [1.024, 1.638],
        },
      },
      IgM: {
        "0-30 days": {
          min: 0.173,
          max: 0.296,
          geoMean: { value: 0.185, sd: 0.035 },
          confidenceInterval: [0.167, 0.207],
        },
        "1-5 months": {
          min: 0.144,
          max: 1.45,
          geoMean: { value: 0.573, sd: 0.374 },
          confidenceInterval: [0.491, 0.921],
        },
        "6-8 months": {
          min: 0.264,
          max: 1.64,
          geoMean: { value: 0.682, sd: 0.389 },
          confidenceInterval: [0.585, 0.985],
        },
        "9-12 months": {
          min: 0.235,
          max: 1.8,
          geoMean: { value: 0.861, sd: 0.403 },
          confidenceInterval: [0.789, 1.108],
        },
        "13-24 months": {
          min: 0.254,
          max: 1.9,
          geoMean: { value: 0.925, sd: 0.339 },
          confidenceInterval: [0.809, 1.077],
        },
        "25-36 months": {
          min: 0.36,
          max: 1.99,
          geoMean: { value: 0.861, sd: 0.353 },
          confidenceInterval: [0.798, 1.06],
        },
        "37-48 months": {
          min: 0.254,
          max: 2.07,
          geoMean: { value: 1.058, sd: 0.463 },
          confidenceInterval: [1.037, 1.333],
        },
        "49-72 months": {
          min: 0.305,
          max: 2.2,
          geoMean: { value: 0.976, sd: 0.429 },
          confidenceInterval: [0.955, 1.168],
        },
        "7-8 years": {
          min: 0.305,
          max: 2.2,
          geoMean: { value: 0.939, sd: 0.456 },
          confidenceInterval: [0.86, 1.24],
        },
        "9-10 years": {
          min: 0.24,
          max: 1.87,
          geoMean: { value: 1.024, sd: 0.388 },
          confidenceInterval: [0.968, 1.24],
        },
        "11-12 years": {
          min: 0.264,
          max: 1.8,
          geoMean: { value: 0.983, sd: 0.43 },
          confidenceInterval: [0.963, 1.177],
        },
        "13-14 years": {
          min: 0.302,
          max: 2.2,
          geoMean: { value: 0.974, sd: 0.423 },
          confidenceInterval: [0.906, 1.24],
        },
        "15-16 years": {
          min: 0.485,
          max: 2.5,
          geoMean: { value: 1.047, sd: 0.448 },
          confidenceInterval: [0.965, 1.41],
        },
        "Older than 16 years": {
          min: 0.475,
          max: 2.4,
          geoMean: { value: 1.123, sd: 0.445 },
          confidenceInterval: [1.026, 1.512],
        },
      },
      IgG: {
        "0-30 days": {
          min: 4.92,
          max: 11.9,
          geoMean: { value: 8.842, sd: 2.304 },
          confidenceInterval: [7.92, 10.375],
        },
        "1-5 months": {
          min: 2.7,
          max: 7.92,
          geoMean: { value: 4.738, sd: 1.931 },
          confidenceInterval: [3.842, 6.297],
        },
        "6-8 months": {
          min: 2.68,
          max: 8.98,
          geoMean: { value: 5.819, sd: 2.079 },
          confidenceInterval: [5.156, 7.224],
        },
        "9-12 months": {
          min: 4.21,
          max: 11,
          geoMean: { value: 6.927, sd: 1.811 },
          confidenceInterval: [6.419, 7.882],
        },
        "13-24 months": {
          min: 3.65,
          max: 12,
          geoMean: { value: 7.744, sd: 1.997 },
          confidenceInterval: [7.848, 8.514],
        },
        "25-36 months": {
          min: 4.3,
          max: 12.9,
          geoMean: { value: 8.223, sd: 3.084 },
          confidenceInterval: [7.904, 9.604],
        },
        "37-48 months": {
          min: 5.39,
          max: 12,
          geoMean: { value: 8.799, sd: 1.972 },
          confidenceInterval: [8.441, 9.446],
        },
        "49-72 months": {
          min: 5.28,
          max: 14.9,
          geoMean: { value: 9.862, sd: 2.096 },
          confidenceInterval: [9.585, 10.585],
        },
        "7-8 years": {
          min: 5.27,
          max: 15.9,
          geoMean: { value: 10.407, sd: 2.032 },
          confidenceInterval: [10.115, 11.114],
        },
        "9-10 years": {
          min: 6.46,
          max: 16.2,
          geoMean: { value: 10.628, sd: 2.388 },
          confidenceInterval: [10.249, 11.577],
        },
        "11-12 years": {
          min: 5.79,
          max: 16.1,
          geoMean: { value: 10.517, sd: 2.289 },
          confidenceInterval: [9.959, 11.556],
        },
        "13-14 years": {
          min: 7.41,
          max: 16.5,
          geoMean: { value: 10.878, sd: 2.36 },
          confidenceInterval: [10.142, 12.09],
        },
        "15-16 years": {
          min: 6.66,
          max: 13.7,
          geoMean: { value: 9.811, sd: 2.077 },
          confidenceInterval: [8.953, 11.089],
        },
        "Older than 16 years": {
          min: 8.3,
          max: 18.2,
          geoMean: { value: 12.249, sd: 2.802 },
          confidenceInterval: [11.099, 13.98],
        },
      },
      IgG1: {
        "0-30 days": {
          min: 4.3,
          max: 8.97,
          geoMean: { value: 6.75, sd: 1.52 },
          confidenceInterval: [6.11, 7.73],
        },
        "1-5 months": {
          min: 1.6,
          max: 5.74,
          geoMean: { value: 3.19, sd: 1.13 },
          confidenceInterval: [2.61, 4.13],
        },
        "6-8 months": {
          min: 2.79,
          max: 8.2,
          geoMean: { value: 4.85, sd: 1.88 },
          confidenceInterval: [4.08, 6.25],
        },
        "9-12 months": {
          min: 3.28,
          max: 12.5,
          geoMean: { value: 5.62, sd: 2.4 },
          confidenceInterval: [5.06, 6.9],
        },
        "13-24 months": {
          min: 3.44,
          max: 14.35,
          geoMean: { value: 7.21, sd: 2.92 },
          confidenceInterval: [7.02, 8.44],
        },
        "25-36 months": {
          min: 3.4,
          max: 14.7,
          geoMean: { value: 7.36, sd: 2.85 },
          confidenceInterval: [7.26, 8.67],
        },
        "37-48 months": {
          min: 4.39,
          max: 13.33,
          geoMean: { value: 7.62, sd: 2.46 },
          confidenceInterval: [7.26, 8.37],
        },
        "49-72 months": {
          min: 4.28,
          max: 14.7,
          geoMean: { value: 7.55, sd: 2.09 },
          confidenceInterval: [7.34, 9.96],
        },
        "7-8 years": {
          min: 4.2,
          max: 14.7,
          geoMean: { value: 8.06, sd: 2.81 },
          confidenceInterval: [7.78, 9.2],
        },
        "9-10 years": {
          min: 4.86,
          max: 15.6,
          geoMean: { value: 8.6, sd: 3.29 },
          confidenceInterval: [8.34, 9.96],
        },
        "11-12 years": {
          min: 5.99,
          max: 15.6,
          geoMean: { value: 8.42, sd: 2.41 },
          confidenceInterval: [7.87, 9.53],
        },
        "13-14 years": {
          min: 4.9,
          max: 15.6,
          geoMean: { value: 8.72, sd: 3.54 },
          confidenceInterval: [8.05, 10.61],
        },
        "15-16 years": {
          min: 4.98,
          max: 14.6,
          geoMean: { value: 7.96, sd: 2.69 },
          confidenceInterval: [7.11, 9.56],
        },
        "Older than 16 years": {
          min: 5.28,
          max: 13.84,
          geoMean: { value: 8.57, sd: 2.14 },
          confidenceInterval: [7.82, 9.78],
        },
      },
      IgG2: {
        "0-30 days": {
          min: 0.87,
          max: 2.63,
          geoMean: { value: 1.56, sd: 0.5 },
          confidenceInterval: [1.35, 1.92],
        },
        "1-5 months": {
          min: 0.32,
          max: 1.08,
          geoMean: { value: 0.59, sd: 0.26 },
          confidenceInterval: [0.46, 0.84],
        },
        "6-8 months": {
          min: 0.36,
          max: 1.46,
          geoMean: { value: 0.67, sd: 0.37 },
          confidenceInterval: [0.53, 0.97],
        },
        "9-12 months": {
          min: 0.25,
          max: 1.61,
          geoMean: { value: 0.64, sd: 0.35 },
          confidenceInterval: [0.58, 0.85],
        },
        "13-24 months": {
          min: 0.31,
          max: 2.64,
          geoMean: { value: 0.93, sd: 0.49 },
          confidenceInterval: [0.92, 1.16],
        },
        "25-36 months": {
          min: 0.43,
          max: 3.8,
          geoMean: { value: 1.15, sd: 0.85 },
          confidenceInterval: [1.12, 1.57],
        },
        "37-48 months": {
          min: 0.6,
          max: 4.1,
          geoMean: { value: 1.61, sd: 0.92 },
          confidenceInterval: [1.55, 2.11],
        },
        "49-72 months": {
          min: 0.85,
          max: 4.4,
          geoMean: { value: 1.67, sd: 0.78 },
          confidenceInterval: [1.6, 2.04],
        },
        "7-8 years": {
          min: 1.07,
          max: 4.6,
          geoMean: { value: 1.97, sd: 1.01 },
          confidenceInterval: [1.93, 2.45],
        },
        "9-10 years": {
          min: 0.7,
          max: 5.43,
          geoMean: { value: 2.14, sd: 1.21 },
          confidenceInterval: [2.11, 2.73],
        },
        "11-12 years": {
          min: 1.11,
          max: 5.15,
          geoMean: { value: 2.12, sd: 0.88 },
          confidenceInterval: [1.95, 2.59],
        },
        "13-14 years": {
          min: 1,
          max: 5.73,
          geoMean: { value: 2.79, sd: 1.34 },
          confidenceInterval: [2.57, 3.61],
        },
        "15-16 years": {
          min: 1.1,
          max: 3.98,
          geoMean: { value: 2.38, sd: 0.83 },
          confidenceInterval: [2.14, 2.92],
        },
        "Older than 16 years": {
          min: 1.47,
          max: 6.1,
          geoMean: { value: 3.07, sd: 1.28 },
          confidenceInterval: [2.71, 3.91],
        },
      },
      IgG3: {
        "0-30 days": {
          min: 0.18,
          max: 0.78,
          geoMean: { value: 0.37, sd: 0.17 },
          confidenceInterval: [0.31, 0.5],
        },
        "1-5 months": {
          min: 0.13,
          max: 0.53,
          geoMean: { value: 0.24, sd: 0.12 },
          confidenceInterval: [0.17, 0.35],
        },
        "6-8 months": {
          min: 0.14,
          max: 1.0,
          geoMean: { value: 0.35, sd: 0.25 },
          confidenceInterval: [0.27, 0.56],
        },
        "9-12 months": {
          min: 0.18,
          max: 1.1,
          geoMean: { value: 0.38, sd: 0.24 },
          confidenceInterval: [0.34, 0.53],
        },
        "13-24 months": {
          min: 0.16,
          max: 1.32,
          geoMean: { value: 0.37, sd: 0.25 },
          confidenceInterval: [0.37, 0.49],
        },
        "25-36 months": {
          min: 0.14,
          max: 1.25,
          geoMean: { value: 0.32, sd: 0.21 },
          confidenceInterval: [0.3, 0.47],
        },
        "37-48 months": {
          min: 0.15,
          max: 1.07,
          geoMean: { value: 0.37, sd: 0.2 },
          confidenceInterval: [0.36, 0.47],
        },
        "49-72 months": {
          min: 0.21,
          max: 1.86,
          geoMean: { value: 0.51, sd: 0.43 },
          confidenceInterval: [0.51, 0.73],
        },
        "7-8 years": {
          min: 0.21,
          max: 1.86,
          geoMean: { value: 0.51, sd: 0.34 },
          confidenceInterval: [0.5, 0.67],
        },
        "9-10 years": {
          min: 0.28,
          max: 2.2,
          geoMean: { value: 0.53, sd: 0.4 },
          confidenceInterval: [0.47, 0.75],
        },
        "11-12 years": {
          min: 0.3,
          max: 1.82,
          geoMean: { value: 0.5, sd: 0.44 },
          confidenceInterval: [0.51, 0.73],
        },
        "13-14 years": {
          min: 0.28,
          max: 2.23,
          geoMean: { value: 0.8, sd: 0.56 },
          confidenceInterval: [0.73, 1.17],
        },
        "15-16 years": {
          min: 0.3,
          max: 1.2,
          geoMean: { value: 0.58, sd: 0.21 },
          confidenceInterval: [0.51, 0.73],
        },
        "Older than 16 years": {
          min: 0.21,
          max: 1.52,
          geoMean: { value: 0.5, sd: 0.33 },
          confidenceInterval: [0.43, 0.73],
        },
      },
      IgG4: {
        "0-30 days": {
          min: 0.17,
          max: 0.81,
          geoMean: { value: 0.24, sd: 0.17 },
          confidenceInterval: [0.17, 0.36],
        },
        "1-5 months": {
          min: 0.02,
          max: 0.48,
          geoMean: { value: 0.15, sd: 0.14 },
          confidenceInterval: [0.1, 0.31],
        },
        "6-8 months": {
          min: 0.02,
          max: 0.52,
          geoMean: { value: 0.14, sd: 0.11 },
          confidenceInterval: [0.12, 0.25],
        },
        "9-12 months": {
          min: 0.02,
          max: 0.2,
          geoMean: { value: 0.12, sd: 0.05 },
          confidenceInterval: [0.12, 0.16],
        },
        "13-24 months": {
          min: 0.02,
          max: 0.99,
          geoMean: { value: 0.16, sd: 0.17 },
          confidenceInterval: [0.18, 0.26],
        },
        "25-36 months": {
          min: 0.02,
          max: 1.71,
          geoMean: { value: 0.2, sd: 0.4 },
          confidenceInterval: [0.23, 0.43],
        },
        "37-48 months": {
          min: 0.04,
          max: 1.85,
          geoMean: { value: 0.27, sd: 0.37 },
          confidenceInterval: [0.27, 0.48],
        },
        "49-72 months": {
          min: 0.08,
          max: 2.27,
          geoMean: { value: 0.35, sd: 0.46 },
          confidenceInterval: [0.37, 0.62],
        },
        "7-8 years": {
          min: 0.02,
          max: 1.98,
          geoMean: { value: 0.42, sd: 0.46 },
          confidenceInterval: [0.49, 0.72],
        },
        "9-10 years": {
          min: 0.05,
          max: 2.02,
          geoMean: { value: 0.36, sd: 0.45 },
          confidenceInterval: [0.41, 0.63],
        },
        "11-12 years": {
          min: 0.04,
          max: 1.6,
          geoMean: { value: 0.34, sd: 0.44 },
          confidenceInterval: [0.34, 0.64],
        },
        "13-14 years": {
          min: 0.1,
          max: 1.44,
          geoMean: { value: 0.51, sd: 0.45 },
          confidenceInterval: [0.51, 0.84],
        },
        "15-16 years": {
          min: 0.09,
          max: 1.87,
          geoMean: { value: 0.36, sd: 0.44 },
          confidenceInterval: [0.3, 0.72],
        },
        "Older than 16 years": {
          min: 0.15,
          max: 2.02,
          geoMean: { value: 0.33, sd: 0.47 },
          confidenceInterval: [0.25, 0.66],
        },
      },
    },
  },
};

const ReferenceValuesScreen = () => {
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const uploadReferenceValues = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "referenceValues"), {
        values: sampleReferenceValues,
        updatedAt: new Date(),
      });

      Alert.alert("Başarılı", "Referans değerleri başarıyla yüklendi", [
        { text: "Tamam" },
      ]);
    } catch (error) {
      console.error("Error uploading reference values:", error);
      Alert.alert(
        "Hata",
        "Referans değerleri yüklenirken bir hata oluştu: " + error.message,
        [{ text: "Tamam" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Bu ekran, tüm test tipleri için yaş gruplarına göre referans
          değerlerini Firestore veritabanına yüklemek için kullanılır.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, loading && styles.buttonDisabled]}
        onPress={uploadReferenceValues}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Yükleniyor..." : "Referans Değerlerini Yükle"}
        </Text>
      </TouchableOpacity>

      <View style={styles.articleButtons}>
        {Object.entries(sampleReferenceValues).map(([articleId, article]) => (
          <TouchableOpacity
            key={articleId}
            style={[
              styles.articleButton,
              selectedArticle === articleId && styles.selectedArticleButton,
            ]}
            onPress={() =>
              setSelectedArticle(
                articleId === selectedArticle ? null : articleId
              )
            }
          >
            <Text
              style={[
                styles.articleButtonText,
                selectedArticle === articleId &&
                  styles.selectedArticleButtonText,
              ]}
            >
              {article.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedArticle && (
        <View style={styles.valuesContainer}>
          <Text style={styles.selectedArticleTitle}>
            {sampleReferenceValues[selectedArticle].name}
          </Text>

          {Object.entries(sampleReferenceValues[selectedArticle].values).map(
            ([testType, ageGroups]) => (
              <View key={testType} style={styles.testTypeSection}>
                <Text style={styles.testTypeTitle}>{testType}</Text>
                {Object.entries(ageGroups).map(([ageRange, values]) => {
                  const isKilavuzAP = selectedArticle === "article2"; // article2 is "kilavuz-ap"
                  const adjustedMin = isKilavuzAP
                    ? values.min
                    : values.min / 100;
                  const adjustedMax = isKilavuzAP
                    ? values.max
                    : values.max / 100;

                  return (
                    <View key={ageRange} style={styles.rangeRow}>
                      <Text style={styles.ageRangeText}>{ageRange}</Text>
                      <Text style={styles.valuesText}>
                        Min: {adjustedMin.toFixed(3)} - Max:{" "}
                        {adjustedMax.toFixed(3)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  infoContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
  },
  uploadButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  articleButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  articleButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    minWidth: "48%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedArticleButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  articleButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  selectedArticleButtonText: {
    color: "#fff",
  },
  valuesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  selectedArticleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  testTypeSection: {
    marginBottom: 20,
  },
  testTypeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
    marginBottom: 4,
    borderRadius: 6,
  },
  ageRangeText: {
    fontSize: 14,
    color: "#666",
  },
  valuesText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

export default ReferenceValuesScreen;
