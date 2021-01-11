from flask import Flask, render_template, request

from .utils.image_util import get_image_from_request, get_file_path_with_result_image
from .utils.models import get_brace_predict, get_occ_predict
from .utils.shades import white_score
import json
import os

app = Flask(__name__)


@app.route('/')
@app.route('/<path:path>')
def index(path=''):
    return render_template('base.html')


@app.route('/upload/<string:model>', methods=['POST'])
def upload(model):
    if request.method == 'POST':
        if model == 'occlusion':
            result = result_occ(request)
        elif model == 'white':
            result = result_white(request)
        else:
            return render_template('error.html')
        return json.dumps(result)


def result_occ(request):
    img = get_image_from_request(request)
    file_path, img = get_file_path_with_result_image(img)
    if file_path is None:
        return {'code': '400', 'message': '얼굴이 아닌 사진을 올리셨나요? AI가 인식할 수 없는 사진이에요 :('}
    brace_result = get_brace_predict(img)
    occ_result = get_occ_predict(img)
    occ_result = str(round(occ_result, 2))
    return {'model': 'occlusion', 'code': '200', 'isBrace': brace_result, 'score': occ_result, 'imgUrl': file_path}


def result_white(request):
    img = get_image_from_request(request)
    file_path, img = get_file_path_with_result_image(img)
    if file_path is None:
        return {'code': '400', 'message': '얼굴이 아닌 사진을 올리셨나요? AI가 인식할 수 없는 사진이에요 ㅠ.ㅠ'}
    shade = white_score(img)
    return {'model': 'white', 'code': '200', 'shade': shade, 'imgUrl': file_path}


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
