from collections import OrderedDict
import numpy as np
import cv2
from app.utils.models import get_predictor, get_detector

facial_features_coordinates = {}

# define a dictionary that maps the indexes of the facial
# landmarks to specific face regions
FACIAL_LANDMARKS_INDEXES = OrderedDict([
    ("Mouth", (48, 68)),
])


def shape_to_numpy_array(shape, dtype="int"):
    # initialize the list of (x, y)-coordinates
    coordinates = np.zeros((68, 2), dtype=dtype)
    # loop over the 68 facial landmarks and convert them
    # to a 2-tuple of (x, y)-coordinates
    for i in range(0, 68):
        coordinates[i] = (shape.part(i).x, shape.part(i).y)
    # return the list of (x, y)-coordinates
    return coordinates


def visualize_mouth_landmarks(image, shape):
    mask = np.zeros((np.shape(image)[0], np.shape(image)[1]))

    # Mouth landmark
    (j, k) = FACIAL_LANDMARKS_INDEXES["Mouth"]

    pts = shape[j:k]
    facial_features_coordinates["Mouth"] = pts
    hull = cv2.convexHull(pts)
    cv2.drawContours(mask, [hull], -1, (255, 255, 255), -1)
    return mask, hull


def get_shape_of_image(image):
    predictor = get_predictor()
    detector = get_detector()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = (gray * 1).astype('uint8')
    rects = detector(gray, 1)
    rect = rects[0]
    # determine the facial landmarks for the face region, then
    # convert the landmark (x, y)-coordinates to a NumPy array
    shape = predictor(gray, rect)
    shape = shape_to_numpy_array(shape)
    return shape


def get_hull_of_image(image):
    shape = get_shape_of_image(image)
    mask, hull = visualize_mouth_landmarks(image, shape)
    mask = (mask * 1).astype(np.uint8)
    mouth_area = cv2.bitwise_or(image, image, mask=mask)
    return mouth_area, hull


def detect_mouth(image):
    mouth_area, hull = get_hull_of_image(image)
    mouth_image = trim(image, hull)
    mouth_only_image = trim(mouth_area, hull)
    return mouth_image, mouth_only_image


def detect_mouth_with_signed_image(image):
    mouth_area, hull = get_hull_of_image(image)
    mouth_image_with_sign = trim_with_sign(image, hull)
    mouth_only_image = trim(mouth_area, hull)
    return mouth_image_with_sign, mouth_only_image


def trim(image, hull):
    x_max = np.max(hull[:, :, 0])
    x = np.min(hull[:, :, 0])
    y_max = np.max(hull[:, :, 1])
    y = np.min(hull[:, :, 1])
    w = x_max - x
    h = y_max - y
    image_trim = image[y:y + h, x:x + w]
    return image_trim


def trim_with_sign(image, hull):
    x_max = np.max(hull[:, :, 0])
    x = np.min(hull[:, :, 0])
    y_max = np.max(hull[:, :, 1])
    y = np.min(hull[:, :, 1])
    w = x_max - x
    h = y_max - y
    point1 = (hull[np.where(hull[:, :, 0] == x)][0][0], hull[np.where(hull[:, :, 0] == x)][0][1])
    point2 = (hull[np.where(hull[:, :, 0] == x_max)][0][0], hull[np.where(hull[:, :, 0] == x_max)][0][1])
    point3 = ((x_max + x) // 2, hull[np.where(hull[:, :, 1] == y)][0][1])
    point4 = ((x_max + x) // 2, hull[np.where(hull[:, :, 1] == y_max)][0][1])
    for point in [point1, point2, point3, point4]:
        image = cv2.circle(image, point, 3, (255, 255, 255), 3, cv2.LINE_AA)
    image = cv2.line(image, point1, point3, (255, 255, 255), 1, cv2.LINE_AA)
    image = cv2.line(image, point1, point4, (255, 255, 255), 1, cv2.LINE_AA)
    image = cv2.line(image, point2, point3, (255, 255, 255), 1, cv2.LINE_AA)
    image = cv2.line(image, point2, point4, (255, 255, 255), 1, cv2.LINE_AA)

    image_trim = image[y - 15:y + h + 15, x - 30:x + w + 30]
    return image_trim


def tooth_injection(img):
    img_b, img_g, img_r = cv2.split(img)
    diff_r_g = []
    for x in range(len(img_r)):
        out = []
        for y in range(len(img_r[x])):
            r = img_r[x][y]
            g = img_g[x][y]
            diff = 0 if r < g else r - g
            out.append(diff)
        diff_r_g.append(out)
    diff_r_g = np.array(diff_r_g, dtype=np.uint8)
    diff_r_g = cv2.equalizeHist(diff_r_g)
    res, thres = cv2.threshold(
        diff_r_g, 125, 255, cv2.THRESH_BINARY_INV)
    output = cv2.bitwise_and(img, img, mask=thres)
    return output


def calculate_aspect(tooth):
    brace, tooth_contour = inject_brace(tooth)
    brace_sobely = cv2.Sobel(brace, -1, 0, 1, ksize=3)
    brace_gradient = cv2.morphologyEx(
        brace_sobely, cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8), iterations=3)
    width = np.shape(brace_gradient)[1]
    cnts, heir = cv2.findContours(
        brace_gradient, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    aspect = 0
    for cnt in cnts:
        x, h, w, h = cv2.boundingRect(cnt)
        if w < width / 3:
            continue
        aspect_ratio = float(w) / h
        if aspect_ratio > aspect:
            aspect = aspect_ratio
    return aspect


def inject_brace(tooth_img):
    tooth_edge = cv2.Canny(tooth_img, 100, 255)
    tooth_gray = cv2.cvtColor(tooth_img, cv2.COLOR_BGR2GRAY)

    res, tooth_thres = cv2.threshold(tooth_gray, 0, 255, cv2.THRESH_BINARY)
    thres_edge = cv2.Canny(tooth_thres, 100, 255)

    # tooth_edge contour - 합성용
    tooth_contour, hier = cv2.findContours(
        tooth_thres, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    kernel = np.ones((5, 5), np.uint8)
    thres_edge = cv2.dilate(thres_edge, kernel, iterations=1)

    brace = tooth_edge.copy()

    for idx, row in enumerate(tooth_edge):
        for idx2, col in enumerate(row):
            if col <= thres_edge[idx][idx2]:
                brace[idx][idx2] = 0
    brace = (brace * 1).astype('uint8')
    return brace, tooth_contour


def detect_plague_from_mouth(mouth):
    teeth = tooth_injection(mouth)
    teeth_gray = cv2.cvtColor(teeth, cv2.COLOR_BGR2GRAY)
    ret, mask = cv2.threshold(teeth_gray, 0, 255, cv2.THRESH_OTSU)
    teeth = cv2.bitwise_and(teeth, teeth, mask=mask)
    teeth_hsv = cv2.cvtColor(teeth, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(teeth_hsv)
    s_equ = cv2.equalizeHist(s)
    s_equ_abs = (s * 2.55).astype('uint8')
    ret, target_light = cv2.threshold(s_equ, 0, 255, cv2.THRESH_OTSU)
    ret, target_heavy = cv2.threshold(s_equ_abs, 180, 255, cv2.THRESH_BINARY)
    teeth_area = 0
    plague_area = 0
    for idx, row in enumerate(teeth):
        for idx2, col in enumerate(row):
            if mask[idx][idx2] == 255:
                teeth_area += 1
            if target_light[idx][idx2] == 255:
                teeth[idx][idx2] = (0, 255, 0)
                plague_area += 0.3
            if target_heavy[idx][idx2] == 255:
                teeth[idx][idx2] = (0, 0, 255)
                plague_area += 1
    danger = (plague_area / teeth_area) * 100
    return danger, teeth


def get_mark(tooth):
    gray = cv2.cvtColor(tooth, cv2.COLOR_BGR2GRAY)
    ret, result = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU)
    dist_transform = cv2.distanceTransform(result, cv2.DIST_L2, 5)
    ret, mark = cv2.threshold(dist_transform, 0.5 *
                              dist_transform.max(), 255, 0)
    mark = (mark * 1).astype('uint8')
    cnts, heir = cv2.findContours(
        mark, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)

    for cnt in cnts:
        x, y, w, h = cv2.boundingRect(cnt)
        cut = []
        for idx, row in enumerate(mark[y:y + h]):
            white = np.where(np.array(row[x:x + w]) == 255)[0]
            trim_num = 0
            for i, index in enumerate(white):
                if i < len(white) - 1:
                    if not index + 1 == white[i + 1]:
                        if len(cut) == 0:
                            cut.append([index, white[i + 1]])
                            trim_num += 1
                        elif trim_num >= len(cut):
                            cut.append([index, white[i + 1]])
                            trim_num += 1
                        else:
                            if white[i + 1] < cut[trim_num][0]:
                                cut.insert(trim_num, [index, white[i + 1]])
                                trim_num += 1
                            if cut[trim_num - 1][1] - cut[trim_num - 1][0] > white[i + 1] - index:
                                cut[trim_num - 1] = [index, white[i + 1]]
                                trim_num += 1
        if len(cut) > 0:
            for t in cut:
                mark[y:y + h, x + t[0]:x + t[1]] = 0
    return mark


def calculate_tilt(tooth, mouth):
    mark = get_mark(tooth)

    ret, markers = cv2.connectedComponents(mark)
    markers = cv2.watershed(tooth, markers)
    cnts, heir = cv2.findContours(
        markers, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    mouth_copy = mouth.copy()

    occlusion = []
    for cnt in cnts:
        if len(cnt) < 5:
            continue
        else:
            x_max = np.max(cnt[:, :, 0])
            x_min = np.min(cnt[:, :, 0])
            y_max = np.max(cnt[:, :, 1])
            y_min = np.min(cnt[:, :, 1])
            x_mean = int((x_max + x_min) / 2)
            y_mean = int((y_max + y_min) / 2)
            if x_max - x_min > y_max - y_min:
                continue
            mouth_copy = cv2.circle(mouth_copy, (x_mean, y_mean), 1, (255, 0, 0))
            ellipse = cv2.fitEllipse(cnt)
            if ellipse is None:
                continue
            tilt = ellipse[-1]

            if 45 < tilt < 135:
                tilt = abs(90 - tilt)

            center = ellipse[0]
            radius = ellipse[1][1]
            angle = tilt * np.pi / 180

            tilt = tilt if tilt < 90 else 180 - tilt

            edge_start = (int(center[0] - 0.5 * radius * np.sin(angle)),
                          int(center[1] + 0.5 * radius * np.cos(angle)))
            edge_end = (int(center[0] + 0.5 * radius * np.sin(angle)),
                        int(center[1] - 0.5 * radius * np.cos(angle)))

            occlusion.append([x_mean, y_mean, tilt])
            mouth_copy = cv2.ellipse(mouth_copy, ellipse, (0, 255, 0), 2)
            mouth_copy = cv2.line(mouth_copy, edge_start,
                                  edge_end, (0, 0, 255), 1, cv2.LINE_8)
            mouth_copy = cv2.circle(mouth_copy, edge_start, 5, (0, 0, 255), -1)
            mouth_copy = cv2.circle(mouth_copy, edge_end, 5, (0, 0, 255), -1)

    occlusion = np.mean(np.array(occlusion)[:, 2])
    return occlusion, mouth_copy
