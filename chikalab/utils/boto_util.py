import boto3

ACCESS_KEY = 'AKIAY4O73RNEOBTI3YDG'
SECRET_KEY = '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'

REGION = 'ap-northeast-2'
BUCKET_NAME = 'chana-s3'


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
