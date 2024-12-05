import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function ReferenceValuesUploadScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const sampleReferenceValues = {
    article1: {
      name: "TÜBİTAK",
      values: {
        IgA: {
            '0-30 days': { min: 6.67, max: 8.75 },
            '1-3 months': { min: 6.67, max: 24.6 },
            '4-6 months': { min: 6.67, max: 53 },
            '7-12 months': { min: 6.68, max: 114 },
            '13-24 months': { min: 13.1, max: 103 },
            '25-36 months': { min: 6.67, max: 135 },
            '3-5 years': { min: 35.7, max: 192 },
            '6-8 years': { min: 44.8, max: 276 },
            '9-11 years': { min: 32.6, max: 262 },
            '12-16 years': { min: 36.4, max: 305 },
            '17-18 years': { min: 46.3, max: 385 },
            'Older than 18 years': { min: 6.67, max: 385 },
            },
          IgM: {
            '0-30 days': { min: 5.1, max: 50.9 },
            '1-3 months': { min: 15.2, max: 68.5 },
            '4-6 months': { min: 26.9, max: 130 },
            '7-12 months': { min: 24.2, max: 162 },
            '13-24 months': { min: 38.6, max: 195 },
            '25-36 months': { min: 42.7, max: 236 },
            '3-5 years': { min: 58.7, max: 198 },
            '6-8 years': { min: 50.3, max: 242 },
            '9-11 years': { min: 37.4, max: 213 },
            '12-16 years': { min: 42.4, max: 197 },
            '17-18 years': { min: 60.7, max: 323 },
            'Older than 18 years': { min: 5.1, max: 323 },
            },
        IgG: {
            '0-30 days': { min: 399, max: 1480 },
            '1-3 months': { min: 217, max: 981 },
            '4-6 months': { min: 270, max: 1110 },
            '7-12 months': { min: 242, max: 977 },
            '13-24 months': { min: 389, max: 1260 },
            '25-36 months': { min: 486, max: 1970 },
            '3-5 years': { min: 457, max: 1120 },
            '6-8 years': { min: 483, max: 1580 },
            '9-11 years': { min: 642, max: 2290 },
            '12-16 years': { min: 636, max: 1610 },
            '17-18 years': { min: 688, max: 2430 },
            'Older than 18 years': { min: 217, max: 2430 },
            },
        IgG1: {
            '25-36 months': { min: 309, max: 1450 },
            '3-5 years': { min: 273, max: 679 },
            '6-8 years': { min: 292, max: 781 },
            '9-11 years': { min: 410, max: 153 },
            '12-16 years': { min: 344, max: 958 },
            '17-18 years': { min: 403, max: 1520 },
            'Older than 18 years': { min: 273, max: 1530 },
            },
        IgG2: {
            '25-36 months': { min: 87.6, max: 289 },
            '3-5 years': { min: 73.3, max: 271 },
            '6-8 years': { min: 88.1, max: 408 },
            '9-11 years': { min: 81, max: 442 },
            '12-16 years': { min: 159, max: 406 },
            '17-18 years': { min: 184, max: 696 },
            'Older than 18 years': { min: 73.3, max: 696 },
            },
        IgG3: {
            '25-36 months': { min: 19.8, max: 75 },
            '3-5 years': { min: 20.8, max: 93.2 },
            '6-8 years': { min: 18.9, max: 135 },
            '9-11 years': { min: 34.1, max: 200 },
            '12-16 years': { min: 35.2, max: 150 },
            '17-18 years': { min: 29.3, max: 200 },
            'Older than 18 years': { min: 18.9, max: 200 },
            },
        IgG4: {
            '25-36 months': { min: 7.86, max: 57.2 },
            '3-5 years': { min: 7.86, max: 122 },
            '6-8 years': { min: 7.86, max: 157 },
            '9-11 years': { min: 7.86, max: 93.8 },
            '12-16 years': { min: 7.86, max: 119 },
            '17-18 years': { min: 7.86, max: 157 },
            'Older than 18 years': { min: 7.86, max: 157 },
            },    
      }
    },
    article2: {
      name: "kilavuz-ap",
      values: {
        IgA: {
            '0-5 months': { min: 0.07, max: 0.37 },
            '5-9 months': { min: 0.16, max: 0.50 },
            '9-15 months': { min: 0.27, max: 0.66 },
            '15-24 months': { min: 0.36, max: 0.79 },
            '2-4 years': { min: 0.27, max: 2.46 },
            '4-7 years': { min: 0.29, max: 2.56 },
            '7-10 years': { min: 0.34, max: 2.74 },
            '10-13 years': { min: 0.42, max: 2.95 },
            '13-16 years': { min: 0.52, max: 3.19 },
            '16-18 years': { min: 0.60, max: 3.37 },
            'Older than 18 years': { min: 0.61, max: 3.56 },
            },
          IgM: {
            '0-5 months': { min: 0.26, max: 1.22 },
            '5-9 months': { min: 0.32, max: 1.32 },
            '9-15 months': { min: 0.40, max: 1.43 },
            '15-24 months': { min: 0.46, max: 1.52 },
            '2-4 years': { min: 0.37, max: 1.84 },
            '4-7 years': { min: 0.37, max: 2.24 },
            '7-10 years': { min: 0.38, max: 2.51 },
            '10-13 years': { min: 0.41, max: 2.55 },
            '13-16 years': { min: 0.45, max: 2.44 },
            '16-18 years': { min: 0.49, max: 2.01 },
            'Older than 18 years': { min: 0.37, max: 2.86 },
            },
        IgG: {
            '0-5 months': { min: 1.00, max: 1.34 },
            '5-9 months': { min: 1.64, max: 5.88 },
            '9-15 months': { min: 2.46, max: 9.04 },
            '15-24 months': { min: 3.13, max: 11.70 },
            '2-4 years': { min: 2.95, max: 11.56 },
            '4-7 years': { min: 3.86, max: 14.70 },
            '7-10 years': { min: 4.62, max: 16.82 },
            '10-13 years': { min: 5.03, max: 15.80 },
            '13-16 years': { min: 5.09, max: 15.80 },
            '16-18 years': { min: 4.87, max: 13.27 },
            'Older than 18 years': { min: 7.67, max: 15.90 },
            },
        IgG1: {
            '0-5 months': { min: 0.56, max: 2.15 },
            '5-9 months': { min: 1.02, max: 3.69 },
            '9-15 months': { min: 1.60, max: 5.62 },
            '15-24 months': { min: 2.09, max: 7.24 },
            '2-4 years': { min: 1.58, max: 7.21 },
            '4-7 years': { min: 2.09, max: 9.02 },
            '7-10 years': { min: 2.53, max: 10.19 },
            '10-13 years': { min: 2.80, max: 10.30 },
            '13-16 years': { min: 2.89, max: 9.34 },
            '16-18 years': { min: 2.83, max: 7.72 },
            'Older than 18 years': { min: 3.41, max: 8.94 },
            },
        IgG2: {
            '0-5 months': { min: 0, max: 0.82 },
            '5-9 months': { min: 0, max: 0.89 },
            '9-15 months': { min: 0.24, max: 0.98 },
            '15-24 months': { min: 0.35, max: 1.05 },
            '2-4 years': { min: 0.39, max: 1.76 },
            '4-7 years': { min: 0.44, max: 3.16 },
            '7-10 years': { min: 0.54, max: 4.35 },
            '10-13 years': { min: 0.66, max: 5.02 },
            '13-16 years': { min: 0.82, max: 5.16 },
            '16-18 years': { min: 0.98, max: 4.86 },
            'Older than 18 years': { min: 1.71, max: 6.32 },
            },
        IgG3: {
            '0-5 months': { min: 0.076, max: 8.23 },
            '5-9 months': { min: 0.119, max: 0.740 },
            '9-15 months': { min: 0.173, max: 0.637 },
            '15-24 months': { min: 0.219, max: 0.550 },
            '2-4 years': { min: 0.170, max: 0.847 },
            '4-7 years': { min: 0.108, max: 0.949 },
            '7-10 years': { min: 0.085, max: 10.26 },
            '10-13 years': { min: 0.115, max: 10.53 },
            '13-16 years': { min: 0.200, max: 10.32 },
            '16-18 years': { min: 0.313, max: 0.976 },
            'Older than 18 years': { min: 0.184, max: 10.60 },
            },
        IgG4: {
            '0-5 months': { min: 0, max: 0.198 },
            '5-9 months': { min: 0, max: 0.208 },
            '9-15 months': { min: 0, max: 0.220 },
            '15-24 months': { min: 0, max: 0.230 },
            '2-4 years': { min: 0.004, max: 0.491 },
            '4-7 years': { min: 0.008, max: 0.819},
            '7-10 years': { min: 0.010, max: 1.087 },
            '10-13 years': { min: 0.010, max: 1.219 },
            '13-16 years': { min: 0.007, max: 1.217},
            '16-18 years': { min: 0.003, max: 1.110 },
            'Older than 18 years': { min: 0.024, max: 1.210 },
            },    
      }
    },
    article3: {
      name: "kilavuz-cilv",
      values: {
        IgA: {
            '0-1 months': { min: 0, max: 11 },
            '1-4 months': { min: 6, max: 50 },
            '4-7 months': { min: 8, max: 90 },
            '7-13 months': { min: 16, max: 100 },
            '1-3 years': { min: 20, max: 230 },
            '3-6 years': { min: 50, max: 150 },
            'Older than 6 years': { min: 70, max: 312 },
            },
          IgM: {
            '0-1 months': { min: 5, max: 30 },
            '1-4 months': { min: 15, max: 70 },
            '4-7 months': { min: 10, max: 90 },
            '7-13 months': { min: 25, max: 115 },
            '1-3 years': { min: 30, max: 120 },
            '3-6 years': { min: 22, max: 100 },
            'Older than 6 years': { min: 56, max: 352 },
            },
        IgG: {
            '0-1 months': { min: 700, max: 1300 },
            '1-4 months': { min: 280, max: 750 },
            '4-7 months': { min: 200, max: 1200 },
            '7-13 months': { min: 300, max: 1500 },
            '1-3 years': { min: 400, max: 1300 },
            '3-6 years': { min: 600, max: 1500 },
            'Older than 6 years': { min: 639, max: 1344 },
            },
        IgG1: {
            '0-3 months': { min: 218, max: 496 },
            '3-6 months': { min: 143, max: 394 },
            '6-9 months': { min: 190, max: 388 },
            '9 mo-2 yr': { min: 286, max: 680 },
            '2-4 years': { min: 381, max: 884 },
            '4-6 years': { min: 292, max: 816},
            '6-8 years': { min: 422, max: 802 },
            '8-10 years': { min: 456, max: 938 },
            '10-12 years': { min: 456, max: 952 },
            '12-14 years': { min: 347, max: 993 },
            'Older than 14 years': { min: 422, max: 1292 },
            },
        IgG2: {
            '0-3 months': { min: 40, max: 453 },
            '3-6 months': { min: 23, max: 147 },
            '6-9 months': { min: 37, max: 60 },
            '9 mo-2 yr': { min: 30, max: 327 },
            '2-4 years': { min: 70, max: 443 },
            '4-6 years': { min: 83, max: 513 },
            '6-8 years': { min: 113, max: 480 },
            '8-10 years': { min: 163, max: 513 },
            '10-12 years': { min: 147, max: 493 },
            '12-14 years': { min: 140, max: 440 },
            'Older than 14 years': { min: 117, max: 747 },
            },
        IgG3: {
            '0-3 months': { min: 4, max: 23 },
            '3-6 months': { min: 4, max: 100 },
            '6-9 months': { min: 12, max: 62 },
            '9 mo-2 yr': { min: 13, max: 82 },
            '2-4 years': { min: 17, max: 90 },
            '4-6 years': { min: 8, max: 111 },
            '6-8 years': { min: 15, max: 133 },
            '8-10 years': { min: 26, max: 113 },
            '10-12 years': { min: 12, max: 179 },
            '12-14 years': { min: 23, max: 117 },
            'Older than 14 years': { min: 41, max: 129 },
            },
        IgG4: {
            '0-3 months': { min: 1, max: 120 },
            '3-6 months': { min: 1, max: 120 },
            '6-9 months': { min: 1, max: 120 },
            '9 mo-2 yr': { min: 1, max: 120 },
            '2-4 years': { min: 1, max: 120 },
            '4-6 years': { min: 2, max: 112 },
            '6-8 years': { min: 1, max: 138 },
            '8-10 years': { min: 1, max: 95 },
            '10-12 years': { min: 1, max: 153 },
            '12-14 years': { min: 1, max: 143 },
            'Older than 14 years': { min: 10, max: 67 },
            },    
      }
    },
    article4: {
      name: "kilavuz-os",
      values: {
        IgA: {
            '1-3 months': { min: 6, max: 47 },
            '4-6 months': { min: 7, max: 63 },
            '7-12 months': { min: 12, max: 114 },
            '13-24 months': { min: 15, max: 52 },
            '25-36 months': { min: 24, max: 84 },
            '3-5 years': { min: 55, max: 135 },
            '6-8 years': { min: 81, max: 264 },
            '9-11 years': { min: 78, max: 334 },
            '12-16 years': { min: 87, max: 234 },
            },
          IgM: {
            '1-3 months': { min: 18, max: 87 },
            '4-6 months': { min: 18, max: 136 },
            '7-12 months': { min: 28, max: 115 },
            '13-24 months': { min: 32, max: 148 },
            '25-36 months': { min: 47, max: 144 },
            '3-5 years': { min: 65, max: 205 },
            '6-8 years': { min: 47, max: 198 },
            '9-11 years': { min: 38, max: 163 },
            '12-16 years': { min: 47, max: 285 },
            },
        IgG: {
            '1-3 months': { min: 227, max: 770 },
            '4-6 months': { min: 141, max: 885 },
            '7-12 months': { min: 350, max: 1010 },
            '13-24 months': { min: 432, max: 990 },
            '25-36 months': { min: 437, max: 1320 },
            '3-5 years': { min: 524, max: 1400 },
            '6-8 years': { min: 858, max: 1600 },
            '9-11 years': { min: 645, max: 1520 },
            '12-16 years': { min: 877, max: 1620 },
            }
      }
    },
    article5: {
      name: "kilavuz-tjp",
      values: {
        IgA: {
          '0-30 days': { min: 5, max: 5.8 },
          '1-5 months': { min: 5.8, max: 58 },
          '6-8 months': { min: 5.8, max: 85.8 },
          '9-12 months': { min: 18.4, max: 154 },
          '13-24 months': { min: 11.5, max: 94.3 },
          '25-36 months': { min: 23, max: 130 },
          '37-48 months': { min: 40.7, max: 115 },
          '49-72 months': { min: 23, max: 205.1 },
          '7-8 years': { min: 36.1, max: 268 },
          '9-10 years': { min: 54, max: 268 },
          '11-12 years': { min: 27, max: 198 },
          '13-14 years': { min: 52.4, max: 225 },
          '15-16 years': { min: 48, max: 158 },
          'Older than 16 years': { min: 46.5, max: 221 },
          },
        IgM: {
          '0-30 days': { min: 17.3, max: 29.6 },
          '1-5 months': { min: 18.4, max: 145 },
          '6-8 months': { min: 26.4, max: 146 },
          '9-12 months': { min: 23.5, max: 180 },
          '13-24 months': { min: 25.6, max: 201 },
          '25-36 months': { min: 36, max: 199 },
          '37-48 months': { min: 26.1, max: 188 },
          '49-72 months': { min: 33.3, max: 207 },
          '7-8 years': { min: 30.5, max: 220 },
          '9-10 years': { min: 33.7, max: 257 },
          '11-12 years': { min: 30, max: 187 },
          '13-14 years': { min: 44, max: 206 },
          '15-16 years': { min: 33, max: 205 },
          'Older than 16 years': { min: 75, max: 198.5 },
          },
      IgG: {
          '0-30 days': { min: 462, max: 1190 },
          '1-5 months': { min: 270, max: 792 },
          '6-8 months': { min: 268, max: 898 },
          '9-12 months': { min: 421, max: 1100 },
          '13-24 months': { min: 365, max: 1200 },
          '25-36 months': { min: 430, max: 1290 },
          '37-48 months': { min: 539, max: 1200 },
          '49-72 months': { min: 528, max: 1490 },
          '7-8 years': { min: 527, max: 1590 },
          '9-10 years': { min: 646, max: 1620 },
          '11-12 years': { min: 579, max: 1610 },
          '13-14 years': { min: 741, max: 1650},
          '15-16 years': { min: 666, max: 1370 },
          'Older than 16 years': { min: 830, max: 1820 },
          },
      IgG1: {
          '0-30 days': { min: 430, max: 897 },
          '1-5 months': { min: 160, max: 574 },
          '6-8 months': { min: 279, max: 820 },
          '9-12 months': { min: 328, max: 1250 },
          '13-24 months': { min: 344, max: 1435 },
          '25-36 months': { min: 340, max: 1470 },
          '37-48 months': { min: 439, max: 1333 },
          '49-72 months': { min: 468, max: 1333 },
          '7-8 years': { min: 420, max: 1470 },
          '9-10 years': { min: 380, max: 1840 },
          '11-12 years': { min: 599, max: 1560 },
          '13-14 years': { min: 490, max: 1560},
          '15-16 years': { min: 498, max: 1460 },
          'Older than 16 years': { min: 528, max: 1384 },
          },
      IgG2: {
          '0-30 days': { min: 87, max: 263 },
          '1-5 months': { min: 32, max: 108 },
          '6-8 months': { min: 36, max: 146 },
          '9-12 months': { min: 25, max: 161 },
          '13-24 months': { min: 31, max: 264 },
          '25-36 months': { min: 43, max: 380 },
          '37-48 months': { min: 60, max: 410 },
          '49-72 months': { min: 85, max: 440 },
          '7-8 years': { min: 67, max: 460 },
          '9-10 years': { min: 70, max: 543 },
          '11-12 years': { min: 111, max: 515 },
          '13-14 years': { min: 100, max: 573},
          '15-16 years': { min: 110, max: 398 },
          'Older than 16 years': { min: 147, max: 610 },
          },
      IgG3: {
          '0-30 days': { min: 18, max: 78 },
          '1-5 months': { min: 13, max: 53 },
          '6-8 months': { min: 14, max: 100 },
          '9-12 months': { min: 18, max: 110 },
          '13-24 months': { min: 16, max: 132 },
          '25-36 months': { min: 14, max: 125 },
          '37-48 months': { min: 15, max: 120 },
          '49-72 months': { min: 15, max: 107 },
          '7-8 years': { min: 21, max: 186 },
          '9-10 years': { min: 20, max: 186 },
          '11-12 years': { min: 29, max: 200 },
          '13-14 years': { min: 28, max: 223},
          '15-16 years': { min: 30, max: 120 },
          'Older than 16 years': { min: 21, max: 152 },
          },
      IgG4: {
          '0-30 days': { min: 17, max: 81 },
          '1-5 months': { min: 2, max: 48 },
          '6-8 months': { min: 2, max: 52 },
          '9-12 months': { min: 2, max: 20 },
          '13-24 months': { min: 2, max: 99 },
          '25-36 months': { min: 2, max: 171 },
          '37-48 months': { min: 4, max: 185 },
          '49-72 months': { min: 8, max: 227 },
          '7-8 years': { min: 2, max: 198 },
          '9-10 years': { min: 5, max: 202 },
          '11-12 years': { min: 4, max: 160 },
          '13-14 years': { min: 10, max: 144},
          '15-16 years': { min: 9, max: 187 },
          'Older than 16 years': { min: 15, max: 202 },
          },    
      }
    }
  }  

  // const uploadReferenceValues = async () => {
  //   setLoading(true);
  //   try {
  //     await setDoc(doc(db, 'settings', 'referenceValues'), {
  //       values: sampleReferenceValues,
  //       updatedAt: new Date()
  //     });
      
  //     Alert.alert(
  //       'Başarılı',
  //       'Referans değerleri başarıyla yüklendi',
  //       [{ text: 'Tamam' }]
  //     );
  //   } catch (error) {
  //     console.error('Error uploading reference values:', error);
  //     Alert.alert(
  //       'Hata',
  //       'Referans değerleri yüklenirken bir hata oluştu',
  //       [{ text: 'Tamam' }]
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <ScrollView style={styles.container}>
      
      {/* <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Bu ekran, tüm test tipleri için yaş gruplarına göre referans değerlerini 
          Firestore veritabanına yüklemek için kullanılır.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, loading && styles.buttonDisabled]}
        onPress={uploadReferenceValues}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Yükleniyor...' : 'Referans Değerlerini Yükle'}
        </Text>
      </TouchableOpacity> */}

<View style={styles.articleButtons}>
      {Object.entries(sampleReferenceValues).map(([articleId, article]) => (
        <TouchableOpacity
          key={articleId}
          style={[
            styles.articleButton,
            selectedArticle === articleId && styles.selectedArticleButton
          ]}
          onPress={() => setSelectedArticle(articleId === selectedArticle ? null : articleId)}
        >
          <Text style={[
            styles.articleButtonText,
            selectedArticle === articleId && styles.selectedArticleButtonText
          ]}>
            {article.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Seçili makalenin değerleri */}
    {selectedArticle && (
      <View style={styles.valuesContainer}>
        <Text style={styles.selectedArticleTitle}>
          {sampleReferenceValues[selectedArticle].name}
        </Text>
        
        {Object.entries(sampleReferenceValues[selectedArticle].values).map(([testType, ageGroups]) => (
          <View key={testType} style={styles.testTypeSection}>
            <Text style={styles.testTypeTitle}>{testType}</Text>
            {Object.entries(ageGroups).map(([ageRange, values]) => {
              const isKilavuzAP = selectedArticle === "article2"; // article2 is "kilavuz-ap"
              const adjustedMin = isKilavuzAP ? values.min : values.min / 100;
              const adjustedMax = isKilavuzAP ? values.max : values.max / 100;

              return (
                <View key={ageRange} style={styles.rangeRow}>
                  <Text style={styles.ageRangeText}>{ageRange}</Text>
                  <Text style={styles.valuesText}>
                    Min: {adjustedMin.toFixed(3)} - Max: {adjustedMax.toFixed(3)}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  testTypeContainer: {
    marginBottom: 16,
  },
  testTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  rangeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginBottom: 4,
  },
  articleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  articleButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    minWidth: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedArticleButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  articleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedArticleButtonText: {
    color: '#fff',
  },
  valuesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  selectedArticleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  testTypeSection: {
    marginBottom: 20,
  },
  testTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 4,
    borderRadius: 6,
  },
  ageRangeText: {
    fontSize: 14,
    color: '#666',
  },
  valuesText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});