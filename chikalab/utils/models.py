import tensorflow as tf
import numpy as np
import cv2
import os
from chikalab import instance_dir
import dlib

brace_interpreter = None
occ_interpreter = None
predictor = None
detector = None
ai_dir = os.path.join(instance_dir, 'ai')


def get_brace_interpreter():
    global brace_interpreter
    if brace_interpreter is None:
        brace_interpreter = tf.lite.Interpreter(model_path=ai_dir + '/tooth_brace.tflite')
        brace_interpreter.allocate_tensors()
    return brace_interpreter


def get_occ_interpreter():
    global occ_interpreter
    if occ_interpreter is None:
        occ_interpreter = tf.lite.Interpreter(model_path=ai_dir + '/malocclusion.tflite')
        occ_interpreter.allocate_tensors()
    return occ_interpreter


def get_brace_predict(cv2_image):
    input_data = convert_cv2_to_tf_input(cv2_image)
    output_data = get_output_tensor_from_interpreter(get_brace_interpreter(), input_data)
    print(f'***Brace Output - {output_data}')
    if output_data[0][0] > output_data[0][1]:
        output_data = "False"
    else:
        output_data = "True"
    print(f'**Brace - {output_data}')
    return output_data


def get_occ_predict(cv2_image):
    input_data = convert_cv2_to_tf_input(cv2_image)
    output_data = get_output_tensor_from_interpreter(get_occ_interpreter(), input_data)[0]
    output_data = [float(x) / np.sum(output_data) for x in output_data]
    occ_weight = [40, 60, 80, 100]
    output_data = np.sum(np.multiply(output_data, occ_weight))
    print(f'**Occlusion - {output_data}')
    return output_data


def convert_cv2_to_tf_input(cv2_image):
    input_data = cv2.cvtColor(cv2_image, cv2.COLOR_BGR2RGB)
    input_data = np.array([cv2.resize(input_data, (224, 224))])
    return input_data


def get_output_tensor_from_interpreter(interpreter, input_data):
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])
    return output_data


def get_predictor():
    global predictor
    if predictor is None:
        predictor = dlib.shape_predictor(ai_dir + '/shape_predictor_68_face_landmarks.dat')
    return predictor


def get_detector():
    global detector
    if detector is None:
        detector = dlib.get_frontal_face_detector()
    return detector


def get_model_list():
    model_list = {'occlusion': '내 교정 점수 측정하기',
                  'white': '미백 점수 측정하기(준비중)'}
    return model_list
