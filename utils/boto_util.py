import boto3
import os

ACCESS_KEY = os.environ.get('ACCESS_KEY')
SECRET_KEY = os.environ.get('SECRET_KEY')

REGION = os.environ.get('REGION')
BUCKET_NAME = os.environ.get('BUCKET_NAME')


def upload_to_s3(file_path, folder_name, file_name):
    client = boto3.resource('s3',
                            aws_access_key_id=ACCESS_KEY,
                            aws_secret_access_key=SECRET_KEY,
                            region_name=REGION)
    bucket = client.Bucket(name=BUCKET_NAME)
    bucket.upload_file(file_path, folder_name + '/' + file_name)
    return get_uploaded_file_uri(folder_name, file_name)


def download_from_s3(file_path, folder_name, file_name):
    client = boto3.resource('s3',
                            aws_access_key_id=ACCESS_KEY,
                            aws_secret_access_key=SECRET_KEY,
                            region_name=REGION)
    bucket = client.Bucket(name=BUCKET_NAME)
    bucket.download_file(folder_name + '/' + file_name, file_path)


def get_uploaded_file_uri(folder_name, file_name):
    s3_root = 'https://chana-s3.s3.ap-northeast-2.amazonaws.com/'
    return s3_root + folder_name + '/' + file_name
