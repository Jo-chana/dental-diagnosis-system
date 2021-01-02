from flask import (
    Blueprint, flash, redirect, render_template, request, url_for
)
from .utils.image_util import get_image_from_request, get_file_path_with_result_image
from .utils.models import get_brace_predict, get_occ_predict, get_model_list
from .utils.shades import white_score

bp = Blueprint('main', __name__)
model_list = get_model_list()


@bp.route('/')
def index():
    return render_template('main/index.html', model_list=model_list)


@bp.route('/model/<string:name>', methods=['GET'])
def model(name):
    # if name == 'white':
    #     flash('조금만 기다려주세요!:)')
    #     return redirect('/')
    return render_template('main/model.html', model_name=name, model_info=model_list[name])


@bp.route('/uploadfile/<string:name>', methods=['POST'])
def upload_file(name):
    if request.method == 'POST':
        if request.files['image'].filename == '':
            flash('파일을 선택해주세요')
            return redirect(url_for('main.model', name=name))
        else:
            pass
        if name == 'occlusion':
            return result_occ(request)
        elif name == 'white':
            return result_white(request)
        return render_template('main/index.html', model_list=model_list)


def result_occ(request):
    img = get_image_from_request(request)
    file_path, img = get_file_path_with_result_image(img)
    if file_path is None:
        flash("얼굴이 아닌 사진을 올리셨나요? AI가 판단할 수 없는 사진이에요 ㅜ.ㅜ")
        return render_template('main/model.html', model_name='occlusion', model_info=model_list['occlusion'])
    brace_result = get_brace_predict(img)
    occ_result = get_occ_predict(img)
    occ_result = round(occ_result, 2)
    results = [f'교정 여부: {brace_result}', f'교정 점수: {occ_result}']
    return render_template('main/result.html', results=results, img_src=file_path)


def result_white(request):
    img = get_image_from_request(request)
    file_path, img = get_file_path_with_result_image(img)
    if file_path is None:
        flash("얼굴이 아닌 사진을 올리셨나요? AI가 판단할 수 없는 사진이에요 ㅜ.ㅜ")
        return render_template('main/model.html', model_name='white', model_info=model_list['white'])
    shade = white_score(img)
    results = [f'내 미백 등급: {shade}']
    return render_template('main/result.html', results=results, img_src=file_path, additional_image=url_for('static', filename='images/shade_chart.png'))
