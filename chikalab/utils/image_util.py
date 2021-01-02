import cv2
from .image_processing import detect_mouth_with_signed_image
import os
from chikalab import static_dir
from werkzeug.utils import secure_filename
import time
from flask import url_for
from .boto_util import upload_to_s3


def get_image_from_request(request):
    f = request.files['image']
    file_name = f.filename
    print(file_name)
    f.save('/tmp/' + secure_filename(file_name))
    img = cv2.imread('/tmp/' + secure_filename(file_name))
    return img


def get_file_path_with_result_image(image):
    try:
        result_image, mouth_image = detect_mouth_with_signed_image(image)
    except IndexError:
        return None, None
    current_milli = int(round(time.time() * 1000))
    image_name = str(current_milli) + '.jpg'
    cv2.imwrite(os.path.join(static_dir, image_name), result_image)
    file_path = url_for('static', filename=f'images/{image_name}')
    upload_to_s3('chikalab'+file_path, folder_name='chikalab', file_name=image_name)
    return file_path, mouth_image
