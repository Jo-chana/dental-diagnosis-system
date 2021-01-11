import cv2
from app.utils.image_processing import detect_mouth_with_signed_image
from werkzeug.utils import secure_filename
import time
from app.utils.boto_util import upload_to_s3


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
    file_path = f'static/images/{image_name}'
    cv2.imwrite(file_path, result_image)
    upload_to_s3(file_path, folder_name='chikalab', file_name=image_name)
    cv2.imwrite(f'/tmp/{image_name}', mouth_image)
    upload_to_s3(f'/tmp/{image_name}', folder_name='chikalab', file_name=f'original/{image_name}')
    return '/' + file_path, mouth_image
