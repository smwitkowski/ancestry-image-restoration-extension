import requests
from flask import Flask, request, jsonify
import replicate
import os
from google.cloud import secretmanager
import logging

logging.basicConfig(level=logging.DEBUG)

def access_secret_version(secret_id, version_id="latest"):
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/1076126751560/secrets/replicate-api/versions/1"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

app = Flask(__name__)
REPLICATE_API_TOKEN = None

# @app.before_request
# def check_origin():
#     global REPLICATE_API_TOKEN
#     # REPLICATE_API_TOKEN = access_secret_version("replicate-api")

#     # Allowed origin is the extension ID of the Chrome extension
#     # Also allow localhost for testing
#     # You can call it with curl like this:
#     # curl -X POST -H "Content-Type: application/json" -H "Origin: http://localhost:3000" -d '{"img": "https://i.imgur.com/2x2pW2A.jpg"}' http://localhost:8080/process-image
#     allowed_origin = ["chrome-extension://YOUR_EXTENSION_ID", "http://localhost:3000"]
#     if request.headers.get('Origin') != allowed_origin:
#         return "Unauthorized", 403

# To call this endpoint using curl, run:
# curl -X GET http://127.0.0.1:8080/ready
@app.route('/ready', methods=['GET'])
def health_check():
    return 'OK', 200

@app.route('/process-image', methods=['POST'])
def process_image():

    # If the API token is not set, set it
    if not os.environ.get("REPLICATE_API_TOKEN"):
        os.environ["REPLICATE_API_TOKEN"] =  access_secret_version("replicate-api")

    # Assuming the client sends an image as a multipart/form-data POST request
    img_url = request.json.get('img')
    image_filename = img_url.split("/")[-1].split(".")[0]
    if not img_url:
        return jsonify({"error": "No image provided"}), 400
    # Download the image
    try:
        response = requests.get(img_url, stream=True)
        response.raise_for_status()
        # Write the image to a local file
        local_filename = f"/tmp/{image_filename}.jpg"
        with open(local_filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192): 
                f.write(chunk)
    except requests.RequestException as e:
        return jsonify({"error": f"Failed to download image. Error: {str(e)}"}), 400

    # Now process the image using replicate API
    try:
        output = replicate.run(
            "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
            input={
                "img": open(local_filename, "rb"),
                "version": "v1.3",
                "output": f"/tmp/{image_filename}_restored.jpg"
            }
        )
        # Delete the temp image after processing
        os.remove(local_filename)
        return jsonify(output)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, port=8080, host='0.0.0.0')
