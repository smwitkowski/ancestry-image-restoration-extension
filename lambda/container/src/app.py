import os
from pyexpat import model
import urllib.request
from pathlib import Path
from gfpgan import GFPGANer
from basicsr.utils import imwrite
import cv2
import numpy as np

FILE_PATH = Path(os.path.realpath(__file__)).parent
MODEL_DIR = FILE_PATH / 'models/'
IMAGE_DIR = FILE_PATH / 'restoration/'


MODEL_MAPPING = {
    "GPFGAN v1.3": "GFPGANv1.3.pth",
    "GPFGAN v1.2": "GFPGANCleanv1-NoCE-C2.pth",
    "GPFGAN v1": "GFPGANv1.pth"
}

def download_image():
    """
    Download the image from the url. This function takes no arguments, but 
    rather uses the environment variables to define the image URL. It also 
    returns nothing, but writes the image to the image directory.

    Args:
        None

    Returns:
        None
    """
    url = os.environ['IMAGE_URL']

    # Remove the query string from the url
    url = url.split('?')[0]

    # Create a URLopener object, add some headers, and download the image
    opener = urllib.request.URLopener()
    opener.addheader('User-Agent', 'Mozilla/5.0')

    #TODO - Add a check to make sure the image is actually downloaded
    #TODO - Title the file with the original filename from Ancestry
    opener.retrieve(url, IMAGE_DIR / 'image.jpg')


def restore_face():
    """
    This function orchestrates the GFPGANer class to restore the face(s) from the image
    and save the outputs to the image directory.

    This function takes no arguments, but rather uses the environment variables to define
    the image path, model path, and upscale factor. It also returns nothing, but writes the
    output to the image directory.

    Args:
        None
    
    Returns:
        None
    """
    model_path = str( MODEL_DIR / os.environ['MODEL_FILE'] )
    upscale_factor = int( os.environ['GFPGAN_UPSCALE'] )
    channel_multiplier = int( os.environ['GFPGAN_CHANNEL_MULTIPLIER'] )
    image_path = str( IMAGE_DIR / 'image.jpg' )

    input_image = cv2.imread(image_path, cv2.IMREAD_COLOR)

    # Create the GFPGANer object
    restorer = GFPGANer(
        model_path = model_path,
        upscale = upscale_factor,
        arch = 'clean',
        channel_multiplier = channel_multiplier
    )

    # Restore the face(s) from the image
    cropped_faces, restored_faces, restored_img = restorer.enhance(input_image)

    for i, (cropped_face, restored_face) in enumerate(zip(cropped_faces, restored_faces)):

        imwrite(cropped_face, str( IMAGE_DIR / 'cropped_faces' / f'cropped_face_{i}.jpg') )
        imwrite(restored_face, str( IMAGE_DIR / 'restored_faces' / f'restored_face_{i}.jpg') )
        comparison = np.concatenate((cropped_face, restored_face), axis=1)
        imwrite(comparison, str( IMAGE_DIR / 'comparisons' / f'face_{i}_comparison.jpg') )

    # Save the restored image to the image directory
    imwrite(restored_img, str( IMAGE_DIR / 'restored_image.jpg') )
    

def handler(event, context):

    # Define the environment variables
    os.environ['IMAGE_URL'] = event['image_url']
    os.environ['MODEL_FILE'] = MODEL_MAPPING[event['model_selection']]
    os.environ['GFPGAN_UPSCALE'] = event['upscale_factor']
    os.environ['GFPGAN_CHANNEL_MULTIPLIER'] = event['channel_multiplier']

    # Create the image directory and sub-directories where the assets will be stored
    IMAGE_DIR.mkdir(exist_ok=True)
    (IMAGE_DIR / 'cropped_faces').mkdir(exist_ok=True)
    (IMAGE_DIR / 'restored_faces').mkdir(exist_ok=True)


    # Download the image to the image directory
    download_image()

    # Restore the face(s) from the image
    restore_face()

    return "Image downloaded and restored"
