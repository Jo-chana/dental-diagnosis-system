from . import image_processing
import cv2
import numpy as np

"""
COLOR_RGB, COLOR_HSV 
 : 현실적인 치아 색에 맞추어 채널 값을 조정하였음.
"""
COLOR_RGB = {'B1': (239, 236, 215),    # EFECD7
             'A1': (236, 227, 203),    # ECE3CB
             'B2': (232, 221, 186),    # E8DDBA
             'D2': (224, 212, 181),    # E0D4B5
             'A2': (224, 208, 172),    # E0D0AC
             'C1': (207, 191, 158),    # CFBF9E
             'C2': (197, 176, 130),    # C5B082
             'D4': (200, 181, 131),    # C8B583
             'A3': (214, 191, 144),    # D6BF90
             'D3': (204, 181, 137),    # CCB589
             'B3': (204, 182, 129),    # CCB681
             'A3.5': (201, 175, 116),  # C9AF74
             'B4': (201, 176, 114),    # C9B072
             'C3': (180, 160, 114),    # B4A072
             'A4': (175, 143, 47),     # AF8F2F
             'C4': (169, 141, 51)}     # A98D33

COLOR_HSV = {'B1': (51, 44, 89),
             'A1': (43, 47, 86),
             'B2': (46, 49, 82),
             'D2': (43, 41, 80),
             'A2': (41, 45, 78),
             'C1': (40, 33, 72),
             'C2': (41, 36, 64),
             'D4': (43, 39, 65),
             'A3': (40, 46, 70),
             'D3': (40, 40, 67),
             'B3': (42, 42, 65),
             'A3.5': (42, 44, 62),
             'B4': (43, 44, 62),
             'C3': (41, 31, 58),
             'A4': (45, 58, 44),
             'C4': (46, 53, 43)}

SHADE_RGB = {'B1': (255, 255, 255),
             'A1': (247, 247, 247),
             'B2': (244, 244, 241),
             'D2': (240, 241, 228),
             'A2': (249, 240, 203),
             'C1': (242, 235, 205),
             'C2': (235, 229, 197),
             'D4': (236, 229, 194),
             'A3': (240, 230, 182),
             'D3': (242, 229, 163),
             'B3': (244, 226, 168),
             'A3.5': (243, 220, 157),
             'B4': (234, 215, 157),
             'C3': (223, 205, 144),
             'A4': (218, 199, 124),
             'C4': (215, 194, 119)}

SHADE_HSV = {'B1': (0, 0, 100),
             'A1': (0, 0, 98),
             'B2': (60, 13, 95),
             'D2': (65, 32, 92),
             'A2': (45, 76, 89),
             'C1': (46, 66, 89),
             'C2': (51, 49, 85),
             'D4': (49, 53, 84),
             'A3': (48, 71, 82),
             'D3': (51, 75, 79),
             'B3': (46, 77, 81),
             'A3.5': (44, 83, 79),
             'B4': (46, 65, 77),
             'C3': (45, 56, 72),
             'A4': (48, 56, 67),
             'C4': (47, 54, 65)}


def white_score(img):
    tooth = image_processing.tooth_injection(img)
    tooth = cv2.resize(tooth, (250, 150))
    tooth_pmsf = cv2.pyrMeanShiftFiltering(tooth, 10, 20)
    y, x, _ = np.shape(tooth_pmsf)
    tooth_sample = tooth_pmsf[:, x // 3:x // 3 * 2]
    bgr = []
    v = 0
    for idx in range(3):
        channel = np.concatenate(tooth_sample[:, :, idx])
        channel = [val for val in channel if val > 100]
        bgr.append(np.mean(channel))
        v += np.mean(channel)
    v *= 100 / (255 * 3)
    b, g, r = bgr
    rgb = (1, g / r, b / r)
    minimum = 1e+9
    target = None
    for key in COLOR_RGB.keys():
        val = COLOR_RGB[key]
        val = (1, val[1] / val[0], val[2] / val[0])
        diff = 0
        for idx, c in enumerate(rgb):
            diff += abs(c - val[idx]) * 100 / 255
        diff += (v - COLOR_HSV[key][2]) ** 2
        if diff < minimum:
            minimum = diff
            target = key

    return target
