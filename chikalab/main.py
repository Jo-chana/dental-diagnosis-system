from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from .utils.image_util import get_image_from_request, get_file_path_with_result_image
from .utils.models import get_brace_predict, get_occ_predict, get_model_list

bp = Blueprint('main', __name__)
model_list = get_model_list()


@bp.route('/')
def index():
    return render_template('main/index.html', model_list=model_list)


@bp.route('/model/<string:name>', methods=['GET'])
def model(name):
    if name == 'white':
        flash('조금만 기다려주세요!:)')
        return redirect('/')
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
            img = get_image_from_request(request)
            file_path, img = get_file_path_with_result_image(img)
            if file_path is None:
                flash("얼굴 사진을 보내주세요")
                return render_template('main/model.html', model_name=name, model_info=model_list[name])
            brace_result = get_brace_predict(img)
            occ_result = get_occ_predict(img)
            occ_result = round(occ_result, 2)
            results = [f'교정 여부: {brace_result}', f'교정 점수: {occ_result}']
            return render_template('main/result.html', results=results, img_src=file_path)
        return render_template('main/index.html', model_list=model_list)
